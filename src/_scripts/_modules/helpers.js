const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const mkdirp = require('mkdirp');
// var getDirName = require('path').dirname;

const writeFileSync = (filePath, contents) => {
  mkdirp(path.dirname(filePath), function (err) {
    if (err) return err;
    fs.writeFileSync(filePath, contents);
  });
}


/* EXTRACT FONT AWESOME ICONS USED IN FILE */

const getIconIDs = (input, regex, category) => {
  const groups = {}

  let matchArray;
  while (matchArray = regex.exec(input)) {
    groups[`fa-${matchArray[2]}`] = {iconFileName: matchArray[1], iconCategory: category}
  }
  return groups
}

const getAllIconsInFASourceFile = (file, category) => {
  const fileData = fs.readFileSync(file, 'utf8').toString()
  const regex = /var (fa[a-zA-Z0-9\-]+) = { prefix: '[a-z]+', iconName: '([a-zA-Z0-9\-]+)',/g
  
  return getIconIDs(fileData, regex, category)
}

function mergeObjects(...args) {
  return Object.assign({}, ...args);
}

const getAllFontAwesomeIconNames = (categories) => {
  return mergeObjects(...categories.map(category => getAllIconsInFASourceFile(__dirname + `/../../../node_modules/@fortawesome/fontawesome-free-${category}/shakable.es.js`, category)))
}

const getAllIconsInHtmlFile = (filePath, iconList = getAllFontAwesomeIconNames(['regular', 'brands', 'solid'])) => {
  const regex = /(fa\-[a-z0-9\-]+)/g;
  let fileData = fs.readFileSync(path.join(__dirname, `/../../${filePath}`), 'utf8').toString()
  const iconsInFile = fileData.match(regex)
  return (iconsInFile) ? [...new Set(iconsInFile.map(icon => iconList[icon]).filter(icon => icon))] : []
}


exports.getFontAwesomeIconsUsed = function (htmlFiles, iconList = getAllFontAwesomeIconNames(['brands', 'solid', 'regular'])) {
  const regex = /(fa\-[a-z0-9\-]+)/g;
  
  const allIconsUsed = Object.keys(htmlFiles).map(name => {
    let fileData = fs.readFileSync(path.join(__dirname, `/../../${htmlFiles[name]}`), 'utf8').toString()
    return {file: `${name}`, icons: [...new Set(fileData.match(regex).map(icon => faIcons[icon]).filter(icon => icon))]}
  })
  
  return allIconsUsed
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


const generateFontAwesomeImportsText = (icons) => {
  let iconsImportsText = "import fontawesome from 'nodePath/@fortawesome/fontawesome'"

  // const groupedIcons = icons.reduce(d => , {})
  const categories = [... new Set(icons.map(d => d.iconCategory))]
  const groupedIcons = categories.map(category => {
    return {'category': category, 
            'icons': icons.filter(icon => icon.iconCategory==category).map(ic => ic.iconFileName)}
    })
  groupedIcons.forEach(d => {
    let categoryImport = `import {${`${[...d.icons]}`}} from 'nodePath/@fortawesome/fontawesome-free-${d.category}/shakable.es.js'`
    iconsImportsText += `\n${categoryImport}`
  })

  iconsImportsText += `\nfontawesome.library.add(${[...icons.map(icon => icon.iconFileName)]})`
  iconsImportsText += "\nfontawesome.config['searchPseudoElements'] = true"
  
  return iconsImportsText
}


exports.getEntriesAndHTMLPlugins = function (htmlFiles, includeFAicons = false) {
  let htmlPluginList = []
  let entries = {'app': './_scripts/main.js'}

  if (includeFAicons) {
    /* If SVG framework, create Entry and HtmlPlugin configs */
    Object.entries(htmlFiles).forEach(([name, path]) => {
      
      /* Generate the necessary imports with only the FA icons used in file */
      const iconsInMenuPlugin = getAllIconsInHtmlFile('../node_modules/reveal.js-menu/menu.js')
      const iconsInFile = getAllIconsInHtmlFile(path)
      const importsText = generateFontAwesomeImportsText([...iconsInMenuPlugin, ...iconsInFile])
      const faFileName = `fa-${name.replace(/\s/g, '')}`
      const jsFilePath = `./_scripts/_generatedEntries/${faFileName}.js`
      writeFileSync(`./src/${jsFilePath}`, importsText)

      entries[faFileName] = jsFilePath
  
      htmlPluginList.push(
        new HtmlWebpackPlugin({
          title: name,
          template: `./${path}`,
          filename: `./${path}`,
          chunks: [faFileName, 'app'],
          chunksSortMode:  'manual',
        })
      ) 
    })

  } else {
    Object.entries(htmlFiles).forEach(([key, value]) => {
      htmlPluginList.push( 
        new HtmlWebpackPlugin({
          title: key,
          template: './' + value,
          filename: './' + value,
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


/* FONT AWESOME utilities functions */
// function concat(...args) {
//   return args.reduce((acc, val) => [...acc, ...val]);
// }





// const htmlFiles = getEntries('./src/')
// const iconsInFiles = getFontAwesomeIconsUsed(htmlFiles)




