<template>
  <div class="app-container">
    <PageForm
      :search="search"
      :list="formConfig"
      :form="pageForm"
      @search="getList"
    />

    <PageCenterBtn
      :list="btnConfig"
      @getList="getList"
      @show="(value) => (search = value)"
      @click="CenterBtnClick"
    />

    <PageTable
      :list="list"
      :config="tableConfig"
      :page="pageForm"
      @paginaOnChange="paginaOnChange"
    >
      <template #monitor="{ row }">
        <el-switch
          v-hasPermi="['public-sentiment:change-status']"
          v-model="row.monitor"
          @change="($event) => onChangeStatus($event, row)"
          :disabled="row.monitorStatus === 30"
        >
        </el-switch>
      </template>
      <template #operate="{ row }">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="onBtnClick(row, 'update')"
          v-hasPermi="['public-sentiment:update']"
          >修改</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-view"
          @click="onBtnClick(row, 'view')"
          v-hasPermi="['public-sentiment:view']"
          >查看热度</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-view"
          @click="onBtnClick(row, 'comment')"
          v-hasPermi="['public-sentiment:comment']"
          >查看评论</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="onBtnClick(row, 'delete')"
          v-hasPermi="['public-sentiment:delete']"
          >删除</el-button
        >
      </template>
    </PageTable>

    <Add ref="add" @ok="dialogMethod" />
    <Update ref="update" @ok="getList" />
    <OpinionHeat ref="opinion" />
    <Comment ref="comment" />
  </div>
</template>

<script>
import {
  getYuqingListMethod,
  changeYuqingStatusMethod,
  delYuqingMethod
} from '@/api/business/public-sentiment'
import Add from '@/views/business/public-sentiment/components/add'
import Update from '@/views/business/public-sentiment/components/update'
import OpinionHeat from '@/views/business/public-sentiment/components/opinion-heat'
import Comment from '@/views/business/public-sentiment/components/comment'

import { deleteObjNull } from '@/utils'
import { formConfig, tableConfig, btnConfig } from './constant'
import mixin from '@/mixins'
export default {
  name: 'public-sentiment-page',
  components: { Add, Update, OpinionHeat, Comment },
  mixins: [mixin],
  data() {
    return {
      pageForm: {
        title: '',
        content: '',
        company: '',
        createTime: [],
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      search: true,
      formConfig,
      btnConfig,
      tableConfig,
      list: []
    }
  },
  computed: {
    params() {
      const form = deleteObjNull(this.pageForm)
      if (form.createTime) {
        form.createStartTime = form.createTime[0] + '00:00:00'
        form.createEndTime = form.createTime[0] + '23:59:59'
        delete form.createTime
      }
      delete form.total
      return form
    }
  },
  created() {
    this.getList()
  },
  methods: {
    CenterBtnClick(type) {
      if (type === 'add') {
        this.$refs.add.visible = true
      }
    },

    dialogMethod() {
      this.pageForm.pageNum = 1
      this.getList()
    },

    async getList() {
      const { rows, code, total } = await getYuqingListMethod(this.params)
      if (code === 200) {
        this.list = rows.map((item) => ({
          ...item,
          monitor: item.monitorStatus === 10
        }))
        this.pageForm.total = total
      }
    },

    async onChangeStatus(value, row) {
      const { code } = await changeYuqingStatusMethod({
        id: row.id,
        monitorStatus: value ? 10 : 20
      })
      if (code === 200) {
        this.$modal.msgSuccess('操作成功')
        this.getList()
      }
    },

    async onBtnClick(row, type) {
      if (type === 'update') {
        this.$refs.update.visible = true
        this.$refs.update.form.title = row.title
        this.$refs.update.form.id = row.id
        this.$refs.update.form.author = row.author
        this.$refs.update.form.platform = row.platform
        this.$refs.update.form.company = row.company
        this.$refs.update.form.content = row.content
        this.$refs.update.form.url = row.url
      }

      if (type === 'view') {
        this.$refs.opinion.id = row.id
        this.$refs.opinion.visible = true
      }

      if (type === 'comment') {
        this.$refs.comment.id = row.id
        this.$refs.comment.visible = true
      }

      if (type === 'delete') {
        this.$modal.confirm('是否确认删除？').then(async function () {
          return delYuqingMethod({ id: row.id });
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      }
    }
  }
}
</script>
