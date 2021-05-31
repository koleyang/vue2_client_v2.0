<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddStudent">新建学员</el-button>

    <el-table :data="studentList" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="学员编号" width="220">
        <template slot-scope="scope">
          {{ scope.row.sNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="学员姓名" width="320">
        <template slot-scope="scope">
          {{ scope.row.studentName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑学员':'新建学员'">
      <el-form ref="studentForm" :model="student" label-width="80px" label-position="left" :rules="studentRules">
        <el-form-item label="学员编号" prop="sNo">
          <el-input v-model="student.sNo" auto-complete="new-password" placeholder="学员编号" />
        </el-form-item>
        <el-form-item label="学员姓名" prop="studentName">
          <el-input v-model="student.studentName" placeholder="学员姓名" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmStudent">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getStudentSG, addStudent, updateStudent, deleteStudent } from '@/api/student'
import { success } from '@/utils/operation-message'

const defaultStudent = {
  sNo: '',
  studentName: ''
}

export default {
  data() {
    return {
      student: Object.assign({}, defaultStudent),
      studentList: [],
      roleList: [],
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      password_hint: '密码',
      studentRules: {
        sNo: [{ required: true, trigger: 'blur', message: '请输入学员编号' }],
        studentName: [{ required: true, trigger: 'blur', message: '请输入学员姓名' }]
      },
      isConfirmDisabled: true
    }
  },
  created() {
    this.getStudent()
  },
  methods: {
    async getStudent() {
      const res = await getStudentSG()
      this.studentList = res.datas
    },
    handleAddStudent() {
      this.student = Object.assign({}, defaultStudent)
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
      this.password_hint = '不填写即代表不修改'
      this.student = deepClone(scope.row)
    },
    handleDelete(scope) {
      this.$confirm(`您确定要删除该学员吗?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteStudent(scope.row.id)
          this.getStudent()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmStudent() {
      this.$refs.studentForm.validate(async valid => {
        if (valid) {
          this.isConfirmDisabled = false
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            await updateStudent(this.student, this.student.id)
          } else {
            await addStudent(this.student)
          }
          this.getStudent()
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

