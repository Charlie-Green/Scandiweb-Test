const { exec } = require("child_process")
const path = require("path")
const fs = require("fs")


function compileOrCopySources(sourceDir, node, targetDir) {
  let sourceNode = path.join(sourceDir, node)
  let targetNode = path.join(targetDir, node)
  if(!isDirectory(sourceNode)) {
    return compileOrCopySource(sourceNode, targetNode)
  }

  fs.readdir(sourceNode, (err, files) => {
    if(err) {
      return console.log("Failed to get files in " + sourceDir)
    }

    createDirectory(targetNode)
    files.forEach((file) => {
      compileOrCopySources(sourceNode, file, targetNode)
    })
  })
}

function compileOrCopySource(sourcePath, targetPath) {
  if(sourcePath.endsWith(".jsx")) {
    // This is a React file. Compile it using Babel.
    execute("babel " + sourcePath + " -o " + targetPath)
  } else {
    // Just copy this file.
    fs.copyFile(sourcePath, targetPath, 0, () => {   })
  }
}

function createDirectory(path) {
  fs.mkdir(path, () => {  })
}

function isDirectory(path) {
  return fs.lstatSync(path).isDirectory()
}

function execute(command) {
  exec(command, (err) => {
    if(err) {
      console.log("Error: " + err)
    }
  })
}


compileOrCopySources("src", "./", "build")
execute("webpack serve --host 0.0.0.0 > webpack.log")
