<template>
    <Navbar />
    <el-container class="user-container">
      <!-- 左侧部分 -->
      <el-aside width="300px" class="user-aside">
        <div class="profile">
          <!-- 圆形大头像 -->
          <div class="profile-image" :style="{ backgroundImage: `url(${user.avatar})` }"></div>
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
        </div>
      </el-aside>
    
      <!-- 右侧部分 -->
      <el-main class="card-container">
        <el-card class="user-info">
          <h4>个人信息</h4>
          <el-divider />
          <p><strong>姓名：</strong> {{ user.name }}</p>
          <p><strong>邮箱：</strong> {{ user.email }}</p>
          <p><strong>手机号：</strong> {{ user.phone }}</p>
          <p><strong>公司：</strong> {{ user.company }}</p>
          <p><strong>职位：</strong> {{ user.title }}</p>
    
          <el-divider />
          <el-button type="success" @click="showDialog">注册区块链</el-button>
        </el-card>
      </el-main>
    
      <!-- 注册区块链弹框 -->
      <el-dialog title="注册区块链账户" :visible.sync="dialogVisible" width="50%">
        <p>欢迎注册您的区块链账户！</p>
        <el-form label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="registerForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请确认密码" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="registerBlockchain">注册</el-button>
        </div>
      </el-dialog>
    </el-container>
  </template>
  
  <script>
  import { reactive, ref, onMounted } from "vue";
  import axios from "axios";
  import Navbar from "@/components/Navbar.vue";
  
  export default {
    name: "UserProfile",
    components: {
      Navbar,
    },
    setup() {
      const user = reactive({
        avatar: "src/assets/images/resource/service-2.png", // 替换为更大的图片链接
        name: "张三",
        email: "zhangsan@example.com",
        phone: "1008610086",
        company: "上海无距", 
        title: "经理",
      });
  
      const dialogVisible = ref(false);
      const registerForm = reactive({
        username: "",
        password: "",
        confirmPassword: "",
      });
  
      const fetchUser = async () => {
        try {
          const response = await axios.get("http://localhost:3000/api/user");
          Object.assign(user, response.data);
        } catch (error) {
          console.error("获取用户信息失败：", error);
        }
      };
  
      const showDialog = () => {
        dialogVisible.value = true;
      };
  
      const registerBlockchain = () => {
        if (!registerForm.username || !registerForm.password || !registerForm.confirmPassword) {
          alert("请填写完整信息！");
          return;
        }
        if (registerForm.password !== registerForm.confirmPassword) {
          alert("两次输入的密码不一致！");
          return;
        }
        // 模拟注册成功
        alert(`区块链账户 ${registerForm.username} 注册成功！`);
        dialogVisible.value = false;
      };
  
      onMounted(() => {
        fetchUser();
      });
  
      return { user, dialogVisible, registerForm, showDialog, registerBlockchain };
    },
  };
  </script>
  
  <style scoped>
  .user-container {
    margin-top: -200px;
    margin-left: 150px;
    display: flex;
    flex-direction: row;
  }
  
  .user-aside {
    width: 300px;
    margin-top: 350px;
    padding: 20px;
    text-align: center;
  }
  
  /* 圆形头像样式 */
  .profile-image {
    width: 150px;
    height: 150px;
    background-size: cover;
    background-position: center;
    border-radius: 50%; /* 圆形效果 */
    margin: 0 auto 20px auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .profile h3 {
    margin-top: 10px;
    font-size: 24px;
  }
  
  .profile p {
    margin: 5px 0;
    color: #666;
  }
  
  .card-container {
    margin-top: 250px;
    margin-left: 200px;
  }
  
  .user-info p {
    margin: 25px 0;
    font-size: 16px;
  }
  </style>
  