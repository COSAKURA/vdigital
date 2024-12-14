<template>
  <div class="login-page">
    <div class="content-container">
      <!-- 左侧内容 -->
      <div class="left-content">
        <h2>让每一个原创内容<br>都获得 <span class="highlight">尊重</span> 和 <span class="highlight">持续回报</span></h2>
        <ul class="features">
          <li>📜 DCI 申领：快捷认证权属</li>
          <li>🔒 版权保护：解决侵权问题</li>
          <li>📈 内容出海：增加变现机会</li>
        </ul>
        <img src="../assets/images/resource/success-1.jpg" alt="Globe" class="globe-image" />
      </div>

      <!-- 右侧登录表单 -->
      <div class="right-form">
        <el-card class="form-card">
          <h2 class="form-title">欢迎登录数字存证平台</h2>
          <el-tabs v-model="activeTab" class="login-tabs">
            <el-tab-pane label="账号密码登录" name="account">
              <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="loginForm.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
                </el-form-item>
                <div class="form-actions">
                  <router-link to="/register" class="register-link">没有账号?👉 点击注册</router-link>
                  <router-link to="/forgot-password" class="forgot-password">忘记密码?</router-link>
                </div>
                <el-form-item>
                  <el-button type="primary" class="login-button" @click="handleLogin">登 录</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import request from "../utils/reques";

// 登录表单数据
const loginForm = reactive({
  email: "",
  password: "",
});

// 表单验证规则
const rules = {
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: ["blur", "change"] },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const activeTab = ref("account");
const loginFormRef = ref(null);

// 登录处理逻辑
const handleLogin = async () => {
  // 验证表单
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 发送登录请求
        const response = await request.post("/user/login", loginForm);

        // 获取响应数据
        const { msg, code, loginToken } = response.data;

        // 判断登录是否成功
        if (code === 0) {
          // 成功，保存 token 和 email
          localStorage.setItem("loginToken", loginToken);
          localStorage.setItem("email", loginForm.email);

          ElMessage.success("登录成功！");
          console.log("登录成功：", response.data);

          // 跳转到主页或其他页面
          setTimeout(() => {
            window.location.href = "/home"; // 根据需要修改跳转路径
          }, 1000);
        } else {
          // 如果响应码不是成功
          ElMessage.error(msg || "登录失败！");
        }
      } catch (error) {
        ElMessage.error("登录失败，请检查用户名或密码！");
        console.error("登录错误：", error);
      }
    } else {
      ElMessage.error("请填写完整的表单信息！");
    }
  });
};

</script>

<style scoped>
/* 整体页面样式 */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vw;
  background-color: #f5faff;
  /* 浅蓝背景 */
  transform: scale(1.3);
  /* 放大页面至130% */
  transform-origin: center;

}

/* 内容容器 */
.content-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  max-width: 1200px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 左侧内容 */
.left-content {
  flex: 1.5;
  padding: 40px;
  background-color: #eef5ff;
}

.left-content h2 {
  font-size: 24px;
  line-height: 1.8;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.left-content .highlight {
  color: #6a71f0;
}

.features {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  color: #666;
}

.features li {
  margin-bottom: 10px;
  font-size: 14px;
}

.globe-image {
  width: 60%;
  margin-top: 20px;
}

/* 右侧表单 */
.right-form {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 400px;
}

.form-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.login-tabs {
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.forgot-password,
.register-link {
  font-size: 12px;
  color: #666;
}

.register-link {
  font-weight: bold;
  color: #409eff;
}

.login-button {
  margin-top: 18px;
  width: 100%;
  background: linear-gradient(to right, #4facfe, #00f2fe);
  color: white;
}
</style>
