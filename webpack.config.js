const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs')
// const GoogleFontsPlugin = require('google-fonts-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// const delay = (duration) =>
//   new Promise(resolve => setTimeout(resolve, duration));


async function getConfig() {


  // Configurable options for the build
  const userConfig = {

    /* Languages to be supported by syntax highlighting in Reveal 
     (the more fonts, the heavier the bundle will be) */
    HIGHLIGHT_LANGUAGES: ['xml', 'javascript', 'python', 'bash'],
    FONT_AWESOME_BACKEND: 'css', // 'css' or 'svg'
  
  }
  
  
  // const FONTS_DONWLOAD = await fs.exists('./dist/lib/css/fonts-all.css', exists => exists)
  const FONTS_DONWLOAD = await isEnv('dev-server') ? false : isEnv('production-web') ? false : fs.existsSync('./dist/lib/css/fonts-all.css') ? false : true


  // const env = process.env.NODE_ENV
  // const mode = process.env.WEBPACK_MODE
  // await delay(5000);
  // console.log(__dirname)
  // console.log(env, mode, devMode)
  console.log('font download:', FONTS_DONWLOAD)




  return {
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
        },
        { test: /(eot|woff|woff2|ttf|svg)(\?\S*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fontawesome-fonts.[ext]',
              // publicPath: './../../',
              publicPath: '../webfonts/',
              outputPath: 'lib/webfonts/',
              emitFile: true
            }  
          }
        ]
      },
      ]
    },

    resolve: {
      alias: {
        nodePath: path.join(__dirname, 'node_modules'),
        stylesPath: path.join(__dirname, 'src/_styles'),
      }
    },

    devServer: {
      contentBase: path.join(__dirname, "dist/"),
      port: 9000
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
        { context: 'src/content',
          from: '**/*',
          to: 'content/'
        }
      ]),

      new CopyWebpackPlugin([
        // Style from reveal.js-menu, css (not compatible with svg inline)
        { from: 'node_modules/reveal.js-menu/menu.css', to: 'lib/css/menu.css' },
      ]),

      new webpack.DefinePlugin({
        HIGHLIGHT_LANGUAGES: JSON.stringify(Object.assign({}, userConfig.HIGHLIGHT_LANGUAGES)),
        FA_CSS: userConfig.FONT_AWESOME_BACKEND == 'css',
        FA_SVG: userConfig.FONT_AWESOME_BACKEND == 'svg',
      }),

      /* Include only Highlights.js languages that are specified in configEnv.HIGHLIGHT_LANGUAGES */
      new webpack.ContextReplacementPlugin(
        /highlight\.js\/lib\/languages$/,
        new RegExp(`^./(${userConfig.HIGHLIGHT_LANGUAGES.join('|')})$`),
      ),

      new MiniCssExtractPlugin({
        filename: 'lib/css/[name].css',
        // chunkFilename: "lib/css/[name].css"
      }),

      // new BundleAnalyzerPlugin()
    ]
  };

}


const isEnv = (name) => process.env.NODE_ENV === name


module.exports = getConfig();

