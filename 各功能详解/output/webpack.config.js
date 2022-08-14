/*
 * @Author: your name
 * @Date: 2020-12-28 21:51:42
 * @LastEditTime: 2020-12-29 22:11:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webpack\5.webpack配置详解\29.entry\webpack.config.js
 */
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        // 文件名称（指定名称+目录）
        filename: 'js/[name].js',
        // 输出文件目录（将来所有资源输出的公共目录）
        path: resolve(__dirname, 'build'),
        // 所有资源引入公共路径前缀 --> 'imgs/a.jpg' --> '/imgs/a.jpg'
        publicPath: '/',
        chunkFilename: 'js/[name]_chunk.js', //非入口chunk的名称
        // library: '[name]', //整个库向外暴露的变量名
        // libraryTarget: 'window' //变量名添加到哪个上 browser
        // libraryTarget: 'global' //变量名添加到哪个上 node
        // libraryTarget: 'commonjs'
    },
    plugins: [
        new HtmlWebpackPlugin()
    ],
    mode: 'development'
};