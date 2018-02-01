fs = require('fs')

const data = `<section class="title-slide" >
  <div class="huge framed bordered font-passionone col-80 border-3x bg-warning-alpha-08">
    <bspan>Reveal.js</bspan><br>
      <bspan class="right-30">+ Webpack</bspan> 
  </div>
  <div class="down-3">
    <i class="fas fa-bomb fa-2x"></i>
      Lots of goodies in one place
  </div>
</section>
`

const regex = /(fa\-[a-z0-9\-]+)/g;

const data2 = "foo fa-something-abc"

console.log(data.match(regex))
console.log(data2.match(regex))

// const getAllIconsIn = (file) => {
//   const fileData = fs.readFileSync(file, 'utf8').toString()
//   return fileData.match(/var (fa[a-zA-Z0-9\-]+)/g).map(match => match.split(' ')[1])
// }

// const countOccurrences = (regex, str) => {
//   if (! regex.global) {
//       throw new Error('Please set flag /g of regex');
//   }
//   const origLastIndex = regex.lastIndex;  // store
//   regex.lastIndex = 0;

//   let count = 0;
//   while (regex.test(str)) count++;

//   regex.lastIndex = origLastIndex;  // restore
//   return count;
// }


// const getIconsObject = (input, regex) => {
// 	const groups = {}

// 	let matchArray;
// 	while (matchArray = regex.exec(input)) {
// 		groups[matchArray[2]] = matchArray[1]
// 	}
// 	return groups
// }

// const getAllIconsInFile = (file) => {
//   const fileData = fs.readFileSync(file, 'utf8').toString()
//   const regex = /var (fa[a-zA-Z0-9\-]+) = { prefix: 'fab', iconName: '([a-zA-Z0-9\-]+)',/g
  
//   return getIconsObject(fileData, regex)
// }


// // const getAllIconsInFile = (file) => {
// //   const fileData = fs.readFileSync(file, 'utf8').toString()

// //   const regex = /var (fa[a-zA-Z0-9\-]+) = { prefix: 'fab', iconName: ('[a-zA-Z0-9\-]+'),/g
// //   const nMatches = countOccurrences(regex, fileData)
// //   console.log(nMatches)
// //   return regex.exec(fileData)//fileData.match(regex)
// // }

// const matches = getAllIconsInFile('node_modules/@fortawesome/fontawesome-free-brands/shakable.es.js')

// console.log(matches)
// console.log(matches['xing'])

// // const fileData = fs.readFileSync('node_modules/@fortawesome/fontawesome-free-brands/shakable.es.js', 'utf8').toString()
// // const regex = /var (fa[a-zA-Z0-9\-]+) = { prefix: 'fab', iconName: ('[a-zA-Z0-9\-]+'),/
// // // const match = 
// // const [_, iconFileName, iconName] = regex.exec(fileData)

// // console.log(iconFileName, iconName)

