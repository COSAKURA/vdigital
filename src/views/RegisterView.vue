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
                <a href="#" class="link" @click.prevent="showPolicy('terms')">《用户协议》</a>
                和
                <a href="#" class="link" @click.prevent="showPolicy('privacy')">《法律声明与隐私政策》</a>
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
    
<!-- 将模态框绑定修正为使用 v-model -->
<el-dialog v-model="policyDialog.visible" width="60%" :title="policyDialog.title">
  <div class="policy-content">
    <div v-html="policyDialog.content"></div>
  </div>
  <template #footer>
    <el-button @click="policyDialog.visible = false">关闭</el-button>
  </template>
</el-dialog>

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
  agreement: false,
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

// 模态框内容和状态
const policyDialog = reactive({
  visible: false,
  title: "",
  content: "",
});

// 显示模态框逻辑
const showPolicy = (type) => {
  policyDialog.visible = true;

  if (type === "terms") {
    policyDialog.title = "用户协议";
    policyDialog.content = `
      <p>欢迎您使用本网站及服务（以下统称“服务”）。在您使用本服务之前，请您仔细阅读并充分理解以下条款内容。本用户协议（以下称“协议”）是您与本网站之间具有法律约束力的协议。使用本服务即表示您已同意本协议的全部内容。</p>
      
      <h4>一、账号注册与使用</h4>
      <ul>
        <li>您在注册账户时应提供真实、合法、有效的个人信息，确保信息的真实性。如因信息不实导致的任何问题，由您自行承担相应责任。</li>
        <li>用户注册后，不得将账户转让或出借他人使用。如发现非本人操作的行为，应立即通知平台。</li>
        <li>您需妥善保管账户信息及密码。如因用户自身原因导致账户信息泄露或被盗，本平台不承担责任。</li>
      </ul>

      <h4>二、用户行为规范</h4>
      <ul>
        <li>用户不得利用本服务发布、传播违反中国法律法规的信息，包括但不限于：</li>
        <ul>
          <li>侵犯他人知识产权、隐私权等合法权利的信息；</li>
          <li>含有色情、暴力、恐怖、政治敏感或其他违法内容的信息；</li>
          <li>损害社会公共利益的信息。</li>
        </ul>
        <li>用户不得通过技术手段破坏服务的正常运行，包括但不限于攻击服务器、非法抓取数据等行为。</li>
        <li>若发现用户违反上述规定，本平台有权暂停或终止服务，情节严重者将移交司法机关处理。</li>
      </ul>

      <h4>三、服务的中止与终止</h4>
      <ul>
        <li>如用户存在以下行为，本平台有权中止或终止服务，且不承担任何责任：</li>
        <ul>
          <li>提供虚假注册信息；</li>
          <li>多次违反用户行为规范；</li>
          <li>涉及违法犯罪行为。</li>
        </ul>
        <li>平台保留在提前通知的情况下修改、暂停或终止服务的权利。</li>
      </ul>

      <h4>四、隐私保护</h4>
      <ul>
        <li>平台承诺不会未经用户授权向第三方披露用户的个人信息，但以下情况除外：</li>
        <ul>
          <li>基于法律法规的要求；</li>
          <li>应国家有权机关的要求；</li>
          <li>为维护公共安全和社会利益。</li>
        </ul>
        <li>平台将采取合理的技术手段保护用户的信息安全，但因不可抗力导致的信息泄露，平台不承担责任。</li>
      </ul>
    `;
  } else if (type === "privacy") {
    policyDialog.title = "法律声明与隐私政策";
    policyDialog.content = `

      <h4>一、法律声明</h4>
      <ul>
        <li>本平台尊重并保护所有用户的合法权益，承诺依法提供服务。</li>
        <li>用户在平台发布的内容应符合法律法规，若涉及侵权或违法行为，由用户自行承担相应法律责任。</li>
      </ul>

      <h4>二、隐私政策</h4>
      <ul>
        <li><strong>信息收集：</strong> 在您注册及使用服务过程中，平台将收集必要的个人信息，包括但不限于：姓名、邮箱、联系方式等。</li>
        <li><strong>信息使用：</strong> 平台仅为以下目的使用用户信息：
          <ul>
            <li>提供更优质的服务；</li>
            <li>满足法律法规要求；</li>
            <li>用于改进平台功能。</li>
          </ul>
        </li>
        <li><strong>信息保护：</strong> 平台将采取加密存储等技术手段保护用户信息，但因不可抗力导致的信息泄露，平台免责。</li>
        <li><strong>用户权利：</strong> 用户可随时修改、删除账户信息或注销账户，但账户注销后与本平台服务相关的数据将无法恢复。</li>
      </ul>

      <p>若对上述条款有任何疑问，请通过客服渠道联系我们，我们将尽快答复。</p>
    `;
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

.policy-content {
  max-height: 400px;
  overflow-y: auto;
  line-height: 1.6;
  color: #666;
}

.policy-content h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
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

.policy-content {
  max-height: 400px;
  overflow-y: auto;
  line-height: 1.8;
  font-size: 16px;
  color: #555;
}

.policy-content h3 {
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
  font-weight: bold;
}

.policy-content h4 {
  font-size: 18px;
  margin: 12px 0;
  color: #444;
  font-weight: bold;
}

.policy-content ul {
  padding-left: 20px;
  margin-bottom: 16px;
  list-style: disc;
}

.policy-content ul ul {
  list-style: circle;
}

.policy-content p {
  margin-bottom: 16px;
}
</style>
