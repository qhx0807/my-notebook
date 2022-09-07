---
title: 25. useEffect 和 useLayoutEffect 有什么区别?
---

1. `useEffect` 与 `useLayoutEffect` 的函数签名是完全一致的.

2. `useLayoutEffect` 在所有的 `DOM` 变更之后同步调用 `effect`, `useEffect` 是异步执行，不会阻塞渲染，传给 `useEffect` 的函数会在浏览器完成布局与绘制之后，在一个延迟事件中被调用。

3. 官方给出的建议是在大部分场景下都可以使用 `useEffect` 来完成副作用的执行，只有当 `useEffect` 无法解决时再用 `useLayoutEffect` 进行处理