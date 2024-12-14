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
      <!-- 区块部分 -->
      <div class="section">
        <h3 class="section-title">区块</h3>
        <el-table :data="blocks" border class="custom-table">
          <el-table-column label="块高" prop="blockNumber" width="100" align="center">
            <template #default="{ row }">
              <el-link type="primary">{{ row.blockNumber }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="区块哈希" prop="blockHash" width="250" align="center">
            <template #default="{ row }">
              <el-tooltip class="item" effect="dark" :content="row.blockHash" placement="top">
                <span>{{ row.blockHash.slice(0, 10) }}...{{ row.blockHash.slice(-10) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="时间" prop="timestamp" width="180" align="center">
            <template #default="{ row }">
              <span>{{ row.timestamp }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 区块分页 -->
        <div class="pagination-container">
          <el-pagination
            @current-change="fetchBlocks"
            :current-page="blockPagination.page + 1"
            :page-size="blockPagination.size"
            :total="blockPagination.total"
            background
            layout="prev, pager, next"
          />
        </div>
      </div>

      <!-- 交易部分 -->
      <div class="section">
        <h3 class="section-title">交易</h3>
        <el-table :data="transactions" border class="custom-table">
          <el-table-column label="块高" prop="blockNumber" width="100" align="center">
            <template #default="{ row }">
              <span>{{ row.blockNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易哈希" prop="transactionHash" width="250" align="center">
            <template #default="{ row }">
              <el-tooltip class="item" effect="dark" :content="row.transactionHash" placement="top">
                <el-link type="primary" @click="goToTransactionDetail(row.transactionHash)">
                  {{ row.transactionHash.slice(0, 10) }}...{{ row.transactionHash.slice(-10) }}
                </el-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="发送方" prop="from" width="250" align="center">
            <template #default="{ row }">
              <el-tooltip class="item" effect="dark" :content="row.from" placement="top">
                <span>{{ row.from.slice(0, 10) }}...{{ row.from.slice(-10) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="接收方" prop="to" width="250" align="center">
            <template #default="{ row }">
              <el-tooltip class="item" effect="dark" :content="row.to" placement="top">
                <span>{{ row.to.slice(0, 10) }}...{{ row.to.slice(-10) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="时间" prop="timestamp" width="180" align="center">
            <template #default="{ row }">
              <span>{{ row.timestamp }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 交易分页 -->
        <div class="pagination-container">
          <el-pagination
            @current-change="fetchTransactions"
            :current-page="transactionPagination.page + 1"
            :page-size="transactionPagination.size"
            :total="transactionPagination.total"
            background
            layout="prev, pager, next"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Navbar from "@/components/Navbar.vue";
import request from "@/utils/reques";
import router from "../router";
import { ElMessage } from "element-plus";

export default {
  name: "Dashboard",
  components: {
    Navbar,
  },
  setup() {
    const blocks = ref([]);
    const transactions = ref([]);
    const blockPagination = ref({ page: 0, size: 8, total: 0 });
    const transactionPagination = ref({ page: 0, size: 8, total: 0 });
    const searchQuery = ref("");

    // 获取区块数据
    const fetchBlocks = async (currentPage = 1) => {
      try {
        const page = currentPage - 1; // 后端分页从 0 开始
        const size = blockPagination.value.size;
        const response = await request.get("/blockchain/allBlockDetails", {
          params: { page, size },
        });

        blocks.value = response.data.data;
        blockPagination.value = {
          page: response.data.page,
          size: response.data.size,
          total: response.data.total,
        };
      } catch (error) {
        console.error("加载区块数据失败：", error);
      }
    };

    // 获取交易数据
    const fetchTransactions = async (currentPage = 1) => {
      try {
        const page = currentPage - 1; // 后端分页从 0 开始
        const size = transactionPagination.value.size;
        const response = await request.get("/blockchain/allTransactionHashes", {
          params: { page, size },
        });

        transactions.value = response.data.data;
        transactionPagination.value = {
          page: response.data.page,
          size: response.data.size,
          total: response.data.total,
        };
      } catch (error) {
        console.error("加载交易数据失败：", error);
      }
    };

    const goToTransactionDetail = (transactionHash) => {
      router.push({
        path: "/TransactionInfoView",
        query: { tx: transactionHash },
      })

    };

    const traceSearch = () => {
  const hashPattern = /^0x[a-fA-F0-9]{64}$/; // 正则表达式，用于匹配正确的哈希格式

  if (!searchQuery.value) {
    // 检查哈希是否为空
    ElMessage({
      message: "请输入交易哈希进行溯源！",
      type: "warning",
      duration: 3000, // 显示时间，单位为毫秒
    });
    return;
  }

  if (!hashPattern.test(searchQuery.value)) {
    // 检查哈希格式是否正确
    ElMessage({
      message: "请输入正确格式的交易哈希！",
      type: "error",
      duration: 3000,
    });
    return;
  }

  // 哈希有效时，跳转到详情页面
  goToTransactionDetail(searchQuery.value);
};


    onMounted(() => {
      fetchBlocks();
      fetchTransactions();
    });

    return {
      blocks,
      transactions,
      blockPagination,
      transactionPagination,
      fetchBlocks,
      fetchTransactions,
      goToTransactionDetail,
      traceSearch,
      searchQuery,
    };
  },
};
</script>

<style scoped>
/* 整体布局 */
.dashboard {
  display: flex;
  gap: 20px;
  padding: 20px;
}

/* 搜索框容器 */
.search-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}


/* 模块标题文字居中 */
.section-title {
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

/* 表格样式 */
.custom-table {
  margin-bottom: 20px;
}

/* 居中分页样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
/* 搜索框样式 */
.search-input {
  width: 600px;
  height: 50px;
  font-size: 16px;
}

.search-button {
  height: 48px;
  font-size: 16px;
}

/* 模块样式 */
.section {
  flex: 1;
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 15px;
  padding: 20px;
}

.section-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.custom-table {
  margin-bottom: 20px;
}

/* 居中分页样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
