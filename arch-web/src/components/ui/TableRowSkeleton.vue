<!-- 
  TableRowSkeleton.vue
  Skeleton loader genérico para filas de tabla
-->

<template>
  <tr class="skeleton-row">
    <td v-for="(col, index) in columns" :key="index" :style="{ width: col.width }">
      <div class="skeleton-cell" :class="col.type">
        <!-- Avatar -->
        <div v-if="col.type === 'avatar'" class="skeleton-avatar">
          <div class="shimmer"></div>
        </div>
        
        <!-- Avatar con texto -->
        <template v-else-if="col.type === 'avatar-text'">
          <div class="skeleton-avatar small">
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
        
        <!-- Texto simple -->
        <div v-else-if="col.type === 'text'" class="skeleton-text" :class="col.size || 'medium'">
          <div class="shimmer"></div>
        </div>
        
        <!-- Badge -->
        <div v-else-if="col.type === 'badge'" class="skeleton-badge">
          <div class="shimmer"></div>
        </div>
        
        <!-- Imagen -->
        <div v-else-if="col.type === 'image'" class="skeleton-image">
          <div class="shimmer"></div>
        </div>
        
        <!-- Acciones -->
        <div v-else-if="col.type === 'actions'" class="skeleton-actions">
          <div v-for="i in (col.count || 2)" :key="i" class="skeleton-action-btn">
            <div class="shimmer"></div>
          </div>
        </div>
        
        <!-- Fecha -->
        <div v-else-if="col.type === 'date'" class="skeleton-text small">
          <div class="shimmer"></div>
        </div>
        
        <!-- Por defecto: texto -->
        <div v-else class="skeleton-text medium">
          <div class="shimmer"></div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
export interface SkeletonColumn {
  type: 'avatar' | 'avatar-text' | 'text' | 'badge' | 'image' | 'actions' | 'date'
  width?: string
  size?: 'small' | 'medium' | 'large'
  hasSubtext?: boolean
  count?: number
}

interface Props {
  columns: SkeletonColumn[]
}

defineProps<Props>()
</script>

<style scoped>
.skeleton-row {
  background: #ffffff;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  overflow: hidden;
  flex-shrink: 0;
}

.skeleton-avatar.small {
  width: 32px;
  height: 32px;
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
  width: 100px;
  height: 16px;
}

.skeleton-text.large {
  width: 150px;
  height: 18px;
}

.skeleton-text.primary {
  width: 120px;
  height: 16px;
}

.skeleton-text.secondary {
  width: 80px;
  height: 12px;
  margin-top: 4px;
}

.skeleton-text-group {
  display: flex;
  flex-direction: column;
}

/* Badge */
.skeleton-badge {
  position: relative;
  width: 70px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

/* Imagen */
.skeleton-image {
  position: relative;
  width: 48px;
  height: 48px;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
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
