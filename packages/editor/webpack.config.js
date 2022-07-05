/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:08:22
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-05 10:25:56
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');

/** @type { import('webpack').Configuration } */
module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react'],
              plugins: ['react-refresh/babel'],
            },
          },
          'ts-loader',
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ReactRefreshWebpackPlugin(),
  ],
  devServer: {
    port: 8086,
    hot: true,
    liveReload: false,
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    alias: {
      Components: path.resolve(__dirname, './src/components'),
      Store: path.resolve(__dirname, './src/store'),
      Utils: path.resolve(__dirname, './src/utils'),
      Hooks: path.resolve(__dirname, './src/hooks'),
      Config: path.resolve(__dirname, './src/config'),
    },
  },
  devtool: 'source-map',
};
