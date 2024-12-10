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
          <el-icon>
            <HomeFilled />
          </el-icon>登出</el-button>
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
        <div class="grid-item" v-for="(item, index) in works" :key="index" @click="openDialog(item)">
          <img :src="'http://172.46.225.96:8888/uploads/' +
            encodeURIComponent(item.imagePath)
            " :alt="item.title" class="grid-image" />
          <p>{{ item.title }}</p>
        </div>
      </div>

      <!-- 作品详情弹框 -->
      <el-dialog v-model="dialogVisible" title="作品详情" width="50%" @close="resetSelectedWork">
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

          <!-- 上架拍品按钮，只有有版权时可用 -->
          <el-button type="primary" :disabled="!selectedWork.hasDigitalCopyright || selectedWork.isOnAuction"
            @click="onAddListing" class="add-listing-btn">
            {{ selectedWork.isOnAuction ? '拍卖中' : '上架拍品' }}
          </el-button>
          <!-- 下载证书按钮，只有有版权时可用 -->
          <el-button type="success" :disabled="!selectedWork.digitalCopyrightId" @click="downloadCertificate"
            class="action-btn">
            下载证书
          </el-button>

          <!-- 版权申请按钮，只有没有版权时可用 -->
          <el-button type="warning" :disabled="selectedWork.digitalCopyrightId" @click="applyForCopyright"
            class="apply-copyright-btn">
            申请版权
          </el-button>
        </div>

        <template #footer>
          <el-button type="primary" @click="dialogVisible = false" class="guanbi">关闭</el-button>
        </template>
      </el-dialog>


      <!-- 身份验证弹框 -->
      <el-dialog v-model="authDialogVisible" title="身份验证" width="50%" @close="resetAuthForm">
        <div class="aaa">
          <el-upload class="upload-demo" drag :auto-upload="false" multiple :before-upload="handleBeforeUpload"
            @change="handleFileChange">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              请上传私钥文件 <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                files with a size less than 500kb
              </div>
            </template>
          </el-upload>

          <el-form :model="authForm" label-width="100px">
            <el-form-item label="私钥密码">
              <el-input v-model="authForm.code" type="password" show-password placeholder="请输入私钥加密密码" />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="authDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="verifyIdentity">验证</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 上传拍品信息弹框 -->
      <el-dialog v-model="uploadDialogVisible" title="上传拍品信息" width="50%" @close="resetUploadForm">
        <div>
          <el-form :model="uploadForm" label-width="100px">
            <!-- 竞拍时间范围 -->
            <el-form-item label="竞拍时间">
              <el-date-picker v-model="uploadForm.auctionDateRange" type="daterange" start-placeholder="开始日期"
                end-placeholder="结束日期" />
            </el-form-item>

            <!-- 竞拍价格 -->
            <el-form-item label="竞拍价格">
              <el-input v-model="uploadForm.auctionPrice" style="width: 240px" placeholder="请输入竞拍价格"
                :formatter="formatter" :parser="parser" />
            </el-form-item>

            <!-- 上传信息 -->
            <el-form-item label="上传信息">
              <el-input v-model="uploadForm.uploadInfo" type="textarea" placeholder="请输入上传信息" rows="4" />
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
      authDialogVisible: false,  // 控制身份验证弹框的显示
      selectedWork: {}, // 当前选中的作品
      isOnAuction: false, // Set this to true when the work is on auction
      works: [],
      authForm: {
        code: "", // 私钥密码
      },
      file: null, // 保存上传的私钥文件
      uploadForm: {
        uploadDate: "",
        uploadInfo: "",
        auctionDateRange: [], // 用于竞拍日期范围
        auctionPrice: "", // 用于竞拍价格
      },
      authRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱格式',
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
  methods: {

    // 处理文件上传
    handleBeforeUpload(file) {
      // 这里可以进行文件大小等检查
      const isValidSize = file.size < 500 * 1024; // 500KB
      if (!isValidSize) {
        this.$message.error("文件大小不得超过 500KB");
      }
      return isValidSize; // 返回 true 允许上传，false 不允许上传
    },

    handleFileChange(file) {
      this.file = file.raw;  // 保存上传的文件
    },




    handlePreview(file) {
      console.log(file);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    beforeRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleExceed(files, fileList) {
      console.log(files, fileList);
    },

    verifyIdentity() {
  if (!this.file) {
    this.$message.error("请上传私钥文件");
    return;
  }
  if (!this.authForm.code) {
    this.$message.error("请输入私钥加密密码");
    return;
  }
  if (!localStorage.getItem("email")) {
    this.$message.error("请输入邮箱");
    return;
  }

  const formData = new FormData();
  formData.append("file", this.file);
  formData.append("email", localStorage.getItem("email"));  // 获取邮箱
  formData.append("password", this.authForm.code);

  request
    .post("/keystore/uploadKeystore", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      const data = response.data;
      if (data.code === 0) {
        this.$message.success(data.msg);
        localStorage.setItem("privateKey",data.privateKey)

        // 关闭对话框
        this.authDialogVisible = false;
        this.uploadDialogVisible = true;
      } else {
        this.$message.error(data.msg);
      }
    })
    .catch((error) => {
      console.error(error);
      this.$message.error("验证失败，请重试");
    });
},

    // 打开作品详情弹框
    openDialog(item) {
      this.selectedWork = { ...item };
      this.dialogVisible = true;
    },

    onAddListing() {
      // 先弹身份验证框
      this.authDialogVisible = true;

      // 在上传拍品时，先清空邮箱和密码字段
      this.authForm.email = '';
      this.authForm.password = '';

      // 如果您想重置整个表单，包括字段和验证状态，可以使用 resetFields 方法
      this.$refs.authForm.resetFields();

      // 显示消息（可以根据需要移除）
      this.$message.success('已重置邮箱和密码，准备上传拍品');

      // 在这里添加上传拍品的逻辑

    },
    // 提交上传拍品表单
    submitUploadForm() {
      console.log("表单提交：", this.uploadForm);
      this.uploadDialogVisible = false;
      this.$message.success("拍品信息已成功上传！");
    },


    resetAuthForm() {
      this.authForm.code = "";
    },
    resetSelectedWork() {
      this.selectedWork = {};
    },
    // 下载证书
    downloadCertificate() {
      if (this.selectedWork.digitalCopyrightId) {
        this.$message.success("证书已下载！");
      } else {
        this.$message.error("请先申请版权！");
      }
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

      // 显示加载提示，使用 this.$loading 而不是 this.$message.loading
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

      this.authDialogVisible = true;
      this.$nextTick(() => {
        console.log("弹框显示了");
      });
    },

    // 提交上传表单并发起拍卖请求
async submitUploadForm() {
  const { auctionDateRange, auctionPrice } = this.uploadForm;

  // 校验拍卖时间范围
  if (!auctionDateRange || auctionDateRange.length !== 2) {
    this.$message.error("请正确选择竞拍时间范围");
    return;
  }

  // 校验竞拍价格
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

    // 清除本地存储的私钥
    localStorage.removeItem("privateKey");
  }
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
  background: url("../assets/images/resource/service-4.png") no-repeat center center;
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
  width: 150px;
  /* 按钮宽度 */
}

/* 将弹框底部按钮居中 */
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  /* 按钮之间的间距 */
  width: 100%;
  padding: 10px 0;
}

/* 美化弹框 */
.el-dialog__wrapper {
  border-radius: 10px;
  /* 弹框圆角 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  /* 弹框阴影 */
  background: #f9f9f9;
  /* 弹框背景颜色 */
}

.el-dialog__header {
  background-color: #4caf50;
  /* 标题栏背景色 */
  color: white;
  /* 标题文字颜色 */
  font-size: 20px;
  /* 标题文字大小 */
  font-weight: bold;
  /* 标题加粗 */
  padding: 20px;
  /* 标题栏内边距 */
  border-radius: 10px 10px 0 0;
  /* 圆角效果 */
}

.el-dialog__body {
  padding: 20px;
  /* 弹框内容区内边距 */
  color: #333;
  /* 内容文字颜色 */
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
  /* 底部区域背景 */
  border-radius: 0 0 10px 10px;
  /* 弹框底部圆角 */
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
  background-color: #45a049;
  /* 鼠标悬停时变暗 */
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

.apply-copyright-btn {
  margin-top: 193.6px;
  width: 150px;
  /* 按钮宽度 */
}

.guanbi {
  margin-top: -90.2px;
  width: 150px;
  /* 按钮宽度 */
}

.aaa {
  width: 720px;
}
</style>