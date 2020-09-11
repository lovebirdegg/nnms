<template>
  <q-page class="q-pa-sm">
    <div class="row">
        <div class="col-4 shadow-6 padding-10">
            <q-card inline class="fit">
                <q-card-section>
                    <div class="q-mb-sm">
                        <q-btn size="sm" color="primary" label="新建菜单" @click="isAdd = true;resetForm()"/>
                    </div>
                    <q-separator inset></q-separator>
                    <q-scroll-area style="height: 580px;">
                        <q-tree :nodes="data" default-expand-all :selected.sync="selected" node-key="id">
                            <template v-slot:default-header="prop">
                                <div class="row items-center">
                                <q-icon :name="prop.node.icon || 'share'" size="28px" class="q-mr-sm" />
                                <div>{{ prop.node.name }}</div>
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
                    <!-- <q-chip square small :v-html="'\'' + (formData.id ? '编辑菜单' : '新建菜单') + '\''"></q-chip> -->
                    <q-chip icon="edit">{{formData.id ? "编辑菜单" : "新建菜单"}}</q-chip>
                </q-card-section>
                <q-card-section>
                    <q-form class="q-gutter-md" ref="form">
                        <q-list>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="q-pb-xs">菜单名称</q-item-label>
                                        <q-input
                                            dense outlined
                                            v-model="formData.name"
                                            label='菜单名称'
                                            :error="$v.formData.name.$error"
                                            :error-message="getErroMsg('name')"
                                            @blur="$v.formData.name.$touch" />
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="q-pb-xs">菜单图标</q-item-label>
                                    <q-input dense readonly outlined v-model="formData.icon" label="图标">
                                        <template v-slot:prepend>
                                            <q-icon :name="formData.icon" />
                                        </template>
                                        <template v-slot:append>
                                            <q-btn label="选取图标" color="primary" @click="fixed1=!fixed1" flat class="q-ml-sm" />
                                        </template>
                                    </q-input>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="q-pb-xs">菜单排序</q-item-label>
                                    <q-input dense outlined v-model="formData.sort" label="排序" />
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="q-pb-xs">链接地址</q-item-label>
                                    <q-input dense outlined v-model="formData.path" label="链接地址" />
                                </q-item-section>
                            </q-item>
                            <q-item v-if="formData.is_frame === 'false'">
                                <q-item-section>
                                    <q-item-label class="q-pb-xs">组件路径</q-item-label>
                                    <q-input dense outlined v-model="formData.component" label="组件路径" />
                                 </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="q-pb-xs">父级菜单</q-item-label>
                                    <treeselect v-model="formData.pid" :options="menus" style="width: 300px;" placeholder="请选择父级菜单" />
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="q-pb-xs">是否显示</q-item-label>
                                    <div class="q-gutter-sm">
                                        <q-radio v-model="formData.is_show" val="true" label="是" />
                                        <q-radio v-model="formData.is_show" val="false" label="否" />
                                    </div>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="q-pb-xs">内部菜单</q-item-label>
                                    <div class="q-gutter-sm">
                                        <q-radio v-model="formData.is_frame" val="true" label="显示" />
                                        <q-radio v-model="formData.is_frame" val="false" label="不显示" />
                                    </div>
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
                  <q-btn class="wd-80"  @click="resetForm">重置</q-btn>
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
    <q-dialog v-model="fixed1">
      <q-card style="min-width:760px;">
        <q-card-section>
            <div class="text-h6">
            图标选择
            <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
            </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section style="height: 38vh; row column">
          <q-scroll-area
            class="fit"
            ref="scrollArea">
            <div class="col q-col-gutter-xs">
              <q-btn
                flat
                v-for="icon in displayedIcons"
                :key="icon.name"
                :icon="icon.name"
                :color="`${(iconSelected && iconSelected===icon.name)?'primary':null}`"
                @click="iconSelected=icon.name"
              />
            </div>
          </q-scroll-area>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-sm flex flex-center">
          <q-pagination
            v-model="iconPagination.page"
            :max="iconPagination.totalPages"
            :input="true">
          </q-pagination>
        </q-card-section>
        <q-card-actions class="q-dialog-footer">
          <q-chip
            square
            color="primary"
            text-color="white"
            :icon="iconSelected"
            v-show="iconSelected">
            {{iconSelected}}
          </q-chip>
          <q-space />
          <q-btn
            :label="$q.lang.label.ok"
            color="primary"
            type="submit"
            @click="getIcon()"
            v-close-popup/>
          <q-btn
            :label="$q.lang.label.clear"
            @click="clearIcon()"
            v-close-popup/>
          <q-btn
            :label="$q.lang.label.cancel"
            v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>

import checkPermission from '@/utils/permission' // 权限判断函数
import initData from '@/mixins/initData'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { add, edit, del, getMenuTree } from '@/api/menu'
import { parseTime } from '@/utils/index'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'

// import eHeader from './module/header'
// import edit from './module/edit'
export default {
  components: { Treeselect },
  mixins: [initData],
  data () {
    return {
      formData: {
        id: null,
        pid: null,
        is_show: 'false',
        icon: '',
        name: '',
        is_frame: 'true',
        path: '',
        component: '',
        sort: 0
      },
      delLoading: false,
      sup_this: this,
      selected: 0,
      menus: [],
      fixed1: false,
      iconsList: [],
      iconSelected: null,
      isAdd: true,
      iconPagination: {
        page: 1,
        itemsPerPage: 96,
        totalPages: 0
      }
    }
  },
  validations: {
    formData: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(20)
      }
    }
  },
  created () {
    this.getMenus()
    this.$nextTick(() => {
      this.pagination.rowsPerPage = 100
      this.init({
        pagination: this.pagination,
        filter: undefined
      })
    })
  },
  beforeMount () {
    if (this.pagination) {
      this.$emit('update:pagination', { ...this.computedPagination })
    }
  },
  mounted () {
    this.__loadIconSet('material-icons')
    this.__updatePagination()
  },
  computed: {
    filteredIcons () {
      let icons = this.iconsList
      if (icons) {
        if (this.tags !== undefined && this.tags !== '' && this.tags !== null && this.tags.length > 0) {
          icons = icons.filter(icon => {
            const t = icon.tags.filter(tag => this.tags.includes(tag))
            if (t.length > 0) {
              return icon
            }
          })
        }
        if (this.filter !== undefined && this.filter !== '' && this.filter !== null) {
          icons = icons.filter(icon => icon.name.includes(this.filter))
        }
      }
      return icons
    },
    displayedIcons () {
      let icons = []
      if (this.iconsList) {
        icons = this.filteredIcons
        // should the icons be paged?
        if (this.iconPagination && this.iconPagination.itemsPerPage !== 0) {
          icons = icons.slice(this.firstItemIndex, this.lastItemIndex)
        }
      }
      return icons
    },
    computedPagination () {
      return this.__fixPagination({
        ...this.iconPagination
      })
    },
    // index of first item on a page
    firstItemIndex () {
      const { page, itemsPerPage } = this.computedPagination
      return (page - 1) * itemsPerPage
    },

    // index of last item on a page
    lastItemIndex () {
      const { page, itemsPerPage } = this.computedPagination
      return page * itemsPerPage
    },

    // returns true if on first page
    isFirstPage () {
      return this.computedPagination.page === 1
    },

    // the number of pages available based on itemsPerPage
    pagesNumber () {
      return this.computedPagination.itemsPerPage === 0
        ? 1
        : Math.max(
          1,
          Math.ceil(this.filteredIcons.length / this.computedPagination.itemsPerPage)
        )
    },

    // returns true if on last page
    isLastPage () {
      return this.lastItemIndex === 0
        ? true
        : this.computedPagination.page >= this.pagesNumber
    }
  },
  watch: {
    'selected' () {
      if (this.selected) {
        this.onRefeshMenuDetail(this.selected)
      }
    },
    'pNodeId' () {
      // if (this.pNodeId) {
      //   this.getNode(this.pNodeId)
      // }
    },
    'iconsList' (val) {
      if (this.iconsList !== undefined && this.iconsList.length > 0) {
        this.__updatePagination()
        this.$nextTick(() => {
          // whenever the icon set changes, it resets pagination page to page 1
          this.__setPagination({ page: 1 })
        })
        // scroll to top of QScrollArea, if applicable
        // this.$refs.scrollArea.setScrollPosition(0)
      }
    },
    'pagination' (newVal, oldVal) {
      if (!this.__samePagination(oldVal, newVal)) {
        this.__updatePagination()
      }
    },
    'pagination.itemsPerPage' () {
      this.__updatePagination()
    },

    'pagination.page' () {
      this.__updatePagination()
    }
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit () {
      this.url = 'api/menus/'
      const sort = 'sort'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, ordering: sort }
      if (value) { this.params.search = value }
      return true
    },
    getErroMsg (field) {
      if (field === 'name') {
        if (!this.$v.formData.name.required) return '请输入菜单名称'
        if (!this.$v.formData.name.minLength) return '菜单名不能小于2位'
        if (!this.$v.formData.name.maxLength) return '菜单名不能大于20位'
      }
    },
    getMenus () {
      getMenuTree().then(res => {
        this.menus = res.detail
      })
    },
    __loadIconSet (iconSet) {
      if (iconSet) {
        this.loading = true
        // detect if UMD version is installed
        if (window.IconPicker) {
          const name = iconSet.replace(/-([a-z])/g, g => g[1].toUpperCase())
          if (window.IconPicker.iconSet && window.IconPicker.iconSet[name]) {
            const iconsSet = window.IconPicker.iconSet[name]
            this.iconsList = iconsSet.icons
          } else {
            /* eslint-disable */
            console.error('IconPicker: no icon set loaded called ' + iconSet + '\'')
            console.error('Be sure to load the UMD version of the icon set in a script tag before using QIconPicker UMD version')
            /* eslint-enable */
          }
        } else {
          try {
            const iconsSet = require('assets/icon-set/' + iconSet + '.js').default
            this.iconsList = iconsSet.icons
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('IconPicker: cannot find icon set found called ' + iconSet + '\'')
          }
        }
        this.loading = false
      }
    },
    __fixPagination (p) {
      if (p.page < 1) {
        p.page = 1
      }
      if (p.itemsPerPage === undefined || p.itemsPerPage < 1) {
        p.itemsPerPage = 0 // all
      }
      return p
    },
    // returns true if the pagination is the same,
    // otherwise returns false if it has changed
    __samePagination (oldPag, newPag) {
      // eslint-disable-next-line no-unused-vars
      for (const prop in newPag) {
        if (newPag[prop] !== oldPag[prop]) {
          return false
        }
      }
      return true
    },

    __setPagination (val) {
      const newPagination = this.__fixPagination({
        ...this.computedPagination,
        ...val
      })

      // if (this.pagination) {
      //   this.$emit('update:pagination', newPagination)
      // } else {
      this.iconPagination = newPagination
      // }
    },

    __updatePagination () {
      if (this.iconPagination !== undefined) {
        this.__setPagination({ total: this.filteredIcons.length, totalPages: this.pagesNumber })
      }
    },

    // public function - goes to previous page
    prevPage () {
      const { page } = this.computedPagination
      if (page > 1) {
        this.__setPagination({ page: page - 1 })
      }
    },
    // public function - goes to next page
    nextPage () {
      const { page, itemsPerPage } = this.computedPagination
      if (this.lastItemIndex > 0 && page * itemsPerPage < this.filteredIcons.length) {
        this.__setPagination({ page: page + 1 })
      }
    },
    getIcon () {
      if (this.iconSelected) {
        this.formData.icon = this.iconSelected
      }
    },
    clearIcon () {
      this.formData.icon = null
      this.iconSelected = null
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
        this.getMenus()
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
        this.getMenus()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm () {
      this.isAdd = true
      this.formData = { name: '', sort: 999, path: '', component: '', is_show: 'true', is_frame: 'false', pid: null, icon: '' }
    },
    findMenuById (id) {
      let menu = {}
      //   const _this = this
      const getMenu = function (menuList) {
        for (var item of menuList) {
          if (item.id === id) {
            // _this.editingMenu = item // 正在编辑的菜单,引用原始菜单
            menu = Object.assign({}, item)
            menu.children = null
            break
          } else {
            if (item.children && item.children.length > 0) {
              getMenu(item.children)
            }
          }
        }
      }
      getMenu(this.data)
      return menu
    },
    onRefeshMenuDetail (id) {
      if (!id || this.formData.id === id) {
        this.editingMenu = {}
        this.formData = {
          id: 0,
          parentId: 0
        }
        return true
      }
      const menu = this.findMenuById(id)
      menu.is_show = menu.is_show.toString()
      menu.is_frame = menu.is_frame.toString()
      this.isAdd = false
      this.formData = menu
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
