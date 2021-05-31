<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddSubject">创建科目</el-button>

    <el-table :data="subjectList" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="科目名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.subjectName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="说明" width="220">
        <template slot-scope="scope">
          {{ scope.row.subjectExplain }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
          <el-button type="primary" size="small" @click="handleEnvironmentalParamsSet(scope)">环境参数设置</el-button>
          <el-button type="danger" size="small" @click="handleScoringParamsSet(scope)">评分参数设置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑科目':'新建科目'" :close-on-click-modal="false">
      <el-form ref="subjectForm" :model="subject" label-width="100px" label-position="left" :rules="subjectRules">
        <el-form-item label="科目名称" prop="subjectName">
          <el-input v-model="subject.subjectName" placeholder="科目名称" />
        </el-form-item>
        <el-form-item label="说明" prop="subjectExplain">
          <el-input
            v-model="subject.subjectExplain"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="说明"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="paramDialogVisible"
      :visible.sync="paramDialogVisible"
      :title="paramDialogType==='env'?'环境参数':'评分参数'"
      :close-on-click-modal="false"
      width="80%"
    >
      <environmental-param
        v-if="paramDialogType==='env'"
        ref="envparam"
        :currentrow="currentRow"
        :paramdialogtype="paramDialogType"
      />
      <scoring-param
        v-if="paramDialogType==='scoring'"
        ref="scorparam"
        :currentrow="currentRow"
        :paramdialogtype="paramDialogType"
      />
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getSubjectSG, addSubject, updateSubject, deleteSubject } from '@/api/subject'
import { success } from '@/utils/operation-message'
// import { getRoles } from '@/api/role'
import EnvironmentalParam from './components/EnvironmentalParam'
import ScoringParam from './components/ScoringParam'

const defaultSubject = {
  subjectName: '',
  subjectExplain: ''
}

export default {
  components: {
    EnvironmentalParam,
    ScoringParam
  },
  data() {
    return {
      subject: Object.assign({}, defaultSubject),
      subjectList: [],
      roleList: [],
      dialogVisible: false,
      paramDialogVisible: false,
      dialogType: 'new',
      paramDialogType: 'env',
      currentRow: {},
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      subjectRules: {
        subjectName: [{ required: true, trigger: 'blur', message: '请输入科目名称' }],
        subjectExplain: [{ required: true, trigger: 'blur', message: '请输入说明' }]
      },
      isConfirmDisabled: true
    }
  },
  created() {
    this.getUsers()
    // this.getRoles()
  },
  methods: {
    async getUsers() {
      const res = await getSubjectSG()
      this.subjectList = res.datas
    },
    handleAddSubject() {
      this.subject = Object.assign({}, defaultSubject)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.isConfirmDisabled = false
      this.subject = deepClone(scope.row)
    },
    handleDelete(scope) {
      this.$confirm(`您确定要删除当前科目吗?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteSubject(scope.row.id)
        this.getUsers()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => { console.error(err) })
    },
    async confirmUser() {
      this.$refs.subjectForm.validate(async valid => {
        if (valid) {
          this.isConfirmDisabled = false
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            await updateSubject(this.subject, this.subject.id)
          } else {
            await addSubject(this.subject)
          }
          this.getUsers()
          this.dialogVisible = false
          success()
        } else {
          return false
        }
      })
    },
    handleEnvironmentalParamsSet(scope) {
      console.log('scope.row: ', scope.row.id)
      this.currentRow = scope.row
      this.paramDialogType = 'env'
      this.paramDialogVisible = true
    },
    handleScoringParamsSet(scope) {
      console.log('scope.row: ', scope.row.id)
      this.currentRow = scope.row
      this.paramDialogType = 'scoring'
      this.paramDialogVisible = true
    }
  }
}
</script>

