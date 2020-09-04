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
        <q-form class="q-gutter-md">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">用户名</q-item-label>
                <q-input dense outlined v-model="form.username" label="用户名"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">姓名</q-item-label>
                <q-input dense outlined v-model="form.name" label="姓名"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">邮箱</q-item-label>
                <q-input dense outlined v-model="form.email" label="邮箱"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">手机</q-item-label>
                <q-input dense outlined v-model="form.mobile" label="手机"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">部门</q-item-label>
                <treeselect v-model="form.department" :options="organizations" style="width: 300px;" placeholder="请选择部门" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">职位</q-item-label>
                <q-input dense outlined v-model="form.position" label="手机"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">状态</q-item-label>
                <q-radio v-model="form.is_active" val="true" label="激活" />
                <q-radio v-model="form.is_active" val="false" label="锁定" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">上级主管</q-item-label>
                <treeselect v-model="form.superior" :options="orgusers" :disable-branch-nodes="true" style="width: 300px;" placeholder="请选择上级主管" />
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
        <q-btn label="确认" type="submit" color="primary" @click="doSubmit"/>
        <!-- <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button> -->
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { add, edit } from '@/api/user'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { isvalidPhone } from '@/utils/validate'
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号码'))
  } else if (!isvalidPhone(value)) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}
export default {
  name: 'Form',
  components: { Treeselect },
  props: {
    organizations: {
      type: Array,
      required: true
    },
    orgusers: {
      type: Array,
      required: true
    },
    roles: {
      type: Array,
      required: true
    },
    isAdd: {
      type: Boolean,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dialog: false,
      loading: false,
      form: { username: '', name: '', mobile: '', department: null, superior: null, position: '', email: '', is_active: 'false', roles: [] },
      roleIds: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        email: [
          { message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { trigger: 'blur', validator: validPhone }
        ],
        is_active: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel () {
      this.resetForm()
    },
    doSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.form.roles = []
          const _this = this
          this.roleIds.forEach(function (data, index) {
            _this.form.roles.push(data)
          })
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        } else {
          return false
        }
      })
    },
    doAdd () {
      add(this.form).then(res => {
        this.resetForm()
        this.$message({
          showClose: true,
          type: 'success',
          message: '添加成功!默认密码123456!',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    doEdit () {
      edit(this.form.id, this.form).then(res => {
        this.resetForm()
        this.$message({
          showClose: true,
          type: 'success',
          message: '修改成功!',
          duration: 2500
        })
        this.loading = false
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm () {
      this.dialog = false
      this.$refs.form.resetFields()
      this.roleIds = []
      this.form = { username: '', name: '', mobile: '', department: null, superior: null, position: '', email: '', is_active: 'false', roles: [] }
    }
  }
}
</script>

<style scoped>

</style>
