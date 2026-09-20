/**
 * [INPUT]: 由 enums 生成下拉选项；label 缺省时从 OpenAPI 描述解析中文，已有非空 label 按 value 保留
 * [OUTPUT]: 对外提供 Select / Radio / Checkbox 使用的选项数组
 * [POS]: src/common/constants/options.ts；</generated> 下方可手写自定义选项
 */

/* <generated> */
import { EarlyWarningStatusEnum, ReviewItemReviewStatusEnum, SysAuditLogActionTypeEnum, SysAuditLogModuleEnum, SysAuditLogResultStatusEnum, SysDictDictTypeEnum, SysUserUserRoleEnum, TaskMainCurrentStepEnum, TaskMainSceneTypeEnum, TaskMainSourceTypeEnum, TaskMainStepStatusEnum } from "./enums"

/**
 * 下拉选择器选项
 * 用于 Select、Radio、Checkbox 等组件
 * label 首次从 OpenAPI 描述解析中文；已有非空 label 按 value 保留，不会被重新生成覆盖
 */

/** 状态: PENDING(待处理), HIGH_RISK(高风险), PENDING_CONFIRM(待确认), PROCESSING(处理中), HANDLED(已处理) */
export const EARLY_WARNING_STATUS_OPTIONS = [
  { label: "待处理", value: EarlyWarningStatusEnum.PENDING },
  { label: "高风险", value: EarlyWarningStatusEnum.HIGH_RISK },
  { label: "待确认", value: EarlyWarningStatusEnum.PENDING_CONFIRM },
  { label: "处理中", value: EarlyWarningStatusEnum.PROCESSING },
  { label: "已处理", value: EarlyWarningStatusEnum.HANDLED }
] as const

/** 复审状态 */
export const REVIEW_ITEM_REVIEW_STATUS_OPTIONS = [
  { label: "", value: ReviewItemReviewStatusEnum.NEED_REVIEW },
  { label: "", value: ReviewItemReviewStatusEnum.CONFIRMABLE },
  { label: "", value: ReviewItemReviewStatusEnum.NEED_EVIDENCE },
  { label: "", value: ReviewItemReviewStatusEnum.REJECTED },
  { label: "", value: ReviewItemReviewStatusEnum.CONFIRMED }
] as const

/** 操作动作 */
export const SYS_AUDIT_LOG_ACTION_TYPE_OPTIONS = [
  { label: "", value: SysAuditLogActionTypeEnum.DISPOSE_WARNING },
  { label: "", value: SysAuditLogActionTypeEnum.CONFIRM_SECRET },
  { label: "", value: SysAuditLogActionTypeEnum.QUERY_RESULT },
  { label: "", value: SysAuditLogActionTypeEnum.IGNORE_WARNING },
  { label: "", value: SysAuditLogActionTypeEnum.TASK_PARSE },
  { label: "", value: SysAuditLogActionTypeEnum.TASK_IDENTIFY },
  { label: "", value: SysAuditLogActionTypeEnum.TASK_MASKING },
  { label: "", value: SysAuditLogActionTypeEnum.TASK_EARLY_WARNING },
  { label: "", value: SysAuditLogActionTypeEnum.LOGIN }
] as const

/** 所属模块 */
export const SYS_AUDIT_LOG_MODULE_OPTIONS = [
  { label: "", value: SysAuditLogModuleEnum.PARSING },
  { label: "", value: SysAuditLogModuleEnum.IDENTIFY },
  { label: "", value: SysAuditLogModuleEnum.REVIEW },
  { label: "", value: SysAuditLogModuleEnum.MASKING },
  { label: "", value: SysAuditLogModuleEnum.WARNING },
  { label: "", value: SysAuditLogModuleEnum.CALLBACK },
  { label: "", value: SysAuditLogModuleEnum.FINISHED },
  { label: "", value: SysAuditLogModuleEnum.GENERAL }
] as const

/** 执行结果 */
export const SYS_AUDIT_LOG_RESULT_STATUS_OPTIONS = [
  { label: "成功", value: SysAuditLogResultStatusEnum.SUCCESS },
  { label: "失败", value: SysAuditLogResultStatusEnum.FAILED }
] as const

/** 字典类型：来源类型、场景类型 */
export const SYS_DICT_DICT_TYPE_OPTIONS = [
  { label: "", value: SysDictDictTypeEnum.SOURCE_TYPE },
  { label: "", value: SysDictDictTypeEnum.SCENE_TYPE },
  { label: "", value: SysDictDictTypeEnum.SECRET_POINT_TYPE },
  { label: "", value: SysDictDictTypeEnum.REVIEW_CONCLUSION }
] as const

/** 用户权限: GENERAL_USER(一般用户), SYSTEM_ADMIN(系统管理员), SECURITY_ADMIN(安全管理员), SECURITY_AUDITOR(安全审计员) */
export const SYS_USER_USER_ROLE_OPTIONS = [
  { label: "一般用户", value: SysUserUserRoleEnum.GENERAL_USER },
  { label: "系统管理员", value: SysUserUserRoleEnum.SYSTEM_ADMIN },
  { label: "安全管理员", value: SysUserUserRoleEnum.SECURITY_ADMIN },
  { label: "安全审计员", value: SysUserUserRoleEnum.SECURITY_AUDITOR }
] as const

/** 当前环节: PARSING(解析), IDENTIFY(识别), REVIEW(复核), MASKING(脱敏), CALLBACK(回传), FINISHED(完成) */
export const TASK_MAIN_CURRENT_STEP_OPTIONS = [
  { label: "解析", value: TaskMainCurrentStepEnum.PARSING },
  { label: "识别", value: TaskMainCurrentStepEnum.IDENTIFY },
  { label: "复核", value: TaskMainCurrentStepEnum.REVIEW },
  { label: "脱敏", value: TaskMainCurrentStepEnum.MASKING },
  { label: "", value: TaskMainCurrentStepEnum.WARNING },
  { label: "回传", value: TaskMainCurrentStepEnum.CALLBACK },
  { label: "完成", value: TaskMainCurrentStepEnum.FINISHED }
] as const

/** 场景: online_preview(在线预览), local_open(本地打开), file_export(文件出网) */
export const TASK_MAIN_SCENE_TYPE_OPTIONS = [
  { label: "在线预览", value: TaskMainSceneTypeEnum.ONLINE_PREVIEW },
  { label: "本地打开", value: TaskMainSceneTypeEnum.LOCAL_OPEN },
  { label: "文件出网", value: TaskMainSceneTypeEnum.FILE_EXPORT }
] as const

/** 来源: user_submit(用户提交), api_call(接口调用), batch_import(批量导入) */
export const TASK_MAIN_SOURCE_TYPE_OPTIONS = [
  { label: "用户提交", value: TaskMainSourceTypeEnum.USER_SUBMIT },
  { label: "接口调用", value: TaskMainSourceTypeEnum.API_CALL },
  { label: "批量导入", value: TaskMainSourceTypeEnum.BATCH_IMPORT }
] as const

/** 环节状态: PENDING(待处理), PROCESSING(进行中), SUCCESS(成功), FAIL(失败) */
export const TASK_MAIN_STEP_STATUS_OPTIONS = [
  { label: "待处理", value: TaskMainStepStatusEnum.PENDING },
  { label: "进行中", value: TaskMainStepStatusEnum.PROCESSING },
  { label: "成功", value: TaskMainStepStatusEnum.SUCCESS },
  { label: "失败", value: TaskMainStepStatusEnum.FAIL }
] as const
/* </generated> */

// 自定义选项请写在此下方，重新生成 api 时不会覆盖，并会自动合并到 registry.ts 的 Options
