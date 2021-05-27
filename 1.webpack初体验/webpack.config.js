// const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
//
// module.exports = {
//   //webpack配置
//
//   /*5个核心配置*/
//   //1.入口起点
//   entry: './src/js/index.js',
//
//   //2.输出
//   output: {
//     //输出文件名
//     filename: 'js/bundle.js',
//     //输出路径
//     path: path.resolve(__dirname,'dist')
//   },
//
//   //3.loader配置
//   module: {
//     //详细loder配置
//     rules: [
//       {
//         //匹配哪些文件
//         test: /\.css$/,
//         //使用哪些loader进行处理
//         use: [
//             'style-loader',
//             'css-loader'
//         ]
//       },
//       {
//         test: /\.less$/,
//         use: [
//             'style-loader',
//             'css-loader',
//             'less-loader'
//         ]
//       },
//       {
//         //处理图片资源
//         //安装url-loader file-loader
//         test: /\.(jpg|png|gif)$/,
//         loader: 'url-loader',
//         options: {
//           //图片小于8kb,就会被base64处理
//           //优点 减少请求数量（减轻服务器压力）
//           //缺点 图片体积会更大（文件请求速度慢）
//           limit: 8 * 1024,
//           //给图片进行重命名
//           //[hash:10] 取图片的hash的前10位
//           //[ext] 取文件原来的扩展名
//           name: 'img/[name].[hash:10].[ext]'
//         }
//       },
//       {
//         test: /\.html$/,
//         //处理html文件的img图片（负责引入img，从而被url-loader进行处理）
//         loader: 'html-loader',
//         options: {
//           esModule: false
//         }
//       },
//       {
//         //打包其他资源
//         exclude: /\.(css|js|html|json|less|png|jpg)$/,
//         loader: 'file-loader',
//         options: {
//           name: '[name].[hash:10].[ext]',
//           outputPath:'media'
//         }
//       },
//     ]
//   },
//
//   //4.plugins配置
//   plugins: [
//       //默认创建空的html文件，自动引入打包输出的所有资源（JS/CSS）
//     new HtmlWebpackPlugin({
//       //指定html文件，复制html文件的结构，打包出去
//       template: './src/index.html'
//     })
//   ],
//
//   //5.模式
//   mode: 'development',
//
//   //开发服务器 devServer 自动化
//   devServer: {
//     //项目构建后的路径
//     contentBase: './dist',
//     //启动gzip压缩
//     compress: true,
//     port: 3000,
//     //自动打开浏览器
//     open: true
//   }
// }

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') //解决html文件引入图片的问题
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //将css文件从js中分离
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); //压缩css文件
process.env.NODE_ENV = 'development' //指定开发环境

module.exports = {
  entry: ['./src/js/index.js','./src/index.html'],
  output: {
    filename: "js/bundle.[contenthash:10].js",
    path: path.resolve(__dirname,'dist'),
  },
  module: {
    rules: [
      {
        //以下loader只会匹配一个
        oneOf: [
          {
            test: /\.css$/,
            use: [
              // 'style-loader', //创建 style 标签，将样式放入
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../',//更改打包后分离出来的css文件中图片的引入路径
                },
              }, //代替style-loader，提取js中的css文件成单独文件
              'css-loader',  //将css文件整合到js文件中
              /*css兼容性处理 --> npm i postcss-loader postcss-preset-env */
              //修改loader的配置

              //1.使用loader的默认配置
              //'postcss-loader'

              //2.修改配置
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      //postcss插件
                      //帮助postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式
                      /*
                        "browserslist": {
                          //开发环境 -> 设置node环境变量：process.env.NODE_ENV = 'development'
                          "develpoment": [
                            "last 1 chrom version",
                            "last 1 firefox version",
                            "last 1 safari version"
                          ],
                          //生产环境 默认是生产环境
                          "production": [
                            ">0.2%",
                            "not dead",
                            "not op_mini all"
                          ]
                        }
                      * */
                      [
                        "postcss-preset-env",
                      ],
                    ]
                  }
                }
              }
            ]
          },
          {
            test: /\.less$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../',
                },
              },
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      [
                        "postcss-preset-env",
                      ],
                    ]
                  }
                }
              },
              'less-loader'
            ]
          },
          {
            test: /\.(png|gif|jpeg|jpg)$/,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              name: 'imgs/[name].[hash:10].[ext]'
            }
          },
          {
            test: /\.html$/,
            loader: 'html-loader',
            options: {
              esModule: false
            }
          },
          {
            exclude: /\.(html|js|css|less|json|png|gif|jpeg|jpg)$/,
            loader: 'file-loader',
            options: {
              name: '[name].[hash:10].ext',
              outputPath: 'media'
            }
          },
          {
            //js兼容性处理 babel-loader @babel/core @babel/preset-env
            /*
              1.基本js兼容性处理 -> @babel/preset-env
              问题：只能转换基本js语法，如promise不能转换
              2.全部js兼容性处理 -> @babel/polyfill
              直接在js文件中引入 import '@babel/polyfill'
              问题：只解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大
              3.按需加载 -> core-js
            * */
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              //预设：指示babel做怎样的兼容性处理
              presets: [
                [
                  '@babel/preset-env',
                  {
                    //按需加载
                    useBuiltIns: 'usage',
                    //指定core-js版本
                    corejs: {
                      version: 3
                    },
                    targets: {
                      chrome: '60',
                      firefox: '60',
                      ie: '9',
                      safari: '10',
                      edge: '17'
                    }
                  }
                ]
              ],
              //开启babel缓存
              //第二次构建的时候，会读取之前的缓存
              /*
                缓存：
                  babel缓存
                    cacheDirectory: true
                    --> 让第二次打包构建速度更快
                  文件资源缓存
                    hash: 每次wepack构建时会生成一个唯一的hash值。
                      问题: 因为js和css同时使用一个hash值。
                        如果重新打包，会导致所有缓存失效。（可能我却只改动一个文件）
                    chunkhash：根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样
                      问题: js和css的hash值还是一样的
                        因为css是在js中被引入的，所以同属于一个chunk
                    contenthash: 根据文件的内容生成hash值。不同文件hash值一定不一样
                    --> 让代码上线运行缓存更好使用
              */
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        minify: true //压缩html代码
      }),
      new MiniCssExtractPlugin({
        //对输出的css文件进行重命名
        filename: 'css/main.[contenthash:10].css'
      }),
      new CssMinimizerPlugin() //压缩css文件
  ],

  //生产环境自动压缩js代码
  mode: "development",
  devServer: {
    contentBase: './dist',
    compress: true,
    port: 3000,
    open: true,
    /*
    HMR hot module replacement 热模块替换
    一个模块发生变化，只会重新打包这一个模块
    样式文件：可以使用HMR

    js文件：默认不能使用HMR
    注意：只处理js非入口文件

    html文件：默认不能使用HMR，同时会导致html不能热更新 不需要HMR
    解决：修改entry入口，引入html文件
    * */
    hot: true //开启HMR功能
  },
  //映射，将源代码与打包后的代码映射起来，便于查找错误
  devtool: 'eval-source-map'
}
