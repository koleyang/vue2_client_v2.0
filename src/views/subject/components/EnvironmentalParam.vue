<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddEnvParam">创建环境参数</el-button>

    <el-table :data="envParamsList" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="环境参数" width="220">
        <template slot-scope="scope">
          {{ scope.row.parametersKey }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="环境参数值" width="220">
        <template slot-scope="scope">
          {{ scope.row.parametersValue }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
      <template slot="empty">
        <p> {{ emptyText }} </p>
      </template>
    </el-table>

    <el-dialog
      :visible.sync="dialogEnvVisible"
      :title="dialogEnvType==='edit'?'编辑环境参数':'新建环境参数'"
      :close-on-click-modal="false"
      :modal="false"
    >
      <el-form ref="envParamForm" :model="envParam" label-width="100px" label-position="left" :rules="envParamRules">
        <el-form-item label="环境参数" prop="parametersKey">
          <el-input v-model="envParam.parametersKey" placeholder="环境参数" />
        </el-form-item>
        <el-form-item label="环境参数值" prop="parametersValue">
          <el-input v-model="envParam.parametersValue" placeholder="环境参数值" />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogEnvVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import {
  getEnvironmentalParameters,
  addEnvironmentalParameters,
  updateEnvironmentalParameters,
  deleteEnvironmentalParameters
} from '@/api/subject'
import { success } from '@/utils/operation-message'

const defaultEnvParam = {
  subjectId: '',
  parametersKey: '',
  parametersValue: ''
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
      envParam: Object.assign({}, defaultEnvParam),
      envParamsList: [],
      roleList: [],
      dialogEnvVisible: false,
      dialogEnvType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      envParamRules: {
        parametersKey: [{ required: true, trigger: 'blur', message: '请输入环境参数名称' }],
        parametersValue: [{ required: true, trigger: 'blur', message: '请输入环境参数值' }]
      },
      isConfirmDisabled: true,
      emptyText: ''
    }
  },
  mounted() {
    console.log('Env => this.currentrow: ', this.currentrow)
    console.log('Env => this.paramdialogtype: ', this.paramdialogtype)
    this.getEnvParameters(this.currentrow.id)
  },
  destroyed() {
    console.log(`弹窗组件销毁时触发 =>`, this.currentrow.id)
  },
  methods: {
    async getEnvParameters(id) {
      const res = await getEnvironmentalParameters(id)
      console.log('res: ', res)
      if (res.length > 0 && res[0] != null) {
        this.envParamsList = res
      } else {
        this.envParamsList = []
        this.emptyText = '暂无数据'
      }
    },
    handleAddEnvParam() {
      this.envParam = Object.assign({}, defaultEnvParam)
      this.envParam.subjectId = this.currentrow.id
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogEnvType = 'new'
      this.dialogEnvVisible = true
    },
    handleEdit(scope) {
      this.dialogEnvType = 'edit'
      this.dialogEnvVisible = true
      this.isConfirmDisabled = false
      this.envParam = deepClone(scope.row)
      this.envParam.subjectId = this.currentrow.id
    },
    handleDelete(scope) {
      this.$confirm(`您确定要删除当前环境参数吗?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteEnvironmentalParameters(scope.row.id)
        this.getEnvParameters(this.currentrow.id)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => { console.error(err) })
    },
    async confirmUser() {
      this.$refs.envParamForm.validate(async valid => {
        if (valid) {
          this.isConfirmDisabled = false
          const isEdit = this.dialogEnvType === 'edit'
          if (isEdit) {
            console.log('this.envParam.id: ', this.envParam.id)
            await updateEnvironmentalParameters(this.envParam, this.envParam.id)
          } else {
            await addEnvironmentalParameters(this.envParam)
          }
          this.getEnvParameters(this.currentrow.id)
          this.dialogEnvVisible = false
          success()
        } else {
          return false
        }
      })
    }
  }
}
</script>

