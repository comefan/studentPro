<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-input
        placeholder="请输入用户名"
        size="medium"
        v-model="param.name"
        style="width: 200px; margin-right: 10px"
      ></el-input>
      <el-input
        placeholder="请输入手机号"
        size="medium"
        v-model="param.phone"
        style="width: 200px; margin-right: 10px"
      ></el-input>
      <el-button type="warning" size="mini" @click="getTableData">查询</el-button>
      <el-button type="danger" size="mini" @click="reset">重置</el-button>
      <el-button type="primary" size="mini">新增</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="sex" label="性别"> </el-table-column>
      <el-table-column prop="age" label="年龄"> </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" size="mini">编辑</el-button>
        <el-button type="danger" size="mini">删除</el-button>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 20px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="param.pageNum"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="param.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  data() {
    return {
      total: 0,
      tableData: [],
      param:{
        name:'',
        phone:'',
        pageNum:1,
        pageSize:5
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      request.get('/user/all',{params:this.param}).then(res => {
        if(res.code === '200') {
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.param.pageNum = res.data.pageNum;
          this.param.pageSize = res.data.pageSize;
        }else{
          this.$message.error(res.msg);
        }
      })
    },
    reset() {
      this.param.name = ''; 
      this.param.phone = '';
      this.param.pageNum = 1;
      this.param.pageSize = 5;
      this.getTableData();
    },
    handleSizeChange(pageSize) {
      this.param.pageSize = pageSize;
      this.getTableData();
    },
    handleCurrentChange(pageNum) {
      this.param.pageNum = pageNum;
      this.getTableData();
    },
  },
};
</script>
