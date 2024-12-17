<template>
  <el-container>

    <!-- 导航栏 -->
    <Search />
    <!-- 主内容 -->
    <el-main class="main-content">
      <!-- 卡片和折线图并排 -->
      <el-row :gutter="20" class="content-wrapper">
        <!-- 左侧卡片区域 -->
        <el-col :span="6">
          <div class="card-section">
            <el-card class="card green" shadow="hover">
              <div class="card-content">
                <h2> {{ blockCountData.nodeList.length }} </h2>
                <p> 节点 </p>
              </div>
            </el-card>
            <el-card class="card red" shadow="hover" style="margin-top: 10px;">
              <div class="card-content">
                <h2> {{ blockCountData.failedTxSum }} </h2>
                <p> 交易失败数量 </p>
              </div>
            </el-card>
            <el-card class="card orange" shadow="hover" style="margin-top: 10px;">
              <div class="card-content">
                <h2> {{ blockCountData.blockCount }} </h2>
                <p> 区块数量</p>
              </div>
            </el-card>
            <el-card class="card purple" shadow="hover" style="margin-top: 10px;">
              <div class="card-content">
                <h2> {{ blockCountData.txSum }}</h2>
                <p> 交易数量 </p>
              </div>
            </el-card>
          </div>
        </el-col>

        <!-- 右侧交易折线图 -->
        <el-col :span="18">
          <el-card shadow="always" class="chart-card">
            <h3>关键监控指标</h3>
            <div ref="chartRef" style="width: 100%; height: 370px;"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 节点表格 -->
      <el-card style="margin-top: 20px;" shadow="always">
        <h3>节点信息</h3>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column label="节点 ID">
  <template #default="scope">
    {{ scope.row.id.slice(0, 16) }}...
  </template>
</el-table-column>

          <el-table-column prop="height" label="块高" />
          <el-table-column prop="view" label="PbftView" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag type="success" v-if="scope.row.status === '运行'"> ● 运行 </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 区块和大额交易部分 -->
      <el-row :gutter="20" class="block-transaction">
        <!-- 区块部分 -->
        <el-col :span="12">
  <el-card shadow="hover" class="equal-card">
    <h3>区块</h3>
    <div v-for="block in blockData" :key="block.id" class="block-item">
      <div class="circle">Bk</div>
      <div class="block-content">
        <span class="sender"><p class="block-title">{{ block.blockNumber }}</p></span>
        <p class="block-time">{{ block.timestamp }}</p>
       <p class="block-info">
          哈希 
          <el-tooltip class="item" effect="dark" :content="block.blockHash" placement="top">
          <span class="sender">{{ block.blockHash.slice(0, 20) }}...{{ block.blockHash.slice(-20) }}</span>
        </el-tooltip>
        </p>
      </div>
      <div class="block-transaction">{{ 1 }}</div>
    </div>

    <!-- 区块分页 -->
    <div class="pagination-container">
      <button
        class="pagination-button"
        @click="prevBlockPage"
        :disabled="currentBlockPage <= 1"
      >
        &lt;
      </button>
      <span class="page-info">{{ currentBlockPage }} / {{ blockTotalPages }}</span>
      <button
        class="pagination-button"
        @click="nextBlockPage"
        :disabled="currentBlockPage >= blockTotalPages"
      >
        &gt;
      </button>
    </div>
  </el-card>
</el-col>


        <!-- 大额交易部分 -->
        <el-col :span="12">
  <el-card shadow="hover" class="equal-card">
    <h3>大额交易</h3>
    <div v-for="tx in transactionData" :key="tx.hash" class="tx-item">
      <div class="circle">Tx</div>
      <div class="tx-content">
        <el-tooltip class="item" effect="dark" :content="tx.transactionHash" placement="top">
          <el-link type="primary" @click="goToTransactionDetail(tx.transactionHash)">
            <span class="sender"> {{ tx.transactionHash.slice(0, 9) }}... {{ tx.transactionHash.slice( -9) }}</span>
                </el-link>
        </el-tooltip>
        <p class="tx-info">
          发送方 <span class="sender">{{ tx.from.slice(0, 20) }}...{{ tx.from.slice( -10) }} </span> <br />
          接收方 <span class="sender">{{ tx.to.slice(0, 20) }}...{{ tx.to.slice(-10) }} </span>
        </p>
      </div>
      <div class="tx-time">{{ tx.timestamp }}</div>
    </div>

    <!-- 交易分页 -->
    <div class="pagination-container">
      <button
        class="pagination-button"
        @click="prevTransactionPage"
        :disabled="currentTransactionPage <= 1"
      >
        &lt;
      </button>
      <span class="page-info">{{ currentTransactionPage }} / {{ transactionTotalPages }}</span>
      <button
        class="pagination-button"
        @click="nextTransactionPage"
        :disabled="currentTransactionPage >= transactionTotalPages"
      >
        &gt;
      </button>
    </div>
  </el-card>
</el-col>

      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import Search from "@/components/Search.vue";
import request from "../utils/reques";
import router from "../router";

// 区块统计信息
const blockCountData = ref({
  blockCount: 0, // 默认值
  nodeList: [],
  txSum: 0,
  failedTxSum: 0,
}); 


// 区块数据分页状态
const blockData = ref([]);
const blockTotalPages = ref(1);
const currentBlockPage = ref(1);
const blockPageSize = ref(5);

// 交易数据分页状态
const transactionData = ref([]);
const transactionTotalPages = ref(1);
const currentTransactionPage = ref(1);
const transactionPageSize = ref(5);


// 获取区块数据
const fetchBlockData = async () => {
  try {
    const response = await request.get(`/blockchain/allBlockDetails`, {
      params: {
        page: currentBlockPage.value - 1,
        size: blockPageSize.value,
      },
    });

    blockData.value = response.data.data; // 区块数据
    blockTotalPages.value = Math.ceil(response.data.total / blockPageSize.value);
    blockCountData.value = response.data.count; // 提取统计信息

    // 动态更新表格数据
    tableData.value = blockCountData.value.nodeList.map((node, index) => ({
      id: node.slice(0, 16), // 节点 ID 前16位
      height: blockCountData.value.blockCount, // 设置为 blockCount
      view: 23175 + index, // 示例数据，或从后端动态获取
      status: "运行", // 状态，示例值
    }));

  } catch (error) {
    console.error("Failed to fetch block data:", error);
  }
};


// 获取交易数据
const fetchTransactionData = async () => {
  try {
    const response = await request.get(`/blockchain/allTransactionHashes`, {
      params: {
        page: currentTransactionPage.value - 1,
        size: transactionPageSize.value,
      },
    });

    transactionData.value = response.data.data; // 交易数据
    transactionTotalPages.value = Math.ceil(response.data.total / transactionPageSize.value);

  } catch (error) {
    console.error("Failed to fetch transaction data:", error);
  }
};


const goToTransactionDetail = (transactionHash) => {
      router.push({
        path: "/TransactionInfoView",
        query: { tx: transactionHash },
      })

    };


// 初始化页面时获取数据
onMounted(() => {
  fetchBlockData();
  fetchTransactionData();
});


// 区块分页
const prevBlockPage = () => {
  if (currentBlockPage.value > 1) {
    currentBlockPage.value--;
    fetchBlockData();
  }
};


const nextBlockPage = () => {
  if (currentBlockPage.value < blockTotalPages.value) {
    currentBlockPage.value++;
    fetchBlockData();
  }
};


// 交易分页
const prevTransactionPage = () => {
  if (currentTransactionPage.value > 1) {
    currentTransactionPage.value--;
    fetchTransactionData();
  }
};


const nextTransactionPage = () => {
  if (currentTransactionPage.value < transactionTotalPages.value) {
    currentTransactionPage.value++;
    fetchTransactionData();
  }
};


// 表格数据
const tableData = ref([
  { id: "0X0000",
    height: "",
    view: 23175,
    status: "运行" },
]);


// ECharts
const chartRef = ref(null);
onMounted(() => {
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    xAxis: { type: "category", data: ["12-10", "12-12", "12-14", "12-16"] },
    yAxis: { type: "value" },
    series: [{ data: [6, 7, 3, 5], type: "line", areaStyle: {} }],
  });
});
</script>

<style scoped>
.main-content {
  margin-top: 680px;
  /* 避免被导航栏遮挡 */
}

.card-section .card {
  text-align: center;
}

.card.green {
  background-color: #aaecb8;
}


.card.red {
  background-color: #f1ac9f;
}

.card.orange {
  background-color: #fef1e6;
}

.card.green {
  background-color: #aaecb8;
}


.card.red {
  background-color: #f1ac9f;
}

.card.purple {
  background-color: #eaf2ff;
}

.block-transaction .equal-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  text-align: center;
  line-height: 40px;
  font-weight: bold;
}

.block-item,
.tx-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.footer-button {
  width: 100%;
}

.search-bar {
  margin-left: 280px;
  margin-bottom: 20px;
  width: 300px;
  /* 将搜索框宽度调整为 300px */
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}

.pagination-button {
  background-color: transparent;
  border: none;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 5px 10px;
}

.pagination-button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pagination-button:hover {
  transform: scale(1.2);
}

.page-info {
  margin: 0 10px;
  font-size: 16px;
  color: #333;
}

.sender{
  color: rgb(71, 30, 255)
}
</style>
