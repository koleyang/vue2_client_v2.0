<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddEnvParam">创建评分参数</el-button>

    <el-table :data="envParamsList" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="评分类型" width="220">
        <template slot-scope="scope">
          {{ scope.row.scoringType | scoringTypeEnum }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="客观评分" width="220">
        <template slot-scope="scope">
          {{ scope.row.objectiveKey }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="主观评分" width="220">
        <template slot-scope="scope">
          {{ scope.row.objectiveValue }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="主观评分说明" width="220">
        <template slot-scope="scope">
          {{ scope.row.subjectiveContent }}
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
      :title="dialogEnvType==='edit'?'编辑评分参数':'新建评分参数'"
      :close-on-click-modal="false"
      :modal="false"
    >
      <el-form ref="envParamForm" :model="envParam" label-width="100px" label-position="left" :rules="envParamRules">
        <el-form-item label="评分类型">
          <el-radio-group v-model="envParam.scoringType" @change="changeScoringType($event)">
            <el-radio :label="1">客观评分</el-radio>
            <el-radio :label="2">主观评分</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="envParam.scoringType == 1" label="客观评分" prop="objectiveKey">
          <el-input v-model="envParam.objectiveKey" placeholder="客观评分" />
        </el-form-item>
        <el-form-item v-if="envParam.scoringType == 2" label="主观评分" prop="objectiveValue">
          <el-input v-model="envParam.objectiveValue" placeholder="主观评分" />
        </el-form-item>
        <el-form-item v-if="envParam.scoringType == 2" label="主观评分说明">
          <el-input
            v-model="envParam.subjectiveContent"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="主观评分说明"
          />
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
  getScoringParameters,
  addScoringParameters,
  updateScoringParameters,
  deleteScoringParameters
} from '@/api/subject'
import { success } from '@/utils/operation-message'

const defaultEnvParam = {
  subjectId: '',
  scoringType: 1,
  objectiveKey: '',
  objectiveValue: '',
  subjectiveContent: ''
}

export default {
  filters: {
    scoringTypeEnum(value) {
      let key = ''
      switch (value) {
        case 1:
          key = '客观评分'
          break
        case 2:
          key = '主观评分'
          break
        default:
          break
      }
      return key
    }
  },
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
        objectiveKey: [{ required: true, trigger: 'blur', message: '请输入客观评分' }],
        objectiveValue: [{ required: true, trigger: 'blur', message: '请输入主观评分' }]
      },
      isConfirmDisabled: true,
      emptyText: ''
    }
  },
  mounted() {
    console.log('this.currentrow: ', this.currentrow)
    console.log('this.paramdialogtype: ', this.paramdialogtype)
    this.getScorParameters(this.currentrow.id)
  },
  destroyed() {
    console.log(`弹窗组件销毁时触发 =>`, this.currentrow.id)
  },
  methods: {
    async getScorParameters(id) {
      const res = await getScoringParameters(id)
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
      this.$confirm(`您确定要删除当前评分参数吗?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteScoringParameters(scope.row.id)
        this.getScorParameters(this.currentrow.id)
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
            await updateScoringParameters(this.envParam, this.envParam.id)
          } else {
            await addScoringParameters(this.envParam)
          }
          this.getScorParameters(this.currentrow.id)
          this.dialogEnvVisible = false
          success()
        } else {
          return false
        }
      })
    },
    changeScoringType(evt) {
      console.log('change event => ', evt)
      console.log('change scoringType => ', this.envParam.scoringType)
      evt == 1 ? (this.envParam.objectiveValue = '', this.envParam.subjectiveContent = '') : this.envParam.objectiveKey = ''
    }
  }
}
</script>

