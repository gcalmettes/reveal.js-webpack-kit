const PACKAGE = require('../../../../node_modules/mathjax-full/components/webpack.common.js');

module.exports = PACKAGE(
    'tex_fragments',                                // the package to build
    '../../../../node_modules/mathjax-full/js',    // location of the MathJax js library
    [                                     // packages to link to
        'components/src/core/lib',
        'components/src/input/tex-base/lib'
    ],
    __dirname,                            // our directory
    '.'                                   // dist directory
);
