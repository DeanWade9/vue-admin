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
      <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" class="login-form">
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
              <el-input v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button type="success" class="block" @click="getSMS" :disabled="codeBtnStatus">{{codeBtnText}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        
        <el-form-item class="submit-item">
          <el-button type="danger" class="block" @click="submitForm('loginForm')" :disabled="loginBtnStatus">{{isActive === 0 ? "登陆" : "注册"}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { GetSMS, Register, Login } from '@/api/login'
import { stripscript, validatemail, validatepassword, validatecode } from '@/utils/validate'
import { reactive, ref, isRef, toRefs, onMounted } from '@vue/composition-api'
export default {
  name: "login",
  setup(props, context) {
  // setup(props, { refs, root }) {
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
    // 申明数据
    const isActive = ref(0) // 0代表当前tab对应登陆, 1代表注册
    const loginBtnStatus = ref(true) //登陆按钮状态, 默认禁用
    const codeBtnStatus = ref(false) // 发送验证码按钮, 默认不禁用
    const codeBtnText = ref('获取验证码') // 发送验证码按钮文本, 动态可变
    const timer = ref(null) // 倒计时
    /**
     * 声明函数
     */
    const toggleClass = (index => {
      isActive.value = index
      console.log(isActive.value === 0 ? '登陆' : '注册')
      // 重置表单
      context.refs['loginForm'].resetFields()
    })
    const submitForm = (formName => {
      context.refs[formName].validate((valid) => {
        if (valid) {
          isActive.value ===0  ? login() : register()
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    })
    /**
     * 注册
     */
    const register = () => {
      // 获取用户输入注册信息
      var requestData = {
        username: ruleForm.email,
        password: ruleForm.password,
        code: ruleForm.code,
        module: 'register'
      }
      Register(requestData).then(response => {
        console.log(response);
        var data = response.data
        context.root.$message({
          message: data.message,
          type: 'success'
        })
        // 模拟注册成功 上面的loginBtnStatus也打开禁用了
        toggleClass(0)
        // 清除倒计时
        clearCountDown()
      }).catch(error => {

      })
    }
    /**
     * 登陆
     */
    const login = () => {
      var requestData = {
        username: ruleForm.email,
        password: ruleForm.password,
        code: ruleForm.code
      }
      Login(requestData).then(response => {
        console.log(response)
      }).catch(error => {

      })
    }
    /**
     * 提交表单
     */
    
    /**
     * 获取验证码
     */
    const getSMS = (() => {
      // 校验是否为空, 空的话并且return 拦截,不会走到后面发请求
      if (ruleForm.email === '') {
        context.root.$message.error('邮箱不能为空')
        return
      }
      // 校验格式是否正确, 不正确的话return 拦截,不会走到后面发请求
      if (validatemail(ruleForm.email)) {
        context.root.$message.error('邮箱格式不对')
        return
      }
      // 修改发送验证码按钮状态
      codeBtnStatus.value = false
      // 修改发送验证码按钮内部文本
      codeBtnText.value = '发送中'
      // 获取验证码
      var requestData = {
        username: ruleForm.email,
        module: isActive.value == 0 ? 'login' : 'register'
      }
      // 请求接口
      setTimeout(() => {
        GetSMS(requestData).then(response => {
          context.root.$message({
            message: response.data.message,
            type: 'success'
            })
          // 启用登陆或注册按钮
          loginBtnStatus.value = false
          // 调用计时器 倒计时
          countDown(10)
        }).catch(error => {
          context.root.$message.error(error)
        })
        }, 3000)
    })

    /**
     * 倒计时
     */
    const countDown = ((seconds) => {
      // 判断是否已经存在定时器，存在则清除
      if (timer.value) {
        clearInterval(timer.value)
      }
      // 这里有BUG,0和开始的数字没有了
      var time = seconds
      timer.value = setInterval(() => {
        time--
        if (time === 0) {
          // 到时间清除定时器
          clearInterval(timer.value)
          // 显示按钮
          codeBtnStatus.value = false
          codeBtnText.value = '再次获取'
        } else {
          codeBtnText.value = `倒计时${time}秒`
        }
      }, 1000)
    })
    /**
     * 清除倒计时
     */
    const clearCountDown = (() => {
      // 放开发送验证码按钮禁用状态
      codeBtnStatus.value = false
      codeBtnText.value = '获取验证码'
      // 清除倒计时
      clearInterval(timer.value)
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
      getSMS,
      loginBtnStatus,
      codeBtnStatus,
      codeBtnText
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
