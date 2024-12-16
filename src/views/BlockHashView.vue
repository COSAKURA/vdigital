<template>
  <el-container>
    <Navbar />
    <el-main>
     
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
          <el-card shadow="always">
            <h3>最近七天内的交易</h3>
            <div ref="chartRef" style="width: 110%; height: 403px;"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 节点表格 -->
      <el-card style="margin-top: 20px;" shadow="always">
        <h3>Node Information</h3>
        <el-table :data="filteredData" stripe style="width: 100%">
          <el-table-column prop="id" label="Node ID" />
          <el-table-column prop="height" label="Block Height" />
          <el-table-column prop="view" label="PbftView" />
          <el-table-column prop="status" label="Status">
            <template #default="scope">
              <el-tag type="success" v-if="scope.row.status === 'Running'">
                ● Running
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import * as echarts from "echarts";
import Navbar from "@/components/Navbar.vue";

// 表格数据
const tableData = ref([
  { id: "000d25498b...", height: 99, view: 2197, status: "Running" },
  { id: "32515d8859...", height: 99, view: 2198, status: "Running" },
  { id: "486b946b44...", height: 99, view: 2200, status: "Running" },
  { id: "c39adb750e...", height: 99, view: 2196, status: "Running" },
]);

const searchQuery = ref(""); // 搜索框的输入内容

// 过滤后的数据
const filteredData = computed(() => {
  if (!searchQuery.value) return tableData.value;
  return tableData.value.filter((item) =>
    item.id.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 搜索事件
const handleSearch = () => {
  console.log("Searching for:", searchQuery.value);
};

// ECharts 折线图
const chartRef = ref(null);

onMounted(() => {
  const chart = echarts.init(chartRef.value);
  const option = {
    title: { text: "" },
    tooltip: {},
    xAxis: { type: "category", data: ["2024-12-10", "2024-12-12", "2024-12-14", "2024-12-16"] },
    yAxis: { type: "value" },
    series: [
      {
        data: [6, 7, 2, 5, 1, 4],
        type: "line",
        areaStyle: { opacity: 0.3 },
      },
    ],
  };
  chart.setOption(option);
});
</script>

<style scoped>
/* 搜索栏样式 */
.search-bar {
  margin-bottom: 20px;
}

/* 卡片样式 */
.card-section .card {
  text-align: center;
  border-radius: 8px;
  background-color: #f4faff;
  color: #4b6584;
}
.card-section .card.orange {
  background-color: #fef1e6;
  color: #e17055;
}
.card-section .card.purple {
  background-color: #eaf2ff;
  color: #6c5ce7;
}
.card-content h2 {
  font-size: 28px;
  margin: 0;
}
.card-content p {
  margin: 0;
  color: #7f8c8d;
}

/* 主体布局 */
.content-wrapper {
  margin-top: 20px;
}
</style>
