<template>
  <q-page class="q-pa-sm">
    <div class="row">
        <div class="col-4 shadow-6 padding-10">
            <q-card inline class="fit">
                <q-card-section>
                    <div class="q-mb-sm">
                        <q-btn size="sm" color="primary" label="新建字典" @click="isAdd = true;resetForm()"/>
                    </div>
                    <q-separator inset></q-separator>
                    <q-scroll-area style="height: 580px;">
                        <q-tree :nodes="data" default-expand-all :selected.sync="selected" node-key="id">
                            <template v-slot:default-header="prop">
                                <div class="row items-center">
                                <div>{{ prop.node.key }}-{{ prop.node.value }}</div>
                                </div>
                            </template>
                        </q-tree>
                    </q-scroll-area>
                </q-card-section>
            </q-card>
        </div>
        <div class="col-7 shadow-6" style="margin-left:10px">
            <q-card inline class="fit">
                <q-card-section>
                    <q-chip icon="edit">{{formData.id ? "编辑字典" : "新建字典"}}</q-chip>
                </q-card-section>
                <q-card-section>
                    <q-form class="q-gutter-md" ref="form">
                        <q-list>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="q-pb-xs">KEY</q-item-label>
                                        <q-input
                                            dense outlined
                                            v-model="formData.key"
                                            label='KEY'
                                            :error="$v.formData.key.$error"
                                            :error-message="getErroMsg('key')"
                                            @blur="$v.formData.key.$touch" />
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="q-pb-xs">VALUE</q-item-label>
                                        <q-input
                                            dense outlined
                                            v-model="formData.value"
                                            label='VALUE'
                                            :error="$v.formData.value.$error"
                                            :error-message="getErroMsg('value')"
                                            @blur="$v.formData.value.$touch" />
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="q-pb-xs">父级字典</q-item-label>
                                    <treeselect v-model="formData.pid" :options="dicts" style="width: 300px;" placeholder="请选择父级菜单" />
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="q-pb-xs">描述</q-item-label>
                                        <q-input
                                            dense outlined
                                            v-model="formData.desc"
                                            label='描述' />
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-form>
                </q-card-section>
                <q-separator />
                <q-card-actions>
                  <q-btn
                    color="primary"
                    class="wd-80"
                    type="submit"
                    @click="doSubmit">保存</q-btn>
                  <q-btn class="wd-80" @click="resetForm">重置</q-btn>
                  <q-space />
                  <q-btn color="negative" class="wd-80" v-if="!isAdd" label="删除">
                    <q-menu :offset="[0,25]">
                        <div class="row q-pa-md">
                            确定删除吗,如果存在下级节点则节点上升，此操作不能撤销！
                        </div>
                        <div class="row q-pa-md justify-end">
                            <q-btn
                            color="white"
                            text-color="black"
                            label="取消"
                            push
                            v-close-popup/>
                            <q-btn color="primary" push label="确定" @click="subDelete()" v-close-popup/>
                        </div>
                    </q-menu>
                  </q-btn>
                </q-card-actions>
            </q-card>
        </div>
    </div>
  </q-page>
</template>
<script>

import checkPermission from '@/utils/permission' // 权限判断函数
import initData from '@/mixins/initData'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { add, edit, del, getDictTree } from '@/api/dict'

import { parseTime } from '@/utils/index'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'

export default {
  components: { Treeselect },
  mixins: [initData],
  data () {
    return {
      formData: {
        id: null,
        key: '',
        value: '',
        desc: '',
        pid: null
      },
      delLoading: false,
      selected: 0,
      dicts: [],
      fixed1: false,
      isAdd: true
    }
  },
  validations: {
    formData: {
      key: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(20)
      },
      value: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(20)
      }
    }
  },
  created () {
    this.getDicts()
    this.$nextTick(() => {
      this.pagination.rowsPerPage = 100
      this.init({
        pagination: this.pagination,
        filter: undefined
      })
    })
  },
  watch: {
    'selected' () {
      if (this.selected) {
        this.onRefeshDictDetail(this.selected)
      }
    }
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit () {
      this.url = 'api/dicts/'
      const sort = 'id'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, ordering: sort }
      if (value) { this.params.search = value }
      return true
    },
    getErroMsg (field) {
      if (field === 'key') {
        if (!this.$v.formData.key.required) return '请输入key'
        if (!this.$v.formData.key.minLength) return 'key不能小于2位'
        if (!this.$v.formData.key.maxLength) return 'key不能大于20位'
      }
      if (field === 'value') {
        if (!this.$v.formData.value.required) return '请输入key'
        if (!this.$v.formData.value.minLength) return 'key不能小于2位'
        if (!this.$v.formData.value.maxLength) return 'key不能大于20位'
      }
    },
    getDicts () {
      getDictTree().then(res => {
        this.dicts = res.detail
      })
    },
    doSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      } else {
        if (this.isAdd) {
          this.doAdd()
        } else this.doEdit()
      }
    },
    doAdd () {
      add(this.formData).then(res => {
        this.resetForm()
        this.$q.notify({
          message: '添加成功!'
        })
        this.loading = false
        this.init({
          pagination: this.pagination,
          filter: undefined
        })
        this.getDicts()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    doEdit () {
      edit(this.formData.id, this.formData).then(res => {
        this.resetForm()
        this.$q.notify({
          message: '修改成功!'
        })
        this.loading = false
        this.init({
          pagination: this.pagination,
          filter: undefined
        })
        this.getDicts()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm () {
      this.isAdd = true
      this.formData = {
        id: null,
        key: '',
        value: '',
        desc: '',
        pid: null
      }
    },
    findDictById (id) {
      let dict = {}
      //   const _this = this
      const getDict = function (dictList) {
        for (var item of dictList) {
          if (item.id === id) {
            // _this.editingMenu = item // 正在编辑的菜单,引用原始菜单
            dict = Object.assign({}, item)
            dict.children = null
            break
          } else {
            if (item.children && item.children.length > 0) {
              getDict(item.children)
            }
          }
        }
      }
      getDict(this.data)
      return dict
    },
    onRefeshDictDetail (id) {
      if (!id || this.formData.id === id) {
        this.editingMenu = {}
        this.formData = {
          id: null,
          pid: null
        }
        return true
      }
      const dict = this.findDictById(id)
      this.isAdd = false
      this.formData = dict
    },
    subDelete () {
      if (this.formData.id) {
        del(this.formData.id).then(res => {
          this.resetForm()
          this.$q.notify({
            message: '删除成功!'
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
}
</script>
