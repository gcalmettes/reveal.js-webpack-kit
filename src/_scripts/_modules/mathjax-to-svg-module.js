#!/usr/bin/env node
const mjpage = require('mathjax-node-page/lib/main.js').mjpage

function HthmlMxPlugin(options) {
  // Default options
  config = options || {pageConfigs: {}, mjxNodeConfigs: {}}

  this.options = {
    pageConfigs: Object.assign(
      { format: ["TeX"],
        singleDollars: true,
        cssInline: false
      },
      config.pageConfigs
    ),
    mjxNodeConfigs: Object.assign(
      { svg: true ,
        linebreaks: false,
        useFontCache: true, // use <defs> and <use> in svg output?
        useGlobalCache: false, // use common <defs> for all equations?
      },
      config.mjxNodeConfigs
    )
  }
}

HthmlMxPlugin.prototype.apply = function(compiler) {
	const  self = this;

  compiler.plugin('compilation', function(compilation) {

    compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {

      // convert Mathjax to SVG and once done (promise) give resulging html to htmlwebpackplugin
      const promiseData = self.convertToSvg(htmlPluginData.html)
      promiseData
        .then(output => {
          htmlPluginData.html = output;
          callback(null, htmlPluginData);
        })

    });

  });
};


HthmlMxPlugin.prototype.convertToSvg = function (input, callback) {
  const  self = this;

  return new Promise((resolve, reject) => {
    mjpage(input, self.options.pageConfigs, self.options.mjxNodeConfigs, function(result) {
      return resolve(result);
    });
  })
};


module.exports = HthmlMxPlugin;