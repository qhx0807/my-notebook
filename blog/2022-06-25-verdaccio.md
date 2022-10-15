---
slug: verdaccio
title: Verdaccio搭建私有NPM仓库及使用方法
---

# 使用 Verdaccio 搭建私有NPM仓库

官方网站 [verdaccio](https://verdaccio.org/)

## docker 安装 verdaccio

1. 拉取镜像

```sh
docker pull verdaccio/verdaccio
```

2. 运行 verdaccio

```sh
docker run -it --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

启动成功后可以访问 4873 端口，有一个默认网站。

3. 映射本地目录

在 `/data/docker/verdaccio/conf` 目录下新建 `config.yaml` 配置文件，(使用其他目录时注意下面的命令对应修改)

```yaml
storage: /verdaccio/storage/data
plugins: /verdaccio/plugins

# 通过web访问
web:
  title: Verdaccio-NPM

auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
    # max_users：1000 # 最大用户数，-1为禁止注册

uplinks:
  npmjs:
    url: https://registry.npmjs.org

packages:
  '@*/*':
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs

  '**':
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs

sever:
  keepAliveTimeout: 60

middlewares:
  audit:
    enabled: true

logs: { type: stdout, format: pretty, level: http }
```

运行命令：

```sh
docker run -it --name verdaccio -p 4873:4873 -v /data/docker/verdaccio/storage:/verdaccio/storage -v /data/docker/verdaccio/conf:/verdaccio/conf -v /data/docker/verdaccio/plugins:/verdaccio/plugins verdaccio/verdaccio
```

注意：`/home/verdaccio/storage` 需要写权限，这里面是保存的下载过的npm包。

```sh
chown -R 10001:65533 /data/docker/verdaccio/storage
```

4. 其他注意事项

`/data/docker/verdaccio/conf` -  配置文件，可在此修改配置，修改后重启docker。

5. 在后续使用过程中可能出现的错误

例如： `http://192.168.21.46:4873/type-is` 在查找 `type-is` 这个包的时候报错500


解决办法： 找到 `/home/verdaccio/storage/data` 中找到 `type-is` 这个文件夹然后将其删除即可。

## NPM 源使用方法

1. 在本地安装 `nrm`

```sh
npm install nrm -g
```

2. 查看所有源

```sh
nrm ls
```

3. 添加源

```sh
nrm add verdaccio http://192.168.21.46:4873
```

4. 切换源

```sh
nrm use verdaccio // 使用自己安装的verdaccio源

nrm use npm // 切回npm源
```

注意： 此方法切换源后是全局作用，如果仅针对单个项目，可以使用 `.npmrc` 方式修改。

## 包发布与使用

1. 在切换 `verdaccio` 源后，先添加用户

```sh
npm adduser
```

输入用户名及密码相关信息

2. 发布包

```sh
npm publish // 注意每次发布的version
```

3. 使用包

和正常的npm使用一致。


在 `http://192.168.21.46:4873` 上可查看到所有的包。


