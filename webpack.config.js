const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const devMode = process.env.NODE_ENV !== 'production'

const config = {
  /* Languages to be supported by syntax highlighting in Reveal 
     (the more fonts, the heavier the bundle will be) */
  HIGHLIGHT_LANGUAGES: ['xml', 'javascript', 'python', 'bash'],
}


module.exports = {
  // context: path.join(__dirname, 'src'),
  entry: { main: './src/_scripts/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib/js/[name].js'
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false,
            beautify: false,
          }
        },
        sourceMap: false
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },



  
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       styles: {
  //         name: 'styles',
  //         test: /\.css$/,
  //         chunks: 'all',
  //         enforce: true
  //       }
  //     }
  //   }
  // },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            // options: {
            //   modules: true,
            //   sourceMap: true,
            //   importLoader: 2
            // }
          },
          'sass-loader',
        ],
      }
    ]
  },

  resolve: {
    alias: {
      nodePath: path.join(__dirname, 'node_modules'),
      stylesPath: path.join(__dirname, 'src/_styles'),
    }
  },

  plugins: [ 
    new HtmlWebpackPlugin({
      inject: true,
      hash: false,
      template: './src/index.html',
      filename: 'index.html'
    }),
    // new HtmlWebpackIncludeAssetsPlugin({ 
    //   assets: ['lib/css/[name].css'], append: true 
    // }),

    new webpack.ProvidePlugin({
      Reveal: 'reveal.js',
      // $: 'jquery',
      // jQuery: 'jquery',
    }),

    /* Copy some needed files in hierarchy */
    new CopyWebpackPlugin([
      // speaker note base window
      { from: 'node_modules/reveal.js/plugin/notes/notes.html', to: 'lib/js/reveal.js-dependencies/notes.html' },
      // styles for slides export to to pdf
      { from: { glob: 'node_modules/reveal.js/css/print/*.css' }, to: 'lib/css/[name].css' },
      // modified styles for menu.js plugin (compatible with inline svg)
      // { from: (configEnv.FOR_WEB || (configEnv.FONTAWESOME_ENGINE=='css') ? '../node_modules/reveal.js-menu/menu.css' : '_styles/menu-inline-svg.css', to: 'lib/css/menu.css' },
      // any files in content
      { context: 'content',
        from: '**/*',
        to: 'content/'
      }
    ]),

    new CopyWebpackPlugin([
      // Style from reveal.js-menu, css (not compatible with svg inline)
      { from: 'node_modules/reveal.js-menu/menu.css', to: 'lib/css/menu.css' },
    ]),

    new webpack.DefinePlugin({
      HIGHLIGHT_LANGUAGES: JSON.stringify(Object.assign({}, config.HIGHLIGHT_LANGUAGES)),
    }),

    /* Include only Highlights.js languages that are specified in configEnv.HIGHLIGHT_LANGUAGES */
    new webpack.ContextReplacementPlugin(
      /highlight\.js\/lib\/languages$/,
      new RegExp(`^./(${config.HIGHLIGHT_LANGUAGES.join('|')})$`),
    ),

    new MiniCssExtractPlugin({
      filename: 'lib/css/[name].css',
      // chunkFilename: "lib/css/[name].css"
    }),

    new BundleAnalyzerPlugin()
  ]
};