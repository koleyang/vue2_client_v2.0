<template>
  <div>
    <el-row>
      <el-col
        class="row-wrapper"
        v-for="(o, index) in list"
        :key="index"
        :span="4"
        :offset="index % offset !== 0 ? 1 : 0"
      >
      <list-item :item="o" class="row-offset"></list-item>
      </el-col>
    </el-row>
    <!-- <p>{{ testData }}</p> -->
  </div>
</template>

<script>
import ListItem from './list-item'
import { list } from '@/api/plan'
import { mapGetters } from 'vuex'

export default {
  name: 'PlanList',
  data() {
    return {
      currentDate: new Date(),
      list: [],
      offset: 5
    }
  },
  components: {
    ListItem
  },
  computed: {
    ...mapGetters([
      'testData',
      'num'
    ])
  },
  created() {
    this.getList()
  },
  mounted() {
    setInterval(() => {
      this.$store.dispatch('getOrderQueryList')
      // console.log(this.num);
    }, 1000)
  },
  methods: {
    getList() {
      list().then(response => {
        console.log(response.data)
        this.list = response.data
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .row-wrapper {
    padding: 20px;
  }
  .row-offset {
    margin-top: 15px;
  }
</style>
