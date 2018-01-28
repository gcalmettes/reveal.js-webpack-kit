#!/usr/bin/env node
const mjpage = require('mathjax-node-page/lib/main.js').mjpage

function HthmlMxPlugin(options) {
  // Default options
  this.options = options;
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