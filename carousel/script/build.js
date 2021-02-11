const { exec } = require("child_process")
const path     = require("path")
const fs       = require("fs")
const stream   = require("stream")
const readline = require("readline")


// =================================================================
// Compiling/Copying:

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


// =================================================================
// package.json:

const PACKAGE_JSON_STATE_COPYING = 0
const PACKAGE_JSON_STATE_LAST_BLOCK = 1
const PACKAGE_JSON_STATE_DONE = 2


function writePackageJson(destDir) {
  createDirectory(destDir)
  let destFile = path.join(destDir, "package.json")
  fs.writeFileSync(destFile, "")  // Create the file.

  let writeStream = fs.createWriteStream(destFile)
  let readInterface = readline.createInterface({
    input: fs.createReadStream("package.json")
  })

  let state = PACKAGE_JSON_STATE_COPYING
  readInterface.on("line", (line) => {
    state = writePackageJsonLine(
      line,
      readInterface,
      writeStream,
      state
    )
  })
}

function writePackageJsonLine(
  line, readInterface, writeStream, state ) {

  if(state === PACKAGE_JSON_STATE_DONE) {
    return PACKAGE_JSON_STATE_DONE
  }

  if(state === PACKAGE_JSON_STATE_LAST_BLOCK &&
     line.includes("}") ) {

    // Last block is finishing:
    writeStream.write(" } }")
    readInterface.close()

    return PACKAGE_JSON_STATE_DONE
  }

  if(line.includes("\"dependencies\":")) {
    // Dependencies block is the last block.
    state = PACKAGE_JSON_STATE_LAST_BLOCK
  }

  writeStream.write(line)
  return state
}


// =================================================================
// Entry point:

compileOrCopySources("src", "./", "build")
writePackageJson("build")
