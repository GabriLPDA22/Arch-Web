<template>
  <nav v-if="totalPages > 1" class="pagination-container" aria-label="Pagination">
    <button
      class="pagination-button"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      &laquo;
    </button>

    <button
      v-for="page in pages"
      :key="page"
      class="pagination-button"
      :class="{ active: page === currentPage, disabled: page === '...' }"
      :disabled="page === '...'"
      @click="typeof page === 'number' && changePage(page)"
    >
      {{ page }}
    </button>

    <button
      class="pagination-button"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
    >
      &raquo;
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  maxVisibleButtons: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(['page-changed']);

const changePage = (page: number) => {
  if (page > 0 && page <= props.totalPages) {
    emit('page-changed', page);
  }
};

const pages = computed(() => {
  const range = [];
  const { currentPage, totalPages, maxVisibleButtons } = props;

  if (totalPages <= maxVisibleButtons) {
    for (let i = 1; i <= totalPages; i++) {
      range.push(i);
    }
    return range;
  }

  const startPage = Math.max(2, currentPage - Math.floor((maxVisibleButtons - 3) / 2));
  const endPage = Math.min(totalPages - 1, currentPage + Math.floor((maxVisibleButtons - 2) / 2));

  range.push(1);
  if (startPage > 2) {
    range.push('...');
  }

  for (let i = startPage; i <= endPage; i++) {
    range.push(i);
  }

  if (endPage < totalPages - 1) {
    range.push('...');
  }
  range.push(totalPages);

  return range;
});
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
}
.pagination-button {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #4a5568;
  padding: 0.5rem 1rem;
  min-width: 40px;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}
.pagination-button:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #cbd5e0;
}
.pagination-button.active {
  background: #dbb067;
  border-color: #dbb067;
  color: #ffffff;
}
.pagination-button:disabled:not(.disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}
.pagination-button.disabled {
  background: none;
  border: none;
}
</style>
