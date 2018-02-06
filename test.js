const fs = require('fs')

const range = (start, end) => (
  Array.from(Array(end - start + 1).keys()).map(i => i + start)
);


const ATTRIBUTES_WATCHED_FOR_MUTATION = [
	'class', 'data-prefix', 'data-icon', 
	'data-fa-transform', 'data-fa-mask'
];

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


const isReserved = (name) => {
  return ~RESERVED_CLASSES.indexOf(name);
}


const getIconName = (familyPrefix, cls) => {
  const parts = cls.split('-');
  const prefix = parts[0];
  const iconName = parts.slice(1).join('-');

  if (prefix==familyPrefix && iconName !== '' && !isReserved(iconName)) {
    return iconName;
  } else {
    return null;
  }
}

const emptyCanonicalIcon = () => {
  return { prefix: null, iconName: null, iconCategory: null, rest: [] };
};

const getCanonicalIcon = (values, styles, defaultPrefix = "fas") => {
  return values.reduce((acc, cls) => {
    const iconName = getIconName('fa', cls);

    if (styles[cls]) {
      acc.prefix = cls;
      acc.iconCategory = styles[cls]
    } else if (iconName) {
      acc.iconName = iconName;
      acc.prefix = acc.prefix || defaultPrefix;
      acc.iconCategory = acc.iconCategory || styles[defaultPrefix];
    } else if (cls !== 'svg-inline--fa' && cls.indexOf('fa-w-') !== 0) {
      acc.rest.push(cls);
    }
    return acc;
  }, emptyCanonicalIcon());
}

// const getIcons = (file, tags = ATTRIBUTES_WATCHED_FOR_MUTATION) => {
// 	const data = fs.readFileSync(file, 'utf8').toString()

// 	let allClasses = []
// 	tags.forEach(attr => {
// 		[`'`, `"`].forEach(quote => {
// 			let regex = new RegExp(`${attr}[\s+]?=[\s+]?${quote}([^=]*fa[s|b|r][^=]*fa-[a-z0-9\-]+|fa-[a-z0-9\-]+[^=]*fa[s|b|r][^=]*)${quote}`, 'g')
// 			let matchArray
//   		while (matchArray = regex.exec(data)) {
//     		allClasses.push(matchArray[1])
//   		}
// 		})
// 	})

// 	return allClasses
// 					.map(d => d.split(' '))
// 					.map(d => {
// 	 					return getCanonicalIcon(d, iconStyles)
// 					})
// }

const getIcons = function(file, tags = ATTRIBUTES_WATCHED_FOR_MUTATION, inHTML = true) {
  const data = fs.readFileSync(file, 'utf8')

  let allClasses = []
  if (inHTML) {
    tags.forEach(attr => {
      [`'`, `"`].forEach(quote => {
        let regex = new RegExp(`${attr}[\s+]?=[\s+]?${quote}([^=]*fa[s|b|r][^=]*fa-[a-z0-9\-]+|fa-[a-z0-9\-]+[^=]*fa[s|b|r][^=]*)${quote}`, 'g')
        let matchArray
        while (matchArray = regex.exec(data)) {
          allClasses.push(matchArray[1])
        }
      })
    })
    allClasses = allClasses.map(d => d.split(' '))
  } else {
    const regex = /(fa\-[a-z0-9\-]+)/g;
    data.match(regex).forEach(
    	faElement => allClasses.push([faElement])
    )
  }

  return allClasses
          .map(d => getCanonicalIcon(d, iconStyles))
          .filter(icon => icon.iconName)
}



// const icons = getIcons('src/demo.html')
const icons = getIcons('node_modules/reveal.js-menu/menu.js', ATTRIBUTES_WATCHED_FOR_MUTATION, false)


console.log(icons)


