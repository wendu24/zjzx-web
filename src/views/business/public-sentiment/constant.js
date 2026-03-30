export const formConfig = [
  {
    type: 'input',
    label: '标题',
    prop: 'title'
  },
  {
    type: 'input',
    label: '舆情概要',
    prop: 'content'
  },
  {
    type: 'input',
    label: '企业',
    prop: 'company'
  },
  {
    type: 'date',
    dateType: 'daterange',
    label: '创建时间',
    prop: 'createTime'
  },
]

export const btnConfig = [
  { icon: 'el-icon-plus', btnType: 'primary', type: 'add', label: '新增', per: 'public-sentiment:add' }
]

export const tableConfig = {
  pagina: true,
  operate: true,
  column: [
    { prop: 'title', label: '标题', minWidth: 200 },
    { prop: 'author', label: '作者' },
    { prop: 'platform', label: '平台', width: 80 },
    { prop: 'company', label: '企业' },
    { prop: 'content', label: '舆情概要', minWidth: 200 },
    { prop: 'url', label: '舆情URL', minWidth: 200 },
    { prop: 'monitor', label: '监测状态', slotName: 'monitor', width: 80 },
    { prop: 'createTime', label: '创建时间', width: 160 },
    { prop: 'operate', fixed: 'right', label: '操作', slotName: 'operate', width: 200 },
  ]
}