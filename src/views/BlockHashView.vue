<template>
    <div>
        <Navbar />
      <!-- 搜索框和按钮 -->
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="请输入区块编号或交易哈希进行溯源"
          clearable
          class="search-input"
        />
        <el-button type="primary" @click="traceSearch" class="search-button">
          立即溯源
        </el-button>
      </div>
  
      <!-- 模块部分 -->
      <div class="dashboard">
        <div class="section">
          <h3>区块</h3>
          <el-table :data="blocks" border class="custom-table">
            <el-table-column label="时间" prop="time" width="100">
              <template #default="{ row }">
                <span>{{ row.time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="区块编号" prop="blockNumber" width="120">
              <template #default="{ row }">
                <el-link type="primary">{{ row.blockNumber }}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="详情" width="300">
              <template #default="{ row }">
                <div>
                  <p>出块者: {{ row.miner }}</p>
                  <p>{{ row.transactions }} 笔交易 奖励 {{ row.reward }} ETH</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Gas 价格" prop="gasPrice" width="100">
              <template #default="{ row }">
                <span>{{ row.gasPrice }} Gwei</span>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="loadMoreBlocks" class="btn-load">
            查看全部区块
          </el-button>
        </div>
  
        <div class="section">
          <h3>大额交易</h3>
          <el-table :data="transactions" border class="custom-table">
            <el-table-column label="交易编号" prop="txHash" width="250">
              <template #default="{ row }">
                <el-link type="primary">{{ row.txHash }}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="时间" prop="time" width="100">
              <template #default="{ row }">
                <span>{{ row.time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="交易详情" width="300">
              <template #default="{ row }">
                <div>
                  <p>发送方: {{ row.sender }}</p>
                  <p>接收方: {{ row.receiver }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="金额" prop="amount" width="120">
              <template #default="{ row }">
                <span>{{ row.amount }} ETH</span>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="loadMoreTransactions" class="btn-load">
            查看全部交易
          </el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import Navbar from "@/components/Navbar.vue";
  
  export default {
    name: "App",
    components: {
      Navbar,
    },
    setup() {
      const blocks = ref([]);
      const transactions = ref([]);
      const searchQuery = ref(""); // 搜索框内容
  
      const fetchBlocks = async () => {
        try {
          const response = await axios.get("http://localhost:3000/api/blocks");
          blocks.value = response.data;
        } catch (error) {
          console.error("加载区块数据失败：", error);
        }
      };
  
      const fetchTransactions = async () => {
        try {
          const response = await axios.get("http://localhost:3000/api/transactions");
          transactions.value = response.data;
        } catch (error) {
          console.error("加载交易数据失败：", error);
        }
      };
  
      const loadMoreBlocks = () => {
        console.log("加载更多区块数据...");
      };
  
      const loadMoreTransactions = () => {
        console.log("加载更多交易数据...");
      };
  
      // 溯源功能
      const traceSearch = async () => {
        if (!searchQuery.value.trim()) {
          alert("请输入区块编号或交易哈希");
          return;
        }
  
        try {
          const response = await axios.get("http://localhost:3000/api/trace", {
            params: { query: searchQuery.value },
          });
          console.log("溯源结果：", response.data);
          // 处理溯源结果，比如显示在页面上或弹出框
        } catch (error) {
          console.error("溯源请求失败：", error);
          alert("溯源失败，请检查输入内容！");
        }
      };
  
      onMounted(() => {
        fetchBlocks();
        fetchTransactions();
      });
  
      return {
        blocks,
        transactions,
        searchQuery,
        loadMoreBlocks,
        loadMoreTransactions,
        traceSearch,
      };
    },
  };
  </script>
  
  <style scoped>
/* 整体布局 */
.dashboard {
  display: flex;
  justify-content: center; /* 水平方向居中 */
  gap: 20px; /* 两个模块之间的间距 */
  padding: 20px;
}

/* 搜索框容器 */
.search-container {
  
  width: 100%;
  display: flex;
  justify-content: center; /* 居中对齐搜索框和按钮 */
  align-items: center;
  gap: 10px;
  margin-bottom: 20px; /* 与下面模块的间距 */
}

/* 搜索框样式 */
.search-input {
    width: 600px; /* 增加宽度 */
  height: 50px; /* 增加高度 */
  font-size: 16px; /* 调整字体大小 */
}

.search-button {
    height: 48px; /* 与输入框保持一致高度 */
    font-size: 16px; /* 调整按钮字体大小 */
}

/* 模块样式 */
.section {
  flex: 1; /* 两个模块等宽 */
  max-width: 600px; /* 设置模块的最大宽度 */
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 5px;
  padding: 20px;
}

.custom-table {
  margin-bottom: 20px;
}

.btn-load {
  width: 100%;
  text-align: center;
}
</style>
