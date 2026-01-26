<!-- 
  EventCardSkeleton.vue
  Skeleton loader para tarjetas de eventos en grid y table view
-->

<template>
  <div class="event-card-skeleton" :class="viewMode">
    <!-- Imagen skeleton -->
    <div class="skeleton-image">
      <div class="shimmer"></div>
      <!-- Badge de precio -->
      <div class="skeleton-price">
        <div class="shimmer"></div>
      </div>
    </div>
    
    <!-- Contenido skeleton -->
    <div class="skeleton-content">
      <!-- Meta: categoría y fecha -->
      <div class="skeleton-meta">
        <div class="skeleton-category">
          <div class="shimmer"></div>
        </div>
        <div class="skeleton-date">
          <div class="shimmer"></div>
        </div>
      </div>
      
      <!-- Título -->
      <div class="skeleton-title">
        <div class="shimmer"></div>
      </div>
      
      <!-- Ubicación -->
      <div class="skeleton-location">
        <div class="skeleton-location-icon">
          <div class="shimmer"></div>
        </div>
        <div class="skeleton-location-text">
          <div class="shimmer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  viewMode?: 'grid' | 'table'
}

withDefaults(defineProps<Props>(), {
  viewMode: 'grid',
})
</script>

<style scoped>
.event-card-skeleton {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
}

/* Vista Grid */
.event-card-skeleton.grid .skeleton-image {
  position: relative;
  width: 100%;
  height: 200px;
  background: #e5e7eb;
  overflow: hidden;
}

/* Vista Table */
.event-card-skeleton.table {
  display: flex;
  height: 180px;
}

.event-card-skeleton.table .skeleton-image {
  position: relative;
  width: 280px;
  height: 100%;
  background: #e5e7eb;
  overflow: hidden;
  flex-shrink: 0;
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

/* Precio badge */
.skeleton-price {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  width: 60px;
  height: 32px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

/* Contenido */
.skeleton-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.event-card-skeleton.table .skeleton-content {
  flex: 1;
  justify-content: center;
}

/* Meta */
.skeleton-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skeleton-category {
  position: relative;
  width: 70px;
  height: 28px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.skeleton-date {
  position: relative;
  width: 80px;
  height: 16px;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

/* Título */
.skeleton-title {
  position: relative;
  width: 85%;
  height: 22px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

/* Ubicación */
.skeleton-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skeleton-location-icon {
  position: relative;
  width: 16px;
  height: 16px;
  background: #e5e7eb;
  border-radius: 50%;
  overflow: hidden;
}

.skeleton-location-text {
  position: relative;
  width: 120px;
  height: 14px;
  background: #e5e7eb;
  border-radius: 7px;
  overflow: hidden;
}

/* Responsive */
@media (max-width: 768px) {
  .event-card-skeleton.table {
    flex-direction: column;
    height: auto;
  }

  .event-card-skeleton.table .skeleton-image {
    width: 100%;
    height: 200px;
  }
}
</style>
