---
slug: setInterval-with-react-hooks
title: setInterval在React Hooks中的一些问题
tags: [react, hooks]
image: http://cdn.cqhiji.com/pic/20220311150923.png
---

在Hooks中使用 `setInterval` 可能会陷入一个烦人的问题：在用 `setInterval` 时总会偏离自己想要的效果.

 Dan的博客原文：[Making setInterval Declarative with React Hooks.](https://overreacted.io/zh-hans/making-setinterval-declarative-with-react-hooks/)

 ## 需求：写一个每秒递增的计数器

 ```jsx
  function Counter() {
    let [count, setCount] = useState(0);
    useEffect(() => {
      let timer = setInterval(() => {
        setCount(count + 1);
      }, 1000);

      return () => clearInterval(timer);
    }, [count])
    
    return <h1>{count}</h1>;
  }
 ```


<!--truncate-->


这种写法有两个问题：
1. 每当 `count` 变化一次，组件就会重新渲染一次，性能很差。
2. 定时器 `timer` 在不停的创建和清除，造成资源浪费。

## `updater` 函数式更新

 ```jsx
  function Counter() {
    let [count, setCount] = useState(0);
    useEffect(() => {
      let timer = setInterval(() => {
        setCount(pre => pre + 1);
      }, 1000);

      return () => clearInterval(timer);
    }, [])
    
    return <h1>{count}</h1>;
  }
 ```
 不足之处是： 在复杂组件中无法获取到新的 `props`.

 ## 使用 `useReducer`

 略，太复杂了。

 ## 完美的解决方案 `useRef`

 `useRef` 返回一个可变的 `ref` 对象，其 `.current` 属性被初始化为传入的参数（initialValue）。**返回的 `ref` 对象在组件的整个生命周期内持续存在**。

 ```jsx
  function Counter() {
    let [count, setCount] = useState(0);
    const savedCallback = useRef();

    function callBack() {
      setCount(count + 1);
    }

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }

      let timer = setInterval(tick, 1000);
      return () => clearInterval(timer);
    }, [])
    
    return <h1>{count}</h1>;
  }
 ```

 ## 提取一个Hook: `useInterval`

 ```js
  function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    });

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }

      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }, [delay]);
  }
 ```

有了上面的 `useInterval`, 可以直接在代码中这样使用而不必担心其他问题：

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>;
}
```

 
 > 相反，`setInterval` 没有及时地描述过程 —— 一旦设定了 `interval`，除了清除它，你无法对它做任何改变。

 > **这就是 React 模型和 `setInterval` API 之间的不匹配**。

 > React 组件中的 props 和 state 是可以改变的， React 会重渲染它们且「丢弃」任何关于上一次渲染的结果，它们之间不再有相关性。

 > useEffect() Hook 也「丢弃」上一次渲染结果，它会清除上一次 effect 再建立下一个 effect，下一个 effect 锁住新的 props 和 state，这也是我们第一次尝试简单示例可以正确工作的原因。

 > 但 `setInterval` 不会「丢弃」。 它会一直引用老的 props 和 state 直到你把它换掉 —— 不重置时间你是无法做到的。