<template>
  <div class="alumni-verification-view">
    <!-- Header -->
    <div class="view-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
            </svg>
          </div>
          <div class="header-text">
            <h1 class="page-title">Alumni Verifications</h1>
            <p class="page-subtitle">Review and manage alumni verification requests</p>
          </div>
        </div>
        <div class="header-right">
          <n-badge :value="pendingCount" :max="99" type="error" :show-zero="false">
            <n-button circle size="large" @click="loadVerifications" :loading="isLoading">
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

    <!-- Filters and Search -->
    <div class="filters-container">
      <div class="tabs-wrapper">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          :class="['tab-button', { active: currentStatus === tab.value }]"
          @click="changeStatus(tab.value)"
        >
          <span class="tab-label">{{ tab.label }}</span>
          <span v-if="tab.value === 'PENDING' && pendingCount > 0" class="tab-badge">
            {{ pendingCount }}
          </span>
        </button>
      </div>
      <div class="search-wrapper">
        <div class="search-input-container">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or email..."
            class="search-input"
            @input="debouncedSearch"
          />
          <button v-if="searchQuery" class="clear-search" @click="clearSearch">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="panel-container">
      <n-spin :show="isLoading">
        <!-- Empty State -->
        <div v-if="!isLoading && verifications.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9,12L11,14L15,10M21,12C21,16.97 16.97,21 12,21C7.03,21 3,16.97 3,12C3,7.03 7.03,3 12,3C16.97,3 21,7.03 21,12Z" />
          </svg>
          <h3>No {{ currentStatus.toLowerCase() }} verifications</h3>
          <p v-if="currentStatus === 'PENDING'">All alumni verifications have been reviewed</p>
          <p v-else-if="currentStatus === 'APPROVED'">No approved verifications yet</p>
          <p v-else>No rejected verifications</p>
        </div>

        <!-- Verifications Table -->
        <div v-else class="table-wrapper">
          <table class="verifications-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Year</th>
                <th>Identity</th>
                <th>Submitted</th>
                <th v-if="currentStatus !== 'PENDING'">Reviewed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="verification in verifications" :key="verification.userId">
                <td class="name-cell">
                  <div class="name-wrapper">
                    <div class="avatar">
                      {{ verification.fullName.charAt(0).toUpperCase() }}
                    </div>
                    <span class="full-name">{{ verification.fullName }}</span>
                  </div>
                </td>
                <td class="email-cell">{{ verification.email }}</td>
                <td class="year-cell">{{ verification.graduationYear }}</td>
                <td class="identity-cell">
                  <n-tag size="small" :type="getIdentityTagType(verification.identity)">
                    {{ verification.identity }}
                  </n-tag>
                </td>
                <td class="date-cell">{{ formatDate(verification.submittedAt) }}</td>
                <td v-if="currentStatus !== 'PENDING'" class="date-cell">
                  {{ verification.reviewedAt ? formatDate(verification.reviewedAt) : '-' }}
                </td>
                <td class="actions-cell">
                  <div class="actions-wrapper">
                    <n-button size="small" @click="openDetailModal(verification)">
                      <template #icon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                        </svg>
                      </template>
                      View
                    </n-button>
                    <n-tag v-if="verification.status === 'REJECTED'" size="tiny" type="error" class="status-indicator">
                      Has reason
                    </n-tag>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination-wrapper">
          <PaginationComponent
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-changed="changePage"
          />
        </div>
      </n-spin>
    </div>

    <!-- Detail Modal -->
    <ModalComponent
      :show="showDetailModal"
      :title="'Alumni Verification Detail'"
      @close="closeDetailModal"
    >
      <div v-if="selectedVerification" class="detail-content">
        <!-- User Info Section -->
        <div class="detail-section">
          <h4 class="section-title">User Information</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Full Name</span>
              <span class="info-value">{{ selectedVerification.fullName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value">{{ selectedVerification.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Identity</span>
              <span class="info-value">{{ selectedVerification.identity }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Graduation Year</span>
              <span class="info-value">{{ selectedVerification.graduationYear }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Submitted</span>
              <span class="info-value">{{ formatDateTime(selectedVerification.submittedAt) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status</span>
              <n-tag :type="getStatusTagType(selectedVerification.status)" size="medium">
                {{ selectedVerification.status }}
              </n-tag>
            </div>
          </div>
          <div v-if="verificationDetail?.reviewReason" class="rejection-reason">
            <span class="info-label">Rejection Reason</span>
            <p class="reason-text">{{ verificationDetail.reviewReason }}</p>
          </div>
        </div>

        <!-- Documents Section -->
        <div class="detail-section">
          <h4 class="section-title">Documents</h4>
          <div v-if="detailLoading" class="loading-documents">
            <n-spin size="small" />
            <span>Loading documents...</span>
          </div>
          <div v-else-if="verificationDetail?.documents?.length" class="documents-list">
            <div
              v-for="doc in verificationDetail.documents"
              :key="doc.id"
              :class="['document-item', { active: selectedDocument?.id === doc.id }]"
              @click="selectDocument(doc)"
            >
              <span class="doc-icon">{{ getFileIcon(doc.mimeType) }}</span>
              <div class="doc-info">
                <span class="doc-name">{{ doc.fileName }}</span>
                <span class="doc-meta">
                  {{ formatFileSize(doc.sizeBytes) }} · {{ formatDate(doc.uploadedAt) }}
                  <span v-if="doc.source === 'resubmit'" class="resubmit-badge">Resubmitted</span>
                </span>
              </div>
              <div class="doc-actions">
                <n-button size="tiny" quaternary @click.stop="openDocument(doc)">
                  <template #icon>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                    </svg>
                  </template>
                </n-button>
              </div>
            </div>
          </div>
          <div v-else class="no-documents">
            <p>No documents available</p>
          </div>

          <!-- Document Preview -->
          <div v-if="selectedDocument" class="document-preview">
            <h5 class="preview-title">Preview: {{ selectedDocument.fileName }}</h5>
            <div class="preview-container">
              <img
                v-if="isImageMimeType(selectedDocument.mimeType)"
                :src="selectedDocument.downloadUrl"
                :alt="selectedDocument.fileName"
                class="preview-image"
                @error="handleImageError"
              />
              <div v-else-if="isPdfMimeType(selectedDocument.mimeType)" class="pdf-preview">
                <iframe
                  :src="selectedDocument.downloadUrl"
                  class="pdf-iframe"
                  title="PDF Preview"
                />
              </div>
              <div v-else class="unsupported-preview">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                <p>Preview not available for this file type</p>
                <n-button type="primary" @click="downloadDocument(selectedDocument)">
                  Download File
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="modal-actions">
          <n-button @click="closeDetailModal">Close</n-button>
          <template v-if="selectedVerification?.status === 'PENDING'">
            <n-button
              type="error"
              :loading="isRejecting"
              @click="openRejectModal"
            >
              <template #icon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </template>
              Reject
            </n-button>
            <n-button
              type="success"
              :loading="isApproving"
              @click="handleApprove"
            >
              <template #icon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
              </template>
              Approve
            </n-button>
          </template>
        </div>
      </template>
    </ModalComponent>

    <!-- Reject Modal -->
    <ModalComponent
      :show="showRejectModal"
      :title="'Reject Alumni Verification'"
      @close="closeRejectModal"
    >
      <div class="reject-content">
        <div class="reject-warning">
          <div class="warning-icon-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
            </svg>
          </div>
          <div class="warning-text">
            <p>You are about to reject the verification for:</p>
            <p class="user-info">
              <strong>{{ selectedVerification?.fullName }}</strong>
              <span class="user-email">{{ selectedVerification?.email }}</span>
            </p>
          </div>
        </div>

        <div class="reject-form">
          <div class="form-group">
            <label class="form-label">
              Reason for rejection <span class="required">*</span>
            </label>
            <p class="form-hint">This message will be sent to the user via email.</p>
            <textarea
              v-model="rejectReason"
              class="reason-textarea"
              placeholder="Explain why the verification was rejected and what the user should do to fix it..."
              rows="5"
            ></textarea>
            <div class="textarea-footer">
              <span 
                class="char-count" 
                :class="{ 
                  error: rejectReason.length > 0 && (rejectReason.length < 10 || rejectReason.length > 1000),
                  valid: rejectReason.length >= 10 && rejectReason.length <= 1000
                }"
              >
                <template v-if="rejectReason.length === 0">
                  Minimum 10 characters required
                </template>
                <template v-else>
                  {{ rejectReason.length }} / 1000 characters
                  <span v-if="rejectReason.length < 10">({{ 10 - rejectReason.length }} more needed)</span>
                </template>
              </span>
            </div>
          </div>

          <div class="quick-reasons">
            <span class="quick-label">Quick templates:</span>
            <div class="quick-buttons">
              <button
                v-for="reason in quickReasons"
                :key="reason.label"
                class="quick-reason-btn"
                @click="applyQuickReason(reason.value)"
              >
                {{ reason.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="modal-actions">
          <n-button size="large" @click="closeRejectModal">Cancel</n-button>
          <n-button
            type="error"
            size="large"
            :loading="isRejecting"
            :disabled="!isValidRejectReason"
            @click="handleReject"
          >
            <template #icon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </template>
            Reject Verification
          </n-button>
        </div>
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { NButton, NBadge, NTag, NSpin, useMessage, useDialog } from 'naive-ui'
import ModalComponent from '@/components/ui/ModalComponent.vue'
import PaginationComponent from '@/components/ui/PaginationComponent.vue'
import {
  AlumniVerificationApi,
  formatDate,
  formatDateTime,
  formatFileSize,
  isImageMimeType,
  isPdfMimeType,
  getFileIcon,
  QUICK_REJECTION_REASONS,
  type AlumniVerificationListItem,
  type AlumniVerificationDetail,
  type AlumniDocument,
  type AlumniStatus,
} from '@/services/AlumniService'

const message = useMessage()
const dialog = useDialog()

// ==================== STATE ====================

const isLoading = ref(false)
const verifications = ref<AlumniVerificationListItem[]>([])
const currentStatus = ref<AlumniStatus>('PENDING')
const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)
const totalPages = ref(0)
const searchQuery = ref('')
const pendingCount = ref(0)

// Detail Modal
const showDetailModal = ref(false)
const selectedVerification = ref<AlumniVerificationListItem | null>(null)
const verificationDetail = ref<AlumniVerificationDetail | null>(null)
const detailLoading = ref(false)
const selectedDocument = ref<AlumniDocument | null>(null)
const isApproving = ref(false)

// Reject Modal
const showRejectModal = ref(false)
const rejectReason = ref('')
const isRejecting = ref(false)

// ==================== COMPUTED ====================

const statusTabs = [
  { value: 'PENDING' as AlumniStatus, label: 'Pending' },
  { value: 'APPROVED' as AlumniStatus, label: 'Approved' },
  { value: 'REJECTED' as AlumniStatus, label: 'Rejected' },
]

const quickReasons = QUICK_REJECTION_REASONS

const isValidRejectReason = computed(() => {
  return rejectReason.value.length >= 10 && rejectReason.value.length <= 1000
})

// ==================== METHODS ====================

const loadVerifications = async () => {
  isLoading.value = true
  try {
    const response = await AlumniVerificationApi.list({
      status: currentStatus.value,
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value || undefined,
    })

    verifications.value = response.items
    totalCount.value = response.totalCount
    totalPages.value = response.totalPages

    // Update pending count if we're not on pending tab
    if (currentStatus.value === 'PENDING') {
      pendingCount.value = response.totalCount
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load verifications'
    message.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

const loadPendingCount = async () => {
  try {
    const response = await AlumniVerificationApi.list({
      status: 'PENDING',
      page: 1,
      pageSize: 1,
    })
    pendingCount.value = response.totalCount
  } catch {
    // Silently fail
  }
}

const changeStatus = (status: AlumniStatus) => {
  currentStatus.value = status
  currentPage.value = 1
  loadVerifications()
}

const changePage = (page: number) => {
  currentPage.value = page
  loadVerifications()
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadVerifications()
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  loadVerifications()
}

const openDetailModal = async (verification: AlumniVerificationListItem) => {
  selectedVerification.value = verification
  showDetailModal.value = true
  selectedDocument.value = null
  verificationDetail.value = null

  // Load full detail
  detailLoading.value = true
  try {
    verificationDetail.value = await AlumniVerificationApi.getDetail(verification.userId)
    // Auto-select first document
    if (verificationDetail.value.documents?.length) {
      selectedDocument.value = verificationDetail.value.documents[0]
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load verification details'
    message.error(errorMessage)
  } finally {
    detailLoading.value = false
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedVerification.value = null
  verificationDetail.value = null
  selectedDocument.value = null
}

const selectDocument = (doc: AlumniDocument) => {
  selectedDocument.value = doc
}

const openDocument = (doc: AlumniDocument) => {
  window.open(doc.downloadUrl, '_blank')
}

const downloadDocument = (doc: AlumniDocument) => {
  const link = document.createElement('a')
  link.href = doc.downloadUrl
  link.download = doc.fileName
  link.click()
}

const handleImageError = () => {
  message.warning('Failed to load image preview. The URL may have expired.')
}

const handleApprove = () => {
  if (!selectedVerification.value) return

  dialog.warning({
    title: 'Approve Alumni Verification',
    content: `Are you sure you want to approve the verification for "${selectedVerification.value.fullName}"? They will receive a confirmation email and be able to login.`,
    positiveText: 'Approve',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      if (!selectedVerification.value) return

      isApproving.value = true
      try {
        await AlumniVerificationApi.approve(selectedVerification.value.userId)
        message.success(`"${selectedVerification.value.fullName}" has been approved. Welcome email sent.`)
        closeDetailModal()
        await loadVerifications()
        await loadPendingCount()
      } catch (error: unknown) {
        const err = error as { code?: string; message?: string }
        if (err.code === 'ALUMNI_REQUEST_ALREADY_PROCESSED') {
          message.warning('This verification has already been processed by another admin.')
          closeDetailModal()
          await loadVerifications()
        } else {
          message.error(err.message || 'Failed to approve verification')
        }
      } finally {
        isApproving.value = false
      }
    },
  })
}

const openRejectModal = () => {
  rejectReason.value = ''
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  rejectReason.value = ''
}

const applyQuickReason = (reason: string) => {
  rejectReason.value = reason
}

const handleReject = async () => {
  if (!selectedVerification.value || !isValidRejectReason.value) return

  isRejecting.value = true
  try {
    await AlumniVerificationApi.reject(selectedVerification.value.userId, rejectReason.value)
    message.success(`Verification for "${selectedVerification.value.fullName}" has been rejected. User has been notified.`)
    closeRejectModal()
    closeDetailModal()
    await loadVerifications()
    await loadPendingCount()
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string }
    if (err.code === 'ALUMNI_REQUEST_ALREADY_PROCESSED') {
      message.warning('This verification has already been processed by another admin.')
      closeRejectModal()
      closeDetailModal()
      await loadVerifications()
    } else {
      message.error(err.message || 'Failed to reject verification')
    }
  } finally {
    isRejecting.value = false
  }
}

const getStatusTagType = (status: AlumniStatus): 'warning' | 'success' | 'error' => {
  switch (status) {
    case 'PENDING':
      return 'warning'
    case 'APPROVED':
      return 'success'
    case 'REJECTED':
      return 'error'
    default:
      return 'warning'
  }
}

const getIdentityTagType = (_identity: string): 'info' | 'default' => {
  return 'info'
}

// ==================== LIFECYCLE ====================

onMounted(() => {
  loadVerifications()
  loadPendingCount()
})

// Watch for status changes to reload pending count
watch(currentStatus, () => {
  if (currentStatus.value !== 'PENDING') {
    loadPendingCount()
  }
})
</script>

<style scoped>
.alumni-verification-view {
  width: 100%;
}

.view-header {
  margin-bottom: 1.5rem;
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

/* Filters */
.filters-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.tabs-wrapper {
  display: flex;
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 0.25rem;
  border-radius: 10px;
}

.tab-button {
  padding: 0.625rem 1.25rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: #1e293b;
  background: rgba(255, 255, 255, 0.5);
}

.tab-button.active {
  background: white;
  color: #1e293b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-badge {
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-weight: 600;
}

.search-wrapper {
  flex: 1;
  max-width: 320px;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #dbb067;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.1);
}

.search-input::placeholder {
  color: #94a3b8;
}

.clear-search {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search:hover {
  color: #64748b;
  background: #f1f5f9;
}

/* Panel */
.panel-container {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

/* Empty State */
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

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.verifications-table {
  width: 100%;
  border-collapse: collapse;
}

.verifications-table th,
.verifications-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

.verifications-table th {
  font-weight: 600;
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #f8fafc;
}

.verifications-table tbody tr:hover {
  background: #f8fafc;
}

.name-cell {
  min-width: 200px;
}

.name-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d2954 0%, #1a3d6e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.full-name {
  font-weight: 500;
  color: #1e293b;
}

.email-cell {
  color: #64748b;
  font-size: 0.875rem;
}

.year-cell,
.date-cell {
  font-size: 0.875rem;
  color: #475569;
}

.identity-cell,
.actions-cell {
  white-space: nowrap;
}

.actions-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  font-size: 0.65rem;
}

/* Pagination */
.pagination-wrapper {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}

/* Detail Modal */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 0.9375rem;
  color: #1e293b;
  font-weight: 500;
}

.rejection-reason {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.reason-text {
  margin: 0.5rem 0 0 0;
  color: #ef4444;
  font-size: 0.875rem;
  line-height: 1.5;
  font-style: italic;
}

/* Documents */
.loading-documents {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  font-size: 0.875rem;
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.document-item:hover {
  border-color: #dbb067;
}

.document-item.active {
  border-color: #dbb067;
  background: rgba(219, 176, 103, 0.05);
}

.doc-icon {
  font-size: 1.5rem;
}

.doc-info {
  flex: 1;
  min-width: 0;
}

.doc-name {
  display: block;
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
}

.resubmit-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-weight: 500;
}

.no-documents {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}

.document-preview {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.preview-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.preview-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.pdf-iframe {
  width: 100%;
  height: 400px;
  border: none;
}

.unsupported-preview {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}

.unsupported-preview svg {
  margin-bottom: 0.75rem;
  opacity: 0.5;
}

.unsupported-preview p {
  margin: 0 0 1rem 0;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 0.5rem;
}

/* Reject Modal */
.reject-content {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.reject-warning {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%);
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #fcd34d;
}

.warning-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.warning-text {
  flex: 1;
}

.warning-text p {
  margin: 0;
  color: #92400e;
  font-size: 0.875rem;
  line-height: 1.5;
}

.warning-text .user-info {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.warning-text .user-info strong {
  font-size: 1rem;
  color: #78350f;
}

.warning-text .user-email {
  font-size: 0.8125rem;
  color: #a16207;
}

.reject-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9375rem;
}

.form-hint {
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0;
}

.required {
  color: #ef4444;
}

.reason-textarea {
  width: 630px;
  max-width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: all 0.2s ease;
  min-height: 120px;
  line-height: 1.6;
}

.reason-textarea:focus {
  border-color: #dbb067;
  box-shadow: 0 0 0 4px rgba(219, 176, 103, 0.1);
}

.reason-textarea::placeholder {
  color: #94a3b8;
}

.textarea-footer {
  display: flex;
  justify-content: flex-end;
}

.char-count {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.char-count.error {
  color: #ef4444;
}

.char-count.valid {
  color: #22c55e;
}

.quick-reasons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f1f5f9;
}

.quick-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.quick-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.quick-reason-btn {
  padding: 0.5rem 0.875rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.quick-reason-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #1e293b;
  transform: translateY(-1px);
}

.quick-reason-btn:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .tabs-wrapper {
    overflow-x: auto;
    width: 100%;
  }

  .search-wrapper {
    max-width: none;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .n-button {
    width: 100%;
  }
}
</style>
