<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['chat-message', message.from === 'user' ? 'chat-right' : 'chat-left']"
      >
        <span>{{ message.text }}</span>
      </div>
    </div>
    <el-input
      v-model="newMessage"
      placeholder="请输入消息..."
      @keyup.enter="sendMessage"
      class="chat-input"
    />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newMessage: '',
      messages: [
        { from: 'assistant', text: '你好！有什么可以帮你的吗？ 😊' },
      ],
    };
  },
  methods: {
    async sendMessage() {
      if (this.newMessage.trim() === '') return;

      // 添加用户消息
      this.messages.push({ from: 'user', text: this.newMessage });

      try {
        // 模拟发送请求并获取响应
        const response = await axios.post('https://api.example.com/chat', {
          message: this.newMessage,
        });
        // 假设返回的响应格式为 { text: "response message" }
        this.messages.push({ from: 'assistant', text: response.data.text });
      } catch (error) {
        this.messages.push({ from: 'assistant', text: '抱歉，我没能理解您的问题。' });
      }

      this.newMessage = '';
    },
  },
};
</script>

<style scoped>
.chat-container {
  position: relative;
  top: 100px;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  margin: 0 auto;
  padding: 10px;
  background-color: #f9f9f9;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
}

.chat-message {
  max-width: 70%;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chat-left {
  text-align: left;
  align-self: flex-start;
  background-color: #e6f7ff;
}

.chat-right {
  text-align: right;
  align-self: flex-end;
  background-color: #d9f7be;
}

.chat-input {
  width: 100%;
}
</style>
