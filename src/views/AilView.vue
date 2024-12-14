<template>
  <div class="chat-wrapper">
    <!-- 添加聊天标题 -->
    <div class="chat-header">Chat with AI</div>

    <div class="chat-container">
      <Navbar />
      <div class="chat-messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['chat-message', message.from === 'user' ? 'chat-right' : 'chat-left']"
        >
          <span>{{ message.text }}</span>
        </div>
      </div>

      <!-- 输入框和按钮 -->
      <div class="chat-input-container">
        <div class="chat-input-wrapper">
           <el-input
            v-model="newMessage"
            placeholder="请输入消息..."
            @keyup.enter="sendMessage"
            class="chat-input"
          />
          <el-button type="primary" @click="sendMessage" class="send-button">
            发送
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      newMessage: "",
      messages: [
        { from: "assistant", text: "你好！有什么可以帮你的吗？ 😊" },
      ],
    };
  },
  methods: {
    async sendMessage() {
      if (this.newMessage.trim() === "") return;

      // 添加用户消息
      this.messages.push({ from: "user", text: this.newMessage });

      try {
        // 模拟发送请求并获取响应
        const response = await axios.post("https://api.example.com/chat", {
          message: this.newMessage,
        });
        // 假设返回的响应格式为 { text: "response message" }
        this.messages.push({ from: "assistant", text: response.data.text });
      } catch (error) {
        this.messages.push({
          from: "assistant",
          text: "抱歉，我没能理解您的问题。",
        });
      }

      this.newMessage = "";
    },
  },
};
</script>

<style scoped>
/* 聊天页面的整体布局 */
.chat-wrapper {
  position: relative;
  margin-top: 90px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
  padding: 10px;
  box-sizing: border-box;
}

/* 聊天标题样式 */
.chat-header {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #e6f7ff; /* 设置背景色 */
  border-radius: 8px; /* 圆角样式 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

/* 聊天容器样式 */
.chat-container {
  position: relative;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
}

/* 消息区域样式 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
}

/* 消息内容样式 */
.chat-message {
  max-width: 100%; /* 消息宽度 */
  margin: 10px 0; /* 消息间距 */
  font-size: 16px; /* 字体大小 */
  line-height: 1.5; /* 行高 */
  word-wrap: break-word; /* 防止文字溢出 */
}

/* 左侧消息样式 */
.chat-left {
  text-align: left;
  align-self: flex-start;
}

/* 右侧消息样式 */
.chat-right {
  text-align: right;
  align-self: flex-end;
}

/* 输入框容器样式 */
.chat-input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

/* 输入框和按钮的包装容器 */
.chat-input-wrapper {
  display: flex;
  align-items: center;
  width: 50%;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 增加阴影 */
  border: 1px solid #dcdcdc; /* 添加边框 */
}

/* 输入框样式 */
.chat-input {
  flex: 1;
  height: 50px; /* 调整高度 */
  font-size: 16px; /* 字体大小 */
  border: none; /* 隐藏边框 */
  
  box-shadow: none; /* 移除阴影 */
  background-color: transparent; /* 设置背景透明，与容器一致 */
}


/* 按钮样式 */
.send-button {
  height: 50px;
  font-size: 16px;
  border-radius: 0; /* 让按钮与输入框融为一体 */
}
</style>
