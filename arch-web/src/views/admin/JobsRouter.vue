<template>
  <JobsDashboard v-if="authStore.isAdmin" />
  <MyJobsDashboard v-else />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import JobsDashboard from './JobsDashboard.vue'
import MyJobsDashboard from './MyJobsDashboard.vue'

const authStore = useAuthStore()
</script>
