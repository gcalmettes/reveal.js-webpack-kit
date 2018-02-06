/* Variables */

const ATTRIBUTES_WATCHED_FOR_MUTATION = [
  'class', 'data-prefix', 'data-icon', 
  'data-fa-transform', 'data-fa-mask'
];

const range = (start, end) => (
  Array.from(Array(end - start + 1).keys()).map(i => i + start)
);

const RESERVED_CLASSES = [
    'xs', 'sm', 'lg', 'fw', 'ul', 'li', 'border', 'pull-left', 'pull-right', 'spin', 
    'pulse', 'rotate-90', 'rotate-180', 'rotate-270', 'flip-horizontal', 'flip-vertical', 
    'stack', 'stack-1x', 'stack-2x', 'inverse', 'layers', 'layers-text', 'layers-counter'
  ].concat(range(1, 10).map(function (n) {
    return n + 'x';
  })).concat(range(1, 20).map(function (n) {
    return 'w-' + n;
}));

const iconStyles = {
  'fas': 'solid',
  'far': 'regular',
  'fab': 'brands'
}


/* Functions */

const fs = require('fs')

//////////////////////////////////
// Scan the FAmsource code for icons list
//////////////////////////////////

const getIconsInfoForCategory = (sourceFile, category, regex = /var (fa[a-zA-Z0-9\-]+) = { prefix: '[a-z]+', iconName: '([a-zA-Z0-9\-]+)',/g) => {
  let categoryIcons = []

  let matchArray;
  while (matchArray = regex.exec(sourceFile)) {
    categoryIcons.push({iconName: matchArray[2], iconFileName: matchArray[1], iconCategory: category})
  }
  return categoryIcons
}

const getAllIconsInCategorySourceFile = (file, category) => {
  const fileData = fs.readFileSync(file, 'utf8').toString()
  return getIconsInfoForCategory(fileData, category)
}

const getAllFontAwesomeIconNames = (categories) => {
  const allIcons = categories
    .map(category => getAllIconsInCategorySourceFile(__dirname + `/../../../node_modules/@fortawesome/fontawesome-free-${category}/shakable.es.js`, category))
    .reduce((a, b) => [...a, ...b])

  let faIconsPerCategory = {}
  categories.forEach(category => {
    let categoryIcons = {}
    allIcons
      .filter(icon => icon.iconCategory == category)
      .forEach(icon => categoryIcons[icon.iconName] = icon)
    faIconsPerCategory[category] = categoryIcons
  })

  return faIconsPerCategory
}

///////////////////////////////
// Scan a file
//////////////////////////////



const isReserved = (name, reservedList = RESERVED_CLASSES) => {
  return ~reservedList.indexOf(name);
}

const getIconName = (cls, familyPrefix = 'fa') => {
  const parts = cls.split('-');
  const prefix = parts[0];
  const iconName = parts.slice(1).join('-');
  return (prefix==familyPrefix && iconName !== '' && !isReserved(iconName)) ? iconName : null
}

const emptyCanonicalIcon = () => {
  return { prefix: null, iconName: null, iconFileName: null, iconCategory: null, rest: [] };
};

const getCanonicalIcon = (values, styles = iconStyles, defaultPrefix = "fas") => {
  const allFAicons = getAllFontAwesomeIconNames(Object.values(iconStyles))
  return values.reduce((acc, cls) => {
    const iconName = getIconName(cls, 'fa');

    if (styles[cls]) {
      acc.prefix = cls;
      acc.iconCategory = iconStyles[cls];
    } else if (iconName) {
      acc.iconName = iconName;
      acc.prefix = acc.prefix || defaultPrefix;
      acc.iconCategory = acc.iconCategory || iconStyles[defaultPrefix];
    } else if (cls !== 'svg-inline--fa' && cls.indexOf('fa-w-') !== 0) {
      acc.rest.push(cls);
    }
    acc.iconFileName = acc.iconName ? allFAicons[acc.iconCategory][acc.iconName].iconFileName : acc.iconFileName
    return acc;
  }, emptyCanonicalIcon());
}

exports.getIconsInFile = function(file, htmlFile = true, tags = ATTRIBUTES_WATCHED_FOR_MUTATION) {
  const data = fs.readFileSync(file, 'utf8')
  let allClasses = []

  if (htmlFile) {
    /* Match anything that is between the quotes of the specified tags 
       (e.g.: class="will be matched") */
    tags.forEach(attr => {
      [`'`, `"`].forEach(quote => {
        let regex = new RegExp(`${attr}[\s+]?=[\s+]?${quote}([^=]*fa[s|b|r][^=]*fa-[a-z0-9\-]+[^=]*|[^=]*fa-[a-z0-9\-]+[^=]*fa[s|b|r][^=]*)${quote}`, 'g')
        let matchArray
        while (matchArray = regex.exec(data)) {
          allClasses.push(matchArray[1])
        }

      })
    })
    allClasses = allClasses.map(d => d.split(' '))
  } else {
    /* if not in HTML file, then try to find anything mathching fa-something */
    const regex = /(fa\-[a-z0-9\-]+)/g;
    data.match(regex).forEach(
      faElement => allClasses.push([faElement])
    )
  }
  return allClasses
          .map(d => getCanonicalIcon(d))
          .filter(icon => icon.iconName)
}



/* Add a function to convert those icons found in file with the 
   correspondant iconName from the icon library
*/

exports.generateFontAwesomeImportsText = function(icons) {
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


// const compose = (...fns) => value =>
//     fns.reduceRight((acc, fn) => fn(acc), value)



// exports.getFontAwesomeImportsFromFile = compose(generateFontAwesomeImportsText, getIconsInFile)
