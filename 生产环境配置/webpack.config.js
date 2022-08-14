/*
 * @Author: your name
 * @Date: 2020-10-07 15:42:38
 * @LastEditTime: 2022-08-14 20:29:27
 * @LastEditors: maxuecan 623875282@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \webpack\17.生产环境配置\webpack.config.js
 */
const {resolve} = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
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

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'js/bulid.js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
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
                    ]
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // 对输出的css文件进行重命名
            filename: 'css/built.css'
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
        })
    ],
    // 生产环境下会自动压缩js代码
    mode: 'production',
}
