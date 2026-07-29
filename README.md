# Lithos 本地离线版

本项目已将页面使用的背景图、揭示图、Inter 字体和 Playfair Display 字体全部保存到 `public/assets`。

网站运行时只读取本地文件，不依赖远程图片、远程字体或第三方接口。

## 本地运行

在本文件夹中安装依赖后启动开发预览，或完成构建后使用本地静态服务打开 `dist`。

## GitHub Pages 部署

项目已包含 GitHub Pages 自动部署流程。代码推送到 `main` 分支后，GitHub Actions 会使用锁定的依赖构建网站，并将 `dist` 发布到 GitHub Pages。

自定义域名为 `fbc-ch.work`，其 `CNAME` 文件会随构建结果一同发布。首次发布前，请在 GitHub 仓库的 Pages 设置中选择 **GitHub Actions** 作为发布来源，并确认域名的 DNS 已指向该 GitHub Pages 站点。
