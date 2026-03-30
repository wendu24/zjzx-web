import { deleteObjNull } from '@/utils'
import PageForm from '@/components/PageForm'
import PageTable from '@/components/PageTable'
import PageCenterBtn from '@/components/PageCenterBtn'
export default {
  components: {
    PageForm,
    PageTable,
    PageCenterBtn
  },
  computed: {
    params() {
      return deleteObjNull(this.pageForm)
    },
  },
  methods: {
    paginaOnChange(pages) {
      const { limit, page } = pages
      this.pageForm.pageNum = page
      this.pageForm.pageSize = limit
      this.getList()
    }
  }
}