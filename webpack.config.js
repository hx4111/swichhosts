var webpack = require('webpack')

module.exports = {
    devtool: 'eval-source-map', //配置生成Source Maps，选择合适的选项

    entry: __dirname + '/app/index.js',

    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },

    module: {
        loaders: [{
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            }
        ]
    },

    devServer: {
        historyApiFallback: true,
        inline: true,//注意：不写hot: true，否则浏览器无法自动更新
    },

    target: 'electron-main'
}