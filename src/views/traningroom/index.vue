<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddTrainingRoom">创建舱室</el-button>

    <el-table :data="trainingRoomList" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="舱室名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="舱室类型" width="220">
        <template slot-scope="scope">
          {{ scope.row.traningRoomType | traningRoomEnum }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="IP地址" width="220">
        <template slot-scope="scope">
          {{ scope.row.ip }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
          <el-button type="primary" size="small" @click="handleEnvironmentalParamsSet(scope)">舱室设备管理</el-button>
          <!-- <el-button type="danger" size="small" @click="handleScoringParamsSet(scope)">评分参数设置</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑舱室':'新建舱室'" :close-on-click-modal="false">
      <el-form ref="trainingRoomForm" :model="traningRoom" label-width="120px" label-position="left" :rules="trainingRoomRules">
        <el-form-item label="舱室名称" prop="name">
          <el-input v-model="traningRoom.name" placeholder="舱室名称" />
        </el-form-item>
        <el-form-item label="选择舱室类型" prop="traningRoomType">
          <el-select v-model="traningRoom.traningRoomType" class="selector" placeholder="请选择">
            <el-option
              v-for="item in traningRoomTypeList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="traningRoom.ip" placeholder="IP地址" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmSubmit">确定</el-button>
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
import { deepClone, isValidIP } from '@/utils'
import { getTrainingRoomInfo, addTrainingRoom, updateTrainingRoom, deleteTrainingRoom } from '@/api/traningroom'
import { success } from '@/utils/operation-message'
// import { getRoles } from '@/api/role'
import EnvironmentalParam from './components/EnvironmentalParam'
import ScoringParam from './components/ScoringParam'

const defaultTrainingRoom = {
  name: '',
  traningRoomType: '',
  ip: ''
}

export default {
  components: {
    EnvironmentalParam,
    ScoringParam
  },
  data() {
    const validateIP = (rule, value, callback) => {
      console.log('value: ', value)
      if (!value) {
        callback(new Error('请输入IP地址'))
      } else if (!isValidIP(value)) {
        callback(new Error('IP地址格式错误.'))
      } else {
        callback()
      }
    }
    return {
      traningRoom: Object.assign({}, defaultTrainingRoom),
      trainingRoomList: [],
      traningRoomTypeList: [
        { id: 1, title: '灭火舱' },
        { id: 2, title: '逃生舱' },
        { id: 3, title: '抗沉舱1' },
        { id: 4, title: '抗沉舱2' }
      ],
      dialogVisible: false,
      paramDialogVisible: false,
      dialogType: 'new',
      paramDialogType: 'env',
      currentRow: {},
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      trainingRoomRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入舱室名称' }],
        traningRoomType: [{ required: true, trigger: 'change', message: '请选择舱室类型' }],
        ip: [{ required: true, trigger: 'blur', validator: validateIP }]
      },
      isConfirmDisabled: true
    }
  },
  created() {
    this.getTrainingRoomInfo()
    // this.getRoles()
  },
  methods: {
    async getTrainingRoomInfo() {
      const res = await getTrainingRoomInfo()
      this.trainingRoomList = res
    },
    handleAddTrainingRoom() {
      this.traningRoom = Object.assign({}, defaultTrainingRoom)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      console.log('scope.row: ', scope.row)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.isConfirmDisabled = false
      this.traningRoom = deepClone(scope.row)
    },
    handleDelete(scope) {
      this.$confirm(`您确定要删除当前舱室吗?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteTrainingRoom(scope.row.id)
        this.getTrainingRoomInfo()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => { console.error(err) })
    },
    async confirmSubmit() {
      this.$refs.trainingRoomForm.validate(async valid => {
        if (valid) {
          this.isConfirmDisabled = false
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            await updateTrainingRoom(this.traningRoom, this.traningRoom.id)
          } else {
            await addTrainingRoom(this.traningRoom)
          }
          this.getTrainingRoomInfo()
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

