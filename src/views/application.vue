<template>
<el-header class="main-header">
      
      <el-menu
        mode="horizontal"
        @select="handleMenuSelect"
        class="el-menu-demo"
      >
      <el-menu-item index="/home" class="nav-item" @click="navigateTo('/home')">首页</el-menu-item>
        <el-menu-item index="about" class="nav-item">关于我们</el-menu-item>
        <el-menu-item index="services" class="nav-item">服务内容</el-menu-item>
        <el-menu-item index="case-studio" class="nav-item">我的作品</el-menu-item>
        <el-menu-item index="blog" class="nav-item">侵权监测</el-menu-item>
        <el-menu-item index="contact" class="nav-item">拍卖市场</el-menu-item>
      </el-menu>
      <div class="header-actions">
        <el-button type="text" class="language-switch">中文</el-button>
        <el-button type="text" class="language-switch">English</el-button>
        
        <el-button type="primary" class="primary" icon="el-icon-user" @click="goToPage('login')"><el-icon><HomeFilled /></el-icon>登录</el-button>
      </div>
    </el-header>

    <div class="upload-section">
        <!-- 上传作品横幅 -->
        <div class="upload-banner">
            <div class="banner-content">
                <h2>上传您的作品</h2>
                <h1>展示您的创作</h1>
                <p>请填写以下信息并上传您的作品。我们会对您的创作进行版权保护。</p>
            </div>
        </div>

    <!-- 上传信息和表单 -->
    <div class="upload-form-container">
      <el-row :gutter="20">
        <!-- 版权说明 -->
        <el-col :span="8" class="upload-info">
          <div class="info-item">
            <el-icon><i class="el-icon-folder"></i></el-icon>
            <h3>作品信息</h3>
            <p>请确保您的作品符合平台的上传要求。</p>
          </div>
          <div class="info-item">
            <el-icon><i class="el-icon-document"></i></el-icon>
            <h3>版权声明</h3>
            <p>上传作品即表明您拥有此作品的版权或相关授权。</p>
          </div>
          <div class="info-item">
            <el-icon><i class="el-icon-help"></i></el-icon>
            <h3>帮助与支持</h3>
            <p>如有问题，请联系我们：847070349@qq.com</p>
          </div>
        </el-col>

        <!-- 验证私钥 -->
        <el-col :span="16">
            <div class="form-section">
    <h2 class="form-section-title">身份认证</h2>
    <el-form :model="keystoreFormData" @submit.prevent="handleKeystoreSubmit" class="form-content">
        <el-form-item prop="email">
            <el-input v-model="keystoreFormData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input v-model="keystoreFormData.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <div class="center-upload-and-button">
            <el-upload
                :on-change="handleKeystoreFileChange"
                list-type="text"
                :limit="1"
                :auto-upload="false"
                class="upload-area"
            >
                <el-button type="primary" class="uniform-button">上传私钥文件</el-button>
            </el-upload>
            <el-button type="success" class="uniform-button" @click="handleKeystoreSubmit">验证身份</el-button>
        </div>
    </el-form>
</div>


          <!-- 验证成功后显示作品上传表单 -->
          <div v-if="isKeystoreVerified" class="form-section">
            <h2 class="form-section-title">填写作品信息</h2>
            <p>请完善以下信息，确保作品能够被正确识别和保护。</p>
            <el-form
              :model="formData"
              @submit.prevent="handleSubmit"
              ref="form"
            >
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item prop="title">
                    <el-input
                      v-model="formData.title"
                      placeholder="作品标题"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item prop="description">
                <el-input
                  type="textarea"
                  v-model="formData.description"
                  placeholder="作品描述"
                ></el-input>
              </el-form-item>
              <!-- 上传图片和按钮 -->
              <div class="center-upload-and-button">
                <!-- 文件上传 -->
                <el-upload
                  list-type="picture-card"
                  :on-change="handleFileChange"
                  :on-remove="handleRemove"
                  :auto-upload="false"
                  :limit="1"
                >
                  <div class="upload-plus-icon">
                    <el-icon><i class="el-icon-plus"></i></el-icon>
                  </div>
                </el-upload>
                <!-- 提交作品按钮 -->
                <el-button type="success" @click="handleSubmit"
                  >提交作品</el-button
                >
              </div>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import request from "../utils/reques";

export default {
  name: "UploadSection",

  data() {
    return {
      isKeystoreVerified: false, // 标记私钥是否验证成功
     
      keystoreFormData: {
        email: "", // 邮箱
        password: "", // 密码
        file: null, // 私钥文件
      },
      formData: {
        email: "",
        title: "",
        description: "",
        file: null, // 作品文件
        privateKey: "", // 私钥，验证成功后后端返回
      },
    };
  },
  methods: {
    // 处理私钥文件选择
    handleKeystoreFileChange(file) {
      this.keystoreFormData.file = file.raw; // 存储文件对象
    },

    // 提交私钥验证
    async handleKeystoreSubmit() {
      if (
        !this.keystoreFormData.file ||
        !this.keystoreFormData.email ||
        !this.keystoreFormData.password
      ) {
        this.$message.error("请填写所有信息并上传私钥文件！");
        return;
      }

      const formData = new FormData();
      formData.append("email", this.keystoreFormData.email);
      formData.append("password", this.keystoreFormData.password);
      formData.append("file", this.keystoreFormData.file);

      try {
        const response = await request.post(
          "/keystore/uploadKeystore",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.data.code === 0) {
          this.isKeystoreVerified = true;
          this.formData.privateKey = response.data.privateKey; // 保存私钥信息
          this.$message.success("私钥验证成功！");
        } else {
          this.$message.error(response.data.message || "验证失败！");
        }
      } catch (error) {
        this.$message.error("私钥验证失败，请重试！");
      }
    },

    // 处理文件选择
    handleFileChange(file) {
      this.formData.file = file.raw; // 存储作品文件对象
    },

    // 处理文件移除
    handleRemove() {
      this.formData.file = null; // 清除作品文件
    },

    // 提交作品信息
    async handleSubmit() {
      if (!this.formData.file) {
        this.$message.error("请上传作品文件！");
        return;
      }

      const formData = new FormData();
      formData.append("title", this.formData.title);
      formData.append("description", this.formData.description);
      formData.append("file", this.formData.file);
      formData.append("email", localStorage.getItem("email"));
      formData.append("privateKey", this.formData.privateKey);

      try {
        const response = await request.post("/work/registerWork", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.code === 0) {
          this.$message.success("作品提交成功！");
          // 提交成功后清理表单
          this.resetForm();
        } else {
          this.$message.error(response.data.message || "提交失败！");
        }
      } catch (error) {
        this.$message.error("提交失败，请重试！");
      }
    },

    // 清理表单
    resetForm() {
      // 清空验证表单
      this.keystoreFormData = {
        email: "",
        password: "",
        file: null,
      };
      this.formData = {
        email: "",
        title: "",
        description: "",
        file: null,
        privateKey: "",
      };
      this.isKeystoreVerified = false;
    },
  },
};
</script>



<style scoped>
.upload-section {
  font-family: "Lato", sans-serif;
  padding: 40px 0;
}

.upload-banner {
    background-color: #e9f3fd;
    padding: 40px;
    text-align: center;
}

.banner-content h2 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

/* 标题样式，居中显示 */
.form-section-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center; /* 标题居中 */
}

/* 表单内容居中 */
.form-content {
    max-width: 400px;
    margin: 0 auto; /* 表单居中 */
    display: flex;
    flex-direction: column;
    gap: 15px; /* 控件之间的间距 */
}

/* 按钮容器 */
.center-upload-and-button {
    display: flex;
    flex-direction: column;
    align-items: center; /* 按钮居中 */
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
}

/* 上传区域样式 */
.upload-area {
    text-align: center;
    width: 100%;
}

/* 统一按钮样式 */
.uniform-button {
    width: 100%;
    max-width: 200px;
    text-align: center; /* 按钮文字居中 */
    text-transform: uppercase; /* 文本大写 */
    font-weight: bold; /* 加粗 */
    border-radius: 8px; /* 按钮圆角 */
    padding: 10px; /* 内边距 */
}

.banner-content h1 {
  color: #000;
  font-size: 2.5rem;
  font-weight: bold;
}

.banner-content p {
  color: #666;
  margin-top: 20px;
  font-size: 1.1rem;
}

.upload-form-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
}

.upload-info {
  padding: 20px;
  background-color: #fce5d8;
  border-radius: 10px;
}

.info-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.info-item h3 {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 10px 0 0 10px;
}

.info-item p {
  color: #666;
  font-size: 1rem;
  margin-left: 40px;
}

.form-section {
  padding: 20px;
}

.form-section h2 {
  font-weight: bold;
  font-size: 1.5rem;
}

.el-form-item {
  margin-bottom: 20px;
}

/* 居中上传图片框和按钮 */
.center-upload-and-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.upload-plus-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #999;
}

.el-upload .el-icon {
  font-size: 32px;
  color: #999;
}

.el-button {
  background-color: #06f129;
  color: #fff;
  text-align: center;
}

.el-button:hover {
  background-color: #333;
}
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
  background-color:rgba(255, 255, 255);
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
  background-color:rgba(255, 255, 255);
}

.language-switch {
  font-weight: bold;
  background-color:rgba(255, 255, 255);
  color:dodgerblue;
  
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

.el-button.primary {
  background-color: dodgerblue;
  color: white;
  border-radius: 5px;
  padding: 10px 20px;
  font-weight: bold;
}
</style>
