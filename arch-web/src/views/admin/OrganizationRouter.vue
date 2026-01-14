<template>
  <OrganizationsDashboard v-if="authStore.isAdmin" />
  <MyOrganizationDashboard v-else />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import OrganizationsDashboard from './OrganizationsDashboard.vue'
import MyOrganizationDashboard from './MyOrganizationDashboard.vue'

const authStore = useAuthStore()
</script>
