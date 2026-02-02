<template>
    <div class="login-container">
        <div style="width: 400px; height:350px;margin: 150px auto;background-color: rgba(107,149,224,0.5);border-radius: 10px;">
        <div style="width: 100%; height: 100px;font-size:30px; line-height: 100px; text-align: center; color:#4a5ed0">欢迎登录</div>
        <div style="margin-top: 25px;text-align: center;height: 320px;">
            <el-form :model="user">
                <el-form-item prop="name">
                    <el-input v-model="user.name" prefix-icon="el-icon-user" style="width: 80%;" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="user.password" @keyup.enter.native="login" prefix-icon="el-icon-lock" style="width: 80%;" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">登录</el-button>
                </el-form-item>
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
            },
        };
    },
    methods: {
        login() {
            request.post("/user/login",this.user).then((res) => {
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
                    this.$message({
                        message: res.msg,
                        type: "error",
                    });
                }
            });
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
</style>
