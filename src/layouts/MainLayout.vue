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
          <div class="q-pa-md q-gutter-sm">
            <q-breadcrumbs active-color="white">
              <q-breadcrumbs-el
                v-for="item in levelList"
                :label="item.meta.title"
                :to="handleLink(item)"
                :key="item.path">

              </q-breadcrumbs-el>
            </q-breadcrumbs>
          </div>
        </q-toolbar-title>
        <q-btn round dense flat
          color="white"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
          @click="$q.fullscreen.toggle()"
          v-if="$q.screen.gt.sm">
        </q-btn>
        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <q-btn class="q-mr-xs"
          flat round
          icon="notifications">
          <q-badge color="orange" floating>{{unReadCount}}</q-badge>
          <q-menu
            fit
            anchor="bottom left"
            self="top middle"
            :offset="[93, 0]"
            @show="scrollTarget = $refs.scrollTargetRef"
          >
            <q-item-label header>
              我的消息
            </q-item-label>
            <q-list
              ref="scrollTargetRef"
              class="scroll"
              style="max-height: 250px; width:300px;"
            >
              <!-- <q-infinite-scroll
                @load="onLoadMenu"
                :offset="250"
                :scroll-target="scrollTarget"
              > -->

                <q-item
                  clickable
                  v-ripple
                  v-for="(item, index) in notices"
                  @click="markAsRead(item.id)"
                  :key="index"
                >
                  <q-item-section avatar  >
                    <q-avatar
                      color="primary"
                      text-color="white"
                    >
                      R{{ index + 1 }}
                    </q-avatar>
                  </q-item-section>

                  <q-item-section >
                    <q-item-label>{{ item.actor.name }}</q-item-label>
                    <q-item-label
                      caption
                      lines="1"
                    >{{ item.verb }}</q-item-label>
                  </q-item-section>

                  <q-item-section side >
                    <q-icon
                      name="chat_bubble"
                      color="green"
                    />
                  </q-item-section>
                </q-item>

                <!-- <template v-slot:loading>
                  <div class="text-center q-my-md">
                    <q-spinner-dots
                      color="primary"
                      size="40px"
                    />
                  </div>
                </template> -->
              <!-- </q-infinite-scroll> -->
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn class="q-mr-xs"
          flat round
          @click="$q.dark.toggle()"
          :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"/>
        <q-btn-dropdown
          flat
          no-caps
          stretch
          auto-close
        >
          <template v-slot:label>
            <q-avatar size="26px">
              <q-img src="images/user1.jpg"></q-img>
            </q-avatar>
          </template>
          <div class="row no-wrap q-pa-md">
            <div
              class="column"
              style="min-width: 200px;"
            >
              <div class="text-h6 q-mb-md">Settings</div>
              <div class="q-mt-md">
                <brand-color />
              </div>
            </div>

            <q-separator
              vertical
              inset
              class="q-mx-lg"
            />
            <div class="column items-center">
              <q-avatar size="72px">
                <q-img src="images/user1.jpg"></q-img>
              </q-avatar>
              <div class="text-subtitle1 q-mt-md q-mb-xs">{{'John Doe'}}</div>
              <q-btn
                color="primary"
                label="Logout"
                push
                size="sm"
                v-close-popup
                @click="logout"
              />
            </div>
          </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <div class="full-height" :class="$q.dark.isActive?'drawer_dark':'drawer_normal'">
        <div style="height: calc(100% - 117px);padding:10px;">
          <q-toolbar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-toolbar-title>NNMS</q-toolbar-title>
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
                  <q-icon name="dashboard" color="primary"/>
                </q-item-section>
                <q-item-section>
                  Dashboard v4
                </q-item-section>
              </q-item>
              <div v-for="route in permission_routers" :key="route.id" :item="route">
                <div v-if="!route.hidden&&route.children">
                  <q-expansion-item
                    v-if="route.meta"
                    :icon="route.meta.icon || 'menu_open'"
                    :key="route.is"
                    class="app-menu"
                    :label="route.meta.title">
                    <template v-for="child in route.children" >
                      <q-item v-if="!child.hidden"  :to="resolvePath(route.path,child.path)" :key="child.id" :item="child" class="q-ml-xl"  >
                        <q-item-section avatar v-if="!child.hidden">
                          <q-icon :name="child.meta.icon || 'menu_open'" color="primary"/>
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
import { getNoticeList, getNoticeCount, markAsRead } from '@/api/notice'
import path from 'path'
import TagsView from './components/TagsView'
import BrandColor from './BrandColor'

export default {
  name: 'MainLayout',
  components: { TagsView, BrandColor },
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
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  created () {
    console.log(this.permission_routers)
    this.getNotices(1)
    this.getNoticeCount()
    this.getBreadcrumb()
  },
  data () {
    return {
      leftDrawerOpen: false,
      onlyOneChild: null,
      scrollTarget: null,
      itemsMenu: [{}, {}, {}, {}, {}, {}, {}],
      notices: [],
      unReadCount: 0,
      current_notice: { id: null },
      levelList: null
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
    },
    onLoadMenu (index, done) {
      if (index > 1) {
        setTimeout(() => {
          if (this.itemsMenu) {
            this.itemsMenu.push({}, {}, {}, {}, {}, {}, {})
            done()
          }
        }, 2000)
      } else {
        setTimeout(() => {
          done()
        }, 200)
      }
    },
    getNotices  () {
      getNoticeList(1).then(res => {
        this.notices = res.results
      })
    },
    getNoticeCount  () {
      getNoticeCount().then(res => {
        this.unReadCount = res.unread_count
      })
    },
    markAsRead (id) {
      this.current_notice.id = id
      markAsRead(this.current_notice).then(res => {
        this.getNotices(1)
        this.getNoticeCount()
      }).catch(err => {
        console.log(err)
      })
    },
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => {
        if (item.name) {
          return true
        }
      })
      const first = matched[0]
      if (first && first.name !== '首页') {
        matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched)
      }
      this.levelList = matched
    },
    handleLink (item) {
      console.log('handleLink')
      const { redirect, path } = item
      console.log(item)
      if (redirect) {
        // this.$router.push(redirect)
        return null
      }
      return path
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
    /* background-color: rgba(1, 1, 1, 0.75); */
  }

  .drawer_dark {
    /* background-color: #010101f2; */
  }

  .navigation-item {
    border-radius: 5px;
  }

  .tab-active {
    background-color: green;
  }

  body {
    /* background: #f1f1f1 !important; */
  }

  .header_normal {
    /* background: linear-gradient(145deg, rgb(32, 106, 80) 15%, rgb(21, 57, 102) 70%); */
  }

  .header_dark {
    /* background: linear-gradient(145deg, rgb(61, 14, 42) 15%, rgb(14, 43, 78) 70%); */
  }
</style>
<style lang="sass">
.app-menu
  .q-item__section--avatar
    color: $primary
    color: var(--q-color-primary)
    min-width: 2px

  .q-item__section--side
    padding-right: 10px
    & > .q-icon
      font-size: 19px

  .q-expansion-item--expanded > div > .q-item > .q-item__section--main
    color: $primary
    color: var(--q-color-primary)
    font-weight: 400

  .q-expansion-item__content .q-item
    border-radius: 0
    margin-right: 0
    &--dense
      min-height: 38px

  .q-item
    &.q-router-link--active
      background: scale-color($primary, $lightness: 90%)

  &.minimize
    & .q-item__section--main,.q-item__section--side
      display: none
    & .q-item__section--avatar
      display: inherit
    .q-expansion-item__content .q-item
      border-radius: 0
      margin: 0
</style>
