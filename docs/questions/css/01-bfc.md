---
title: 介绍BFC原理及起运用
---

**块格式化上下文（Block Formatting Context，BFC）** `BFC` 是一个完全独立的空间（布局环境），让空间里的子元素不会影响到外面的布局。

### 触发BFC的条件

* overflow: hidden/auto/scroll

* display: inline-block/flex/table-cell/inline-flex

* position: absolute/fixed

* float: left/right

### BFC的特性

* `BFC` 就是一个块级元素，块级元素会在垂直方向一个接一个的排列.

* `BFC` 就是页面中的一个隔离的独立容器，容器里的标签不会影响到外部标签.

* 垂直方向的距离由 `margin` 决定， 属于同一个 `BFC` 的两个相邻的标签外边距会发生重叠

* 计算 `BFC` 的高度时，浮动元素也参与计算

### BFC的作用

1. 解决高度塌陷（清除浮动）

![](https://image-static.segmentfault.com/404/116/4041167803-55c6ef7705d28_fix732)

```css
.container{
  overflow: hidden;  // 触发bfc
}
```

2. 外边距合并

外边距折叠（Margin collapsing）只会发生在属于同一BFC的块级元素之间。

```html
<style>
  p{
    margin: 10px 0;
  }
</style>
<div class="container"> 
  <p>Sibling 1</p> 
  <p>Sibling 2</p> 
  <p>Sibling 3</p> 
</div>
```

理论上两个兄弟元素之间的边距应该是两个元素的边距之和（20px），**但实际是 10px**。这就是外边距合并。

如何避免合并？ **创建一个新的BFC**

```html
<style>
  p{
    margin: 10px 0;
  }
  .newBFC{
    overflow: hidden; // 触发bfc
  }
</style>
<div class="container"> 
  <p>Sibling 1</p> 
  <p>Sibling 2</p> 
  <div class="newBFC">
    <p>Sibling 3</p> 
  </div>
</div>
```
