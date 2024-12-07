<template>
  <div class="home-view">
    <!-- 透明主导航栏 -->
    <el-header class="main-header">
      <el-menu mode="horizontal" class="el-menu-demo">
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
        <el-button type="primary" icon="el-icon-user" @click="goToPage('login')"><el-icon><HomeFilled /></el-icon>登出</el-button>
      </div>
    </el-header>

    <!-- 拍品推荐部分 -->
    <section class="auction-recommendation">
      <h2 class="section-title">拍品推荐</h2>
      <!-- 网格布局 -->
      <div class="grid">
        <div
          class="grid-item"
          v-for="(work, index) in works"
          :key="index"
          @click="goToAuctionsView(work)"
        >
          <img :src="work.image" :alt="work.title" class="grid-image" />
          <h3>{{ work.title }}</h3> <!-- 作品标题 -->
          <p class="work-description">{{ work.description }}</p> <!-- 作品描述 -->
          <p class="work-id">作品ID: {{ work.id }}</p> <!-- 作品ID -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      works: [
        {
          title: "作品 1",
          description: "这是作品 1 的描述内容，描述了作品的特性、风格以及其它相关信息。",
          image: "src/assets/images/resource/nft.jpg",
          id: 1, // 作品 ID，用于跳转
        },
        {
          title: "作品 2",
          description: "这是作品 2 的描述内容，包含更多关于作品的创作背景和特点。",
          image: "src/assets/images/resource/nft.jpg",
          id: 2,
        },
        {
          title: "作品 3",
          description: "这是作品 3 的描述内容，讲述了作品的艺术创作过程。",
          image: "src/assets/images/resource/nft.jpg",
          id: 3,
        },
        {
          title: "作品 4",
          description: "这是作品 4 的描述内容，解释了作品的理念和设计。",
          image: "src/assets/images/resource/nft.jpg",
          id: 4,
        },
        {
          title: "作品 5",
          description: "这是作品 5 的描述内容，讲解了创作灵感及其背后的故事。",
          image: "src/assets/images/resource/nft.jpg",
          id: 5,
        },
        {
          title: "作品 6",
          description: "这是作品 6 的描述内容，涉及作品的艺术风格和表现手法。",
          image: "src/assets/images/resource/nft.jpg",
          id: 6,
        },
      ],
    };
  },
  methods: {
    goToAuctionsView(work) {
      // 使用 router.push 跳转到 AuctionsView 页面，并传递作品 ID
      this.$router.push({ path: '/AuctionsView', query: { id: work.id } });
    },
  },
};
</script>

<style scoped>
/* 整体布局样式 */
.home-view {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 80px; /* 需要确保内容不会被导航栏遮挡 */
}

/* 透明主导航栏 */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 1000;
  transition: background-color 0.3s ease-in-out;
}

.el-menu-demo {
  background-color: rgba(255, 255, 255, 0.1);
  flex-grow: 1;
  margin-left: 50px;
}

.nav-item {
  transition: transform 0.3s ease-in-out;
}

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
  align-items: center;
  padding: 20px;
  margin-top: 120px; /* 确保拍品推荐部分不会被导航栏遮挡 */
}

.section-title {
  margin-top: 200px;
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 网格布局 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  justify-content: center;
}

.grid-item {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.grid-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.grid-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 10px;
}

/* 新增样式 */
.work-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.work-id {
  font-size: 12px;
  color: #888;
}
</style>
