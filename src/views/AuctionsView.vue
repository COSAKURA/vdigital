<template>
  <div class="home-view">
    <!-- 灰色底板 -->
    <div class="background-overlay"></div>
    <Navbar />
    <!-- 拍品内容部分 -->
    <div class="auction-item-container">
      <el-row :gutter="20">
        <!-- 左侧：图片 -->
        <div class="auction-item-left">
          <!-- 图片反转进入 -->
          <el-image :src="`http://172.46.225.3:8888/uploads/${encodeURIComponent(auctions.imgUrl)}`" alt="拍品图片"
            fit="contain" class="item-image flip-in" />
        </div>
        <!-- 右侧：拍品信息 -->
        <el-col :span="18" class="auction-item-right">
          <h2 class="item-title">{{ auctions.title }} <span class="icon-heart">❤️ {{ auctions.likes || 0 }}</span></h2>

          <p class="author">
            <strong>作者：</strong>
            <img src="../assets/images/resource/tx.jpg" alt="icon" class="author-icon" />
            {{ auctions.username }}
          </p>
          <p>
            <strong class="price-label">￥起：</strong>
            <span class="price">{{ auctions.startPrice }} </span>

            <span class="spacing"></span> <!-- 用于增加间隔 -->

            <strong class="price-label">当前最高￥：</strong>
            <span class="price">{{ auctions.currentPrice || '暂无竞拍' }}</span>
          </p>
          <div class="buttons">
            <!-- 减号按钮 -->
            <el-button type="primary" @click="decreaseAmount" :disabled="isAuctionEnded || bidAmount <= minBidAmount"
              style="height: 35px;  font-size: 24px;">
              -
            </el-button>

            <!-- 输入框禁用状态 -->
            <el-input v-model="bidAmount" placeholder="输入竞拍金额" style="width: 250px; height: 35px; margin-right: 10px;"
              :disabled="isAuctionEnded" @blur="validateBidAmount" @input="bidAmount = Number(bidAmount)" />

            <!-- 加号按钮 -->
            <el-button type="primary" @click="increaseAmount" :disabled="isAuctionEnded || bidAmount >= maxBidAmount"
              style="height: 35px;  font-size: 24px;">
              +
            </el-button>

            <!-- 根据拍卖状态动态切换按钮 -->
            <el-button v-if="!isAuctionEnded" type="primary" @click="openBidDialog">
              参与竞拍
            </el-button>

            <el-button v-else type="danger" disabled>
              拍卖已结束
            </el-button>

          </div>
          <p v-if="isAuctionEnded" class="error-message">拍卖已结束，无法竞拍。</p>
          <p v-if="bidError" class="error-message">{{ bidError }}</p>

          <!-- 商品信息框 -->
          <div class="product-info-box">
            <h3>商品信息</h3>
            <div class="info-item">
              <span class="info-label">合约地址：</span>
              <span class="info-value copyable" @click="copyToClipboard(productInfo['合约地址'])">
                {{ productInfo['合约地址'] }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">认证标识：</span>
              <span class="info-value copyable" @click="copyToClipboard(productInfo['认证标识'])">
                {{ productInfo['认证标识'] }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">认证标准：</span>
              <span class="info-value">{{ productInfo['认证标准'] }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">认证网络：</span>
              <span class="info-value">{{ productInfo['认证网络'] }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">结束时间：</span>
              <span class="info-value1">{{ remainingTime }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 标题部分 -->
      <div class="bidding-records-title">
        <h3 class="section-title">竞买记录</h3>
      </div>
      <el-row class="bidding-records">
        <el-col :span="24">
          <div class="bidding-records-title">
            <h3 class="section-title">竞买记录</h3>
          </div>
          <el-table :data="bids" style="width: 100%; margin-top: 10px;">
            <el-table-column prop="username" label="用户名称" align="center" width="250">
              <template #default="scope">
                {{ scope.row.username }}
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" align="center" width="150">
              <template #default="scope">
                ￥{{ scope.row.price }}
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="时间" align="center" width="240">
              <template #default="scope">
                {{ scope.row.createdAt }}
              </template>
            </el-table-column>
            <el-table-column label="交易哈希" align="center" width="600">
              <template #default="scope">
                {{ scope.row.transactionHash }}
              </template>
            </el-table-column>
          </el-table>

        </el-col>
      </el-row>

      <!-- 新增：拍品价值性描述 -->
      <el-row class="value-description">
        <el-col :span="24">
          <h3>拍品价值性</h3>
          <p>{{ valueDescription }}</p>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
import { ElButton, ElCol, ElRow, ElImage, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus';
import request from '../utils/reques';
import Navbar from "@/components/Navbar.vue";

export default {
  name: 'AuctionItemPage',
  components: {
    Navbar,
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
      bids: [], // 存储出价历史记录
      isOwner: false, // 当前用户是否为发起人
      productInfo: {
        合约地址: "0x4064...8329",
        认证标识: "112947...095258",
        认证标准: "ERC-721",
        认证网络: "唯艺链",
        到期时间: "",
      },
      auctions: {}, // 拍卖相关信息
      valueDescription: "此艺术品由著名艺术家创作，具有极高的历史文化价值。",
      bidAmount: 1, // 当前竞拍金额
      minBidAmount: 1, // 最小竞拍金额
      maxBidAmount: '1000000000000000000', // 最大竞拍金额
      stepAmount: 100, // 每次加减的步进值
      isAuctionEnded: false,
      remainingTime: "",
      bidError: "",
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
    // 初始化 WebSocket 连接
    this.initWebSocket();
  },

  methods: {

    // 减少金额
    decreaseAmount() {
      this.bidAmount = Number(this.bidAmount); // 确保 bidAmount 为数字
      if (this.bidAmount - this.stepAmount < 0) {
        this.bidAmount = 0; // 如果减去步进值后小于零，直接设置为 0
      } else {
        this.bidAmount -= this.stepAmount; // 正常减去步进值
      }
    },

    // 增加金额
    increaseAmount() {
      this.bidAmount = Number(this.bidAmount); // 确保 bidAmount 为数字
      if (this.bidAmount < this.maxBidAmount) {
        this.bidAmount += this.stepAmount;
      }
    },

    // 校验用户手动输入的金额
    validateBidAmount() {
      this.bidAmount = Number(this.bidAmount); // 确保为数字
      if (this.bidAmount < 0 || isNaN(this.bidAmount)) {
        this.bidAmount = 0; // 修正为 0
      }
    },

    // 初始化 WebSocket 连接
    initWebSocket() {
      const socket = new WebSocket("ws://172.46.225.3:8888/ws/auction");

      // 保存 WebSocket 实例到 data
      this.websocket = socket;

      // 监听消息
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // 检查消息是否为拍卖更新
        const auctionId = data.auctionId;
        const currentPrice = data.currentPrice;

        // 更新页面中对应的拍卖数据
        if (this.auctions.auctionId === auctionId) {
          this.auctions.currentPrice = currentPrice;
          this.$forceUpdate(); // 强制更新页面
        }
      };

      // WebSocket 连接关闭时的处理
      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      // WebSocket 连接出错时的处理
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      // WebSocket 连接成功时的处理
      socket.onopen = () => {
        console.log("WebSocket connection opened");
      };
    },

    // 计算倒计时
    calculateRemainingTime(endTime) {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end - now; // 计算时间差（毫秒）

      if (diff <= 0) {
        this.remainingTime = "已结束";
        this.isAuctionEnded = true; // 标记拍卖已结束
        clearInterval(this.countdownInterval); // 清除定时器

        // 调用后端结束拍卖接口
        this.endAuction();

        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // 天数
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // 小时
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // 分钟
      const seconds = Math.floor((diff % (1000 * 60)) / 1000); // 秒

      // 格式化为两位数
      const formattedDays = days.toString().padStart(2, '0');
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');

      this.remainingTime = `${formattedDays}天 ${formattedHours}小时 ${formattedMinutes}分钟 ${formattedSeconds}秒`;
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
        this.$message.error("竞拍失败，请输入正整数！");
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
          params: {
            workId,
            currentUserEmail: localStorage.getItem("email")
          }, // 将作品 ID 传递到后端
        });
        if (response.data.code === 0) {
          this.auctions = response.data.auction; // 成功获取数据
          this.bids = response.data.auction.bids;
          // 开始倒计时
          this.startCountdown(this.auctions.endTime);
        } else {
          console.error('获取拍卖数据失败:', response.data.msg);
        }
      } catch (error) {
        console.error('获取拍卖数据时发生错误:', error);
      }
    },

    // 调用结束拍卖接口
    async endAuction() {
      try {
        const response = await request.post('/auctions/endAuction', null, {
          params: {
            auctionId: this.auctions.auctionId, // 当前拍卖ID
            privateKey: localStorage.getItem('privateKey'), // 用户私钥
            email: localStorage.getItem('email'), // 用户邮箱
          },
        });

        if (response.data.code === 0) {
          this.$message.success("拍卖已成功结束");
          window.location.reload(); // 刷新页面

        } else {
          this.$message.error(response.data.msg || "结束拍卖失败！");
        }
      } catch (error) {
        console.error("结束拍卖时发生错误:", error);
        this.$message.error("系统错误，请稍后再试！");
      }
    },
  },
  beforeDestroy() {
    // 组件销毁时关闭 WebSocket
    if (this.websocket) {
      this.websocket.close();
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

};
</script>


<style scoped>
html,
body {
  overflow-x: hidden;
  /* 禁止页面水平滚动 */
  width: 100%;
  margin: 0;
  padding: 0;
}

.auction-item-container {
  position: fixed;
  /* 固定位置 */
  top: 180px;
  max-width: 100%;
  /* 确保内容不会超出屏幕 */
  overflow-x: hidden;
  z-index: 10;
  /* 保证在其他内容之上 */
}

.auction-item-left {
  width: auto;
  /* 自动调整宽度 */
  height: auto;
  /* 自动调整高度 */
  overflow: visible;
  /* 确保不隐藏内容 */
}



.item-image:hover {
  transform: scale(1.5);
  /* 鼠标悬停时放大1.5倍 */
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
  /* 放大时增强阴影效果 */
  cursor: pointer;
  /* 鼠标变为手型 */
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
  transform: scale(1.2);
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
  margin-top: 30px;
  /* 将原来的 300px 调小，比如 20px */
  padding: 20px;
  background-color: #ffffff;
  /* 白色背景，更美观 */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 添加阴影 */
  position: relative;
  /* 保持相对定位 */
  z-index: 10;
  /* 保证在灰色背景之上 */
}

.auction-item-left {

  width: 23%;
  margin-top: 50px;
  position: sticky;
  padding: 20px;
}

.auction-item-right {
  margin-bottom: 100px;
  margin-top: 10px;
  margin-left: 600px;
  width: 250px;
  /* 右侧占50%的宽度 */
  padding: 20px;
}

.bidding-records {
  margin-top: -60px;
  height: 300px;
  /* 固定高度 */
  overflow-y: auto;
  /* 启用垂直滚动条 */
  background-color: #f9f9f9;
  /* 背景色，确保视觉清晰 */
  border: 1px solid #e0e0e0;
  /* 边框 */
  border-radius: 8px;
  /* 圆角 */
  padding: 10px;
  /* 内边距 */
}

.bidding-records-title {
  margin-bottom: 10px;
  /* 标题与表格的间距 */
}

.section-title {
  font-size: 25px;
  font-weight: bold;
  color: red;
  /* 可以根据需要更改颜色 */
  text-align: center;
  position: relative;
  top: -70px;
}

.el-table {
  background-color: #f9f9f9;
  /* 表格背景色 */
  position: relative;
  top: -60px;
}


.item-title {
  font-size: 35px;
  /* 调整标题文字大小 */
  font-weight: bold;
  /* 加粗标题文字 */
  color: #333;
  /* 设置标题文字颜色 */
  margin-bottom: 20px;
  /* 添加标题与后面内容的间距 */
}

.price {
  font-size: 23px;
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
  top: 200px;
  /* 将图片往上移动 */
  left: 200px;
  width: 200px;
  max-height: 500px;
  border-radius: 8px;
  transform: scale(1.4);
  z-index: 1;
  width: 100%;
  height: auto;
  transition: transform 0.8s ease-out;

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


.logo-container {
  margin-right: -80px;
  width: 10%;
}

.logo-image {
  width: 80%;
}



.flip-in {
  animation: flipIn 1s ease-in-out;
}

@keyframes flipIn {
  0% {
    transform: rotateY(90deg);
    /* 初始翻转90度 */
    opacity: 0;
    /* 初始透明 */
  }

  100% {
    transform: rotateY(0deg);
    /* 还原到正常状态 */
    opacity: 1;
    /* 完全显示 */
  }
}

/* 商品信息框样式 */
.product-info-box {
  width: 400px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  /* 边框颜色 */
  border-radius: 8px;
  /* 圆角 */
  background-color: #f9f9f9;
  /* 背景颜色 */
  margin-top: 20px;
  /* 上方间距 */
}

.product-info-box h3 {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
}

.info-label {
  font-weight: bold;
  color: #666;
}

.info-value {
  color: #409eff;
  cursor: pointer;
}

.info-value1 {
  color: red;
}

.info-value:hover {
  text-decoration: underline;
}

/* 竞拍信息框 */
.auction-info-box {
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.price {
  color: red;
  font-weight: bold;
}

.buttons {
  margin-top: 20px;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.price-label {
  font-size: 20px;
  /* 增大字体 */
  color: #333;
  /* 设置颜色 */
  font-weight: bold;
  /* 加粗文字 */
  margin-right: 5px;
  /* 与后面的文字保持间距 */
}


.author {
  font-size: 17px;
  color: #333;
  font-weight: bold;
  margin-right: 5px;
  margin-left: 5px;
  display: inline-block;
  vertical-align: middle;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 5px;
}

.author-icon {
  width: 20px;
  /* 小图片宽度 */
  height: 20px;
  /* 小图片高度 */
  margin-right: 5px;
  /* 图片和文字之间的间距 */
  vertical-align: middle;
  /* 垂直居中对齐 */
  border-radius: 50%;
  /* 可选：将图片变为圆形 */
}

.icon-heart {
  margin-left: 10px;
  /* 图标与标题文字的间距 */
  font-size: 18px;
  /* 图标和数字的大小 */
  color: #ff4d4f;
  /* 设置红色的爱心图标 */
  vertical-align: middle;
  /* 垂直居中对齐 */
  cursor: pointer;
  /* 鼠标移到图标上时变为手型 */
}

.icon-heart:hover {
  transform: scale(1.2);
  /* 悬停时放大效果 */
  transition: transform 0.2s ease-in-out;
  /* 动画效果 */
}

.spacing {
  display: inline-block;
  /* 确保占据空间 */
  width: 95px;
  /* 设置左右间隔的大小，可以根据需要调整 */
}
</style>
