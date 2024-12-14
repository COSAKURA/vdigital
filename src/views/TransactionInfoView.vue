<template>
    <div class="transaction-details">
        <Navbar />
      <!-- 标题 -->
      <h2>交易详情</h2>
  
      <!-- 交易哈希 -->
      <div class="transaction-hash">
        <p>
          交易编号: <el-link type="primary">{{ transactionData.hash }}</el-link>
          <el-tag type="info">Phalcon</el-tag>
        </p>
      </div>
  
      <!-- Tabs: 概览 & 状态 -->
      <el-tabs v-model="activeTab">
        <el-tab-pane label="概览" name="overview">
          <div class="overview">
            <el-row :gutter="20">
              <el-col :span="12">
                <p><strong>交易结果:</strong> <el-tag type="success">{{ transactionData.status }}</el-tag></p>
                <p><strong>交易区块:</strong> {{ transactionData.blockNumber }}</p>
                <p><strong>交易时间:</strong> {{ transactionData.timestamp }}</p>
                <p>
                  <strong>发送方:</strong>
                  <el-link type="primary">{{ transactionData.from }}</el-link>
                  <span># {{ transactionData.fromExchange }}</span>
                </p>
                <p>
                  <strong>接收方:</strong>
                  <el-link type="primary">{{ transactionData.to }}</el-link>
                  <span># {{ transactionData.toExchange }}</span>
                </p>
              </el-col>
              <el-col :span="12">
                <p><strong>交易数量:</strong> {{ transactionData.value }} ETH</p>
                <p><strong>交易手续费:</strong> {{ transactionData.transactionFee }} ETH</p>
                <p><strong>Gas 价格:</strong> {{ transactionData.gasPrice }} ETH</p>
                <p><strong>Gas 费:</strong> {{ transactionData.gasUsed }} Gwei</p>
                <p><strong>其他信息:</strong> {{ transactionData.otherInfo }}</p>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>
  </template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "TransactionDetails",
  components: {
      Navbar,
    },
  setup() {
    const transactionData = ref({});
    const activeTab = ref("overview"); // 默认显示概览

    // 获取交易详情
    const fetchTransactionDetails = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/transaction-details", {
          params: {
            hash: "0x25a9255f849ae019894f11a8904a895f2bdb52260516b48ee66f13ea6a6cfb2", // 示例哈希
          },
        });
        transactionData.value = response.data;
      } catch (error) {
        console.error("获取交易详情失败:", error);
      }
    };

    onMounted(() => {
      fetchTransactionDetails();
    });

    return {
      transactionData,
      activeTab,
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
  line-height: 4; /* 行间距 */
}



.el-tabs {
  margin-top: 20px;
}
</style>
