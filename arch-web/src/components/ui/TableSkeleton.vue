<!-- 
  TableSkeleton.vue
  Skeleton loader para tablas con configuración flexible
-->

<template>
  <div class="table-skeleton-container">
    <table class="table-skeleton">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index" :style="{ width: header.width }">
            <div class="skeleton-header">
              <div class="shimmer"></div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row" class="skeleton-row">
          <td v-for="(col, index) in columns" :key="index">
            <div class="skeleton-cell" :class="col.type">
              <!-- Avatar -->
              <div v-if="col.type === 'avatar'" class="skeleton-avatar" :class="col.size">
                <div class="shimmer"></div>
              </div>
              
              <!-- Avatar con texto (nombre + email) -->
              <template v-else-if="col.type === 'avatar-text'">
                <div class="skeleton-avatar" :class="col.size || 'medium'">
                  <div class="shimmer"></div>
                </div>
                <div class="skeleton-text-group">
                  <div class="skeleton-text primary">
                    <div class="shimmer"></div>
                  </div>
                  <div v-if="col.hasSubtext" class="skeleton-text secondary">
                    <div class="shimmer"></div>
                  </div>
                </div>
              </template>
              
              <!-- Imagen cuadrada -->
              <div v-else-if="col.type === 'image'" class="skeleton-image" :class="col.size">
                <div class="shimmer"></div>
              </div>
              
              <!-- Badge -->
              <div v-else-if="col.type === 'badge'" class="skeleton-badge">
                <div class="shimmer"></div>
              </div>
              
              <!-- Link -->
              <div v-else-if="col.type === 'link'" class="skeleton-text link">
                <div class="shimmer"></div>
              </div>
              
              <!-- Acciones -->
              <div v-else-if="col.type === 'actions'" class="skeleton-actions">
                <div v-for="i in (col.count || 2)" :key="i" class="skeleton-action-btn">
                  <div class="shimmer"></div>
                </div>
              </div>
              
              <!-- Texto (por defecto) -->
              <div v-else class="skeleton-text" :class="col.size || 'medium'">
                <div class="shimmer"></div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
export interface SkeletonHeader {
  width?: string
}

export interface SkeletonColumn {
  type: 'avatar' | 'avatar-text' | 'text' | 'badge' | 'image' | 'actions' | 'link' | 'date'
  width?: string
  size?: 'small' | 'medium' | 'large'
  hasSubtext?: boolean
  count?: number
}

interface Props {
  rows?: number
  headers?: SkeletonHeader[]
  columns: SkeletonColumn[]
}

withDefaults(defineProps<Props>(), {
  rows: 5,
  headers: () => [],
})
</script>

<style scoped>
.table-skeleton-container {
  overflow-x: auto;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.table-skeleton {
  width: 100%;
  border-collapse: collapse;
}

.table-skeleton thead {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.table-skeleton th {
  padding: 1rem;
  text-align: left;
}

.skeleton-header {
  position: relative;
  width: 80px;
  height: 14px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.skeleton-row {
  border-bottom: 1px solid #f3f4f6;
}

.skeleton-row:last-child {
  border-bottom: none;
}

.skeleton-row:nth-child(even) {
  background: #fafafa;
}

.skeleton-cell {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Shimmer effect */
.shimmer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.5) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
  transform: translateX(-100%);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Avatar */
.skeleton-avatar {
  position: relative;
  border-radius: 50%;
  background: #e5e7eb;
  overflow: hidden;
  flex-shrink: 0;
}

.skeleton-avatar.small {
  width: 32px;
  height: 32px;
}

.skeleton-avatar.medium {
  width: 40px;
  height: 40px;
}

.skeleton-avatar.large {
  width: 48px;
  height: 48px;
}

/* Texto */
.skeleton-text {
  position: relative;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.skeleton-text.small {
  width: 60px;
  height: 14px;
}

.skeleton-text.medium {
  width: 120px;
  height: 16px;
}

.skeleton-text.large {
  width: 180px;
  height: 18px;
}

.skeleton-text.primary {
  width: 140px;
  height: 16px;
}

.skeleton-text.secondary {
  width: 100px;
  height: 12px;
  margin-top: 4px;
}

.skeleton-text.link {
  width: 150px;
  height: 14px;
}

.skeleton-text-group {
  display: flex;
  flex-direction: column;
}

/* Badge */
.skeleton-badge {
  position: relative;
  width: 80px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

/* Imagen */
.skeleton-image {
  position: relative;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.skeleton-image.small {
  width: 40px;
  height: 40px;
}

.skeleton-image.medium {
  width: 48px;
  height: 48px;
}

.skeleton-image.large {
  width: 64px;
  height: 64px;
}

/* Acciones */
.skeleton-actions {
  display: flex;
  gap: 0.5rem;
}

.skeleton-action-btn {
  position: relative;
  width: 32px;
  height: 32px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}
</style>
