---
title: 8. React 组件生命周期及函数组件生命周期替代方案
---

## 类组件生命周期介绍

React 两个重要阶段：
 * render 阶段
 * commit 阶段

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7066da719fda4a91aa2c432f60c58a48~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 1. constructor

在初始化时执行一次，初始化 state, 可以用来获取路由参数，事件绑定 this 等。

### 2. getDerivedStateFromProps

```js
static getDerivedStateFromProps(nextProps, prevState) {}
```

`nextProps` : 父组件新传递的 `props` ;

`prevState` : 传入 `getDerivedStateFromProps` 待合并的 `state` 。

接受父组件的 `props` 数据， 可以对 `props` 进行格式化，过滤等操作，返回值将作为新的 `state` 合并到 `state` 中，供给视图渲染层消费。
只要组件更新，就会执行 `getDerivedStateFromProps`，不管是 `props` 改变，还是 `setState` ，或是 `forceUpdate` 。

React 对该生命周期定义为取缔 `componentWillMount` 和 `componentWillReceiveProps` 。

### 3. UNSAFE_componentWillMount

在 React V16.3 `componentWillMount` `，componentWillReceiveProps` ， `componentWillUpdate` 三个生命周期加上了不安全的标识符 `UNSAFE_`,
在严格模式下会报出警告。


### 4. render()

就是 `jsx` 的各个元素被 `React.createElement` 或者 `jsx-dev-runtime` 创建成 `React element` 对象的形式。一次 `render` 的过程，就是创建 `React.element` 元素的过程。

### 5. getSnapshotBeforeUpdate

```js
getSnapshotBeforeUpdate(prevProps, prevState) {}
```
获取更新前的快照

* prevProps更新前的props
* prevState更新前的state

`getSnapshotBeforeUpdate` 在最近一次渲染输出（提交到 DOM 节点）之前调用。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）此生命周期方法的任何返回值将作为参数传递给 `componentDidUpdate()` 的第三个参数。

### 6. componentDidUpdate

```js
componentDidUpdate(prevProps, prevState, snapshot) {}
```

* prevProps 更新之前的 props ；
* prevState 更新之前的 state ；
* snapshot 为 getSnapshotBeforeUpdate 返回的快照，可以是更新前的 DOM 信息

`componentDidUpdate` 生命周期执行，此时 DOM 已经更新，可以直接获取 DOM 最新状态。这个函数里面如果想要使用 `setState` ，一定要加以限制，否则会引起无限循环.

### 7. componentDidMount

`componentDidMount` 生命周期执行时机和 `componentDidUpdate` 一样，一个是在**初始化**，一个是**组件更新**。此时 DOM 已经创建完，既然 DOM 已经创建挂载，就可以做一些基于 DOM 操作，DOM 事件监听器或向服务器请求数据，渲染视图。

### 8. shouldComponentUpdate

```js
shouldComponentUpdate(nextProps, nextState){}
```

一般用于性能优化，`shouldComponentUpdate` 返回值决定是否重新渲染的类组件, 返回值为 `false`，则不会调用 `componentDidUpdate()`。

### 9. componentWillUnmount

`componentWillUnmount` 是组件销毁阶段唯一执行的生命周期，主要做一些收尾工作，比如清除一些可能造成内存泄漏的定时器，延时器，或者是一些事件监听器。

```js
componentWillUnmount(){
    clearTimeout(this.timer)  /* 清除延时器 */
    this.node.removeEventListener('click',this.handerClick) /* 卸载事件监听器 */
}
```

## 函数组件生命周期替代方案 (Hooks)

React hooks也提供了 api ，用于弥补函数组件没有生命周期的缺陷。其原理主要是运用了 hooks 里面的 `useEffect` 和 `useLayoutEffect`。

1. `componentDidMount` 替代方案

只有初始化执行一次
```js
useEffect(()=>{
  /* 请求数据 ， 事件监听 ， 操纵dom */
},[])  /* dep = [] */
```

2. `componentWillUnmount` 替代方案

```js
useEffect(()=>{
  /* 请求数据 ， 事件监听 ， 操纵dom ， 增加定时器，延时器 */
  return function componentWillUnmount(){
      /* 解除事件监听器 ，清除定时器，延时器 */
  }
},[])/* 切记 dep = [] */
```
3. `componentDidUpdate` 替代方案

组件每次执行都调用该函数

```js
useEffect(()=>{
  console.log('组件更新完成：componentDidUpdate ')     
}) /* 没有 dep 依赖项 */
```
