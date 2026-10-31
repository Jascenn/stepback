# StepBack

StepBack 是一个面向日常康复记录场景的本地优先 Web 应用。它把疼痛、肿胀、
负重、训练、活动和每周测试记录在同一份档案中，并生成趋势、风险提示、
恢复评分和可导出的报告。

> 本项目用于个人记录和辅助整理，不替代医生诊断、治疗或紧急医疗建议。

## 功能

- 记录每日疼痛、肿胀、负重、训练、步数和活动情况
- 根据连续记录计算恢复评分、趋势和风险提示
- 提供骨折、韧带损伤、扭伤和术后等记录模板
- 展示恢复时间轴、里程碑和每周测试
- 导出 JSON、Excel 和 PDF 报告
- 支持 PWA 安装和离线打开

## 数据与隐私

应用默认把档案和记录保存在当前浏览器的 `localStorage` 中，不会自动上传到
业务后端。应用会请求公开的康复指南 JSON；发布到静态托管平台时，平台仍可能
按照其自身政策记录常规访问日志。

清除浏览器站点数据会删除本地记录。重要数据请定期使用应用内的 JSON、Excel
或 PDF 导出功能备份。

## 本地运行

要求 Node.js 22 或兼容版本。

```bash
npm ci
npm run dev
```

常用命令：

```bash
npm run lint
npm run build
npm run preview
```

## 项目结构

```text
src/
├── components/   # 页面、表单、图表和设置组件
├── hooks/        # 状态、提醒和指南缓存逻辑
├── lib/          # 评分、预测、导出、模板和本地存储
├── types/        # TypeScript 类型
└── assets/       # 应用内资源
public/           # PWA 与指南静态资源
scripts/          # GitHub Pages 部署辅助脚本
```

## 贡献

提交前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。安全问题请按照
[SECURITY.md](SECURITY.md) 私下报告，不要公开提交真实密钥或个人健康数据。

## License

[MIT](LICENSE)
