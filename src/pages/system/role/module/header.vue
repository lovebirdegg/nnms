<template>
  <div class="row">
    <q-btn @click="toAdd()" outline color="primary" label="新增" class="q-mr-xs"/>
    <q-input outlined dense debounce="300" v-model="query.value" placeholder="输入关键字搜索">
      <template v-slot:append>
        <q-btn flat round color="primary" icon="search" @click="toQuery()"/>
      </template>
    </q-input>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
// 查询条件
export default {
  props: {
    props: {
      type: Object,
      required: true
    },
    query: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    checkPermission,
    // 去查询
    toQuery () {
      console.log('toQuery')
      this.sup_this.pagination.page = 1
      this.sup_this.init({
        pagination: this.sup_this.pagination,
        filter: undefined
      })
    },
    toAdd () {
      console.log(this.sup_this)
      this.sup_this.$refs.form.resetForm()
      this.sup_this.$refs.form.isAdd = true
      this.sup_this.$refs.form.dialog = true
    }
  }
}
</script>
