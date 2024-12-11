<template>
    <el-header class="main-header">
        <!-- 图片放置在导航栏左侧 -->
        <div class="logo-container">
            <img src="@/assets/images/lll.png" alt="Logo" class="logo-image" />
        </div>
        <el-menu mode="horizontal" class="el-menu-demo">
            <el-menu-item index="home" class="nav-item">
                <router-link to="/home">首页</router-link>
            </el-menu-item>
            <el-menu-item index="about" class="nav-item">
                <router-link to="/about">关于我们</router-link>
            </el-menu-item>
            <el-menu-item index="services" class="nav-item">
                <router-link to="/services">服务内容</router-link>
            </el-menu-item>
            <el-menu-item index="case-studio" class="nav-item">
                <router-link to="/WorkView">我的作品</router-link>
            </el-menu-item>
            <el-menu-item index="blog" class="nav-item">
                <router-link to="/blog">侵权监测</router-link>
            </el-menu-item>
            <el-menu-item index="contact" class="nav-item">
                <router-link to="/AuctionView">拍卖市场</router-link>
            </el-menu-item>
        </el-menu>
        <div class="header-actions">
            <el-button type="text" class="language-switch">中文</el-button>
            <el-button type="text" class="language-switch">English</el-button>
            <el-button type="primary" icon="el-icon-user" @click="outlogin">
                <el-icon>
                    <HomeFilled />
                </el-icon>
                登出
            </el-button>

        </div>
    </el-header>
</template>

<script>
export default {
    name: "Navbar",
    methods: {
        goToPage(page) {
            this.$router.push({ path: `/${page}` });
        },
        outlogin() {
        // 使用 Element Plus 的 MessageBox 来替代 window.confirm
        this.$msgbox({
            title: "确认退出",
            message: "您确定要退出登录吗？",
            showCancelButton: true, // 显示取消按钮
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning", // 弹框的样式
        })
            .then(() => {
                // 点击确认时执行
                localStorage.clear();
                this.$router.push("/").catch((err) => {
                    console.error("Redirect failed:", err);
                });
            })
            .catch(() => {
                // 点击取消时执行的操作
                console.log("取消退出");
            });
    },
},

};
</script>

<style scoped>
.main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 50px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 1000;
    transition: background-color 0.3s ease-in-out;
}

.el-menu-demo {
    background-color: rgba(255, 255, 255, 0.1);
    flex-grow: 1;
    margin-left: 50px;
}

.nav-item {
    transition: transform 0.3s ease-in-out;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 20px;
}

.language-switch {
    font-weight: bold;
}

.logo-container {
    margin-right: -80px;
    width: 10%;
}

.logo-image {
    width: 80%;
}
</style>