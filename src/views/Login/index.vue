<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
        :class="{'current': isActive === index}"
        v-for="(item,index) in menuTab"
        :key="index"
        @click="toggleClass(index)"
        >
        {{item.txt}}
        </li>
      </ul>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form">
        <el-form-item prop="email" class="item-form">
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label>密码</label>
          <el-input type="text" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="repassword" class="item-form" v-show="isActive === 1">
          <label>重复密码</label>
          <el-input type="text" v-model="ruleForm.repassword" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-input v-model.number="ruleForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button type="success" class="block" @click="getSMS">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        
        <el-form-item class="submit-item">
          <el-button type="danger" class="block" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { GetSMS } from '@/api/login'
import { stripscript, validatemail, validatepassword, validatecode } from '@/utils/validate'
import { reactive, ref, isRef, toRefs, onMounted } from '@vue/composition-api'
export default {
  name: "login",
  setup(props, context) {
    // 验证验证码
    var checkCode = (rule, value, callback) => {
      ruleForm.code = stripscript(value)
      value = ruleForm.code
      if (!value) {
        return callback(new Error('验证码不能为空'));
      } else if (validatecode(value)) {
        callback(new Error('验证码格式有误(6位数字+字母)'));
      } else {
          callback();
      }
    };
    // 验证邮箱
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户邮箱'));
      } else if (validatemail(value)) {
        callback(new Error('请输入正确格式的邮箱'))
      } else {
        callback();
      }
    };
    // 验证密码
    var validatePass = (rule, value, callback) => {
      ruleForm.password = stripscript(value)
      value = ruleForm.password
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (validatepassword(value)) {
        callback(new Error('密码为6-20位数字+字母'));
      } else {
        callback();
      }
    };

    // 验证重复密码
    var validateRePass = (rule, value, callback) => {
      // 如果当前tab是注册,重复密码这里直接通过
      if (isActive.value === 0) {
        callback();
        return;
      }
      ruleForm.repassword = stripscript(value)
      value = ruleForm.repassword
      if (value === '') {
        callback(new Error('请输入重复密码'))
      } else if (value !== ruleForm.password) {
        callback(new Error('重复密码和密码不一致'))
      } else {
        callback();
      }
    }
    // 这里面是data数据,生命周期, 自定义函数
    const menuTab = reactive([
      { txt: '登录' },
      { txt: '注册' }
    ])

    // 表单绑定数据
    const ruleForm = reactive({
      email: '',
      password: '',
      repassword: '',
      code: ''
    })

    // 表单验证对象
    const rules = reactive({
      email: [
        { validator: validateEmail, trigger: 'blur' }
      ],
      password: [
        { validator: validatePass, trigger: 'blur' }
      ],
      repassword: [
        { validator: validateRePass, trigger: 'blur' }
      ],
      code: [
        { validator: checkCode, trigger: 'blur' }
      ]
    })

    const isActive = ref(0) // 0代表当前tab对应注册, 1代表登录
    /**
     * 声明函数
     */
    const toggleClass = (index => {
      isActive.value = index
    })
    const submitForm = (formName => {
      context.refs[formName].validate((valid) => {
        alert(1)
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    })
    /**
     * 提交表单
     */
    
    /**
     * 获取验证码
     */
    const getSMS = (() => {
      GetSMS()
    })
    /**
     * 生命周期
     */
    // 挂载完成后
    onMounted (() => {

    })

    return {
      menuTab,
      isActive,
      toggleClass,
      submitForm,
      ruleForm,
      rules,
      getSMS
    }
  }
};
</script>
<style lang="scss">
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 300px;
  margin: auto;
}
.menu-tab{
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, .1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    color: #fff;
    font-size: 14px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .submit-item {
    margin-top: 30px;
  }
}
</style>
