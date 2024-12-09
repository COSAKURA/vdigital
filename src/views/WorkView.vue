<template>
  <div class="app">
    <Navbar />
    <!-- 内容区域 -->
    <main class="main-content">
      <!-- 背景图片区域 -->
      <div class="hero">
        <div class="hero-content">
          <h1>作品中心</h1>
          <p>Portfolio 3 Column Masonry</p>
        </div>
      </div>

      <!-- 网格布局 -->
      <div class="grid">
        <div v-for="(item, index) in works" :key="index" class="grid-item" @click="openDialog(item)">
          <img :src="`http://172.46.225.96:8888/uploads/${encodeURIComponent(item.imagePath)}`" :alt="item.title"
            class="grid-image" />
          <p>{{ item.title }}</p>
        </div>
      </div>

      <!-- 作品详情弹框 -->
      <el-dialog v-model="dialogVisible" title="作品详情" width="50%" @close="resetSelectedWork">
        <div>
          <p><strong>作品序号：</strong>{{ selectedWork.workId }}</p>
          <p><strong>作品名字：</strong>{{ selectedWork.title }}</p>
          <p><strong>作品描述：</strong>{{ selectedWork.description }}</p>
          <p><strong>作品哈希值：</strong>{{ selectedWork.workHash }}</p>
          <p><strong>版权编号：</strong>{{ selectedWork.digitalCopyrightId }}</p>
          <p><strong>区块哈希值：</strong>{{ selectedWork.blockchainHash }}</p>
          <p><strong>交易哈希值：</strong>{{ selectedWork.transactionHash }}</p>
          <p><strong>创建时间：</strong>{{ selectedWork.createdAt }}</p>
          <p><strong>是否拍卖：</strong>{{ selectedWork.isOnAuction }}</p>

          <!-- 动作按钮 -->
          <div class="action-buttons">
            <el-button type="primary" :disabled="!selectedWork.hasDigitalCopyright || selectedWork.isOnAuction"
              @click="onAddListing">
              {{ selectedWork.isOnAuction ? '拍卖中' : '上架拍品' }}
            </el-button>
            <el-button type="success" :disabled="!selectedWork.digitalCopyrightId" @click="downloadCertificate">
              下载证书
            </el-button>
            <el-button type="warning" :disabled="selectedWork.digitalCopyrightId" @click="applyForCopyright">
              申请版权
            </el-button>
          </div>
        </div>
        <template #footer>
          <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>

      <!-- 上传拍品信息弹框 -->
      <el-dialog v-model="uploadDialogVisible" title="上传拍品信息" width="50%" @close="resetUploadForm">
        <el-form :model="uploadForm" label-width="100px">
          <el-form-item label="竞拍时间">
            <el-date-picker v-model="uploadForm.auctionDateRange" type="daterange" start-placeholder="开始日期"
              end-placeholder="结束日期" />
          </el-form-item>
          <el-form-item label="竞拍价格">
            <el-input v-model="uploadForm.auctionPrice" placeholder="请输入竞拍价格" :formatter="formatter" :parser="parser" />
          </el-form-item>
          <el-form-item label="上传信息">
            <el-input v-model="uploadForm.uploadInfo" type="textarea" placeholder="请输入上传信息" rows="4" />
          </el-form-item>
        </el-form>
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
import Navbar from "@/components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      dialogVisible: false,
      uploadDialogVisible: false, // 控制上传弹框的显示
      selectedWork: {}, // 当前选中的作品
      works: [],
      menuItems: [
        { label: "首页", path: "/home", index: "home" },
        { label: "关于我们", path: "/about", index: "about" },
        { label: "服务内容", path: "/services", index: "services" },
        { label: "我的作品", path: "/WorkView", index: "case-studio" },
        { label: "侵权监测", path: "/blog", index: "blog" },
        { label: "拍卖市场", path: "/AuctionView", index: "contact" },
      ],
      uploadForm: {
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


    resetSelectedWork() {
      this.selectedWork = {};
    },


    // 申请版权
    applyForCopyright() {
      if (this.selectedWork.digitalCopyrightId) {
        this.$message.info("该作品已拥有数字版权，无法重复申请！");
        return;  // 如果作品已有版权，不发送请求
      }

      // 从本地存储获取用户邮箱
      const userEmail = localStorage.getItem("email");
      if (!userEmail) {
        this.$message.error("未找到用户邮箱，请先登录！");
        return;
      }

      // 显示加载提示，使用 this.$loading
      const loadingInstance = this.$loading({
        lock: true,
        text: "正在申请版权...",
        spinner: "el-icon-loading", // 可以自定义加载图标
        background: "rgba(0, 0, 0, 0.7)" // 背景色
      });

      // 请求参数
      const params = {
        email: userEmail,              // 用户邮箱
        workId: this.selectedWork.workId // 作品ID
      };

      // 发起请求
      request.post('/work/applyCopyright', null, { params })  // 通过 `params` 发送查询参数
        .then(response => {
          // 如果请求成功
          this.selectedWork.hasDigitalCopyright = true;  // 更新作品状态
          this.$message.success("版权申请成功，版权已自动上链！");
        })
        .catch(error => {
          // 如果请求失败
          console.error("申请版权失败:", error);
          this.$message.error("申请版权失败，请稍后再试！");
        })
        .finally(() => {
          // 不管请求成功或失败，关闭加载提示
          loadingInstance.close();
        });
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
      this.selectedWork = { ...item };
      this.dialogVisible = true;
      // 确保每个作品的版权信息加载正确
      this.selectedWork.hasDigitalCopyright = item.digitalCopyrightId
        ? true
        : false;
    },

    onAddListing() {
      this.uploadDialogVisible = true;
    },

    // 发起拍卖请求
    async submitUploadForm() {
      const { auctionDateRange, auctionPrice } = this.uploadForm;

      if (!auctionDateRange || auctionDateRange.length !== 2) {
        this.$message.error("请正确选择竞拍时间范围");
        return;
      }

      if (!auctionPrice || isNaN(auctionPrice) || auctionPrice <= 0) {
        this.$message.error("请输入有效的竞拍价格");
        return;
      }

      // 获取用户邮箱（假设已保存到 localStorage）
      const userEmail = localStorage.getItem("email");
      if (!userEmail) {
        this.$message.error("未找到用户邮箱，请先登录！");
        return;
      }

      // 获取作品ID
      const workId = this.selectedWork.workId;

      // 设置拍卖持续时间（单位：秒），基于选择的日期范围
      const auctionDuration = (new Date(auctionDateRange[1]).getTime() - new Date(auctionDateRange[0]).getTime()) / 1000;

      // 假设用户已经选择了一个私钥
      const privateKey = localStorage.getItem("privateKey");
      if (!privateKey) {
        this.$message.error("未找到私钥，请先设置私钥！");
        return;
      }

      // 发送请求到后端，开始拍卖
      try {
        const response = await request.post("/auctions/startAuction", null, {
          params: {
            email: userEmail,
            workId: workId,
            startPrice: auctionPrice,
            duration: auctionDuration,
            privateKey: privateKey,
          },
        });
        // 处理返回的响应
        if (response.data.code === 0) {
          this.$message.success("拍卖成功，作品已上链");
        } else {
          this.$message.error("拍卖失败: " + response.data.message);
        }
      } catch (error) {
        console.error("发起拍卖请求失败:", error);
        this.$message.error("拍卖请求失败，请稍后再试！");
      } finally {
        // 关闭上传表单弹框
        this.uploadDialogVisible = false;
      }
    },
    // 重置上传表单
    resetUploadForm() {
      this.uploadForm.uploadDate = "";
      this.uploadForm.uploadInfo = "";
      this.uploadForm.auctionDateRange = [];
      this.uploadForm.auctionPrice = "";
    },

    resetSelectedWork() {
      // 重置选中的作品
      this.selectedWork = {};
    },

    handleMenuSelect(key) {
      console.log("Menu selected:", key);
    },
    goToPage(page) {
      console.log("Go to:", page);
    },

    // 检查版权编号并下载证书
    async downloadCertificate() {
      if (!this.selectedWork.digitalCopyrightId) {
        this.$message.error("该作品没有版权编号，请先申请版权！");
        return; // 提前退出，避免后续的下载操作
      }

      try {
        const response = await request({
          method: "GET",
          url: "/certificate/download",
          params: { workId: this.selectedWork.workId },
          responseType: "arraybuffer",
        });

        if (!response.data || response.data.byteLength === 0) {
          this.$message.error("下载失败，文件为空或损坏！");
          return;
        }

        const blob = new Blob([response.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${this.selectedWork.title}.pdf`;
        link.click();

        this.$message.success("证书下载成功！");
      } catch (error) {
        console.error("下载证书失败:", error);
        this.$message.error("证书下载失败！");
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
  },
  // 在组件加载时调用获取用户作品的方法
  created() {
    try {
      this.getUserWorks();
    } catch (error) {
      console.error("调用 getUserWorks 时出错:", error);
    }
  },
};
</script>

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
  width: 100%;
  background: #fff;
  z-index: 1000;
  transition: background-color 0.3s ease-in-out;
}

.el-menu-demo {
  display: flex;
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
  margin-left: 200px;
  width: 70%;
  height: 100vh;
  background: url("../assets/images/resource/service-4.png") no-repeat center center;
  background-size: cover;
  position: relative;
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

.grid-item {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.grid-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 优化图片样式，防止溢出 */
.grid-image {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.grid-image:hover {
  transform: scale(1.05);
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px 0;
}

/* 美化弹框 */
.el-dialog__wrapper {
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: #f9f9f9;
}

.el-dialog__header {
  background-color: #4caf50;
  color: white;
  font-size: 20px;
  font-weight: bold;
  padding: 20px;
  border-radius: 10px 10px 0 0;
}

.el-dialog__body {
  padding: 20px;
  color: #333;
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
  background-color: #f4f4f4;
  border-radius: 0 0 10px 10px;
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

.el-button--primary {
  background-color: #4caf50;
  color: white;
}

.el-button--primary:hover {
  background-color: #45a049;
}

.el-button--success {
  background-color: #009688;
  color: white;
}

.el-button--success:hover {
  background-color: #00796b;
}

/* 调整输入框和选择框 */
.el-form-item {
  margin-bottom: 20px;
}

.el-input__inner {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
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

.main-content {
  margin-top: 50px;
}


.logo-container {
  margin-right: -80px;
  width: 10%;
}

.logo-image {
  width: 80%;
}
</style>