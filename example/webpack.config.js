const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: [
            path.resolve(__dirname, 'src/index.js')
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-object-rest-spread']
                }
            },
            {
                test: /\.elm$/,
                loader: 'elm-webpack-loader'
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules')
        ]
    },
    plugins: [
        new HTMLPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html'
        }),
    ],
    devtool: 'source-map'
};