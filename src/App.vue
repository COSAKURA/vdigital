<template>
  <div id="app">
    <!-- 渲染路由对应的组件 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5faff; /* 浅蓝背景 */
}
</style>
