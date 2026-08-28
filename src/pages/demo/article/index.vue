<script lang="ts" setup>
import type { FormSchemaItem } from "@@/components/CustomForm/types"
import type { TableColumn, TablePagination } from "@@/components/CustomTable/types"
import type { FormInstance } from "element-plus"
import type { ArticleFormData, ArticleItem, ArticleQuery } from "./types"
import { createArticle, deleteArticle, fetchArticlePage, updateArticle } from "@@/apis/demo-article"
import CustomDialog from "@@/components/CustomDialog/index.vue"
import CustomForm from "@@/components/CustomForm/index.vue"
import CustomTable from "@@/components/CustomTable/index.vue"
import { checkPermission } from "@@/utils/permission"
import { useUserStore } from "@/pinia/stores/user"

defineOptions({ name: "DemoArticle" })

const userStore = useUserStore()

const loading = ref(false)
const tableData = ref<ArticleItem[]>([])
const dialogVisible = ref(false)

const formRef = useTemplateRef<{
  validate: () => Promise<boolean>
  clearValidate: () => void
  resetFields: () => void
  formRef?: FormInstance
}>("formRef")

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

const formData = ref<ArticleFormData>({ ...DEFAULT_FORM })

const canCreate = computed(() => checkPermission(["demo:article:create"]))
const canEdit = computed(() => checkPermission(["demo:article:edit"]))
const canDelete = computed(() => checkPermission(["demo:article:delete"]))

const searchSchema: FormSchemaItem[] = [
  {
    prop: "title",
    label: "标题",
    type: "input",
    typeProps: { clearable: true, placeholder: "搜索标题" }
  },
  {
    prop: "status",
    label: "状态",
    type: "select",
    options: [
      { label: "全部", value: "" },
      { label: "草稿", value: "draft" },
      { label: "已发布", value: "published" }
    ],
    typeProps: { clearable: true }
  }
]

const formSchema: FormSchemaItem[] = [
  {
    prop: "title",
    label: "标题",
    type: "input",
    rule: true,
    ruleMessage: "请输入标题",
    trigger: "blur"
  },
  {
    prop: "author",
    label: "作者",
    type: "input",
    rule: true,
    ruleMessage: "请输入作者",
    trigger: "blur"
  },
  {
    prop: "status",
    label: "状态",
    type: "select",
    rule: true,
    ruleMessage: "请选择状态",
    options: [
      { label: "草稿", value: "draft" },
      { label: "已发布", value: "published" }
    ]
  }
]

const columns: TableColumn<ArticleItem>[] = [
  { prop: "id", label: "ID", width: 80 },
  { prop: "title", label: "标题", minWidth: 180 },
  { prop: "author", label: "作者", width: 120 },
  {
    prop: "status",
    label: "状态",
    width: 110,
    type: "tag",
    formatter: value => (value === "published" ? "已发布" : "草稿")
  },
  { prop: "createdAt", label: "创建时间", width: 180 },
  {
    prop: "actions",
    slot: "actions",
    label: "操作",
    width: 200,
    fixed: "right"
  }
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
  query.title = ""
  query.status = ""
  handleSearch()
}

function handleCreate() {
  formData.value = {
    ...DEFAULT_FORM,
    author: userStore.username || "anonymous"
  }
  dialogVisible.value = true
}

function handleUpdate(row: ArticleItem) {
  formData.value = {
    id: row.id,
    title: row.title,
    status: row.status,
    author: row.author
  }
  dialogVisible.value = true
}

async function handleCreateOrUpdate() {
  try {
    await formRef.value?.validate()
  } catch {
    ElMessage.error("表单校验不通过")
    return
  }

  loading.value = true
  try {
    if (formData.value.id === undefined) {
      await createArticle(formData.value)
      ElMessage.success("新增成功")
    } else {
      await updateArticle(formData.value)
      ElMessage.success("修改成功")
    }
    dialogVisible.value = false
    getTableData()
  } catch (error) {
    ElMessage.error((error as Error).message || "操作失败")
  } finally {
    loading.value = false
  }
}

function resetForm() {
  formRef.value?.clearValidate()
  formData.value = { ...DEFAULT_FORM }
}

function handleDelete(row: ArticleItem) {
  ElMessageBox.confirm(`确认删除「${row.title}」吗？`, "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    loading.value = true
    try {
      await deleteArticle(row.id)
      ElMessage.success("删除成功")
      getTableData()
    } catch (error) {
      ElMessage.error((error as Error).message || "删除失败")
    } finally {
      loading.value = false
    }
  }).catch(() => undefined)
}

onMounted(() => {
  getTableData()
})
</script>

<template>
  <div v-loading="loading" class="app-container">
    <el-card shadow="never" class="search-card">
      <CustomForm
        v-model="query"
        :schema="searchSchema"
        layout="inline"
        label-width="60px"
      >
        <template #footer>
          <el-button type="primary" @click="handleSearch">
            查询
          </el-button>
          <el-button @click="handleReset">
            重置
          </el-button>
        </template>
      </CustomForm>
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
      :data="tableData"
      :columns="columns"
      v-model:pagination="pagination"
      @pagination="getTableData"
    >
      <template #actions="{ row }">
        <el-button
          v-if="canEdit"
          type="warning"
          plain
          size="small"
          @click="handleUpdate(row as ArticleItem)"
        >
          编辑
        </el-button>
        <el-button
          v-if="canDelete"
          type="danger"
          plain
          size="small"
          @click="handleDelete(row as ArticleItem)"
        >
          删除
        </el-button>
      </template>
    </CustomTable>

    <CustomDialog
      v-model="dialogVisible"
      :title="formData.id === undefined ? '新增文章' : '编辑文章'"
      width="520px"
      @confirm="handleCreateOrUpdate"
      @closed="resetForm"
    >
      <CustomForm
        ref="formRef"
        v-model="formData"
        :schema="formSchema"
        label-width="80px"
        label-position="left"
      />
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
