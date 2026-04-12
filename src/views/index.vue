<template>
  <div class="app-container">
    <div class="appcontainer__left">
      <div class="dashboard-container">
        <!-- 头部：标题 + 控制栏 -->
        <div class="dashboard-header">
          <div class="title">
            <span class="live-dot"></span>
            实时监控日志
            <span
              class="connection-status"
              :class="connected ? 'online' : 'offline'"
            >
              {{ connected ? '已连接' : '未连接' }}
            </span>
          </div>
          <div class="controls">
            <select v-model="levelFilter">
              <option value="all">全部级别</option>
              <option value="info">信息</option>
              <option value="warn">警告</option>
              <option value="error">错误</option>
            </select>
            <input
              type="text"
              v-model="searchText"
              placeholder="搜索日志内容..."
            />
            <button @click="clearLogs" class="clear-btn">清空</button>
            <button @click="toggleAutoScroll" class="scroll-btn">
              {{ autoScroll ? '滚动中' : '已暂停' }}
            </button>
          </div>
        </div>

        <!-- 日志列表 -->
        <div class="log-list" ref="logContainer">
          <div
            v-for="log in filteredLogs"
            :key="log.id"
            class="log-item"
            :class="log.level"
          >
            <div class="log-level-badge">{{ log.levelText }}</div>
            <div class="log-time">{{ log.time }}</div>
            <div class="log-content">{{ log.content }}</div>
          </div>
          <div v-if="filteredLogs.length === 0" class="empty-state">
            暂无日志数据
          </div>
        </div>
      </div>
    </div>
    <div class="appcontainer__right">
      <iframe
        :src="iframeUrl"
        width="100%"
        height="100%"
        frameborder="0"
      ></iframe>
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
      socket: null,
      connected: false,
      maxLogs: 1000,
      logs: [], // 原始日志数组
      levelFilter: 'all', // all, info, warn, error
      searchText: '',
      autoScroll: true,
      levelMap: {
        info: { text: 'INFO', class: 'info' },
        warn: { text: 'WARN', class: 'warn' },
        error: { text: 'ERROR', class: 'error' }
      }
    }
  },
  computed: {
    ...mapState(['user']),

    filteredLogs() {
      let result = this.logs

      // 级别过滤
      if (this.levelFilter !== 'all') {
        result = result.filter((log) => log.level === this.levelFilter)
      }

      // 关键词过滤
      if (this.searchText.trim()) {
        const keyword = this.searchText.trim().toLowerCase()
        result = result.filter((log) =>
          log.content.toLowerCase().includes(keyword)
        )
      }
      return result
    }
  },
  watch: {
    // 监听过滤后日志变化，自动滚动到底部（如果 autoScroll 开启）
    filteredLogs: {
      handler() {
        if (this.autoScroll) {
          this.$nextTick(() => {
            const container = this.$refs.logContainer
            if (container) container.scrollTop = container.scrollHeight
          })
        }
      },
      deep: false
    }
  },
  created() {
    this.getConfigUrl()
  },
  mounted() {
    this.initWebSocket()
  },
  deactivated() {
    if (this.socket) {
      this.socket.close()
    }
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.close()
    }
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

    async initWebSocket() {
      const { code, rows } = await listConfig({
        pageNum: 1,
        pageSize: 10,
        configKey: 'websocket_domain'
      })
      if (code === 200) {
        const wsUrl = `ws://${rows[0].configValue}/ws/${this.user.userId}`
        this.socket = new WebSocket(wsUrl)

        this.socket.onopen = () => {
          this.connected = true
          console.log('WebSocket 连接已建立 11111')
        }

        this.socket.onmessage = (message) => {
          this.handleMessage(message.data)
          // console.log('收到消息:', message.data)
        }

        this.socket.onerror = (error) => {
          this.connected = false
          // console.error('WebSocket 错误:', error)
        }

        this.socket.onclose = () => {
          this.connected = false
          console.log('WebSocket 连接已关闭')
          // 可选：自动重连
          setTimeout(() => this.initWebSocket(), 3000)
        }
      }
    },

    handleMessage(rawData) {
      let logData
      try {
        logData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData
      } catch (e) {
        logData = { level: 'info', content: rawData }
      }
      const level = logData.level || 'info'
      const validLevel = ['info', 'warn', 'error'].includes(level)
        ? level
        : 'info'
      const newLog = {
        id: Date.now() + Math.random(),
        level: validLevel,
        levelText: this.levelMap[validLevel].text,
        content: logData.content || JSON.stringify(logData),
        time: this.formatTime(new Date())
      }
      this.logs.push(newLog)

      // 限制日志数量
      if (this.logs.length > this.maxLogs) {
        this.logs.shift()
      }
    },

    formatTime(date) {
      const pad = (n) => n.toString().padStart(2, '0')
      return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}.${date.getMilliseconds()}`
    },

    clearLogs() {
      this.logs = []
    },

    toggleAutoScroll() {
      this.autoScroll = !this.autoScroll
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
    width: calc(100% - 408px);
    height: calc(100vh - 154px);
    box-sizing: border-box;
    margin-right: 8px;
    overflow-y: auto;

    .dashboard-container {
      background: #1e1e2f; /* 深色背景，更符合监控面板风格 */
      color: #e0e0e0;
      font-family: 'Monaco', 'Menlo', monospace;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .dashboard-header {
      background: #2d2d3a;
      padding: 12px 20px;
      border-bottom: 1px solid #3a3a4a;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .live-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      background-color: #10b981;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% {
        opacity: 0.4;
        transform: scale(0.8);
      }
      100% {
        opacity: 1;
        transform: scale(1.2);
      }
    }

    .connection-status {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 20px;
      background: #3a3a4a;
    }

    .connection-status.online {
      background: #10b981;
      color: #000;
    }

    .connection-status.offline {
      background: #ef4444;
      color: white;
    }

    .controls {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .controls select,
    .controls input,
    .controls button {
      background: #3a3a4a;
      border: 1px solid #4a4a5a;
      color: #e0e0e0;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      outline: none;
    }

    .controls input {
      width: 200px;
    }

    .controls button {
      cursor: pointer;
      transition: 0.2s;
    }

    .controls button:hover {
      background: #4a4a5a;
    }

    .clear-btn {
      background: #dc2626;
      border-color: #b91c1c;
    }

    .scroll-btn {
      background: #3b82f6;
      border-color: #2563eb;
    }

    .log-list {
      flex: 1;
      overflow-y: auto;
      padding: 10px 0;
      scrollbar-width: thin;
      scrollbar-color: #4a4a5a #2d2d3a;

      &::-webkit-scrollbar {
        width: 6px; /* 垂直滚动条宽度 */
        height: 6px; /* 水平滚动条高度 */
      }

      &::-webkit-scrollbar-track {
        background: #2d2d3a; /* 轨道背景色（与面板背景接近） */
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #4a4a5a; /* 滑块颜色 */
        border-radius: 4px;
        transition: background 0.2s ease;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #6b6b7e; /* 悬浮时变亮 */
      }

      &::-webkit-scrollbar-corner {
        background: #2d2d3a; /* 角落（当同时有横竖滚动条时） */
      }
    }

    .log-item {
      display: flex;
      align-items: flex-start;
      padding: 8px 20px;
      border-bottom: 1px solid #2a2a38;
      font-size: 0.85rem;
      font-family: monospace;
      transition: background 0.1s;
    }

    .log-item:hover {
      background: #2a2a38;
    }

    .log-level-badge {
      width: 60px;
      font-weight: bold;
      text-align: center;
      padding: 2px 6px;
      border-radius: 4px;
      margin-right: 20px;
      flex-shrink: 0;
    }

    .log-item.info .log-level-badge {
      background: #0e7c7c;
      color: #cff3f3;
    }
    .log-item.warn .log-level-badge {
      background: #b45309;
      color: #ffedd5;
    }
    .log-item.error .log-level-badge {
      background: #b91c1c;
      color: #fee2e2;
    }

    .log-time {
      width: 110px;
      color: #9ca3af;
      margin-right: 20px;
      flex-shrink: 0;
    }

    .log-content {
      flex: 1;
      word-break: break-word;
      white-space: pre-wrap;
    }

    /* 级别颜色（左边框装饰） */
    .log-item.info {
      border-left: 3px solid #10b981;
    }
    .log-item.warn {
      border-left: 3px solid #f59e0b;
    }
    .log-item.error {
      border-left: 3px solid #ef4444;
    }

    .empty-state {
      text-align: center;
      color: #6b7280;
      padding: 40px;
      font-style: italic;
    }
  }

  .appcontainer__right {
    width: 400px;
    height: calc(100vh - 154px);
    background-color: #fff;
    border-radius: 8px;
  }
}
</style>
