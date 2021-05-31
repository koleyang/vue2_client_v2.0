<template>
  <div class="app-container">
    <!-- <el-button type="primary" @click="handleAddUser">创建训练</el-button> -->

    <el-table :data="achievementList" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="开始时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.startTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="自检对象">
        <template slot-scope="scope">
          {{ scope.row.selfTestObject }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="人员对象">
        <template slot-scope="scope">
          {{ scope.row.personnelObject }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="结果对象">
        <template slot-scope="scope">
          {{ scope.row.resultObject }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="评分">
        <template slot-scope="scope">
          {{ scope.row.score }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <!-- <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑训练参数':'创建训练'" :close-on-click-modal="false">
      <el-form ref="achievementForm" :model="achievement" label-width="120px" label-position="left" :rules="achievementRules">
        <el-form-item label="选择科目" prop="subjectId">
          <el-select v-model="achievement.subjectId" class="selector" placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.subjectName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="训练开始时间" prop="startTime">
          <el-date-picker
            v-model="achievement.startTime"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            placeholder="训练开始时间"
            type="datetime"
          />
        </el-form-item>
        <el-form-item label="训练结束时间" prop="endTime">
          <el-date-picker
            v-model="achievement.endTime"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            placeholder="训练结束时间"
            type="datetime"
          />
        </el-form-item>

        <el-form-item label="自检对象" prop="name">
          <el-input v-model="achievement.selfTestObject" placeholder="" />
        </el-form-item>
        <el-form-item label="人员对象" prop="mobile">
          <el-input v-model="achievement.personnelObject" placeholder="" />
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
import { getAchievementSG, updateAchievement } from '@/api/achievement'
import { success } from '@/utils/operation-message'
import { getSubjectSG } from '@/api/subject'

const defaultAchievement = {
  subjectId: '',
  startTime: '',
  endTime: '',
  selfTestObject: '',
  personnelObject: ''
}

export default {
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error(rule.message))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   console.log('value: ', value)
    //   if (!value) {
    //     callback(new Error('请输入密码'))
    //   } else if (value.length < 6) {
    //     callback(new Error('密码长度不得少于6位数'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      achievement: Object.assign({}, defaultAchievement),
      achievementList: [],
      subjectList: [],
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      achievementRules: {
        subjectId: [{ required: true, trigger: 'change', message: '请选择科目' }],
        startTime: [{ required: true, trigger: 'blur', message: '请输入训练开始时间' }],
        endTime: [{ required: true, trigger: 'blur', message: '请输入训练结束时间' }]
      },
      isConfirmDisabled: true
    }
  },
  created() {
    this.getAchievement()
    this.getSubjects()
  },
  methods: {
    async getAchievement() {
      const res = await getAchievementSG()
      this.achievementList = res.datas
    },
    async getSubjects() {
      const res = await getSubjectSG()
      this.subjectList = res.datas
      console.log('res.datas: ', res.datas)
      console.log('我是科目列表this.subjectList: ', this.subjectList)
    },
    handleAddUser() {
      this.achievement = Object.assign({}, defaultAchievement)
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
      this.achievement = deepClone(scope.row)
      console.log('scope.row: ', scope.row)
      console.log('this.achievement: ', this.achievement)
    },
    // handleDelete(scope) {
    //   this.$confirm(`您确定要删除用户${scope.row.name}吗?`, '', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(async() => {
    //       await deleteUser(scope.row.id)
    //       this.getUsers()
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功'
    //       })
    //     })
    //     .catch(err => { console.error(err) })
    // },
    async confirmUser() {
      this.$refs.achievementForm.validate(async valid => {
        if (valid) {
          this.isConfirmDisabled = false
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            await updateAchievement(this.achievement, this.achievement.id)
          } else {
            await addUser(this.achievement)
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

