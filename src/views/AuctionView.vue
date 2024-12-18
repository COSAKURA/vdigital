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
              <el-button
                v-for="type in marketTypes"
                :key="type.value"
                :type="selectedMarketType === type.value ? 'primary' : ''"
                @click="filterByMarketType(type.value)"
              >
                {{ type.label }}
              </el-button>
            </div>
          </transition>

          <!-- 主题分类筛选 -->
          <div class="section-header" @click="toggleThemeType">
            <h4>主题分类</h4>
            <span class="arrow">{{ isThemeTypeVisible ? "▲" : "▼" }}</span>
          </div>
          <transition name="slide">
            <div v-show="isThemeTypeVisible" class="two-columns">
              <el-button
                v-for="theme in themeTypes"
                :key="theme.value"
                :type="selectedTheme === theme.value ? 'primary' : ''"
                @click="filterByTheme(theme.value)"
              >
                {{ theme.label }}
              </el-button>
            </div>
          </transition>
        </el-card>
      </aside>

      <!-- 拍品推荐部分 -->
      <section
        class="auction-recommendation"
        :class="{ 'content-expanded': isSidebarHidden }"
      >
        <h2 class="section-title">拍品推荐</h2>
        <div class="grid">
          <div
            class="grid-item"
            v-for="(work, index) in works"
            :key="index"
            @click="goToAuctionsView(work)"
          >
            <img
              :src="'http://172.46.225.96:8888/uploads/' + encodeURIComponent(work.imagePath)"
              :alt="work.title"
              class="grid-image"
            />
            <h3>{{ work.title }}</h3>
            <p class="work-description">{{ work.description }}</p>
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
        { label: "数字藏品", value: "digital" },
        { label: "数字版权", value: "copyright" },
        { label: "数字身份", value: "identity" },
        { label: "实业赋能", value: "rwa" },
      ],

      // 主题分类选项
      themeTypes: [
        { label: "天龙区", value: "tianlong" },
        { label: "活跃区", value: "active" },
        { label: "观察区", value: "observe" },
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
  margin-left: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 80px;
}

/* 调整分类标题之间的间距 */
.section-header {
  margin-bottom: 10px; /* 标题与下方内容的间距 */
}

.section-header h4 {
  margin: 0; /* 去掉默认 h4 margin，统一控制 */
  font-size: 16px; /* 可以增加字体大小 */
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

/* 容器样式 */
.container {
  margin-right: 250px;
  max-width: 1600px;
  display: flex;
  flex-direction: row;
}

/* 左侧侧边栏 */
.sidebar {
  margin-top:-21px;
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
  transform: translateX(-100%); /* 将侧边栏隐藏到左侧 */
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
  margin-left: 20px; /* 左侧侧边栏收起时，主内容区域左移 */
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
  background-color: #f0f9eb; /* 按钮悬停背景色 */
  color: #67c23a; /* 悬停字体颜色 */
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
  max-height: 200px; /* 根据内容调整 */
  overflow: hidden;
}



/* 调整按钮组与标题之间的间距 */
.two-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 每行两列 */
  gap: 15px; /* 按钮之间的间距 */
  margin-bottom: 20px; /* 按钮组底部间距，拉开和下方标题的距离 */
}

/* 单个按钮样式 */
.two-columns .el-button {
  width: 100%;
  text-align: center;
  padding: 12px 0; /* 增加按钮的高度 */
  font-size: 14px; /* 增大按钮字体大小 */
  margin: 0; /* 去掉按钮默认外边距 */
  box-sizing: border-box;
}
</style>
