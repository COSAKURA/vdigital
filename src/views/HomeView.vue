<template>
    <section class="banner-section">
      <el-container>
        <el-row>
          <el-col :span="12">
            <h1>We provide truly prominent IT solutions</h1>
            <p>IT Services for all your Business Needs</p>
            <el-button type="primary" @click="getStarted">Get Started Now</el-button>
          </el-col>
          <el-col :span="12">
            <img src="../assets/images/main-slider/icon-3.png" alt="Banner" />
          </el-col>
        </el-row>
      </el-container>
    </section>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Home',
    methods: {
      async getStarted() {
        try {
          const response = await axios.get('/api/start');
          console.log('API Response:', response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .banner-section {
    text-align: center;
    padding: 40px 0;
  }
  </style>
  