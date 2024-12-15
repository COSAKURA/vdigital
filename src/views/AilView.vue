<template>
  <div class="chat-wrapper">
    <!-- 添加聊天标题 -->
    <div class="chat-header">Chat with AI</div>

    <div class="chat-container">
      <Navbar />
      <div class="chat-messages" ref="chatMessages">
        <!-- 循环显示消息 -->
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['chat-message-container', message.from === 'user' ? 'chat-right' : 'chat-left']"
        >
          <div class="chat-message-box">
            <span>{{ message.text }}</span>
          </div>
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
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      newMessage: "",
      messages: [
        { from: "assistant", text: "你好！欢迎使用本地 AI 服务，有什么可以帮您的吗？ 😊" },
      ],
    };
  },
  methods: {
    async sendMessage() {
      if (this.newMessage.trim() === "") return;

      // 添加用户消息
      this.messages.push({ from: "user", text: this.newMessage });

      try {
        const response = await fetch("http://172.46.225.96:11434/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "minicpm-v:latest", // 模型名称
            keep_alive: "5m", // 连接保持时间
            messages: [
              {
                role: "user",
                content: this.newMessage,
                images: [],
              },
            ],
          }),
        });

        // 清空输入框
        this.newMessage = "";

        if (!response.body) {
          throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let assistantMessage = "";
        this.messages.push({ from: "assistant", text: "" });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // 解析流数据
          const chunk = decoder.decode(value, { stream: true });
          try {
            const jsonChunks = chunk
              .split("\n")
              .filter((line) => line.trim() !== "") // 过滤空行
              .map((line) => JSON.parse(line)); // 转换为 JSON

            for (const json of jsonChunks) {
              if (json.message && json.message.content) {
                assistantMessage += json.message.content;

                // 更新对话框中 AI 的回答
                this.messages[this.messages.length - 1].text = assistantMessage;
                this.scrollToBottom(); // 每次更新消息后滚动到底部
              }
            }
          } catch (e) {
            console.error("解析流数据失败：", e, chunk);
          }
        }
      } catch (error) {
        console.error("发送消息失败：", error);
        this.messages.push({
          from: "assistant",
          text: "发送失败，请检查服务器状态或稍后再试。",
        });
      }
      this.scrollToBottom(); // 发送消息后滚动到底部
    },
    scrollToBottom() {
      // 滚动到底部
      this.$nextTick(() => {
        const chatMessages = this.$refs.chatMessages;
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      });
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

/* 消息容器样式 */
.chat-message-container {
  display: flex;
  margin-bottom: 10px;
}

/* 左侧消息（AI） */
.chat-left {
  justify-content: flex-start;
}

/* 右侧消息（用户） */
.chat-right {
  justify-content: flex-end;
}

/* 消息框样式 */
.chat-message-box {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 8px;
  background-color: #e6f7ff; /* 默认背景色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
}

.chat-left .chat-message-box {
  background-color: #f5f5f5; /* AI 消息背景色 */
  color: #333; /* 字体颜色 */
}

.chat-right .chat-message-box {
  background-color: #409eff; /* 用户消息背景色 */
  color: #fff; /* 字体颜色 */
}

/* 消息区域滚动条样式 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 10px;
}

</style>
