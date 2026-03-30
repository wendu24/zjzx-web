<template>
  <div>
    <el-form :model="form" ref="queryForm" size="small" :inline="true" v-show="search" label-width="80px">
      <el-form-item v-for="item of list" :key="item.prop" :label="item.label" :prop="item.prop">
        <template v-if="item.type === 'input'">
          <el-input
            v-model="form[item.prop]"
            :placeholder="`请输入${item.label}`"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </template>
        <template v-if="item.type === 'select'">
          <el-select
            v-model="form[item.prop]"
            :placeholder="`请选择${item.label}`"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="dict in item.data"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </template>
        <template v-if="item.type === 'date'">
          <template v-if="item.dateType === 'daterange'">
            <el-date-picker
              v-model="form[item.prop]"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </template>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'page-form-components',
  props: {
    search: {
      type: Boolean,
      require: true
    },
    form: {
      type: Object,
      require: true
    },
    list: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    handleQuery() {
      this.form.pageNum = 1;
      this.$emit('search')
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
}
</script>

<style scoped>

</style>