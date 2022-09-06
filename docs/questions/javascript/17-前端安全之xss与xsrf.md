---
title: 17. 前端安全之xss与xsrf
---

## xss

跨站脚本攻击(Cross Site Scripting) 为了不和css(层叠样式表)混淆，故记为xss.

1、输入过滤

对用户的输入进行过滤，包括text、post等等所有输入进行可靠性检测。

2、转义

与正则的思想类似，对比如<、>等等特殊字符进行转义处理。

### CSP

`Content Security Policy`。 CSP 只允许加载指定的脚本及样式，最大限度地防止 XSS 攻击，是解决 XSS 的最优解。

CSP 的设置根据加载页面时 http 的响应头 Content Security Policy 在服务器端控制。

可以设置信任域名才可以访问 script / audio / video / image ...

Content Security Policy 入门教程： http://www.ruanyifeng.com/blog/2016/09/csp.html


## xsrf

xsrf 的全称是“跨站请求伪造”，它利用的是服务器对客户端浏览器的信任，从而伪造用户向服务器发送请求，从而欺骗服务器达到一些目的。

1、token验证

2、验证码

3、Referer 字段