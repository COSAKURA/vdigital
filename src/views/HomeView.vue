<template>
  <div class="home-view">

    <Navbar />
    <!-- 头部横幅部分 -->
    <section class="header-section">
      <el-row class="header-content" type="flex" align="middle">
        <el-col :span="12">
          <div class="header-text" id="header-text">
            <h1 id="header-title">{{ headerTitle }}</h1>
            <p id="header-subtitle">{{ headerSubtitle }}</p>
          </div>

        </el-col>
        <el-col :span="12">
          <div class="header-image" id="image-container">
            <img src="@/assets/images/main-slider/image-3.png" alt="Header Image" id="tilt-image"
              class="flip-in-image" />
          </div>
        </el-col>
      </el-row>
    </section>

    <!-- 作品登记流程部分 -->
    <div class="process-flow slide-up" id="process-flow">
      <!-- 流程标题 -->
      <h2 class="process-title">作品登记流程</h2>

      <!-- 流程步骤 -->
      <el-steps :active="activeStep" align-center class="steps-container" finish-status="success">
        <el-step v-for="(step, index) in steps" :key="index" :title="step.title" :description="step.description"
          :icon="step.icon">
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

    <!-- 行业现状与痛点 -->
    <div class="industry-status">
      <h2 class="section-title">行业现状与痛点</h2>
      <el-row :gutter="20" class="content-cards">
        <el-col v-for="(item, index) in painPoints" :key="index" :span="8">
          <el-card class="pain-point-card" shadow="hover">
            <!-- 图标 -->
            <div class="icon-container">
              <img :src="item.icon" :alt="item.title" class="icon-image" />
            </div>
            <!-- 标题 -->
            <h3 class="card-title">{{ item.title }}</h3>
            <!-- 描述 -->
            <p class="card-description">{{ item.description }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>


    <!-- 服务部分，放在独立白色面板下面 -->
    <section class="services-section">
      <div class="services-panel">
        <h2 class="section-title">提供支持</h2>
        <el-row :gutter="20" class="services-content">
          <el-col v-for="(service, index) in services" :key="index" :span="8">
            <el-card class="service-card" shadow="hover">
              <img :src="service.image" alt="Service Image" class="service-image" />
              <h3>{{ service.title }}</h3>
              <p>{{ service.description }}</p>


            </el-card>
          </el-col>
        </el-row>
      </div>
    </section>
  </div>

  <div class="home-view">
     <!-- 身份验证弹框 -->
<el-dialog v-model="isPrivateKeyDialogVisible" title="选择验证方式" width="400px" :close-on-click-modal="false">
  <el-form :model="verificationForm" ref="verificationForm" label-width="100px">
    <!-- 验证方式选择 -->
    <el-form-item label="验证流程" :rules="[{ required: true, message: '请选择验证方式', trigger: 'change' }]">
      <el-radio-group v-model="verificationForm.method">
        <el-radio label="palm">掌静脉验证</el-radio>
        <el-radio label="privateKey">私钥验证</el-radio>
        
      </el-radio-group>
    </el-form-item>
  </el-form>

  <!-- 掌纹验证表单 -->
<el-form v-if="verificationForm.method === 'palm'"  :model="palmForm" ref="palmForm" label-width="100px">
  <el-form-item label="掌静脉识别" :rules="[{ required: true, trigger: 'change' }]">
     <!-- 替换为图片 -->
     <img 
      src="../assets/images/resource/zw.png" 
      alt="掌纹识别" 
      @click="submitVerificationForm" 
      style="cursor: pointer; width: 150px; height: 150px; margin: 0 auto; position: relative; right: 30px;"
    />
  </el-form-item>
  <!-- 显示识别状态 -->
  <el-form-item v-if="palmRecognitionStatus" label="识别状态">
    <p>{{ palmRecognitionStatus }}</p>
  </el-form-item>
</el-form>

 <!-- 私钥验证表单 -->
 <el-form v-if="verificationForm.method === 'privateKey'" :model="privateKeyForm" ref="privateKeyForm" label-width="100px">
    <el-form-item label="私钥文件" :rules="[{ required: true, message: '请上传私钥文件', trigger: 'change' }]">
      <el-upload class="upload-demo" drag :on-change="handleFileChange" :before-upload="() => false" :auto-upload="false" limit="1">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">拖拽文件到这里，或点击上传</div>
      </el-upload>
    </el-form-item>
    <el-form-item label="密码" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
      <el-input v-model="privateKeyForm.password" type="password" placeholder="请输入密码"></el-input>
    </el-form-item>
  </el-form>

  <template #footer>
    <el-button @click="isPrivateKeyDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="submitVerificationForm">验证</el-button>
  </template>
</el-dialog>
  </div>
</template>


<script>
import request from '../utils/reques';
import Navbar from "@/components/Navbar.vue";


export default {
  name: "HomeView",
  components: {
    Navbar,
  },
  data() {
    return {
      headerTitle: "我们为您的原创内容提供全方位的版权保护。",
      headerSubtitle: "艺溯之链平台",
      isPrivateKeyDialogVisible: false, // 控制弹框显示

       // 当前选择的验证方式
        verificationForm: {
        method: '', // 当前选择的验证方式 (privateKey 或 palm)
      },

      // 私钥验证表单数据
      privateKeyForm: {
        privateKeyFile: null, // 私钥文件
        email: localStorage.getItem("email"), // 用户邮箱
        password: "", // 用户密码
      },

       // 掌纹验证表单数据
       palmForm: {
        file: null, // 掌纹文件
      },
      
      activeMenu: "home", // 默认选中的菜单项
      activeStep: 4, // 当前步骤
      painPoints: [
        {
          title: "内容管理方",
          icon: "src/assets/images/resource/process-1.png",
          description: "缺乏行业规范化服务，版权交易过程中信息不联通，版权收益难以公平有效地在原创作者和相关机构间分配。",
        },
        {
          title: "内容平台方",
          icon: "src/assets/images/resource/process-2.png",
          description: "传统保护费时费力成本高，海量内容难以全量保护，内容分发难以掌控传播安全问题。",
        },
        {
          title: "原创作者",
          icon: "src/assets/images/resource/process-3.png",
          description: "传统模式权属自证繁琐，需奔波于多个部门/组织之间，侵权发现难，维权耗时久成本高，多数作品难以被有效保护。",
        },
      ],
      steps: [
        { stepNumber: "01", title: "平台注册", description: "", icon: "el-icon-user-solid" },
        { stepNumber: "02", title: "地址绑定", description: "", icon: "el-icon-s-check" },
        { stepNumber: "03", title: "上传作品", description: "", icon: "el-icon-upload2" },
        { stepNumber: "04", title: "申请作品登记与存证证书", description: "", icon: "el-icon-document" },
      ],

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

    // 在页面挂载后，设置定时器，每5秒调用一次 refreshHeaderContent
    this.timer = setInterval(this.refreshHeaderContent, 3000);


    // 检查本地存储中是否存在 privateKey
    const privateKey = localStorage.getItem("privateKey");
    if (!privateKey) {
      this.isPrivateKeyDialogVisible = true; // 如果没有，显示弹框
    }

    const image = document.getElementById("tilt-image");

    // 1. 页面加载时动画效果
    setTimeout(() => {
      image.style.transition = "transform 1.2s ease-out, opacity 1.2s ease-out";
      image.style.transform = "rotateY(0deg) scale(1)";
      image.style.opacity = "1";
    }, 100); // 加入延迟确保加载时执行

    // 2. 鼠标移动效果
    const imageContainer = document.getElementById("image-container");

    imageContainer.addEventListener("mousemove", (event) => {
      const { offsetWidth, offsetHeight } = imageContainer;

      // 计算鼠标位置
      const x = (event.offsetX / offsetWidth - 0.5) * 2;
      const y = (event.offsetY / offsetHeight - 0.5) * 2;

      const tiltAmount = 10; // 最大偏移角度
      const rotateX = -y * tiltAmount;
      const rotateY = x * tiltAmount;

      // 应用鼠标偏移效果
      image.style.transition = "transform 0.1s ease-out";
      image.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });

    // 鼠标离开时复位
    imageContainer.addEventListener("mouseleave", () => {
      image.style.transform = "rotateY(0deg) rotateX(0deg)";
    });

    function typeText(element, text, speed, callback) {
      let index = 0;
      const interval = setInterval(() => {
        element.textContent += text[index];
        index++;
        if (index === text.length) {
          clearInterval(interval);
          if (callback) callback(); // 调用下一个任务
        }
      }, speed);
    }

    const titleElement = document.getElementById("header-title");
    const subtitleElement = document.getElementById("header-subtitle");

    // 清空初始文本
    titleElement.textContent = "";
    subtitleElement.textContent = "";

    // 执行打字效果
    typeText(titleElement, "我们为您的原创内容提供全方位的版权保护。", 100, () => {
      typeText(subtitleElement, "艺溯之链平台", 100);
    });


    const processFlow = document.getElementById("process-flow");

    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return rect.top <= window.innerHeight && rect.bottom >= 0;
    }

    function handleScroll() {
      if (isInViewport(processFlow)) {
        processFlow.classList.add("visible");
        window.removeEventListener("scroll", handleScroll);
      }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初始加载检查


  },
  beforeUnmount() {
    // 组件销毁前清除定时器，避免内存泄漏
    clearInterval(this.timer);
  },



  methods: {

    // 定义每隔5秒重新调用的函数
    refreshHeaderContent() {
      const titles = [
        "我们为您的原创内容提供全方位的版权保护。",
        "保护原创，赋能创作者，安全又高效。",
        "艺溯之链，让版权保护更加智能。",
      ];

      const subtitles = [
        "艺溯之链平台",
        "创新版权保护解决方案",
        "您的原创内容，我们来守护",
      ];

      // 随机选择标题和副标题
      this.headerTitle = titles[Math.floor(Math.random() * titles.length)];
      this.headerSubtitle = subtitles[Math.floor(Math.random() * subtitles.length)];

      console.log("Header 内容重新调用一次"); // 确认方法执行
    },

  // 处理掌纹文件上传
  handlePalmUpload(file) {
    this.palmForm.file = file.raw; // 获取上传的掌纹文件
  },

  // 提交掌纹验证表单
  async submitVerificationForm() {
    if (this.verificationForm.method === 'privateKey') {
      // 私钥验证逻辑（已完成，无需更改）
      this.$refs.privateKeyForm.validate((valid) => {
        if (valid) {
          console.log('提交私钥验证表单：', this.privateKeyForm);
          this.submitPrivateKeyForm();
        }
      });
    } else if (this.verificationForm.method === 'palm') {
      // 掌纹验证逻辑
      this.$refs.palmForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请完整填写表单！");
          return;
        }

        if (!this.palmForm.file) {
          this.$message.error("掌纹验证失败，请检查网络连接或稍后重试！");
          return;
        }

        // 创建 FormData 对象，用于上传掌纹文件
        const formData = new FormData();
        formData.append("file", this.palmForm.file); // 上传掌纹文件

        try {
          // 调用后端接口进行掌纹验证
          const response = await request.post("/palm/verify", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (response.data.code === 0) {
            this.$message.success("掌纹验证成功！");
            this.isVerificationDialogVisible = false; // 关闭弹框
            // 如果需要，可以存储一些返回数据，例如身份信息：
            localStorage.setItem("palmVerified", true);
          } else {
            this.$message.error(response.data.message || "掌纹验证失败，请重试！");
          }
        } catch (error) {
          console.error("掌纹验证失败：", error);
          this.$message.error("掌纹验证失败，请检查网络连接或稍后重试！");
        }
      });
    } else {
      this.$message.error("请选择验证方式！");
    }
  },

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

        if (response.data.code === 0) {
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
    handleApply() {
      // 立即申请按钮的点击处理
      this.$router.push("/application"); // 假设 '/apply' 是申请页面的路径
    },

  },
};
</script>

<style scoped>
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
  background-color: #f0f0f0;
  /* 灰色背景颜色 */
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
  top: 0;
  /* 保证导航栏固定在页面顶端 */
  left: 0;
  width: 100vw;
  /* 宽度设置为视口宽度，确保铺满 */
  background-color: rgba(255, 255, 255);
  /* 透明背景 */
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
  transform: scale(1.1);
  /* 鼠标悬停时放大 */
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
  background-color: #fce5d8;
  /* 顶部固定颜色 */
  padding: 1550px 0 10px;
  /* 增加顶部填充以适应固定的导航栏 */
  width: 100vw;
  /* 确保铺满整个页面宽度 */
}

.header-content {
  max-width: 100%;
  /* 限制宽度 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  /* 留出两边空白 */
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
  overflow: hidden;
  /* 避免文字溢出 */
  flex: 1;
}

.header-text h1 {
  font-weight: 900;
  font-size: 3rem;
  margin-bottom: 20px;
}

.header-text p {
  display: inline-block;
  white-space: nowrap;
  /* 防止换行 */
  overflow: hidden;
  /* 隐藏溢出的文字 */
  border-right: 0.1em solid transparent;
  /* 可选：用于打字光标效果 */
  font-size: 1.9rem;
  margin-bottom: 20px;
}

.header-image {
  margin-top: 100px;
  overflow: hidden;
  /* 防止图片偏移溢出 */
  perspective: 1000px;
  /* 添加3D透视效果 */
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.header-image img {
  transition: transform 0.1s ease-out;
  /* 添加平滑过渡效果 */
  will-change: transform;
  /* 优化渲染性能 */
  max-width: 90%;
  height: auto;
}

/* 流程部分 */
.process-flow {
  height: 20%;
  text-align: center;
  padding: 50px;
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
  background-color: #006eff;
  /* 数字圆圈的背景颜色 */
  color: #ffffff;
  /* 数字的字体颜色 */
  width: 45px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.action-button {
  margin-top: 100px;
  text-align: center;
}

.action-button .el-button {
  font-size: 1.5rem;
  /* 增大字体 */
  padding: 10px 30px;
  /* 增加内边距 */
  border-radius: 8px;
  /* 圆角 */
  width: auto;
  /* 自动宽度 */
  height: auto;
  /* 自动高度 */
}

/* 服务部分 */
.services-section {
  padding: 70px 0;
}

.services-panel {
  margin-top: 100px;
  background: #ffffff;
  /* 白色背景面板 */
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

.industry-status {
  margin-top: 100px;
  background: #f0f0f0;
  /* 灰色背景面板 */
  padding: 100px;
  margin: 50px auto;
  max-width: 12000px;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
}

.content-cards {
  max-width: 1200px;
  margin: 0 auto;
}

.pain-point-card {

  width: 100%;
  margin-left: 250px;
  text-align: center;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.pain-point-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.icon-image {
  width: 60px;
  height: 60px;
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
}

.industry-status {
  padding: 50px 20px;
  background-color: #f8f9fa;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
}

.content-cards {
  max-width: 1200px;
  margin: 0 auto;
}

.pain-point-card {
  text-align: center;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.pain-point-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.icon-image {
  width: 60px;
  height: 60px;
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
}

.industry-text {
  margin-top: 40px;
  font-size: 1rem;
  color: #333;
  line-height: 1.8;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.logo-container {
  margin-right: -80px;
  width: 10%;
}

.logo-image {
  width: 80%;
}

/* 初始状态 */
.slide-up {
  opacity: 0;
  /* 初始透明 */
  transform: translateY(50px);
  /* 向下偏移 */
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  /* 平滑过渡 */
}

/* 滑动进入动画效果 */
.slide-up.visible {
  opacity: 1;
  /* 完全显示 */
  transform: translateY(0);
  /* 回到原始位置 */
}

/* 图片初始状态 */
.flip-in-image {
  transform: rotateY(180deg) scale(0.8);
  opacity: 0;
  transition: transform 0.1s ease-out;
  /* 鼠标移动时的平滑过渡 */
  will-change: transform;
}
</style>
