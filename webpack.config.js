const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs')

////////////////////////
// Helper functions
////////////////////////

// get all the html templates (all the lectures)
function getEntries (path) {
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

// generate a HTMLPlugin instance per html file
function getAllHTMLPlugins (htmlFiles) {
  return Object.entries(htmlFiles).map(([key, value]) => {
    return new HtmlWebpackPlugin({
            title: key,
            template: './' + value,
            filename: './' + value
        })
  })
}

//////////////////////////
// PLUGINS ARRAY to be fed into webpack
/////////////////////////

// 1- Add of all the HTMLplugin instances
let pluginsArray = getAllHTMLPlugins(getEntries('./src/'))

// 2- Add specific module replacement instance to fix wrong url
// as .css file imports will compile to CSS @import rules, the following is necessary
// since the url in white.scss will be wrong
pluginsArray.push(
  new webpack.NormalModuleReplacementPlugin(
    new RegExp('../../lib/font/source-sans-pro/source-sans-pro.css'),
    'reveal.js/lib/font/source-sans-pro/source-sans-pro.css')
  )

// 3- Copy needed files in hierarchy
const nodePath = '../node_modules/';
pluginsArray.push(
  new CopyWebpackPlugin([
    // Reveal.js dependencies and css print
    { from: nodePath + 'reveal.js/lib/js/classList.js', to: 'js/reveal.js-dependencies/classList.js' },
    // { from: nodePath + 'reveal.js/plugin/highlight/highlight.js', to: 'js/reveal.js-dependencies/highlight.js' },
    { context: nodePath + 'reveal.js/plugin/notes',
      from: '**/*',
      to: 'js/reveal.js-dependencies/'
    },
    { from: { glob: nodePath + 'reveal.js/css/print/*.css' }, to: 'css/[name].css' },
    // reveal.js-menu
    { from: { glob: nodePath + 'reveal.js-menu/menu.*' }, to: 'js/reveal.js-dependencies/menu.[ext]' },
    // reveald3
    { from: nodePath + 'reveald3/reveald3.js', to: 'js/reveal.js-dependencies/reveald3.js' },
    // external.js
    { from: nodePath + 'reveal_external/external/external.js', to: 'js/reveal.js-dependencies/external.js' },
    // // mathjax
    // { from: nodePath + 'mathjax/MathJax.js', to: 'js/reveal.js-dependencies/MathJax.js' },
    // { from: nodePath + 'mathjax/config/TeX-AMS_HTML-full.js', to: 'js/reveal.js-dependencies/config/TeX-AMS_HTML-full.js' },
    // {
    //   context: nodePath + 'mathjax/extensions',
    //   from: '**/*',
    //   to: 'js/reveal.js-dependencies/extensions'
    // },
    // any files in content
    { context: 'content',
      from: '**/*',
      to: 'content/'
    },

  ])
)

// 4- Extract styles (scss + css) in specific css file
pluginsArray.push(
  new ExtractTextPlugin({filename:'css/presentation.bundle.css'}),
)

//////////////////////////
// WEBPACK CONFIG ITSELF
/////////////////////////
module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    app: './scripts/main.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'js/presentation.bundle.js'
  },
  externals: {
    'reveal': {root: 'Reveal'}
  },
  module: {
    rules:[
      { test:/\.(s*)css$/,
        use: ExtractTextPlugin.extract({
              fallback:'style-loader',
              use:['css-loader', 'sass-loader']
        })
      },
      { test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          { loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: '../' // bundle.css will be in css, need to go back up in the hierarchy
            }
          }
        ]
      }
    ]
  },
  // watch:true,
  devServer: {
    contentBase: path.join(__dirname, "build/"),
    port: 9000
  },
  plugins: pluginsArray
};
