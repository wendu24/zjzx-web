<template>
  <!-- 添加或修改用户配置对话框 -->
  <el-dialog title="舆情热度" :visible="visible" width="800px" append-to-body :before-close="() => visible = false">
    <div ref="chartRef" class="chart" style="height: 600px"></div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hotRecordMethod } from '@/api/business/public-sentiment'
import * as echarts from 'echarts'
export default {
  name: 'public-sentiment-opinion-heat-dialog',
  data() {
    return {
      visible: false,
      id: null
    }
  },
  watch: {
    visible: {
      deep: true,
      handler(val) {
        val && this.getHotRecordList()
      }
    }
  },
  methods: {
    async getHotRecordList() {
      const initChart = (data) => {
        const myChart = echarts.init(this.$refs.chartRef)
        const nameArr = data.map((item) => item.catchTime)
        const likeNumArr = data.map((item) => item.likesCount)
        const forwardNumArr = data.map((item) => item.sharesCount)
        const commentNumArr = data.map((item) => item.commentsCount)
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          legend: {
            data: ['点赞数量', '转发数量', '评论数量'],
            top: '5%',
            right: '10%'
          },
          xAxis: {
            type: 'category',
            data: nameArr,
            axisLabel: {
              interval: function (index, value) {
                if (index === 0 || index === nameArr.length - 1) {
                  return true
                }
                return index % 20 === 0
              },
              rotate: 25, // 标签旋转45度
            },
            axisPointer: {
              type: 'shadow'
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '点赞数量',
              type: 'line',
              data: likeNumArr
            },
            {
              name: '转发数量',
              type: 'line',
              data: forwardNumArr
            },
            {
              name: '评论数量',
              type: 'line',
              data: commentNumArr
            }
          ]
        }
        myChart.setOption(option)
      }

      const { code, data } = await hotRecordMethod(this.id)
      if (code === 200) {
        initChart(data)
      }
    }
  }
}
</script>

<style scoped></style>
