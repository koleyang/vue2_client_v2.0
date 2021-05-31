<template>
  <div class="register-container">
    <el-form ref="registerForm" :rules="registerRules" :label-position="labelPosition" label-width="100px" :model="formObj" class="register-form">
      <el-form-item label="email:" prop="email">
        <el-input v-model="formObj.email" :style="registerFormItem" name="email" />
      </el-form-item>
      <el-form-item label="密码:" prop="pwd">
        <el-input v-model="formObj.pwd" type="password" :style="registerFormItem" name="pwd" />
      </el-form-item>
      <el-form-item label="重复密码:" prop="repwd">
        <el-input v-model="formObj.repwd" type="password" :style="registerFormItem" name="repwd" />
      </el-form-item>
      <el-form-item label="昵称:" prop="nicheng">
        <el-input v-model="formObj.nicheng" :style="registerFormItem" name="nicheng" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" class="register-btn" @click.native.prevent="handleRegister">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { zhuce } from '@/api/user'
// import '../../../assets/element_ui_css/register.scss'

export default {
  name: 'Register',
  props: {
    hiddenParentDialog: {
      type: Function,
      default: null
    }
  },
  data() {
    const validateEmail = (rule, value, callback) => { // 注意：用到了这个验证函数，就最好不要再在函数外面用message参数，该参数提示字符串会覆盖当前验证函数里面的提示信息的
      const emailReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
      if (value === '') {
        callback(new Error('请输入邮箱地址'))
      } else if (!emailReg.test(value)) {
        callback(new Error('邮箱格式不对，请从新输入.'))
      } else {
        callback()
      }
    }
    const validateRepwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请确认密码'))
      } else if (value !== this.formObj.pwd) {
        callback(new Error('两次输入的密码不一致，请从新输入'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      labelPosition: 'right',
      formObj: {
        email: '',
        pwd: '',
        repwd: '',
        nicheng: ''
      },
      registerFormItem: { color: '#333', border: '1px solid #cdcdcd' },
      registerRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        pwd: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        repwd: [{ required: true, trigger: 'blur', validator: validateRepwd }],
        nicheng: [{ required: true, trigger: 'blur', message: '请输入昵称' }]
      }
    }
  },
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate(async valid => {
        if (valid) {
          zhuce(this.formObj).then(res => {
            if (res.code === 1) {
              console.log('res: ', res)
              this.$emit('hiddendialog')
              //   this.$parent.hiddenParentDialog()
            //   this.hiddenParentDialog && this.hiddenParentDialog()
            }
          }).catch(err => {
            console.log('err: => failedDialog ', err.meaasge)
            this.$emit('failedDialog', err)
          })
        } else {
          console.log('表达验证失败，请重新填写.')
        }
      })
    }
  }
}
</script>

  <style lang="scss">
  .register-container {
      .register-form {
          .el-form-item {
              background: rgba(0, 0, 0, 0);
              .el-input {
                  border-radius: 4px;
                  input {
                      color: #333333;
                      caret-color: #333333;
                  }
              }
          }
      }
  }
  .el-form-item--medium .el-form-item__label {
      line-height: 50px;
  }
  .register-btn {
      width: 85%;
      margin-bottom: 5px;
  }
  </style>

