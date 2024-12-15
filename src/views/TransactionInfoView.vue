<template>
  <div class="transaction-details">
    <Navbar />
    <!-- 标题 -->
    <h2 class="page-title">交易详情</h2>

    <!-- 交易哈希 -->
    <el-card shadow="hover" class="card">
      <div class="transaction-hash">
        <p>
          <strong>交易哈希: </strong>
          <el-tooltip effect="dark" :content="transactionData.transactionHash" placement="top">
            <el-link type="primary">{{ truncateText(transactionData.transactionHash, 20) }}</el-link>
          </el-tooltip>
        </p>
      </div>
    </el-card>

    <!-- Tabs -->
    <el-card shadow="hover" class="card">
      <el-tabs v-model="activeTab" class="transaction-tabs">
        <!-- 概览 Tab -->
        <el-tab-pane label="概览" name="overview">
          <el-row :gutter="20" class="overview">
            <!-- 左侧信息 -->
            <el-col :span="12">
              <p><strong>交易结果：</strong>
                <el-tag v-if="transactionData.Message === 'Transaction succeeded'" type="success">成功</el-tag>
                <el-tag v-else type="danger">失败</el-tag>
              </p>
              <p><strong>交易区块：</strong> {{ transactionData.blockNumber || "-" }}</p>
              <p><strong>交易时间：</strong> {{ transactionData.timestamp || "-" }}</p>
              <p><strong>发送方：</strong>
                <el-tooltip effect="dark" :content="transactionData.from" placement="top">
                  <el-link type="primary">{{ truncateText(transactionData.from, 20) }}</el-link>
                </el-tooltip>
              </p>
              <p><strong>接收方：</strong>
                <el-tooltip effect="dark" :content="transactionData.to" placement="top">
                  <el-link type="primary">{{ truncateText(transactionData.to, 20) }}</el-link>
                </el-tooltip>
              </p>
            </el-col>

            <!-- 右侧信息 -->
            <el-col :span="12">
              <p><strong>交易序号：</strong>
                <el-tooltip effect="dark" :content="transactionData.nonce" placement="top">
                  {{ truncateText(transactionData.nonce, 20) }}
                </el-tooltip>
              </p>
              <p><strong>区块哈希：</strong>
                <el-tooltip effect="dark" :content="transactionData.blockHash" placement="top">
                  {{ truncateText(transactionData.blockHash, 20) }}
                </el-tooltip>
              </p>
              <p><strong>合约地址：</strong>
                <el-tooltip effect="dark" :content="transactionData.contractAddress" placement="top">
                  {{ truncateText(transactionData.contractAddress, 20) }}
                </el-tooltip>
              </p>
              <p><strong>输出：</strong>
                <el-tooltip effect="dark" :content="transactionData.input" placement="top">
                  {{ truncateText(transactionData.input, 20) }}
                </el-tooltip>
              </p>
              <p><strong>状态：</strong> {{ transactionData.status || "-" }}</p>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>


<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import request from "../utils/reques";

export default {
  name: "TransactionDetails",
  components: { Navbar },
  setup() {
    const route = useRoute();
    const transactionData = ref({});
    const activeTab = ref("overview");

    // 获取交易详情
    const fetchTransactionDetails = async () => {
      try {
        const transactionHash = route.query.tx;
        if (!transactionHash) {
          console.error("交易哈希未提供");
          return;
        }
        const response = await request.get("/blockchain/traceTransaction", {
          params: { transactionHash },
        });
        transactionData.value = response.data;
      } catch (error) {
        console.error("获取交易详情失败:", error);
      }
    };

    // 截断过长字符串
    const truncateText = (text, length) => {
      if (!text || text.length <= length) return text;
      return `${text.slice(0, length)}...${text.slice(-length)}`;
    };

    onMounted(() => {
      fetchTransactionDetails();
    });

    return {
      transactionData,
      activeTab,
      truncateText,
    };
  },
};

</script>

<style scoped>
.transaction-details {
  margin-top: 150px;
  height: 100%;
  width: 100%;
  padding: 20px;

  background: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.transaction-hash {
  margin-bottom: 20px;
  font-size: 16px;
}

.overview {
  font-size: 18px;
  line-height: 1.6;
  line-height: 4;
  /* 行间距 */
}



.el-tabs {
  margin-top: 20px;
}
</style>
