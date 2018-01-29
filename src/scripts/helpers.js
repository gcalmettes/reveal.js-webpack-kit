const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')


// List all the html files to use as entries
exports.getEntries = function(path) {
  return fs.readdirSync(path)
    .filter(file => file.match(/.*\.html$/))
    .map(file => {
      return {
        name: file.substring(0, file.length - 5),
        path: file
      }
    }).reduce((memo, file) => {
      memo[file.name] = file.path
      return memo
    }, {})
}

// Generate a HtmlWebpackPlugin instance for each url in a list
exports.getAllHTMLPlugins = function (htmlFiles) {
  return Object.entries(htmlFiles).map(([key, value]) => {
    return new HtmlWebpackPlugin({
            title: key,
            template: './' + value,
            filename: './' + value
        })
  })
}

// Return a new instance of a Dummy plugin to use in conditional plugin syntax
exports.DummyPlugin = function () {
  function doNothing(options){/*do nothing */}
  doNothing.prototype.apply = () => {/*do nothing */}
  return new doNothing
}
