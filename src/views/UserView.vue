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
      <el-button type="primary" size="mini" @click="dialogFormVisible = true;form={name:'',sex:'',age:'',phone:''}">新增</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="sex" label="性别"> </el-table-column>
      <el-table-column prop="age" label="年龄"> </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="dialogFormVisible = true;form=scope.row">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="deleteUser(scope.row)">
            <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 20px">
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
    <div>
      <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="form">
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-radio-group v-model="form.sex">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄" :label-width="formLabelWidth">
            <el-input v-model="form.age" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  data() {
    return {
      total: 0,
      tableData: [],
      param: {
        name: "",
        phone: "",
        pageNum: 1,
        pageSize: 5,
      },
      dialogFormVisible: false,
      form: {
        name: "",
        sex: "",
        age: "",
        phone: "",
      },
      formLabelWidth: "100px",
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      request.get("/user/all", { params: this.param }).then((res) => {
        if (res.code === "200") {
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.param.pageNum = res.data.pageNum;
          this.param.pageSize = res.data.pageSize;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    reset() {
      this.param.name = "";
      this.param.phone = "";
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
    submitForm() {
      request.post("/user", this.form).then((res) => {
        if (res.code === "200") {
          this.$message.success(res.msg);
          this.dialogFormVisible = false;
          this.getTableData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    deleteUser(row) {
      request.delete("/user/" + row.id).then((res) => {
        if (res.code === "200") {
          this.$message.success(res.msg);
          this.getTableData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>
