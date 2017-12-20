const { resolve } = require('path');
const webpack = require('webpack');
let srcPath = resolve(__dirname, '../src');
module.exports = {
  entry: [
    './index.js'
  ],
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
      node_modules: resolve(__dirname, '../node_modules'),
      config: `${srcPath}/config/local`
    }
  },
  output: {
    filename: 'app.js',
    path: resolve(__dirname, '../dist'),
    publicPath: '/'
  },

  context: resolve(__dirname, '../src'),

  devtool: 'inline-source-map',

  devServer: {
    hot: true,
    contentBase: [resolve(__dirname, '../src'), resolve(__dirname, '../images')],
    publicPath: '/',
    historyApiFallback: true,
    stats: {
      chunks: false,
      modules: false,
      colors: true,
      children: false,
      errorDetails: true
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        use: [{ loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } }]
      }, {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader?hash=sha512&digest=hex&name=images/[hash].[ext]'
      },
      {
        test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader : 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(mp4|ogg)$/,
        loader: 'file-loader'
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
};
