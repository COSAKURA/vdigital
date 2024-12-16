<template>
    <el-header class="main-header">
      <!-- 图片放置在导航栏左侧 -->
      <div class="logo-container">
        <img src="@/assets/images/logo.png" alt="Logo" class="logo-image" />
      </div>
  
      <!-- 导航菜单 -->
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
  
      <!-- 搜索框 -->
      <el-input
        v-model="searchQuery"
        placeholder="请输入区块哈希/交易哈希进行溯源"
        class="search-bar"
        clearable
      ></el-input>
  
      <!-- 立即溯源按钮 -->
      <el-button
        type="primary"
        class="trace-button"
        @click="traceSource"
      >
        立即溯源
      </el-button>
  
      <!-- 用户头像及信息弹框 -->
      <el-popover placement="bottom" width="200" trigger="hover">
        <template #reference>
          <div class="avatar-container">
            <router-link to="/userInfoView">
              <el-avatar :size="50" :src="circleUrl" class="touxiang" />
            </router-link>
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
  import { reactive, toRefs } from "vue";
  
  export default {
    name: "Navbar",
    setup() {
      const state = reactive({
        circleUrl: "src/assets/images/resource/tx.jpg",
        userName: localStorage.getItem("email") || "未知用户",
        userStatus: "正常",
        searchQuery: "", // 搜索框绑定的输入内容
      });
  
      const outlogin = () => {
        localStorage.clear();
        window.location.href = "/login";
      };
  
      const traceSource = () => {
        if (state.searchQuery.trim()) {
          window.alert(`溯源查询内容：${state.searchQuery}`);
          // 可改为路由跳转
          // this.$router.push({ path: '/traceResult', query: { keyword: state.searchQuery } });
        } else {
          window.alert("请输入溯源内容");
        }
      };
  
      return { ...toRefs(state), outlogin, traceSource };
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
  
  .search-bar {
 
    border: 1px solid black;
    height: 38px;
    width: 500px;
    margin-right: 5px;
  }
  
  .trace-button {
    margin-right: 200px;
    height: 38px;
    line-height: 38px;
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
  }
  
  .touxiang {
    margin-top: 5px;
    border: 2px solid #409eff;
    border-radius: 50%;
  }
  
  .el-dialog {
    width: 400px;
  }
  </style>
  