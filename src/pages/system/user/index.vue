<template>
   <q-page class="q-pa-sm">
     <q-card>
      <q-table
        :title="this.$route.meta.title"
        :data="data"
        :hide-header="mode === 'grid'"
        :columns="columns"
        row-key="name"
        :grid="mode=='grid'"
        :filter="filter"
        :pagination.sync="pagination"
      >
        <template v-slot:top-right="props">
          <eHeader :query="query" :roles="roles" :organizations="organizations" :props="props"  @exportTable="exportTable"/>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/user'
import { getRoles } from '@/api/role'
import { getOrganizationTree } from '@/api/organization'
import { parseTime } from '@/utils/index'
import { exportFile } from 'quasar'

import eHeader from './module/header'
// import edit from './module/edit'
// import updatePass from './module/updatePass'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== undefined ? formatFn(val) : val

  formatted =
            formatted === undefined || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}
export default {
  components: { eHeader },
  mixins: [initData],
  data () {
    return {
      roles: [],
      organizations: [],
      delLoading: false,
      sup_this: this,
      categorys: [],
      current_category: '',
      filter: '',
      mode: 'list',
      columns: [
        {
          name: 'username',
          required: true,
          label: '用户名',
          align: 'left',
          field: 'username',
          sortable: true
        },
        {
          name: 'name',
          align: 'left',
          label: '姓名',
          field: 'name',
          sortable: true
        },
        {
          name: 'mobile',
          align: 'left',
          label: '手机号',
          field: 'mobile',
          sortable: true
        },
        {
          name: 'email',
          align: 'left',
          label: '邮箱',
          field: 'email',
          sortable: true
        },
        {
          name: 'deparment',
          align: 'left',
          label: '部门',
          field: 'deparment',
          sortable: true
        },
        {
          name: 'position',
          align: 'left',
          label: '职位',
          field: 'position',
          sortable: true
        },
        {
          name: 'is_active',
          align: 'left',
          label: '状态',
          field: 'is_active',
          sortable: true
        }
      ]
    }
  },
  created () {
    this.getRoleALL()
    this.getOrganizations()
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit () {
      this.url = 'api/users/'
      const sort = 'id'
      const query = this.query
      const value = query.value
      const isActive = query.isActive
      this.params = { page: this.page, size: this.size, ordering: sort }
      if (isActive !== '' && isActive !== null) { this.params.isActive = isActive }
      if (value) { this.params.search = value }
      return true
    },
    subDelete (id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功!',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err)
      })
    },
    getOrganizations () {
      getOrganizationTree().then(res => {
        this.organizations = res.detail
      })
    },
    getRoleALL () {
      getRoles().then(res => {
        const newres = res.results.map(item => {
          return { ...item, label: item.name }
        })
        this.roles = newres
      })
    },
    exportTable () {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.data.map(row =>
            this.columns
              .map(col =>
                wrapCsvValue(
                  typeof col.field === 'function'
                    ? col.field(row)
                    : row[col.field === undefined ? col.name : col.field],
                  col.format
                )
              )
              .join(',')
          )
        )
        .join('\r\n')

      const status = exportFile('customer-management.csv', content, 'text/csv')

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
