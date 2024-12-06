<template>
  <div class="home-view">


    <!-- 透明主导航栏 -->
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
        <el-button type="primary" icon="el-icon-user" @click="goToPage('login')">登录</el-button>
      </div>
    </el-header>

    <!-- 拍品推荐部分 -->
    <section class="auction-recommendation">
      <h2 class="section-title">拍品推荐</h2>
      <div class="grid">
        <div class="grid-item" v-for="item in items" :key="item.id">
          <img :src="item.image" :alt="item.title" class="item-image" />
          <h3 class="item-title">{{ item.title }}</h3>
          <p class="item-info">
            <span>估价：<span class="price">{{ item.price }}</span></span><br />
            <span>城市：{{ item.city }}</span><br />
            <span>日期：{{ item.date }}</span>
          </p>
        </div>
      </div>
    </section>

    <!-- 额外拍品展示部分 -->
    <section class="additional-auctions">
      <div class="grid">
        <div class="grid-item" v-for="additionalItem in additionalItems" :key="additionalItem.id">
          <img :src="additionalItem.image" :alt="additionalItem.title" class="item-image" />
          <h3 class="item-title">{{ additionalItem.title }}</h3>
          <p class="item-info">
            <span>估价：<span class="price">{{ additionalItem.price }}</span></span><br />
            <span>城市：{{ additionalItem.city }}</span><br />
            <span>日期：{{ additionalItem.date }}</span>
          </p>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      items: [], // 存储拍品数据
      additionalItems: [ // 额外的拍品数据
        {
          id: 1,
          image: "src/assets/images/main-slider/image-2.png",
          title: "古董茶壶",
          price: "¥100,000",
          city: "北京",
          date: "2024-12-20",
        },
        {
          id: 2,
          image: "src/assets/images/main-slider/image-2.png",
          title: "名画",
          price: "¥500,000",
          city: "上海",
          date: "2024-12-21",
        },
        {
          id: 3,
          image: "src/assets/images/main-slider/image-2.png",
          title: "奢侈手表",
          price: "¥80,000",
          city: "广州",
          date: "2024-12-22",
        },
        {
          id: 4,
          image: "src/assets/images/main-slider/image-2.png",
          title: "古董花瓶",
          price: "¥150,000",
          city: "南京",
          date: "2024-12-23",
        },
        {
          id: 5,
          image: "src/assets/images/main-slider/image-2.png",
          title: "限量版跑车模型",
          price: "¥120,000",
          city: "深圳",
          date: "2024-12-24",
        },
        {
          id: 6,
          image: "src/assets/images/main-slider/image-2.png",
          title: "珍稀邮票",
          price: "¥200,000",
          city: "成都",
          date: "2024-12-25",
        },
        {
          id: 7,
          image: "src/assets/images/main-slider/image-2.png",
          title: "珍稀邮票",
          price: "¥200,000",
          city: "成都",
          date: "2024-12-25",
        },
        {
          id: 8,
          image: "src/assets/images/main-slider/image-2.png",
          title: "珍稀邮票",
          price: "¥200,000",
          city: "成都",
          date: "2024-12-25",
        },
      ],
    };
  },
  methods: {
    // 模拟登录
    login() {
      console.log("登录按钮点击");
    },
    // 获取拍品推荐数据
    async fetchData() {
      try {
        const response = await axios.get("https://example.com/api/auctions"); // 替换为实际的 API 地址
        this.items = response.data;
      } catch (error) {
        console.error("获取拍品数据失败：", error);
      }
    },
  },
  mounted() {
    this.fetchData(); // 组件挂载后获取数据
  },
};
</script>

<style scoped>
/* 整体布局样式 */
.home-view {
  font-family: 'Lato', sans-serif;
  min-height: 100vh; /* 保证视口的最小高度 */
  display: flex;
  flex-direction: column;
  padding-top: 80px; /* 留出导航栏的空间，避免被遮挡 */
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
  background-color: rgba(255, 255, 255, 0.9); /* 设置透明背景，稍微增加透明度 */
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



/* 导航栏按钮 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.language-switch {
  font-weight: bold;
}

/* 拍品推荐部分 */
.auction-recommendation {
  display: flex;
  flex-direction: column;
  align-items: center; /* 居中对齐内容 */
  padding: 20px;
  margin-top: 250px; /* 留出顶部空间，防止内容被导航栏遮挡 */
}

.section-title {
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 网格布局 */
.grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* 根据屏幕大小自动调整列数 */
  gap: 20px;
  max-width: 1200px; /* 限制最大宽度，确保在大屏上内容不过宽 */
  width: 100%;
  justify-content: center; /* 内容居中对齐 */
}

.grid-item {
  width: 250px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.item-image {
  max-width: 40%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
}

.item-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.item-info {
  font-size: 14px;
  color: #555;
}

.price {
  color: red;
  font-weight: bold;
}
</style>
