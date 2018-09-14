// const webpack = require('webpack')
const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var key = fs.readFileSync('./ssl/localhost.key');
var cert = fs.readFileSync('./ssl/localhost.crt');

module.exports = {
    entry: [path.join(__dirname, 'src', 'index.js')],

    output: {
        path: path.join(__dirname, 'public'),
        filename: 'build.js'
    },

    mode: 'none',

    devtool: 'inline-source-map',

    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },

    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src', 'landing.html'),
                to: path.resolve(__dirname, 'public')
            }
        ])
    ],

    devServer: {
        contentBase: './public',
        host: 'localhost',
        port: 8081,
        https: true,
        cert: cert,
        key: key,
        compress: false,
        historyApiFallback: {
            rewrites: [
                { from: /^\/$/, to: '/landing.html' }
            ]
        },
        index: './public/index.html',
        progress: true,
        inline: true,
        watchContentBase: true,
        open: true
    }
}
