<template>
  <div class="staff-verification-view">
    <div class="view-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
            </svg>
          </div>
          <div class="header-text">
            <h1 class="page-title">Pending Staff Requests</h1>
            <p class="page-subtitle">Review and approve organization registration requests</p>
          </div>
        </div>
        <div class="header-right">
          <n-badge :value="pendingCount" :max="99" type="error" :show-zero="false">
            <n-button circle size="large" @click="loadPendingStaff" :loading="isLoading">
              <template #icon>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                </svg>
              </template>
            </n-button>
          </n-badge>
        </div>
      </div>
    </div>

    <div class="panel-container">
      <n-spin :show="isLoading">
        <div v-if="pendingStaff.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9,12L11,14L15,10M21,12C21,16.97 16.97,21 12,21C7.03,21 3,16.97 3,12C3,7.03 7.03,3 12,3C16.97,3 21,7.03 21,12Z" />
          </svg>
          <h3>No pending requests</h3>
          <p>All staff organizations have been reviewed</p>
        </div>

        <div v-else class="requests-grid">
          <n-card
            v-for="staff in pendingStaff"
            :key="staff.userID"
            class="request-card"
            hoverable
          >
            <div class="card-content">
              <div class="staff-info">
                <div class="staff-avatar">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                  </svg>
                </div>
                <div class="staff-details">
                  <h3 class="staff-name">{{ staff.name }}</h3>
                  <p class="staff-email">{{ staff.email }}</p>
                  <n-tag size="small" type="warning" class="status-tag">
                    Pending Verification
                  </n-tag>
                </div>
              </div>

              <div class="card-actions">
                <n-button
                  type="success"
                  size="medium"
                  :loading="approvingId === staff.userID"
                  @click="approveStaff(staff)"
                >
                  <template #icon>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                    </svg>
                  </template>
                  Approve
                </n-button>
                <n-button
                  type="error"
                  size="medium"
                  :loading="rejectingId === staff.userID"
                  @click="rejectStaff(staff)"
                >
                  <template #icon>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>
                  </template>
                  Reject
                </n-button>
              </div>
            </div>
          </n-card>
        </div>
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NCard, NButton, NBadge, NTag, NSpin, useMessage, useDialog } from 'naive-ui'
import { StaffApi, type PendingStaffUser } from '@/services/StaffService'

const message = useMessage()
const dialog = useDialog()

const isLoading = ref(false)
const pendingStaff = ref<PendingStaffUser[]>([])
const approvingId = ref<string | null>(null)
const rejectingId = ref<string | null>(null)

const pendingCount = computed(() => pendingStaff.value.length)

const loadPendingStaff = async () => {
  isLoading.value = true
  try {
    pendingStaff.value = await StaffApi.getPendingStaff()
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load pending staff requests'
    message.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

const approveStaff = async (staff: PendingStaffUser) => {
  approvingId.value = staff.userID
  try {
    await StaffApi.approveStaff(staff.userID)
    message.success(`"${staff.name}" has been approved. Welcome email sent.`)
    await loadPendingStaff()
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to approve staff'
    message.error(errorMessage)
  } finally {
    approvingId.value = null
  }
}

const rejectStaff = async (staff: PendingStaffUser) => {
  dialog.warning({
    title: 'Reject Staff Request',
    content: `Are you sure you want to reject the request from "${staff.name}"? This action cannot be undone.`,
    positiveText: 'Reject',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      rejectingId.value = staff.userID
      try {
        await StaffApi.rejectStaff(staff.userID)
        message.success(`Request from "${staff.name}" has been rejected`)
        await loadPendingStaff()
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to reject staff'
        message.error(errorMessage)
      } finally {
        rejectingId.value = null
      }
    },
  })
}

onMounted(() => {
  loadPendingStaff()
})
</script>

<style scoped>
.staff-verification-view {
  width: 100%;
}

.view-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0d2954 0%, #1a3d6e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(13, 41, 84, 0.15);
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: #64748b;
  font-size: 0.9375rem;
  margin: 0;
  line-height: 1.5;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.panel-container {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
}

.empty-state svg {
  margin-bottom: 1rem;
  color: #cbd5e1;
  opacity: 0.6;
}

.empty-state h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
}

.requests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.25rem;
}

.request-card {
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
}

.request-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.staff-info {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.staff-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0d2954 0%, #1a3d6e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.staff-details {
  flex: 1;
  min-width: 0;
}

.staff-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.staff-email {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.5rem 0;
  word-break: break-all;
}

.status-tag {
  margin-top: 0.25rem;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .requests-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .card-actions {
    flex-direction: column;
  }

  .card-actions .n-button {
    width: 100%;
  }
}
</style>

