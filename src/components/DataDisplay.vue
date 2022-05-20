<template>
  <div>
    <div class="display">
      <div id="myChart" :style="{width: '500px', height: '500px'}"></div>
      <div class="myChart1" id="myChart1" :style="{width: '450px', height: '450px'}"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        name: '',
        pageNum: 1,
        pageSize: 5
      },
      data: [],
      params: ['playlist', 'toplist', 'music', 'video', 'user'],
      name: ['歌单', '排行榜', '歌曲', 'MV', '用户'],
      data1: []
    }
  },
  created () {
  },
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      for (let i = 0; i < this.params.length; i++) {
        this.$axios.get(this.params[i] + '/page', {params: this.queryInfo}).then((response) => {
          // console.log(response.data.total)
          this.data[i] = response.data.total
          this.data1[i] = {value: response.data.total, name: this.name[i]}
          // this.musicList = response.data.list
          // this.total = response.data.total
          // console.log(this.data1)
          this.drawLine()
        }).catch((response) => {
          this.$message.error('获取MV列表失败！')
        })
      }
      // let multiArray = JSON.parse(JSON.stringify(this.data))
      // // console.log('1/111111')
      // console.log(multiArray)
      // console.log(this.data1)
    },
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
      // 绘制图表
      myChart.setOption({
        title: { text: '数据统计' },
        tooltip: {},
        xAxis: {
          data: ['歌单', '排行榜', '歌曲', 'MV', '用户']
        },
        yAxis: {},
        series: [{
          name: '数量',
          type: 'bar',
          data: this.data
        }]
      })
      myChart1.setOption({
        title: {
          text: '各类数据占比',
          // subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '50%',
            data: this.data1,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  }
}
</script>

<style>
.display{
  display: flex;
  flex-direction: row;
}
.myChart1{
  margin-top: 5%;
}
</style>
