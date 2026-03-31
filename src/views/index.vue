<template>
  <div class="app-container">
    <div class="appcontainer__left">
      
    </div>
    <div class="appcontainer__right">
      <iframe :src="iframeUrl" width="100%" height="100%" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
import { listConfig } from '@/api/system/config'
import { mapState } from 'vuex'
export default {
  name: 'Index',
  data() {
    return {
      iframeUrl: '',
      socket: null
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.getConfigUrl()
    this.initWebSocket()
  },
  destroyed() {
    this.closeWebSocket()
  },
  methods: {
    async getConfigUrl() {
      const { code, rows } = await listConfig({
        pageNum: 1,
        pageSize: 10,
        configKey: 'phone-url'
      })
      if (code === 200) {
        this.iframeUrl = rows[0].configValue
      }
    },

    initWebSocket() {
      const baseUrl = process.env.VUE_APP_BASE_API
      const wsUrl = baseUrl.replace('http://', '') + `/wx/${this.user.userId}`
      
      this.socket = new WebSocket('ws://127.0.0.1:8080/wx/1');
      console.log(this.socket, wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket 连接已建立 11111');
      };

      this.socket.onmessage = (data) => {
        console.log('收到消息:', data);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket 错误:', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket 连接已关闭');
      };
    },

    closeWebSocket() {
      if (this.socket) {
        this.socket.close();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  align-items: center;
  justify-content: center;

  .appcontainer__left {
    width: calc(100% - 400px);
    height: calc(100vh - 154px);
    background-color: #fff;
  }

  .appcontainer__right {
    width: 400px;
    height: calc(100vh - 154px);
    background-color: #fff;
  }
}
</style>
