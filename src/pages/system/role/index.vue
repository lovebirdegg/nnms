<template>
  <q-page class="q-pa-sm">
    <eForm ref="form" :isAdd="true" :sup_this="sup_this"/>
    <div class="row">
      <div class="col shadow-6 padding-10">
        <q-card>
          <q-table
            :title="this.$route.meta.title"
            :data="data"
            :columns="columns"
            row-key="name"
            :filter="filter"
            no-data-label="没有数据"
            :pagination.sync="pagination"
            @request="init"
            style="height: 580px;">
            <template v-slot:body="props">
              <q-tr :props="props" @click="handleCurrentChange(props.row)">
                <q-td key="name" :props="props">{{ props.row.name }}</q-td>
                <q-td key="action" :props="props">
                  <q-btn dense color="primary" label="编辑"  @click="edit(props.row)" :disabled="props.row.id === 1"/>
                  <q-btn dense color="red" label="删除" :disabled="props.row.id === 1">
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
                :sup_this="sup_this"
                @init="init"/>
            </template>
          </q-table>
        </q-card>
      </div>
      <div class="col shadow-6 padding-10" style="margin-left:10px">
        <q-card inline class="fit">
          <q-card-section>
            <div class = "row">
              <div class="text-h6 col">
                菜单分配-{{row_data ? row_data.name : ""}}
              </div>
              <div class="column items-end">
                <q-btn v-if="this.row_data" color="secondary" size="md" icon-right="done" label="保存" @click="is_permissions=false;toSave()"/>
              </div>
            </div>
          </q-card-section>
          <q-separator inset></q-separator>
          <q-card-section>
            <q-scroll-area style="height: 580px;">
              <q-tree :nodes="menu_list"
                default-expand-all
                tick-strategy="leaf"
                :selected.sync="menuSelected"
                :ticked.sync="menuIds"
                node-key="id">
                  <template v-slot:default-header="prop">
                      <div class="row items-center">
                      <div>{{ prop.node.label }}</div>
                      </div>
                  </template>
              </q-tree>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
      <div class="col shadow-6 padding-10" style="margin-left:10px">
        <q-card inline class="fit">
          <q-card-section>
            <div class = "row">
              <div class="text-h6 col">
                权限分配-{{row_data ? row_data.name : ""}}
              </div>
              <div class="column items-end">
                <q-btn  v-if="this.row_data" color="secondary" size="md" icon-right="done" label="保存"  @click="is_permissions=true; toSave()"/>
              </div>
            </div>
          </q-card-section>
          <q-separator inset></q-separator>
          <q-card-section>
              <q-scroll-area style="height: 580px;">
                <q-tree
                  :nodes="permission_list"
                  default-expand-all
                  tick-strategy="leaf"
                  :selected.sync="permissionSelected"
                  :ticked.sync="permissionIds"
                  node-key="id">
                    <template v-slot:default-header="prop">
                        <div class="row items-center">
                        <div>{{ prop.node.label }}</div>
                        </div>
                    </template>
                </q-tree>
              </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, save } from '@/api/role'
import { getMenuTree } from '@/api/menu'
import { getPermissionTree } from '@/api/permission'

import { parseTime } from '@/utils/index'

import eHeader from './module/header'
import eForm from './module/form'

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
      permission_list: [],
      menu_list: [],
      permissionIds: [],
      menuIds: [],
      permissionSelected: 0,
      menuSelected: 0,
      row_data: null,
      is_permissions: false,
      columns: [
        {
          name: 'name',
          align: 'left',
          label: '名称',
          field: 'name'
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
      this.getPermissions()
      this.getMenus()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit () {
      this.url = 'api/roles/'
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
      this.$refs.form.isAdd = false
      this.$refs.form.formData = formData
      this.$refs.form.dialog = true
    },
    getMenus () {
      if (Array.isArray(this.menu_list) && this.menu_list.length === 0) {
        getMenuTree().then(res => {
          this.menu_list = res.detail
          console.log(this.menu_list)
        })
      }
    },
    getPermissions () {
      if (Array.isArray(this.permission_list) && this.permission_list.length === 0) {
        getPermissionTree().then(res => {
          this.permission_list = res.detail
          console.log(this.permission_list)
        })
      }
    },
    handleCurrentChange (row) {
      console.log(row)
      if (row.id !== 1) {
        // if (this.show) {
        //   // 清空选中状态
        //   this.$refs.permission.setCheckedKeys([])
        //   this.$refs.menu.setCheckedKeys([])
        // }
        this.permissionIds = []
        this.menuIds = []
        this.span = 8
        this.row_data = row
        if (this.row_data) {
          this.permissionIds = this.row_data.permissions
          this.menuIds = this.row_data.menus
        }
      } else {
        this.$q.notify({
          message: '默认管理员不可修改!',
          color: 'red'
        })
      }
    },
    toSave () {
      let form = { menus: this.menuIds }
      if (this.is_permissions) {
        form = { permissions: this.permissionIds }
      }
      save(this.row_data.id, form).then(res => {
        this.$q.notify({
          message: '保存成功!'
        })
        this.init({
          pagination: this.pagination,
          filter: undefined
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}

</script>
<style scoped>

</style>
