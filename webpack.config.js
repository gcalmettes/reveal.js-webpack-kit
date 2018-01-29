const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const gchelpers =  require('./src/scripts/helpers.js')

/* ENVIRONMENT CONFIG */
const configEnv = {
  HIGHLIGHT_LANGUAGES: ['xml', 'javascript', 'python', 'bash'],
  DEV: (process.env.NODE_ENV === "dev-server") ? true : false,
  PRODUCTION: (process.env.NODE_ENV === "production") ? true : false,
  FOR_WEB: (process.env.NODE_ENV === "production-web") ? true : false,
  SERVER_RENDERING: (process.env.NODE_ENV === "production-server-rendering") ? true : false,
  UGLIFY: (process.env.NODE_ENV === "production-web") ? false : true,
  BUNDLE_ANALYSIS: false,
  MESSAGES_HASH: {
    "production": `Production!!!!! Minification: ${(process.env.NODE_ENV === "production-web") ? false : true}.`,
    "production-web": `Production FOR WEB!!!!! Linking FA and Mathjax to web ressources. Minification: ${(process.env.NODE_ENV === "production-web") ? false : true}.`,
    "production-server-rendering": `Production SERVER RENDERING!!!!! FA and MJ will be pre-rendered on server side. Minification: ${(process.env.NODE_ENV === "production-web") ? false : true}.`,
  }
}

console.log(configEnv.MESSAGES_HASH[process.env.NODE_ENV])


/* WEBPACK CONFIG ITSELF */
const config = {
  context: path.join(__dirname, 'src'),
  entry: {
    app: './scripts/main.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'lib/js/presentation.bundle.js'
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
              outputPath: 'lib/fonts/',
              publicPath: '../' // bundle.css will be in lib/css, need to go back up in the hierarchy
            }
          }
        ]
      },
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "build/"),
    port: 9000
  },
  plugins: [
    /* HtmlWebpackPlugin instances (one per html files found in './src/') */
    ...gchelpers.getAllHTMLPlugins(
      gchelpers.getEntries('./src/')
    ),
    /* Those library will be directly available on the global scope
      (JQuery needed for custom animations to work in Reveal (reveal-animate-css.js)) */
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Reveal: 'reveal.js'
    }),
    /* Copy some needed files in hierarchy */
    new CopyWebpackPlugin([
      // speaker note base window
      { from: '../node_modules/reveal.js/plugin/notes/notes.html', to: 'lib/js/reveal.js-dependencies/notes.html' },
      // styles for slides export to to pdf
      { from: { glob: '../node_modules/reveal.js/css/print/*.css' }, to: 'lib/css/[name].css' },
      // modified styles for menu.js plugin (compatible with inline svg)
      { from: 'styles/menu-inline-svg.css', to: 'lib/css/menu.css' },
      // any files in content
      { context: 'content',
        from: '**/*',
        to: 'content/'
      }
    ]),
    /* Generate styles file from (scss + css) */
    new ExtractTextPlugin(
      {filename:'lib/css/presentation.bundle.css'}
    ),
    /* Define global variables to be accessed during webpack processing */
    new webpack.DefinePlugin({
      HIGHLIGHT_LANGUAGES: configEnv.HIGHLIGHT_LANGUAGES,
      PRODUCTION: configEnv.PRODUCTION,
      FOR_WEB: configEnv.FOR_WEB,
      SERVER_RENDERING: configEnv.SERVER_RENDERING
    }),
    /* Include only Highlights.js languages that are specified in configEnvs.HIGHLIGHT_LANGUAGES */
    new webpack.ContextReplacementPlugin(
      /highlight\.js\/lib\/languages$/,
      new RegExp(`^./(${configEnv.HIGHLIGHT_LANGUAGES.join('|')})$`),
    ),
    /* Minifying bundle */
    (configEnv.UGLIFY) ? 
      new UglifyJsPlugin({
          uglifyOptions: {
            ie8: false,
            output: {
              comments: false,
              beautify: false,
            }
          }
        }) : gchelpers.DummyPlugin(),
    /* If Bundle Analysis set to true in configEnv */
    (configEnv.BUNDLE_ANALYSIS && !configEnv.DEV_SERVER) ?
      new BundleAnalyzerPlugin() : gchelpers.DummyPlugin()
  ],
};

module.exports = config;
