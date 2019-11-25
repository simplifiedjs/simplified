'use strict';

const path = require('path'),
    nodeExternals = require('webpack-node-externals'),
    _ = require('underscore'),
    [,,...args] = process.argv,
    isProduction = _.contains(args, '--mode') && _.contains(args, 'production');

module.exports = {
    target: 'node',
    node: {
        __dirname: false,
        __filename: false
    },
    entry: {
        server: path.resolve(__dirname, './ui/src/index.jsx')
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
            }
        }]
    },
    resolve: {
        extensions: ['.jsx', '.js']
    },
    externals: [nodeExternals()],
    output: {
        filename: isProduction ? '[name].min.js' : '[name].js',
        path: path.resolve(__dirname, './ui'),
        libraryTarget: 'commonjs'
    }
};