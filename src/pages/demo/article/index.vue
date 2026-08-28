<script lang="ts" setup>
import type { FormInstance } from "element-plus"
import type { TableColumn, TablePagination } from "@@/components/CustomTable/types"
import type { ArticleFormData, ArticleItem, ArticleQuery } from "@@/apis/types/demo-article"
import { createArticle, deleteArticle, fetchArticlePage, updateArticle } from "@@/apis/demo-article"
import CustomDialog from "@@/components/CustomDialog/index.vue"
import CustomTable from "@@/components/CustomTable/index.vue"
import { checkPermission } from "@@/utils/permission"
import { useUserStore } from "@/pinia/stores/user"

defineOptions({ name: "DemoArticle" })

const userStore = useUserStore()
const formRef = useTemplateRef<FormInstance>("formRef")

const loading = ref(false)
const tableData = ref<ArticleItem[]>([])
const dialogVisible = ref(false)

const query = reactive<ArticleQuery>({
  title: "",
  status: ""
})

const pagination = reactive<TablePagination>({
  pageCurrent: 1,
  pageSize: 10,
  total: 0
})

const DEFAULT_FORM: ArticleFormData = {
  id: undefined,
  title: "",
  status: "draft",
  author: ""
}

const formData = reactive<ArticleFormData>({ ...DEFAULT_FORM })

const formRules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  author: [{ required: true, message: "请输入作者", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
}

const canCreate = computed(() => checkPermission(["demo:article:create"]))
const canEdit = computed(() => checkPermission(["demo:article:edit"]))
const canDelete = computed(() => checkPermission(["demo:article:delete"]))

const columns: TableColumn<ArticleItem>[] = [
  { prop: "id", label: "ID", width: 80 },
  { prop: "title", label: "标题", minWidth: 180 },
  { prop: "author", label: "作者", width: 120 },
  { prop: "status", label: "状态", width: 110, slot: "status" },
  { prop: "createdAt", label: "创建时间", width: 180 },
  { prop: "actions", label: "操作", width: 200, fixed: "right", slot: "actions" }
]

async function getTableData() {
  loading.value = true
  try {
    const res = await fetchArticlePage({
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
  Object.assign(query, { title: "", status: "" })
  handleSearch()
}

function resetForm() {
  formRef.value?.clearValidate()
  Object.assign(formData, DEFAULT_FORM)
}

function handleCreate() {
  resetForm()
  formData.author = userStore.username || "anonymous"
  dialogVisible.value = true
}

function handleUpdate(row: ArticleItem) {
  Object.assign(formData, {
    id: row.id,
    title: row.title,
    status: row.status,
    author: row.author
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
      await createArticle({ ...formData })
      ElMessage.success("新增成功")
    } else {
      await updateArticle({ ...formData })
      ElMessage.success("修改成功")
    }
    dialogVisible.value = false
    await getTableData()
  } catch {
    // 请求层负责统一错误提示；这里只负责结束当前交互。
  } finally {
    loading.value = false
  }
}

async function handleDelete(row: ArticleItem) {
  try {
    await ElMessageBox.confirm(`确认删除「${row.title}」吗？`, "系统提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
  } catch {
    return
  }

  loading.value = true
  try {
    await deleteArticle(row.id)
    ElMessage.success("删除成功")
    await getTableData()
  } catch {
    // 请求层负责统一错误提示。
  } finally {
    loading.value = false
  }
}

onMounted(getTableData)
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="query" inline label-width="60px">
        <el-form-item label="标题">
          <el-input v-model="query.title" clearable placeholder="搜索标题" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" clearable placeholder="全部" class="w-32">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
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
        新增文章
      </el-button>
      <el-alert
        v-else
        type="info"
        :closable="false"
        title="当前账号无新增权限（user 角色仅演示只读+有限权限）"
        show-icon
      />
    </div>

    <CustomTable
      v-model:pagination="pagination"
      :loading="loading"
      :data="tableData"
      :columns="columns"
      @pagination="getTableData"
    >
      <template #status="{ value }">
        <el-tag :type="value === 'published' ? 'success' : 'info'">
          {{ value === "published" ? "已发布" : "草稿" }}
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
      :title="formData.id === undefined ? '新增文章' : '编辑文章'"
      width="520px"
      @confirm="handleSubmit"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" label-position="left">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="formData.author" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" class="w-full">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
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
  gap: 12px;
}
</style>
