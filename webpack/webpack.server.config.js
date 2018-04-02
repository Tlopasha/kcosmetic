"use strict";

const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const ZipFilesPlugin = require('webpack-zip-files-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

let nodeModules = {};
fs.readdirSync("node_modules")
  .filter(function(x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = "commonjs " + mod;
  });

module.exports = {
  target: "node",
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: true,
    __dirname: true
  },

  entry: "./server/index.js",

  output: {
    path: path.join(__dirname, "..", "server"),
    filename: "bundle.js"
  },

  externals: _.defaults(nodeModules, {
    "../../config.js": "commonjs ../config.js"
  }),

  // devtool: "sourcemap",

  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      },
      exclude: [/node_modules/, /vendor/]
    }]
  },

  plugins: [
    new webpack.DefinePlugin({
      WEBPACK_BUNDLE: true
    }),
    new UglifyJSPlugin({
      sourceMap: process.env.NODE_ENV === 'development'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new ZipFilesPlugin({
      entries: [
        { src: path.join(__dirname, '../server/locales'), dist: 'server/locales' },
        { src: path.join(__dirname, '../server/public'), dist: 'server/public' },
        { src: path.join(__dirname, '../server/views'), dist: 'server/views' },
        { src: path.join(__dirname, '../server/emails'), dist: 'server/emails' },
        { src: path.join(__dirname, '../server/bundle.js'), dist: 'server/bundle.js' },
        { src: path.join(__dirname, '../package.json'), dist: 'package.json' },
      ],
      output: path.join(__dirname, '../dist/credit-score'),
      format: 'tar',
    }),
  ]
};
