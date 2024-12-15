<template>
  <el-header class="main-header">
    <!-- 图片放置在导航栏左侧 -->
    <div class="logo-container">
      <img src="@/assets/images/logo.png" alt="Logo" class="logo-image" />
    </div>
    <el-menu mode="horizontal" class="el-menu-demo">
      <el-menu-item index="home" class="nav-item">
        <router-link to="/home">首页</router-link>
      </el-menu-item>
      <el-menu-item index="case-studio" class="nav-item">
        <router-link to="/WorkView">我的作品</router-link>
      </el-menu-item>
      <el-menu-item index="blog" class="nav-item">
        <router-link to="/AilView">艺溯智AI</router-link>
      </el-menu-item>
      <el-menu-item index="contact" class="nav-item">
        <router-link to="/AuctionView">拍卖市场</router-link>
      </el-menu-item>
      <el-menu-item index="blockH" class="nav-item">
        <router-link to="/BlockHashView">链上溯源</router-link>
      </el-menu-item>
    </el-menu>


    <!-- 用户头像及信息弹框 -->
    <el-popover placement="bottom" width="200" trigger="hover">
      <template #reference>
        <div class="avatar-container">
          <router-link to="/userInfoView"><el-avatar :size="50" :src="circleUrl" class="touxiang" /></router-link>
        </div>
      </template>
      <div class="user-info">
        <p><strong>邮箱：</strong>{{ userName }}</p>
        <p><strong>状态：</strong>{{ userStatus }}</p>
        <el-button type="danger" size="small" @click="outlogin">👉退出登录</el-button>
      </div>

    </el-popover>
  </el-header>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  name: "Navbar",
  setup() {
    const state = reactive({
      circleUrl: 'src/assets/images/resource/tx.jpg',
      userName: localStorage.getItem('email') || '未知用户',
      userStatus: '正常',
      activeStep: 4,
    });

    const outlogin = () => {
      localStorage.clear();
      window.location.href = '/login';
    };

    return { ...toRefs(state), outlogin };
  },


  methods: {
    goToPage(page) {
      this.$router.push({ path: `/${page}` });
    },
    outlogin() {
      // 使用 Element Plus 的 MessageBox 来替代 window.confirm
      this.$msgbox({
        title: "确认退出",
        message: "您确定要退出登录吗？",
        showCancelButton: true, // 显示取消按钮
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning", // 弹框的样式
      })
        .then(() => {
          // 点击确认时执行
          localStorage.clear();
          this.$router.push("/").catch((err) => {
            console.error("Redirect failed:", err);
          });
        })
        .catch(() => {
          // 点击取消时执行的操作
          console.log("取消退出");
        });
    },
  },

};
</script>

<style scoped>
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
  font-size: 17px;
  transition: transform 0.3s ease-in-out;
}



.language-switch {
  font-weight: bold;
}

.logo-container {
  margin-right: -80px;
  width: 10%;
}

.logo-image {
  width: 250%;
  position: relative;
  left: -100%;
  top: 30px;
}

/* 信息框样式 */
.user-info {
  text-align: center;
  font-size: 14px;
  color: #333;
  line-height: 1.8;
}

.user-info p {
  margin: 5px 0;
}

.avatar-container {
  display: inline-block;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.avatar-container:hover {
  transform: scale(1.2);
  /* 鼠标悬停时放大 */
}

.touxiang {
  margin-top: 5px;
  border: 2px solid #409eff;
  border-radius: 50%;
}

.upload-demo {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #f5f5f5;
  padding: 20px;
  cursor: pointer;
}

.el-dialog {
  width: 400px;
}
</style>