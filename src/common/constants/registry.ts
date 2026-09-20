/**
 * [INPUT]: 聚合 enums.ts 与 options.ts（含 options 自定义区导出）
 * [OUTPUT]: 对外提供 Enum / Options 统一入口
 * [POS]: src/common/constants/registry.ts；</generated> 下方可手写扩展
 */

/* <generated> */
import { EarlyWarningStatusEnum, ReviewItemReviewStatusEnum, SysAuditLogActionTypeEnum, SysAuditLogModuleEnum, SysAuditLogResultStatusEnum, SysDictDictTypeEnum, SysUserUserRoleEnum, TaskMainCurrentStepEnum, TaskMainSceneTypeEnum, TaskMainSourceTypeEnum, TaskMainStepStatusEnum } from "./enums"
import { EARLY_WARNING_STATUS_OPTIONS, REVIEW_ITEM_REVIEW_STATUS_OPTIONS, SYS_AUDIT_LOG_ACTION_TYPE_OPTIONS, SYS_AUDIT_LOG_MODULE_OPTIONS, SYS_AUDIT_LOG_RESULT_STATUS_OPTIONS, SYS_DICT_DICT_TYPE_OPTIONS, SYS_USER_USER_ROLE_OPTIONS, TASK_MAIN_CURRENT_STEP_OPTIONS, TASK_MAIN_SCENE_TYPE_OPTIONS, TASK_MAIN_SOURCE_TYPE_OPTIONS, TASK_MAIN_STEP_STATUS_OPTIONS } from "./options"

/** 枚举聚合入口，用法：Enum.evaluationTaskStatus.PENDING */
export const Enum = {
  earlyWarningStatus: EarlyWarningStatusEnum,
  reviewItemReviewStatus: ReviewItemReviewStatusEnum,
  sysAuditLogActionType: SysAuditLogActionTypeEnum,
  sysAuditLogModule: SysAuditLogModuleEnum,
  sysAuditLogResultStatus: SysAuditLogResultStatusEnum,
  sysDictDictType: SysDictDictTypeEnum,
  sysUserUserRole: SysUserUserRoleEnum,
  taskMainCurrentStep: TaskMainCurrentStepEnum,
  taskMainSceneType: TaskMainSceneTypeEnum,
  taskMainSourceType: TaskMainSourceTypeEnum,
  taskMainStepStatus: TaskMainStepStatusEnum
} as const

/** 下拉选项聚合入口，用法：Options.evaluationTaskStatus（含 options.ts 自定义区导出） */
export const Options = {
  earlyWarningStatus: EARLY_WARNING_STATUS_OPTIONS,
  reviewItemReviewStatus: REVIEW_ITEM_REVIEW_STATUS_OPTIONS,
  sysAuditLogActionType: SYS_AUDIT_LOG_ACTION_TYPE_OPTIONS,
  sysAuditLogModule: SYS_AUDIT_LOG_MODULE_OPTIONS,
  sysAuditLogResultStatus: SYS_AUDIT_LOG_RESULT_STATUS_OPTIONS,
  sysDictDictType: SYS_DICT_DICT_TYPE_OPTIONS,
  sysUserUserRole: SYS_USER_USER_ROLE_OPTIONS,
  taskMainCurrentStep: TASK_MAIN_CURRENT_STEP_OPTIONS,
  taskMainSceneType: TASK_MAIN_SCENE_TYPE_OPTIONS,
  taskMainSourceType: TASK_MAIN_SOURCE_TYPE_OPTIONS,
  taskMainStepStatus: TASK_MAIN_STEP_STATUS_OPTIONS
} as const
/* </generated> */

// 自定义聚合入口请写在此下方，重新生成 api 时不会覆盖
