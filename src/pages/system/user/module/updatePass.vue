<template>
  <q-dialog v-model="dialog" >
    <q-card style="width: 600px; max-width: 60vw;">
      <q-card-section>
        <div class="text-h6">
          修改密码
          <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
        </div>
      </q-card-section>
      <q-separator inset></q-separator>
      <q-card-section class="q-pt-none">
        <q-form ref="form" class="q-gutter-md">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">新密码</q-item-label>
                <q-input dense outlined
                v-model="formData.new_password1"
                :error-message="getErroMsg('new_password1')"
                :error="$v.formData.new_password1.$invalid"
                type="password"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">确认密码</q-item-label>
                <q-input dense outlined
                v-model="formData.new_password2"
                :error-message="getErroMsg('new_password2')"
                :error="$v.formData.new_password2.$invalid"
                type="password"/>
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
import { updatePasswd } from '@/api/user'
import { required, sameAs, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  props: {
    // index.vue 的this 可用于刷新数据
    sup_this: {
      type: Object,
      required: true
    }
  },
  validations: {
    formData: {
      new_password1: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20)
      },
      new_password2: {
        sameAsPassword: sameAs('new_password1')
      }
    }
  },
  data () {
    return {
      id: 0,
      loading: false,
      dialog: false,
      formData: { new_password1: '', new_password2: '' }
    }
  },
  methods: {
    getErroMsg (field) {
      if (field === 'new_password1') {
        if (!this.$v.formData.new_password1.required) return '请输入新密码'
        if (!this.$v.formData.new_password1.minLength) return '密码长度不能小于6位'
        if (!this.$v.formData.new_password1.maxLength) return '密码长度不能大于20位'
      }
      if (field === 'new_password2') {
        if (!this.$v.formData.new_password2.sameAsPassword) return '两次输入的密码不一致'
      }
    },
    cancel () {
      this.resetForm()
    },
    doSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      } else {
        this.$q.loadingBar.start()
        updatePasswd(this.id, this.formData).then(res => {
            this.resetForm()
            this.$q.notify({
              message: '修改密码成功!'
            })
            this.$q.loadingBar.stop()
            // this.sup_this.init({
            //   pagination: this.sup_this.pagination,
            //   filter: undefined
            // })
          }).catch(err => {
            this.$q.loadingBar.stop()
            console.log(err)
          })
      }
    },
    resetForm () {
      this.$refs.form.resetValidation()
      this.id = 0
      this.formData = { new_password1: '', new_password2: '' }
    }
  }
}
</script>

<style scoped>

</style>
