<template>
  <div>
    <div>
      <el-input
        placeholder="请输入请假缘由"
        size="medium"
        v-model="param.name"
        style="width: 200px; margin-right: 10px"
      ></el-input>
      <el-button type="warning" size="mini" @click="getTableData">查询</el-button>
      <el-button type="danger" size="mini" @click="reset">重置</el-button>
      <el-button type="primary" size="mini" v-if="user.roleCode === 'ROLE_STUDENT'"
        @click="dialogFormVisible = true;form={name:'',time:'',day:'',userId:'',state:'',reason:''}">新增</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="请假缘由"> </el-table-column>
      <el-table-column prop="time" label="请假时间"> </el-table-column>
      <el-table-column prop="day" label="请假天数"> </el-table-column>
      <el-table-column prop="userName" label="请假人"> </el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="reason" label="审批意见"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="dialogFormVisible = true;form=scope.row" v-if="user.roleCode === 'ROLE_TEACHER'">审批</el-button>
          <el-button type="primary" size="mini" @click="dialogFormVisible = true;form=scope.row" v-if="user.roleCode === 'ROLE_STUDENT' || user.roleCode === 'ROLE_ADMIN'">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="deleteUser(scope.row)">
            <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px" v-if="user.roleCode === 'ROLE_STUDENT' || user.roleCode === 'ROLE_ADMIN'">删除</el-button>
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
          <div v-if="user.roleCode === 'ROLE_STUDENT'">
          <el-form-item label="请假缘由" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="请假时间" :label-width="formLabelWidth">
            <el-date-picker v-model="form.time" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="请假天数" :label-width="formLabelWidth">
            <el-input v-model="form.day" autocomplete="off"></el-input>
          </el-form-item>
          </div>
          <div v-if="user.roleCode === 'ROLE_TEACHER'">
            <el-form-item label="审批状态" :label-width="formLabelWidth">
              <el-radio-group v-model="form.status" size="medium">
                <el-radio label="通过" border>通过</el-radio>
                <el-radio label="拒绝" border>拒绝</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审批意见" :label-width="formLabelWidth">
              <el-input v-model="form.reason" autocomplete="off"></el-input>
            </el-form-item>
          </div>
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
  name: 'Audit',
  data() {
    return {
      total: 0,
      tableData: [],
      param: {
        name: "",
        userId: "",
        pageNum: 1,
        pageSize: 10,
      },
      dialogFormVisible: false,
      form: {
        name: "",
        time: "",
        day: "",
        userId: "",
        state: "",
        reason: "",
      },
      formLabelWidth: "100px",
      roleList: [],
      user: JSON.parse(localStorage.getItem("user")),
    };
  },
  created() {
    this.getTableData();
    this.getRoleList();
  },
  methods: {
    getTableData() {
      request.get("/audit/all", { params: this.param }).then((res) => {
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
    getRoleList() {
      request.get("/role").then((res) => {
        if (res.code === "200") {
          this.roleList = res.data;
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
    handleSizeChange(pageSize) {
      this.param.pageSize = pageSize;
      this.getTableData();
    },
    handleCurrentChange(pageNum) {
      this.param.pageNum = pageNum;
      this.getTableData();
    },
    submitForm() {
      if (!this.form.userId)
        this.form.userId = JSON.parse(localStorage.getItem("user")).id;
      request.post("/audit", this.form).then((res) => {
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
      request.delete("/audit/" + row.id).then((res) => {
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
