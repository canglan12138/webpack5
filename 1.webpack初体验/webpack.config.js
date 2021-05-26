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
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: "js/bundle.js",
    path: path.resolve(__dirname,'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
            'style-loader',
            'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
            'style-loader',
            'css-loader',
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
      }
    ]
  },
  plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      })
  ],
  mode: "development",
  devServer: {
    contentBase: './dist',
    compress: true,
    port: 3000,
    open: true
  }
}
