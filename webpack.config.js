'use strict';

const path = require('path'),
    _ = require('underscore'),
    [,,...args] = process.argv,
    isProduction = _.contains(args, '--mode') && _.contains(args, 'production');

module.exports = {
    //target: 'node',
    node: {
        __dirname: false,
        __filename: false
    },
    entry: {
        dom: path.resolve(__dirname, './public/view-src/dom.jsx')
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
    output: {
        filename: isProduction ? '[name].min.js' : '[name].js',
        path: path.resolve(__dirname, './public/js'),
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'common'
        }
    }
};