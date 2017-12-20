'use strict';

let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractProd = new ExtractTextPlugin('[hash].prod.css');
let baseConfig = require('./base');

const publicPath = '/assets/';

let config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, '../src/index'),
  devtool: 'cheap-module-source-map',
  output: {
    path: path.join(__dirname, '../dist/assets'),
    filename: '[hash].prod.js',
    chunkFilename: '[hash].[id].prod.js',
    publicPath: publicPath
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,
      minimize: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    extractProd,
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/template.html',
      filename: '../index.html'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        dead_code: true,
        conditionals: true,
        unused: true,
        if_return: true
      }
    })
  ]
});

// Add needed loaders to the defaults here
config.module.rules.push({
  test: /\.css$/,
  loader: extractProd.extract({
    fallback: 'style-loader',
    use: [{ loader: 'css-loader', options: { sourceMap: true } },
      { loader: 'postcss-loader', options: { sourceMap: true } }]
  })
});
config.module.rules.push({
  test: /\.scss$/,
  loader: extractProd.extract({
    fallback: 'style-loader',
    use: [{ loader: 'css-loader', options: { sourceMap: true } },
      { loader: 'postcss-loader', options: { sourceMap: true } }]
  })
});

module.exports = config;
