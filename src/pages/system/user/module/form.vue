<template>
  <q-dialog v-model="dialog">
    <q-card style="width: 600px; max-width: 60vw;">
      <q-card-section>
        <div class="text-h6">
          {{isAdd ? '新增用户' : '编辑用户'}}
          <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
        </div>
      </q-card-section>
      <q-separator inset></q-separator>
      <q-card-section class="q-pt-none">
        <q-form class="q-gutter-md" ref="form">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">用户名</q-item-label>
                <q-input dense outlined
                v-model="formData.username"
                label="用户名"
                :error-message="getErroMsg('username')"
                :error="$v.formData.username.$invalid"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">姓名</q-item-label>
                <q-input dense outlined
                v-model="formData.name"
                label="姓名"
                :error-message="getErroMsg('name')"
                :error="$v.formData.name.$invalid"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">邮箱</q-item-label>
                <q-input dense outlined v-model="formData.email" label="邮箱"
                :error-message="getErroMsg('email')"
                :error="$v.formData.email.$invalid"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">手机</q-item-label>
                <q-input dense outlined v-model="formData.mobile" label="手机"
                :error-message="getErroMsg('mobile')"
                :error="$v.formData.mobile.$invalid"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">部门</q-item-label>
                <treeselect v-model="formData.department" :options="organizations" style="width: 300px;" placeholder="请选择部门" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">职位</q-item-label>
                <q-input dense outlined v-model="formData.position" label="职位"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">状态</q-item-label>
                <div class="q-gutter-sm">
                  <q-radio v-model="formData.is_active" val="true" label="激活" />
                  <q-radio v-model="formData.is_active" val="false" label="锁定" />
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">上级主管</q-item-label>
                <treeselect v-model="formData.superior" :options="orgusers" :disable-branch-nodes="true" style="width: 300px;" placeholder="请选择上级主管" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">角色</q-item-label>
                <treeselect v-model="roleIds" :multiple="true" :options="roles" style="width: 360px;" placeholder="请选择角色" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" class="text-teal">
        <q-btn label="Reset" type="reset" color="primary" @click="resetForm" flat class="q-ml-sm" />
        <q-btn label="确认" type="submit" color="primary" @click="doSubmit"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { add, edit } from '@/api/user'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { isvalidPhone } from '@/utils/validate'
import { required, minLength, email, maxLength } from 'vuelidate/lib/validators'
import { getOrganizationTree, getOrganizationUserTree } from '@/api/organization'

import { getRoles } from '@/api/role'

// var validPhone = (rule, value, callback) => {
//   if (!value) {
//     callback(new Error('请输入手机号码'))
//   } else if (!isvalidPhone(value)) {
//     callback(new Error('请输入正确的11位手机号码'))
//   } else {
//     callback()
//   }
// }
export default {
  name: 'Form',
  components: { Treeselect },
  props: {
    sup_this: {
      type: Object,
      default: null
    }
  },
  created () {
    this.getRoleALL()
    this.getOrganizations()
    this.getOrgUserTree()
  },
  data () {
    return {
      dialog: false,
      isAdd: true,
      organizations: [],
      roles: [],
      orgusers: [],
      formData: {
        username: '12346',
        name: '1234',
        mobile: '15689733554',
        department: null,
        superior: null,
        position: '',
        email: '',
        is_active: 'true',
        roles: []
      },
      roleIds: []
    }
  },
  validations: {
    formData: {
      username: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(20)
      },
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(10)
      },
      email: {
        required,
        email
      },
      mobile: {
        required,
        isvalidPhone
      }
    }
  },
  methods: {
    getErroMsg (field) {
      if (field === 'username') {
        if (!this.$v.formData.username.required) return '请输入用户名'
        if (!this.$v.formData.username.minLength) return '入用户名不能小于5位'
        if (!this.$v.formData.username.maxLength) return '入用户名不能大于20位'
      }
      if (field === 'name') {
        if (!this.$v.formData.name.required) return '请输入姓名'
        if (!this.$v.formData.name.minLength) return '姓名不能小于2位'
        if (!this.$v.formData.name.maxLength) return '姓名不能大于10位'
      }
      if (field === 'email') {
        if (!this.$v.formData.email.required) return '请输入邮箱'
        if (!this.$v.formData.email.email) return '请输入正确的邮箱'
      }
      if (field === 'mobile') {
        if (!this.$v.formData.mobile.required) return '请输入手机号'
        if (!this.$v.formData.mobile.isvalidPhone) return '请输入正确的11位手机号码'
      }
    },
    cancel () {
      this.$refs.form.resetValidation()
    },
    doSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      } else {
        this.$q.loadingBar.start()
        this.formData.roles = []
        const _this = this
        this.roleIds.forEach(function (data, index) {
          _this.formData.roles.push(data)
        })
        if (this.isAdd) {
          this.doAdd()
        } else this.doEdit()
      }
    },
    doAdd () {
      add(this.formData).then(res => {
        this.resetForm()
        this.$q.notify({
          message: '添加成功!默认密码123456!'
        })
        this.dialog = false
        this.$q.loadingBar.stop()
        console.log(this)
        this.sup_this.init()
      }).catch(err => {
        this.$q.loadingBar.stop()
        console.log(err)
      })
    },
    doEdit () {
      edit(this.formData.id, this.formData).then(res => {
        this.resetForm()
        this.dialog = false
        this.$q.notify({
          message: '修改成功'
        })
        this.$q.loadingBar.stop()
        this.sup_this.init()
      }).catch(err => {
        this.$q.loadingBar.stop()
        console.log(err)
      })
    },
    resetForm () {
      this.$q.loadingBar.stop()
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetValidation()
      }
      this.roleIds = []
      this.formData = { username: '', name: '', mobile: '', department: null, superior: null, position: '', email: '', is_active: 'true', roles: [] }
    },
    // 导出
    getOrgUserTree () {
      getOrganizationUserTree().then(res => {
        this.orgusers = res.detail
      })
    },
    getOrganizations () {
      getOrganizationTree().then(res => {
        console.log('getOrganizations')
        console.log(res.detail)
        this.organizations = res.detail
      })
    },
    getRoleALL () {
      getRoles().then(res => {
        console.log(res)
        const newres = res.map(item => {
          return { ...item, label: item.name }
        })
        this.roles = newres
      })
    }
  }
}
</script>

<style scoped>

</style>
