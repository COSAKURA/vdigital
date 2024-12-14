<template>
    <div class="app-container">
      <!-- 主标题 -->
      <h1 class="main-title">有什么可以帮忙的?</h1>
  
      <!-- 搜索框 -->
      <el-input
        v-model="searchQuery"
        placeholder="给“ChatGPT”发送消息"
        class="search-input"
        clearable
        suffix-icon="el-icon-arrow-right"
        @input="onSearchInput"
      />
  
      <!-- 功能标签 -->
      <div class="tags-container">
        <el-tag
          v-for="(tag, index) in featureTags"
          :key="index"
          type="info"
          size="large"
          effect="dark"
          @click="handleTagClick(tag)"
          class="feature-tag"
        >
          {{ tag.label }}
        </el-tag>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    name: "App",
    setup() {
      // 搜索框内容
      const searchQuery = ref("");
  
      // 功能标签
      const featureTags = ref([
        { label: "解决", action: "resolve" },
        { label: "总结文本", action: "summarize" },
        { label: "分析图片", action: "analyze_image" },
        { label: "代码", action: "code" },
        { label: "更多", action: "more" },
      ]);
  
      // 搜索输入事件
      const onSearchInput = () => {
        console.log("搜索内容：", searchQuery.value);
        // 调用后端 API 或处理输入
      };
  
      // 标签点击事件
      const handleTagClick = (tag) => {
        console.log("点击的功能：", tag.action);
        // 执行对应的操作
      };
  
      return {
        searchQuery,
        featureTags,
        onSearchInput,
        handleTagClick,
      };
    },
  };
  </script>
  
  <style scoped>
  /* 页面布局 */
  .app-container {
    text-align: center;
    padding: 40px 20px;
  }
  
  /* 主标题样式 */
  .main-title {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  /* 搜索框样式 */
  .search-input {
    width: 500px;
    
    display: block;
    font-size: 25px;
  }
  
  /* 功能标签容器 */
  .tags-container {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
  }
  
  /* 功能标签样式 */
  .feature-tag {
    cursor: pointer;
    font-size: 16px;
    padding: 8px 16px;
  }
  </style>
  