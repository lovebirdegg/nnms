<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div id="particles-js" :class="$q.dark.isActive?'dark_gradient':'normal_gradient'"></div>
        <q-btn color="white" class="absolute-top-right" flat round @click="$q.dark.toggle()"
               :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"/>
        <q-card class="login-form" v-bind:style="$q.platform.is.mobile?{'width': '80%'}:{'width':'30%'}">
          <q-img src="images/pharmacy.jpg"></q-img>
          <q-card-section>
            <q-avatar size="74px" class="absolute" style="top: 0;right: 25px;transform: translateY(-50%);">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">
                登录
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              class="q-gutter-md"
            >
              <q-input
                filled
                v-model="username"
                label="用户名"
                lazy-rules
              />

              <q-input
                type="password"
                filled
                v-model="password"
                label="密码"
                lazy-rules

              />

              <div>
                <q-btn label="登录"  type="button" color="primary" @click.native.prevent="handleLogin"/>
                <a style="font-size: 30px;" class="float-right" href="https://github.com/sponsors/mayank091193"
                   target="_blank" title="Donate"><i class="fas fa-heart" style="color: #eb5daa"></i></a>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script type="text/javascript">
</script>
<script>
// import { login, getInfo } from '@/api/login'

export default {
    data() {
        return {
            username: 'admin',
            password: 'admin123'
        }
    },
    mounted() {

    },
    methods:{
      handleLogin() {
        const user = {
          username: 'admin',
          password: 'admin123',
          // rememberMe: this.loginForm.rememberMe
          }
          this.$store.dispatch('Login', user).then(() => {
            // this.loading = false
            this.$router.push({ path: this.redirect || '/Index' })
          }).catch(() => {
            // this.loading = false
          })
      }
    }
}
</script>

<style>
  #particles-js {
    position: absolute;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
  }
  .normal_gradient{
    background: linear-gradient(145deg, rgb(74, 94, 137) 15%, #b61924 70%);
  }
  .dark_gradient{
    background: linear-gradient(145deg, rgb(11, 26, 61) 15%, #4c1014 70%);
  }
  .login-form {
    position: absolute;
  }
</style>
