<template>
  <div class="app">
    <!-- 顶部导航 -->
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
        <el-button type="primary" icon="el-icon-user" @click="goToPage('login')">
          <el-icon><HomeFilled /></el-icon>登出</el-button>
      </div>
    </el-header>

    <!-- 内容区域 -->
    <main class="main-content">
      <!-- 背景图片区域 -->
      <div class="hero">
        <div class="hero-content">
          <h1>PORTFOLIO</h1>
          <p>Portfolio 3 Column Masonry</p>
        </div>
      </div>

      <!-- 网格布局 -->
      <div class="grid">
        <div
          class="grid-item"
          v-for="(item, index) in works"
          :key="index"
          @click="openDialog(item)"
        >
          <img
            :src="
              'http://172.46.225.96:8888/uploads/' +
              encodeURIComponent(item.imagePath)
            "
            :alt="item.title"
            class="grid-image"
          />
          <p>{{ item.title }}</p>
        </div>
      </div>
      
      <!-- 弹框 -->
      <el-dialog
        v-model="dialogVisible"
        title="作品详情"
        width="50%"
        @close="resetSelectedWork"
      >
        <div>
          <h3>作品序号：{{ selectedWork.workId }}</h3>
          <p>作品名字： {{ selectedWork.title }}</p>
          <p>作品描述：{{ selectedWork.description }}</p>
          <p>作品哈希值：{{ selectedWork.workHash }}</p>
          <p>版权编号：{{ selectedWork.digitalCopyrightId }}</p>
          <p>区块哈希值：{{ selectedWork.blockchainHash }}</p>
          <p>交易哈希值：{{ selectedWork.transactionHash }}</p>
          <p>创建时间：{{ selectedWork.createdAt }}</p>
          <p>是否拍卖：{{ selectedWork.isOnAuction }}</p>
          <el-button
            type="primary"
            :disabled="!selectedWork.hasDigitalCopyright"
            @click="onAddListing"
            class="add-listing-btn"
          >
            上架拍品
          </el-button>
          
          <el-button
            type="success"
            :disabled="!selectedWork.hasDigitalCopyright"
            @click="downloadCertificate"
            class="action-btn"
          >
            下载证书
          </el-button>
        
          <el-button
            type="warning"
            :disabled="selectedWork.hasDigitalCopyright"
            @click="applyForCopyright"
            class="apply-copyright-btn"
          >
            申请版权
          </el-button>
        </div>
        <template #footer>
          <el-button type="primary" @click="dialogVisible = false" class="guanbi">关闭</el-button>
        </template>
      </el-dialog>

      <!-- 上传拍品信息弹框 -->
      <el-dialog
        v-model="uploadDialogVisible"
        title="上传拍品信息"
        width="50%"
        @close="resetUploadForm"
      >
        <div>
          <el-form :model="uploadForm" label-width="100px">
            <!-- 竞拍时间范围 -->
            <el-form-item label="竞拍时间">
              <el-date-picker
                v-model="uploadForm.auctionDateRange"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>

            <!-- 竞拍价格 -->
            <el-form-item label="竞拍价格">
              <el-input
                v-model="uploadForm.auctionPrice"
                style="width: 240px"
                placeholder="请输入竞拍价格"
                :formatter="formatter"
                :parser="parser"
              />
            </el-form-item>

            <!-- 上传信息 -->
            <el-form-item label="上传信息">
              <el-input
                v-model="uploadForm.uploadInfo"
                type="textarea"
                placeholder="请输入上传信息"
                rows="4"
              />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="uploadDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitUploadForm">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </main>
  </div>
</template>

<script>
import request from "../utils/reques";

export default {
  name: "App",
  data() {
    return {
      dialogVisible: false,
      uploadDialogVisible: false, // 控制上传弹框的显示
      selectedWork: {}, // 当前选中的作品
      works: [
        // {
        //   title: "作品1",
        //   img: "../assets/img/work1.jpg",
        //   desc: "描述1",
        //   tags: ["标签1", "标签2"],
        // },
      ],
      uploadForm: {
        uploadDate: "",
        uploadInfo: "",
        auctionDateRange: [], // 用于竞拍日期范围
        auctionPrice: "", // 用于竞拍价格
      },
    };
  },
  methods: {
    // 打开作品详情弹框
    openDialog(item) {
      this.selectedWork = { ...item };
      this.dialogVisible = true;
    },
    // 提交上传拍品表单
    submitUploadForm() {
      console.log("表单提交：", this.uploadForm);
      this.uploadDialogVisible = false;
      this.$message.success("拍品信息已成功上传！");
    },
    // 下载证书
    downloadCertificate() {
      if (this.selectedWork.hasDigitalCopyright) {
        this.$message.success("证书已下载！");
      } else {
        this.$message.error("请先申请版权！");
      }
    },
    // 申请版权
    applyForCopyright() {
      this.selectedWork.hasDigitalCopyright = true;
      this.$message.success("版权申请成功！");
    },

    // 格式化竞拍价格
    formatter(value) {
      if (!value) return "";
      return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    // 解析竞拍价格
    parser(value) {
      return value.replace(/\$\s?|(,*)/g, "");
    },

    openDialog(item) {
      this.selectedWork = item;
      this.dialogVisible = true;
    },
    onAddListing() {
      // 打开上传拍品信息弹框
      this.uploadDialogVisible = true;
    },
    submitUploadForm() {
      // 处理提交上传表单的逻辑
      console.log("上传时间:", this.uploadForm.uploadDate);
      console.log("竞拍时间范围:", this.uploadForm.auctionDateRange);
      console.log("竞拍价格:", this.uploadForm.auctionPrice);
      console.log("上传信息:", this.uploadForm.uploadInfo);

      // 关闭弹框
      this.uploadDialogVisible = false;

      // 提示上传成功
      this.$message.success("拍品信息已成功上传！");
    },
    resetUploadForm() {
      // 重置上传表单
      this.uploadForm.uploadDate = "";
      this.uploadForm.uploadInfo = "";
      this.uploadForm.auctionDateRange = [];
      this.uploadForm.auctionPrice = "";
    },
    resetSelectedWork() {
      // 重置选中的作品
      this.selectedWork = {};
    },
    navigateTo(path) {
      console.log("Navigating to:", path);
    },
    handleMenuSelect(key) {
      console.log("Menu selected:", key);
    },
    goToPage(page) {
      console.log("Go to:", page);
    },

    // 检查版权编号并下载证书
    async downloadCertificate() {
      if (this.selectedWork.hasDigitalCopyright) {
        await request({
          method: 'POST',
          url: '/download-certificate', 
          data: { workId: this.selectedWork.workId },
        });
        this.$message.success('证书下载成功！');
      } else {
        this.$message.error("该作品没有版权编号，无法下载证书！");
      }
    },

    // 获取用户的全部作品
    async getUserWorks() {
      const userEmail = localStorage.getItem("email");
      console.log("getUserWorks 被调用，用户邮箱:", userEmail); // 确认是否调用

      if (!userEmail) {
        this.$message.error("未找到用户邮箱");
        return;
      }

      try {
        console.log("正在请求作品数据++++=...");
        const response = await request.get("/work/userWorksAll", {
          params: { email: userEmail },
        });

        // 打印响应数据
        console.log("请求成功，作品数据：", response.data);

        // 假设返回的数据是用户的作品列表
        this.works = response.data.data; // 确保你的返回数据格式是正确的
      } catch (error) {
        this.$message.error("获取作品失败: " + error.message);
        console.error("请求失败:", error);
      }
    },
    // 在组件加载时调用获取用户作品的方法
    created() {
      console.log("组件 created 钩子触发");
      try {
        this.getUserWorks();
      } catch (error) {
        console.error("调用 getUserWorks 时出错:", error);
      }
    },
  },
  // 在组件加载时调用获取用户作品的方法
created() {
  console.log("组件 created 钩子触发");
  try {
    this.getUserWorks();
  } catch (error) {
    console.error("调用 getUserWorks 时出错:", error);
  }
},
};

</script>

<style scoped>
/* 样式部分保持不变 */
</style>


  <style scoped>
.add-listing-btn {
  margin-bottom: -46px;
  margin-top: 150px;
}

/* 全局布局 */
.app {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 顶部导航 */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 50px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background: rgba(255, 255, 255, 1);
  z-index: 1000;
  box-sizing: border-box;
  transition: background-color 0.3s ease-in-out;
}

.el-menu-demo {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  overflow: hidden;
  white-space: nowrap;
  flex-grow: 1;
  margin-left: 50px;
}

.nav-item:hover {
  transform: scale(1.1);
  color: #ff6347;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.language-switch:hover {
  color: #ff6347;
}

/* hero 背景图片区域 */
.hero {
  width: 100vw;
  height: 100vh;
  background: url("../assets/images/resource/service-4.png") no-repeat center
    center;
  aspect-ratio: 16 / 9;
  position: relative;
  padding-top: 60px;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

/* 网格布局 */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-left: 50px;
  padding: 20px;
}
.grid-image {
  width: 100%;
  border-radius: 10px;
}

.grid-item {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  width: 20vw;
  height: 22vw;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.grid-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.action-btn {
  margin-top: 193.6px;
  width: 150px; /* 按钮宽度 */
}

/* 将弹框底部按钮居中 */
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px; /* 按钮之间的间距 */
  width: 100%;
  padding: 10px 0;
}

/* 美化弹框 */
.el-dialog__wrapper {
  border-radius: 10px; /* 弹框圆角 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* 弹框阴影 */
  background: #f9f9f9; /* 弹框背景颜色 */
}

.el-dialog__header {
  background-color: #4caf50; /* 标题栏背景色 */
  color: white; /* 标题文字颜色 */
  font-size: 20px; /* 标题文字大小 */
  font-weight: bold; /* 标题加粗 */
  padding: 20px; /* 标题栏内边距 */
  border-radius: 10px 10px 0 0; /* 圆角效果 */
}

.el-dialog__body {
  padding: 20px; /* 弹框内容区内边距 */
  color: #333; /* 内容文字颜色 */
}

.el-dialog__body p {
  margin: 10px 0;
  font-size: 16px;
  line-height: 1.6;
}

.el-dialog__footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
  background-color: #f4f4f4; /* 底部区域背景 */
  border-radius: 0 0 10px 10px; /* 弹框底部圆角 */
}

/* 按钮样式 */
.el-button {
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.el-button:hover {
  transform: scale(1.05);
}

/* 确定按钮的颜色 */
.el-button--primary {
  background-color: #4caf50;
  color: white;
}

.el-button--primary:hover {
  background-color: #45a049; /* 鼠标悬停时变暗 */
}

/* 下载证书按钮的样式 */
.el-button--success {
  background-color: #009688;
  color: white;
}

.el-button--success:hover {
  background-color: #00796b;
}

/* 弹框关闭按钮 */
.el-dialog__header .el-button--close {
  color: white;
}

/* 调整输入框和选择框 */
.el-form-item {
  margin-bottom: 20px;
}

.el-input,
.el-date-picker,
.el-select {
  font-size: 16px;
  border-radius: 5px;
}

.el-input__inner {
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #fff;
  transition: border 0.3s ease;
}

.el-input__inner:focus {
  border-color: #4caf50;
}

/* 作品详情显示项 */
h3 {
  font-size: 18px;
  color: #4caf50;
  font-weight: bold;
}

p {
  font-size: 16px;
  margin: 10px 0;
  color: #333;
}

.apply-copyright-btn{
  margin-top: 193.6px;
  width: 150px; /* 按钮宽度 */
}

.guanbi{
  margin-top: -90.2px;
  width: 150px; /* 按钮宽度 */
}
</style>
  