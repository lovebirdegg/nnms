<template>
  <q-page class="q-pa-sm">
    <div class="row">
        <div class="col shadow-6 padding-10">
            <q-card inline class="fit">
                <q-card-section>
                    <div class="q-mb-sm">
                      <q-chip>{{msg}}</q-chip>
                    </div>
                    <q-separator inset></q-separator>
                        <div id="c1"></div>
                </q-card-section>
            </q-card>
        </div>
        <div class="col shadow-6" style="margin-left:10px">
            <q-card inline class="fit">
                <q-card-section>
                    <div class="q-mb-sm">
                      <q-chip>{{msg1}}</q-chip>
                    </div>
                    <q-separator inset></q-separator>
                        <div id="c2"></div>
                </q-card-section>
            </q-card>
        </div>
        <div class="col shadow-6" style="margin-left:10px">
            <q-card inline class="fit">
                <q-card-section>
                    <div class="q-mb-sm">
                      <q-chip>{{msg2}}</q-chip>
                    </div>
                    <q-separator inset></q-separator>
                        <div id="c3"></div>
                </q-card-section>
            </q-card>
        </div>
    </div>
  </q-page>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { Chart, Util } from '@antv/g2'

export default {
  name: 'G2Demo',
  components: {},
  data () {
    return {
      msg: '',
      msg1: '',
      msg2: '',
      chart: null,
      data: [
        { genre: 'Sports', sold: 275 },
        { genre: 'Strategy', sold: 115 },
        { genre: 'Action', sold: 120 },
        { genre: 'Shooter', sold: 350 },
        { genre: 'Other', sold: 150 }
      ]
    }
  },
  // 计算属性
  computed: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {},
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted () {
    this.initComponent()
    this.initComponent1()
    this.initComponent2()
  },
  // 方法集合
  methods: {
    initComponent () {
      // 此函数为个人习惯,喜欢创建一个初始化的函数
      this.msg = '柱状图'
      const chart = new Chart({
        container: 'c1',
        autoFit: true,
        width: 600,
        height: 300
      })
      chart.source(this.data)
      chart
        .interval()
        .position('genre*sold')
        .color('genre')
      this.chart = chart
      this.chart.render()
    },
    initComponent1 () {
      this.msg1 = '折线图'
      // 此函数为个人习惯,喜欢创建一个初始化的函数
      const data = [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 }
      ]
      const chart = new Chart({
        container: 'c2',
        autoFit: true,
        width: 600,
        height: 300
      })

      chart.data(data)
      chart.scale({
        year: {
          range: [0, 1]
        },
        value: {
          min: 0,
          nice: true
        }
      })

      chart.tooltip({
        showCrosshairs: true, // 展示 Tooltip 辅助线
        shared: true
      })

      chart.line().position('year*value').label('value')
      chart.point().position('year*value')
      chart.render()
    },
    initComponent2 () {
      this.msg2 = '饼图'
      const data = [
        { type: '一线城市', value: 0.19 },
        { type: '二线城市', value: 0.21 },
        { type: '三线城市', value: 0.27 },
        { type: '四线及以下', value: 0.33 }
      ]
      const chart = new Chart({
        container: 'c3',
        autoFit: true,
        height: 300
      })
      chart.data(data)

      chart.coordinate('theta', {
        radius: 0.75
      })
      chart.tooltip({
        showMarkers: false
      })

      chart
        .interval()
        .adjust('stack')
        .position('value')
        .color('type', ['#063d8a', '#1770d6', '#47abfc', '#38c060'])
        .style({ opacity: 0.4 })
        .state({
          active: {
            style: (element) => {
              const shape = element.shape
              return {
                matrix: Util.zoom(shape, 1.1)
              }
            }
          }
        })
        .label('type', (val) => {
          const opacity = val === '四线及以下' ? 1 : 0.5
          return {
            offset: -30,
            style: {
              opacity,
              fill: 'white',
              fontSize: 12,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)'
            },
            content: (obj) => {
              return obj.type + '\n' + obj.value + '%'
            }
          }
        })

      chart.interaction('element-single-selected')

      chart.render()
    }
  }
}
</script>
