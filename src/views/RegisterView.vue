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
        <img src="../assets/images/resource/success-1.jpg" alt="Illustration" class="illustration" />
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
            <el-form-item label="验证码" prop="emailCode">
              <div class="code-input-wrapper">
                <el-input v-model="registerForm.emailCode" placeholder="请输入验证码" />
                <el-button class="send-code-btn" :disabled="isSending" @click="sendCode">
                  {{ isSending ? `${countdown}s 后重试` : "获取验证码" }}
                </el-button>
              </div>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="新密码" prop="password">
              <el-input v-model="registerForm.password" placeholder="请输入密码" type="password" show-password />
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
              <el-button type="primary" class="register-button" @click="handleRegister"
                :disabled="!registerForm.agreement">
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
import { ElMessage } from "element-plus";
import request from "../utils/reques";

// 注册表单数据和验证规则
const registerForm = reactive({
  username: "",
  email: "",
  emailCode: "",
  password: "",
  type: "0",
});

// 表单规则
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 20, message: "用户名长度应为2-20个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "邮箱格式不正确", trigger: "blur" },
  ],
  emailCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

// 表单实例
const registerFormRef = ref(null);

// 验证码相关状态
const isSending = ref(false);
const countdown = ref(60);

// 发送验证码逻辑
const sendCode = async () => {
  if (!registerForm.email) {
    ElMessage.error("请先填写邮箱！");
    return;
  }

  isSending.value = true;
  countdown.value = 60;

  try {
    const response = await request.post("/user/emailCode", { email: registerForm.email });

    if (response.data.code === 0) {
      ElMessage.success("验证码已发送！");
      const timer = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--;
        } else {
          isSending.value = false;
          clearInterval(timer);
        }
      }, 1000);
    } else {
      ElMessage.error(response.data.msg || "发送验证码失败，请稍后重试！");
      isSending.value = false;
    }
  } catch (error) {
    ElMessage.error("发送验证码失败，请稍后重试！");
    isSending.value = false;
    console.error("发送验证码错误：", error);
  }
};

// 注册处理逻辑
const handleRegister = async () => {
  if (!registerFormRef.value) {
    return;
  }

  // 调用表单实例的 validate 方法验证表单
  registerFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await request.post("/user/register", registerForm);

        if (response.data.code === 0) {
          ElMessage.success("注册成功！");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        } else {
          ElMessage.error(response.data.msg || "注册失败，请稍后重试！");
        }
      } catch (error) {
        ElMessage.error("注册失败，请检查信息！");
        console.error("注册错误：", error);
      }
    } else {
      ElMessage.error("请填写完整信息！");
    }
  });
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
  transform: scale(1.3);
  /* 整体放大比例 */
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
  padding: 50px;
  background-color: #eef5ff;
}

.left-content h2 {
  font-size: 28px;
  line-height: 2;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.left-content .highlight {
  color: #6a71f0;
}

.illustration {
  width: 60%;
  margin-top: 20px;
}

.features {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  color: #666;
  font-size: 16px;
}

/* 右侧表单 */
.right-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
}

.form-card {
  width: 100%;
  max-width: 450px;
}

.form-title {
  font-size: 24px;
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
  font-size: 18px;
  background: linear-gradient(to right, #4facfe, #00f2fe);
  color: white;
}

.link {
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}

.link:hover {
  text-decoration: underline;
}
</style>
