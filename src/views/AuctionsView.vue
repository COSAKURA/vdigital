<template>
  <div class="home-view">
    <!-- 灰色底板 -->
    <div class="background-overlay"></div>

    <!-- 透明主导航栏 -->
    <el-header class="main-header">

      <!-- 图片放置在导航栏左侧 -->
   <div class="logo-container">
      <img src="@/assets/images/lll.png" alt="Logo" class="logo-image" />
    </div>
    
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
        <el-button type="primary" icon="el-icon-user" @click="goToPage('login')"><el-icon>
            <HomeFilled />
          </el-icon>登出</el-button>
      </div>
    </el-header>

    <!-- 拍品内容部分 -->
    <div class="auction-item-container">
      <el-row :gutter="20">
        <!-- 左侧：图片 -->
        <el-col :span="6" class="auction-item-left">
          <el-image :src="`http://172.46.225.96:8888/uploads/${encodeURIComponent(auctions.imgUrl)}`" alt="拍品图片"
            fit="contain" class="item-image" />
        </el-col>
        <!-- 右侧：拍品信息 -->
        <el-col :span="18" class="auction-item-right">
          <h2 class="item-title">{{ auctions.title }}</h2>
          <p><strong>距结束：</strong><span class="countdown">{{ remainingTime }}</span></p>
          <p><strong>起拍价：</strong> <span class="price">{{ auctions.startPrice }}</span></p>
          <p><strong>当前竞拍最高价：</strong> <span class="price">{{ auctions.currentPrice || '暂无竞拍' }}</span></p>

          <div class="buttons">
  <el-input
    v-model="bidAmount"
    placeholder="输入竞拍金额"
    style="width: 150px; margin-right: 10px;"
    :disabled="isAuctionEnded"
  />
  <el-button
    type="primary"
    @click="openBidDialog"
    :disabled="isAuctionEnded"
  >
    参与竞拍
  </el-button>
</div>
<p v-if="isAuctionEnded" class="error-message">拍卖已结束，无法竞拍。</p>

          <p v-if="bidError" class="error-message">{{ bidError }}</p>
        </el-col>
      </el-row>
      <!-- 新增：拍品价值性描述 -->
      <el-row class="value-description">
        <el-col :span="24">
          <h3>拍品价值性</h3>
          <p>{{ valueDescription }}</p>
        </el-col>
      </el-row>

      <!-- 下方：描述信息 -->
      <el-row class="auction-item-info">
        <el-col :span="24">
          <h3>用户作品描述：</h3>
          <p><strong></strong><span v-html="auctions.description"></span></p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ElButton, ElCol, ElRow, ElImage, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus';
import request from '../utils/reques';

export default {
  name: 'AuctionItemPage',
  components: {
    ElButton,
    ElCol,
    ElRow,
    ElImage,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput
  },
  data() {
    return {
      workId: "", // 用于存储接收到的作品 ID
      auctions: [], // 用于存储拍卖数据

      valueDescription: '此艺术品由著名艺术家创作，具有的关此艺术品由著名艺术家创作，具有极高的历史文化价值，长期以来一直是拍卖市场的热点。它不仅代表着艺术风格的转变，也是某个历史时期艺术流派的经典之作，因此其估价不断上涨，吸引着全球收藏家的关历史时期艺术流派的经典之作，因此其估价不断上涨，吸引着全球收藏家的关期以来一直是拍卖市场的热点。它不仅代表着艺术风格的转变，也是某个历史时期艺术流派的经典之作，因此其估价不断上涨，吸引着全球收藏家的关注。',
      bidAmount: '',
      remainingTime: "", // 存储倒计时剩余时间
      countdownInterval: null, // 用于清除倒计时的定时器
      isBidDialogVisible: false, // 控制弹框显示
      bidError: '', // 竞拍价格错误提示
      isAuctionEnded: false, // 表示拍卖是否结束
    };
  },
  created() {
    // 在组件加载时接收参数并调用相关方法
    this.workId = this.$route.query.id;
    if (this.workId) {
      this.fetchAuctionsByWorkId(this.workId);
    } else {
      console.error('未接收到作品 ID');
    }
  },

  methods: {
    // 计算倒计时
  calculateRemainingTime(endTime) {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now; // 计算时间差（毫秒）

    if (diff <= 0) {
      this.remainingTime = "已结束";
      this.isAuctionEnded = true; // 标记拍卖已结束
      clearInterval(this.countdownInterval); // 倒计时结束，清除定时器
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    this.remainingTime = `${hours}小时 ${minutes}分钟 ${seconds}秒`;
    this.isAuctionEnded = false; // 拍卖进行中
  },

    // 开始倒计时
  startCountdown(endTime) {
    this.calculateRemainingTime(endTime); // 初始化计算
    this.countdownInterval = setInterval(() => {
      this.calculateRemainingTime(endTime);
    }, 1000); // 每秒更新一次
  },
 // 点击“参与竞拍”按钮时打开弹框
 openBidDialog() {
  if (!this.auctions || !this.auctions.startPrice) {
    this.bidError = "拍卖数据加载错误，请稍后重试！";
    console.error("拍卖数据未正确加载:", this.auctions);
    return;
  }

  const highestBid = this.auctions.currentPrice || this.auctions.startPrice;

  // 检查竞拍金额是否大于当前最高竞拍价
  if (!this.bidAmount || this.bidAmount <= highestBid) {
    this.bidError = `竞拍金额必须高于当前最高价 ${highestBid}`;
    return;
  }

  this.bidError = ''; // 清空错误提示
  this.submitBid(); // 提交竞拍
},


 // 提交竞拍
async submitBid() {
  try {
    const response = await request.post(
      '/auctions/placeBid', 
      null, // POST 请求体为空时可以传递 null
      {
        params: {
          auctionId: this.auctions.auctionId,
          bidAmount: this.bidAmount,
          email: localStorage.getItem("email"),
          privateKey: localStorage.getItem("privateKey"),
        },
      }
    );

    if (response.data.code === 0) {
      this.$message.success("竞拍成功！");
      this.bidAmount = ''; // 清空竞拍金额
      this.fetchAuctionsByWorkId(this.workId); // 更新拍卖数据
    } else {
      this.$message.error(response.data.msg || "竞拍失败！");
    }
  } catch (error) {
    console.error("提交竞拍时发生错误:", error);
    this.$message.error("竞拍失败，请稍后再试！");
  }
},


    // 重置弹框表单
    resetBidDialog() {
      this.bidForm = {
        username: '',
        password: '',
        verificationCode: ''
      };
    },
    async fetchAuctionsByWorkId(workId) {
      try {
        const response = await request.get('/auctions/getAuctionById', {
          params: { workId }, // 将作品 ID 传递到后端
        });
        if (response.data.code === 0) {
          this.auctions = response.data.auction; // 成功获取数据
          // 开始倒计时
        this.startCountdown(this.auctions.endTime);
        } else {
          console.error('获取拍卖数据失败:', response.data.msg);
        }
      } catch (error) {
        console.error('获取拍卖数据时发生错误:', error);
      }
    },
  },
  beforeDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

};
</script>


<style scoped>
html, body {
  overflow-x: hidden; /* 禁止页面水平滚动 */
  width: 100%;
  margin: 0;
  padding: 0;
}

.main-header, .auction-item-container {
  max-width: 100%; /* 确保内容不会超出屏幕 */
  overflow-x: hidden; /* 禁止容器水平滚动 */
}

.item-image {
  left: 50%; /* 居中图片 */
  transform: translateX(-50%); /* 防止图片超出页面边界 */
}

/* 整体布局样式 */
.home-view {
  font-family: 'Lato', sans-serif;
  padding-top: 80px;
  /* 避免导航栏遮挡内容 */
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
  background-color: rgba(255, 255, 255, 0.9);
  /* 透明背景 */
  z-index: 1000;
  transition: background-color 0.3s ease-in-out;
}

.el-menu-demo {
  background-color: rgba(255, 255, 255, 0.1);
  flex-grow: 1;
  margin-left: 50px;
}

.nav-item:hover {
  transform: scale(1.1);
  /* 鼠标悬停时放大 */
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

  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  z-index: -1;
}

/* 拍品信息区域 */
.auction-item-container {
  position: sticky;
  margin-top: 300px;
  /* 保证内容不会被固定的导航栏遮挡 */
}

.auction-item-left {
  margin-top: 70px;
  position: sticky;
  padding: 20px;
}

.auction-item-right {
  margin-bottom: 100px;
  margin-top: 10px;
  margin-left: 650px;
  width: 50%;
  /* 右侧占50%的宽度 */
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
  position: absolute;
  /* 使用绝对定位 */
  top: 10px;
  /* 向下偏移 */
  left: 300px;
  /* 向左偏移 */
  width: 90%;
  /* 放大图片宽度 */
  max-height: 500px;
  /* 控制图片的最大高度 */
  border-radius: 8px;
  /* 圆角边框 */
  transform: scale(1.2);
  /* 放大图片 */
  z-index: 1;
  /* 确保图片在最上层 */
}

.auction-item-info {
  margin-top: 30px;
  padding: 20px;
}


.value-description {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.value-description p {
  font-size: 16px;

  word-wrap: break-word;
  /* 自动换行 */
  text-indent: 2em;
  /* 添加前空位 */
}


.value-description h3 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.value-description p {
  font-size: 16px;
  color: #333;
}

/* 处理描述文本换行 */
.auction-item-info p {
  margin-top: 15px;
  font-size: 16px;

  word-wrap: break-word;
  /* 自动换行 */
  text-indent: 2em;
  /* 添加前空位 */
}
.countdown {
  color: red;
  font-weight: bold;
}


.logo-container{
  margin-right: -80px;
  width: 10%;
}

.logo-image{
  width: 80%;
}
</style>
