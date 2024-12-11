<template>
  <div class="home-view">
    <Navbar />
    <!-- 拍品推荐部分 -->
    <section class="auction-recommendation">
      <h2 class="section-title">拍品推荐</h2>
      <!-- 网格布局 -->
      <div class="grid">
        <div class="grid-item" v-for="(work, index) in works" :key="index" @click="goToAuctionsView(work)">
          <img :src="'http://172.46.225.96:8888/uploads/' +
            encodeURIComponent(work.imagePath)
            " :alt="work.title" class="grid-image" />
          <!-- <img :src="work.imagePath" :alt="work.title" class="grid-image" /> -->
          <h3>{{ work.title }}</h3> <!-- 作品标题 -->
          <p class="work-description">{{ work.description }}</p> <!-- 作品描述 -->
          <p class="work-id" :class="{ breakable: showFullHash }" @mouseover="showFullHash = true"
            @mouseleave="showFullHash = false">
            区块哈希: {{ work.blockHash }}
          </p>

        </div>
      </div>
    </section>
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
      works: [],
      showFullHash: false, // 控制哈希的换行与溢出
    };
  },
  methods: {
    goToAuctionsView(work) {
      // 使用 router.push 跳转到 AuctionsView 页面，并传递作品 ID
      this.$router.push({ path: '/AuctionsView', query: { id: work.workId } });
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
  padding-top: 80px;
  /* 需要确保内容不会被导航栏遮挡 */
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
  margin-top: 120px;
  /* 确保拍品推荐部分不会被导航栏遮挡 */
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

/* 作品标题和描述溢出优化 */
.grid-item h3,
.work-description {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  text-overflow: ellipsis;
  /* 文本溢出时显示省略号 */
  overflow: hidden;
  white-space: nowrap;
  /* 禁止换行 */
}

/* 区块哈希溢出优化 */
.work-id {
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
  text-overflow: ellipsis;
  /* 超出宽度时显示省略号 */
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  /* 限制宽度为父容器宽度 */
}

/* 如果需要换行显示的情况下 */
.work-id.breakable {
  white-space: normal;
  /* 允许换行 */
  word-wrap: break-word;
  /* 自动换行 */
  word-break: break-all;
  /* 长单词强制断行 */
  overflow-wrap: break-word;
  /* 支持非英文单词换行 */
}

/* 网格项溢出保护 */
.grid-item {
  max-width: 100%;
  /* 限制卡片宽度 */
  box-sizing: border-box;
}


.logo-container {
  margin-right: -80px;
  width: 10%;
}

.logo-image {
  width: 80%;
}
.grid-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 保证顶部内容正常排列 */
  align-items: center;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.grid-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: auto; /* 推动文本部分到卡片底部 */
}

.grid-item h3,
.work-description,
.work-id {
  margin-top: auto; /* 保证这些元素固定在卡片底部 */
}

</style>
