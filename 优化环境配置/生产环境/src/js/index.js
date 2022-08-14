/*
 * @Author: your name
 * @Date: 2020-10-04 15:46:42
 * @LastEditTime: 2022-08-14 21:13:18
 * @LastEditors: maxuecan 623875282@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \webpack\13.js语法检查\src\js\index.js
 */
// import '@babel/polyfill'
// import $ from 'jquery';
import '../css/a.css';
import '../css/b.css';

const add = (x, y) => x + y;
console.log(add(3, 4));

const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('定时器执行完了~');
    resolve();
  }, 1000);
});
console.log(promise);

// 下一行eslint所有规则都失效（下一行不进行检查）
// eslint-disable-next-line
console.log(add(3, 4));

// Code Split
// 通过js代码，让某个文件被单独打包成一个chunk
// import 动态导入语法：能将某个文件单独打包
// import(/* webpackChunkName: 'test' */'./test')
//   .then(({mul, count})=>{
//     // 文件加载成功~
//     // eslint-disable-next-line
//     console.log(mul(2, 5));
//   })
//   .catch(()=>{
//     // eslint-disable-next-line
//     console.log("文件加载失败~");
//   });

// Lazy Loading
// document.getElementById('btn').onclick = function() {
//   // console.log(mul(4,5))

//   // 懒加载~：当文件需要使用时才加载~
//   // 预加载 prefetch：会在使用之前，提前加载js文件
//   // 正常加载可以认为是并行加载（同一时间加载多个文件）预加载prefetch：等其它资源加载完毕，浏览器空闲了，再偷偷加载资源
//   import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({ mul }) => {
//     console.log(mul(4,5));
//   });
// };