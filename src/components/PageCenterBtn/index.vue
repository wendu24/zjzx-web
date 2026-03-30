<template>
  <el-row :gutter="10" class="mb8">
    <el-col v-for="item of list" :key="item.type" :span="1.5">
      <el-button
        :type="item.btnType || 'primary'"
        :icon="item.icon"
        size="mini"
        @click="handleClick(item.type)"
        v-hasPermi="[item.per]"
        >{{ item.label }}</el-button
      >
    </el-col>
    <right-toolbar
      :showSearch.sync="search"
      @queryTable="$emit('getList')"
    ></right-toolbar>
  </el-row>
</template>

<script>
export default {
  name: 'page-center-btn',
  props: {
    list: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      search: true
    }
  },
  watch: {
    search: {
      deep: true,
      handler(val) {
        this.$emit('show', val)
      }
    }
  },
  methods: {
    handleClick(item) {
      this.$emit('click', item)
    }
  }
}
</script>

<style scoped></style>
