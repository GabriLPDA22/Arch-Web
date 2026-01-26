<!-- 
  CardSkeleton.vue
  Skeleton loader para cards genéricas (usuarios, staff, etc.)
-->

<template>
  <div class="card-skeleton" :class="variant">
    <!-- Avatar/Imagen -->
    <div v-if="showAvatar" class="skeleton-avatar" :class="avatarSize">
      <div class="shimmer"></div>
    </div>
    
    <!-- Contenido -->
    <div class="skeleton-content">
      <!-- Título -->
      <div class="skeleton-title">
        <div class="shimmer"></div>
      </div>
      
      <!-- Subtítulo -->
      <div v-if="showSubtitle" class="skeleton-subtitle">
        <div class="shimmer"></div>
      </div>
      
      <!-- Líneas de texto adicionales -->
      <div v-for="i in extraLines" :key="i" class="skeleton-line">
        <div class="shimmer"></div>
      </div>
      
      <!-- Badges -->
      <div v-if="showBadges" class="skeleton-badges">
        <div v-for="i in badgeCount" :key="i" class="skeleton-badge">
          <div class="shimmer"></div>
        </div>
      </div>
    </div>
    
    <!-- Acciones -->
    <div v-if="showActions" class="skeleton-actions">
      <div v-for="i in actionCount" :key="i" class="skeleton-action-btn">
        <div class="shimmer"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'horizontal' | 'compact'
  showAvatar?: boolean
  avatarSize?: 'small' | 'medium' | 'large'
  showSubtitle?: boolean
  extraLines?: number
  showBadges?: boolean
  badgeCount?: number
  showActions?: boolean
  actionCount?: number
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  showAvatar: true,
  avatarSize: 'large',
  showSubtitle: true,
  extraLines: 0,
  showBadges: false,
  badgeCount: 2,
  showActions: true,
  actionCount: 2,
})
</script>

<style scoped>
.card-skeleton {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.card-skeleton.horizontal {
  flex-direction: row;
  align-items: flex-start;
}

.card-skeleton.compact {
  padding: 1rem;
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
  width: 40px;
  height: 40px;
}

.skeleton-avatar.medium {
  width: 56px;
  height: 56px;
}

.skeleton-avatar.large {
  width: 72px;
  height: 72px;
}

/* Contenido */
.skeleton-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.card-skeleton.horizontal .skeleton-content {
  align-items: flex-start;
  flex: 1;
}

.skeleton-title {
  position: relative;
  width: 140px;
  height: 18px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.skeleton-subtitle {
  position: relative;
  width: 100px;
  height: 14px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.skeleton-line {
  position: relative;
  width: 80%;
  height: 12px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

/* Badges */
.skeleton-badges {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.skeleton-badge {
  position: relative;
  width: 70px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

/* Acciones */
.skeleton-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.card-skeleton.horizontal .skeleton-actions {
  margin-top: 0;
  margin-left: auto;
}

.skeleton-action-btn {
  position: relative;
  width: 36px;
  height: 36px;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
</style>
