'use strict';
const args = require('minimist')(process.argv.slice(2));
const path = require('path');

const srcPath = path.join(__dirname, '../src');
const publicPath = '/assets/';
// List of allowed environments
const allowedEnvs = ['local' ,'dev', 'prod', 'test'];

let env = 'local';

if (args.env && allowedEnvs.indexOf(args.env) !== -1) {
  env = args.env;
}

module.exports = {
  cache: false,
  devServer: {
    contentBase: (env === 'dev' || env === 'prod') ? './dist/' : './src/',
    compress: true,
    clientLogLevel: 'error',
    hot: true,
    publicPath: publicPath,
    historyApiFallback: true,
    stats: {
      chunks: false,
      modules: false,
      colors: true,
      children: false,
      errorDetails: true
    }
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      actions: `${srcPath}/actions`,
      reducers: `${srcPath}/reducers`,
      components: `${srcPath}/components`,
      sources: `${srcPath}/sources`,
      store: `${srcPath}/store`,
      styles: `${srcPath}/styles`,
      routes: `${srcPath}/routes`,
      utils: `${srcPath}/utils`,
      images: `${srcPath}/images`,
      node_modules: path.join(__dirname, '../node_modules'),
      config: `${srcPath}/config/` + env
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: [].concat([srcPath]),
        options: {
          failOnWarning: true,
          failOnError: true,
          emitErrors: true,
        }
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [].concat([srcPath])
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader?hash=sha512&digest=hex&name=images/[hash].[ext]'
      },
      {
        test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader : 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(mp4|mp3|ogg)$/,
        loader: 'file-loader'
      },
    ]
  }
};
