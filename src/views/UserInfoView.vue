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
        <h4 class="user">个人信息</h4>
        <el-divider />
        <div class="userinfo">
          <p><strong>用户名：</strong> {{ user.username }}</p>
          <p><strong>邮箱号：</strong> {{ user.email }}</p>
          <p><strong>区块链账号：</strong> {{ user.blockchainAddress }}</p>
          <p><strong>状态：</strong> {{ user.status }}</p>
          <p><strong>创建时间：</strong> {{ user.createdAt }}</p>
        </div>
        <el-divider />
        <el-button class="button" type="success" @click="showDialog" :disabled="!!user.blockchainAddress">
          注册区块链
        </el-button>
        <p v-if="user.blockchainAddress" class="info-text">
          您已注册区块链账户，无法重复注册。
        </p>
      </el-card>
    </el-main>
  </el-container>

  <!-- 注册区块链弹框 -->
  <el-dialog v-model="dialogVisible" width="35%" :close-on-click-modal="false">
    <div class="dialog-header">
      <p>欢迎注册您的区块链账户</p>
      <p class="dialog-subtitle">请输入加密私钥密码以完成注册</p>
    </div>
    <el-form label-width="120px">
      <el-form-item label="加密私钥密码">
        <el-input v-model="registerForm.privateKeyPassword" type="password" placeholder="请输入加密私钥密码" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false" size="medium">取消</el-button>
        <el-button type="primary" size="medium" @click="downloadPrivateKey">确认注册</el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script>
import { reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import Navbar from "@/components/Navbar.vue";
import request from "../utils/reques";

export default {
  name: "UserProfile",
  components: {
    Navbar,
  },
  setup() {
    const user = reactive({
      avatar: "src/assets/images/resource/service-2.png",
      username: "",
      email: "",
      blockchainAddress: "",
      status: "",
      createdAt: "",
    });

    const dialogVisible = ref(false); // 控制弹框的显示与隐藏
    const registerForm = reactive({
      privateKeyPassword: "",
    });

    const showDialog = () => {
      dialogVisible.value = true; // 显示弹框
    };

    const fetchUser = async () => {
      try {
        const email = localStorage.getItem("email");

        if (!email) {
          ElMessage.warning("用户邮箱未找到，请先登录！");
          return;
        }

        const response = await request.get("/user/getUserInfo", {
          params: { email },
        });

        Object.assign(user, response.data.user);
      } catch (error) {
        ElMessage.error("获取用户信息失败，请稍后重试！");
        console.error("获取用户信息失败：", error);
      }
    };

    const downloadPrivateKey = async () => {
      if (!registerForm.privateKeyPassword) {
        ElMessage.warning("请输入加密私钥密码！");
        return;
      }

      try {
        const response = await request.get('/keystore/generateKeystore', {
          params: {
            email: user.email,
            password: registerForm.privateKeyPassword,
          },
          responseType: 'blob', // 确保返回的是文件流
        });

        // 创建文件下载链接
        const blob = new Blob([response.data], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'encrypted-private-key.json'; // 下载的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        ElMessage.success("加密私钥文件已成功下载！");
        dialogVisible.value = false; // 关闭弹框
        await fetchUser(); // 刷新用户信息
      } catch (error) {
        console.error('下载加密私钥失败:', error);
        ElMessage.error("下载加密私钥失败");
      }
    };

    onMounted(() => {
      fetchUser();
    });

    return { user, dialogVisible, registerForm, showDialog, downloadPrivateKey };
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

.profile-image {
  width: 150px;
  height: 150px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
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
  margin-left: 120px;
}

.user-info p {
  margin: 32px 0;
  font-size: 16px;
}

.button[disabled] {
  background-color: #dcdcdc;
  color: #999;
  cursor: not-allowed;
  border-color: #dcdcdc;
}

.user {
  font-size: 25px;
  text-align: center;
}

.userinfo {
  margin-left: 250px;
}

.dialog-header {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  color: #333;
}

.dialog-subtitle {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.info-text {
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}
</style>
