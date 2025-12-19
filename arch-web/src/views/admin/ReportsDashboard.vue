<!-- ============================================== -->
<!-- RUTA: src/views/admin/ReportsDashboard.vue    -->
<!-- ============================================== -->

<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Reports Management</h1>
          <p class="page-subtitle">Review and manage user reports</p>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon pending">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.totalPending }}</span>
          <span class="stat-label">Pending</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon total">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.totalUserReports + stats.totalMessageReports }}</span>
          <span class="stat-label">Total Reports</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon resolved">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.totalThisWeek }}</span>
          <span class="stat-label">This Week</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bans">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12,2C17.5,2 22,6.5 22,12C22,17.5 17.5,22 12,22C6.5,22 2,17.5 2,12C2,6.5 6.5,2 12,2M12,4C7.58,4 4,7.58 4,12C4,16.42 7.58,20 12,20C16.42,20 20,16.42 20,12C20,7.58 16.42,4 12,4M16.5,7.5L17.5,8.5L8.5,17.5L7.5,16.5L16.5,7.5Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.totalThisMonth }}</span>
          <span class="stat-label">This Month</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="search-container">
      <div class="filters-section">
        <div class="filter-label">Filter by status:</div>
        <div class="filters-group">
          <button
            v-for="filter in statusFilters"
            :key="filter.value ?? 'all'"
            :class="['filter-btn', { active: statusFilter === filter.value }]"
            @click="handleStatusFilter(filter.value)"
          >
            {{ filter.label }}
            <span v-if="statusFilter === filter.value && totalCount > 0" class="count-badge">
              {{ totalCount }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading reports...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="reports.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"
        />
      </svg>
      <h3>No reports found</h3>
      <p v-if="statusFilter">No {{ statusFilter }} reports at this time</p>
      <p v-else>All clear! No reports to review</p>
    </div>

    <!-- Reports Table -->
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th
              class="sortable-header"
              @click="changeSort('reporter')"
            >
              Reporter
              <span class="sort-indicator" v-if="sortBy === 'reporter'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th
              class="sortable-header"
              @click="changeSort('reportedUser')"
            >
              Reported
              <span class="sort-indicator" v-if="sortBy === 'reportedUser'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th
              class="sortable-header"
              @click="changeSort('reason')"
            >
              Reason
              <span class="sort-indicator" v-if="sortBy === 'reason'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th
              class="sortable-header"
              @click="changeSort('date')"
            >
              Date
              <span class="sort-indicator" v-if="sortBy === 'date'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th
              class="sortable-header"
              @click="changeSort('status')"
            >
              Status
              <span class="sort-indicator" v-if="sortBy === 'status'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in sortedReports" :key="report.id" class="table-row">
            <td>
              <div class="user-cell">
                <div class="user-avatar">
                  {{
                    report.reporterName
                      ? report.reporterName.charAt(0)
                      : '?'
                  }}
                </div>
                <span>{{ report.reporterName ?? 'Unknown user' }}</span>
              </div>
            </td>
            <td>
              <div class="user-cell">
                <div class="user-avatar reported">
                  <img
                    v-if="report.reportedUserProfilePicture"
                    :src="report.reportedUserProfilePicture"
                    alt="Reported user"
                    class="user-avatar-img"
                  />
                  <span v-else>
                    {{
                      report.reportedUserName
                        ? report.reportedUserName.charAt(0)
                        : '?'
                    }}
                  </span>
                </div>
                <div class="user-info">
                  <span>{{ report.reportedUserName ?? 'Unknown user' }}</span>
                  <span class="report-type-badge" :class="report.reportType">
                    {{ report.reportType === 'message' ? 'Message' : 'Profile' }}
                  </span>
                </div>
              </div>
            </td>
            <td>
              <span :class="['reason-badge', report.reason]">
                {{ formatReason(report.reason) }}
              </span>
            </td>
            <td>{{ formatDate(report.createdAt) }}</td>
            <td>
              <span :class="['status-badge', report.status]">
                {{ report.status }}
              </span>
            </td>
            <td class="actions-cell">
              <button class="action-btn view" @click="openDetailModal(report)" title="View details">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"
                  />
                </svg>
              </button>
              <button
                v-if="report.status === 'pending'"
                class="action-btn resolve"
                @click="openResolveModal(report)"
                title="Resolve"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination-container">
      <div class="pagination">
        <div class="pagination-summary">
          Showing
          <strong>{{ (currentPage - 1) * pageSize + 1 }}</strong>
          –
          <strong>{{ Math.min(currentPage * pageSize, totalCount) }}</strong>
          of
          <strong>{{ totalCount }}</strong>
          reports
        </div>
        <div class="pagination-controls">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="page-btn"
          >
            Previous
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="['page-number-btn', { active: page === currentPage }]"
          >
            {{ page }}
          </button>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Report Details</h2>
          <button @click="closeModals" class="modal-close">×</button>
        </div>
        <div class="modal-body" v-if="selectedReport">
          <div class="detail-section">
            <h4>Reporter</h4>
            <p>{{ selectedReport.reporterName ?? 'Unknown user' }}</p>
          </div>

          <div class="detail-section">
            <h4>Report Type</h4>
            <span class="report-type-badge" :class="selectedReport.reportType">
              {{ selectedReport.reportType === 'message' ? 'Message Report' : 'User Profile Report' }}
            </span>
          </div>

          <!-- Reported User Info (siempre visible) -->
          <div class="detail-section" v-if="selectedReport.reportedUserName">
            <h4>Reported User</h4>
            <div class="user-cell">
              <div class="user-avatar reported">
                <img
                  v-if="selectedReport.reportedUserProfilePicture"
                  :src="selectedReport.reportedUserProfilePicture"
                  alt="Reported user"
                  class="user-avatar-img"
                />
                <span v-else>
                  {{ selectedReport.reportedUserName.charAt(0) }}
                </span>
              </div>
              <div>
                <p class="user-name">{{ selectedReport.reportedUserName }}</p>
                <p v-if="selectedReport.reportedUserEmail" class="user-email">
                  {{ selectedReport.reportedUserEmail }}
                </p>
              </div>
            </div>
          </div>

          <!-- User Profile Details (solo para reportes de usuario) -->
          <div
            class="detail-section"
            v-if="selectedReport.reportType === 'user' && selectedReport.reportedUserProfile"
          >
            <h4>User Profile Details</h4>
            <div class="profile-details">
              <div class="profile-info-item" v-if="selectedReport.reportedUserProfile.age">
                <strong>Age:</strong> {{ selectedReport.reportedUserProfile.age }}
              </div>
              <div class="profile-info-item" v-if="selectedReport.reportedUserProfile.bio">
                <strong>Bio:</strong>
                <p class="bio-text">{{ selectedReport.reportedUserProfile.bio }}</p>
              </div>
              <div
                class="profile-photos"
                v-if="selectedReport.reportedUserPhotos && selectedReport.reportedUserPhotos.length > 0"
              >
                <strong>Photos:</strong>
                <div class="photos-grid">
                  <img
                    v-for="(photo, index) in selectedReport.reportedUserPhotos"
                    :key="index"
                    :src="photo"
                    alt="Profile photo"
                    class="profile-photo"
                    @click="openPhotoModal(photo)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Reported Message (solo para reportes de mensaje) -->
          <div
            class="detail-section"
            v-if="selectedReport.reportType === 'message' && selectedReport.reportedMessage"
          >
            <h4>Reported Message</h4>
            <div class="reported-message-card">
              <div class="reported-message-header">
                <div class="user-avatar">
                  <img
                    v-if="selectedReport.reportedMessage.senderProfilePicture"
                    :src="selectedReport.reportedMessage.senderProfilePicture"
                    alt="Sender"
                    class="user-avatar-img"
                  />
                  <span v-else>
                    {{ selectedReport.reportedMessage.senderName.charAt(0) }}
                  </span>
                </div>
                <div>
                  <p class="reported-message-sender">
                    {{ selectedReport.reportedMessage.senderName }}
                  </p>
                  <p class="reported-message-meta">
                    {{ formatDate(selectedReport.reportedMessage.sentAt) }}
                  </p>
                </div>
              </div>

              <div class="reported-message-body">
                <p v-if="selectedReport.reportedMessage.messageType === 'text'" class="message-content">
                  {{ selectedReport.reportedMessage.content }}
                </p>
                <p v-else class="message-type">
                  {{ selectedReport.reportedMessage.messageType.toUpperCase() }} Message
                </p>

                <div
                  v-if="selectedReport.reportedMessage.mediaUrls && selectedReport.reportedMessage.mediaUrls.length > 0"
                  class="reported-message-media"
                >
                  <a
                    v-for="(url, index) in selectedReport.reportedMessage.mediaUrls"
                    :key="index"
                    :href="url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="media-link"
                  >
                    View Media {{ index + 1 }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4>Reason</h4>
            <span :class="['reason-badge', selectedReport.reason]">
              {{ formatReason(selectedReport.reason) }}
            </span>
          </div>

          <div class="detail-section" v-if="selectedReport.description">
            <h4>Description</h4>
            <p>{{ selectedReport.description }}</p>
          </div>

          <div class="detail-section" v-if="selectedReport.evidenceUrls && selectedReport.evidenceUrls.length > 0">
            <h4>Evidence</h4>
            <div class="evidence-grid">
              <img
                v-for="(url, index) in selectedReport.evidenceUrls"
                :key="index"
                :src="url"
                alt="Evidence"
                class="evidence-photo"
                @click="openPhotoModal(url)"
              />
            </div>
          </div>

          <div class="detail-section">
            <h4>Submitted</h4>
            <p>{{ formatDate(selectedReport.createdAt) }}</p>
          </div>

          <div class="detail-section" v-if="selectedReport.adminNotes">
            <h4>Admin Notes</h4>
            <p>{{ selectedReport.adminNotes }}</p>
          </div>

          <div class="detail-section" v-if="selectedReport.actionTaken">
            <h4>Action Taken</h4>
            <span :class="['action-badge', selectedReport.actionTaken]">
              {{ selectedReport.actionTaken }}
            </span>
          </div>
        </div>
        <div class="modal-footer" v-if="selectedReport?.status === 'pending'">
          <button class="btn-primary" @click="openResolveModal(selectedReport)">
            Resolve Report
          </button>
        </div>
      </div>
    </div>

    <!-- Resolve Modal -->
    <div v-if="showResolveModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Resolve / Dismiss Report</h2>
          <button @click="closeModals" class="modal-close">×</button>
        </div>
        <div class="modal-body" v-if="selectedReport">
          <p class="resolve-info">
            Take action on report against
            <strong>{{ selectedReport.reportedUserName ?? 'Unknown user' }}</strong>
          </p>

          <div class="form-group">
            <label>Action</label>
            <select v-model="resolveData.actionTaken" class="form-select">
              <option value="none">Dismiss report (no action)</option>
              <option value="warning">Send Warning</option>
              <option value="suspension">Suspend User</option>
              <option value="ban">Ban User</option>
            </select>
          </div>

          <div class="form-group" v-if="resolveData.actionTaken === 'suspension'">
            <label>Suspension Days</label>
            <input
              type="number"
              v-model.number="resolveData.suspensionDays"
              class="form-input"
              min="1"
              max="365"
              placeholder="Number of days"
            />
          </div>

          <div class="form-group">
            <label>
              Admin Notes
              <span v-if="resolveData.actionTaken === 'ban'" class="required-asterisk">*</span>
              <span v-else class="optional-label">(optional)</span>
            </label>
            <textarea
              v-model="resolveData.adminNotes"
              class="form-textarea"
              placeholder="Internal notes about this decision..."
              rows="3"
            ></textarea>
          </div>

          <div
            v-if="resolveData.actionTaken === 'ban'"
            class="form-group ban-warning"
          >
            <div class="ban-warning-header">
              <span class="ban-warning-icon">!</span>
              <div class="ban-warning-text">
                <h4>Permanent action</h4>
                <p>
                  Banning a user is a serious, potentially irreversible action. Make sure you've
                  reviewed all information before continuing.
                </p>
              </div>
            </div>

            <label class="ban-confirm-label">
              To confirm, type
              <code>BAN USER</code>
              in the box below:
            </label>
            <input
              v-model="resolveData.banConfirmText"
              type="text"
              class="form-input ban-confirm-input"
              placeholder="Type BAN USER to confirm the ban"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModals">Cancel</button>
          <button
            class="btn-primary"
            @click="handleResolve"
            :disabled="
              resolving ||
              (resolveData.actionTaken === 'ban' &&
                (resolveData.adminNotes.trim().length === 0 ||
                  resolveData.banConfirmText.trim().toUpperCase() !== 'BAN USER'))
            "
          >
            {{
              resolving
                ? 'Processing...'
                : resolveData.actionTaken === 'none'
                  ? 'Dismiss report'
                  : resolveData.actionTaken === 'ban'
                    ? 'Ban user'
                    : 'Apply action'
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Photo Modal -->
    <div v-if="showPhotoModal" class="modal-overlay" @click="showPhotoModal = false">
      <div class="photo-modal-content" @click.stop>
        <button @click="showPhotoModal = false" class="modal-close">×</button>
        <img :src="selectedPhotoUrl" alt="Evidence" class="photo-modal-img" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, computed, watch } from 'vue'
import { ReportsApi, type ReportListDto, type ReportDetailDto, type ReportStatsDto } from '@/services/Api'

// State
const loading = ref(true)
const resolving = ref(false)
const reports = ref<ReportListDto[]>([])
const stats = ref<ReportStatsDto>({
  totalPending: 0,
  totalReviewing: 0,
  totalThisWeek: 0,
  totalThisMonth: 0,
  totalUserReports: 0,
  totalMessageReports: 0,
  byReason: {},
  byStatus: {},
  byType: {},
  topReportedUsers: [],
})
const currentPage = ref(1)
const pageSize = ref(20)
const totalPages = ref(0)
const totalCount = ref(0)
const statusFilter = ref<string | null>(null)
const showDetailModal = ref(false)
const showResolveModal = ref(false)
const selectedReport = ref<ReportDetailDto | null>(null)
const showPhotoModal = ref(false)
const selectedPhotoUrl = ref<string>('')
const sortBy = ref<'reporter' | 'reportedUser' | 'reason' | 'date' | 'status'>('date')
const sortDirection = ref<'asc' | 'desc'>('desc')

const resolveData = reactive({
  actionTaken: 'none',
  adminNotes: '',
  suspensionDays: 7,
  banConfirmText: '',
})

const statusFilters = [
  { value: null, label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
]

// Methods
const sortedReports = computed(() => {
  const items = [...reports.value]

  return items.sort((a, b) => {
    const dir = sortDirection.value === 'asc' ? 1 : -1

    switch (sortBy.value) {
      case 'reporter': {
        const an = a.reporterName || ''
        const bn = b.reporterName || ''
        return an.localeCompare(bn) * dir
      }
      case 'reportedUser': {
        const an = a.reportedUserName || ''
        const bn = b.reportedUserName || ''
        return an.localeCompare(bn) * dir
      }
      case 'reason': {
        return a.reason.localeCompare(b.reason) * dir
      }
      case 'status': {
        return a.status.localeCompare(b.status) * dir
      }
      case 'date':
      default: {
        const ad = new Date(a.createdAt).getTime()
        const bd = new Date(b.createdAt).getTime()
        return (ad - bd) * dir
      }
    }
  })
})

const changeSort = (key: 'reporter' | 'reportedUser' | 'reason' | 'date' | 'status') => {
  if (sortBy.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortDirection.value = key === 'date' ? 'desc' : 'asc'
  }
}

const fetchReports = async () => {
  loading.value = true
  try {
    const response = await ReportsApi.list({
      status: statusFilter.value || undefined,
      page: currentPage.value,
      pageSize: pageSize.value,
    })
    reports.value = response.items
    totalPages.value = response.totalPages
    totalCount.value = response.totalCount
  } catch (error) {
    console.error('Failed to load reports:', error)
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    stats.value = await ReportsApi.getStats()
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const handleStatusFilter = (filter: string | null) => {
  statusFilter.value = filter
  currentPage.value = 1
  fetchReports()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchReports()
  }
}

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  const end = Math.min(totalPages.value, currentPage.value - 2 + maxVisible - 1)
  const start = Math.max(1, end - maxVisible + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const formatReason = (reason: string): string => {
  const labels: Record<string, string> = {
    harassment: 'Harassment',
    spam: 'Spam',
    inappropriate_content: 'Inappropriate Content',
    fake_profile: 'Fake Profile',
    other: 'Other',
  }
  return labels[reason] || reason
}

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const openDetailModal = async (report: ReportListDto) => {
  try {
    // Fetch full details from API
    const detail = await ReportsApi.get(report.reportType, report.id)
    selectedReport.value = detail
    showDetailModal.value = true
  } catch (error) {
    console.error('Failed to load report details:', error)
    // Fallback to list item if detail fetch fails
    selectedReport.value = report as any
    showDetailModal.value = true
  }
}

const openResolveModal = async (report: ReportListDto | ReportDetailDto) => {
  // If it's a list item, fetch full details
  if (!('reportedUserProfile' in report)) {
    try {
      const detail = await ReportsApi.get(report.reportType, report.id)
      selectedReport.value = detail
    } catch (error) {
      console.error('Failed to load report details:', error)
      selectedReport.value = report as any
    }
  } else {
    selectedReport.value = report
  }
  
  resolveData.actionTaken = 'none'
  resolveData.adminNotes = ''
  resolveData.suspensionDays = 7
  resolveData.banConfirmText = ''
  showDetailModal.value = false
  showResolveModal.value = true
}

// Bloquear scroll del body cuando hay modal abierto
const isAnyModalOpen = computed(() => showDetailModal.value || showResolveModal.value)

watch(isAnyModalOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Limpiar al desmontar el componente
onUnmounted(() => {
  document.body.style.overflow = ''
})

const closeModals = () => {
  showDetailModal.value = false
  showResolveModal.value = false
  resolveData.banConfirmText = ''
  selectedReport.value = null
}

const handleResolve = async () => {
  if (!selectedReport.value) return

  resolving.value = true
  try {
    await ReportsApi.resolve(selectedReport.value.reportType, selectedReport.value.id, {
      actionTaken: resolveData.actionTaken,
      adminNotes: resolveData.adminNotes || undefined,
      suspensionDays:
        resolveData.actionTaken === 'suspension' ? resolveData.suspensionDays : undefined,
    })
    closeModals()
    fetchReports()
    fetchStats()
  } catch (error) {
    console.error('Failed to resolve report:', error)
    alert('Failed to resolve report. Please try again.')
  } finally {
    resolving.value = false
  }
}

const openPhotoModal = (url: string) => {
  selectedPhotoUrl.value = url
  showPhotoModal.value = true
}

onMounted(() => {
  fetchReports()
  fetchStats()
})
</script>

<style scoped>
/* ==================== BASE DASHBOARD STYLES ==================== */
.dashboard {
  padding: 0;
  min-height: 100vh;
  background: #f9fafb;
}

.dashboard-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem 2.5rem;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 1rem;
  color: #718096;
  margin: 0;
}

/* ==================== STATS CARDS ==================== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 1.5rem 2.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.pending {
  background: #fef3c7;
  color: #d97706;
}
.stat-icon.total {
  background: #dbeafe;
  color: #2563eb;
}
.stat-icon.resolved {
  background: #d1fae5;
  color: #059669;
}
.stat-icon.bans {
  background: #fee2e2;
  color: #dc2626;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
}

/* ==================== FILTERS ==================== */
.search-container {
  padding: 1.5rem 2.5rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.filters-section {
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filters-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
}

.filter-btn {
  padding: 0.625rem 1rem;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 10px;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn:hover {
  border-color: #dbb067;
  color: #0d2954;
}

.filter-btn.active {
  background: #0d2954;
  border-color: #0d2954;
  color: #fff;
}

.count-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
}

/* ==================== LOADING & EMPTY STATES ==================== */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #dbb067;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state svg {
  color: #d1d5db;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0;
}

/* ==================== TABLE ==================== */
.table-container {
  padding: 2rem 2.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  table-layout: fixed;
}

.data-table th,
.data-table td {
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.data-table th {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  color: #475569;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table td {
  color: #1e293b;
  font-weight: 500;
  font-size: 0.9375rem;
}

/* Column widths */
.data-table th:nth-child(1),
.data-table td:nth-child(1) {
  width: 16%;
}

.data-table th:nth-child(2),
.data-table td:nth-child(2) {
  width: 16%;
}

.data-table th:nth-child(3),
.data-table td:nth-child(3) {
  width: 14%;
}

.data-table th:nth-child(4),
.data-table td:nth-child(4) {
  width: 18%;
}

.data-table th:nth-child(5),
.data-table td:nth-child(5) {
  width: 12%;
}

.data-table th:nth-child(6),
.data-table td:nth-child(6) {
  width: 12%;
  text-align: right;
}

.table-row:hover {
  background-color: #f8fafc;
}

.table-row:last-child td {
  border-bottom: none;
}

/* ==================== USER CELLS ==================== */
.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.user-cell span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-avatar {
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d2954 0%, #1a3d6e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.user-avatar.reported {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.report-type-badge {
  display: inline-flex;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.report-type-badge.user {
  background: #dbeafe;
  color: #1e40af;
}

.report-type-badge.message {
  background: #fce7f3;
  color: #9d174d;
}

/* ==================== BADGES ==================== */
.reason-badge {
  display: inline-flex;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.reason-badge.harassment {
  background: #fee2e2;
  color: #991b1b;
}
.reason-badge.spam {
  background: #fef3c7;
  color: #92400e;
}
.reason-badge.inappropriate_content {
  background: #fce7f3;
  color: #9d174d;
}
.reason-badge.fake_profile {
  background: #e0e7ff;
  color: #3730a3;
}
.reason-badge.other {
  background: #f3f4f6;
  color: #4b5563;
}

.required-asterisk {
  color: #dc2626;
  margin-left: 0.15rem;
}

.optional-label {
  margin-left: 0.25rem;
  font-size: 0.8rem;
  color: #9ca3af;
}

.ban-warning {
  margin-top: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #fee2e2;
  background: #fef2f2;
}

.ban-warning-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.ban-warning-icon {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #fee2e2;
  color: #b91c1c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.ban-warning-text h4 {
  margin: 0 0 0.15rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #991b1b;
}

.ban-warning-text p {
  margin: 0;
  font-size: 0.8rem;
  color: #7f1d1d;
}

.ban-confirm-label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.8rem;
  color: #4b5563;
}

.ban-confirm-label code {
  background: #111827;
  color: #f9fafb;
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.ban-confirm-input {
  border-color: #fecaca;
}

.ban-confirm-input:focus {
  outline: none;
  box-shadow: 0 0 0 1px #ef4444;
  border-color: #ef4444;
}

.sortable-header {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.sortable-header:hover {
  color: #1e293b;
}

.sort-indicator {
  font-size: 0.7rem;
}

.status-badge {
  display: inline-flex;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}
.status-badge.resolved {
  background: #d1fae5;
  color: #065f46;
}
.status-badge.reviewed {
  background: #dbeafe;
  color: #1e40af;
}
.status-badge.dismissed {
  background: #f3f4f6;
  color: #4b5563;
}

.action-badge {
  display: inline-flex;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.action-badge.none {
  background: #f3f4f6;
  color: #4b5563;
}
.action-badge.warning {
  background: #fef3c7;
  color: #92400e;
}
.action-badge.suspension {
  background: #fed7aa;
  color: #9a3412;
}
.action-badge.ban {
  background: #fee2e2;
  color: #991b1b;
}

.pagination-summary {
  font-size: 0.85rem;
  color: #4b5563;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-number-btn {
  min-width: 2rem;
  height: 2rem;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.8rem;
  color: #4b5563;
  cursor: pointer;
  padding: 0 0.5rem;
}

.page-number-btn.active {
  background: #111827;
  color: #f9fafb;
  border-color: #111827;
}

.page-number-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

/* ==================== ACTION BUTTONS ==================== */
.actions-cell {
  text-align: right;
}

.action-btn {
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 0.5rem;
}

.action-btn.view {
  color: #3b82f6;
}

.action-btn.view:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.action-btn.resolve {
  color: #059669;
}

.action-btn.resolve:hover {
  background: #d1fae5;
  border-color: #6ee7b7;
}

/* ==================== PAGINATION ==================== */
.pagination-container {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-btn {
  padding: 0.625rem 1rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: #dbb067;
  color: #0d2954;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  color: #64748b;
  font-size: 0.875rem;
}

/* ==================== MODALS ==================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  line-height: 1;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f9fafb;
}

/* ==================== DETAIL SECTIONS ==================== */
.detail-section {
  margin-bottom: 1rem;
}

.detail-section h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-section p {
  margin: 0;
  color: #1f2937;
}

.user-name {
  margin: 0;
  font-weight: 600;
  color: #1f2937;
}

.user-email {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
}

.profile-details {
  margin-top: 0.5rem;
}

.profile-info-item {
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.profile-info-item strong {
  color: #374151;
  margin-right: 0.5rem;
}

.bio-text {
  margin-top: 0.25rem;
  color: #4b5563;
  line-height: 1.5;
}

.profile-photos {
  margin-top: 1rem;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.profile-photo {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  transition: all 0.2s;
}

.profile-photo:hover {
  border-color: #dbb067;
  transform: scale(1.05);
}

.evidence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.evidence-photo {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  transition: all 0.2s;
}

.evidence-photo:hover {
  border-color: #dbb067;
  transform: scale(1.05);
}

.reported-message-card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  margin-top: 0.5rem;
}

.reported-message-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.reported-message-sender {
  margin: 0;
  font-weight: 600;
  color: #111827;
}

.reported-message-meta {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
}

.reported-message-body {
  margin-top: 0.5rem;
}

.message-content {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #1f2937;
  line-height: 1.5;
}

.message-type {
  margin: 0;
  color: #6b7280;
  font-style: italic;
}

.reported-message-media {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.media-link {
  font-size: 0.8rem;
  color: #2563eb;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  transition: all 0.2s;
}

.media-link:hover {
  background: #eff6ff;
  border-color: #3b82f6;
}

.photo-modal-content {
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-modal-img {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
}

.resolve-info {
  margin-bottom: 1.5rem;
  color: #4b5563;
}

/* ==================== FORM ELEMENTS ==================== */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-select,
.form-input,
.form-textarea {
  width: 96%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  background: #fff;
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
  border-color: #dbb067;
  outline: none;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* ==================== BUTTONS ==================== */
.btn-primary {
  background: #dbb067;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #c9a05a;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1.5rem;
  }

  .stats-grid {
    padding: 1rem;
    gap: 1rem;
  }

  .search-container {
    padding: 1rem;
  }

  .table-container {
    padding: 1rem;
    overflow-x: auto;
  }

  .data-table {
    min-width: 700px;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .modal-content {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
}
</style>
