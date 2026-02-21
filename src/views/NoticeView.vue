<template>
  <div>
    <div>
      <el-input
        placeholder="请输入公告名称"
        size="medium"
        v-model="param.name"
        style="width: 200px; margin-right: 10px"
      ></el-input>
      <el-button type="warning" size="mini" @click="getTableData">查询</el-button>
      <el-button type="danger" size="mini" @click="reset">重置</el-button>
      <el-button type="primary" size="mini" @click="dialogFormVisible = true;form={name:'',content:'',time:'',username:''}">新增</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="公告名称"> </el-table-column>
      <el-table-column prop="content" label="内容"> </el-table-column>
      <el-table-column prop="time" label="发布时间"> </el-table-column>
      <el-table-column prop="username" label="发布人"> </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="deleteHotel(scope.row)">
            <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="param.pageNum"
        :page-sizes="[10, 20, 40]"
        :page-size="param.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <div>
      <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="form">
          <el-form-item label="公告名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="内容" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.content" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="发布时间" :label-width="formLabelWidth">
            <el-date-picker v-model="form.time" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
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
  name: "notice",
  data() {
    return {
      total: 0,
      tableData: [],
      param: {
        name: "",
        pageNum: 1,
        pageSize: 10,
      },
      dialogFormVisible: false,
      form: {
        name: "", 
        content: "",
        time: "",
        username: "",
      },
      formLabelWidth: "100px",
      user: JSON.parse(localStorage.getItem("user")),
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      request.get("/notice/", { params: this.param }).then((res) => {
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
      this.param.pageNum = 1;
      this.param.pageSize = 5;
      this.getTableData();
    },
    edit(row){
      this.form = row;
      // this.fileList = row.img ? [row.img] : [];
      this.dialogFormVisible = true;
      if(this.$refs.upload){
        this.$refs.upload.clearFiles();
      }
      
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
      this.form.username = this.user.name;
      request.post("/notice", this.form).then((res) => {
        if (res.code === "200") {
          this.$message.success(res.msg);
          this.dialogFormVisible = false;
          this.getTableData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    deleteHotel(row) {
      request.delete("/notice/" + row.id).then((res) => {
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
<style scoped>

</style>
