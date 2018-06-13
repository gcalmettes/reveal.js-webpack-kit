const fs = require('mz/fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const mkdirp = require('mkdirp');

const FAtools = require('./fontAwesomeIcons.js')
 
// var getDirName = require('path').dirname;

const writeFileSync = (filePath, contents) => {
  mkdirp(path.dirname(filePath), function (err) {
    if (err) return err;
    fs.writeFileSync(filePath, contents);
  });
}


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


// Get all files imported with data_external plugin
const getExternalFilesInFile = function (file) {
  const regex = /data-external(?:-replace)?[\s+]?=[\s+]?"(.*)"|data-external(?:-replace)?[\s+]?=[\s+]?'(.*)'/g
  const data = fs.readFileSync(file, 'utf8')
  const allExternalFiles = []
  // let regex = new RegExp(`${attr}[\s+]?=[\s+]?${quote}([^=]*fa[s|b|r][^=]*fa-[a-z0-9\-]+|fa-[a-z0-9\-]+[^=]*fa[s|b|r][^=]*)${quote}`, 'g')
  let matchArray
  while (matchArray = regex.exec(data)) {
    allExternalFiles.push(matchArray[1])
  }

  return allExternalFiles
}


exports.getEntriesAndHTMLPlugins = function (htmlFiles, includeFAicons = false) {
  let htmlPluginList = []
  let entries = {'app': './src/_scripts/index.js'}

  if (includeFAicons) {
    /* If SVG framework, create Entry and HtmlPlugin configs */
    Object.entries(htmlFiles).forEach(([name, path]) => {
      
      /* Generate the necessary imports with only the FA icons used in file */
      const iconsInMenuPlugin = FAtools.getIconsInFile(__dirname + '/../../../node_modules/reveal.js-menu/menu.js', htmlFile=false)
      const iconsInFile = FAtools.getIconsInFile(__dirname + `/../../${path}`)
      let externalFilesIcons = getExternalFilesInFile(__dirname + `/../../${path}`)
        .map(file => FAtools.getIconsInFile(__dirname + `/../../${file}`))
      externalFilesIcons = externalFilesIcons.length>0 ? externalFilesIcons.reduce((acc, val) => [...acc, ...val]) : []

      const importsText = FAtools.generateFontAwesomeImportsText([...iconsInMenuPlugin, ...iconsInFile, ...externalFilesIcons])
      const faFileName = `fa-${name.replace(/\s/g, '')}`
      const jsFilePath = `./src/_scripts/_generatedEntries/${faFileName}.js`
      writeFileSync(`./${jsFilePath}`, importsText)

      entries[faFileName] = jsFilePath
  
      htmlPluginList.push(
        new HtmlWebpackPlugin({
          title: name,
          template: `./src/${path}`,
          filename: `./${path}`,
          chunks: [faFileName, 'app'],
          chunksSortMode:  'manual',
        })
      ) 
    })

  } else {
    Object.entries(htmlFiles).forEach(([name, path]) => {
      htmlPluginList.push( 
        new HtmlWebpackPlugin({
          title: name,
          template: `./src/${path}`,
          filename: `./${path}`,
          chunks: ['app'],
        })
      )
    })
  }

  return [entries, htmlPluginList]
}


// Return a new instance of a Dummy plugin to use in conditional plugin syntax
exports.DummyPlugin = function () {
  function doNothing(options){/*do nothing */}
  doNothing.prototype.apply = () => {/*do nothing */}
  return new doNothing
}




