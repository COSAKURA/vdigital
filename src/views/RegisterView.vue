<template>
  <div class="register-page">
    <div class="content-container">
      <!-- 左侧内容 -->
      <div class="left-content">
        <h2>
          让每一个原创内容<br />
          都获得 <span class="highlight">尊重</span> 和
          <span class="highlight">持续回报</span>
        </h2>
        <ul class="features">
          <li>📜 DCI 申领：快捷认证权属</li>
          <li>🔒 版权保护：解决侵权问题</li>
          <li>📈 内容出海：增加变现机会</li>
        </ul>
        <img
          src="../assets/images/resource/service-2.png"
          alt="Illustration"
          class="illustration"
        />
      </div>

      <!-- 右侧注册表单 -->
      <div class="right-form">
        <el-card class="form-card">
          <h2 class="form-title">用户注册</h2>
          <el-form :model="registerForm" :rules="rules" ref="registerFormRef">
            <!-- 用户名 -->
            <el-form-item label="用户名" prop="username">
              <el-input v-model="registerForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item label="邮箱号" prop="email">
              <el-input v-model="registerForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <!-- 验证码 -->
            <el-form-item label="验证码" prop="code">
              <div class="code-input-wrapper">
                <el-input v-model="registerForm.code" placeholder="请输入验证码" />
                <el-button
                  class="send-code-btn"
                  :disabled="isSending"
                  @click="sendCode"
                >
                  {{ isSending ? `${countdown}s 后重试` : "获取验证码" }}
                </el-button>
              </div>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="新密码" prop="password">
              <el-input
                v-model="registerForm.password"
                placeholder="请输入密码"
                type="password"
                show-password
              />
            </el-form-item>
            <!-- 同意协议 -->
            <el-form-item>
              <el-checkbox v-model="registerForm.agreement">
                我已阅读并同意
                <a href="#" class="link">《用户协议》</a>
                和
                <a href="#" class="link">《法律声明与隐私政策》</a>
              </el-checkbox>
            </el-form-item>
            <!-- 注册按钮 -->
            <el-form-item>
              <el-button
                type="primary"
                class="register-button"
                @click="handleRegister"
                :disabled="!registerForm.agreement"
              >
                注 册
              </el-button>
            </el-form-item>
          </el-form>
          <!-- 已有账号 -->
          <div class="login-link">
            <router-link to="/" class="link">已有账号 👉 直接登录</router-link>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";

// 注册表单数据和验证规则
const registerForm = reactive({
  username: "",
  email: "",
  code: "",
  password: "",
  agreement: false,
});

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 20, message: "用户名长度应为2-20个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "邮箱格式不正确", trigger: "blur" },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

// 验证码相关状态
const isSending = ref(false);
const countdown = ref(60);

// 发送验证码逻辑
const sendCode = async () => {
  if (!registerForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
    ElMessage.error("请输入正确的邮箱！");
    return;
  }
  isSending.value = true;
  countdown.value = 60;

  try {
    await axios.post("/user/emailCode", { email: registerForm.email });
    ElMessage.success("验证码已发送！");
    const timer = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      } else {
        isSending.value = false;
        clearInterval(timer);
      }
    }, 1000);
  } catch (error) {
    ElMessage.error("发送验证码失败，请稍后重试！");
    isSending.value = false;
  }
};

// 注册处理
const handleRegister = async () => {
  try {
    await axios.post("/api/register", registerForm);
    ElMessage.success("注册成功！");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  } catch (error) {
    ElMessage.error("注册失败，请检查信息！");
    console.error("注册错误：", error);
  }
};
</script>

<style scoped>
/* 页面整体样式 */
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #f5faff;
  transform: scale(1.2); /* 整体放大到120% */
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
  padding: 50px; /* 放大内容间距 */
  background-color: #eef5ff;
}

.left-content h2 {
  font-size: 28px; /* 增大字体 */
  line-height: 2;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.left-content .highlight {
  color: #6a71f0;
}

.illustration {
  width: 60%; /* 增大图片比例 */
  margin-top: 20px;
}

.features {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  color: #666;
  font-size: 16px; /* 调整字体大小 */
}

/* 右侧表单 */
.right-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px; /* 放大内容间距 */
}

.form-card {
  width: 100%;
  max-width: 450px; /* 调整表单宽度 */
}

.form-title {
  font-size: 24px; /* 增大标题字体 */
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.code-input-wrapper {
  display: flex;
  gap: 12px;
}

.send-code-btn {
  white-space: nowrap;
  font-size: 16px;
}

.register-button {
  width: 100%;
  height: 48px;
  font-size: 18px; /* 增大按钮字体 */
  background: linear-gradient(to right, #4facfe, #00f2fe);
  color: white;
}

.link {
  color: #409eff;
  text-decoration: none;
  font-size: 14px; /* 增大字体 */
}

.link:hover {
  text-decoration: underline;
}
</style>
