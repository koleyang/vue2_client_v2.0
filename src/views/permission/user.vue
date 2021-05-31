<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">新建用户</el-button>

    <el-table :data="userList" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="用户账号" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户角色" width="220">
        <template slot-scope="scope">
          {{ scope.row.role.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.role.description }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
          <el-button type="warning" size="small" @click="handleResetPwd(scope)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新建用户'">
      <el-form ref="userForm" :model="user" label-width="136px" label-position="left" :rules="userRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" auto-complete="new-password" placeholder="用户名" />
        </el-form-item>
        <el-form-item v-if="dialogType==='new'" label="密码" prop="password">
          <el-input v-model="user.password" auto-complete="new-password" type="password" :placeholder="password_hint" />
        </el-form-item>
        <el-form-item label="拥有角色" prop="roleid">
          <el-select v-model="user.roleid" class="selector" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否为训练管理员" prop="isTrainnerManager">
          <el-radio-group v-model="user.isTrainnerManager">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否为后台管理员" prop="isBackgroundManager">
          <el-radio-group v-model="user.isBackgroundManager">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getUsers, addUserSG, updateUser, deleteUser, getUsersSG, resetPassword } from '@/api/user'
import { success } from '@/utils/operation-message'
import { getRoles } from '@/api/role'

const defaultUser = {
  username: '',
  password: '',
  isTrainnerManager: false,
  isBackgroundManager: false,
  roleid: ''
}

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      console.log('value: ', value)
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不得少于6位数'))
      } else {
        callback()
      }
    }
    return {
      user: Object.assign({}, defaultUser),
      userList: [],
      roleList: [],
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      password_hint: '密码',
      userRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        isTrainnerManager: [{ required: true, trigger: 'change', message: '请选择是否是训练管理员' }],
        isBackgroundManager: [{ required: true, trigger: 'change', message: '请选择是否是后台管理员' }],
        roleid: [{ required: true, trigger: 'change', message: '请选择角色' }]
      },
      isConfirmDisabled: true
    }
  },
  created() {
    this.getUsers()
    this.getRoles()
  },
  methods: {
    async getUsers() {
      if (process.env.VUE_APP_BASE_CLIENT_ID === 'sg') {
        const res = await getUsersSG()
        console.log('res: ', res)
        this.userList = res.datas
      } else {
        const res = await getUsers()
        this.userList = res.data
      }
    },
    async getRoles() {
      const res = await getRoles()
      this.roleList = res.datas
    },
    handleAddUser() {
      this.user = Object.assign({}, defaultUser)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      // this.getRoles()
      console.log('this.roleList', this.roleList)
      console.log('this.user.roleid', this.user.roleid)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.isConfirmDisabled = false
      this.password_hint = '不填写即代表不修改'
      this.user = deepClone(scope.row)
    },
    handleResetPwd(scope) {
      this.$confirm(`您确定要初始化当前用户密码吗?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await resetPassword(scope.row.id)
        this.getUsers()
        this.$message({
          type: 'success',
          message: '初始化成功，初始密码为123456'
        })
      }).catch(err => { console.error(err) })
    },
    handleDelete(scope) {
      this.$confirm(`您确定要删除当前用户吗?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteUser(scope.row.id)
        this.getUsers()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => { console.error(err) })
    },
    async confirmUser() {
      console.log(`confirmUser =>`, this.user)
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          this.isConfirmDisabled = false
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            await updateUser(this.user, this.user.id)
          } else {
            await addUserSG(this.user)
          }
          this.getUsers()
          this.dialogVisible = false
          success()
        } else {
          return false
        }
      })
    }
  }
}
</script>

