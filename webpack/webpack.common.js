const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    devtool: 'eval-source-map', //配置生成Source Maps，选择合适的选项

    entry: __dirname + '/app/index.js',

    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js/,
                use: 'babel-loader'
            },
            {
                test: /\.less/,
                use: [
                    'less',
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin([path.join(__dirname, '../dist')])
    ]
}