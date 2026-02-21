<template>
  <div class="home">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item v-for="item in notices" :key="item.id" :title="item.name + ' ' + item.time" :name="item.id">
        <div>{{ item.content }}</div>
      </el-collapse-item>
      
    </el-collapse>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: 'HomeView',
  components: {
  },
  data() {
    return {
      activeName: '1',
      notices: []
    };
  },
  mounted() {
    this.getNotices();
  },
  methods: {
    getNotices() {
      request.get('/notice/getTop5').then(res => {
        if (res.code === '200') {
          this.notices = res.data;
          this.activeName = this.notices[0].id;
        }else{
          this.$message.error(res.msg);
        }
      })
    }
  }
}
</script>
<style scoped>
.home {
  padding: 20px;
  width: 50%;
  font-size: 16px;
}
</style>
