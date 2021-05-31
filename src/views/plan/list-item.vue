<template>
  <el-card :body-style="{ padding: '0px' }">
    <!-- <div class="float-tag">{{ item.title }}</div> -->
    <img
      :src="imgUrl"
      class="image"
    />
    <div style="padding: 14px">
      <span>{{ item.course }}</span>
      <div class="bottom clearfix">
        <time class="time">{{ item.startTime }}</time>
        <el-button type="text" class="button">操作按钮</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    item: [Object]
  },
  data() {
    return {
      currentDate: new Date(),
      // imgUrl: require('../../assets/views/plan/list-pic01.png')
      // imgUrl: require(`${this.item.imgPath}`)
      imgUrl: null
    }
  },
  components: {},
  created() {
    console.log(this.item)
    this.imgUrl = require(`../../assets` + this.item.imgPath)
  },
  mounted() {

  },
  computed: {
    imgPath: () => {
      // return require(`../../assets` + this.item.imgPath)
    }
  },
  methods: {}
}
</script>

<style scoped lang="scss">
  .time {
    font-size: 13px;
    color: #999;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .button {
    padding: 0;
    float: right;
  }
  .image {
    width: 100%;
    display: block;
  }
  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }
  .float-tag {
    width: 16.7%;
  }
</style>
