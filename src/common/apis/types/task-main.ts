/**
 * [INPUT]: 由 OpenAPI 的 task-main schemas / 请求参数生成
 * [OUTPUT]: 对外提供 task-main 模块的请求与响应契约类型
 * [POS]: src/common/apis/types 的自动生成类型文件，重新生成会整文件覆盖
 */

/** TaskMain 下拉选项 */
export interface BaseDropTaskMain {
  id?: number /** 主键 ID */
  name?: string /** 名称 */
  data?: TaskMain /** 关联数据 */
}

/** 新增任务请求参数 */
export interface CreateTaskSo {
  uploadFileId: number /** 上传文件id */
  sourceType: "USER_SUBMIT" | "API_CALL" | "BATCH_IMPORT" /** 来源: user_submit(用户提交), api_call(接口调用), batch_import(批量导入) */
  sceneType: "ONLINE_PREVIEW" | "LOCAL_OPEN" | "FILE_EXPORT" /** 场景: online_preview(在线预览), local_open(本地打开), file_export(文件出网) */
}

/** 排序项 */
export interface OrderItem {
  column?: string /** 排序字段 */
  asc?: boolean /** 是否升序 */
}

/** 分页查询参数 */
export interface PageQuerySo {
  pageSize?: number /** 分页大小 */
  pageCurrent?: number /** 当前页 */
  orderColumn?: string /** 排序字段 */
  orderType?: string /** 排序方式 */
  entity?: TaskMainPageVo /** 实体参数 */
}

/** TaskMainPageVo 分页结果 */
export interface PageTaskMainPageVo {
  records?: TaskMainPageVo[] /** 数据列表 */
  total?: number /** 总条数 */
  size?: number /** 每页条数 */
  current?: number /** 当前页码 */
  orders?: OrderItem[] /** 排序规则 */
  optimizeCountSql?: PageTaskMainPageVo
  searchCount?: PageTaskMainPageVo
  optimizeJoinOfCountSql?: boolean
  maxLimit?: number
  countId?: string
  pages?: number /** 总页数 */
}

/** 文件处理主任务表 */
export interface TaskMain {
  id?: number /** 主键 ID */
  taskNo?: string /** 任务编号 (如 MD-20260525-018) */
  fileName?: string /** 原始文件名 */
  sourceType?: "USER_SUBMIT" | "API_CALL" | "BATCH_IMPORT" /** 来源: user_submit(用户提交), api_call(接口调用), batch_import(批量导入) */
  sceneType?: "ONLINE_PREVIEW" | "LOCAL_OPEN" | "FILE_EXPORT" /** 场景: online_preview(在线预览), local_open(本地打开), file_export(文件出网) */
  currentStep?: "PARSING" | "IDENTIFY" | "REVIEW" | "MASKING" | "WARNING" | "CALLBACK" | "FINISHED" /** 当前环节: PARSING(解析), IDENTIFY(识别), REVIEW(复核), MASKING(脱敏), CALLBACK(回传), FINISHED(完成) */
  stepStatus?: "PENDING" | "PROCESSING" | "SUCCESS" | "FAIL" /** 环节状态: PENDING(待处理), PROCESSING(进行中), SUCCESS(成功), FAIL(失败) */
  secretCount?: number /** 识别出的密点总数 */
  uploadFileId?: number /** 上传文件ID */
  fileMd5?: string /** 文件MD5 */
  riskLevel?: string /** 整体风险等级: HIGH, MEDIUM, LOW */
  isDeleted?: boolean /** 逻辑删除 */
  createTime?: string /** 创建时间 */
  editTime?: string /** 修改时间 */
}

/** 文件处理主任务表分页Vo */
export interface TaskMainPageVo {
  id?: number /** id */
  taskNo?: string /** 任务编号 */
  fileName?: string /** 原始文件名 */
  sourceType?: "USER_SUBMIT" | "API_CALL" | "BATCH_IMPORT" /** 来源 */
  sceneType?: "ONLINE_PREVIEW" | "LOCAL_OPEN" | "FILE_EXPORT" /** 场景 */
  currentStep?: "PARSING" | "IDENTIFY" | "REVIEW" | "MASKING" | "WARNING" | "CALLBACK" | "FINISHED" /** 当前环节 */
  nextStep?: "PARSING" | "IDENTIFY" | "REVIEW" | "MASKING" | "WARNING" | "CALLBACK" | "FINISHED" /** 下一环节 */
  stepStatus?: "PENDING" | "PROCESSING" | "SUCCESS" | "FAIL" /** 环节状态 */
  secretCount?: number /** 识别出的密点总数 */
  riskLevel?: string /** 整体风险等级 */
  createTime?: string /** 创建时间 */
  editTime?: string /** 修改时间 */
  uploadFileType?: string /** 上传文件类型: PDF, WORD, EXCEL, TXT, IMG */
  parseAbility?: string /** 解析能力 */
  securityAttribute?: string /** 安全属性 */
}

/** 获取文件处理主任务表 - 请求参数 */
export interface GetDetailByIdTaskMainParams {
  id: number /** 主键 ID */
}

/** 下拉接口-根据环节查询主任务 - 请求参数 */
export interface DropdownByStepTaskMainParams {
  currentStep?: "PARSING" | "IDENTIFY" | "REVIEW" | "MASKING" | "WARNING" | "CALLBACK" | "FINISHED"
}

/** 删除文件处理主任务表 - 请求参数 */
export interface DeleteOneTaskMainParams {
  id: number /** 主键 ID */
}

/** 批量删除文件处理主任务表 - 请求参数 */
export interface BatchDelTaskMainParams {
  ids: number[] /** ID 列表 */
}
