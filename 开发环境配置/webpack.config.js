/*
 * @Author: your name
 * @Date: 2020-09-23 15:12:07
 * @LastEditTime: 2022-08-14 19:47:53
 * @LastEditors: maxuecan 623875282@qq.com
 * @Description: In User Settings Edit
 * @FilePath: 
 */
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'js/build.js',
        path: resolve(__dirname,'build'),
    },
    module: {
        rules: [
            // loader的配置
            {
                // 处理less资源
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                // 处理css资源
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                // 问题: 默认处理不了html中img图片资源
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    // 图片大小小于8kb,就会被base64处理
                    // 优点：减少请求数量(减轻服务器压力)
                    // 缺点：图片体积会更大(文件请求速度更慢)
                    limit: 8 * 1024,
                    // 给图片进行重命名
                    // [hash:10]取图片的hash的前10位
                    // [ext]取文件原来扩展名
                    name: '[hash:10].[ext]',
                    // 问题: 因为url-loader默认使用es6模块化解析,而html-loader引入图片是commonjs
                    // 解析时会出现问题:[Object Module]
                    // 解决：关闭url-loader的es6模块化,使用commonjs解析
                    esModule: false,
                    outputPath: 'imgs'
                }
            },
            {
                // 处理html文件的img图片(负责引入img,从而能被url-loader进行处理)
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                // 处理其它资源
                exclude: /\.(html|js|css|less|jpg|png|gif)/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]',
                    outputPath: 'media'
                }
            }
        ]
    },
    plugins: [
        // html-webpack-plugin
        // 功能: 默认会创建一个空的HTML，自动引入打包输出的所有资源(JS/CSS)
        // 需求: 需要有结构的HTML文件
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    mode: 'development',
    //  开发环境配置:能让代码运行
    //  运行项目指令:
    //  webpack 会将打包结果输出出去
    //  npx webpack-dev-server 只会在内存中编译打包，没有输出
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        compress: true,
        port: 3000,
        open: true
    }
}
