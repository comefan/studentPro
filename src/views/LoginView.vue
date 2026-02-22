<template>
    <div class="login-container">
        <div style="width: 400px; height:360px;margin: 150px auto;background-color: rgba(107,149,224,0.5);border-radius: 10px;">
        <div style="width: 100%; height: 100px;font-size:30px; line-height: 100px; text-align: center; color:#4a5ed0">欢迎登录</div>
        <div style="text-align: center;">
            <el-form :model="user">
                <el-form-item prop="name">
                    <el-input v-model="user.name" prefix-icon="el-icon-user" style="width: 80%;" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="user.password" @keyup.enter.native="login" prefix-icon="el-icon-lock" style="width: 80%;" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <div style="display: flex; justify-content: center;">
                        <el-input v-model="user.verCode" prefix-icon="el-icon-verify" style="width: 42%;" placeholder="请输入验证码"></el-input>
                        <el-image style="width: 140px; margin-left: 10px;" :src="verCodeImg" @click="getVerCode"></el-image>
                    </div>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" class="login-btn" @click="login">登录</el-button>
                </el-form-item>
                <div class="register-link">
                    未有账号？<el-link type="success" @click="$router.push({path:'/register'})">点击注册</el-link>
                </div>
            </el-form>
        </div>
        </div>
    </div>
</template>

<script>
import request from "@/utils/request";

export default {
    name: "LoginView",
    data() {
        return {
            user: {
                name: "",
                password: "",
                verCode: "",
            },
            key: new Date().getTime(),
            verCodeImg: "http://localhost:8080/api/captcha?key=" + this.key,
        };
    },
    methods: {
        login() {
            request.post("/user/login?key=" + this.key,this.user).then((res) => {
                if (res.code === '200') {
                    this.$message({
                        message: '登录成功',
                        type: "success",
                    });
                    localStorage.setItem("user",JSON.stringify(res.data));
                    this.$router.push({
                        path: "/",
                    });
                } else {
                    this.$message.error(res.msg);
                    this.getVerCode();
                }
            });
        },
        getVerCode() {
            this.key = new Date().getTime();
            this.verCodeImg = "http://localhost:8080/api/captcha?key=" + this.key;
            this.user.verCode = "";
        },
    },
}
</script>
<style scoped>
.login-container{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('@/assets/pic/bg.png') no-repeat center center fixed;
    background-size: cover;
}
.register-link{
    margin-top: -15px;
    margin-right: 40px;
    text-align: right;
    font-size: 15px;
    color: #67686c;
}
.login-btn{
    width: 80%;
}
</style>
