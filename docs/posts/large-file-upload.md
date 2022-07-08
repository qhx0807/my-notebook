---
title: 大文件上传：文件切片，断点续传
sidebar_position: 3
sidebar_label: 大文件上传
date: 2022-07-08
---

从零搭建一个大文件上传的 demo，实现文件分片上传，断点续传等功能。

## 整体思路

### 前端

主要是利用 `Blob.prototype.slice()` 方法，将文件按一定大小切片，然后使用普通的文件上传方法将切片上传至服务端，并且记录切片的顺序，服务端需要按顺序合并切边。上传时要注意 http 的并发限制。

### 后端

后端要做的主要有：

- 保存切片
- 合并切片，删除切片

主要的问题有：

1. 合并切片的时机，和前端信息需要同步，可以在接受完所有切片数量时进行合并，也可以在前端上传完所有时，额外发送一个请求通知后端合并。
2. 如何进行切片合并，根据不同的后端技术有不同的方案，本 demo 使用 nodes.js，关于合并文件的 API 有：

- `Buffer.concat`
- `fs.appendFile`
- `writeStream/readStream`

经过分析，使用流 `stream` 是最合适的方案，内存占用低。

## 前端部分

使用 React 建立一个新项目

### 上传组件

```jsx
import { useRef, useState } from "react";
import request from "./xhr.js";
import "./App.css";
function App() {
  const inputRef = useRef(null);
  const [selectFile, setSelectFile] = useState(null);

  function onSelectFile(e) {
    if (e.target.files.length > 0) {
      setSelectFile(e.target.files[0]);
    } else {
      setSelectFile(null);
    }
  }
  function clear() {
    inputRef.current.value = "";
  }
  return (
    <div className="App">
      <div>
        <input type="file" ref={inputRef} onChange={onSelectFile} />
      </div>
      <button onClick={clear}>clear</button>
      <button onClick={upload}>upload</button>
    </div>
  );
}
export default App;
```

### 网络请求方法

使用 `XMLHttpRequest` 简单封装一个 `request` 方法

```js
// xhr.js
const request = ({ url, method = "POST", data = {}, headers = {} }) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    // xhr必须先open，再setHeader
    Object.keys(headers).forEach((key) =>
      xhr.setRequestHeader(key, headers[key])
    );
    xhr.send(data);
    xhr.onload = (e) => {
      resolve({
        data: e.target.response,
      });
    };
  });
};
```

### 文件切片上传

```js
async function upload() {
  const chunks = createFileChunk(selectFile);
  await uploadChunks(chunks);
}

/**
 * 分割文件
 * 生成文件切片，每个切片的大小为SIZE
 * File的原型上有 Blob, 使用Blob.slice()方法切片
 * @param {File} file
 * @param {number} [size=SIZE]
 * @return {Blob[]}
 */
function createFileChunk(file, size = SIZE) {
  const chunks = [];
  const chunkSize = Math.ceil(file.size / size);
  for (let i = 0; i < chunkSize; i++) {
    const start = i * size;
    const end = start + size;
    const chunk = file.slice(start, end);
    chunks.push({
      chunk,
      hash: file.name + "-" + i,
    });
  }
  return chunks;
}

/**
 * 上传文件切片
 * 上传完成后发送合并请求
 * @param {Bolb[]} chunks
 */
async function uploadChunks(chunks) {
  const requestList = chunks
    .map((item) => {
      const formData = new FormData();
      formData.append("chunk", item.chunk);
      formData.append("hash", item.hash);
      formData.append("filename", selectFile.name);
      return { formData };
    })
    .map(({ formData }) =>
      request({
        url: `${UPLOAD_URL}/upload`,
        data: formData,
      })
    );

  await Promise.all(requestList);
}
```

### 发送合并请求

```js
async function merageChunks() {
  await request({
    url: `${UPLOAD_URL}/merge`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      filename: selectFile.name,
      size: SIZE,
    }),
  });
}
```
