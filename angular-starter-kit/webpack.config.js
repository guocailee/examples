var webpack = require("webpack");
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  context: __dirname + "/app",
  entry: {
    app: __dirname + '/app/scripts/main.js',
    vendors: ['angular', 'angular-animate', 'angular-material']
  },
  output: {
    // Absolute output directory
    path: __dirname + "/build/",

    // Output path from the view of the page
    // Uses webpack-dev-server in development
    publicPath: "",

    // Filename for entry points
    // Only adds hash in build mode
    filename: 'scripts/[name].bundle.[hash].js',

    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: 'scripts/[name].bundle.[hash].js'

  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader','css-loader!postcss-loader')
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style-loader','css-loader!postcss-loader!sass-loader')
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }, {
      test: /\.html$/,
      loader: 'raw'
    }]
  },
  postcss: function() {
    return [autoprefixer(
      [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
      ]
    )];
  },
  plugins: [
    new ExtractTextPlugin("styles/main.css"),
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: 'body'
    }),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'scripts/vendors.js')
  ],
  devtool: 'source-map'
};
