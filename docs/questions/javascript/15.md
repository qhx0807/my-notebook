---
title: 15. Vue 组件中 create 为什么不能用箭头函数定义？
---

如果使用箭头函数定义，那么 `this` 将指向 undefined

```js
<template>
  <div>{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 1,
    };
  },
  created: () => {
    console.log(this); // undefined
  },
};
</script>
```