const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")


module.exports = {
  entry: {
    index: path.resolve(__dirname, "build/index", "index.jsx")
  },

  output: {
    path: path.resolve(__dirname, "pack")
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "build/index", "index.html")
    })
  ],

  module: {
    rules: [
      // CSS:
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader"
        ]
      },

      // Images (raster):
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },

      // Images (SVG):
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      }
    ]
  }
}
