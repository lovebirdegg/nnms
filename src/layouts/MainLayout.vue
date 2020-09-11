<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated reveal :class="$q.dark.isActive?'header_dark':'header_normal'">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          NNMS
        </q-toolbar-title>
        <q-btn round dense flat color="white" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                 @click="$q.fullscreen.toggle()"
                 v-if="$q.screen.gt.sm">
          </q-btn>
        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <q-btn class="q-mr-xs" flat round @click="$q.dark.toggle()"
               :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"/>
        <!-- <a style="font-size: 25px;" class="float-right q-mr-sm" href="https://github.com/sponsors/mayank091193"
           target="_blank" title="Donate"><i class="fas fa-heart" style="color: #eb5daa"></i></a> -->
        <!-- <q-btn flat round dense icon="search" class="q-mr-xs"/> -->
        <q-btn flat round dense icon="exit_to_app" @click="logout()"/>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <div class="full-height" :class="$q.dark.isActive?'drawer_dark':'drawer_normal'">
        <div style="height: calc(100% - 117px);padding:10px;">
          <q-toolbar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-toolbar-title>Mayank Patel</q-toolbar-title>
          </q-toolbar>
          <hr/>
          <q-scroll-area style="height:100%;">
            <q-list padding>
              <q-item active-class="tab-active" to="/dashboard_v3" exact class="q-ma-sm navigation-item" clickable
                      v-ripple>
                <q-item-section avatar>
                  <q-icon name="dashboard"/>
                </q-item-section>
                <q-item-section>
                  Dashboard v3
                </q-item-section>
              </q-item>
              <q-item active-class="tab-active" to="/dashboard_v2"  class="q-ma-sm navigation-item" clickable
                      v-ripple>
                <q-item-section avatar>
                  <q-icon name="dashboard"/>
                </q-item-section>

                <q-item-section>
                  Dashboard v2
                </q-item-section>
              </q-item>
              <q-item active-class="tab-active" to="/dashboard_v4"  class="q-ma-sm navigation-item" clickable
                      v-ripple>
                <q-item-section avatar>
                  <q-icon name="dashboard"/>
                </q-item-section>
                <q-item-section>
                  Dashboard v4
                </q-item-section>
              </q-item>
              <div v-for="route in permission_routers" :key="route.id" :item="route">
                <div v-if="!route.hidden&&route.children">
                  <!-- <template v-if="hasOneShowingChild(route.children,route) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!route.alwaysShow" class="q-ma-sm navigation-item" :to="resolvePath(route.path,onlyOneChild.path)">
                    <q-item  exact active-class="q-item-no-link-highlighting" :key="onlyOneChild.name">
                      <q-item-section avatar>
                        <q-icon name="date_range"/>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{route.name}}</q-item-label>
                      </q-item-section>
                    </q-item>
                    </template> -->
                  <q-expansion-item
                    v-if="route.meta"
                    :icon="route.meta.icon || 'menu_open'"
                    :key="route.is"
                    :label="route.meta.title">
                    <template v-for="child in route.children" >
                      <q-item v-if="!child.hidden"  :to="resolvePath(route.path,child.path)" :key="child.id" :item="child" class="q-ml-xl" style="margin-left: 55px  !important;" active-class="tab-active">
                        <q-item-section avatar v-if="!child.hidden">
                          <q-icon :name="child.meta.icon || 'menu_open'"/>
                        </q-item-section>
                        <q-item-section v-if="!child.hidden">
                          <q-item-label>{{child.name}}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>

                  </q-expansion-item>
                </div>
              </div>
            </q-list>
          </q-scroll-area>
        </div>
      </div>
    </q-drawer>
    <q-page-container>
      <tags-view/>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import EssentialLink from 'components/EssentialLink.vue'
import { mapGetters } from 'vuex'
import { isExternal } from '@/utils'
import path from 'path'
import TagsView from './components/TagsView'

export default {
  name: 'MainLayout',
  components: { TagsView },
  props: {
    basePath: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  created () {
    console.log(this.permission_routers)
  },
  data () {
    return {
      leftDrawerOpen: false,
      onlyOneChild: null
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    hasOneShowingChild (children, parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath (basePath, routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(basePath, routePath)
    },
    isExternalLink (routePath) {
      return isExternal(routePath)
    }
  }
}
</script>
<style>
  .q-drawer {
    /*background-image: url(https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg) !important;*/
    /* background-image: url('/statics/images/lake.jpg') !important; */
    background-size: cover !important;
  }

  .drawer_normal {
    background-color: rgba(1, 1, 1, 0.75);
  }

  .drawer_dark {
    background-color: #010101f2;
  }

  .navigation-item {
    border-radius: 5px;
  }

  .tab-active {
    background-color: green;
  }

  body {
    background: #f1f1f1 !important;
  }

  .header_normal {
    background: linear-gradient(145deg, rgb(32, 106, 80) 15%, rgb(21, 57, 102) 70%);
  }

  .header_dark {
    background: linear-gradient(145deg, rgb(61, 14, 42) 15%, rgb(14, 43, 78) 70%);
  }
</style>
