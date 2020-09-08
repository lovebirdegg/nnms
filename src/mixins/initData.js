import { initData } from '@/api/data'

export default {
  data () {
    return {
      loading: true,
      data: [],
      page: 1,
      size: 10,
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      url: '',
      params: {},
      query: {},
      time: 170
    }
  },
  methods: {
    async init (props) {
      console.log('props')
      console.log(props)
      const { page, rowsPerPage } = props.pagination
      this.page = page
      this.size = rowsPerPage
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.$q.loadingBar.start()
        initData(this.url, this.params).then(res => {
          console.log('res')
          console.log(res)
          this.pagination.rowsNumber = res.detail.count
          this.pagination.page = res.detail.current
          this.pagination.rowsPerPage = rowsPerPage
          this.data = res.detail.results
          setTimeout(() => {
            this.$q.loadingBar.stop()
          }, this.time)
          resolve(res)
        }).catch(err => {
          this.$q.loadingBar.stop()
          reject(err)
        })
      })
    },
    beforeInit () {
      return true
    },
    pageChange (e) {
      this.page = e
      this.init()
    },
    sizeChange (e) {
      this.page = 1
      this.size = e
      this.init()
    }
  }
}
