<template>
  <div class="table-cpn-container">
    <el-table
      ref="table-cpn"
      v-loading="config.loading || false"
      class="table-container"
      :data="list"
      fit
      stripe
      border
      highlight-current-row
      :cell-style="{ textAlign: 'left', color: '#333' }"
      :header-cell-style="{
        color: '#333',
        fontWeight: '600',
        fontSize: '13px',
        background: '#eef0f3',
        borderColor: '#e3e4ea',
        textAlign: 'left'
      }"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <slot v-if="config.select" name="selection">
        <el-table-column type="selection" width="50" align="center" />
      </slot>

      <el-table-column
        v-if="config.index"
        show-overflow-tooltip
        width="50"
        type="index"
        label="序号"
        align="center"
        fixed="left"
      />
      <template v-for="item of config.column">
        <el-table-column
          v-if="
            item.prop !== 'operate' || (item.prop === 'operate' && config.operate)
          "
          :key="item.prop"
          :show-overflow-tooltip="item.prop == 'operate' ? false : true"
          v-bind="item"
        >
          <template slot-scope="{ row }">
            <slot :name="item.slotName" :row="row">
              {{ row[item.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页组件 -->
    <Pagination
      v-if="config.pagina === undefined ? false : config.pagina"
      class="pagina-box"
      :page-sizes="[10, 30, 50, 100]"
      :total="page.total || 0"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="paginaOnChange"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'page-table-components',
  inheritAttrs: false,
  components: {
    Pagination
  },
  props: {
    list: {
      type: Array,
      default: () => [],
      require: true
    },
    config: {
      type: Object,
      default: () => {},
      require: true
    },
    page: {
      type: Object,
      default: () => ({
        total: 0,
        pageNum: 10,
        pageSize: 1
      })
    }
  },

  methods: {
    paginaOnChange(data) {
      this.$emit('paginaOnChange', data)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table {
  th {
    padding: 10px 0;
  }

  td {
    padding: 8px 0;
  }
}
.pagina-box {
  padding: 12px 0;
  text-align: right;
}
</style>
