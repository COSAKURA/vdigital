<template>
    <footer class="main-footer">
      <el-container>
        <el-row :gutter="20">
          <el-col :span="6">
            <h4>About Us</h4>
            <p>Information about the company.</p>
          </el-col>
          <el-col :span="6">
            <h4>Contact</h4>
            <p>Email: info@example.com</p>
            <p>Phone: +123 456 789</p>
          </el-col>
          <el-col :span="6">
            <h4>Follow Us</h4>
            <el-link href="#" type="primary" icon="el-icon-facebook" />
            <el-link href="#" type="primary" icon="el-icon-twitter" />
          </el-col>
          <el-col :span="6">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </el-col>
        </el-row>
      </el-container>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'MainFooter',
  };
  </script>
  
  <style scoped>
  .main-footer {
    background-color: #f5f5f5;
    padding: 20px;
    color: #666;
  }
  </style>
  