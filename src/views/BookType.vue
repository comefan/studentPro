<template>
  <div>
    <div>
      <el-input
        placeholder="请输入分类名称"
        size="medium"
        v-model="param.name"
        style="width: 200px; margin-right: 10px"
      ></el-input>
      <el-button type="warning" size="mini" @click="getTableData">查询</el-button>
      <el-button type="danger" size="mini" @click="reset">重置</el-button>
      <el-button type="info" size="mini" @click="deleteSelected">删除选中</el-button>
      <el-button type="primary" size="mini" @click="dialogFormVisible = true;form={name:'',description:''}">新增</el-button>
      <el-button type="primary" size="mini" @click="exportExcel">导出Excel</el-button>
      <el-upload
        class="upload"
        action="http://localhost:8080/api/bookType/upload"
        :limit="3"
        :on-success="handleSuccess"
        :show-file-list="false">
        <el-button size="small" type="success">批量上传</el-button>
      </el-upload>
    </div>
    <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" ref="tableRef" :row-key="getRowKey">
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="55">
      </el-table-column>
      <el-table-column prop="name" label="分类名称"> </el-table-column>
      <el-table-column prop="description" label="描述"> </el-table-column>
      
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="dialogFormVisible = true;form=scope.row">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="deleteBookType(scope.row)">
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
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-form-item label="分类名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" placeholder="请输入分类名称" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="4" placeholder="请输入描述" v-model="form.description" autocomplete="off"></el-input>
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
  name: "BookType",
  data() {
    return {
      total: 0,
      tableData: [],
      param: {
        name: "",
        description: "",
        pageNum: 1,
        pageSize: 10,
      },
      dialogFormVisible: false,
      form: {
        name: "",
        description: "",
      },
      formLabelWidth: "100px",
      rules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      multipleSelection: [],
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      request.get("/bookType/all", { params: this.param }).then((res) => {
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
    handleSizeChange(pageSize) {
      this.param.pageSize = pageSize;
      this.getTableData();
    },
    handleCurrentChange(pageNum) {
      this.param.pageNum = pageNum;
      this.getTableData();
    },
    submitForm() {
      this.$refs.formRef.validate((valid) => {
        console.log('valid',valid)
        if (valid) {
          request.post("/bookType", this.form).then((res) => {
            if (res.code === "200") {
              this.$message.success(res.msg);
              this.dialogFormVisible = false;
              this.getTableData();
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("请填写完整信息！！！");
        }
      });
    },
    deleteBookType(row) {
      request.delete("/bookType/" + row.id).then((res) => {
        if (res.code === "200") {
          this.$message.success(res.msg);
          this.getTableData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    deleteSelected() {
      const selectedRows = this.$refs.tableRef.selection;
      if (selectedRows.length === 0) {
        this.$message.warning("请选择要删除的分类！");
        return;
      }
      request.delete("/bookType/delBatch", {
        data: selectedRows.map((row) => row.id),
      }).then((res) => {
        if (res.code === "200") {
          this.$message.success(res.msg);
          this.getTableData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getRowKey(row) {
      return row.id;
    },
    exportExcel() {
      const user = JSON.parse(localStorage.getItem("user"));
      location.href = "http://localhost:8080/api/bookType/exportExcel?token=" + user.token;
    },
    handleSuccess(res) {
      if (res.code === "200") {
        this.$message.success(res.msg);
        this.getTableData();
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>
<style scoped>
.upload {
  margin-bottom: 10px;
  display: inline-block;
  margin-left: 10px;
}
</style>
