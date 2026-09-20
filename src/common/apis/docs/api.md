# temp-maven Api Doc

> 版本: Application Version: 1.0, Spring Boot Version: 4.0.6
> 文档规范: OpenAPI 3.x
> 描述: 此文档由脚本生成，旨在供 AI 助手理解系统接口定义。

## 1. 数据模型定义 (Data Models)

以下是系统中涉及的所有数据结构的 TypeScript 接口定义：

```typescript
interface UploadFile { // 上传的文件表
  id?: number; // 自增ID
  oriFileName?: string; // 文件原始名称
  saveUri?: string; // 文件保存的uri
  createTime?: string; // 创建时间
}

interface ResultBoolean {
  message?: string;
  code?: number;
  data?: boolean;
}

interface TaskMain { // 文件处理主任务表
  id?: number;
  taskNo?: string; // 任务编号 (如 MD-20260525-018)
  fileName?: string; // 原始文件名
  sourceType?: 'USER_SUBMIT' | 'API_CALL' | 'BATCH_IMPORT'; // 来源: user_submit(用户提交), api_call(接口调用), batch_import(批量导入)
  sceneType?: 'ONLINE_PREVIEW' | 'LOCAL_OPEN' | 'FILE_EXPORT'; // 场景: online_preview(在线预览), local_open(本地打开), file_export(文件出网)
  currentStep?: 'PARSING' | 'IDENTIFY' | 'REVIEW' | 'MASKING' | 'WARNING' | 'CALLBACK' | 'FINISHED'; // 当前环节: PARSING(解析), IDENTIFY(识别), REVIEW(复核), MASKING(脱敏), CALLBACK(回传), FINISHED(完成)
  stepStatus?: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAIL'; // 环节状态: PENDING(待处理), PROCESSING(进行中), SUCCESS(成功), FAIL(失败)
  secretCount?: number; // 识别出的密点总数
  uploadFileId?: number; // 上传文件ID
  fileMd5?: string; // 文件MD5
  riskLevel?: string; // 整体风险等级: HIGH, MEDIUM, LOW
  isDeleted?: boolean; // 逻辑删除
  createTime?: string; // 创建时间
  editTime?: string; // 修改时间
}

interface TaskFileDetail { // 文件解析详情表 (支持一对多)
  id?: number;
  taskId?: number; // 关联主任务ID
  fileName?: string; // 文件名 (如果是压缩包内的文件)
  fileType?: string; // 文件后缀: PDF, WORD, EXCEL, TXT, IMG
  parseAbility?: string; // 解析能力
  securityAttribute?: string; // 安全属性
  parseStatus?: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAIL'; // 解析状态: PENDING, SUCCESS, FAIL
  parseResult?: string; // 解析结果
  isDeleted?: boolean; // 逻辑删除
  createTime?: string; // 创建时间
  editTime?: string; // 修改时间
}

interface SysUser { // 用户
  id?: number;
  username?: string; // 用户名
  name?: string; // 名称
  password?: string; // 密码
  userRole?: 'GENERAL_USER' | 'SYSTEM_ADMIN' | 'SECURITY_ADMIN' | 'SECURITY_AUDITOR'; // 用户权限: GENERAL_USER(一般用户), SYSTEM_ADMIN(系统管理员), SECURITY_ADMIN(安全管理员), SECURITY_AUDITOR(安全审计员)
  createTime?: string; // 创建时间
  editTime?: string; // 修改时间
  isDeleted?: boolean; // 逻辑删除
}

interface SysDict { // 系统字典表
  id?: number;
  dictType?: 'SOURCE_TYPE' | 'SCENE_TYPE' | 'SECRET_POINT_TYPE' | 'REVIEW_CONCLUSION'; // 字典类型：来源类型、场景类型
  userId?: number; // 所属用户ID，为空表示公共字典
  dictCode?: string; // 字典编码
  dictName?: string; // 字典名称
  sortOrder?: number; // 排序
  status?: number; // 状态: 1启用 0禁用
  isDeleted?: boolean; // 逻辑删除: true已删除
  createTime?: string; // 创建时间
  editTime?: string; // 修改时间
}

interface SysAuditLog { // 系统操作审计日志表
  id?: number;
  createTime?: string; // 创建时间
  username?: string; // 操作用户的username
  ipAddress?: string; // 操作IP
  module?: 'PARSING' | 'IDENTIFY' | 'REVIEW' | 'MASKING' | 'WARNING' | 'CALLBACK' | 'FINISHED' | 'GENERAL'; // 所属模块
  actionType?: 'DISPOSE_WARNING' | 'CONFIRM_SECRET' | 'QUERY_RESULT' | 'IGNORE_WARNING' | 'TASK_PARSE' | 'TASK_IDENTIFY' | 'TASK_MASKING' | 'TASK_EARLY_WARNING' | 'LOGIN'; // 操作动作
  targetObject?: string; // 操作对象 (如任务号、用户名)
  resultStatus?: 'SUCCESS' | 'FAILED'; // 执行结果
  actionDesc?: string; // 操作详情
}

interface SecretPoint { // 密点标注与复核表
  id?: number;
  taskId?: number; // 关联主任务ID
  fileName?: string; // 关联文件名称
  detectionResult?: string; // 密点检测结果
  status?: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAIL'; // 状态
  isDeleted?: boolean; // 逻辑删除
  createTime?: string; // 创建时间
  editTime?: string; // 修改时间
}

interface ReviewItem { // 复合条目表
  taskId?: number; // 关联主任务ID
  secertPointId?: number; // 关联的密点记录id
  isDeleted?: boolean; // 逻辑删除
  createTime?: string; // 创建时间
  editTime?: string; // 修改时间
  id?: number;
  content?: string; // 密点内容
  type?: string; // 密点类型
  typeId?: number; // 密点类型id
  evidence?: string; // 依据
  confidence?: number; // 置信度
  reviewStatus?: 'NEED_REVIEW' | 'CONFIRMABLE' | 'NEED_EVIDENCE' | 'REJECTED' | 'CONFIRMED'; // 复审状态
  reviewConclusion?: string; // 复合结论
  reviewConclusionId?: number; // 复合结论id
  reviewOpinion?: string; // 复核意见
  supplementEvidence?: string; // 补充依据描述
}

interface MaskingResult { // 脱敏结果记录表
  id?: number;
  taskId?: number; // 关联主任务ID
  maskedFilePath?: string; // 脱敏后文件的存储路径
  originalResult?: string; // 脱敏算法返回的原始结果
  status?: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAIL'; // 状态
  isDeleted?: boolean; // 逻辑删除
  createTime?: string; // 创建时间
  editTime?: string; // 修改时间
}

interface InterfaceCallbackLog { // 接口回传日志表
  id?: number;
  taskId?: number; // 关联主任务ID
  algorithmConfigId?: number; // 关联算法配置ID
  step?: 'PARSING' | 'IDENTIFY' | 'REVIEW' | 'MASKING' | 'WARNING' | 'CALLBACK' | 'FINISHED'; // 所属环节: PARSING(解析), IDENTIFY(识别), REVIEW(复核), MASKING(脱敏), CALLBACK(回传), FINISHED(完成)
  userId?: number; // 用户ID
  userName?: string; // 用户名
  deptName?: string; // 部门名称
  success?: boolean; // 是否成功
  averageTime?: number; // 平均耗时(s)
  isDeleted?: boolean; // 逻辑删除
  createTime?: string; // 创建时间
  editTime?: string; // 修改时间
}

interface EarlyWarning { // 预警事件
  id?: number;
  taskId?: number; // mainTaskId
  eventName?: string; // 事件描述
  isDeleted?: boolean; // 逻辑删除
  createTime?: string; // 创建时间
  editTime?: string; // 修改时间
  docClassificationLevel?: string; // 文件密级
  identifyClassificationLevel?: string; // 识别密级
  userClassificationLevel?: string; // 用户密级
  disposalSuggestions?: string; // 处置建议
  status?: 'PENDING' | 'HIGH_RISK' | 'PENDING_CONFIRM' | 'PROCESSING' | 'HANDLED'; // 状态: PENDING(待处理), HIGH_RISK(高风险), PENDING_CONFIRM(待确认), PROCESSING(处理中), HANDLED(已处理)
}

interface AlgorithmConfig { // 算法配置表
  id?: number;
  name?: string; // 算法名称
  envPath?: string; // 算法执行环境路径
  reqUri?: string; // 请求地址
  createTime?: string; // 创建时间
  scriptPath?: string; // 算法API文件路径
  keyword?: string; // 给与的额外查询关键字
  step?: 'PARSING' | 'IDENTIFY' | 'REVIEW' | 'MASKING' | 'WARNING' | 'CALLBACK' | 'FINISHED'; // 算法所属环节: PARSING(解析), IDENTIFY(识别), REVIEW(复核), MASKING(脱敏), CALLBACK(回传), FINISHED(完成)
  callType?: string; // 调用方式
  authType?: string; // 认证方式
}

interface PageQuerySo {
  pageSize?: number; // 分页大小
  pageCurrent?: number; // 当前页
  orderColumn?: string; // 排序字段
  orderType?: string; // 排序方式
  entity?: UploadFile; // 实体参数
}

interface OrderItem {
  column?: string;
  asc?: boolean;
}

interface PageUploadFile {
  records?: UploadFile[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageUploadFile;
  searchCount?: PageUploadFile;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageUploadFile {
  message?: string;
  code?: number;
  data?: PageUploadFile;
}

interface ResultUploadFile {
  message?: string;
  code?: number;
  data?: UploadFile;
}

interface PageTaskMainPageVo {
  records?: TaskMainPageVo[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageTaskMainPageVo;
  searchCount?: PageTaskMainPageVo;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageTaskMainPageVo {
  message?: string;
  code?: number;
  data?: PageTaskMainPageVo;
}

interface TaskMainPageVo { // 文件处理主任务表分页Vo
  id?: number; // id
  taskNo?: string; // 任务编号
  fileName?: string; // 原始文件名
  sourceType?: 'USER_SUBMIT' | 'API_CALL' | 'BATCH_IMPORT'; // 来源
  sceneType?: 'ONLINE_PREVIEW' | 'LOCAL_OPEN' | 'FILE_EXPORT'; // 场景
  currentStep?: 'PARSING' | 'IDENTIFY' | 'REVIEW' | 'MASKING' | 'WARNING' | 'CALLBACK' | 'FINISHED'; // 当前环节
  nextStep?: 'PARSING' | 'IDENTIFY' | 'REVIEW' | 'MASKING' | 'WARNING' | 'CALLBACK' | 'FINISHED'; // 下一环节
  stepStatus?: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAIL'; // 环节状态
  secretCount?: number; // 识别出的密点总数
  riskLevel?: string; // 整体风险等级
  createTime?: string; // 创建时间
  editTime?: string; // 修改时间
  uploadFileType?: string; // 上传文件类型: PDF, WORD, EXCEL, TXT, IMG
  parseAbility?: string; // 解析能力
  securityAttribute?: string; // 安全属性
}

interface CreateTaskSo { // 新增任务请求参数
  uploadFileId?: number; // 上传文件id
  sourceType?: 'USER_SUBMIT' | 'API_CALL' | 'BATCH_IMPORT'; // 来源: user_submit(用户提交), api_call(接口调用), batch_import(批量导入)
  sceneType?: 'ONLINE_PREVIEW' | 'LOCAL_OPEN' | 'FILE_EXPORT'; // 场景: online_preview(在线预览), local_open(本地打开), file_export(文件出网)
}

interface ResultInteger {
  message?: string;
  code?: number;
  data?: number;
}

interface ResultTaskMain {
  message?: string;
  code?: number;
  data?: TaskMain;
}

interface StartTaskFileDetailSo { // 开始执行文件解析请求参数
  taskFileDetailId?: number; // 文件解析详情ID
}

interface ResultVoid {
  message?: string;
  code?: number;
  data?: any;
}

interface PageTaskFileDetail {
  records?: TaskFileDetail[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageTaskFileDetail;
  searchCount?: PageTaskFileDetail;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageTaskFileDetail {
  message?: string;
  code?: number;
  data?: PageTaskFileDetail;
}

interface ResultTaskFileDetail {
  message?: string;
  code?: number;
  data?: TaskFileDetail;
}

interface PageSysUser {
  records?: SysUser[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageSysUser;
  searchCount?: PageSysUser;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageSysUser {
  message?: string;
  code?: number;
  data?: PageSysUser;
}

interface LoginSo { // 用户登录请求参数
  username?: string; // 用户名
  password?: string; // 密码
}

interface LoginUserVo { // 用户登录结果Vo
  token?: string; // jwt token
  user?: SysUser; // 用户信息
}

interface ResultLoginUserVo {
  message?: string;
  code?: number;
  data?: LoginUserVo;
}

interface ResultSysUser {
  message?: string;
  code?: number;
  data?: SysUser;
}

interface PageSysDict {
  records?: SysDict[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageSysDict;
  searchCount?: PageSysDict;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageSysDict {
  message?: string;
  code?: number;
  data?: PageSysDict;
}

interface ResultSysDict {
  message?: string;
  code?: number;
  data?: SysDict;
}

interface PageSysAuditLog {
  records?: SysAuditLog[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageSysAuditLog;
  searchCount?: PageSysAuditLog;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageSysAuditLog {
  message?: string;
  code?: number;
  data?: PageSysAuditLog;
}

interface LogReviewOverviewVo { // 日志审查概览
  userOperationLogCount?: number; // 用户操作日志数量
  interfaceCallLogCount?: number; // 接口调用日志数量
  interfaceCallFailCount?: number; // 接口调用失败数量
}

interface ResultLogReviewOverviewVo {
  message?: string;
  code?: number;
  data?: LogReviewOverviewVo;
}

interface ResultSysAuditLog {
  message?: string;
  code?: number;
  data?: SysAuditLog;
}

interface StartTaskSecretPointSo { // 开始执行密点检查请求参数
  secretPointId?: number; // 密点ID
  algorithmConfigId?: number; // 算法配置ID
}

interface PageSecretPoint {
  records?: SecretPoint[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageSecretPoint;
  searchCount?: PageSecretPoint;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageSecretPoint {
  message?: string;
  code?: number;
  data?: PageSecretPoint;
}

interface ResultSecretPoint {
  message?: string;
  code?: number;
  data?: SecretPoint;
}

interface SupplementEvidenceSo { // 补充依据请求参数
  reviewItemId?: number; // 复合条目ID
  evidence?: string; // 依据内容
}

interface ResultReviewItem {
  message?: string;
  code?: number;
  data?: ReviewItem;
}

interface ReviewSo { // 复核/驳回请求参数
  reviewItemId?: number; // 复合条目ID
  reviewConclusion?: string; // 复核结论
  reviewConclusionId?: number; // 复核结论id
  reviewOpinion?: string; // 复核意见
  reviewStatus?: 'NEED_REVIEW' | 'CONFIRMABLE' | 'NEED_EVIDENCE' | 'REJECTED' | 'CONFIRMED'; // 复审状态
}

interface PageReviewItem {
  records?: ReviewItem[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageReviewItem;
  searchCount?: PageReviewItem;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageReviewItem {
  message?: string;
  code?: number;
  data?: PageReviewItem;
}

interface ConfirmReviewSo { // 确认复核请求参数
  reviewItemId?: number; // 复合条目ID
}

interface ManualReviewSo { // 手工标注请求参数
  secertPointId?: number; // 关联的密点记录id
  content?: string; // 密点内容
  type?: string; // 密点类型
  typeId?: number; // 密点类型id
  evidence?: string; // 依据
}

interface StartMaskingSo { // 开始执行脱敏任务请求参数
  maskingResultId?: number; // 脱敏结果记录ID
}

interface PageMaskingResult {
  records?: MaskingResult[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageMaskingResult;
  searchCount?: PageMaskingResult;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageMaskingResult {
  message?: string;
  code?: number;
  data?: PageMaskingResult;
}

interface ResultMaskingResult {
  message?: string;
  code?: number;
  data?: MaskingResult;
}

interface InterfaceCallbackLogOverviewSo { // 接口回传日志总览请求参数
  startDate?: string; // 开始日期
  endDate?: string; // 结束日期
  step?: 'PARSING' | 'IDENTIFY' | 'REVIEW' | 'MASKING' | 'WARNING' | 'CALLBACK' | 'FINISHED'; // 所属环节
}

interface ResultListUserCallDetailVo {
  message?: string;
  code?: number;
  data?: UserCallDetailVo[];
}

interface UserCallDetailVo { // 用户调用统计Vo
  userName?: string; // 用户名称
  deptName?: string; // 部门名称
  callCount?: number; // 调用次数
  successRate?: number; // 调用成功率
}

interface PageInterfaceCallbackLog {
  records?: InterfaceCallbackLog[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageInterfaceCallbackLog;
  searchCount?: PageInterfaceCallbackLog;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageInterfaceCallbackLog {
  message?: string;
  code?: number;
  data?: PageInterfaceCallbackLog;
}

interface InterfaceCallbackLogOverviewVo { // 接口回传日志总览Vo
  totalCount?: number; // 接口调用总次数
  stepCount?: number; // 调用的环节数量
  failCount?: number; // 调用失败次数
  averageTime?: number; // 平均响应时间(s)
}

interface ResultInterfaceCallbackLogOverviewVo {
  message?: string;
  code?: number;
  data?: InterfaceCallbackLogOverviewVo;
}

interface NameNumberVo { // 名称-数量Vo
  name?: string; // 名称
  number?: number; // 数量
}

interface ResultListNameNumberVo {
  message?: string;
  code?: number;
  data?: NameNumberVo[];
}

interface CallSystemStatVo { // 调用系统统计Vo
  algorithmName?: string; // 算法名称
  step?: string; // 所属阶段
  callCount?: number; // 调用次数
  lastCallTime?: string; // 最近一次调用时间
}

interface ResultListCallSystemStatVo {
  message?: string;
  code?: number;
  data?: CallSystemStatVo[];
}

interface AlgorithmDetailVo { // 算法详情Vo
  callType?: string; // 调用方式
  name?: string; // 算法名称
  reqUri?: string; // 请求地址
  callCount?: number; // 调用次数
  successRate?: number; // 调用成功率
  averageTime?: number; // 平均耗时(s)
}

interface ResultListAlgorithmDetailVo {
  message?: string;
  code?: number;
  data?: AlgorithmDetailVo[];
}

interface ResultInterfaceCallbackLog {
  message?: string;
  code?: number;
  data?: InterfaceCallbackLog;
}

interface StartEarlyWarningSo { // 开始执行预警检测请求参数
  mainTaskId?: number; // 主任务ID
}

interface PageEarlyWarning {
  records?: EarlyWarning[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageEarlyWarning;
  searchCount?: PageEarlyWarning;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageEarlyWarning {
  message?: string;
  code?: number;
  data?: PageEarlyWarning;
}

interface HandleEarlyWarningSo { // 处置预警事件请求参数
  earlyWarningId?: number; // 预警事件ID
  status?: 'PENDING' | 'HIGH_RISK' | 'PENDING_CONFIRM' | 'PROCESSING' | 'HANDLED'; // 状态
}

interface ResultEarlyWarning {
  message?: string;
  code?: number;
  data?: EarlyWarning;
}

interface PageAlgorithmConfig {
  records?: AlgorithmConfig[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageAlgorithmConfig;
  searchCount?: PageAlgorithmConfig;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageAlgorithmConfig {
  message?: string;
  code?: number;
  data?: PageAlgorithmConfig;
}

interface ResultAlgorithmConfig {
  message?: string;
  code?: number;
  data?: AlgorithmConfig;
}

interface BaseDropTaskMain {
  id?: number;
  name?: string;
  data?: TaskMain;
}

interface ResultListBaseDropTaskMain {
  message?: string;
  code?: number;
  data?: BaseDropTaskMain[];
}

interface BaseDropSysDict {
  id?: number;
  name?: string;
  data?: SysDict;
}

interface ResultListBaseDropSysDict {
  message?: string;
  code?: number;
  data?: BaseDropSysDict[];
}

interface DataOverviewVo { // 数据总览Vo
  todayFileCount?: number; // 今日接入文件
  identifiedPointCount?: number; // 已识别密点
  pendingReviewCount?: number; // 待人工复合
  highRiskWarningCount?: number; // 密级预警
}

interface ResultDataOverviewVo {
  message?: string;
  code?: number;
  data?: DataOverviewVo;
}

interface ResultString {
  message?: string;
  code?: number;
  data?: string;
}

interface BaseDropAlgorithmConfig {
  id?: number;
  name?: string;
  data?: AlgorithmConfig;
}

interface ResultListBaseDropAlgorithmConfig {
  message?: string;
  code?: number;
  data?: BaseDropAlgorithmConfig[];
}

```

## 2. 系统字典定义 (System Dictionary)

系统通过 `SysDict` 表统一管理枚举值。前端对接时使用 `dictType` 区分字典类别，`dictValue` 作为传输值，`name` 作为展示文案。

### DictType 枚举

```typescript
type DictType =
  | 'SOURCE_TYPE'
  | 'SCENE_TYPE'
  | 'SECRET_POINT_TYPE'
  | 'REVIEW_CONCLUSION'
```

### 字典类型对照表

| dictType | 关联字段 | 说明 |
| --- | --- | --- |
| `SOURCE_TYPE` | `sourceType` | 来源 |
| `SCENE_TYPE` | `sceneType` | 场景 |
| `SECRET_POINT_TYPE` | `secretPointType` | - |
| `REVIEW_CONCLUSION` | `reviewConclusion` | 复合结论 |

### 字典数据结构

```typescript
interface SysDictItem {
  id?: number;
  dictType?: DictType; // 字典类型
  dictValue?: string; // 字典值（用于传输/API 提交）
  name?: string; // 字典名称（用于界面展示）
  sortOrder?: number; // 排序号
  enabled?: boolean; // 是否启用
  pid?: number; // 父字典 ID，级联字典时传入
}

interface BaseDropSysDict {
  id?: number;
  name?: string; // 下拉展示文案
  data?: SysDictItem; // 完整字典项
}
```

### 获取字典下拉

- **Method**: `GET`
- **URL**: `/sys-dict/dropdown`
- **Query Parameters**:
  - `dictType`: DictType (Required) — 字典类型，见上表
  - `pid`: number (Optional, default: 0) — 父级字典 ID，获取子级选项时使用
- **Response**: `ResultListBaseDropSysDict` → `data: BaseDropSysDict[]`

> 级联关系示例：先请求 `dictType=DATA_MODALITY` 获取数据模态，再以其某项 `id` 作为 `pid` 请求 `dictType=DATA_TYPE` 获取下级选项。

## 3. 接口列表 (API Endpoints)

### 📂 上传的文件表

### 修改上传的文件表

- **Method**: `PUT`
- **URL**: `/temp/upload-file/update`
- **Request Body**: `UploadFile`
- **Response**: `ResultBoolean`

---

### 分页查询上传的文件表

- **Method**: `POST`
- **URL**: `/temp/upload-file/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageUploadFile`

---

### 新增上传的文件表

- **Method**: `POST`
- **URL**: `/temp/upload-file/add`
- **Request Body**: `UploadFile`
- **Response**: `ResultUploadFile`

---

### 获取上传的文件表

- **Method**: `GET`
- **URL**: `/temp/upload-file/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultUploadFile`

---

### 删除上传的文件表

- **Method**: `DELETE`
- **URL**: `/temp/upload-file/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除上传的文件表

- **Method**: `DELETE`
- **URL**: `/temp/upload-file/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 文件处理主任务表

### 修改文件处理主任务表

- **Method**: `PUT`
- **URL**: `/temp/task-main/update`
- **Request Body**: `TaskMain`
- **Response**: `ResultBoolean`

---

### 分页查询文件处理主任务表

- **Method**: `POST`
- **URL**: `/temp/task-main/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageTaskMainPageVo`

---

### 批量新增文件处理主任务表(从zip包导入)

- **Method**: `POST`
- **URL**: `/temp/task-main/batchAdd`
- **Request Body**: `CreateTaskSo`
- **Response**: `ResultInteger`

---

### 新增文件处理主任务表

- **Method**: `POST`
- **URL**: `/temp/task-main/add`
- **Request Body**: `CreateTaskSo`
- **Response**: `ResultTaskMain`

---

### 获取文件处理主任务表

- **Method**: `GET`
- **URL**: `/temp/task-main/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultTaskMain`

---

### 下拉接口-根据环节查询主任务

- **Method**: `GET`
- **URL**: `/temp/task-main/dropdownByStep`
- **Query / Path Parameters**:
  - `currentStep` (query): 'PARSING' | 'IDENTIFY' | 'REVIEW' | 'MASKING' | 'WARNING' | 'CALLBACK' | 'FINISHED' (Optional) 
- **Response**: `ResultListBaseDropTaskMain`

---

### 删除文件处理主任务表

- **Method**: `DELETE`
- **URL**: `/temp/task-main/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除文件处理主任务表

- **Method**: `DELETE`
- **URL**: `/temp/task-main/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 文件解析详情表 (支持一对多)

### 修改文件解析详情表 (支持一对多)

- **Method**: `PUT`
- **URL**: `/temp/task-file-detail/update`
- **Request Body**: `TaskFileDetail`
- **Response**: `ResultBoolean`

---

### ���始执行文件解析

- **Method**: `POST`
- **URL**: `/temp/task-file-detail/startTask`
- **Request Body**: `StartTaskFileDetailSo`
- **Response**: `ResultVoid`

---

### 分页查询文件解析详情表 (支持一对多)

- **Method**: `POST`
- **URL**: `/temp/task-file-detail/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageTaskFileDetail`

---

### 新增文件解析详情表 (支持一对多)

- **Method**: `POST`
- **URL**: `/temp/task-file-detail/add`
- **Request Body**: `TaskFileDetail`
- **Response**: `ResultTaskFileDetail`

---

### 获取文件解析详情表 (支持一对多)

- **Method**: `GET`
- **URL**: `/temp/task-file-detail/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultTaskFileDetail`

---

### 删除文件解析详情表 (支持一对多)

- **Method**: `DELETE`
- **URL**: `/temp/task-file-detail/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除文件解析详情表 (支持一对多)

- **Method**: `DELETE`
- **URL**: `/temp/task-file-detail/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 用户

### 修改用户

- **Method**: `PUT`
- **URL**: `/temp/sys-user/update`
- **Request Body**: `SysUser`
- **Response**: `ResultBoolean`

---

### 分页查询用户

- **Method**: `POST`
- **URL**: `/temp/sys-user/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageSysUser`

---

### 用户登录

- **Method**: `POST`
- **URL**: `/temp/sys-user/login`
- **Request Body**: `LoginSo`
- **Response**: `ResultLoginUserVo`

---

### 新增用户

- **Method**: `POST`
- **URL**: `/temp/sys-user/add`
- **Request Body**: `SysUser`
- **Response**: `ResultSysUser`

---

### 获取当前登录用户信息

- **Method**: `GET`
- **URL**: `/temp/sys-user/getInfo`
- **Response**: `ResultSysUser`

---

### 获取用户

- **Method**: `GET`
- **URL**: `/temp/sys-user/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultSysUser`

---

### 删除用户

- **Method**: `DELETE`
- **URL**: `/temp/sys-user/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除用户

- **Method**: `DELETE`
- **URL**: `/temp/sys-user/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 系统字典表

### 修改系统字典表

- **Method**: `PUT`
- **URL**: `/temp/sys-dict/update`
- **Request Body**: `SysDict`
- **Response**: `ResultBoolean`

---

### 分页查询系统字典表

- **Method**: `POST`
- **URL**: `/temp/sys-dict/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageSysDict`

---

### 新增系统字典表

- **Method**: `POST`
- **URL**: `/temp/sys-dict/add`
- **Request Body**: `SysDict`
- **Response**: `ResultSysDict`

---

### 获取系统字典表

- **Method**: `GET`
- **URL**: `/temp/sys-dict/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultSysDict`

---

### 字典下拉接口

- **Method**: `GET`
- **URL**: `/temp/sys-dict/drop`
- **Query / Path Parameters**:
  - `dictType` (query): 'SOURCE_TYPE' | 'SCENE_TYPE' | 'SECRET_POINT_TYPE' | 'REVIEW_CONCLUSION' (Required) 
- **Response**: `ResultListBaseDropSysDict`

---

### 根据当前登录用户查询字典下拉接口

- **Method**: `GET`
- **URL**: `/temp/sys-dict/dropByUser`
- **Query / Path Parameters**:
  - `dictType` (query): 'SOURCE_TYPE' | 'SCENE_TYPE' | 'SECRET_POINT_TYPE' | 'REVIEW_CONCLUSION' (Required) 
- **Response**: `ResultListBaseDropSysDict`

---

### 删除系统字典表

- **Method**: `DELETE`
- **URL**: `/temp/sys-dict/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除系统字典表

- **Method**: `DELETE`
- **URL**: `/temp/sys-dict/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 系统操作审计日志表

### 修改系统操作审计日志表

- **Method**: `PUT`
- **URL**: `/temp/sys-audit-log/update`
- **Request Body**: `SysAuditLog`
- **Response**: `ResultBoolean`

---

### 分页查询系统操作审计日志表

- **Method**: `POST`
- **URL**: `/temp/sys-audit-log/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageSysAuditLog`

---

### 日志审查概览

- **Method**: `POST`
- **URL**: `/temp/sys-audit-log/overview`
- **Response**: `ResultLogReviewOverviewVo`

---

### 新增系统操作审计日志表

- **Method**: `POST`
- **URL**: `/temp/sys-audit-log/add`
- **Request Body**: `SysAuditLog`
- **Response**: `ResultSysAuditLog`

---

### 获取系统操作审计日志表

- **Method**: `GET`
- **URL**: `/temp/sys-audit-log/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultSysAuditLog`

---

### 删除系统操作审计日志表

- **Method**: `DELETE`
- **URL**: `/temp/sys-audit-log/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除系统操作审计日志表

- **Method**: `DELETE`
- **URL**: `/temp/sys-audit-log/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 密点标注与复核表

### 修改密点标注与复核表

- **Method**: `PUT`
- **URL**: `/temp/secret-point/update`
- **Request Body**: `SecretPoint`
- **Response**: `ResultBoolean`

---

### 开始执行密点检测任务

- **Method**: `POST`
- **URL**: `/temp/secret-point/startTask`
- **Request Body**: `StartTaskSecretPointSo`
- **Response**: `ResultVoid`

---

### 分页查询密点标注与复核表

- **Method**: `POST`
- **URL**: `/temp/secret-point/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageSecretPoint`

---

### 新增密点标注与复核表

- **Method**: `POST`
- **URL**: `/temp/secret-point/add`
- **Request Body**: `SecretPoint`
- **Response**: `ResultSecretPoint`

---

### 获取密点标注与复核表

- **Method**: `GET`
- **URL**: `/temp/secret-point/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultSecretPoint`

---

### 删除密点标注与复核表

- **Method**: `DELETE`
- **URL**: `/temp/secret-point/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除密点标注与复核表

- **Method**: `DELETE`
- **URL**: `/temp/secret-point/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 复合条目表

### 修改复合条目表

- **Method**: `PUT`
- **URL**: `/temp/review-item/update`
- **Request Body**: `ReviewItem`
- **Response**: `ResultBoolean`

---

### 补充依据

- **Method**: `POST`
- **URL**: `/temp/review-item/supplement-evidence`
- **Request Body**: `SupplementEvidenceSo`
- **Response**: `ResultReviewItem`

---

### 复核/驳回

- **Method**: `POST`
- **URL**: `/temp/review-item/review`
- **Request Body**: `ReviewSo`
- **Response**: `ResultReviewItem`

---

### 分页查询复合条目表

- **Method**: `POST`
- **URL**: `/temp/review-item/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageReviewItem`

---

### 确认复核

- **Method**: `POST`
- **URL**: `/temp/review-item/confirm-review`
- **Request Body**: `ConfirmReviewSo`
- **Response**: `ResultReviewItem`

---

### 手工标注

- **Method**: `POST`
- **URL**: `/temp/review-item/add`
- **Request Body**: `ManualReviewSo`
- **Response**: `ResultReviewItem`

---

### 获取复合条目表

- **Method**: `GET`
- **URL**: `/temp/review-item/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultReviewItem`

---

### 删除复合条目表

- **Method**: `DELETE`
- **URL**: `/temp/review-item/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除复合条目表

- **Method**: `DELETE`
- **URL**: `/temp/review-item/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 脱敏结果记录表

### 修改脱敏结果记录表

- **Method**: `PUT`
- **URL**: `/temp/masking-result/update`
- **Request Body**: `MaskingResult`
- **Response**: `ResultBoolean`

---

### 开始执行脱敏任务

- **Method**: `POST`
- **URL**: `/temp/masking-result/startTask`
- **Request Body**: `StartMaskingSo`
- **Response**: `ResultVoid`

---

### 分页查询脱敏结果记录表

- **Method**: `POST`
- **URL**: `/temp/masking-result/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageMaskingResult`

---

### 新增脱敏结果记录表

- **Method**: `POST`
- **URL**: `/temp/masking-result/add`
- **Request Body**: `MaskingResult`
- **Response**: `ResultMaskingResult`

---

### 获取脱敏结果记录表

- **Method**: `GET`
- **URL**: `/temp/masking-result/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultMaskingResult`

---

### 删除脱敏结果记录表

- **Method**: `DELETE`
- **URL**: `/temp/masking-result/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除脱敏结果记录表

- **Method**: `DELETE`
- **URL**: `/temp/masking-result/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 接口回传日志表

### 修改接口回传日志表

- **Method**: `PUT`
- **URL**: `/temp/interface-callback-log/update`
- **Request Body**: `InterfaceCallbackLog`
- **Response**: `ResultBoolean`

---

### 用户调用统计

- **Method**: `POST`
- **URL**: `/temp/interface-callback-log/userCallDetails`
- **Request Body**: `InterfaceCallbackLogOverviewSo`
- **Response**: `ResultListUserCallDetailVo`

---

### 分页查询接口回传日志表

- **Method**: `POST`
- **URL**: `/temp/interface-callback-log/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageInterfaceCallbackLog`

---

### 接口回传总览

- **Method**: `POST`
- **URL**: `/temp/interface-callback-log/overview`
- **Request Body**: `InterfaceCallbackLogOverviewSo`
- **Response**: `ResultInterfaceCallbackLogOverviewVo`

---

### 每日调用趋势

- **Method**: `POST`
- **URL**: `/temp/interface-callback-log/dailyTrend`
- **Request Body**: `InterfaceCallbackLogOverviewSo`
- **Response**: `ResultListNameNumberVo`

---

### 调用系统统计

- **Method**: `POST`
- **URL**: `/temp/interface-callback-log/callSystemStats`
- **Request Body**: `InterfaceCallbackLogOverviewSo`
- **Response**: `ResultListCallSystemStatVo`

---

### 算法接口详情

- **Method**: `POST`
- **URL**: `/temp/interface-callback-log/algorithmDetails`
- **Request Body**: `InterfaceCallbackLogOverviewSo`
- **Response**: `ResultListAlgorithmDetailVo`

---

### 新增接口回传日志表

- **Method**: `POST`
- **URL**: `/temp/interface-callback-log/add`
- **Request Body**: `InterfaceCallbackLog`
- **Response**: `ResultInterfaceCallbackLog`

---

### 获取接口回传日志表

- **Method**: `GET`
- **URL**: `/temp/interface-callback-log/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultInterfaceCallbackLog`

---

### 删除接口回传日志表

- **Method**: `DELETE`
- **URL**: `/temp/interface-callback-log/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除接口回传日志表

- **Method**: `DELETE`
- **URL**: `/temp/interface-callback-log/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 预警事件

### 修改预警事件

- **Method**: `PUT`
- **URL**: `/temp/early-warning/update`
- **Request Body**: `EarlyWarning`
- **Response**: `ResultBoolean`

---

### 开始执行预警检测任务

- **Method**: `POST`
- **URL**: `/temp/early-warning/startTask`
- **Request Body**: `StartEarlyWarningSo`
- **Response**: `ResultVoid`

---

### 分页查询预警事件

- **Method**: `POST`
- **URL**: `/temp/early-warning/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageEarlyWarning`

---

### 处置预警事件

- **Method**: `POST`
- **URL**: `/temp/early-warning/handle`
- **Request Body**: `HandleEarlyWarningSo`
- **Response**: `ResultVoid`

---

### 新增预警事件

- **Method**: `POST`
- **URL**: `/temp/early-warning/add`
- **Request Body**: `EarlyWarning`
- **Response**: `ResultEarlyWarning`

---

### 获取预警事件

- **Method**: `GET`
- **URL**: `/temp/early-warning/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultEarlyWarning`

---

### 导出预警事件

- **Method**: `GET`
- **URL**: `/temp/early-warning/export`
- **Query / Path Parameters**:
  - `mainTaskId` (query): number (Required) 
- **Response**: `string`

---

### 删除预警事件

- **Method**: `DELETE`
- **URL**: `/temp/early-warning/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除预警事件

- **Method**: `DELETE`
- **URL**: `/temp/early-warning/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 算法配置表

### 修改算法配置表

- **Method**: `PUT`
- **URL**: `/temp/algorithm-config/update`
- **Request Body**: `AlgorithmConfig`
- **Response**: `ResultBoolean`

---

### 分页查询算法配置表

- **Method**: `POST`
- **URL**: `/temp/algorithm-config/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageAlgorithmConfig`

---

### 新增算法配置表

- **Method**: `POST`
- **URL**: `/temp/algorithm-config/add`
- **Request Body**: `AlgorithmConfig`
- **Response**: `ResultAlgorithmConfig`

---

### 获取算法配置表

- **Method**: `GET`
- **URL**: `/temp/algorithm-config/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultAlgorithmConfig`

---

### 下拉接口-根据环节查询算法配置

- **Method**: `GET`
- **URL**: `/temp/algorithm-config/dropdownByStep`
- **Query / Path Parameters**:
  - `step` (query): 'PARSING' | 'IDENTIFY' | 'REVIEW' | 'MASKING' | 'WARNING' | 'CALLBACK' | 'FINISHED' (Required) 
- **Response**: `ResultListBaseDropAlgorithmConfig`

---

### 删除算法配置表

- **Method**: `DELETE`
- **URL**: `/temp/algorithm-config/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除算法配置表

- **Method**: `DELETE`
- **URL**: `/temp/algorithm-config/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 公共接口

### 文件上传

- **Method**: `POST`
- **URL**: `/temp/public/upload`
- **Response**: `ResultUploadFile`

---

### 本周运行概况

- **Method**: `GET`
- **URL**: `/temp/public/weekly-overview`
- **Response**: `ResultListNameNumberVo`

---

### 密点类型分布

- **Method**: `GET`
- **URL**: `/temp/public/secret-point-type-distribution`
- **Response**: `ResultListNameNumberVo`

---

### 数据总览

- **Method**: `GET`
- **URL**: `/temp/public/overview`
- **Response**: `ResultDataOverviewVo`

---

### 📂 测试页面

### 你好

- **Method**: `GET`
- **URL**: `/temp/hello/`
- **Response**: `ResultString`

---

