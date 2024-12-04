<template>
    <div class="contact-section">
        <!-- 联系横幅 -->
        <div class="contact-banner">
            <div class="banner-content">
                <h2>Contact</h2>
                <h1>Leave us a little info</h1>
                <p>Leave us a little info, and we’ll be in touch. exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
        </div>

        <!-- 联系信息和表单 -->
        <div class="contact-form-container">
            <el-row :gutter="20">
                <!-- 联系信息 -->
                <el-col :span="8" class="contact-info">
                    <div class="info-item">
                        <el-icon><i class="el-icon-location"></i></el-icon>
                        <h3>Location</h3>
                        <p>Building 543 Bournadi bus stand Barisal 11454, Berlin, Germany</p>
                    </div>
                    <div class="info-item">
                        <el-icon><i class="el-icon-message"></i></el-icon>
                        <h3>Email</h3>
                        <p>supportit@email.com</p>
                    </div>
                    <div class="info-item">
                        <el-icon><i class="el-icon-phone"></i></el-icon>
                        <h3>Phone</h3>
                        <p>+112 334 106 610<br>+8801 648 101 51</p>
                    </div>
                    <div class="info-item social-icons">
                        <h3>Social</h3>
                        <div>
                            <el-icon><i class="el-icon-share"></i></el-icon>
                            <el-icon><i class="el-icon-link"></i></el-icon>
                            <el-icon><i class="el-icon-chat-line-square"></i></el-icon>
                        </div>
                    </div>
                </el-col>

                <!-- 表单 -->
                <el-col :span="16">
                    <div class="form-section">
                        <h2>Send a message</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit arcu in pretium.</p>
                        <el-form :model="formData" @submit.native.prevent="handleSubmit" ref="form">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                            </el-row>
                            <el-form-item prop="name">
                                        <el-input v-model="formData.name" placeholder="Name"></el-input>
                                    </el-form-item>
                            <el-form-item prop="message">
                                <el-input type="textarea" v-model="formData.message" placeholder="Message"></el-input>
                            </el-form-item>

                            <!-- 上传图片和按钮 -->
                            <div class="center-upload-and-button">
                                <!-- 文件上传 -->
                                <el-upload
                                    v-model:file-list="fileList"
                                    action="https://your-api-endpoint.com/upload"
                                    list-type="picture-card"
                                    :on-success="handleUploadSuccess"
                                    :on-preview="handlePictureCardPreview"
                                    :on-remove="handleRemove"
                                    :auto-upload="false"
                                    :limit="1"
                                >
                                    <div class="upload-plus-icon">
                                        <el-icon><i class="el-icon-plus"></i></el-icon>
                                    </div>
                                </el-upload>

                                <!-- 申请版权按钮 -->
                                <el-button type="success">申请版权</el-button>
                            </div>

                            <el-dialog v-model="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="Preview Image" />
                            </el-dialog>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
    name: 'ContactSection',
    setup() {
        const fileList = ref([]); // 修改为一个空数组，去掉默认的图片

        const dialogImageUrl = ref('');
        const dialogVisible = ref(false);

        const handleRemove = (uploadFile, uploadFiles) => {
            console.log(uploadFile, uploadFiles);
        };

        const handlePictureCardPreview = (uploadFile) => {
            dialogImageUrl.value = uploadFile.url;
            dialogVisible.value = true;
        };

        const handleUploadSuccess = (response, file) => {
            console.log('Upload success:', response);
            fileList.value.push({
                name: file.name,
                url: URL.createObjectURL(file.raw),
            });
        };

        return {
            fileList,
            dialogImageUrl,
            dialogVisible,
            handleRemove,
            handlePictureCardPreview,
            handleUploadSuccess,
        };
    },
    data() {
        return {
            formData: {
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            },
        };
    },
    methods: {
        handleSubmit() {
            // 处理表单提交
            axios.post('https://your-api-endpoint.com/contact', this.formData)
                .then(response => {
                    this.$message.success('Message sent successfully!');
                })
                .catch(error => {
                    this.$message.error('Failed to send the message.');
                });
        },
    },
};
</script>

<style scoped>
.contact-section {
    font-family: 'Lato', sans-serif;
    padding: 40px 0;
}

.contact-banner {
    background-color: #e9f3fd; /* 浅蓝色背景 */
    padding: 40px;
    text-align: center;
}

.banner-content h2 {
    color: #333;
    font-size: 1.2rem;
    font-weight: 600;
}

.banner-content h1 {
    color: #000;
    font-size: 2.5rem;
    font-weight: bold;
}

.banner-content p {
    color: #666;
    margin-top: 20px;
    font-size: 1.1rem;
}

.contact-form-container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
}

.contact-info {
    padding: 20px;
    background-color: #fce5d8;
    border-radius: 10px;
}

.info-item {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}

.info-item h3 {
    font-size: 1.1rem;
    font-weight: bold;
    margin: 10px 0 0 10px;
}

.info-item p {
    color: #666;
    font-size: 1rem;
    margin-left: 40px;
}

.social-icons div {
    display: flex;
    gap: 10px;
    margin-left: 10px;
}

.form-section {
    padding: 20px;
}

.form-section h2 {
    font-weight: bold;
    font-size: 1.5rem;
}

.el-form-item {
    margin-bottom: 20px;
}

/* 居中上传图片框和按钮 */
.center-upload-and-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.upload-plus-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: #999;
}

.el-upload .el-icon {
    font-size: 32px;
    color: #999;
}

.el-button {
    background-color: #06f129;
    color: #fff;
    text-align: center;
}

.el-button:hover {
    background-color: #333;
}
</style>
