---
title: 9. React Ref 有什么作用？
---

## ref 的创建

类组件中使用 `createRef` 方法来创建 `ref` 对象，对于整个 `Ref` 的处理，都是在 `commit` 阶段发生的。

> react/src/ReactCreateRef.js

```js
export function createRef() {
  const refObject = {
    current: null,
  }
  return refObject;
}
```

函数组件中 `useRef` Hook 来创建 `ref`

```
const ref = useRef(null);
```

`useRef` 底层逻辑是和 `createRef` 差不多，就是 `ref` 保存位置不相同，类组件有一个实例 `instance` 能够维护像 `ref` 这种信息，但是由于函数组件每次更新都是一次新的开始，所有变量重新声明，所以 `useRef` 不能像 `createRef` 把 ref 对象直接暴露出去，如果这样每一次函数组件执行就会重新声明 `Ref`，此时 ref 就会随着函数组件执行被重置，这就解释了在函数组件中为什么不能用 `createRef` 的原因

react 是如何解决的？

hooks 和函数组件对应的 `fiber` 对象建立起关联，将 `useRef` 产生的 `ref` 对象挂到函数组件对应的 `fiber` 上，函数组件每次执行，只要组件不被销毁，函数组件对应的 `fiber` 对象一直存在，所以 `ref` 等信息就会被保存下来。

## ref 的用法

0.  获取 DOM 元素

1. 函数组件缓存数据

函数组件每一次 `render` ，函数上下文会重新执行，useRef 可以创建出一个 ref 原始对象，只要组件没有销毁，ref 对象就一直存在。

例子： hooks 定时器 ref 保存 timer

```js
function useDebounce(fn, delay) {
  // 使用 useRef 来缓存timer, 防止组件重新渲染导致防抖失效
  const { current } = useRef(null);
  return (...args) => {
    if (current.timer) {
      clearTimeout(timer);
    }
    current.timer = setTimeout((...args) => {
      fn.apply(this, args)
    }, delay)
  }
}
```

2. ref实现组件通信

* class 组件可以通过 ref 直接获取组件实例，实现组件通信。

```js
class Son extends Component {
  foo() {}
}

function Father() {
  const sonInstance = React.useRef(null);
  // sonInstance.current.foo()
  return (<div>
    <Son ref={sonInstance} />
  </div>)
}
```

* 函数组件 forwardRef + useImperativeHandle

`forwardRef` 接受渲染函数作为参数，返回一个组件，将其接受的 ref 属性转发到其组件树下的另一个组件中。

```jsx
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

函数组件，本身是没有实例的，但是 React Hooks 提供了，`useImperativeHandle` 

第一个参数接受父组件传递的 `ref` 对象

第二个参数是一个函数，函数返回值，作为 `ref` 对象获取的内容

第三个参数： 依赖项 deps

```jsx
function Son (props,ref) {
  const inputRef = useRef(null);
  const [ inputValue , setInputValue ] = useState('');
  useImperativeHandle(ref,()=>{
    const handleRefs = {
      onFocus(){              /* 声明方法用于聚焦input框 */
        inputRef.current.focus();
      },
      onChangeValue(value){   /* 声明方法用于改变input的值 */
          setInputValue(value);
      }
    }
    return handleRefs;
  },[])
  return <div>
    <input placeholder="请输入内容"  ref={inputRef}  value={inputValue} />
  </div>
}

const ForwarSon = forwardRef(Son);

function Father() {
  const ref = useRef(null);

  function onClick() {
    // 可以调用子组件中 useImperativeHandle 第二个参数handler返回的内容
    ref.current.onFocus();
  }
  return (
    <div>
      <ForwarSon ref={ref} />
      <button onClick={onClick}>button</button>
    </div>
  );
}

```

3. 转发 ref

`forwardRef` 转发 `Ref`, `forwardRef` 把 `ref` 变成了可以通过 `props` 传递和转发
