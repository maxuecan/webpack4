/*
 * @Author: your name
 * @Date: 2020-09-23 15:12:07
 * @LastEditTime: 2022-08-14 22:33:04
 * @LastEditors: maxuecan 623875282@qq.com
 * @Description: In User Settings Edit
 * @FilePath: 
 */
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 缓存：
// babel缓存
//   cacheDirectory: true
//   --> 让第二次打包构建速度更快
// 文件资源缓存
//   hash: 每次webpack构建时会生成一个唯一的hash值
//   问题: 因为js和css同时使用一个hash值。
//   如果重新打包，会导致所有缓存失效。（可能我却只改动一个文件）
//   chunkhash: 根据chunk生成的hash值。如果打包来源于同一个chunk,那么hash值就一样
//   问题: js和css的hash值还是一样的
//   因为css是在js中被引入的，所以同属于一个chunk
//   contenthash: 根据文件的内容生成hash值。不同文件hash值一定不一样
//   -> 让代码上线运行缓存更好使用

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'js/build.[contenthash:10].js',
        path: resolve(__dirname,'build'),
    },
    module: {
        rules: [
            // 一个loader只会匹配一个
            // 注意：不能又连个配置处理同一种类型文件
            {
                oneOf: [
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
        // 运行代码的目录
        contentBase: resolve(__dirname, 'build'),
        // 监视contentBase目录下的所有文件，一旦文件变化就会 reload
        watchcontentBase: true,
        watchOptions: {
            // 忽略文件
            ignored: /node_modules/
        },
        // 启动gzip压缩
        compress: true,
        // 端口
        port: 3000,
        // 域名
        host: 'localhost',
        // 自动打开浏览器
        open: true,
        // 开启HMR功能
        // HRM: hot module replacement 热模块替换 / 模块热替换
        // 作用：一个模块发生变化，只会重新打包这一个模块（而不是打包所有模块
        // 极大提升构建速度
        // 样式文件：可以使用HMR功能：因为style-loader内容实现了
        // js文件： 默认不能使用HMR功能 --> 需要修改js代码，添加支持HMR功能的代码
        // 注意：HMR功能对js的处理，只能处理非入口文件的其他文件.
        // html文件：默认不能使用HMR功能.同时会导致问题：html文件不能热更新了（不用做HMR功能）
        // 解决：修改entry入口，将html文件引入
        // 当修改了webpack配置，新配置要想生效，必须重启webpack服务
        hot: true,
        // 不要显示启动服务器日志信息
        clientLogLevel: 'none',
        // 除了一些基本启动信息以外，其他内容都不要显示
        quiet: true,
        // 如果出错了，不要全屏提示~
        overlay: false,
        // 服务器代理-->解决开发环境跨域问题
        proxy: {
            // 一旦devServer(5000)服务器接收到/api/xx的请求，就会把请求转发到另外一个服务器(3000)
            '/api': {
                target: 'http://loaclhost:3000',
                // 发送请求时，请求路径重写：将/api/xxx --> /xxx （去掉/api）
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    // source-map: 提供一种源代码到构建后代码映射技术(如果构建后代码出错了，通过映射可以追踪源代码错误)
    // [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
     
    // source-map：外部
    //  错误代码准确信息 和 源代码的错误位置
    // inline-source-map：内联
    //  只生成一个内联source-map
    //  错误代码准确信息 和 源代码的错误位置
    // hidden-source-map：外部
    //  错误代码错误原因，但是没有错误位置
    //  不能追踪源代码错误，只能提示到构建后代码的错误位置
    // eval-source-map：内联
    //  每个文件都生成对应的source-map，都在eval
    //  错误代码准确信息 和 源代码的错误位置
    // nosources-source-map：外部
    //  错误代码准确信息，但是没有任何源代码信息
    // cheap-source-map：外部
    //  错误代码准确信息 和 源代码的错误位置
    //  只能精确行
    // cheap-module-source-map：外部
    //  错误代码准确信息 和 源代码的错误位置
        
    // 内联 和 外部的区别：1.外部生成了文件，内联没有 2.内联构建速度更快
    // 开发环境：速度块，调试更友好
    // 速度块（eval>inline>cheap>...）
    //  eval-cheap-source-map
    //  eval-source-map
    // 调试更友好
    //  source-map
    //  cheap-module-source-map
    //  cheap-source-map
    //  --> eval-source-map / eval-cheap-module-souce-map

    // 生产环境：源代码要不要隐藏？调试要不要更友好
    // 内联会让代码体积变大，所以在生产环境不用内联
    //  nosources-source-map 全部隐藏
    //  hidden-source-map 只隐藏源代码，会提示构建后代码错误信息
    //  --> source-map / cheap-module-source-map
    devtool: 'eval-source-map'
}
