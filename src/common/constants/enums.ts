/**
 * [INPUT]: 由 OpenAPI schema 中的 enum 字段生成
 * [OUTPUT]: 对外提供枚举常量与联合类型
 * [POS]: src/common/constants/enums.ts；</generated> 下方可手写扩展
 */

/* <generated> */
import type { EarlyWarning } from "@@/apis/types/early-warning"
import type { ReviewItem } from "@@/apis/types/review-item"
import type { SysAuditLog } from "@@/apis/types/sys-audit-log"
import type { SysDict } from "@@/apis/types/sys-dict"
import type { SysUser } from "@@/apis/types/sys-user"
import type { TaskMain } from "@@/apis/types/task-main"

/** 状态: PENDING(待处理), HIGH_RISK(高风险), PENDING_CONFIRM(待确认), PROCESSING(处理中), HANDLED(已处理) */
export type EarlyWarningStatus = NonNullable<EarlyWarning["status"]>

export const EarlyWarningStatusEnum = {
  PENDING: "PENDING",
  HIGH_RISK: "HIGH_RISK",
  PENDING_CONFIRM: "PENDING_CONFIRM",
  PROCESSING: "PROCESSING",
  HANDLED: "HANDLED"
}

/** 复审状态 */
export type ReviewItemReviewStatus = NonNullable<ReviewItem["reviewStatus"]>

export const ReviewItemReviewStatusEnum = {
  NEED_REVIEW: "NEED_REVIEW",
  CONFIRMABLE: "CONFIRMABLE",
  NEED_EVIDENCE: "NEED_EVIDENCE",
  REJECTED: "REJECTED",
  CONFIRMED: "CONFIRMED"
}

/** 操作动作 */
export type SysAuditLogActionType = NonNullable<SysAuditLog["actionType"]>

export const SysAuditLogActionTypeEnum = {
  DISPOSE_WARNING: "DISPOSE_WARNING",
  CONFIRM_SECRET: "CONFIRM_SECRET",
  QUERY_RESULT: "QUERY_RESULT",
  IGNORE_WARNING: "IGNORE_WARNING",
  TASK_PARSE: "TASK_PARSE",
  TASK_IDENTIFY: "TASK_IDENTIFY",
  TASK_MASKING: "TASK_MASKING",
  TASK_EARLY_WARNING: "TASK_EARLY_WARNING",
  LOGIN: "LOGIN"
}

/** 所属模块 */
export type SysAuditLogModule = NonNullable<SysAuditLog["module"]>

export const SysAuditLogModuleEnum = {
  PARSING: "PARSING",
  IDENTIFY: "IDENTIFY",
  REVIEW: "REVIEW",
  MASKING: "MASKING",
  WARNING: "WARNING",
  CALLBACK: "CALLBACK",
  FINISHED: "FINISHED",
  GENERAL: "GENERAL"
}

/** 执行结果 */
export type SysAuditLogResultStatus = NonNullable<SysAuditLog["resultStatus"]>

export const SysAuditLogResultStatusEnum = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED"
}

/** 字典类型：来源类型、场景类型 */
export type SysDictDictType = NonNullable<SysDict["dictType"]>

export const SysDictDictTypeEnum = {
  SOURCE_TYPE: "SOURCE_TYPE",
  SCENE_TYPE: "SCENE_TYPE",
  SECRET_POINT_TYPE: "SECRET_POINT_TYPE",
  REVIEW_CONCLUSION: "REVIEW_CONCLUSION"
}

/** 用户权限: GENERAL_USER(一般用户), SYSTEM_ADMIN(系统管理员), SECURITY_ADMIN(安全管理员), SECURITY_AUDITOR(安全审计员) */
export type SysUserUserRole = NonNullable<SysUser["userRole"]>

export const SysUserUserRoleEnum = {
  GENERAL_USER: "GENERAL_USER",
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
  SECURITY_ADMIN: "SECURITY_ADMIN",
  SECURITY_AUDITOR: "SECURITY_AUDITOR"
}

/** 当前环节: PARSING(解析), IDENTIFY(识别), REVIEW(复核), MASKING(脱敏), CALLBACK(回传), FINISHED(完成) */
export type TaskMainCurrentStep = NonNullable<TaskMain["currentStep"]>

export const TaskMainCurrentStepEnum = {
  PARSING: "PARSING",
  IDENTIFY: "IDENTIFY",
  REVIEW: "REVIEW",
  MASKING: "MASKING",
  WARNING: "WARNING",
  CALLBACK: "CALLBACK",
  FINISHED: "FINISHED"
}

/** 场景: online_preview(在线预览), local_open(本地打开), file_export(文件出网) */
export type TaskMainSceneType = NonNullable<TaskMain["sceneType"]>

export const TaskMainSceneTypeEnum = {
  ONLINE_PREVIEW: "ONLINE_PREVIEW",
  LOCAL_OPEN: "LOCAL_OPEN",
  FILE_EXPORT: "FILE_EXPORT"
}

/** 来源: user_submit(用户提交), api_call(接口调用), batch_import(批量导入) */
export type TaskMainSourceType = NonNullable<TaskMain["sourceType"]>

export const TaskMainSourceTypeEnum = {
  USER_SUBMIT: "USER_SUBMIT",
  API_CALL: "API_CALL",
  BATCH_IMPORT: "BATCH_IMPORT"
}

/** 环节状态: PENDING(待处理), PROCESSING(进行中), SUCCESS(成功), FAIL(失败) */
export type TaskMainStepStatus = NonNullable<TaskMain["stepStatus"]>

export const TaskMainStepStatusEnum = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SUCCESS: "SUCCESS",
  FAIL: "FAIL"
}
/* </generated> */

// 自定义枚举 / 扩展请写在此下方，重新生成 api 时不会覆盖
