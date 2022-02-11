---
title: 经典面试题
---

## 1. 如下为一段代码，请完善sum函数，使得 sum(1,2,3,4,5,6) 函数返回值为 21, 需要在 sum 函数中调用 asyncAdd 函数进行数值运算，且不能修改asyncAdd函数.

```js
/**
 * 请在 sum函数中调用此函数，完成数值计算
 * @param {*} a 要相加的第一个值
 * @param {*} b 要相加的第二个值
 * @param {*} callback 相加之后的回调函数
 */
function asyncAdd(a,b,callback) {
  setTimeout(function(){
      callback(null, a+b)
  },1000)
}

/**
 * 请在此方法中调用asyncAdd方法，完成数值计算
 * @param  {...any} rest 传入的参数
 */
async function sum(...rest) {
    // 请在此处完善代码

  let arr = []
  if (rest.length % 2 === 1) {
      rest.push(0)
  }
  let fn = function (s1,s2) {
      return new Promise((resolve, reject) => {
          asyncAdd(s1, s2, function (m, n) {
              resolve(n)
          })
      })
  }
  for (let i = 0; i < rest.length; i+=2) {
      arr.push(fn(rest[i], rest[i+1]))
  }

  return Promise.all(arr).then(res => {
      let s = res.reduce((cur, pre) => cur+=pre, 0)
      return s
  })

}

let start = window.performance.now()
sum(1, 2, 3, 4, 5, 6, 7, 8).then(res => {
  // 请保证在调用sum方法之后，返回结果21
  console.log(res)
  console.log(`程序执行共耗时: ${window.performance.now() - start}`)
})
```
