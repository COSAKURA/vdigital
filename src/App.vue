<template>
        <div class="app-container">
          <LoginView />
        </div>
      </template>
      
      <script>
      import LoginView from '../src/views/LoginView.vue'; // 修改为 LoginView.vue
      
      export default {
        name: 'App',
        components: {
          LoginView, // 引入 LoginView
        },
      };
      </script>
      
      <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background-color: #f5f7fa;
      }
      .app-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100vh;
      }
      </style>
      