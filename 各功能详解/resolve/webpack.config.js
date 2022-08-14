/*
 * @Author: your name
 * @Date: 2020-12-28 21:51:42
 * @LastEditTime: 2021-01-05 21:23:37
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
    module: {
      rules: [
          // loader的配置
          {
              test: /\.css$/,
              // 多个loader用use
              use: ['style-loader', 'css-loader']
          }
      ]  
    },
    plugins: [
        new HtmlWebpackPlugin()
    ],
    mode: 'development',
    // 解析模块的规则
    resolve: {
        // 配置解析模块路径别名：优点简写路径 缺点路径没有提示
        alias: {
            $css: resolve(__dirname, 'src/css')
        },
        // 配置省略文件路径的后缀名
        extensions: ['.js','.json','.jsx','.css'],
        // 告诉webpack解析模块是去找哪个目录
        modules: [resolve(__dirname, '../../node_modules'), 'node_modules']
    }
};