<template>
  <div id="app">
    <el-container>
      <el-header style="background-color: #4c535a">
        <img
          src="./assets/logo.png"
          alt=""
          style="width: 40px; position: relative; top: 10px"
        />
        <span style="font-size: 20px; margin-left: 15px; color: white">学生管理系统</span>
      </el-header>
      <el-container>
      <el-aside :style="{ width: isCollapse ? '60px' : '250px' }"
        style="
          overflow: hidden;
          min-height: 90vh;
          background-color: #545c64;
        "
      >
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group> -->
        <i class="el-icon-right" style="font-size: 20px; color: white" v-if="isCollapse" @click="isCollapse = false"></i>
        <i class="el-icon-back" style="font-size: 20px; color: white" v-else @click="isCollapse = true"></i>
        <el-menu
          :default-active="$route.path"
          router
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
        <el-menu-item index="/" >
            <i class="el-icon-s-home"></i>
            <span slot="title">系统首页</span>
          </el-menu-item>
          <el-submenu>
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/user">管理员信息</el-menu-item>
              <el-menu-item index="1-2">用户信息</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/about">
            <i class="el-icon-setting"></i>
            <span slot="title">信息管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isCollapse: false
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
<style scoped>
  .el-menu{
    border-right: 0;
  }
</style>
