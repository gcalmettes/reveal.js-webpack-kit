const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const fs = require('fs')
const exec = require('child_process').exec;
const GoogleFontsPlugin = require('google-fonts-plugin')
const MathJax = require('mathjax-full/components/webpack.common.js');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const gchelpers =  require('./src/_scripts/_modules/helpers.js')

async function getConfig() {

  // Configurable options for the build
  const userConfig = {

    /* Languages to be supported by syntax highlighting in Reveal 
     (the more fonts, the heavier the bundle will be) */
    HIGHLIGHT_LANGUAGES: ['xml', 'javascript', 'python', 'bash'],

    /* Fonts and formats to be included in build. Could be several from ['ttf', 'eot', 'woff', 'woff2']*/
    GOOGLE_FONTS: [	{"family": "Source Sans Pro"},
            		    {"family": "Passion One"}],
    GOOGLE_FONTS_FORMATS: ['ttf'],
    
    /* FONT AWESOME. CSS or SVG backend. If CSS chosen, then either link to the CDN
    or link to local .css file (automatically downloaded)*/
    FONTAWESOME_BACKEND: process.env.FONT_AWESOME, // 'css' or 'svg'
    FONTAWESOME_CDN: "https://use.fontawesome.com/releases/v5.2.0/css/all.css",
    FONTAWESOME_USE_LOCAL: true
  
  }
  
  // Check if all the font formats already present in dist folder.
  const FONTS_DONWLOAD = userConfig.GOOGLE_FONTS_FORMATS.map(format => fs.existsSync(`./dist/lib/css/${format}.css`))
    .reduce((acc, bool) => acc && bool, true) ? false : true

  const htmlList = await gchelpers.getEntries('./src/')
  const [entries, htmlPluginList] = gchelpers.getEntriesAndHTMLPlugins(htmlList, userConfig.FONTAWESOME_BACKEND=='svg')
  
  console.log('Google fonts download:', FONTS_DONWLOAD)
  console.log('FontAwesome framework:', userConfig.FONTAWESOME_BACKEND)


  return {
    entry: entries,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'lib/js/[name].js'
    },

    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              // // see https://github.com/FortAwesome/Font-Awesome/
              // // and https://github.com/fabiosantoscode/terser/issues/50
              // collapse_vars: true,
            },
            output: null,
          },
          sourceMap: false
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
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
              name: '[name].[ext]',
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
      ...htmlPluginList,


      new webpack.ProvidePlugin({
        Reveal: 'reveal.js',
      }),

      /* Copy some needed files in hierarchy */
      new CopyWebpackPlugin({
        patterns: [
          // speaker note base window
          { from: 'node_modules/reveal.js/plugin/notes/notes.html', to: 'lib/js/reveal.js-dependencies/notes.html' },
          // styles for slides export to to pdf
          { from: 'node_modules/reveal.js/css/print/*.css', to: 'lib/css/[name].css' },
          // Mathjax fonts
          { from: 'node_modules/mathjax-full/es5/output', to: 'lib/mathjax' },
          // Mathjax tex component
          { from: 'src/_scripts/reveal-plugins/tex-components/*.min.js', to: 'lib/mathjax/tex-components/[name].js' },
          // any files in content
          { context: 'src/content',
            from: '**/*',
            to: 'content/'
          }
        ]
      }),

      new CopyWebpackPlugin({
        patterns: [
          // Style from reveal.js-menu, css (not compatible with svg inline)
          { from: 'node_modules/reveal.js-menu/menu.css', to: 'lib/css/menu.css' },
        ]
      }),

      new webpack.DefinePlugin({
        HIGHLIGHT_LANGUAGES: JSON.stringify(Object.assign({}, userConfig.HIGHLIGHT_LANGUAGES)),
        FA_CSS_LOCAL: userConfig.FONTAWESOME_BACKEND == 'css' && userConfig.FONTAWESOME_USE_LOCAL && !isEnv('production-web-css'),
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

      /* !!!! FONTS AWESOME !!!!
       If (FONTAWESOME_BACKEND=='css' && FONTAWESOME_USE_LOCAL==false) just link
       to the FA CDN */
      (isEnv('production-web-css') || (userConfig.FONTAWESOME_BACKEND=='css' && !userConfig.FONTAWESOME_USE_LOCAL))
        && new HtmlWebpackTagsPlugin({
            assets: [userConfig.FONTAWESOME_CDN],
            append: true 
        }),

      /* If font formats missing, then download them */
      (FONTS_DONWLOAD) 
        && new GoogleFontsPlugin({
          "fonts": userConfig.GOOGLE_FONTS,
          "formats": userConfig.GOOGLE_FONTS_FORMATS,
          "filename": `lib/css/[name].css`,
        }),
      
      /* Include fonts */
      new HtmlWebpackTagsPlugin({
          tags: userConfig.GOOGLE_FONTS_FORMATS.map(format => `lib/css/${format}.css`),
          append: true 
    	}),

      // clean up generatedEntries folder of file-specific tree shaking for FA icons
      // only when not in dev-server
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
            if (process.env.NODE_ENV != 'dev-server') {
              exec('rm -R ./src/_scripts/_generatedEntries', (err, stdout, stderr) => {
                if (stdout) process.stdout.write(stdout);
                if (stderr) process.stderr.write(stderr);
              });
            }
          });
        }
      },
    ].filter((plugin) => plugin !== false) // filter out skipped conditions
  };

}

const isEnv = (name) => process.env.NODE_ENV === name

module.exports = getConfig();
