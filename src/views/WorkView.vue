<template>
    <div class="app">
      <!-- 顶部导航 -->
      <el-header class="main-header">
        <el-menu mode="horizontal" @select="handleMenuSelect" class="el-menu-demo">
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
          <el-button type="primary" icon="el-icon-user" @click="goToPage('login')">登出</el-button>
        </div>
      </el-header>
  
      <!-- 内容区域 -->
      <main class="main-content">
        <!-- 背景图片区域 -->
        <div class="hero">
          <div class="hero-content">
            <h1>PORTFOLIO</h1>
            <p>Portfolio 3 Column Masonry</p>
          </div>
        </div>
  
      <!-- 网格布局 -->
<div class="grid">
  <div
    class="grid-item"
    v-for="(item, index) in works"
    :key="index"
    @click="openDialog(item)"
  >
    <img :src="item.image" :alt="item.title" class="grid-image" />
    <p>{{ item.title }}</p>
  </div>
</div>

          <!-- 弹框 -->
          <el-dialog
          v-model="dialogVisible"
          title="作品详情"
          width="50%"
          @close="resetSelectedWork"
        >
          <div>
            <h3>{{ selectedWork.title }}</h3>
            <p>{{ selectedWork.description }}</p>
          </div>
          <template #footer>
            <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
          </template>
        </el-dialog>
      </main>
    </div>
  </template>
  
  <script>
export default {
  name: "App",
  data() {
    return {
      dialogVisible: false,
      selectedWork: {}, // 当前选中的作品
      works: [
        {
          title: "作品 1",
          description: "这是作品 1 的描述内容。",
          image: "src/assets/images/resource/nft.jpg", // 添加图片路径
        },
        {
          title: "作品 2",
          description: "这是作品 2 的描述内容。",
          image: "src/assets/images/resource/nft.jpg", // 添加图片路径
        },
        {
          title: "作品 3",
          description: "这是作品 3 的描述内容。",
          image: "src/assets/images/resource/nft.jpg", // 添加图片路径
        },
        {
          title: "作品 4",
          description: "这是作品 4 的描述内容。",
          image: "src/assets/images/resource/nft.jpg", // 添加图片路径
        },
        {
          title: "作品 5",
          description: "这是作品 5 的描述内容。",
          image: "src/assets/images/resource/nft.jpg", // 添加图片路径
        },
        {
          title: "作品 6",
          description: "这是作品 6 的描述内容。",
          image: "src/assets/images/resource/nft.jpg", // 添加图片路径
        },
        {
          title: "作品 7",
          description: "这是作品 6 的描述内容。",
          image: "src/assets/images/resource/nft.jpg", // 添加图片路径
        },
        {
          title: "作品 8",
          description: "这是作品 6 的描述内容。",
          image: "src/assets/images/resource/nft.jpg", // 添加图片路径
        },
      ],
    };
  },
  methods: {
    openDialog(item) {
      this.selectedWork = item; // 设置当前选中的作品
      this.dialogVisible = true; // 显示弹框
    },
    navigateTo(path) {
        console.log("Navigating to:", path);
      },
      handleMenuSelect(key) {
        console.log("Menu selected:", key);
      },
      goToPage(page) {
        console.log("Go to:", page);
      },
      openDialog(item) {
        this.selectedWork = item;
        this.dialogVisible = true;
      },
  },
};

  </script>
  
  <style scoped>
  /* 全局布局 */
  .app {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  /* 顶部导航 */
  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 50px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    background: rgba(255, 255, 255, 1);
    z-index: 1000;
    box-sizing: border-box;
    transition: background-color 0.3s ease-in-out;
  }
  
  .el-menu-demo {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow: hidden;
    white-space: nowrap;
    flex-grow: 1;
    margin-left: 50px;
  }
  
  .nav-item:hover {
    transform: scale(1.1);
    color: #ff6347;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .language-switch:hover {
    color: #ff6347;
  }
  
  /* hero 背景图片区域 */
  .hero {
    width: 100vw;
    height: 100vh;
    background: url('../assets/images/resource/service-4.png') no-repeat center center;
    aspect-ratio: 16 / 9;
    position: relative;
    padding-top: 60px;
  }
  
  .hero-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  }
  
  /* 网格布局 */
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
    margin-left:50px;
    padding: 20px;
  }
  .grid-image {
    width: 100%;
    border-radius: 10px;
  }
  
  .grid-item {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    width: 20vw;
    height: 22vw;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .grid-item:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  </style>
  