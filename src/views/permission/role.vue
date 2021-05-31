<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">新建角色</el-button>
    <el-button type="primary" @click="handlePermissions">分配角色权限</el-button>

    <el-table :data="roleList" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色标识" width="220">
        <template slot-scope="scope">
          {{ scope.row.roleKey | roleKeyEnum }}
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

    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" :title="dialogType==='edit'?'编辑角色':'新建角色'">
      <el-form ref="roleForm" :rules="roleRules" :model="role" label-width="120px" label-position="left">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色" prop="roleKey">
          <!-- <el-input v-model="role.roleKey" placeholder="角色" /> -->
          <el-select v-model="role.roleKey" class="selector" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.roleKey"
              :label="item.name"
              :value="item.roleKey"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="拥有权限" prop="permissions">
          <el-select v-model="role.permissions" class="selector" multiple placeholder="请选择">
            <el-option
              v-for="item in permissionList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="是否为默认角色" prop="idDefault">
          <el-radio-group v-model="role.idDefault" @change="radioChange($event)">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="role.description" placeholder="描述" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="dialogPermissionsVisible"
      :visible.sync="dialogPermissionsVisible"
      :title="'角色权限分配'"
      :close-on-click-modal="false"
      width="80%"
    >
      <role-permissions
        ref="rolePermissions"
      />
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogPermissionsVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmPermissions">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getRoles, getRolesSG, addRole, updateRole, deleteRole } from '@/api/role'
import { getPermissionsSG } from '@/api/permission'
import { success } from '@/utils/operation-message'
import RolePermissions from './components/RolePermissions'

const defaultRole = {
  name: '',
  roleKey: '',
  idDefault: false, // 表示是否是默认角色 (必须有的字段)
  // permissions: [],
  description: ''
}

export default {
  components: {
    RolePermissions
  },
  filters: {
    roleKeyEnum(value) {
      let key = ''
      switch (value) {
        case '1':
          key = 'admin'
          break
        case '2':
          key = 'customer'
          break
        default:
          break
      }
      return key
    }
  },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      roleList: [],
      permissionList: [],
      dialogVisible: false,
      dialogPermissionsVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      roleRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入角色名称' }],
        roleKey: [{ required: true, trigger: 'change', message: '请选择角色' }],
        idDefault: [{ required: true, trigger: 'change', message: '请选择角色' }],
        // permissions: [{ required: true, trigger: 'change', message: '请选择权限' }],
        description: [{ required: true, trigger: 'blur', message: '请输入角色描述' }]
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getRoles()
    console.log(this.role)
    // this.getPermissions()
  },
  methods: {
    async getRoles() {
      const res = await getRolesSG()
      this.roleList = res.datas
    },
    async getPermissions() {
      const res = await getPermissionsSG()
      this.permissionList = res.datas
    },
    handleAdd() {
      this.role = Object.assign({}, deleteRole)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handlePermissions() {
      this.dialogPermissionsVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = deepClone(scope.row)
    },
    radioChange(evt) {
      console.log('evt: ', evt)
      console.log('this.role: ', this.role)
    },
    dispathPermission(id) {
      this.$router.push({
        path: '/permission/dispatch',
        query: {
          roleId: id
        }
      })
    },
    handleDelete(scope) {
      this.$confirm('您确定要删除该角色吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(scope.row.id)
          this.getRoles()
          success()
        })
        .catch(err => {
          console.error(err)
        })
    },
    async confirmRole() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            await updateRole(this.role, this.role.id)
          } else {
            await addRole(this.role)
          }
          this.getRoles()
          this.dialogVisible = false
          success()
        }
      })
    },
    async confirmPermissions() {
      console.log('提交权限编辑 => 调用子组件confirmUser()方法')
      console.log('this.$refs.rolePermissions: ', this.$refs.rolePermissions)
      await this.$refs.rolePermissions.confirmUser()
      this.dialogPermissionsVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }
    .role-tree {
      margin-bottom: 30px;
    }
  }
</style>
