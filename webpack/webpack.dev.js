const merge = require('webpack-merge')
const common = require('./webpack.common')
const webpack = require('webpack')
const path = require('path')

module.exports = merge(common, {
    devtool: 'inline-source-map',

    devServer: {
        inline: true
    }
})