<template>
  <div class="app-container">
    <div class="operation-panel">
      <div class="search-area">
        <el-button type="primary" style="float: left" @click="handleAdd">新建权限</el-button>
        <el-input
          v-model="searchForm.keyword"
          suffix-icon="el-icon-search"
          maxlength="15"
          style="width:200px; float: right"
          placeholder="搜索权限名称"
          @input="search"
        />
        <i
          slot="suffix"
          class="el-icon-search el-input__icon search-icon"
          @click="search"
        />
        <!-- <el-button type="primary" class="search-btn" @click="search">搜索</el-button> -->
      </div>
    </div>

    <el-table :data="permissionList" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="权限名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限标识" width="220">
        <template slot-scope="scope">
          {{ scope.row.rights }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page="pagination.current_page"
      :page-size="pagination.per_page"
      :total="pagination.total"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑权限':'新建权限'">
      <el-form ref="permissionForm" :rules="permissionRules" :model="permission" label-width="80px" label-position="left">
        <el-form-item label="权限名称" prop="title">
          <el-input v-model="permission.title" placeholder="权限名称" />
        </el-form-item>
        <el-form-item label="权限标识" prop="rights">
          <el-input v-model="permission.rights" placeholder="权限标识" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input
            v-model="permission.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder=""
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmPermission">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getPermissions, getPermissionsSG, addPermission, updatePermission, deletePermission } from '@/api/permission'
import { success } from '../../utils/operation-message'
const defaultPermission = {
  title: '',
  rights: '',
  description: '',
  rightsType: 1,
  parentid: 0
}

export default {
  data() {
    return {
      permission: Object.assign({}, defaultPermission),
      permissionList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      pagination: {
        total: 0,
        current_page: 1,
        per_page: 15
      },
      searchForm: {
        keyword: ''
      },
      permissionRules: {
        title: [{ required: true, trigger: 'blur', message: '请输入权限名称' }],
        rights: [{ required: true, trigger: 'blur', message: '请输入权限标识' }],
        description: [{ required: true, trigger: 'blur', message: '请输入描述' }]
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getPermissions()
  },
  methods: {
    async getPermissions() {
      const res = await getPermissionsSG()
      this.permissionList = res.datas
      // const params = {
      //   page: this.pagination.current_page,
      //   per_page: this.pagination.per_page,
      //   keyword: this.searchForm.keyword
      // }
      // const res = await getPermissions(params)
      // this.permissionList = res.datas
      // this.pagination = res.meta.pagination
    },
    handleCurrentChange(val) {
      this.pagination.current_page = val
      this.getPermissions()
    },
    search() {
      this.pagination.current_page = 1
      this.getPermissions()
    },
    handleAdd() {
      this.permission = Object.assign({}, deletePermission) // 新建就简简单单置空绑定对象就行了
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      console.log('scope.row: ', scope.row)
      this.permission = deepClone(scope.row) // 编辑就深拷贝行数据到绑定对象上
    },
    handleDelete(scope) {
      console.log('scope.row.id', scope.row.id)
      this.$confirm('您确定要删除该权限吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deletePermission(scope.row.id)
        this.getPermissions()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => { console.error(err) })
    },
    async confirmPermission() {
      this.$refs.permissionForm.validate(async valid => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            console.log('this.permission: ', this.permission)
            await updatePermission(this.permission, this.permission.id)
          } else {
            await addPermission(this.permission)
          }
          this.getPermissions()
          this.dialogVisible = false
          success()
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .search-area {
    position: relative;
    .search-icon {
      float: right;
      position: absolute;
      right: 5px;
      top: -2px;
      cursor: pointer;
    }
  }
</style>
