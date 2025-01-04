<template>
  <div class="home-view">
    <Navbar />

    <div class="container">
      <!-- 左侧分类选项 -->
      <aside class="sidebar" :class="{ 'sidebar-hidden': isSidebarHidden }">
        <!-- 侧边栏切换按钮 -->
        <div class="toggle-button" @click="toggleSidebar">
          <span v-if="isSidebarHidden">&gt;</span>
          <span v-else>&lt;</span>
        </div>

        <!-- 分类筛选内容 -->
        <el-card class="filter-card">
          <h3>分类筛选</h3>

          <!-- 市场类型筛选 -->
          <div class="section-header" @click="toggleMarketType">
            <h4>市场类型</h4>
            <span class="arrow">{{ isMarketTypeVisible ? "▲" : "▼" }}</span>
          </div>
          <transition name="slide">
            <div v-show="isMarketTypeVisible" class="two-columns">
              <el-button v-for="type in marketTypes" :key="type.value"
                :type="selectedMarketType === type.value ? 'primary' : ''" @click="filterByMarketType(type.value)">
                {{ type.label }}
              </el-button>
            </div>
          </transition>
        </el-card>
      </aside>

      <!-- 拍品推荐部分 -->
      <section class="auction-recommendation" :class="{ 'content-expanded': isSidebarHidden }">
        <div class="grid">
          <div class="grid-item" v-for="(work, index) in works" :key="index" @click="goToAuctionsView(work)">
            <!-- 图片部分 -->
            <div class="image-container">
              <img :src="`http://172.46.225.3:8888/uploads/${encodeURIComponent(work.imagePath)}`" :alt="work.title"
                class="grid-image" />
              <div class="image-overlay">
                <span>❤️ {{ work.likes || 0 }}</span>
              </div>
            </div>

            <!-- 作品内容部分 -->
            <div>
              <h3>{{ work.title }}</h3>
              <p class="work-author"> <img src="../assets/images/resource/tx.jpg" alt="icon" class="author-icon" />
                <span class="author-name">{{ work.username }}</span></p>
              <p class="work-price">¥ {{ work.startingPrice }}起</p>
            </div>
          </div>
        </div>
      </section>
    </div>
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
      isThemeTypeVisible: true, // 控制主题分类的显示状态
      isMarketTypeVisible: true, // 控制市场类型的展开/折叠状态
      isSidebarHidden: false, // 侧边栏显示/隐藏状态
      selectedMarketType: "",
      selectedTheme: "",

      // 市场类型选项
      marketTypes: [
        { label: "艺术类", value: "arts" },
        { label: "风景类", value: "landscape" },
        { label: "虚拟场景类", value: "Virtual" },
        { label: "游戏类", value: "game" },
        { label: "其他类", value: " categories" }
      ],
    };
  },
  methods: {


    toggleMarketType() {
      this.isMarketTypeVisible = !this.isMarketTypeVisible; // 切换市场类型显示/隐藏
    },
    toggleThemeType() {
      this.isThemeTypeVisible = !this.isThemeTypeVisible; // 切换主题分类显示/隐藏
    },
    filterByMarketType(type) {
      this.selectedMarketType = type; // 设置选中的市场类型
    },
    filterByTheme(theme) {
      this.selectedTheme = theme; // 设置选中的主题分类
    },
    toggleMarketType() {
      this.isMarketTypeVisible = !this.isMarketTypeVisible; // 切换展开/折叠状态
    },
    filterByMarketType(type) {
      this.selectedMarketType = type; // 选择市场类型
    },
    filterByTheme(theme) {
      this.selectedTheme = theme; // 选择主题分类
    },

    toggleSidebar() {
      this.isSidebarHidden = !this.isSidebarHidden;
    },
    filterByMarketType(type) {
      this.selectedMarketType = type;
    },
    filterByTheme(theme) {
      this.selectedTheme = theme;
    },
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
    // 根据市场类型筛选
    filterByMarketType(type) {
      this.selectedMarketType = type;
      this.applyFilters();
    },

    // 根据主题分类筛选
    filterByTheme(theme) {
      this.selectedTheme = theme;
      this.applyFilters();
    },

    // 应用筛选条件
    applyFilters() {
      this.filteredWorks = this.works.filter(work => {
        return (
          (!this.selectedMarketType || work.marketType === this.selectedMarketType) &&
          (!this.selectedTheme || work.theme === this.selectedTheme)
        );
      });
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
  margin-left: 120px;
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 80px;
}

/* 拍品推荐部分 */
.auction-recommendation {
  position: relative;
  top: 300px;
  max-width: 1200px;
  text-align: center;
}

/* 调整分类标题之间的间距 */
.section-header {
  margin-bottom: 10px;
  /* 标题与下方内容的间距 */
}

.section-header h4 {
  margin: 0;
  /* 去掉默认 h4 margin，统一控制 */
  font-size: 16px;
  /* 可以增加字体大小 */
  color: #333;
  font-weight: bold;
}


.section-title {
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 网格布局 */
.grid {
  position: relative;
  top: 150px;
  width: 1200px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* 每行显示6个作品 */
  gap: 20px;
  /* 子元素间距 */
  padding: 20px;
  margin: 0 auto;
  /* 居中展示 */

}

/* 单个拍品卡片 */
.grid-item {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* 图片部分 */
.image-container {
  position: relative;
  overflow: hidden;
}

.grid-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.grid-item:hover .grid-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
}

/* 区块哈希悬停显示完整 */
.work-id {
  font-size: 12px;
  color: #888;
}

.work-id.breakable {
  white-space: normal;
  /* 恢复换行 */
  word-wrap: break-word;
  word-break: break-all;
  overflow-wrap: break-word;
}

.grid-item h3:hover,
.work-description:hover,
.work-id:hover {
  white-space: normal;
  /* 悬停显示完整内容 */
  word-wrap: break-word;
  word-break: break-all;
  overflow-wrap: break-word;
  z-index: 10;
  background: #f9f9f9;
}

/* 容器样式 */
.container {
  margin-right: 250px;
  max-width: 1500px;
  display: flex;
  flex-direction: row;
}

/* 左侧侧边栏 */
.sidebar {
  margin-top: -21px;
  position: fixed;
  top: 80px;
  left: 0;
  height: calc(100vh - 80px);
  width: 280px;
  background-color: #f9f9f9;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  z-index: 10;
}

.sidebar-hidden {
  transform: translateX(-100%);
  /* 将侧边栏隐藏到左侧 */
}

.filter-card {
  overflow-y: auto;
  height: calc(100vh - 80px);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* 切换按钮 */
.toggle-button {
  position: absolute;
  top: 10px;
  right: -15px;
  width: 30px;
  height: 30px;
  background-color: #67c23a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s;
}

.toggle-button:hover {
  background-color: #5daf2b;

}


/* 内容区域随侧边栏移动调整 */
.auction-recommendation {
  margin-left: 300px;
  transition: margin-left 0.3s ease-in-out;
}

.content-expanded {
  margin-left: 20px;
  /* 左侧侧边栏收起时，主内容区域左移 */
}

/* 按钮样式 */
.el-button {
  width: 100%;
  margin: 5px 0;
  font-size: 14px;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.el-button:hover {
  background-color: #f0f9eb;
  /* 按钮悬停背景色 */
  color: #67c23a;
  /* 悬停字体颜色 */
}

/* 按钮分组优化 */
.el-button-group {
  display: flex;
  flex-direction: column;
}

.el-button-group .el-button {
  border: 1px solid #dcdfe6;
  background-color: #ffffff;
  color: #606266;
}

.el-button-group .el-button.primary {
  background-color: #67c23a;
  color: #ffffff;
  border-color: #67c23a;
}

.el-button-group .el-button.primary:hover {
  background-color: #5daf2b;
  border-color: #5daf2b;
}

/* 间距样式 */
.filter-card .el-button-group {
  margin-bottom: 10px;
}

/* 卡片底部分隔线 */
.filter-card h4::after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background-color: #ebeef5;
  margin-top: 5px;
}

/* 卡片样式 */
.filter-card {
  padding: 20px;
}

/* 折叠/展开箭头样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.arrow {
  font-size: 14px;
  color: #67c23a;
  transition: transform 0.3s ease;
}

/* 折叠/展开动画 */
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  overflow: hidden;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 200px;
  /* 根据内容调整 */
  overflow: hidden;
}



/* 调整按钮组与标题之间的间距 */
.two-columns {
  display: grid;

  gap: 15px;
  /* 按钮之间的间距 */
  margin-bottom: 20px;
  /* 按钮组底部间距，拉开和下方标题的距离 */
}

/* 单个按钮样式 */
.two-columns .el-button {
  width: 100%;
  text-align: center;
  padding: 12px 0;
  /* 增加按钮的高度 */
  font-size: 14px;
  /* 增大按钮字体大小 */
  margin: 0;
  /* 去掉按钮默认外边距 */
  box-sizing: border-box;
}

.work-price {
  margin-right: 180px;
  color: #d4af37;
  /* 金黄色 */
  font-weight: bold;
  /* 字体加粗 */
  font-size: 17px;
  /* 可选：调整字体大小 */
}

.work-author {
  display: flex;
  /* 将内容水平排列 */
  align-items: center;
  /* 垂直居中对齐 */
  gap: 8px;
  /* 图片和用户名之间的间距 */
  margin-right: 180px;
  font-size: 12px;
  /* 可选：调整字体大小 */
}

.author-icon {
  width: 16px;
  /* 小图片宽度 */
  height: 16px;
  /* 小图片高度 */
  margin-right: 5px;
  /* 图片和文字之间的间距 */
  vertical-align: middle;
  /* 垂直居中对齐 */
  border-radius: 50%;
  /* 可选：将图片变为圆形 */
}

.author-name {
  white-space: nowrap;
  /* 防止文字换行 */
  font-size: 14px;
  /* 根据需求调整字体大小 */
  color: #333;
  /* 设置文字颜色 */
}
</style>
