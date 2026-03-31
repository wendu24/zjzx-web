<template>
  <el-dialog
    title="查看评论"
    :visible="visible"
    width="800px"
    append-to-body
    :before-close="() => (visible = false)"
  >
      <el-descriptions v-for="item of list" title="用户评论" :key="item.id" :column="2">
        <el-descriptions-item label="评论时间"
          >{{ item.commentTime || '-' }}</el-descriptions-item
        >
        <el-descriptions-item label="情绪">{{ item.emotion || '-' }}</el-descriptions-item>
        <el-descriptions-item label="评论内容"
          >{{ item.content || '-' }}</el-descriptions-item
        >
      </el-descriptions>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { viewCommentMethod } from '@/api/business/public-sentiment'
export default {
  name: 'public-sentiment-comment-dialog',
  data() {
    return {
      visible: false,
      id: null,
      list: []
    }
  },
  watch: {
    visible: {
      deep: true,
      handler(val) {
        if (val) {
          this.getCommentList()
        }
      }
    }
  },
  methods: {
    async getCommentList() {
      const { code, data } = await viewCommentMethod(this.id)
      if (code === 200) {
        this.list = data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  max-height: 600px;
  overflow-y: auto;
}
::v-deep .el-descriptions__header {
  margin-bottom: 8px;
}
</style>
