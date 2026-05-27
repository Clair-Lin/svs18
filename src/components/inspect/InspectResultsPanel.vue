<template>
  <div class="inspect-results-root results-module">
    <div class="results-module__toolbar">
      <span class="results-module__toolbar-title">{{ title }}</span>
      <el-button
        v-if="summary && showExport"
        type="primary"
        plain
        :icon="Download"
        @click="$emit('export')"
      >
        导出报告
      </el-button>
    </div>
    <div class="results-module__body">
      <el-alert
        v-if="!detecting && !summary"
        type="info"
        :closable="false"
        show-icon
        class="results-module__hint"
      >
        {{ idleHint }}
      </el-alert>

      <div v-if="detecting || summary" class="progress-wrap results-module__progress">
        <el-progress
          :percentage="progressShown"
          :stroke-width="14"
          :status="progressStatusType"
        />
        <div v-if="progressStatus" class="progress-text">{{ progressStatus }}</div>
      </div>

      <template v-if="summary">
        <el-alert
          v-if="topAlert"
          type="error"
          :closable="false"
          show-icon
          class="detect-cert-abnormal-alert"
        >
          {{ topAlert }}
        </el-alert>
        <div class="detect-stat-strip detect-stat-strip--in-results">
          <div class="stat-cards stat-cards--inspect">
            <div class="stat-card stat-card--overall" :class="overallStatusClass">
              <div class="stat-card-icon">
                <el-icon v-if="overallOk" :size="28"><CircleCheck /></el-icon>
                <el-icon v-else-if="summary.warning > 0 && summary.failed === 0" :size="28"><WarningFilled /></el-icon>
                <el-icon v-else :size="28"><CircleCloseFilled /></el-icon>
              </div>
              <div class="stat-card-body">
                <div class="stat-card-label">整体状态</div>
                <div class="stat-card-value stat-card-value--emphasis">{{ overallLabel }}</div>
              </div>
            </div>
            <div class="stat-card stat-card--plain">
              <div class="stat-card-body">
                <div class="stat-card-label">检测项总数</div>
                <div class="stat-card-value num">{{ stats.total }}</div>
              </div>
            </div>
            <div class="stat-card stat-card--plain stat-card--tone-ok">
              <div class="stat-card-body">
                <div class="stat-card-label">正常</div>
                <div class="stat-card-value num">{{ stats.ok }}</div>
              </div>
            </div>
            <div class="stat-card stat-card--plain stat-card--tone-warn">
              <div class="stat-card-body">
                <div class="stat-card-label">警告</div>
                <div class="stat-card-value num">{{ stats.warn }}</div>
              </div>
            </div>
            <div class="stat-card stat-card--plain stat-card--tone-bad">
              <div class="stat-card-body">
                <div class="stat-card-label">异常</div>
                <div class="stat-card-value num">{{ stats.bad }}</div>
              </div>
            </div>
          </div>
        </div>

        <p class="finish-time">完成时间：{{ summary.time }}</p>

        <div class="inspect-target-bar">
          <span class="inspect-target-bar__left">检测对象 {{ summary.targetLabel }}</span>
          <span
            class="inspect-target-bar__right"
            :class="{
              'inspect-target-bar__right--ok': stats.bad === 0 && stats.warn === 0,
              'inspect-target-bar__right--warn': stats.bad === 0 && stats.warn > 0,
              'inspect-target-bar__right--bad': stats.bad > 0
            }"
          >
            {{ stats.ok }}/{{ stats.total }} 正常
          </span>
        </div>

        <div
          class="inspect-detail-panel"
          :class="{ 'inspect-detail-panel--error': summary.failed > 0 }"
        >
          <div
            v-for="(cat, ci) in resultCategories"
            :key="ci"
            class="inspect-cat"
          >
            <div
              class="inspect-cat__header"
              role="button"
              tabindex="0"
              @click="toggleCategory(ci)"
              @keydown.enter.prevent="toggleCategory(ci)"
            >
              <span class="inspect-cat__title">{{ cat.name }}</span>
              <span class="inspect-cat__badge">{{ cat.items.length }}项</span>
              <el-icon class="inspect-cat__chevron">
                <ArrowDown v-if="isCategoryExpanded(ci)" />
                <ArrowRight v-else />
              </el-icon>
            </div>
            <div v-show="isCategoryExpanded(ci)" class="inspect-cat__body">
              <div
                v-for="(item, ii) in cat.items"
                :key="ii + item.name"
                class="inspect-result-row"
              >
                <div
                  class="inspect-result-row__icon"
                  :class="`inspect-result-row__icon--${item.tagType}`"
                >
                  <el-icon :size="14">
                    <CircleCheck v-if="item.tagType === 'success'" />
                    <WarningFilled v-else-if="item.tagType === 'warning'" />
                    <CircleCloseFilled v-else />
                  </el-icon>
                </div>
                <div class="inspect-result-row__main">
                  <div class="inspect-result-row__name">{{ item.name }}</div>
                  <div
                    v-for="(line, li) in item.metaLines"
                    :key="li"
                    class="inspect-result-row__meta"
                  >
                    {{ line }}
                  </div>
                </div>
                <div
                  class="inspect-result-row__status"
                  :class="`inspect-result-row__status--${item.tagType}`"
                >
                  {{ item.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  CircleCheck,
  CircleCloseFilled,
  WarningFilled,
  Download,
  ArrowRight,
  ArrowDown
} from '@element-plus/icons-vue'

const props = defineProps({
  title: { type: String, default: '检测结果' },
  detecting: Boolean,
  summary: { type: Object, default: null },
  progressShown: { type: Number, default: 0 },
  progressStatus: { type: String, default: '' },
  progressStatusType: { type: String, default: undefined },
  resultCategories: { type: Array, default: () => [] },
  stats: {
    type: Object,
    default: () => ({ total: 0, ok: 0, warn: 0, bad: 0 })
  },
  idleHint: { type: String, default: '请点击开始检测。' },
  topAlert: { type: String, default: '' },
  showExport: { type: Boolean, default: true }
})

defineEmits(['export'])

const categoryExpanded = ref({})

const overallOk = computed(
  () => props.summary && props.summary.failed === 0 && props.summary.warning === 0
)

const overallLabel = computed(() => {
  if (!props.summary) return '—'
  if (props.summary.failed > 0) return '异常'
  if (props.summary.warning > 0) return '警告'
  return '正常'
})

const overallStatusClass = computed(() => {
  if (!props.summary) return ''
  if (props.summary.failed > 0) return 'is-bad'
  if (props.summary.warning > 0) return 'is-warn'
  return 'is-ok'
})

function isCategoryExpanded (ci) {
  return categoryExpanded.value[ci] !== false
}

function toggleCategory (ci) {
  const open = isCategoryExpanded(ci)
  categoryExpanded.value = { ...categoryExpanded.value, [ci]: !open }
}

function resetExpanded () {
  categoryExpanded.value = {}
}

defineExpose({ resetExpanded })
</script>

<style lang="scss" scoped>
@import '@/styles/inspect-results.scss';
</style>
