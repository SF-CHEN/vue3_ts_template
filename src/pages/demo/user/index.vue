<script lang="ts" setup>
import type { FormInstance } from "element-plus"
import type { SysUser } from "@@/apis/types/sys-user"
import type { TableColumn, TablePagination } from "@@/components/CustomTable/types"
import { addSysUser, deleteOneSysUser, pageSysUser, updateSysUser } from "@@/apis/sys-user"
import CustomDialog from "@@/components/CustomDialog/index.vue"
import CustomTable from "@@/components/CustomTable/index.vue"
import { SYS_USER_USER_ROLE_OPTIONS } from "@@/constants/options"
import { ROLE_ADMIN } from "@@/constants/roles"
import { checkRole } from "@@/utils/permission"

defineOptions({ name: "DemoUser" })

const formRef = useTemplateRef<FormInstance>("formRef")
const loading = ref(false)
const tableData = ref<SysUser[]>([])
const dialogVisible = ref(false)

const query = reactive<SysUser>({ username: "", userRole: undefined })
const pagination = ref<TablePagination>({ pageCurrent: 1, pageSize: 10, total: 0 })

const DEFAULT_FORM: SysUser = {
  id: undefined,
  username: "",
  name: "",
  password: "",
  userRole: "GENERAL_USER"
}
const formData = reactive<SysUser>({ ...DEFAULT_FORM })

const formRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  userRole: [{ required: true, message: "请选择角色", trigger: "change" }]
}

const canManage = computed(() => checkRole([ROLE_ADMIN]))

const columns: TableColumn[] = [
  { prop: "id", label: "ID", width: 80 },
  { prop: "username", label: "用户名", minWidth: 140 },
  { prop: "name", label: "名称", minWidth: 140 },
  { prop: "userRole", label: "角色", width: 140, slot: "userRole" },
  { prop: "createTime", label: "创建时间", width: 180 },
  { prop: "actions", label: "操作", width: 200, fixed: "right", slot: "actions" }
]

function roleLabel(value: unknown) {
  return SYS_USER_USER_ROLE_OPTIONS.find(item => item.value === value)?.label || (typeof value === "string" ? value : "-")
}

async function withLoading(task: () => Promise<void>) {
  loading.value = true
  try {
    await task()
  } catch {
    // 通用错误已由 request 层提示，这里只收口 loading。
  } finally {
    loading.value = false
  }
}

async function loadTable() {
  const res = await pageSysUser({
    pageCurrent: pagination.value.pageCurrent,
    pageSize: pagination.value.pageSize,
    entity: { ...query }
  })
  tableData.value = res.records ?? []
  pagination.value.total = res.total ?? 0
}

function getTableData() {
  return withLoading(loadTable)
}

function handleSearch() {
  // 筛选变化后从第一页查，避免旧页码超出新结果。
  pagination.value.pageCurrent = 1
  getTableData()
}

function handleReset() {
  Object.assign(query, { username: "", userRole: undefined })
  handleSearch()
}

function resetForm() {
  formRef.value?.clearValidate()
  Object.assign(formData, DEFAULT_FORM)
}

function handleCreate() {
  resetForm()
  dialogVisible.value = true
}

function handleUpdate(row: SysUser) {
  Object.assign(formData, {
    id: row.id,
    username: row.username,
    name: row.name,
    password: "",
    userRole: row.userRole
  })
  dialogVisible.value = true
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  await withLoading(async () => {
    // 用 id 区分新增/编辑，不再维护独立 mode。
    if (formData.id === undefined) {
      await addSysUser({ ...formData })
      ElMessage.success("新增成功")
    } else {
      await updateSysUser({ ...formData })
      ElMessage.success("修改成功")
    }
    dialogVisible.value = false
    await loadTable()
  })
}

async function handleDelete(row: SysUser) {
  const id = row.id
  if (id === undefined) return

  try {
    await ElMessageBox.confirm(`确认删除用户「${row.username}」吗？`, "系统提示", { type: "warning" })
  } catch {
    return
  }

  await withLoading(async () => {
    await deleteOneSysUser({ id })
    ElMessage.success("删除成功")
    await loadTable()
  })
}

onMounted(getTableData)
</script>

<template>
  <div class="app-container">
    <el-form :model="query" inline label-width="60px">
      <el-form-item label="用户名">
        <el-input v-model="query.username" clearable placeholder="搜索用户名" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="query.userRole" clearable placeholder="全部" class="w-36">
          <el-option
            v-for="item in SYS_USER_USER_ROLE_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">
          查询
        </el-button>
        <el-button @click="handleReset">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="toolbar mb-[20px]">
      <el-button v-if="canManage" type="primary" @click="handleCreate">
        新增用户
      </el-button>
    </div>

    <CustomTable
      v-model:pagination="pagination"
      :loading="loading"
      :data="tableData"
      :columns="columns"
      @pagination="getTableData"
    >
      <template #userRole="{ value }">
        <el-tag>{{ roleLabel(value) }}</el-tag>
      </template>
      <template #actions="{ row }">
        <el-button v-if="canManage" type="warning" plain size="small" @click="handleUpdate(row)">
          编辑
        </el-button>
        <el-button v-if="canManage" type="danger" plain size="small" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </CustomTable>

    <CustomDialog
      v-model="dialogVisible"
      :title="formData.id === undefined ? '新增用户' : '编辑用户'"
      width="520px"
      @confirm="handleSubmit"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" show-password :placeholder="formData.id === undefined ? '请输入密码' : '留空则不修改'" />
        </el-form-item>
        <el-form-item label="角色" prop="userRole">
          <el-select v-model="formData.userRole" class="w-full">
            <el-option v-for="item in SYS_USER_USER_ROLE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </CustomDialog>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 15px;
  padding: 30px;
}

.toolbar {
  display: flex;
  align-items: center;
}
</style>
