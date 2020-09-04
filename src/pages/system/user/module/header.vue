<template>
  <div class="row">
    <q-btn @click="$refs.form.dialog = true; getOrgUserTree()" outline color="primary" label="新增" class="q-mr-xs"/>
    <eForm ref="form" :roles="roles" :organizations="organizations" :orgusers="orgusers" :is-add="true"/>
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
      v-if="listMode === 'list'"
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
      :icon="listMode === 'grid' ? 'list' : 'grid_on'"
      @click="changeMode()"
      v-if="!props.inFullscreen"
    >
      <q-tooltip
        :disable="$q.platform.is.mobile"
        v-close-popup
      >{{listMode==='grid' ? 'List' : 'Grid'}}
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
import eForm from './form'
// 查询条件
export default {
  components: { eForm },
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
    },
    listMode: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      orgusers: [],
      downloadLoading: false,
      mode1: this.listMode,
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
      this.$parent.$parent.$parent.$parent.page = 1
      this.$emit('init')
    },
    // 导出
    getOrgUserTree () {
      getOrganizationUserTree().then(res => {
        this.orgusers = res.detail
      })
    },
    exportTable () {
      this.$emit('exportTable')
    },
    changeMode () {
      this.$emit('changeMode')
    }
  }
}
</script>
