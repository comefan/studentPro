<template>
  <div>
    <div>
      <el-input
        placeholder="请输入书名"
        size="medium"
        v-model="param.name"
        style="width: 200px; margin-right: 10px"
      ></el-input>
      <el-input
        placeholder="请输入作者"
        size="medium"
        v-model="param.author"
        style="width: 200px; margin-right: 10px"
      ></el-input>
      <el-button type="warning" size="mini" @click="getTableData">查询</el-button>
      <el-button type="danger" size="mini" @click="reset">重置</el-button>
      <el-button type="primary" size="mini" @click="dialogFormVisible = true;form={name:'',sex:'',age:'',phone:''}">新增</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="封面">
        <template v-slot="scope">
          <el-image 
            style="width: 70px; height: 70px;border-radius: 50%;"
            :src="scope.row.img" 
            :preview-src-list="[scope.row.img]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="书名"> </el-table-column>
      <el-table-column prop="price" label="价格"> </el-table-column>
      <el-table-column prop="author" label="作者"> </el-table-column>
      <el-table-column prop="press" label="出版社"> </el-table-column>
      
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="success" size="mini" @click="dload(scope.row.img)">下载</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="deleteBook(scope.row)">
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
          <el-form-item label="书名" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="价格" :label-width="formLabelWidth">
            <el-input v-model="form.price" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="作者" :label-width="formLabelWidth">
            <el-input v-model="form.author" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="出版社" :label-width="formLabelWidth">
            <el-input v-model="form.press" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="封面" :label-width="formLabelWidth">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="burl+'upload'"
              :on-success="handleSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
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
  name: "book",
  data() {
    return {
      total: 0,
      tableData: [],
      param: {
        name: "",
        author: "",
        pageNum: 1,
        pageSize: 10,
      },
      dialogFormVisible: false,
      form: {
        name: "",
        price: "",
        author: "",
        press: "",
        img: "",
      },
      formLabelWidth: "100px",
      fileList: [],
      burl:'http://localhost:8080/api/files/',
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      request.get("/book/all", { params: this.param }).then((res) => {
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
      this.param.author = "";
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
      request.post("/book", this.form).then((res) => {
        if (res.code === "200") {
          this.$message.success(res.msg);
          this.dialogFormVisible = false;
          this.getTableData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    deleteBook(row) {
      request.delete("/book/" + row.id).then((res) => {
        if (res.code === "200") {
          this.$message.success(res.msg);
          this.getTableData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
     handleRemove(file, fileList) {
        console.log('删除',file,'---', fileList);
      },
      handlePreview(file) {
        console.log('预览',file);
      },
      handleSuccess(res) {
        this.form.img = this.burl+res.data;
      },
      dload(img){
        location.href = img
      }
  },
};
</script>
