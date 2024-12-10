<template>
  <div class="home-view">
    <!-- 灰色底板 -->
    <div class="background-overlay"></div>

    <!-- 透明主导航栏 -->
    <el-header class="main-header">
      <el-menu
        mode="horizontal"
        @select="handleMenuSelect"
        class="el-menu-demo"
      >
        <el-menu-item index="home" class="nav-item">
          <router-link to="/home">首页</router-link>
        </el-menu-item>
        <el-menu-item index="about" class="nav-item">
          <router-link to="/about">关于我们</router-link>
        </el-menu-item>
        <el-menu-item index="services" class="nav-item">
          <router-link to="/services">服务内容</router-link>
        </el-menu-item>
        <el-menu-item index="case-studio" class="nav-item">
          <router-link to="/WorkView">我的作品</router-link>
        </el-menu-item>
        <el-menu-item index="blog" class="nav-item">
          <router-link to="/blog">侵权监测</router-link>
        </el-menu-item>
        <el-menu-item index="contact" class="nav-item">
          <router-link to="/AuctionView">拍卖市场</router-link>
        </el-menu-item>
      </el-menu>
      <div class="header-actions">
        <el-button type="text" class="language-switch">中文</el-button>
        <el-button type="text" class="language-switch">English</el-button>
        <el-button type="primary" icon="el-icon-user" @click="outlogin"
          ><el-icon><HomeFilled /></el-icon>登出</el-button
        >
      </div>
    </el-header>

    <!-- 头部横幅部分 -->
    <section class="header-section">
      <el-row class="header-content" type="flex" align="middle">
        <el-col :span="12">
          <div class="header-text">
            <h1>我们为您的原创内容提供全方位的版权保护。</h1>
            <p>数字版权认证与保护平台</p>
            <el-button type="primary" @click="goToPage('get-started')"
              >立即开始</el-button
            >
            <el-button type="success" @click="goToPage('solution')"
              >解决方案</el-button
            >
          </div>
        </el-col>
        <el-col :span="12">
          <div class="header-image">
            <img
              src="@/assets/images/main-slider/image-3.png"
              alt="Header Image"
            />
          </div>
        </el-col>
      </el-row>
    </section>

    <!-- 作品登记流程部分 -->
    <div class="process-flow">
      <!-- 流程标题 -->
      <h2 class="process-title">作品登记流程</h2>

      <!-- 流程步骤 -->
      <el-steps
        :active="activeStep"
        align-center
        class="steps-container"
        finish-status="success"
      >
        <el-step
          v-for="(step, index) in steps"
          :key="index"
          :title="step.title"
          :description="step.description"
          :icon="step.icon"
        >
          <template #icon>
            <div class="step-number">{{ step.stepNumber }}</div>
          </template>
        </el-step>
      </el-steps>

      <!-- 按钮 -->
      <div class="action-button">
        <el-button type="primary" @click="handleApply">立即申请</el-button>
      </div>
    </div>

    <!-- 服务部分，放在独立白色面板下面 -->
    <section class="services-section">
      <div class="services-panel">
        <el-row :gutter="20" class="services-content">
          <el-col v-for="(service, index) in services" :key="index" :span="8">
            <el-card class="service-card" shadow="hover">
              <img
                :src="service.image"
                alt="Service Image"
                class="service-image"
              />
              <h3>{{ service.title }}</h3>
              <p>{{ service.description }}</p>
              <el-button type="text" @click="goToPage(service.link)"
                >了解更多 ></el-button
              >
            </el-card>
          </el-col>
        </el-row>
      </div>
    </section>
  </div>

  <div class="home-view">
    <!-- 身份验证弹框 -->
    <el-dialog
      v-model="isPrivateKeyDialogVisible"
      title="上传私钥文件进行身份验证"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form :model="privateKeyForm" ref="privateKeyForm" label-width="100px">
        <!-- 私钥文件上传 -->
        <el-form-item
          label="私钥文件"
          :rules="[{ required: true, message: '请上传私钥文件', trigger: 'change' }]"
        >
          <el-upload
            class="upload-demo"
            drag
            :on-change="handleFileChange"
            :before-upload="() => false"
            :auto-upload = "false"
            limit="1"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">拖拽文件到这里，或点击上传</div>
          </el-upload>
        </el-form-item>
        <!-- 密码输入 -->
        <el-form-item
          label="密码"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <el-input
            v-model="privateKeyForm.password"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="isPrivateKeyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPrivateKeyForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>


<script>
import request from '../utils/reques';

export default {
  name: "HomeView",
  data() {
    return {
      isPrivateKeyDialogVisible: false, // 控制弹框显示
      privateKeyForm: {
        privateKeyFile: null, // 私钥文件
        email: localStorage.getItem("email"), // 用户邮箱
        password: "", // 用户密码
      },
      activeMenu: "home", // 默认选中的菜单项
      activeStep: 4, // 当前步骤
      services: [
        {
          title: "版权咨询与解决方案",
          link: "case-detail",
          image: "src/assets/images/resource/service-1.png",
          description: "提供全方位的版权咨询服务与个性化解决方案。",
        },
        {
          title: "侵权保护与法律支持",
          link: "case-detail",
          image: "src/assets/images/resource/service-2.png",
          description: "快速解决侵权问题，保护您的版权利益。",
        },
        {
          title: "数字存证与全球化推广",
          link: "case-detail",
          image: "src/assets/images/resource/service-3.png",
          description: "为您的原创作品提供全球化的数字存证支持。",
        },
      ],
      steps: [
        {
          stepNumber: "01",
          title: "平台注册",
          description: "",
          icon: "el-icon-user-solid",
        },
        {
          stepNumber: "02",
          title: "地址绑定",
          description: "",
          icon: "el-icon-s-check",
        },
        {
          stepNumber: "03",
          title: "上传作品",
          description: "",
          icon: "el-icon-upload2",
        },
        {
          stepNumber: "04",
          title: "申请作品登记与存证证书",
          description: "",
          icon: "el-icon-document",
        },
      ],
    };
  },

  mounted() {
    // 检查本地存储中是否存在 privateKey
    const privateKey = localStorage.getItem("privateKey");
    if (!privateKey) {
      this.isPrivateKeyDialogVisible = true; // 如果没有，显示弹框
    }
  },
  methods: {
    // 处理文件选择
    handleFileChange(file) {
      this.privateKeyForm.privateKeyFile = file.raw; // 获取原始文件数据
    },


     // 提交私钥表单
    async submitPrivateKeyForm() {
      // 验证表单内容是否完整
      if (
        !this.privateKeyForm.privateKeyFile ||
        !this.privateKeyForm.email ||
        !this.privateKeyForm.password
      ) {
        this.$message.error("请完整填写表单");
        return;
      }

      const formData = new FormData();
      formData.append("file", this.privateKeyForm.privateKeyFile); // 上传的私钥文件
      formData.append("email", this.privateKeyForm.email); // 用户邮箱
      formData.append("password", this.privateKeyForm.password); // 用户输入的密码

      try {
        // 调用后端接口进行私钥验证
        const response = await request.post("/keystore/uploadKeystore", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.code === 0 ) {
          // 验证成功，将私钥存储到本地
          localStorage.setItem("privateKey", response.data.privateKey);
          localStorage.setItem("blockchainAddress", response.data.address); // 保存区块链地址
          this.$message.success("身份验证成功！");
          this.isPrivateKeyDialogVisible = false; // 关闭弹框
        } else {
          this.$message.error(message || "验证失败，请重试！");
        }
      } catch (error) {
        console.error("验证失败：", error);
        this.$message.error("验证失败，请检查输入信息！");
      }
    },

    outlogin() {
      // 使用 Element Plus 的 MessageBox 来替代 window.confirm
      this.$msgbox({
        title: "确认退出",
        message: "您确定要退出登录吗？",
        showCancelButton: true, // 显示取消按钮
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning", // 弹框的样式
      })
        .then(() => {
          // 点击确认时执行
          localStorage.clear();
          this.$router.push("/").catch((err) => {
            console.error("Redirect failed:", err);
          });
        })
        .catch(() => {
          // 点击取消时执行的操作
          console.log("取消退出");
        });
    },
    handleApply() {
      // 立即申请按钮的点击处理
      this.$router.push("/application"); // 假设 '/apply' 是申请页面的路径
    },
  },
};
</script>

<style scoped>

body, html, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden; /* 禁止水平滚动 */
  box-sizing: border-box;
}

.upload-demo {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #f5f5f5;
  padding: 20px;
  cursor: pointer;
}

.el-dialog {
  width: 400px;
}
/* 灰色底板铺满页面 */
.background-overlay {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0; /* 灰色背景颜色 */
  z-index: -1;
}

/* 整体布局样式 */
.home-view {
  font-family: "Lato", sans-serif;
}

/* 透明主导航栏 */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  position: fixed;
  top: 0; /* 保证导航栏固定在页面顶端 */
  left: 0;
  width: 100vw; /* 宽度设置为视口宽度，确保铺满 */
  background-color: rgba(255, 255, 255); /* 透明背景 */
  z-index: 1000;
  transition: background-color 0.3s ease-in-out;
}

.el-menu-demo {
  background-color: rgba(255, 255, 255, 0.1);
  flex-grow: 1;
  margin-left: 50px;
}

/* 导航项鼠标悬停效果 */
.nav-item {
  transition: transform 0.3s ease-in-out;
}

.nav-item:hover {
  transform: scale(1.1); /* 鼠标悬停时放大 */
}

/* 导航栏按钮 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.language-switch {
  font-weight: bold;
}

/* 头部横幅部分 */
.header-section {
  background-color: #fce5d8; /* 顶部固定颜色 */
  padding: 900px 0 10px; /* 增加顶部填充以适应固定的导航栏 */
  width: 100vw; /* 确保铺满整个页面宽度 */
}

.header-content {
  max-width: 100%; /* 限制宽度 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%; /* 留出两边空白 */
  box-sizing: border-box;
}


.register-link {
  font-size: 12px;
  color: #666;
}

.register-link {
  font-weight: bold;
  color: #409eff;
}

.header-text {
  flex: 1;
}

.header-text h1 {
  font-weight: 900;
  font-size: 3rem;
  margin-bottom: 20px;
}

.header-text p {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.header-image {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.header-image img {
  max-width: 90%;
  height: auto;
}

/* 流程部分 */
.process-flow {
  text-align: center;
  padding: 80px;
}

.process-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 30px;
}

.steps-container {
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 40px;
}

.step-number {
  background-color: #006eff; /* 数字圆圈的背景颜色 */
  color: #ffffff; /* 数字的字体颜色 */
  width: 45px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.action-button {
  margin-top: 30px;
}

/* 服务部分 */
.services-section {
  padding: 70px 0;
}

.services-panel {
  margin-top: 100px;
  background: #ffffff; /* 白色背景面板 */
  padding: 100px;
  margin: 50px auto;
  max-width: 12000px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.services-content {
  margin: 0 auto;
}

.service-card {
  text-align: center;
}

.service-card img {
  max-width: 80px;
  margin-bottom: 20px;
}

.service-card h3 {
  font-weight: bold;
  font-size: 1.5rem;
}

.service-card p {
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
}
</style>
