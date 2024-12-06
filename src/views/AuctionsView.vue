<template>
    <div class="home-view">
      <!-- 灰色底板 -->
      <div class="background-overlay"></div>
  
      <!-- 透明主导航栏 -->
      <el-header class="main-header">
        <el-menu mode="horizontal" @select="handleMenuSelect" class="el-menu-demo">
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
          <el-button type="primary" icon="el-icon-user" @click="goToPage('login')">登录</el-button>
        </div>
      </el-header>
  
      <!-- 拍品内容部分 -->
      <div class="auction-item-container">
        <el-row :gutter="20">
          <!-- 左侧：图片 -->
          <el-col :span="6" class="auction-item-left">
            <el-image :src="auctionItem.image" alt="拍品图片" fit="contain" class="item-image"/>
          </el-col>
  
          <!-- 右侧：拍品信息 -->
          <el-col :span="18" class="auction-item-right">
            <h2 class="item-title">{{ auctionItem.title }}</h2>
            <p><strong>估价：</strong> <span class="price">{{ auctionItem.price }}</span></p>
            <p><strong>城市：</strong>{{ auctionItem.city }}</p>
            <p><strong>日期：</strong>{{ auctionItem.date }}</p>
  
            <div class="buttons">
              <el-button type="primary" @click="goToBid">参与竞拍</el-button>
              <el-button type="text" @click="addToWishlist">加入收藏</el-button>
            </div>
          </el-col>
        </el-row>
  
        <!-- 下方：描述信息 -->
        <el-row class="auction-item-info">
          <el-col :span="24">
            <p><strong>描述：</strong>{{ auctionItem.description }}</p>
          </el-col>
        </el-row>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { ElButton, ElCol, ElRow, ElImage } from 'element-plus';
  
  export default {
    name: 'AuctionItemPage',
    components: {
      ElButton,
      ElCol,
      ElRow,
      ElImage
    },
    data() {
      return {
        auctionItem: {
          title: '拍品标题示例',
          image: 'src/assets/images/resource/discuss.png',  // 随机图片URL
          price: '¥100,000',
          city: '北京',
          date: '2024年12月12日',
          description: '这是一件非常精美的艺术品，适合收藏。'
        }
      };
    },
    mounted() {
      // 模拟拍品数据加载
      // const auctionId = this.$route.params.id;  // 获取路由参数中的拍品ID
      // this.fetchAuctionItem(auctionId);
    },
    methods: {
      async fetchAuctionItem(id) {
        try {
          const response = await axios.get(`https://example.com/api/auction/${id}`);
          this.auctionItem = response.data;  // 获取拍品数据并存储
        } catch (error) {
          console.error('获取拍品数据失败：', error);
        }
      },
      goToBid() {
        console.log('跳转到竞拍页面');
        // 实现竞拍页面跳转逻辑
      },
      addToWishlist() {
        console.log('加入收藏');
        // 实现加入收藏的逻辑
      }
    }
  };
  </script>
  
  <style scoped>
  /* 整体布局样式 */
  .home-view {
    font-family: 'Lato', sans-serif;
    padding-top: 80px; /* 避免导航栏遮挡内容 */
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
    width: 100vw;
    background-color: rgba(255, 255, 255, 0.9); /* 透明背景 */
    z-index: 1000;
    transition: background-color 0.3s ease-in-out;
  }
  
  .el-menu-demo {
    background-color: rgba(255, 255, 255, 0.1);
    flex-grow: 1;
    margin-left: 50px;
  }
  
  .nav-item:hover {
    transform: scale(1.1); /* 鼠标悬停时放大 */
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .language-switch {
    font-weight: bold;
  }
  
  /* 灰色底板铺满页面 */
  .background-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    z-index: -1;
  }
  
  /* 拍品信息区域 */
  .auction-item-container {
    margin-top: 100px; /* 保证内容不会被固定的导航栏遮挡 */
  }
  
  .auction-item-left {
    padding: 20px;
  }
  
  .auction-item-right {
    width: 50%; /* 右侧占50%的宽度 */
    padding: 20px;
  }
  
  .item-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  .price {
    color: red;
    font-weight: bold;
  }
  
  .buttons {
    margin-top: 20px;
  }
  
  .el-button {
    margin-right: 10px;
  }
  
  .item-image {
  position: absolute; /* 使用绝对定位 */
  top: -20px; /* 向上偏移 */
  left: -20px; /* 向左偏移 */
  width: 150%; /* 放大图片宽度 */
  max-height: 500px; /* 控制图片的最大高度 */
  border-radius: 8px; /* 圆角边框 */
  transform: scale(1.2); /* 放大图片 */
  z-index: 1; /* 确保图片在最上层 */
}
  
  .auction-item-info {
    margin-top: 30px;
    padding: 20px;
  }
  
  .auction-item-info p {
    font-size: 16px;
  }
  </style>
  