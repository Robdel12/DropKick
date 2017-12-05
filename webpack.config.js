const path = require('path');
const Dotenv = require('dotenv-webpack');
const isProduction = process.env.NODE_ENV === "production";
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
});

const plugins = [ new Dotenv(), HtmlWebpackPluginConfig ];
// minify the output
if (isProduction)  { plugins.push(new UglifyJSPlugin()); }

module.exports = {
  entry: './src/dropkick.js',
  output: {
    libraryTarget: "umd",
    library: "dropkickjs",
    filename: 'dropkick.js',
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
  resolve: {
    alias: {
      jquery: "jquery/src/jquery"
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  plugins
};
