<template>
  <div>
    <div>
      <el-input
        placeholder="请输入酒店名称"
        size="medium"
        v-model="param.name"
        style="width: 200px; margin-right: 10px"
      ></el-input>
      <el-button type="warning" size="mini" @click="getTableData">查询</el-button>
      <el-button type="danger" size="mini" @click="reset">重置</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="hotelName" label="酒店名称"> </el-table-column>
      <el-table-column prop="userName" label="预定人员"> </el-table-column>
      <el-table-column prop="time" label="预约时间"> </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-popconfirm title="确定删除吗？" @confirm="deleteReserve(scope.row)">
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
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "hotel",
  data() {
    return {
      total: 0,
      tableData: [],
      param: {
        name: "",
        pageNum: 1,
        pageSize: 10,
      },
      form: {
        hotelName: "", 
        userName: "",
        time: "",
      },
      formLabelWidth: "100px",
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      request.get("/reserve/all", { params: this.param }).then((res) => {
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
    deleteReserve(row) {
      request.delete("/reserve/" + row.id).then((res) => {
        if (res.code === "200") {
          this.$message.success(res.msg);
          this.getTableData();
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
};
</script>
<style scoped>

</style>
