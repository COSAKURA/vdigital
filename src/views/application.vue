<template>
    <div class="upload-section">


             <!-- 透明主导航栏 -->
    <el-header class="main-header">
   <!-- 图片放置在导航栏左侧 -->
   <div class="logo-container">
      <img src="@/assets/images/lll.png" alt="Logo" class="logo-image" />
    </div>
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
                        <p>如有问题，请联系我们：<a href="mailto:847070349@qq.com">847070349@qq.com</a></p>
                    </div>
                </el-col>

                <!-- 作品上传表单 -->
                <el-col :span="16">
                    <div class="form-section">
                        <h2 class="form-section-title">填写作品信息</h2>
                        <p class="form-description">请完善以下信息，确保作品能够被正确识别和保护。</p>
                        <el-form :model="formData" @submit.prevent="handleSubmit" ref="form">
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item prop="title">
                                        <el-input v-model="formData.title" placeholder="作品标题"
                                            class="form-input"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item prop="description">
                                <el-input type="textarea" v-model="formData.description" placeholder="作品描述"
                                    class="form-textarea"></el-input>
                            </el-form-item>
                            <!-- 上传图片和按钮 -->
                            <div class="center-upload-and-button">
                                <!-- 文件上传 -->
                                <el-upload ref="upload" list-type="picture-card" :on-change="handleFileChange"
                                    :on-remove="handleRemove" :auto-upload="false" :limit="1">
                                    <div class="upload-plus-icon">
                                        <el-icon><i class="el-icon-plus"></i></el-icon>
                                    </div>
                                </el-upload>

                                <!-- 提交作品按钮 -->
                                <el-button type="success" class="submit-button" @click="handleSubmit">
                                    提交作品
                                </el-button>
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
            formData: {
                email: "",
                title: "",
                description: "",
                file: null, // 作品文件
                privateKey: "", // 私钥（可以从本地存储中获取）
            },
        };
    },
    methods: {
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
            formData.append("privateKey", localStorage.getItem("privateKey"));

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
            this.formData = {
                email: "",
                title: "",
                description: "",
                file: null,
                privateKey: "",
            };

            // 清空文件列表
            if (this.$refs.upload) {
                this.$refs.upload.clearFiles();
            }
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
    margin-top: 350px;
    background-color: #edf2fa;
    padding: 40px 20px;
    text-align: center;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.banner-content h2 {
    color: #4a90e2;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 10px;
}

.banner-content h1 {
    color: #222;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 20px;
}

.banner-content p {
    color: #555;
    font-size: 1rem;
}

.upload-form-container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.upload-info {
    padding: 20px;
    background-color: #f7f9fc;
    border-radius: 10px;
    border: 1px solid #d9e5f3;
}

.info-item {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.info-item h3 {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
}

.info-item p {
    color: #666;
    font-size: 1rem;
}

.form-section {
    padding: 20px;
}

.form-section-title {
    font-weight: bold;
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 15px;
}

.form-description {
    font-size: 1rem;
    text-align: center;
    margin-bottom: 20px;
    color: #555;
}

.el-form-item {
    margin-bottom: 20px;
}

.form-input {
    font-size: 1rem;
    padding: 10px;
    border-radius: 6px;
}

.form-textarea {
    font-size: 1rem;
    padding: 10px;
    border-radius: 6px;
}

.center-upload-and-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.upload-plus-icon {
    font-size: 32px;
    color: #999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.submit-button {
    background-color: #4caf50;
    color: white;
    font-weight: bold;
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 1rem;
    transition: background-color 0.3s ease;
}

.submit-button:hover {
    background-color: #43a047;
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

.logo-container{
  margin-right: -80px;
  width: 10%;
}

.logo-image{
  width: 80%;
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
  padding: 1550px 0 10px; /* 增加顶部填充以适应固定的导航栏 */
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

</style>
