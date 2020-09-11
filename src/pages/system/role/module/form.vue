<template>
  <q-dialog v-model="dialog">
    <q-card style="width: 600px; max-width: 60vw;">
      <q-card-section>
        <div class="text-h6">
          {{isAdd ? '新增角色' : '编辑角色'}}
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
                v-model="formData.name"
                label="名称"
                :error-message="getErroMsg('name')"
                :error="$v.formData.name.$error"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">描述</q-item-label>
                <q-input dense outlined
                v-model="formData.desc"
                label="描述"
                :error-message="getErroMsg('desc')"
                :error="$v.formData.desc.$error"/>
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
import { add, edit } from '@/api/role'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'Form',
  props: {
    sup_this: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dialog: false,
      isAdd: true,
      formData: {
        id: null,
        name: '1234',
        desc: '15689733554'
      }
    }
  },
  validations: {
    formData: {
      name: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(20)
      },
      desc: {
        minLength: minLength(2),
        maxLength: maxLength(10)
      }
    }
  },
  methods: {
    getErroMsg (field) {
      if (field === 'name') {
        if (!this.$v.formData.name.required) return '请输入名称'
        if (!this.$v.formData.name.minLength) return '名称不能小于5位'
        if (!this.$v.formData.name.maxLength) return '名称不能大于20位'
      }
      if (field === 'desc') {
        if (!this.$v.formData.desc.minLength) return '描述不能小于2位'
        if (!this.$v.formData.desc.maxLength) return '描述不能大于10位'
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
        this.dialog = false
        this.$q.loadingBar.stop()
        console.log(this)
        this.sup_this.init({
          pagination: this.sup_this.pagination,
          filter: undefined
        })
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
        this.sup_this.init({
          pagination: this.sup_this.pagination,
          filter: undefined
        })
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
      this.formData = { name: '111', desc: '111', id: null }
    }
  }
}
</script>

<style scoped>

</style>
