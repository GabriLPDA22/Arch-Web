<!-- ============================================== -->
<!-- RUTA: src/views/admin/JobsDashboard.vue       -->
<!-- ============================================== -->

<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Jobs Management</h1>
          <p class="page-subtitle">Manage job postings and opportunities</p>
        </div>
        <div class="header-actions">
          <button class="btn-create" @click="openCreateModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Create Job
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ totalJobs }}</span>
          <span class="stat-label">Total Jobs</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon published">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ alumniJobs }}</span>
          <span class="stat-label">Alumni Jobs</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon draft">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ studentJobs }}</span>
          <span class="stat-label">Student Jobs</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon closed">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ paidJobs }}</span>
          <span class="stat-label">Paid Jobs</span>
        </div>
      </div>
    </div>

    <!-- Skeleton loading state -->
    <div v-if="loading">
      <TableSkeleton
        :rows="8"
        :columns="[
          { type: 'text', size: 'large' },
          { type: 'text', size: 'medium' },
          { type: 'text', size: 'medium' },
          { type: 'badge' },
          { type: 'badge' },
          { type: 'text', size: 'small' },
          { type: 'actions', count: 3 }
        ]"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="jobs.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"
        />
      </svg>
      <h3>No jobs found</h3>
      <p>No jobs available</p>
    </div>

    <!-- Jobs Table -->
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th
              class="sortable-header"
              @click="changeSort('title')"
            >
              Title
              <span class="sort-indicator" v-if="sortBy === 'title'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th
              class="sortable-header"
              @click="changeSort('company')"
            >
              Company
              <span class="sort-indicator" v-if="sortBy === 'company'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th>Category</th>
            <th>Pay Range</th>
            <th>Target</th>
            <th>Deadline</th>
            <th
              class="sortable-header"
              @click="changeSort('date')"
            >
              Created
              <span class="sort-indicator" v-if="sortBy === 'date'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in sortedJobs" :key="job.id" class="table-row">
            <td>
              <div class="job-title-cell">
                <strong>{{ job.title }}</strong>
                <span v-if="job.interestedCandidatesCount !== undefined && job.interestedCandidatesCount > 0" class="candidates-badge">
                  {{ job.interestedCandidatesCount }} interested
                </span>
              </div>
            </td>
            <td>{{ job.companyName }}</td>
            <td>
              <div class="categories-cell">
                <span v-for="cat in (job.categories || [])" :key="cat" class="category-badge">{{ cat }}</span>
              </div>
            </td>
            <td>{{ job.payRange || '-' }}</td>
            <td>
              <span :class="['target-badge', job.isFromAlumni ? 'alumni' : 'student']">
                <template v-if="job.isFromAlumni">
                  <svg class="target-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M5,13V21H9V17H15V21H19V13L12,9L5,13M12,11L15.5,13L12,15L8.5,13L12,11Z M12,2L15.09,5.59L12,7L8.91,5.59L12,2M5,5V9L8,7L12,9L16,7L19,9V5L12,1L5,5Z"/>
                  </svg>
                  Alumni
                </template>
                <template v-else>
                  <svg class="target-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V4A2,2 0 0,0 18,2M13,8H19V14H13V8M11,8V14H7V8H11M13,16H19V20H13V16M11,20V16H7V20H11M7,4H11V6H7V4M13,4H19V6H13V4Z"/>
                  </svg>
                  Students
                </template>
              </span>
            </td>
            <td>{{ job.applicationDeadline ? formatDateOnly(job.applicationDeadline) : '-' }}</td>
            <td>{{ formatDate(job.createdAt) }}</td>
            <td class="actions-cell">
              <button class="action-btn view" @click="openDetailModal(job)" title="View details">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"
                  />
                </svg>
              </button>
              <button class="action-btn edit" @click="openEditModal(job)" title="Edit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                  />
                </svg>
              </button>
              <button
                class="action-btn delete"
                @click="handleDelete(job)"
                title="Delete"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination (mismo componente que el resto del admin) -->
    <div v-if="totalPages > 1" class="pagination-wrapper">
      <div class="pagination-summary">
        Showing
        <strong>{{ (currentPage - 1) * pageSize + 1 }}</strong>
        –
        <strong>{{ Math.min(currentPage * pageSize, totalCount) }}</strong>
        of
        <strong>{{ totalCount }}</strong>
        jobs
      </div>
      <PaginationComponent
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="goToPage"
      />
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @mousedown="handleBackdropMouseDown" @mouseup="handleDetailBackdropMouseUp">
      <div class="modal-content" @mousedown.stop @mouseup.stop>
        <div class="modal-header">
          <h2>Job Details</h2>
          <button @click="closeModals" class="modal-close">×</button>
        </div>
        <div class="modal-body" v-if="selectedJob">
          <div class="detail-section">
            <h4>Title</h4>
            <p><strong>{{ selectedJob.title }}</strong></p>
          </div>

          <div class="detail-section">
            <h4>Company</h4>
            <p>{{ selectedJob.companyName }}</p>
          </div>

          <div class="detail-section">
            <h4>Location</h4>
            <p>{{ selectedJob.locationText }}</p>
          </div>

          <div class="detail-section">
            <h4>Duration & Payment</h4>
            <span class="duration-badge">{{ selectedJob.durationText }}</span>
            <span v-if="selectedJob.isPaid" class="paid-badge">Paid</span>
            <span v-else class="unpaid-badge">Unpaid</span>
          </div>

          <div class="detail-section">
            <h4>Categories</h4>
            <div class="categories-cell">
              <span v-for="cat in (selectedJob.categories || [])" :key="cat" class="category-badge">{{ cat }}</span>
            </div>
          </div>

          <div class="detail-section" v-if="selectedJob.payRange">
            <h4>Pay Range</h4>
            <p>{{ selectedJob.payRange }}</p>
          </div>

          <div class="detail-section" v-if="selectedJob.applicationDeadline">
            <h4>Application Deadline</h4>
            <p v-if="selectedJob.applicationDeadlineWeek" class="deadline-week">
              {{ selectedJob.applicationDeadlineWeek }}
            </p>
            <p class="deadline-date">
              {{ formatDateOnly(selectedJob.applicationDeadline) }}
            </p>
          </div>

          <div class="detail-section">
            <h4>Target Audience</h4>
            <span :class="['target-badge', selectedJob.isFromAlumni ? 'alumni' : 'student']">
              <template v-if="selectedJob.isFromAlumni">
                <svg class="target-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M5,13V21H9V17H15V21H19V13L12,9L5,13M12,11L15.5,13L12,15L8.5,13L12,11Z M12,2L15.09,5.59L12,7L8.91,5.59L12,2M5,5V9L8,7L12,9L16,7L19,9V5L12,1L5,5Z"/>
                </svg>
                Alumni Only
              </template>
              <template v-else>
                <svg class="target-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V4A2,2 0 0,0 18,2M13,8H19V14H13V8M11,8V14H7V8H11M13,16H19V20H13V16M11,20V16H7V20H11M7,4H11V6H7V4M13,4H19V6H13V4Z"/>
                </svg>
                Students
              </template>
            </span>
          </div>

          <div class="detail-section">
            <h4>Description</h4>
            <p class="description-text">{{ selectedJob.description }}</p>
          </div>

          <div class="detail-section" v-if="selectedJob.applyUrl">
            <h4>Apply URL</h4>
            <a :href="selectedJob.applyUrl" target="_blank" rel="noopener noreferrer" class="apply-link">
              {{ selectedJob.applyUrl }}
            </a>
          </div>

          <div class="detail-section" v-if="selectedJob.imageUrl">
            <h4>Image</h4>
            <ImageWithSkeleton
              :src="selectedJob.imageUrl"
              :alt="selectedJob.title"
              width="100%"
              :height="200"
              :border-radius="12"
              object-fit="contain"
              image-class="job-image"
            />
          </div>

          <div class="detail-section">
            <h4>Organization</h4>
            <p>{{ selectedJob.organizationName || (selectedJob.organizationId ? getOrganizationName(selectedJob.organizationId) : 'No Organization') }}</p>
          </div>

          <div class="detail-section" v-if="selectedJob.createdByName">
            <h4>Created By</h4>
            <p>{{ selectedJob.createdByName }}</p>
          </div>

          <div class="detail-section">
            <h4>Created At</h4>
            <p>{{ formatDate(selectedJob.createdAt) }}</p>
          </div>

          <div class="detail-section" v-if="selectedJob.publishedAt">
            <h4>Published At</h4>
            <p>{{ formatDate(selectedJob.publishedAt) }}</p>
          </div>

          <div class="detail-section" v-if="selectedJob.interestedCandidatesCount !== undefined && selectedJob.interestedCandidatesCount > 0">
            <h4>Interested Candidates</h4>
            <p>{{ selectedJob.interestedCandidatesCount }} candidate(s) expressed interest</p>
            <button class="btn-view-candidates" @click="openCandidatesModal(selectedJob.id)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
              View Candidates
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModals">Close</button>
          <button
            class="btn-primary"
            @click="openEditModal(selectedJob!)"
            :disabled="processing"
          >
            Edit Job
          </button>
        </div>
      </div>
    </div>

    <!-- Create Job Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @mousedown="handleBackdropMouseDown" @mouseup="handleCreateBackdropMouseUp">
      <div class="modal-content create-modal" @mousedown.stop @mouseup.stop>
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Job' : 'Create New Job' }}</h2>
          <button @click="closeCreateModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleCreateJob" class="job-form">
            <div class="form-group">
              <label>
                Organization
              </label>
              <select
                v-model="createForm.organizationId"
                class="form-select"
                :disabled="loadingOrganizations || isEditing"
              >
                <option value="">No Organization</option>
                <option
                  v-for="org in organizations"
                  :key="org.id"
                  :value="org.id"
                >
                  {{ org.name }}
                </option>
              </select>
              <p v-if="loadingOrganizations" class="form-hint">Loading organizations...</p>
              <p class="form-hint">Leave as "No Organization" to create a job without an organization</p>
            </div>

            <div class="form-group">
              <label>
                Job Title <span class="required">*</span>
              </label>
              <input
                v-model="createForm.title"
                type="text"
                class="form-input"
                placeholder="e.g., Software Engineer"
                required
                maxlength="200"
              />
            </div>

            <div class="form-group">
              <label>
                Company Name <span class="required">*</span>
              </label>
              <input
                v-model="createForm.companyName"
                type="text"
                class="form-input"
                placeholder="e.g., Tech Corp"
                required
                maxlength="200"
              />
            </div>

            <div class="form-group">
              <label>
                Location <span class="required">*</span>
              </label>
              <input
                v-model="createForm.locationText"
                type="text"
                class="form-input"
                placeholder="e.g., Oxford, UK"
                required
                maxlength="200"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>
                  Duration <span class="required">*</span>
                </label>
                <select v-model="createForm.durationText" class="form-select" required>
                  <option value="">Select duration...</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div class="form-group">
                <label>
                  Categories <span class="required">*</span>
                </label>
                <div class="categories-multi-select">
                  <label
                    v-for="cat in categories"
                    :key="cat"
                    class="category-checkbox-label"
                    :class="{ selected: createForm.categories.includes(cat) }"
                  >
                    <input
                      type="checkbox"
                      :value="cat"
                      v-model="createForm.categories"
                      class="category-checkbox"
                    />
                    <span>{{ cat }}</span>
                  </label>
                </div>
                <p class="form-hint">Select one or more categories for this job</p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Pay Range</label>
                <input
                  v-model="createForm.payRange"
                  type="text"
                  class="form-input"
                  placeholder="e.g., £1500-£2000"
                  maxlength="100"
                />
              </div>

              <div class="form-group">
                <label>Application Deadline</label>
                <div class="datetime-picker-container">
                  <DateTimePicker
                    v-model="createForm.applicationDeadline"
                    placeholder="Select application deadline"
                  />
                </div>
                <p class="form-hint">The deadline date for job applications</p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                    v-model="createForm.isPaid"
                    type="checkbox"
                    class="form-checkbox"
                  />
                  <span>Paid Position</span>
                </label>
              </div>

              <div class="form-group">
                <label class="checkbox-label alumni-checkbox">
                  <input
                    v-model="createForm.isFromAlumni"
                    type="checkbox"
                    class="form-checkbox"
                  />
                  <span>🎓 For Alumni Only</span>
                </label>
                <p class="form-hint">If checked, this job will only be visible to Alumni users (with golden tick)</p>
              </div>
            </div>

            <div class="form-group">
              <label>
                Description <span class="required">*</span>
              </label>
              <textarea
                v-model="createForm.description"
                class="form-textarea"
                placeholder="Describe the job position, requirements, and responsibilities..."
                required
                rows="6"
                maxlength="5000"
              ></textarea>
              <p class="form-hint">{{ createForm.description.length }}/5000 characters</p>
            </div>

            <div class="form-group">
              <label>Apply URL (optional)</label>
              <input
                v-model="createForm.applyUrl"
                type="url"
                class="form-input"
                placeholder="https://example.com/apply"
                maxlength="500"
              />
              <p class="form-hint">URL where candidates can apply for this job</p>
            </div>

            <div class="form-group">
              <label>Job Image (optional)</label>
              <p class="image-hint">Maximum file size: 5MB. Accepted formats: PNG, JPG, GIF</p>
              <div class="image-upload-wrapper">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/gif, image/jpg"
                  class="file-input"
                  @change="handleImageSelection"
                />
                <div v-if="imagePreviewUrl" class="image-preview">
                  <img :src="imagePreviewUrl" alt="Image preview" />
                  <button 
                    type="button" 
                    class="remove-image-btn"
                    @click="removeImage"
                  >
                    ✕
                  </button>
                </div>
                <div v-else class="image-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2"/>
                    <polyline points="17 8 12 3 7 8" stroke-width="2"/>
                    <line x1="12" y1="3" x2="12" y2="15" stroke-width="2"/>
                  </svg>
                  <p>Click to upload image</p>
                  <span class="file-size-hint">Max 5MB</span>
                </div>
              </div>
              <div v-if="createForm.imageUrl && !imageFile" class="form-group" style="margin-top: 0.5rem;">
                <label style="font-size: 0.875rem; color: #6b7280;">Or enter image URL:</label>
                <input
                  v-model="createForm.imageUrl"
                  type="url"
                  class="form-input"
                  placeholder="https://example.com/image.jpg"
                  maxlength="2000"
                  style="margin-top: 0.25rem;"
                />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeCreateModal" :disabled="creating">
            Cancel
          </button>
          <button
            class="btn-primary"
            @click="handleCreateJob"
            :disabled="creating || !isFormValid"
          >
            {{ creating ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Job') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Candidates Modal -->
    <div v-if="showCandidatesModal" class="modal-overlay" @mousedown="handleBackdropMouseDown" @mouseup="handleCandidatesBackdropMouseUp">
      <div class="modal-content candidates-modal" @mousedown.stop @mouseup.stop>
        <div class="modal-header">
          <h2>Interested Candidates</h2>
          <button @click="closeCandidatesModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div v-if="loadingCandidates" class="loading-candidates">
            <div class="spinner"></div>
            <p>Loading candidates...</p>
          </div>
          <div v-else-if="interestedCandidates.length === 0" class="empty-candidates">
            <p>No candidates have expressed interest yet.</p>
          </div>
          <div v-else class="candidates-list">
            <div v-for="candidate in interestedCandidates" :key="candidate.candidateUserId" class="candidate-card">
              <div class="candidate-header">
                <img 
                  v-if="candidate.candidateProfilePicture" 
                  :src="candidate.candidateProfilePicture" 
                  :alt="candidate.candidateName"
                  class="candidate-avatar"
                />
                <div v-else class="candidate-avatar-placeholder">
                  {{ candidate.candidateName.charAt(0).toUpperCase() }}
                </div>
                <div class="candidate-info">
                  <h4>{{ candidate.candidateName }}</h4>
                  <p v-if="candidate.candidateEmail" class="candidate-email">{{ candidate.candidateEmail }}</p>
                  <p class="candidate-date">Applied: {{ formatDate(candidate.expressedInterestAt) }}</p>
                </div>
              </div>
              <div v-if="candidateProfiles[candidate.candidateUserId]" class="cv-points">
                <h5>CV Highlights</h5>
                <div class="cv-point" v-if="parseCvPoints(candidateProfiles[candidate.candidateUserId].sellingPoints).top">
                  <span class="cv-label">1. Top thing on CV:</span>
                  <span class="cv-value">{{ parseCvPoints(candidateProfiles[candidate.candidateUserId].sellingPoints).top }}</span>
                </div>
                <div class="cv-point" v-if="parseCvPoints(candidateProfiles[candidate.candidateUserId].sellingPoints).second">
                  <span class="cv-label">2. Next best thing:</span>
                  <span class="cv-value">{{ parseCvPoints(candidateProfiles[candidate.candidateUserId].sellingPoints).second }}</span>
                </div>
                <div class="cv-point" v-if="parseCvPoints(candidateProfiles[candidate.candidateUserId].sellingPoints).third">
                  <span class="cv-label">3. Third best thing:</span>
                  <span class="cv-value">{{ parseCvPoints(candidateProfiles[candidate.candidateUserId].sellingPoints).third }}</span>
                </div>
                <div v-if="candidateProfiles[candidate.candidateUserId].college" class="cv-extra">
                  <strong>College:</strong> {{ candidateProfiles[candidate.candidateUserId].college }}
                </div>
                <div v-if="candidateProfiles[candidate.candidateUserId].course" class="cv-extra">
                  <strong>Course:</strong> {{ candidateProfiles[candidate.candidateUserId].course }}
                </div>
              </div>
              <div v-else class="cv-loading">
                <span>Loading profile...</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeCandidatesModal">Close</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ModalComponent :show="showDeleteModal" title="Delete Job" @close="closeDeleteModal">
      <div class="delete-warning">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />
        </svg>
        <p>
          Are you sure you want to delete <strong>{{ jobToDelete?.title }}</strong>?
        </p>
        <p class="warning-text">This action cannot be undone.</p>
      </div>
      <template #footer>
        <button class="btn-secondary" @click="closeDeleteModal">Cancel</button>
        <button class="btn-danger" @click="handleDeleteConfirm" :disabled="processing">
          {{ processing ? 'Deleting...' : 'Delete Job' }}
        </button>
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { JobsApi, OrganizationsApi, CandidateProfilesApi, parseCvPoints, type JobListDto, type JobDetailDto, type JobCreateDto, type JobUpdateDto, type OrganizationListDto, type InterestedCandidateDto, type CandidateProfileDto } from '@/services/Api'
import TableSkeleton from '@/components/ui/TableSkeleton.vue'
import ImageWithSkeleton from '@/components/ui/ImageWithSkeleton.vue'
import PaginationComponent from '@/components/ui/PaginationComponent.vue'
import ModalComponent from '@/components/ui/ModalComponent.vue'
import DateTimePicker from '@/components/calendar/CustomCalendar.vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

// State
const loading = ref(true)
const processing = ref(false)
const creating = ref(false)
const jobs = ref<JobListDto[]>([])
const organizations = ref<OrganizationListDto[]>([])
const loadingOrganizations = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const totalPages = ref(0)
const totalCount = ref(0)
const showDetailModal = ref(false)
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const jobToDelete = ref<JobListDto | null>(null)
const selectedJob = ref<JobDetailDto | null>(null)
const editingJob = ref<JobDetailDto | null>(null)
const isEditing = ref(false)
const sortBy = ref<'title' | 'company' | 'date'>('date')
const sortDirection = ref<'asc' | 'desc'>('desc')
const imageFile = ref<File | null>(null)
const imagePreviewUrl = ref<string | null>(null)
const imageLoaded = ref(false)

// Candidates modal state
const showCandidatesModal = ref(false)
const loadingCandidates = ref(false)
const interestedCandidates = ref<InterestedCandidateDto[]>([])
const candidateProfiles = ref<Record<string, CandidateProfileDto>>({})

// Para evitar cerrar modales al arrastrar texto
const mouseDownOnBackdrop = ref(false)

const handleBackdropMouseDown = () => {
  mouseDownOnBackdrop.value = true
}

const handleDetailBackdropMouseUp = () => {
  if (mouseDownOnBackdrop.value) closeModals()
  mouseDownOnBackdrop.value = false
}

const handleCreateBackdropMouseUp = () => {
  if (mouseDownOnBackdrop.value) closeCreateModal()
  mouseDownOnBackdrop.value = false
}

const handleCandidatesBackdropMouseUp = () => {
  if (mouseDownOnBackdrop.value) closeCandidatesModal()
  mouseDownOnBackdrop.value = false
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  jobToDelete.value = null
}

// Lista de categorías (cargadas desde el API)
const categories = ref<string[]>([])

// Tipo interno para el formulario con todos los campos como strings
type JobFormData = {
  organizationId: string
  title: string
  companyName: string
  locationText: string
  durationText: string
  isPaid: boolean
  description: string
  applyUrl: string
  imageUrl: string
  categories: string[]
  payRange: string
  applicationDeadline: string
  isFromAlumni: boolean
}

const createForm = reactive<JobFormData>({
  organizationId: '',
  title: '',
  companyName: '',
  locationText: '',
  durationText: '',
  isPaid: false,
  description: '',
  applyUrl: '',
  imageUrl: '',
  categories: [],
  payRange: '',
  applicationDeadline: '',
  isFromAlumni: false,
})

// Computed
const sortedJobs = computed(() => {
  const items = [...jobs.value]

  return items.sort((a, b) => {
    const dir = sortDirection.value === 'asc' ? 1 : -1

    switch (sortBy.value) {
      case 'title': {
        return a.title.localeCompare(b.title) * dir
      }
      case 'company': {
        return a.companyName.localeCompare(b.companyName) * dir
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

const totalJobs = computed(() => totalCount.value)
const alumniJobs = computed(() => 
  jobs.value.filter(j => j.isFromAlumni).length
)
const studentJobs = computed(() => 
  jobs.value.filter(j => !j.isFromAlumni).length
)
const paidJobs = computed(() => 
  jobs.value.filter(j => j.isPaid).length
)

const isFormValid = computed(() => {
  return (
    createForm.title.trim() &&
    createForm.companyName.trim() &&
    createForm.locationText.trim() &&
    createForm.durationText &&
    createForm.categories.length > 0 &&
    createForm.description.trim()
  )
})

// Methods
const changeSort = (key: 'title' | 'company' | 'date') => {
  if (sortBy.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortDirection.value = key === 'date' ? 'desc' : 'asc'
  }
}

const fetchJobs = async () => {
  loading.value = true
  try {
    const response = await JobsApi.list({
      page: currentPage.value,
      pageSize: pageSize.value,
    })
    jobs.value = response.items
    totalPages.value = response.totalPages
    totalCount.value = response.totalCount
  } catch (error) {
    console.error('Failed to load jobs:', error)
    showToast({ type: 'error', title: 'Error', message: 'Failed to load jobs' })
  } finally {
    loading.value = false
  }
}

const fetchOrganizations = async () => {
  loadingOrganizations.value = true
  try {
    organizations.value = await OrganizationsApi.list()
  } catch (error) {
    console.error('Failed to load organizations:', error)
    showToast({ type: 'error', title: 'Error', message: 'Failed to load organizations' })
  } finally {
    loadingOrganizations.value = false
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchJobs()
  }
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

const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDateOnly = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Get organization name from the loaded organizations list
const getOrganizationName = (organizationId: string): string => {
  const org = organizations.value.find(o => o.id === organizationId)
  return org?.name || 'N/A'
}

const openDetailModal = async (job: JobListDto) => {
  imageLoaded.value = false // Reset image loading state
  try {
    const detail = await JobsApi.get(job.id)
    selectedJob.value = detail
    showDetailModal.value = true
  } catch (error) {
    console.error('Failed to load job details:', error)
    selectedJob.value = job as unknown as JobDetailDto
    showDetailModal.value = true
  }
}

const closeModals = () => {
  showDetailModal.value = false
  selectedJob.value = null
}

// Candidates modal functions
const openCandidatesModal = async (jobId: string) => {
  showCandidatesModal.value = true
  loadingCandidates.value = true
  interestedCandidates.value = []
  candidateProfiles.value = {}

  try {
    // Cargar lista de candidatos interesados
    const candidates = await JobsApi.getInterestedCandidates(jobId)
    interestedCandidates.value = candidates

    // Cargar perfiles de cada candidato
    for (const candidate of candidates) {
      try {
        const profile = await CandidateProfilesApi.getByUserId(candidate.candidateUserId)
        candidateProfiles.value[candidate.candidateUserId] = profile
      } catch {
        console.warn(`Could not load profile for ${candidate.candidateUserId}`)
      }
    }
  } catch (error) {
    console.error('Failed to load candidates:', error)
    showToast({ type: 'error', title: 'Error', message: 'Failed to load candidates' })
  } finally {
    loadingCandidates.value = false
  }
}

const closeCandidatesModal = () => {
  showCandidatesModal.value = false
  interestedCandidates.value = []
  candidateProfiles.value = {}
}

const openCreateModal = async () => {
  isEditing.value = false
  editingJob.value = null
  showCreateModal.value = true
  if (organizations.value.length === 0) {
    await fetchOrganizations()
  }
}

const openEditModal = async (job: JobListDto | JobDetailDto) => {
  isEditing.value = true
  showDetailModal.value = false
  
  try {
    const detail = await JobsApi.get(job.id)
    editingJob.value = detail
    
    // Cargar datos en el formulario
    createForm.organizationId = detail.organizationId || ''
    createForm.title = detail.title
    createForm.companyName = detail.companyName
    createForm.locationText = detail.locationText || ''
    createForm.durationText = detail.durationText || ''
    createForm.isPaid = detail.isPaid
    createForm.description = detail.description || ''
    createForm.applyUrl = detail.applyUrl || ''
    createForm.imageUrl = detail.imageUrl || ''
    createForm.categories = detail.categories || []
    createForm.payRange = detail.payRange || ''
    // Convert DateTime ISO string to format expected by DateTimePicker (YYYY-MM-DDTHH:mm)
    if (detail.applicationDeadline) {
      const date = new Date(detail.applicationDeadline)
      const offset = date.getTimezoneOffset() * 60000
      const localDate = new Date(date.getTime() - offset)
      createForm.applicationDeadline = localDate.toISOString().slice(0, 16)
    } else {
      createForm.applicationDeadline = ''
    }
    createForm.isFromAlumni = detail.isFromAlumni || false
    
    // Si hay imagen URL, mostrar preview
    if (detail.imageUrl) {
      imagePreviewUrl.value = detail.imageUrl
      imageFile.value = null
    } else {
      imagePreviewUrl.value = null
      imageFile.value = null
    }
    
    showCreateModal.value = true
    if (organizations.value.length === 0) {
      await fetchOrganizations()
    }
  } catch (error) {
    console.error('Failed to load job details for editing:', error)
    showToast({ type: 'error', title: 'Error', message: 'Failed to load job details' })
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  isEditing.value = false
  editingJob.value = null
  // Reset form
  createForm.organizationId = ''
  createForm.title = ''
  createForm.companyName = ''
  createForm.locationText = ''
  createForm.durationText = ''
  createForm.isPaid = false
  createForm.description = ''
  createForm.applyUrl = ''
  createForm.imageUrl = ''
  createForm.categories = []
  createForm.payRange = ''
  createForm.applicationDeadline = ''
  createForm.isFromAlumni = false
  // Reset image upload
  imageFile.value = null
  imagePreviewUrl.value = null
  const fileInput = document.querySelector('.create-modal .file-input') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const handleImageSelection = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validar tamaño del archivo (5MB = 5 * 1024 * 1024 bytes)
    const maxSizeInBytes = 5 * 1024 * 1024 // 5MB
    
    if (file.size > maxSizeInBytes) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)
      showToast({ 
        type: 'error', 
        title: 'Image too large', 
        message: `Image is too large (${sizeInMB}MB). Maximum allowed size is 5MB.` 
      })
      target.value = ''
      imageFile.value = null
      imagePreviewUrl.value = null
      return
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      showToast({ 
        type: 'error', 
        title: 'Invalid format', 
        message: 'Invalid image format. Please use PNG, JPG or GIF.' 
      })
      target.value = ''
      imageFile.value = null
      imagePreviewUrl.value = null
      return
    }

    // Si todo está bien, procesar la imagen
    imageFile.value = file
    imagePreviewUrl.value = URL.createObjectURL(file)
    // Limpiar el campo de URL manual si hay un archivo
    createForm.imageUrl = ''
  } else {
    imageFile.value = null
    imagePreviewUrl.value = null
  }
}

const removeImage = () => {
  imageFile.value = null
  imagePreviewUrl.value = null
  
  // Limpiar el input file
  const fileInput = document.querySelector('.create-modal .file-input') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const handleCreateJob = async () => {
  if (!isFormValid.value) {
    showToast({ type: 'error', title: 'Validation Error', message: 'Please fill in all required fields' })
    return
  }

  creating.value = true
  try {
    let imageUrl: string | undefined = createForm.imageUrl?.trim() || undefined

    // Si hay un archivo de imagen, subirlo primero
    if (imageFile.value) {
      const uploadResult = await JobsApi.uploadImage(imageFile.value)
      imageUrl = uploadResult.imageUrl
    } else if (isEditing.value && editingJob.value?.imageUrl && !createForm.imageUrl) {
      // Si estamos editando y no hay nueva imagen ni URL manual, mantener la existente
      imageUrl = editingJob.value.imageUrl
    }

    if (isEditing.value && editingJob.value) {
      // Actualizar job existente
      const updateData: JobUpdateDto = {
        title: createForm.title.trim(),
        companyName: createForm.companyName.trim(),
        locationText: createForm.locationText.trim(),
        durationText: createForm.durationText,
        isPaid: createForm.isPaid,
        description: createForm.description.trim(),
        applyUrl: createForm.applyUrl?.trim() || undefined,
        imageUrl: imageUrl,
        categories: createForm.categories,
        payRange: createForm.payRange?.trim() || undefined,
        applicationDeadline: createForm.applicationDeadline?.trim() ? new Date(createForm.applicationDeadline).toISOString() : undefined,
        isFromAlumni: createForm.isFromAlumni,
      }

      await JobsApi.update(editingJob.value.id, updateData)
      showToast({ type: 'success', title: 'Success', message: 'Job updated successfully' })
    } else {
      // Crear nuevo job
      const jobData: JobCreateDto = {
        organizationId: createForm.organizationId && createForm.organizationId.trim() ? createForm.organizationId : undefined,
        title: createForm.title.trim(),
        companyName: createForm.companyName.trim(),
        locationText: createForm.locationText.trim(),
        durationText: createForm.durationText,
        isPaid: createForm.isPaid,
        description: createForm.description.trim(),
        applyUrl: createForm.applyUrl?.trim() || undefined,
        imageUrl: imageUrl,
        categories: createForm.categories,
        payRange: createForm.payRange?.trim() || undefined,
        applicationDeadline: createForm.applicationDeadline?.trim() ? new Date(createForm.applicationDeadline).toISOString() : undefined,
        isFromAlumni: createForm.isFromAlumni,
      }

      await JobsApi.create(jobData)
      showToast({ type: 'success', title: 'Success', message: 'Job created successfully' })
    }

    closeCreateModal()
    fetchJobs()
  } catch (error) {
    console.error(`Failed to ${isEditing.value ? 'update' : 'create'} job:`, error)
    showToast({ type: 'error', title: 'Error', message: (error as Error)?.message || `Failed to ${isEditing.value ? 'update' : 'create'} job` })
  } finally {
    creating.value = false
  }
}

const handleDelete = (job: JobListDto) => {
  jobToDelete.value = job
  showDeleteModal.value = true
}

const handleDeleteConfirm = async () => {
  if (!jobToDelete.value) return
  
  processing.value = true
  try {
    await JobsApi.remove(jobToDelete.value.id)
    showToast({ type: 'success', title: 'Success', message: 'Job deleted successfully' })
    closeDeleteModal()
    fetchJobs()
  } catch (error) {
    console.error('Failed to delete job:', error)
    showToast({ type: 'error', title: 'Error', message: (error as Error)?.message || 'Failed to delete job' })
  } finally {
    processing.value = false
  }
}

const fetchCategories = async () => {
  try {
    const result = await JobsApi.getCategories()
    categories.value = result
  } catch (error) {
    console.error('Failed to load categories:', error)
    // Fallback a categorías por defecto si falla
    categories.value = ['Finance', 'Law', 'IT', 'Other']
  }
}

onMounted(() => {
  fetchJobs()
  fetchOrganizations()
  fetchCategories()
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #dbb067;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9375rem;
}

.btn-create:hover {
  background: #c9a05a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.3);
}

.btn-create:active {
  transform: translateY(0);
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

.stat-icon.total {
  background: #dbeafe;
  color: #2563eb;
}
.stat-icon.published {
  background: #d1fae5;
  color: #059669;
}
.stat-icon.draft {
  background: #fef3c7;
  color: #d97706;
}
.stat-icon.closed {
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
}

.data-table th,
.data-table td {
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
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

.table-row:hover {
  background-color: #f8fafc;
}

.table-row:last-child td {
  border-bottom: none;
}

.job-title-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.job-title-cell strong {
  color: #1e293b;
}

.candidates-badge {
  font-size: 0.75rem;
  color: #059669;
  font-weight: 600;
}

.duration-badge {
  display: inline-flex;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: #eff6ff;
  color: #1e40af;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge {
  display: inline-flex;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  margin-right: 0.5rem;
}

.category-badge {
  display: inline-flex;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #e0e7ff;
  color: #3730a3;
}

.categories-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

/* Multi-select categories in form */
.categories-multi-select {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  max-height: 200px;
  overflow-y: auto;
}

.category-checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  background: #f9fafb;
  color: #4b5563;
  transition: all 0.2s;
  user-select: none;
}

.category-checkbox-label:hover {
  border-color: #dbb067;
  background: #fffbf5;
}

.category-checkbox-label.selected {
  background: #e0e7ff;
  border-color: #6366f1;
  color: #3730a3;
  font-weight: 600;
}

.category-checkbox {
  display: none;
}

.target-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.target-icon {
  flex-shrink: 0;
  vertical-align: middle;
}

.target-badge.alumni {
  background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
  color: #92400e;
  border: 1px solid #f59e0b;
}

.target-badge.student {
  background: #dbeafe;
  color: #1e40af;
}

.alumni-checkbox span {
  color: #92400e;
  font-weight: 600;
}

.visibility-badge {
  display: inline-flex;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: capitalize;
  background: #f3f4f6;
  color: #6b7280;
}

.paid-badge {
  display: inline-flex;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: #d1fae5;
  color: #065f46;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.unpaid-badge {
  display: inline-flex;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: #fee2e2;
  color: #991b1b;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
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

.action-btn.publish {
  color: #059669;
}

.action-btn.publish:hover {
  background: #d1fae5;
  border-color: #6ee7b7;
}

.action-btn.close {
  color: #d97706;
}

.action-btn.close:hover {
  background: #fef3c7;
  border-color: #fcd34d;
}

.action-btn.delete {
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

/* ==================== PAGINATION ==================== */
.pagination-wrapper {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.pagination-summary {
  font-size: 0.85rem;
  color: #4b5563;
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
  padding: 1.5rem;
  box-sizing: border-box;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.create-modal {
  max-width: 800px;
  width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
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
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
  max-height: calc(90vh - 140px);
  box-sizing: border-box;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f9fafb;
  flex-shrink: 0;
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

.description-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
}

.apply-link {
  color: #2563eb;
  text-decoration: none;
  word-break: break-all;
}

.apply-link:hover {
  text-decoration: underline;
}

.job-image-container {
  position: relative;
  min-height: 200px;
}

.job-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  object-fit: contain;
  display: block;
}

.image-hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0.5rem 0;
}

.image-upload-wrapper {
  position: relative;
  width: 100%;
  min-height: 200px;
  border: 2px dashed #e2e8f0;
  border-radius: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
}

.image-upload-wrapper:hover {
  border-color: #dbb067;
  background-color: #fffbf5;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  min-height: 200px;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  z-index: 2;
  backdrop-filter: blur(4px);
}

.remove-image-btn:hover {
  background: rgba(220, 38, 38, 1);
  transform: scale(1.1);
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #9ca3af;
  padding: 2rem;
  text-align: center;
}

.image-placeholder svg {
  color: #d1d5db;
}

.image-placeholder p {
  font-weight: 500;
  color: #6b7280;
  margin: 0;
}

.file-size-hint {
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 0.25rem;
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

.btn-warning {
  background: #f59e0b;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-warning:hover {
  background: #d97706;
}

.btn-warning:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ==================== FORM STYLES ==================== */
.job-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  box-sizing: border-box;
}

@media (max-width: 1024px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  box-sizing: border-box;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.required {
  color: #dc2626;
  margin-left: 0.25rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9375rem;
  transition: all 0.2s;
  background: #fff;
  font-family: inherit;
  box-sizing: border-box;
  max-width: 100%;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #dbb067;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.form-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  padding: 0.75rem 0;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #dbb067;
}

.checkbox-label span {
  user-select: none;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .modal-overlay {
    padding: 1rem;
  }

  .create-modal {
    max-width: 700px;
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
    min-width: 800px;
  }

  .modal-overlay {
    padding: 0.75rem;
  }

  .create-modal {
    max-width: 100%;
  }

  .modal-body {
    padding: 1rem;
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

  .modal-overlay {
    padding: 0.5rem;
  }
}

/* ==================== CANDIDATES MODAL ==================== */
.btn-view-candidates {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  background: #0d2954;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-view-candidates:hover {
  background: #1a3d6e;
}

.candidates-modal {
  max-width: 700px;
}

.loading-candidates,
.empty-candidates {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.loading-candidates .spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #dbb067;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

.candidates-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.candidate-card {
  background: #f9fafb;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
}

.candidate-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.candidate-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.candidate-avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #dbb067;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
}

.candidate-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #1e293b;
}

.candidate-email {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.candidate-date {
  margin: 0;
  font-size: 0.75rem;
  color: #9ca3af;
}

.cv-points {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
}

.cv-points h5 {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: #0d2954;
  font-weight: 700;
}

.cv-point {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: #f1f5f9;
  border-radius: 6px;
}

.cv-label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.cv-value {
  display: block;
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 500;
}

.cv-extra {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.cv-loading {
  font-size: 0.875rem;
  color: #9ca3af;
  font-style: italic;
}

/* Delete Modal Styles */
.delete-warning {
  text-align: center;
  padding: 1rem;
}

.delete-warning svg {
  color: #f59e0b;
  margin-bottom: 1rem;
}

.delete-warning p {
  color: #4b5563;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.delete-warning strong {
  color: #1a202c;
}

.warning-text {
  color: #9ca3af;
  font-size: 0.875rem;
}

.deadline-week {
  font-weight: 600;
  color: #dbb067;
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.deadline-date {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.datetime-picker-container {
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
}

/* Asegurar que el calendario se vea bien en el formulario */
.datetime-picker-container :deep(.calendar-wrapper) {
  width: 100%;
}

.datetime-picker-container :deep(.calendar-input) {
  width: 100%;
  max-width: 423px;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  min-height: auto;
  height: auto;
  box-sizing: border-box;
}

.datetime-picker-container :deep(.calendar-dropdown) {
  z-index: 10000;
  min-width: 280px;
  width: max-content;
  padding: 1rem;
}

.datetime-picker-container :deep(.calendar-header) {
  margin-bottom: 0.75rem;
}

.datetime-picker-container :deep(.month-year) {
  font-size: 0.95rem;
}

.datetime-picker-container :deep(.weekday) {
  font-size: 0.65rem;
  padding: 0.25rem;
}

.datetime-picker-container :deep(.days-grid) {
  gap: 0.15rem;
  margin-bottom: 0.75rem;
}

.datetime-picker-container :deep(.day-button) {
  font-size: 0.8rem;
  padding: 0.35rem;
}

.datetime-picker-container :deep(.time-picker) {
  display: none;
}

.datetime-picker-container :deep(.days-grid) {
  margin-bottom: 0;
}

/* Asegurar que el calendario no se salga del modal */
.datetime-picker-container :deep(.calendar-wrapper) {
  position: relative;
}

/* Ajustar el dropdown para que se ajuste mejor en pantallas pequeñas */
@media (max-width: 768px) {
  .datetime-picker-container :deep(.calendar-dropdown) {
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%);
    min-width: 320px;
    max-width: calc(100vw - 2rem);
  }
}

.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  background: #ef4444;
  color: #ffffff;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-danger:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #bdbdbd;
}
</style>
