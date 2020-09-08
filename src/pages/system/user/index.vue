<template>
  <q-page class="q-pa-sm">
    <eForm ref="form" :isAdd="true" :sup_this="sup_this"/>
    <q-card>
      <q-table
        :title="this.$route.meta.title"
        :data="data"
        :hide-header="mode === 'grid'"
        :columns="columns"
        row-key="name"
        :grid="mode=='grid'"
        :filter="filter"
        no-data-label="没有数据"
        :pagination.sync="pagination"
        @request="init"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="username" :props="props">{{ props.row.username }}</q-td>
            <q-td key="name" :props="props">{{ props.row.name }}</q-td>
            <q-td key="mobile" :props="props">{{ props.row.mobile }}</q-td>
            <q-td key="email" :props="props">{{ props.row.email }}</q-td>
            <q-td key="deparment" :props="props">{{ props.row.department!== null ? props.row.department.name : ''}}</q-td>
            <q-td key="position" :props="props">{{ props.row.position }}</q-td>
            <q-td key="is_active" :props="props">{{ props.row.is_active ? "激活" : "锁定" }}</q-td>
            <q-td key="action" :props="props">
              <q-btn color="primary" label="编辑"  @click="edit(props.row)" :disabled="props.row.id === 1"/>
              <q-btn color="secondary" label="密码" :disabled="props.row.id === 1"/>
              <q-btn color="red" label="删除" :disabled="props.row.id === 1">
                <q-menu>
                  <div class="row q-pa-md">
                    确定删除本条数据吗？<br/>
                    所有关联的数据将会被清除
                  </div>
                  <div class="row q-pa-md justify-end">
                    <q-btn
                      color="white"
                      text-color="black"
                      label="取消"
                      push
                      v-close-popup/>
                    <q-btn color="primary" push label="确定" @click="subDelete(props.row.id)" v-close-popup/>
                  </div>
                </q-menu>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:top-right="props">
          <eHeader
            :query="query"
            :props="props"
            :listMode="mode"
            :sup_this="sup_this"
            @init="init"
            @changeMode="changeMode"
            @exportTable="exportTable"/>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/user'
// import { getOrganizationTree } from '@/api/organization'
import { parseTime } from '@/utils/index'
import { exportFile } from 'quasar'

import eHeader from './module/header'
import eForm from './module/form'

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
  components: { eHeader, eForm },
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
      showing: false,
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
        },
        {
          name: 'action',
          align: 'left',
          field: row => row.id,
          label: '操作'
        }
      ]
    }
  },
  created () {
    this.$nextTick(() => {
      this.init({
        pagination: this.pagination,
        filter: undefined
      })
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
      console.log(query)
      const isActive = query.is_active
      this.params = { page: this.page, size: this.size, ordering: sort }
      if (isActive !== '' && isActive !== null) { this.params.is_active = isActive }
      if (value) { this.params.search = value }
      return true
    },
    subDelete (id) {
      this.$q.loadingBar.start()
      del(id).then(res => {
        this.$q.loadingBar.stop()
        this.init({
          pagination: this.pagination,
          filter: undefined
        })
        this.$q.notify({
          message: '删除成功'
        })
      }).catch(err => {
        this.$q.loadingBar.stop()
        console.log(err)
      })
    },
    edit (row) {
      this.$refs.form.resetForm()
      const formData = JSON.parse(JSON.stringify(row))
      let did = null
      if (formData.department !== null) {
        did = formData.department.id
      }
      let uid = null
      if (formData.superior !== null) {
        uid = formData.superior.id
      }
      formData.department = did
      formData.superior = uid
      formData.is_active = formData.is_active.toString()

      const roleIds = []
      row.roles.forEach(function (data, index) {
        roleIds.push(data.id)
      })
      delete formData.image
      this.$refs.form.isAdd = false
      this.$refs.form.roleIds = roleIds
      this.$refs.form.formData = formData
      this.$refs.form.dialog = true
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
    },
    changeMode () {
      this.mode = this.mode === 'grid' ? 'list' : 'grid'
    }
  }
}
</script>

<style scoped>

</style>
