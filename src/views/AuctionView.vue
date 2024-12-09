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
        <img
            :src="
              'http://172.46.225.96:8888/uploads/' +
              encodeURIComponent(work.imagePath)
            "
            :alt="work.title"
            class="grid-image"
          />
          <!-- <img :src="work.imagePath" :alt="work.title" class="grid-image" /> -->
          <h3>{{ work.title }}</h3> <!-- 作品标题 -->
          <p class="work-description">{{ work.description }}</p> <!-- 作品描述 -->
          <p class="work-id">区块哈希: {{ work.blockHash }}</p> <!-- 作品ID -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import request from '../utils/reques';

export default {
  name: "HomeView",
  data() {
    return {
      works: [],
    };
  },
  methods: {
    goToAuctionsView(work) {
      // 使用 router.push 跳转到 AuctionsView 页面，并传递作品 ID
      this.$router.push({ path: '/AuctionsView', query: { id: work.blockHash } });
    },
    // 获取所有拍卖数据的方法
    async fetchAuctions() {
      try {
        const response = await request.get('/auctions/getAllAuctions');
        // 将返回的拍卖数据赋值给 works
        if (response.data.code === 0) {
          this.works = response.data.auctions;
        } else {
          console.error("获取拍卖数据失败:", response.data.msg);
        }
      } catch (error) {
        console.error("获取拍卖数据时发生错误:", error);
      }
    },
  },
  mounted() {
    // 页面加载完成后调用该方法获取所有拍卖数据
    this.fetchAuctions();
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
