# 学生教学管理一体化信息系统微信小程序

本项目是学生教学管理一体化信息系统的移动端配套程序，面向学生、教师、管理员三类用户提供常用教务功能入口。小程序通过后端 `MiniProgramApiController` 调用桌面端系统提供的数据接口，用于补充桌面端在移动场景下的查询与轻量操作体验。

## 主要功能

### 👨‍🎓 学生 (Student)

- **我的课表**: 按周查看个人课表，支持左右滑动切换周次，并可查看课程详情。
- **总课表**: 查看整个学期的课程安排总览，便于确认完整排课信息。
- **在线选课**: 查看可选课程、已选课程和数量统计，支持选课、退课，并展示课程时间与地点信息。
- **我的成绩**: 查询已选课程成绩，区分暂无成绩、及格和不及格状态。

### 👩‍🏫 教师 (Teacher)

- **授课课表**: 查看个人授课安排，支持按周浏览课程分布。
- **我的课程**: 查看本人所授课程列表及学分信息。
- **成绩录入**: 按课程查看选课学生名单，支持批量录入、修改和清空成绩。

### 🛡️ 管理员 (Admin)

- **系统状态**: 查看用户、学生、教师、课程、班级等核心统计数据。

## 页面结构

- `pages/index`: 登录页
- `pages/main`: 默认首页 / 周课表
- `pages/master-sis`: 学期总课表
- `pages/course-selection`: 学生在线选课
- `pages/grades`: 学生成绩查询
- `pages/my-courses`: 教师课程列表
- `pages/teacher-grade-entry`: 教师成绩录入
- `pages/admin-stats`: 管理员统计页

## 对接接口

小程序当前使用的主要接口如下：

- `POST /api/miniprogram/login`
- `GET /api/miniprogram/timetable`
- `GET /api/miniprogram/grades`
- `GET /api/miniprogram/mycourses`
- `GET /api/miniprogram/teacher-grade-entry`
- `POST /api/miniprogram/teacher-grade-entry/save`
- `GET /api/miniprogram/stats`
- `GET /api/miniprogram/course-selection`
- `GET /api/miniprogram/course-selection/enrolled`
- `POST /api/miniprogram/course-selection/select`
- `POST /api/miniprogram/course-selection/withdraw`

## 技术说明

- **框架**: 微信小程序原生开发
- **界面实现**: `WXML` + `WXSS` + `JavaScript`
- **数据来源**: ASP.NET 后端 Web API
- **登录态管理**: 使用本地缓存保存 `userInfo`，并通过统一的 `utils/auth.js` 处理自动跳过登录页、失效回登录页等逻辑
- **接口配置**: 使用 `utils/api.js` 统一维护本地开发接口地址，当前默认联调地址为 `http://localhost:53798/api/miniprogram`
- **回归验证**: 提供 `scripts/auth-status.test.js` 用于验证登录态状态码判断逻辑
- **运行依赖**: 微信开发者工具、已启动的后端服务

## 近期补充

- 重构登录页视觉风格，统一到当前小程序业务页的玻璃卡片与浅色渐变设计语言。
- 新增教师成绩录入页，支持按课程查看学生名单并批量保存成绩。
- 学生在线选课页补充了已选课程展示与选课后课表自动刷新逻辑。
- 统一接入本地登录态保持逻辑，用户已登录时再次打开小程序可直接进入系统。
- 将业务失败与鉴权失败分离处理，普通 `400/404` 业务异常不再误触发“重新登录”。
- 本地开发默认改为走 IIS Express 的 HTTP 绑定，避免微信开发者工具无法信任本地自签名 HTTPS 证书。

## 运行方式

1. 使用微信开发者工具打开项目目录 `C:\Users\Croilan\WeChatProjects\SIS-WxMiniProgram`。
2. 确认后端项目已启动。当前默认本地联调地址为 `http://localhost:53798/api/miniprogram`，如本机 IIS Express 端口不同，请同步修改 `utils/api.js`。
3. 在微信开发者工具中执行“编译”或“清缓存并编译”，使用测试账号登录后即可按角色访问对应页面。

## 测试账号说明

默认测试账号与后端数据库初始化脚本保持一致，例如：

- **管理员**: `admin`
- **学生**: `S2101001`
- **教师**: `T001`

默认密码请以当前后端项目 `db/sql.sql` 初始化脚本中的实际配置为准。

## 自动化校验

项目提供了一个轻量回归脚本，用于校验登录态状态码判断逻辑：

```powershell
node scripts/auth-status.test.js
```
