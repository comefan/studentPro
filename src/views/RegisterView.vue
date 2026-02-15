<template>
    <div class="login-container">
        <div style="width: 400px; height:350px;margin: 150px auto;background-color: rgba(107,149,224,0.5);border-radius: 10px;">
        <div style="width: 100%; height: 100px;font-size:30px; line-height: 100px; text-align: center; color:#4a5ed0">欢迎注册</div>
        <div style="margin-top: 25px;text-align: center;height: 320px;">
            <el-form :model="user">
                <el-form-item prop="name">
                    <el-input v-model="user.name" prefix-icon="el-icon-user" style="width: 80%;" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="user.password" prefix-icon="el-icon-lock" style="width: 80%;" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <div class="register-link">
                    已有账号？<el-link type="success" @click="$router.push({path:'/login'})">点击登录</el-link>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="register">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
        </div>
    </div>
</template>

<script>
import request from "@/utils/request";

export default {
    name: "Register",
    data() {
        return {
            user: {
                username: "",
                password: "",
            },
        };
    },
    methods: {
        register() {
            request.post("/user/register",this.user).then((res) => {
                if (res.code === '200') {
                    this.$message({
                        message: '注册成功',
                        type: "success",
                    });
                    this.$router.push({
                        path: "/login",
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
.register-link{
    margin-top: -12px;
    margin-right: 40px;
    text-align: right;
    font-size: 15px;
    color: #67686c;
}
</style>
