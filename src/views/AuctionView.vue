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
}

/* 拍品推荐部分 */
.auction-recommendation {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 120px;
}

.section-title {
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 网格布局 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  max-width: 1000px;
  margin: 15px auto;
  padding: 15px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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

/* 图片样式 */
.grid-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: auto;
}

/* 文本溢出处理 */
.grid-item h3,
.work-description,
.work-id {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  overflow: hidden; /* 隐藏溢出内容 */
  white-space: nowrap; /* 禁止换行 */
  width: 100%; /* 限制宽度 */
  box-sizing: border-box;
}

/* 区块哈希悬停显示完整 */
.work-id {
  font-size: 12px;
  color: #888;
}

.work-id.breakable {
  white-space: normal; /* 恢复换行 */
  word-wrap: break-word;
  word-break: break-all;
  overflow-wrap: break-word;
}

.grid-item h3:hover,
.work-description:hover,
.work-id:hover {
  white-space: normal; /* 悬停显示完整内容 */
  word-wrap: break-word;
  word-break: break-all;
  overflow-wrap: break-word;
  z-index: 10;
  background: #f9f9f9;
}
</style>
