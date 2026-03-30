<template>
  <!-- 添加或修改用户配置对话框 -->
  <el-dialog title="修改" :visible="visible" width="800px" append-to-body :before-close="() => visible = false">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="平台" prop="platform">
        <el-input v-model="form.platform" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="企业" prop="company">
        <el-input v-model="form.company" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="舆情URL" prop="url">
        <el-input v-model="form.url" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="舆情概要" prop="content">
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
import { updateYuqingMethod } from '@/api/business/public-sentiment'
export default {
  name: 'public-sentiment-add-dialog',
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        id: '',
        title: '',
        author: '',
        platform: '',
        company: '',
        content: '',
        url: '',
      },
      rules: {
        title: [
          { required: true, message: '请填写标题', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请填写作者', trigger: 'blur' }
        ],
        platform: [
          { required: true, message: '请填写平台', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请填写企业', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请填写URL', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写舆情概要', trigger: 'blur' }
        ],
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
          const { code } = await updateYuqingMethod(this.form).catch(() => this.loading = false)
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
