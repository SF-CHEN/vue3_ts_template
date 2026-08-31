<script lang="ts" setup>
import type { FormInstance } from "element-plus"
import type { UserFormData, UserItem, UserQuery } from "@@/apis/types/demo-user"
import type { TableColumn, TablePagination } from "@@/components/CustomTable/types"
import { createUser, deleteUser, fetchUserPage, updateUser } from "@@/apis/demo-user"
import CustomDialog from "@@/components/CustomDialog/index.vue"
import CustomTable from "@@/components/CustomTable/index.vue"
import { checkPermission } from "@@/utils/permission"

defineOptions({ name: "DemoUser" })

const formRef = useTemplateRef<FormInstance>("formRef")

const loading = ref(false)
const tableData = ref<UserItem[]>([])
const dialogVisible = ref(false)

const query = reactive<UserQuery>({
  username: "",
  role: "",
  status: ""
})

const pagination = reactive<TablePagination>({
  pageCurrent: 1,
  pageSize: 10,
  total: 0
})

const DEFAULT_FORM: UserFormData = {
  id: undefined,
  username: "",
  role: "user",
  status: "enabled"
}

const formData = reactive<UserFormData>({ ...DEFAULT_FORM })

const formRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
}

const canCreate = computed(() => checkPermission(["demo:user:create"]))
const canEdit = computed(() => checkPermission(["demo:user:edit"]))
const canDelete = computed(() => checkPermission(["demo:user:delete"]))

const columns: TableColumn<UserItem>[] = [
  { prop: "id", label: "ID", width: 80 },
  { prop: "username", label: "用户名", minWidth: 160 },
  { prop: "role", label: "角色", width: 120, slot: "role" },
  { prop: "status", label: "状态", width: 120, slot: "status" },
  { prop: "createdAt", label: "创建时间", width: 180 },
  { prop: "actions", label: "操作", width: 200, fixed: "right", slot: "actions" }
]

async function getTableData() {
  loading.value = true
  try {
    const res = await fetchUserPage({
      pageCurrent: pagination.pageCurrent ?? 1,
      pageSize: pagination.pageSize ?? 10,
      query: { ...query }
    })
    tableData.value = res.records
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.pageCurrent = 1
  getTableData()
}

function handleReset() {
  Object.assign(query, { username: "", role: "", status: "" })
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

function handleUpdate(row: UserItem) {
  Object.assign(formData, {
    id: row.id,
    username: row.username,
    role: row.role,
    status: row.status
  })
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    if (formData.id === undefined) {
      await createUser({ ...formData })
      ElMessage.success("新增成功")
    } else {
      await updateUser({ ...formData })
      ElMessage.success("修改成功")
    }
    dialogVisible.value = false
    await getTableData()
  } catch {
    return
  } finally {
    loading.value = false
  }
}

async function handleDelete(row: UserItem) {
  try {
    await ElMessageBox.confirm(`确认删除用户「${row.username}」吗？`, "系统提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
  } catch {
    return
  }

  loading.value = true
  try {
    await deleteUser(row.id)
    ElMessage.success("删除成功")
    await getTableData()
  } catch {
    return
  } finally {
    loading.value = false
  }
}

onMounted(getTableData)
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="query" inline label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="query.username" clearable placeholder="搜索用户名" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="query.role" clearable placeholder="全部" class="w-32">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" clearable placeholder="全部" class="w-32">
            <el-option label="启用" value="enabled" />
            <el-option label="禁用" value="disabled" />
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
    </el-card>

    <div class="toolbar">
      <el-button v-if="canCreate" type="primary" @click="handleCreate">
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
      <template #role="{ value }">
        <el-tag :type="value === 'admin' ? 'danger' : 'info'">
          {{ value === "admin" ? "管理员" : "普通用户" }}
        </el-tag>
      </template>

      <template #status="{ value }">
        <el-tag :type="value === 'enabled' ? 'success' : 'info'">
          {{ value === "enabled" ? "启用" : "禁用" }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <el-button v-if="canEdit" type="warning" plain size="small" @click="handleUpdate(row)">
          编辑
        </el-button>
        <el-button v-if="canDelete" type="danger" plain size="small" @click="handleDelete(row)">
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
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" label-position="left">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" class="w-full">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" class="w-full">
            <el-option label="启用" value="enabled" />
            <el-option label="禁用" value="disabled" />
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
  gap: 16px;
}

.search-card {
  :deep(.el-card__body) {
    padding-bottom: 4px;
  }
}

.toolbar {
  display: flex;
  align-items: center;
  min-height: 32px;
}
</style>
