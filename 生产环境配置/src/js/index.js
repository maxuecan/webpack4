/*
 * @Author: your name
 * @Date: 2020-10-04 15:46:42
 * @LastEditTime: 2022-08-14 17:32:20
 * @LastEditors: maxuecan 623875282@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \webpack\13.js语法检查\src\js\index.js
 */
// import '@babel/polyfill'
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