import data from '../data.json'
import '../css/index.css'
import '../css/less.less'
import '../media/ali_font/iconfont.css'

// import '@babel/polyfill'

import print from './print'
print()

console.log(data);

const add = (a,b) => {
  return a + b
}

console.log(add(5, 6));

const mul = (a,b) => {
  return a * b
}

console.log(mul(100, 6));

new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('一秒后')
  },1000)
}).then((result) => {
  console.log(result);
})

if (module.hot) {
  //module.hot为 true，说明开启了HMR功能
  module.hot.accept('./print.js',() => { //监听print.js文件的变化，一旦变化，其他模块文件不会重新打包构建，执行回调函数
    print()
  })
}
