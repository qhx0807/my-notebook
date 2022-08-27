---
title: 前端性能优化指南
sidebar_position: 3
date: 2022-04-01
---

### 从输入URL说起

> 在浏览器上输入URL到页面加载完成，发生了什么？

![](http://cdn.cqhiji.com/pic/071b8468c6bf43cc9f99e71e2828b584.png)

从前端性能优化的角度，可以将上述过程分成以下几步：

1. DNS解析
2. 建立TCP连接
3. 发送HTTP请求
4. 服务端处理请求，HTTP响应返回
5. 浏览器得到返回数据，解析数据，把数据呈现给用户

基于以上，我们可以将前端优化分为两个方向：**网络层面**，**渲染层面**。
接下来就针对每个阶段来探索性能优化的手段。

## 网络层面

网络层面主要涉及三个过程：

* DNS 解析
* TCP 连接
* HTTP 请求

对于DNS解析和TCP连接我们前端工程师能做的优化非常有限，

1. dns-prefetch

```html
<link rel="dns-prefetch" href="https://xxx.com/"> 
```
提前解析后面可能会用到到域名(一般仅对跨域域名上的DNS查找有效)，将解析结果 **缓存到系统缓存** 中。

DNS解析过程（依顺序逐步查找IP地址）：

浏览器缓存 -> 系统缓存 -> 路由器缓存 -> 运营商缓存 -> 跟域名服务器 -> 顶级域名服务器 -> 主域名服务器

2. TCP连接

  * 长连接
  * 预连接
  * 接入 SPDY 协议

3. HTTP请求优化方向

  * 减少请求次数
  * 减少单次请求花费的时间

## 开启Gzip

开启方式：

```bash
accept-encoding: gzip
```

> HTTP 压缩是一种内置到网页服务器和网页客户端中以改进传输速度和带宽利用率的方式。在使用 HTTP 压缩的情况下，HTTP 数据在从服务器发送前就已压缩：兼容的浏览器将在下载所需的格式前宣告支持何种方法给服务器；不支持压缩方法的浏览器将下载未经压缩的数据。最常见的压缩方案包括 Gzip 和 Deflate。

通常情况下，Gzip 压缩是服务器的工作，服务器在发送文件前启动压缩任务，本身是需要消耗时间和cpu资源的。webpack 可使用相关压缩的 plugin 来在构建过程中去做一部分服务器的工作，为服务器分压。

## webpack优化方案

主要在两个方面

* 构建时间长
* 构建的产物体积大

### 不要让 loader 负担太重

使用 `include/exclude` 过滤掉不必要的文件，例：

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        // 开启缓存将转译结果缓存至文件系统
        loader: 'babel-loader?cacheDirectory=true',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
}
```

### 处理第三方库

* Externals
* CommonsChunkPlugin
* DllPlugin (推荐)

### 多进程打包

* 使用 `thread-loader` 将耗时的 loader 放入 worker 中去执行。

```js
module.exports = {
  rules: [
    test: /\.module\.(scss|sass)$/,
    include: '/src/',
    use: [
      'style-loader',
      {
          loader: "css-loader",
          options: {
            modules: true,
            importLoaders: 2,
          },
        },
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [["postcss-preset-env"]],
            },
          },
        },
        {
          loader: "thread-loader",
          options: {
            workerParallelJobs: 2,
          },
        },
        "sass-loader",
    ]

  ]
}
```

> node-sass 中有个来自 Node.js 线程池的阻塞线程的 bug。 当使用 thread-loader 时，需要设置 workerParallelJobs: 2。

### 构建速度&结果分析

* [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin) 构建速度分析，能查看每个loader/plugin 耗时，方便针对优化。

* [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 查看打包后生成的 bundle 体积分析。

## 图片的优化

各种图片格式的优缺点：

* JPEG/JPG 

优点：最大的特点是有损压缩，图片体积小，但仍较高的保留品质。淘宝/京东上的大图片都为jpg格式。
缺点：不支持透明度处理。
使用场景：PG 适用于呈现色彩丰富的图片，在我们日常开发中，JPG 图片经常作为大的背景图、轮播图或 Banner 图出现。

* PNG-8与PNG-24

优点：PNG 图片具有比 JPG 更强的色彩表现力，对线条的处理更加细腻，对透明度有良好的支持。
缺点：体积太大。
使用场景：呈现小的 Logo、颜色简单且对比强烈的图片或背景，或者有透明需求的图片。

* SVG
优点：文件体积更小，可压缩性更强，图片可无限放大而不失真。SVG 是文本文件，灵活性更强。
缺点：渲染成本较高。
使用场景：矢量图。

* BASE64
优点：可写入本地文件，不使用HTTP 请求。
缺点：仅适用于小文件，Base64 编码后，图片大小会膨胀为原文件的 4/3 
使用场景：小文件 icon，图片的更新频率非常低。

* WebP

> 与 PNG 相比，WebP 无损图像的尺寸缩小了 26％。在等效的 SSIM 质量指数下，WebP 有损图像比同类 JPEG 图像小 25-34％。 无损 WebP 支持透明度（也称为 alpha 通道），仅需 22％ 的额外字节。对于有损 RGB 压缩可接受的情况，有损 WebP 也支持透明度，与 PNG 相比，通常提供 3 倍的文件大小。

优点：支持透明，支持动态图，
缺点：兼容性，
使用场景：最优的图片格式选择
兼容性处理：Accept 字段包含 image/webp 时，就返回 WebP 格式的图片，否则返回原图。

## 缓存

缓存可以减少I/O消耗，大大提高访问速度，是最有效的性能优化手段。浏览器缓存机制分为几个方面：

1. Memory Cache (内存缓存)
2. Service Worker Cache
3. HTTP Cache(Disk Cache 磁盘缓存)
4. Push Cache(推送缓存)

以上按照获取资源时请求的优先级依次排列。

### 1. Memory Cache

内存中的缓存，是浏览器最先尝试去命中的一种缓存，也是响应速度最快的。但是生命周期也是最短的，当标签页关闭时，缓存就会失效。

资源存不存内存，浏览器秉承的是“节约原则”。Base64 格式的图片，几乎永远可以被塞进 memory cache，这可以视作浏览器为节省渲染开销的“自保行为”；此外，体积不大的 JS、CSS 文件，也有较大地被写入内存的几率。相比之下，较大的 JS、CSS 文件就没有这个待遇了，内存资源是有限的，它们往往被直接甩进磁盘。

### 2. Service Worker Cache

Service Worker 是一种独立于主线程之外的 Javascript 线程。它脱离于浏览器窗体，因此无法直接访问 DOM。
Service Worker 的生命周期包括 install、active、working 三个阶段。一旦 Service Worker 被 install，它将始终存在，只会在 active 与 working 之间切换，除非我们主动终止它。这是它可以用来实现离线存储的重要先决条件。

### 3. HTTP 缓存

根据是否需要向服务器重新发起 HTTP 请求，将缓存过程分为两个部分：强制缓存和协商缓存：

* 强缓存：强缓存：浏览器直接从本地缓存中获取数据，不与服务器进行交互。
* 协商缓存：浏览器发送请求到服务器，服务器判定是否可使用本地缓存。

1. 强制缓存

强缓存是利用 http 头中的 Expires 和 Cache-Control 两个字段来控制的。强缓存中，当请求再次发出时，浏览器会根据其中的 expires 和 cache-control 判断目标资源是否“命中”强缓存，若命中则直接从缓存中获取资源，**不会再与服务端发生通信**

命中强缓存的情况下，返回的 HTTP 状态码为 200。

强缓存的实现：

过去使用 `expires` 响应头字段，例如：

```ini
expires: Wed, 12 Apr 2023 09:48:24 GMT
```

`express` 的值是一个时间戳，代表资源过期的时间，如果下次浏览器再次向服务器请求资源，浏览器会先对比**本地时间**和 expires  的时间戳，如果**本地时间**小于 expires 设定的时间，将直接从缓存中读取这个资源，不会与服务器发生通信。

缺点是如果本地时间和服务器时间不一致，将会带来意外。所以有 `cache-control` 出现。

```ini
cache-control: max-age=31536000
```

`expires` 是通过绝对时间来控制缓存的过期时间，`Cache-Control` 中的 `max-age` 字段则是通过设定相对时间长度来控制缓存时间（秒）。

**Cache-Control 的 max-age 配置项相对于 expires 的优先级更高。当 Cache-Control 与 expires 同时出现时，以 Cache-Control 为准。**

```ini
cache-control: max-age=3600, s-maxage=31536000
```

s-maxage 仅在代理服务器中生效，客户端中我们只考虑 max-age。

no-cache 绕开了浏览器：我们为资源设置了 no-cache 后，每一次发起请求都不会再去询问浏览器的缓存情况，而是直接向服务端去确认该资源是否过期（即走我们下文即将讲解的协商缓存的路线）。

no-store 比较绝情，顾名思义就是不使用任何缓存策略。在 no-cache 的基础上，它连服务端的缓存确认也绕开了，只允许你直接向服务端发送请求、并下载完整的响应。

2. 协商缓存

浏览器与服务器合作之下的缓存策略。协商缓存依赖于服务端与浏览器之间的通信，浏览器向服务器询问缓存的相关信息，判断是否发起请求或者从本地读取缓存资源。

如果服务端提示缓存资源未改动（Not Modified），资源会被重定向到浏览器缓存，这种情况下网络请求对应的状态码是 304。

协商缓存的控制：

Last-Modified 是一个时间戳，如果我们启用了协商缓存，它会在首次请求时随着 Response Headers 返回：

```ini
last-modified: Mon, 08 Feb 2021 09:42:47 GMT
```

随后我们每次请求时，会带上一个叫 `If-Modified-Since` 的时间戳字段，它的值正是上一次 `response` 返回给它的 `last-modified` 值：

```ini
if-last-modified: Mon, 08 Feb 2021 09:42:47 GMT
```

服务器接收到这个时间戳后，会比对该时间戳和资源在服务器上的最后修改时间是否一致，从而判断资源是否发生了变化。如果发生了变化，就会返回一个完整的响应内容，并在 `Response Headers` 中添加新的 `Last-Modified` 值；否则，返回如上图的 304 响应，`Response Headers` 不会再添加 `Last-Modified` 字段。

Last-Modified 的弊端

* 编辑了文件，但文件的内容没有改变。服务端并不清楚我们是否真正改变了文件，它仍然通过最后编辑时间进行判断。
* 当修改文件的速度过快时（比如花了 100ms 完成了改动），由于 If-Modified-Since 只能检查到以秒为最小计量单位的时间差，所以它是感知不到这个改动的。

为了解决这样的问题，Etag 作为 Last-Modified 的补充出现了。

Etag 是由服务器为每个资源生成的唯一的标识字符串，这个标识字符串是基于文件内容编码的，只要文件内容不同，它们对应的 Etag 就是不同的，反之亦然。因此 Etag 能够精准地感知文件的变化。

首次请求时，我们会在响应头里获取到一个最初的标识符字符串

```ini
etag: W/"151e7-B9t2jrmRQYBOl3YvI5lyZXv6HyE"
```

那么下一次请求时，请求头里就会带上一个值相同的、名为 `if-None-Match` 的字符串供服务端比对了：

```ini
If-None-Match: W/"2a3b-1602480f459"
```

Etag 的生成过程需要服务器额外付出开销，会影响服务端的性能，这是它的弊端。 **Etag 在感知文件变化上比 Last-Modified 更加准确，优先级也更高。当 Etag 和 Last-Modified 同时存在时，以 Etag 为准。**


### 4. Push Cache

Push Cache 是指 HTTP2 在 server push 阶段存在的缓存。
为用的太少，Chrome 或移除这个功能了。详情见 [Chrome to remove HTTP/2 Push](https://www.ctrl.blog/entry/http2-push-chromium-deprecation.html)

## 本地存储

### Cookie

cookie 的本职工作不是本地存储而是维持状态。它附着在 HTTP 请求上，在浏览器和服务器之间的每个请求“飞来飞去”。
Cookie 是有体积上限的，它最大只能有 4KB。

```ini
set-cookie: evo-unique-id=dfad3fcd285; Path=/; Max-Age=7776000; Expires=Sun Nov 20 2022 00:26:34 GMT+0800 (CST); SameSite=None; Secure
```

过量的 Cookie 会带来巨大的性能浪费，同一个域名下的所有请求，都会携带 Cookie。

### Web Storage

Web Storage 根据浏览器的不同，存储容量可以达到 5-10M 之间。
Local Storage 与 Session Storage，两者的区别在于生命周期与作用域的不同。

Local Storage、Session Storage 和 Cookie 都遵循同源策略。但 Session Storage 特别的一点在于，即便是相同
域名下的两个页面，只要它们不在同一个浏览器窗口中打开，那么它们的 Session Storage 内容便无法共享。

### IndexedDB

IndexedDB 是一个运行在浏览器上的非关系型数据库，还可以存储二进制数据。

### Web SQL

使用web sql 代替。

### Cache Storage

与Service Worker 一起使用，离线缓存。

## CDN 将静态资源提速

> CDN （Content Delivery Network，即内容分发网络）指的是一组分布在各个地区的服务器。这些服务器存储着数据的副本，因此服务器可以根据哪些服务器与用户距离最近，来满足数据的请求。 CDN 提供快速服务，较少受高流量影响。

核心机制：

1. CDN的加速资源是跟域名绑定的。
2. 通过域名访问资源，首先是通过DNS分查找离用户最近的CDN节点（边缘服务器）的IP
3. 通过IP访问实际资源时，如果CDN上并没有缓存资源，则会到源站请求资源，并缓存到CDN节点上，这样，用户下一次访问时，该CDN节点就会有对应资源的缓存了。

## 浏览器渲染机制

浏览器内核可以分成两部分：渲染引擎（Layout Engine 或者 Rendering Engine）和 JS 引擎。渲染引擎又包括了 HTML 解释器、CSS 解释器、布局、网络、存储、图形、音视频、图片解码器等等零部件。

### 渲染过程

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/27/16619d637d220b20~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

* DOM 树: 解析 HTML 以创建的是 DOM 树（DOM tree ）：渲染引擎开始解析 HTML 文档。

* CSSOM 树：解析 CSS（包括外部 CSS 文件和样式元素）创建的是 CSSOM 树。**CSSOM 的解析过程与 DOM 的解析过程是并行的**。
 
* 渲染树：CSSOM 与 DOM 结合，之后我们得到的就是渲染树（Render tree ）。

* 布局渲染树：从根节点递归调用，计算每一个元素的大小、位置等，给每个节点所应该出现在屏幕上的精确坐标，我们便得到了基于渲染树的布局渲染树（Layout of the render tree）。

* 绘制渲染树: 遍历渲染树，每个节点将使用 UI 后端层来绘制。整个过程叫做绘制渲染树（Painting the render tree）。

基于渲染流程的 CSS 优化建议:

1. CSS 引擎查找样式表，对每条规则都按**从右到左**的顺序去匹配。

```css
// bad
// 遍历页面上每个 li 元素，并且每次都要去确认这个 li 元素的父元素 id 是不是 myList
#myList  li {}
```

```css
// good
.myListLi{}
```

2. 避免使用通配符 `*`
3. 通过继承实现的属性，避免重复匹配重复定义。
4. 减少标签选择器，使用类选择器代替。
5. 减少嵌套。
6. 解析css 会阻塞页面渲染，所以需要将它尽早、尽快地下载到客户端（将 CSS 放在 head 标签里）。

### 回流&重绘

* 回流：当我们对 DOM 的修改引发了 DOM 几何尺寸的变化（比如修改元素的宽、高或隐藏元素等）时，浏览器需要重新计算元素的几何属性（其他元素的几何属性和位置也会因此受到影响），然后再将计算的结果绘制出来。这个过程就是回流（也叫重排）。

* 重绘：我们对 DOM 的修改导致了样式的变化、却并未影响其几何属性（比如修改了颜色或背景色）时，浏览器不需重新计算元素的几何属性、直接为该元素绘制新的样式（跳过了上图所示的回流环节）。这个过程叫做重绘。

什么时候会发生回流？

* 添加或删除可见的DOM元素
* 元素位置、尺寸发生变化
* 页面渲染初始化，浏览器窗口尺寸发生变化

浏览器本身有优化处理：大多数浏览器通过队列化修改并批量执行来优化回流过程。但是一下操作会强制刷新队列并要求计划任务立即执行：
获取布局等信息操作 `offsetTop` , `scrollTop` , `clientTop` , `getComputedStyle()`

#### 如何规避回流与重绘

* 避免逐条改变样式，使用类名去合并样式

```js
// bad
const el = document.getElementById('el');
container.style.width = '100px'
container.style.height = '200px'
container.style.border = '10px solid red'

// good
el.addClass('classname')
```

* 将DOM离线修改

使元素脱离文档流再将其修改。

1. 隐藏元素，应用修改，重新显示。
2. 使用document fragment在当前DOM之外构建一个子树，再把它拷贝回文档。
3. 将原始元素拷贝到一个脱离文档的节点，修改副本后再替换原始元素。

* 动画中使用绝对定位。

### 使用事件委托

事件逐层冒泡并能被父元素捕获，使用事件代理，只需给外层元素绑定一个处理器，就可以处理在其子元素上触发的所有事件。

### Event Loop 与异步更新策略

事件循环中的异步队列有两种：macro（宏任务）队列和 micro（微任务）队列。

常见的 macro-task 比如： setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作、UI 渲染等。

常见的 micro-task 比如: process.nextTick、Promise、MutationObserver 等。

**一个完整的 `Event Loop` 过程**

* 初始状态：调用栈空。micro 队列空，macro 队列里有且只有一个 script 脚本（整体代码）。

* 全局上下文（script 标签）被推入调用栈，同步代码执行。在执行的过程中，通过对一些接口的调用，可以产生新的 macro-task 与 micro-task，它们会分别被推入各自的任务队列里。同步代码执行完了，script 脚本会被移出 macro 队列，这个过程本质上是队列的 macro-task 的执行和出队的过程。

* 上一步我们出队的是一个 macro-task，这一步我们处理的是 micro-task。但需要注意的是：当 macro-task 出队时，任务是一个一个执行的；而 micro-task 出队时，任务是一队一队执行的（如下图所示）。因此，我们处理 micro 队列这一步，会逐个执行队列中的任务并把它出队，直到队列被清空。

* **执行渲染操作，更新界面**

* 检查是否存在 Web worker 任务，如果有，则对其进行处理 。

上述过程循环往复，直到两个队列都清空）

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/1/1662ff57ebe7a73f~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

问题：假如要在异步任务里进行DOM更新，我该把它包装成 micro 还是 macro 呢？

当我们需要在异步任务中实现 DOM 修改时，把它包装成 micro 任务是相对明智的选择。

一次渲染10万条数据：

```js
setTimeout(() => {
  // 插入十万条数据
  const total = 100000
  // 一次插入 20 条，如果觉得性能不好就减少
  const once = 20
  // 渲染数据总共需要几次
  const loopCount = total / once
  let countOfRender = 0
  let ul = document.querySelector('ul')
  function add() {
    // 优化性能，插入不会造成回流
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < once; i++) {
      const li = document.createElement('li')
      li.innerText = Math.floor(Math.random() * total)
      fragment.appendChild(li)
    }
    ul.appendChild(fragment)
    countOfRender += 1
    loop()
  }
  function loop() {
    if (countOfRender < loopCount) {
      window.requestAnimationFrame(add)
    }
  }
  loop()
}, 0)
```

## 服务端渲染

服务端生成html字符，浏览器直接渲染。

## lazy load

图片懒加载，重点：视口检查。

* `getBoundingClientRect()`
* `IntersectionObserver`
* `<img loading='lazy' />`

## 性能监测

* Performance 
* LightHouse