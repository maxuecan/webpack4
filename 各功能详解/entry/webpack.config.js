/*
 * @Author: your name
 * @Date: 2020-12-28 21:51:42
 * @LastEditTime: 2020-12-28 22:47:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webpack\5.webpack配置详解\29.entry\webpack.config.js
 */
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/* 
    entry：入口起点
        1.  string --> './src/index.js'
        单入口
            打包形成一个chunk.输出一个bundle文件
            此时chunk的名称默认是main
        2.  array --> ['./src/index.js', './src/add.js']
            多入口
            所有入口文件最终只会形成一个chunk,输出出去只有一个bundle文件
            --> 只有在HMR功能中让htnl热更新生效~
        3.  object
            多入口
            有几个入口文件就形成几个chunk,输出几个bundle文件
            此时chunk的名称是 key

            -->特殊用法
                {
                    // 所有入口文件最终只会形成一个chunk,输出出去只有一个bundle文件.
                    index: ['./src/index.js', './src/count.js'],
                    // 形成一个chunk,输出一个bundle文件.
                    add: './src/add.js'
                }

*/

module.exports = {
    // entry: './src/index.js',
    // entry: ['./src/index.js', './src/add.js'],
    entry: {
        // index: './src/index.js',
        index: ['./src/index.js', './src/count.js'],
        add: './src/add.js'
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'build')
    },
    plugins: [
        new HtmlWebpackPlugin()
    ],
    mode: 'development'
};