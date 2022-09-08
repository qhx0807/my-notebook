---
title: 20. HTTP 1.0/1.1/2.0/3.0 的区别和特点？
---

## http 1.0

1. 默认是短连接，每个http请求都需要一次 TCP 协议通过三次握手和四次挥手实现.

2. 每个TCP连接只能发送一个请求。发送数据完毕，连接就关闭.

3. 仅定义了16中状态码。

## http 1.1

在1.0的基础上主要更新有：

1. 可重复使用的连接

```sh
Connection: keep-alive
```

2. Pipeline 

一次连接上多个http request不需要等待response就可以连续发.


3. chunked 机制

分块传输编码：允许服务端发送给客户端的数据分为多个部分。

```sh
Transfer-Encoding: chunked
```

4. HTTP 缓存机制

* 强缓存 200

浏览器优先命中的缓存，速度最快。当我们在状态码后面看到 `(from memory disk)` 时，就表示浏览器从内存种读取了缓存，当进程结束后，也就是 tab 关闭以后，内存里的数据也将不复存在。只有当强缓存不被命中的时候，才会进行协商缓存的查找。

```sh
expires: Tue, 27 Sep 2022 05:26:13 GMT
```

```sh
cache-control: max-age=31536000
```

响应头中同时出现这两个时，以 `cache-control` 为准。

 `Cache-Control` 的值

  a. no-store 不缓存任何内容，每次请求直接向服务器下载完整响应。

  b. no-cache 走协商缓存路线

  c. max-age 设定相对时间长度来控制缓存时间（秒）。

* 协商缓存 304

`Last-Modified` 资源最后修改时间

```sh
Last-Modified: Fri, 22 Jul 2019 01:47:00 GMT
```

之后的请求会带上 `if-modified-since` 


`etag` Etag 是由服务器为每个资源生成的唯一的标识字符串，这个标识字符串是基于文件内容编码的。

```
etag: "3d482c7a948bac826e155953b2a28a9e"
```

之后的请求会带上 `if-none-Match` 

5. 新增了5种请求方式

OPTIONS： 浏览器为确定跨域请求资源的安全做的预请求
PUT/
DELETE/
TRACE/
CONNECT/

## http2.0

[http2.0 demo](https://http2.akamai.com/demo)

与1.1的区别

1. 二进制帧层
2. 多路复用协议
3. 头部压缩算法 HPACK, 一些请求通常是相似的，因此这消除了传输数据的重复和开销
4. server push

* header 压缩算法

HTTP1.x的 `header` 带有大量信息，而且每次都要重复发送，HTTP2 的 `HPACK` 使用一份索引表来定义常用的 `HTTP Header` , 通讯双方各自缓存一份 `header fields` 表，既避免了重复 header 的传输，又减小了需要传输的大小。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e0aa2d2e27241b1944456b40b78a491~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)


* 二进制分帧

```diff
+--------------------------------------------------------------+   ^
|                                                              |   |
|                   Length (24)                                |   |
|                                                              |   |
|                                                              |   |
+----------------------+---------------------------------------+   |
|                      |                                       |   +
|                      |                                       |
|        Type (8)      |     Flag (8)                          |  Frame Header
|                      |                                       |   +
+----+-----------------+---------------------------------------+   |
|    |                                                         |   |
|    |                                                         |   |
| R  |                  Stream Identifier (31)                 |   |
|    |                                                         |   v
+----+---------------------------------------------------------+
|                                                              |
|                            Frame Payload                     |
|                                                              |
+--------------------------------------------------------------+


```

* 多路复用

在 `http2` 的情况下，所有的请求都会共用一个 `TCP` 连接，`http2` 是的基本单位是帧，`Stream Identifier` 就是用来标识该帧属于哪个请求的。

## HTTP3

基于 `UDP` 的 `QUIC` 协议。解决连接阻塞问题。