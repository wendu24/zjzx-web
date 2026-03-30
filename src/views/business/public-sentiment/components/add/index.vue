<template>
  <!-- 添加或修改用户配置对话框 -->
  <el-dialog title="新增" :visible="visible" width="800px" append-to-body :before-close="() => visible = false">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="舆情内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          placeholder="请输入内容"
          :autosize="{
            minRows: 10,
            maxRows: 16
          }"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="loading" @click="submitForm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addYuqingMethod } from '@/api/business/public-sentiment'
export default {
  name: 'public-sentiment-add-dialog',
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        content: ''
      },
      rules: {
        content: [
          { required: true, message: '请填写舆情内容', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible: {
      deep: true,
      handler(val) {
        if (!val) {
          this.$refs.form.resetFields();
        }
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          const { code } = await addYuqingMethod({
            content: this.form.content
          }).catch(() => this.loading = false)
          if (code === 200) {
            this.$modal.msgSuccess('操作成功')
            this.visible = false
            this.$emit('ok')
          }
          this.loading = false
        }
      });
    }
  }
}
</script>

<style scoped></style>
