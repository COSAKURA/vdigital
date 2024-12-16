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
            <el-card class="card" shadow="hover">
              <div class="card-content">
                <h2>4</h2>
                <p>Nodes</p>
              </div>
            </el-card>
            <el-card class="card" shadow="hover" style="margin-top: 10px;">
              <div class="card-content">
                <h2>4</h2>
                <p>Deployed Contracts</p>
              </div>
            </el-card>
            <el-card class="card orange" shadow="hover" style="margin-top: 10px;">
              <div class="card-content">
                <h2>99</h2>
                <p>Blocks</p>
              </div>
            </el-card>
            <el-card class="card purple" shadow="hover" style="margin-top: 10px;">
              <div class="card-content">
                <h2>99</h2>
                <p>Transactions</p>
              </div>
            </el-card>
          </div>
        </el-col>

        <!-- 右侧交易折线图 -->
        <el-col :span="18">
          <el-card shadow="always" class="chart-card">
            <h3>最近七天内的交易</h3>
            <div ref="chartRef" style="width: 100%; height: 370px;"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 节点表格 -->
      <el-card style="margin-top: 20px;" shadow="always">
        <h3>Node Information</h3>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="id" label="Node ID" />
          <el-table-column prop="height" label="Block Height" />
          <el-table-column prop="view" label="PbftView" />
          <el-table-column prop="status" label="Status">
            <template #default="scope">
              <el-tag type="success" v-if="scope.row.status === 'Running'"> ● Running </el-tag>
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
                <p class="block-title">{{ block.number }}</p>
                <p class="block-time">{{ block.time }}</p>
                <p class="block-info">
                  出块者 <span class="miner">{{ block.miner }}</span>
                </p>
              </div>
              <div class="block-transaction">{{ block.transaction }} </div>
            </div>
            <el-button type="primary" plain class="footer-button">查看全部区块</el-button>
          </el-card>
        </el-col>

        <!-- 大额交易部分 -->
        <el-col :span="12">
          <el-card shadow="hover" class="equal-card">
           
               <!-- 搜索框 -->
    
    <h3>大额交易 </h3>
            <div v-for="tx in transactionData" :key="tx.hash" class="tx-item">
              <div class="circle">Tx</div>
              <div class="tx-content">
                <p class="tx-hash">{{ tx.hash }}</p>
                <p class="tx-info">
                  发送方 {{ tx.sender }} <br />
                  接收方 {{ tx.receiver }}
                </p>
              </div>
              <div class="tx-time">{{ tx.time }}</div>
            </div>
            <el-button type="primary" plain class="footer-button">查看全部大额交易</el-button>
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



// 表格数据
const tableData = ref([
  { id: "000d25498b...", height: 99, view: 2197, status: "Running" },
  { id: "32515d8859...", height: 99, view: 2198, status: "Running" },
  { id: "32515d8859...", height: 99, view: 2198, status: "Running" },
  { id: "32515d8859...", height: 99, view: 2198, status: "Running" },
]);

// 区块数据
const blockData = ref([
  { id: 1, number: "21412156", time: "45 秒前", miner: "0x4838000d25498b...5f97", txCount: 235, reward: "0.0413", transaction: 14.1 },
  { id: 1, number: "21412156", time: "45 秒前", miner: "0x4838000d25498b...5f97", txCount: 235, reward: "0.0413", transaction: 14.1 },
  { id: 1, number: "21412156", time: "45 秒前", miner: "0x4838000d25498b...5f97", txCount: 235, reward: "0.0413", transaction: 14.1 },
  { id: 1, number: "21412156", time: "45 秒前", miner: "0x4838000d25498b...5f97", txCount: 235, reward: "0.0413", transaction: 14.1 },
]);

// 大额交易数据
const transactionData = ref([
  { hash: "0xc5c2d1e...", time: "11 小时前", sender: "Binance.Deposit", receiver: "Binance.Withdraw_17", amount: "16,915" },
  { hash: "0xc5c2d1e...", time: "11 小时前", sender: "Binance.Deposit", receiver: "Binance.Withdraw_17", amount: "16,915" },
  { hash: "0xc5c2d1e...", time: "11 小时前", sender: "Binance.Deposit", receiver: "Binance.Withdraw_17", amount: "16,915" },
  { hash: "0xc5c2d1e...", time: "11 小时前", sender: "Binance.Deposit", receiver: "Binance.Withdraw_17", amount: "16,915" },
  
  
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
  margin-top: 600px; /* 避免被导航栏遮挡 */
}

.card-section .card {
  text-align: center;
}

.card.orange {
  background-color: #fef1e6;
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
  width: 300px; /* 将搜索框宽度调整为 300px */
}
</style>
