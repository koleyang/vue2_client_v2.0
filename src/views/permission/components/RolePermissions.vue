<template>
  <div class="app-container">
    <el-form ref="rolePermissionForm" :model="rolePermission" label-width="100px" label-position="left" :rules="rolePermissionRules">
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="rolePermission.roleId" class="selector" placeholder="请选择角色" @change="selectRole($event)">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="rolePermission.description"
          :autosize="{ minRows: 2, maxRows: 4}"
          type="textarea"
          placeholder=""
          disabled
        />
      </el-form-item>
      <el-form-item label="选择权限" prop="parametersValue">
        <el-tree
          ref="tree"
          :data="permissionList"
          :default-checked-keys="defaultKyes"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="defaultProps"
          @check-change="handleCheckChange"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getRoles, getRole, editRoleRights } from '@/api/role'
import { getPermissionsSG } from '@/api/permission'
import { success } from '@/utils/operation-message'
import { addItem, subItem } from '@/utils'

const defaultRolePermission = {
  roleId: '',
  description: '',
  RightsidList: ''
}

export default {
  props: {
    currentrow: {
      type: Object,
      default: null // 这样接收数据的写法，必须含默认值，否则ESLint报错
    },
    paramdialogtype: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rolePermission: Object.assign({}, defaultRolePermission),
      roleList: [],
      permissionList: [],
      // defaultKyes: [1, 2, 4], // 想让角色选中后匹配之前选中的权限，那么这个数组就要后台返回对应的id数组即可
      defaultKyes: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      rolePermissionRules: {
        roleId: [{ required: true, trigger: 'change', message: '请选择角色' }]
      }
    }
  },
  created() {
    this.getRoles()
    this.getPermissions()
  },
  methods: {
    async getRoles() {
      const res = await getRoles()
      this.roleList = res.datas
    },
    async getPermissions() {
      const res = await getPermissionsSG()
      this.permissionList = res.datas
    },
    async selectRole(evt) {
      const res = await getRole(evt)
      const { description, roleRights } = res
      this.rolePermission.description = description
      roleRights ? this.defaultKyes = roleRights.map(item => item.rightsid) : await this.clearTree()
      console.log('权限列表数据 => defaultKyes: ', this.defaultKyes.length)
    //   this.$forceUpdate() // vue 强制刷新
    },
    handleCheckChange(data, checked) {
      console.log('切换树节点时触发 =>data', data)
      console.log('切换树节点时触发 =>checked', checked)
      const { id } = data
      checked ? this.defaultKyes = addItem(this.defaultKyes, id) : this.defaultKyes = subItem(this.defaultKyes, id)
      console.log('切换树节点时触发 =>defaultKyes 默认数组值', this.defaultKyes)
    },
    async confirmUser() {
      this.$refs.rolePermissionForm.validate(async valid => {
        if (valid) {
          this.rolePermission.RightsidList = this.defaultKyes.join(',')
          await editRoleRights(this.rolePermission)
          await success()
        } else {
          return false
        }
      })
    },
    closeDialog() {
      // this.dialogVisible = false;
      this.defaultKyes = []
      this.$nextTick(() => {
        this.$refs.rolePermissionForm.resetFields()
        this.$refs.rolePermissionForm.clearValidate()
        this.$refs.tree.setCheckedKeys([])
      })
    },
    clearTree() {
      this.defaultKyes = []
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([]) // 清除tree树组件的所有勾选方法，不调用这个方法，勾选清除不掉
      })
    }
  }
}
</script>

