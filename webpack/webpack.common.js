const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    devtool: 'eval-source-map', //配置生成Source Maps，选择合适的选项

    entry: path.join(__dirname, '../app/index.js'),

    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js/,
                include: path.join(__dirname, '../app'),
                use: 'babel-loader'
            },
            {
                test: /\.less/,
                include: path.join(__dirname, '../app'),
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin([path.join(__dirname, '../dist')])
    ],

    target: 'electron-renderer'
}