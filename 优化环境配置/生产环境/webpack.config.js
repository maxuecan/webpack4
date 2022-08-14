/*
 * @Author: your name
 * @Date: 2020-10-07 15:42:38
 * @LastEditTime: 2022-08-14 23:05:15
 * @LastEditors: maxuecan 623875282@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \webpack\17.生产环境配置\webpack.config.js
 */
const {resolve} = require('path');
// const TerserWebpackPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
// const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
// 定义node.js环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production';

// 复用loader
const commonCssLoader = [
    // 创建style标签，将样式放入
    // mini-css-extract-plugin取代style-loader。作用：提取js中的css成单独文件
    MiniCssExtractPlugin.loader,
    'css-loader',
    // css兼容性处理：postcss --> postcss-loader postcss-preset-env
    
    // 帮postcss找到package.json中browserslist里面的配置,通过配置加载指定的css兼容性样式
    // "browserslist": {
    //     // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
    //     "development": [
    //     "last 1 chrome version",
    //     "last 1 firefox version",
    //     "last 1 safari version"
    //     ],
    //     // 生产环境:默认是看生产环境
    //     "production": [
    //     ">0.2%",
    //     "not dead",
    //     "not op_mini all"
    //     ]
    // }
    'postcss-loader'
    // {
    //     // 还需要在package.json中定义browserslist
    //     loader: 'postcss-loader',
    //     options: {
    //         ident: 'postcss',
    //         plugins: () => {
    //             require('postcss-preset-env')()
    //         }
    //     }
    // }
]

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


// tree shaking: 去除无用代码
// 前提：1.必须使用ES6模块化 2. 开启production环境


module.exports = {
    // 单入口
    entry: './src/js/index.js',
    // 多入口：有一个入口，最终输出就是一个bundle
    // entry: {
    //     index: './src/js/index.js',
    //     test: './src/js/test.js'
    // },
    output: {
        filename: 'js/build.[contenthash:10].js',
        path: resolve(__dirname, 'build'),
        chunkFilename: 'js/[name].[contenthash:10].js'
    },
    module: {
        rules: [
            /* 
                正常来讲，一个文件只能被一个loader处理
                当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序:
                先执行eslint 在执行babel
            */
            /* 
                语法检查：eslint-loader eslint
                注意：只检查自己写的源代码，第三方的库是不用检查的
                设置检查规则：
                "eslintConfig": {
                    "extends": "airbnb-base"
                }
                package.json中eslintConfig中设置~
            */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                // 优先执行
                enforce: 'pre',
                loader: 'eslint-loader',
                options: {
                    // 自动修复
                    fix: true
                }
            },
            {
                // 一个loader只会匹配一个
                // 注意：不能又连个配置处理同一种类型文件
                oneOf: [
                    {
                        test: /\.css$/,
                        use: [...commonCssLoader]
                    },
                    {
                        test: /\.less$/,
                        use: [...commonCssLoader,'less-loader']
                    },
                    {
                        test: /\.(jpg|png|gif)/,
                        loader: 'url-loader',
                        options: {
                            limit: 8 * 1024,
                            name: '[hash:10].[ext]',
                            outputPath: 'imgs',
                            esModule: false
                        }
                    },
                    {
                        test: /\.html$/,
                        loader: 'html-loader'
                    },
                    {
                        exclude: /\.(js|css|less|html|jpg|png|gif)/,
                        loader: 'file-loader',
                        options: {
                            outputPath: 'media'
                        }
                    },
                    /* 
                        js兼容性处理：babel-loader @babel/core @babel/preset-env
                        1.基本js兼容性处理 --> @babel/preset-env
                            问题：只能转换基本语法，如promise高级语法不能转换
                        2.全部js兼容性处理 --> @babel/polyfill
                            问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
                        3.需要做兼容性处理的就做：按需加载 --> core-js
                    */
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        options: {
                            // 预设：指示babel做怎么样的兼容性处理
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        // 按需加载
                                        useBuiltIns: 'usage',
                                        // 指定core-js版本
                                        corejs: {
                                            version: 3
                                        },
                                        // 指定兼容性做到哪个版本浏览器
                                        targets: {
                                            chrome: '60',
                                            firefox: '50',
                                            ie: '9',
                                            safari: '10',
                                            edge: '17'
                                        }
                                    }
                                ]
                            ],
                            // 开启babel缓存
                            // 第二次构建时，会读取之前的缓存
                            cacheDirectory: true
                        }
                        // use: [
                        //     // 开启多经常打包,
                        //     // 进程启动大概为600ms,进程通信也是又开销
                        //     // 只有工作消耗事件比较长，才需要多进程打包
                        //     // 'thread-loader',
                        //     // {
                        //     //     loader: 'thread-loader',
                        //     //     options: {
                        //     //     workers: 2 // 进程2个
                        //     //     }
                        //     // },
                        //     {
                        //         loader: 'babel-loader',
                        //         options: {
                        //             // 预设：指示babel做怎么样的兼容性处理
                        //             presets: [
                        //                 [
                        //                     '@babel/preset-env',
                        //                     {
                        //                         // 按需加载
                        //                         useBuiltIns: 'usage',
                        //                         // 指定core-js版本
                        //                         corejs: {
                        //                             version: 3
                        //                         },
                        //                         // 指定兼容性做到哪个版本浏览器
                        //                         targets: {
                        //                             chrome: '60',
                        //                             firefox: '50',
                        //                             ie: '9',
                        //                             safari: '10',
                        //                             edge: '17'
                        //                         }
                        //                     }
                        //                 ]
                        //             ],
                        //             // 开启babel缓存
                        //             // 第二次构建时，会读取之前的缓存
                        //             cacheDirectory: true
                        //         }
                        //     }
                        // ],
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // 对输出的css文件进行重命名
            filename: 'css/build.[contenthash:10].css'
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: {
                // 移除空格
                collapseWhitespace: true,
                // 移除注释
                removeComments: true
            }
        }),
        // new WorkboxWebpackPlugin.GenerateSW({
        //     /* 
        //       1.帮助serviceworker快速启动
        //       2.删除旧的serviceworker
        //       生成一个servicework配置文件~
        //     */
        //     clientsClaim: true,
        //     skipWaiting: true
        // })
        // new AddAssetHtmlWebpackPlugin({
        //     filepath: resolve(__dirname, 'dll/jquery.js')
        // })
    ],
    // 生产环境下会自动压缩js代码
    mode: 'production',
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
    devtool: 'eval-source-map',
    // 1.可以将node_modules中代码单独打包一个chunk最终输出
    // 2.自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独一个chunk
    optimization: {
        splitChunks: {
            chunks: 'all',
            // 默认值，可以不写
            // minSize: 30 * 1024, // 分割的chunk最小为30kb
            // maxSize: 0, // 最大没有限制
            // minChunks: 1, // 要提取的chunk最少被引用1ci次
            // maxAsyncRequests: 5, // 按需加载时并行加载的文件的最大数量
            // maxInitialRequests: 3, // 入口js文件最大并行请求数量
            // automaticNameDelimiter: '~', // 名称连接符
            // name: true, // 可以使用命名规则
            // cacheGroups: { // 分割chunk的组
            //     // node_modules文件会被打包到vendors组的chunk中。vendors~xxx.js
            //     // 满足上面的公共规则，如：大小超过30kb，至少被引用一次/
            //     vendors: {
            //         test: /[\\/]node_modules/,
            //         // 优先级
            //         priority: -10
            //     },
            //     default: {
            //         // 要提取的chunk最少被引用2次
            //         minChunks: 2,
            //         // 优先级
            //         priority: -20,
            //         // 如果当前要打包的模块，和之前已经被提取的模块是同一个，就会复用，而不是重新打包模块
            //         reuseExistingChunk: true
            //     }
            // }
        },
        // 将当前模块的记录其他模块的hash单独打包为一个文件runtime
        // 解决：修改a文件导致b文件的contenthash变化
        runtimeChunk: {
            name: entrypoint => `runtime-${entrypoint.name}`
        },
        minimizer: [
            // 配置生产环境的压缩方案：js和css
            new TerserWebpackPlugin({
                // 开启缓存
                cache: true,
                // 开启多进程打包
                parallel: true,
                // 启动source-map
                sourceMap: true
            })
        ]
    },
    // externals: {
    //     // 忽略库名 -- npm包名
    //     // 拒绝jQuery被打包进来
    //     jquery: 'jQuery'
    // }
}
