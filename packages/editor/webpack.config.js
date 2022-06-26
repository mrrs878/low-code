/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:08:22
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-26 20:10:09
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    port: 8086,
    hot: true,
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
  },
};
