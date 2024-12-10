<template>
  <div class="home-view">
    <!-- 灰色底板 -->
    <div class="background-overlay"></div>

    <!-- 透明主导航栏 -->
    <el-header class="main-header">
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
          <el-image :src="auctionItem.image" alt="拍品图片" fit="contain" class="item-image" />
        </el-col>
        <!-- 右侧：拍品信息 -->
        <el-col :span="18" class="auction-item-right">
          <h2 class="item-title">{{ auctionItem.title }}</h2>
          <p><strong>距开始：</strong>{{ auctionItem.date }}</p>
          <p><strong>起拍价：</strong> <span class="price">{{ auctionItem.price }}</span></p>
          <p><strong>当前竞拍最高价：</strong> <span class="price">{{ auctionItem.highestBid || '暂无竞拍' }}</span></p>

          <div class="buttons">
            <el-input v-model="bidAmount" placeholder="输入竞拍金额" style="width: 150px; margin-right: 10px;" />
            <el-button type="primary" @click="openBidDialog">参与竞拍</el-button>
          </div>
          <p v-if="bidError" class="error-message">{{ bidError }}</p>
        </el-col>
      </el-row>

      <el-dialog v-model="isBidDialogVisible" title="身份验证" width="400px" @close="resetBidDialog">
        <el-form :model="bidForm" ref="bidForm" label-width="100px">
          <el-form-item label="用户名" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
            <el-input v-model="bidForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]">
            <el-input v-model="bidForm.password" type="password" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
            <el-input v-model="bidForm.verificationCode" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-form>

        <template v-slot:footer>
          <el-button @click="isBidDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBidForm">确认</el-button>
        </template>
      </el-dialog>

      <!-- 新增：拍品价值性描述 -->
      <el-row class="value-description">
        <el-col :span="24">
          <h3>拍品价值性</h3>
          <p>{{ auctionItem.valueDescription }}</p>
        </el-col>
      </el-row>

      <!-- 下方：描述信息 -->
      <el-row class="auction-item-info">
        <el-col :span="24">
          <h3>描述：</h3>
          <p><strong></strong><span v-html="auctionItem.description"></span></p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ElButton, ElCol, ElRow, ElImage, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus';

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
      auctionItem: {
        title: '拍品标题示例',
        image: 'src/assets/images/resource/discuss.png',  // 随机图片URL
        price: '',

        date: '',
        valueDescription: '此艺术品由著名艺术家创作，具有的关此艺术品由著名艺术家创作，具有极高的历史文化价值，长期以来一直是拍卖市场的热点。它不仅代表着艺术风格的转变，也是某个历史时期艺术流派的经典之作，因此其估价不断上涨，吸引着全球收藏家的关历史时期艺术流派的经典之作，因此其估价不断上涨，吸引着全球收藏家的关期以来一直是拍卖市场的热点。它不仅代表着艺术风格的转变，也是某个历史时期艺术流派的经典之作，因此其估价不断上涨，吸引着全球收藏家的关注。',
        description: '这是一件非常期以来一直是拍卖市场的热点。它不仅代表着艺术风格的转变，也是某个历史时期艺术流派的经典之作，因此其估价不断上涨，吸引着全球收藏家的关此艺术品由著名艺术家创作，具有极高的历史文化价值，长期以来一直是拍卖市场的热点。它不仅代表着艺术风格的转变，也是某个历史时期艺术流派的经典之作，因此其估价不断上涨，吸引着全球收藏家的关此艺术品由著名艺术家创作，具有极高的历史文化价值，长期以来一直是拍卖市场的热点。它不仅代表着艺术风格的转变，也是某个历史时期艺术流派的经典之作，因此其估价不断上涨，吸引着全球收藏家的关历史时期艺术流派的经典之作，因此其估价不断上涨，吸引着全球收藏家的关',
      },

      bidAmount: '',
      isBidDialogVisible: false, // 控制弹框显示
      bidForm: {
        username: '',
        password: '',
        verificationCode: ''
      },
      bidError: '', // 竞拍价格错误提示
    };
  },
  mounted() {
    // 模拟拍品数据加载
    // const auctionId = this.$route.params.id;  // 获取路由参数中的拍品ID
    // this.fetchAuctionItem(auctionId);
  },
  methods: {
    // 点击“参与竞拍”按钮时打开弹框
    openBidDialog() {
      // 检查竞拍金额是否大于当前最高竞拍价
      if (this.bidAmount < this.auctionItem.highestBid) {
        this.bidError = `竞拍金额低于当前最高价 ${this.auctionItem.highestBid}`;
        return;
      }
      this.isBidDialogVisible = true;
      this.bidError = ''; // 清空错误提示
    },

    // 提交竞拍身份验证表单
    submitBidForm() {
      this.$refs.bidForm.validate((valid) => {
        if (valid) {
          console.log('验证通过，参与竞拍！');
          // 执行竞拍的逻辑，例如向服务器提交竞拍请求
          this.isBidDialogVisible = false; // 关闭弹框
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },
    // 重置弹框表单
    resetBidDialog() {
      this.bidForm = {
        username: '',
        password: '',
        verificationCode: ''
      };
    },
    // 获取拍品数据
    async fetchAuctionItem(id) {
      try {
        const response = await axios.get(`https://example.com/api/auction/${id}`);
        this.auctionItem = response.data;  // 获取拍品数据并存储
      } catch (error) {
        console.error('获取拍品数据失败：', error);
      }
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
</style>
