<template>
  <div class="row">
    <q-btn @click="$refs.form.dialog = true; getOrgUserTree()" outline color="primary" label="新增" class="q-mr-xs"/>
    <q-input outlined dense debounce="300" v-model="query.value" placeholder="输入关键字搜索1">
      <template v-slot:append>
        <q-btn flat round color="primary" icon="search" @click="toQuery()"/>
      </template>
    </q-input>
    <q-btn
      flat
      round
      dense
      :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
      @click="props.toggleFullscreen"
      v-if="mode === 'list'"
    >
      <q-tooltip
        :disable="$q.platform.is.mobile"
        v-close-popup
      >{{props.inFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}}
      </q-tooltip>
    </q-btn>

    <q-btn
      flat
      round
      dense
      :icon="mode === 'grid' ? 'list' : 'grid_on'"
      @click="mode = mode === 'grid' ? 'list' : 'grid';
      separator = mode === 'grid' ? 'none' : 'horizontal'"
      v-if="!props.inFullscreen"
    >
      <q-tooltip
        :disable="$q.platform.is.mobile"
        v-close-popup
      >{{mode==='grid' ? 'List' : 'Grid'}}
      </q-tooltip>
    </q-btn>

    <q-btn
      color="primary"
      icon-right="archive"
      label="导出CSV"
      no-caps
      @click="exportTable()"
    />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { getOrganizationUserTree } from '@/api/organization'
// import eForm from './form'
// 查询条件
export default {
  // components: { eForm },
  props: {
    organizations: {
      type: Array,
      required: true
    },
    roles: {
      type: Array,
      required: true
    },
    props: {
      type: Object,
      required: true
    },
    query: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      orgusers: [],
      downloadLoading: false,
      mode: 'list',
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ]
    }
  },
  methods: {
    checkPermission,
    // 去查询
    toQuery () {
      console.log('toQuery')
      console.log(this)
      this.$parent.$parent.$parent.$parent.page = 1
      this.$parent.$parent.$parent.$parent.init()
    },
    // 导出
    getOrgUserTree () {
      getOrganizationUserTree().then(res => {
        this.orgusers = res.detail
      })
    },
    download () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '用户名', '邮箱', '头像地址', '状态', '注册日期', '最后修改密码日期']
        const filterVal = ['id', 'username', 'email', 'avatar', 'is_active', 'createTime', 'lastPasswordResetTime']
        const data = this.formatJson(filterVal, this.$parent.data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    // 数据转换
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'is_active') {
          return v[j] ? '启用' : '禁用'
        } else {
          return v[j]
        }
      }))
    },
    exportTable () {
      this.$emit('exportTable')
    }
  }
}
</script>
