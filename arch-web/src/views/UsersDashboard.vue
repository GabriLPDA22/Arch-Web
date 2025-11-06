<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Users Management</h1>
          <p class="page-subtitle">Create, view, and manage user accounts</p>
        </div>
        <button class="create-btn" @click="openCreateModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          Create User
        </button>
      </div>
    </div>

    <div class="search-container">
      <div class="search-wrapper">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or email..."
          class="search-input"
          @input="handleSearchInput"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-btn" title="Clear search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            />
          </svg>
        </button>
      </div>
      
      <div class="filters-section">
        <div class="filter-label">Filter by type:</div>
        <div class="filters-group">
          <button
            class="filter-btn"
            :class="{ active: userTypeFilter === null }"
            @click="handleMainFilterClick(null)"
          >
            All Users
            <span v-if="userTypeFilter === null && filteredUsersCount > 0" class="count-badge">{{ filteredUsersCount }}</span>
          </button>
          
          <div class="filter-with-submenu" ref="oxfordFilterRef">
            <button
              class="filter-btn oxford-btn"
              :class="{ active: userTypeFilter === 'user', 'has-submenu': showOxfordSubmenu }"
              @click="handleMainFilterClick('user')"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,17V19H2V17S2,13 9,13 16,17 16,17M12.5,7.5A3.5,3.5 0 0,1 9,11A3.5,3.5 0 0,1 5.5,7.5A3.5,3.5 0 0,1 9,4A3.5,3.5 0 0,1 12.5,7.5M15.94,13C18.23,13.72 20,15.36 20,17V19H18V17C18,15.36 17.5,14.14 15.94,13M15,4A3.39,3.39 0 0,1 18.5,7.5A3.5,3.5 0 0,1 15,11V9A1.5,1.5 0 0,0 16.5,7.5A1.5,1.5 0 0,0 15,6V4Z" />
              </svg>
              <span>Oxford</span>
              <span v-if="userTypeFilter === 'user' && filteredUsersCount > 0" class="count-badge oxford">{{ filteredUsersCount }}</span>
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                class="submenu-arrow"
                :class="{ rotated: showOxfordSubmenu }"
              >
                <path d="M7,10L12,15L17,10H7Z" />
              </svg>
            </button>
            
            <transition name="submenu">
              <div v-if="showOxfordSubmenu" class="filter-submenu" @click.stop>
                <div class="submenu-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                  <span>Filter Oxford by:</span>
                </div>
                
                <button
                  class="submenu-btn"
                  :class="{ active: oxfordSubtypeFilter === null }"
                  @click="handleOxfordSubfilter(null)"
                >
                  <div class="submenu-btn-content">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                    </svg>
                    <span>All Oxford</span>
                  </div>
                  <span v-if="oxfordSubtypeFilter === null" class="count-badge-small">{{ getOxfordCount() }}</span>
                </button>
                
                <button
                  class="submenu-btn"
                  :class="{ active: oxfordSubtypeFilter === 'student' }"
                  @click="handleOxfordSubfilter('student')"
                >
                  <div class="submenu-btn-content">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                    </svg>
                    <span>Students</span>
                  </div>
                  <span v-if="oxfordSubtypeFilter === 'student'" class="count-badge-small">{{ getOxfordCount('student') }}</span>
                </button>
                
                <button
                  class="submenu-btn"
                  :class="{ active: oxfordSubtypeFilter === 'professor' }"
                  @click="handleOxfordSubfilter('professor')"
                >
                  <div class="submenu-btn-content">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16,11C17.66,11 18.99,9.66 18.99,8C18.99,6.34 17.66,5 16,5C14.34,5 13,6.34 13,8C13,9.66 14.34,11 16,11M8,11C9.66,11 10.99,9.66 10.99,8C10.99,6.34 9.66,5 8,5C6.34,5 5,6.34 5,8C5,9.66 6.34,11 8,11M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M16,13C15.71,13 15.38,13.02 15.03,13.05C16.19,13.89 17,15.02 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13Z" />
                    </svg>
                    <span>Professors</span>
                  </div>
                  <span v-if="oxfordSubtypeFilter === 'professor'" class="count-badge-small">{{ getOxfordCount('professor') }}</span>
                </button>
              </div>
            </transition>
          </div>
          
          <div class="filter-with-submenu" ref="staffFilterRef">
            <button
              class="filter-btn staff-btn"
              :class="{ active: userTypeFilter === 'staff-user', 'has-submenu': showStaffSubmenu }"
              @click="handleMainFilterClick('staff-user')"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
              </svg>
              <span>Staff</span>
              <span v-if="userTypeFilter === 'staff-user' && filteredUsersCount > 0" class="count-badge staff">{{ filteredUsersCount }}</span>
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                class="submenu-arrow"
                :class="{ rotated: showStaffSubmenu }"
              >
                <path d="M7,10L12,15L17,10H7Z" />
              </svg>
            </button>
            
            <transition name="submenu">
              <div v-if="showStaffSubmenu" class="filter-submenu" @click.stop>
                <div class="submenu-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                  </svg>
                  <span>Filter Staff by:</span>
                </div>
                
                <button
                  class="submenu-btn"
                  :class="{ active: staffSubtypeFilter === null }"
                  @click="handleStaffSubfilter(null)"
                >
                  <div class="submenu-btn-content">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                    </svg>
                    <span>All Staff</span>
                  </div>
                  <span v-if="staffSubtypeFilter === null" class="count-badge-small">{{ getStaffCount() }}</span>
                </button>
                
                <button
                  class="submenu-btn"
                  :class="{ active: staffSubtypeFilter === 'staff-user' }"
                  @click="handleStaffSubfilter('staff-user')"
                >
                  <div class="submenu-btn-content">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                    </svg>
                    <span>Staff</span>
                  </div>
                  <span v-if="staffSubtypeFilter === 'staff-user'" class="count-badge-small">{{ getStaffCount('staff-user') }}</span>
                </button>
                
                <button
                  class="submenu-btn"
                  :class="{ active: staffSubtypeFilter === 'scanner' }"
                  @click="handleStaffSubfilter('scanner')"
                >
                  <div class="submenu-btn-content">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H20V6H4M5,8H19V10H5V8M5,11H19V13H5V11M5,14H19V16H5V14Z" />
                    </svg>
                    <span>Organizers</span>
                  </div>
                  <span v-if="staffSubtypeFilter === 'scanner'" class="count-badge-small">{{ getStaffCount('scanner') }}</span>
                </button>
              </div>
            </transition>
          </div>

          <button
            class="filter-btn"
            :class="{ active: userTypeFilter === 'moderator' }"
            @click="handleMainFilterClick('moderator')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2L2,7V13C2,17.55 4.84,21.74 9,23C9,23 10,23 12,23C14,23 15,23 15,23C19.16,21.74 22,17.55 22,13V7L12,2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z" />
            </svg>
            Moderators
            <span v-if="userTypeFilter === 'moderator' && filteredUsersCount > 0" class="count-badge">{{ filteredUsersCount }}</span>
          </button>
          
          <button
            class="filter-btn"
            :class="{ active: userTypeFilter === 'admin' }"
            @click="handleMainFilterClick('admin')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z" />
            </svg>
            Admins
            <span v-if="userTypeFilter === 'admin' && filteredUsersCount > 0" class="count-badge">{{ filteredUsersCount }}</span>
          </button>
        </div>
      </div>
      
      <transition name="fade">
        <div v-if="activeFilterDescription" class="active-filter-indicator">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" />
          </svg>
          <span>{{ activeFilterDescription }}</span>
          <button @click="clearFilters" class="clear-filter-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>
      </transition>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading users...</p>
    </div>

    <div v-else-if="users.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
        />
      </svg>
      <h3>No users found</h3>
      <p v-if="searchQuery || userTypeFilter">Try adjusting your filters</p>
      <p v-else>Get started by creating your first user</p>
    </div>

    <div v-else class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th @click="handleSort('name')" class="sortable">
              Name
              <span v-if="sortBy === 'name'" class="sort-icon">{{
                sortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th>Email</th>
            <th>Type</th>
            <th @click="handleSort('userType')" class="sortable">
              Role
              <span v-if="sortBy === 'userType'" class="sort-icon">{{
                sortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.userID" class="user-row">
            <td>
              <div class="name-cell">
                {{ getCleanName(user.name) }}
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['type-badge', getUserTypeBadgeClass(user)]">
                <svg v-if="user.userType === 'staff-user'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                </svg>
                <svg v-else-if="user.userType === 'scanner'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H20V6H4M5,8H19V10H5V8M5,11H19V13H5V11M5,14H19V16H5V14Z" />
                </svg>
                <svg v-else-if="user.userType === 'user' && getOxfordSubtype(user) === 'student'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                </svg>
                <svg v-else-if="user.userType === 'user' && getOxfordSubtype(user) === 'professor'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M16,11C17.66,11 18.99,9.66 18.99,8C18.99,6.34 17.66,5 16,5C14.34,5 13,6.34 13,8C13,9.66 14.34,11 16,11M8,11C9.66,11 10.99,9.66 10.99,8C10.99,6.34 9.66,5 8,5C6.34,5 5,6.34 5,8C5,9.66 6.34,11 8,11M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M16,13C15.71,13 15.38,13.02 15.03,13.05C16.19,13.89 17,15.02 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13Z" />
                </svg>
                <svg v-else-if="user.userType === 'moderator'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M12,2L2,7V13C2,17.55 4.84,21.74 9,23C9,23 10,23 12,23C14,23 15,23 15,23C19.16,21.74 22,17.55 22,13V7L12,2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z" />
                </svg>
                <svg v-else-if="user.userType === 'admin'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z" />
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M16,17V19H2V17S2,13 9,13 16,17 16,17M12.5,7.5A3.5,3.5 0 0,1 9,11A3.5,3.5 0 0,1 5.5,7.5A3.5,3.5 0 0,1 9,4A3.5,3.5 0 0,1 12.5,7.5M15.94,13C18.23,13.72 20,15.36 20,17V19H18V17C18,15.36 17.5,14.14 15.94,13M15,4A3.39,3.39 0 0,1 18.5,7.5A3.5,3.5 0 0,1 15,11V9A1.5,1.5 0 0,0 16.5,7.5A1.5,1.5 0 0,0 15,6V4Z" />
                </svg>
                {{ getUserTypeLabel(user) }}
              </span>
            </td>
            <td>
              <span :class="['role-badge', user.userType]">{{ user.userType }}</span>
            </td>
            <td class="actions-cell">
              <button class="action-btn edit" @click="openEditModal(user)" title="Edit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                  />
                </svg>
              </button>
              <button class="action-btn delete" @click="openDeleteModal(user)" title="Delete">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && totalPages > 1" class="pagination">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn">
        Previous
      </button>
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="page-btn">
        Next
      </button>
    </div>

    <div v-if="isFormModalOpen" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit User' : 'Create New User' }}</h2>
          <button @click="closeModals" class="modal-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <UserForm
            ref="userFormComponent"
            :user-id="selectedUserId"
            @user-saved="handleUserSaved"
            @user-created="handleUserCreated"
            @user-updated="handleUserUpdated"
          />
        </div>
      </div>
    </div>

    <div v-if="isDeleteModalOpen" class="modal-overlay" @click="closeModals">
      <div class="modal-content small" @click.stop>
        <div class="modal-header">
          <h2>Delete User</h2>
          <button @click="closeModals" class="modal-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="delete-warning">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />
            </svg>
            <p>
              Are you sure you want to delete <strong>{{ getCleanName(userToDelete?.name || '') }}</strong>?
            </p>
            <p class="warning-text">This action cannot be undone.</p>
            <div class="modal-actions">
              <button class="btn-secondary" @click="closeModals">Cancel</button>
              <button class="btn-danger" @click="handleDeleteConfirm">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import { UserApi, type UserListDto } from '@/services/Api'
import UserForm from '@/components/forms/UserForm.vue'
import { useAuthStore } from '@/stores/auth.store'
import { handleApiError } from '@/utils/validators'

const authStore = useAuthStore()

const users = ref<UserListDto[]>([])
const allUsers = ref<UserListDto[]>([])
const loading = ref(true)
const searchQuery = ref('')
const userTypeFilter = ref<string | null>(null)
const oxfordSubtypeFilter = ref<string | null>(null)
const showOxfordSubmenu = ref(false)
// ✅ Nuevos refs para el subfiltro de Staff
const staffSubtypeFilter = ref<string | null>(null)
const showStaffSubmenu = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)
const sortBy = ref('name')
const sortOrder = ref<'asc' | 'desc'>('asc')
const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const selectedUserId = ref<string | null>(null)
const userToDelete = ref<UserListDto | null>(null)
const userFormComponent = ref<InstanceType<typeof UserForm> | null>(null)
const oxfordFilterRef = ref<HTMLElement | null>(null)
// ✅ Nuevo ref de elemento para el filtro Staff
const staffFilterRef = ref<HTMLElement | null>(null)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Computed para contar usuarios filtrados
const filteredUsersCount = computed(() => users.value.length)

// Función para contar usuarios Oxford por subtipo
const getOxfordCount = (subtype?: 'student' | 'professor'): number => {
  const oxfordUsers = allUsers.value.filter(u => u.userType === 'user')
  
  if (!subtype) {
    return oxfordUsers.length
  }
  
  return oxfordUsers.filter(u => {
    const userSubtype = getOxfordSubtype(u)
    return userSubtype === subtype
  }).length
}

// ✅ Función para contar usuarios Staff por subtipo
const getStaffCount = (subtype?: 'staff-user' | 'scanner'): number => {
  const staffUsers = allUsers.value.filter(u => u.userType === 'staff-user' || u.userType === 'scanner')
  
  if (!subtype) {
    return staffUsers.length
  }
  
  return staffUsers.filter(u => u.userType === subtype).length
}

// Computed para descripción del filtro activo
const activeFilterDescription = computed(() => {
  if (userTypeFilter.value === 'user') {
    if (oxfordSubtypeFilter.value === 'student') {
      return `Showing Oxford Students only (${getOxfordCount('student')} users)`
    } else if (oxfordSubtypeFilter.value === 'professor') {
      return `Showing Oxford Professors only (${getOxfordCount('professor')} users)`
    }
    return `Showing Oxford users only (${getOxfordCount()} users)`
  } else if (userTypeFilter.value === 'staff-user') {
    // ✅ Lógica actualizada para Staff
    if (staffSubtypeFilter.value === 'staff-user') {
      return `Showing Staff (Staff-User) only (${getStaffCount('staff-user')} users)`
    } else if (staffSubtypeFilter.value === 'scanner') {
      return `Showing Staff (Organizers) only (${getStaffCount('scanner')} users)`
    }
    return `Showing all Staff users (${getStaffCount()} users)`
  } else if (userTypeFilter.value === 'moderator') {
    return 'Showing Moderators only'
  } else if (userTypeFilter.value === 'admin') {
    return 'Showing Admins only'
  }
  return null
})

// Función para obtener el subtipo de Oxford del nombre del usuario
// Si NO tiene tag, se trata como "sin clasificar" pero se muestra igual
const getOxfordSubtype = (user: UserListDto): 'student' | 'professor' | null => {
  if (user.userType !== 'user') return null
  if (user.name.includes('[Student]')) return 'student'
  if (user.name.includes('[Professor]')) return 'professor'
  // Si no tiene tag, devuelve null pero igual se mostrará
  return null
}

// Función para limpiar el nombre de los tags
const getCleanName = (name: string): string => {
  return name.replace(/\s*\[(Student|Professor)\]\s*$/, '').trim()
}

const getUserTypeBadgeClass = (user: UserListDto): string => {
  if (user.userType === 'staff-user') {
    return 'staff'
  } else if (user.userType === 'scanner') {
    return 'scanner'
  } else if (user.userType === 'user') {
    const subtype = getOxfordSubtype(user)
    if (subtype === 'professor') return 'professor'
    if (subtype === 'student') return 'student'
    // Si no tiene tag, mostrar como Oxford genérico
    return 'student'
  }
  return 'other'
}

const getUserTypeLabel = (user: UserListDto): string => {
  if (user.userType === 'staff-user') {
    return 'Staff'
  } else if (user.userType === 'scanner') {
    return 'Organizador'
  } else if (user.userType === 'user') {
    const subtype = getOxfordSubtype(user)
    if (subtype === 'student') {
      return 'Student'
    } else if (subtype === 'professor') {
      return 'Professor'
    }
    // Si no tiene tag, mostrar como "Oxford"
    return 'Oxford'
  }
  return user.userType
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchUsers()
}

const clearFilters = () => {
  userTypeFilter.value = null
  oxfordSubtypeFilter.value = null
  showOxfordSubmenu.value = false
  // ✅ Limpiar filtros de staff
  staffSubtypeFilter.value = null
  showStaffSubmenu.value = false
  currentPage.value = 1
  fetchUsers()
}

// Función mejorada para filtrar usuarios
// Ahora muestra usuarios Oxford SIN tag cuando no hay subfiltro
const applyFilters = (usersList: UserListDto[]) => {
  let filtered = [...usersList]
  
  // Filtrar por tipo de usuario
  if (userTypeFilter.value) {
    // Si es Staff, mostrar TANTO staff-user COMO scanner
    if (userTypeFilter.value === 'staff-user') {
      filtered = filtered.filter(u => u.userType === 'staff-user' || u.userType === 'scanner')
    } else {
      filtered = filtered.filter(u => u.userType === userTypeFilter.value)
    }
    
    // Si es Oxford y hay subfiltro específico, aplicarlo
    if (userTypeFilter.value === 'user' && oxfordSubtypeFilter.value) {
      filtered = filtered.filter(u => {
        const subtype = getOxfordSubtype(u)
        return subtype === oxfordSubtypeFilter.value
      })
    }
    
    // ✅ NUEVO: Si es Staff y hay subfiltro específico, aplicarlo
    if (userTypeFilter.value === 'staff-user' && staffSubtypeFilter.value) {
      filtered = filtered.filter(u => u.userType === staffSubtypeFilter.value)
    }
  }
  
  return filtered
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      q: searchQuery.value || undefined,
      page: currentPage.value,
      pageSize: pageSize.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    }
    const response = await UserApi.list(params)
    
    // Guardar todos los usuarios
    allUsers.value = response.items
    
    // Aplicar filtros
    users.value = applyFilters(response.items)
    
    totalPages.value = response.totalPages
  } catch (error: any) {
    console.error('Failed to load users:', error)
    handleApiError(error)
  } finally {
    loading.value = false
  }
}

const handleSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchUsers()
  }, 300)
}

// Cerrar submenu al hacer click fuera
const handleClickOutside = (event: MouseEvent) => {
  if (oxfordFilterRef.value && !oxfordFilterRef.value.contains(event.target as Node)) {
    showOxfordSubmenu.value = false
  }
  // ✅ Cerrar submenu de Staff
  if (staffFilterRef.value && !staffFilterRef.value.contains(event.target as Node)) {
    showStaffSubmenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (authStore.isLoggedIn) {
    fetchUsers()
  } else {
    loading.value = false
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// ✅ Manejador de clics de filtro principal actualizado
const handleMainFilterClick = (filter: string | null) => {
  if (filter === 'user') {
    // Toggle submenu Oxford
    if (userTypeFilter.value === 'user') {
      showOxfordSubmenu.value = !showOxfordSubmenu.value
    } else {
      userTypeFilter.value = 'user'
      showOxfordSubmenu.value = true
      oxfordSubtypeFilter.value = null
    }
    showStaffSubmenu.value = false // Ocultar otro submenu
  } else if (filter === 'staff-user') {
    // ✅ Toggle submenu Staff
    if (userTypeFilter.value === 'staff-user') {
      showStaffSubmenu.value = !showStaffSubmenu.value
    } else {
      userTypeFilter.value = 'staff-user'
      showStaffSubmenu.value = true
      staffSubtypeFilter.value = null
    }
    showOxfordSubmenu.value = false // Ocultar otro submenu
  } else {
    userTypeFilter.value = filter
    showOxfordSubmenu.value = false
    showStaffSubmenu.value = false // ✅ Ocultar submenu
    oxfordSubtypeFilter.value = null
    staffSubtypeFilter.value = null // ✅ Limpiar subfiltro
  }
  currentPage.value = 1
  fetchUsers()
}

const handleOxfordSubfilter = (subtype: string | null) => {
  oxfordSubtypeFilter.value = subtype
  currentPage.value = 1
  fetchUsers()
}

// ✅ Nuevo manejador para el subfiltro de Staff
const handleStaffSubfilter = (subtype: string | null) => {
  staffSubtypeFilter.value = subtype
  currentPage.value = 1
  fetchUsers()
}

watch([userTypeFilter, oxfordSubtypeFilter, staffSubtypeFilter], () => { // ✅ Añadido staffSubtypeFilter
  currentPage.value = 1
  users.value = applyFilters(allUsers.value)
})

const handleSort = (column: string) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
  fetchUsers()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchUsers()
  }
}

const openCreateModal = () => {
  isEditing.value = false
  selectedUserId.value = null
  isFormModalOpen.value = true
}

const openEditModal = (user: UserListDto) => {
  isEditing.value = true
  selectedUserId.value = user.userID
  isFormModalOpen.value = true
}

const openDeleteModal = (user: UserListDto) => {
  userToDelete.value = user
  isDeleteModalOpen.value = true
}

const closeModals = () => {
  isFormModalOpen.value = false
  isDeleteModalOpen.value = false
  userToDelete.value = null
  selectedUserId.value = null
}

const handleUserCreated = () => {
  closeModals()
  fetchUsers()
  console.log('User created successfully')
}

const handleUserUpdated = () => {
  const updatedUserId = selectedUserId.value
  closeModals()
  fetchUsers()

  if (updatedUserId && updatedUserId === authStore.user?.userID) {
    console.log('Your own role has been updated. You will now be logged out.')
    setTimeout(() => {
      authStore.logout()
    }, 2000)
  } else {
    console.log('User updated successfully')
  }
}

const handleUserSaved = () => {
  if (isEditing.value) {
    handleUserUpdated()
  } else {
    handleUserCreated()
  }
}

const handleDeleteConfirm = async () => {
  if (!userToDelete.value?.userID) return

  try {
    await UserApi.remove(userToDelete.value.userID)
    closeModals()
    await fetchUsers()
    console.log('User deleted successfully')
  } catch (error: any) {
    console.error('Failed to delete user:', error)
    handleApiError(error)
  }
}
</script>

<style scoped>
/* CSS sin cambios - exactamente igual que antes */
.dashboard {
  padding: 0;
  min-height: 100vh;
  background: #f9fafb;
}

.dashboard-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 2rem 2.5rem;
  position: sticky;
  top: 0;
  z-index: 50;
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

.create-btn {
  background: #dbb067;
  color: #ffffff;
  border: none;
  padding: 1rem 1.75rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.3);
  flex-shrink: 0;
}

.create-btn:hover {
  background: #c9a05a;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(219, 176, 103, 0.4);
}

.search-container {
  padding: 1.5rem 2.5rem;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
  width: 100%;
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
  align-items: center;
}

.filter-btn {
  padding: 0.625rem 1rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 10px;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.filter-btn:hover {
  border-color: #dbb067;
  color: #0d2954;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-btn.active {
  background: #0d2954;
  border-color: #0d2954;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(13, 41, 84, 0.2);
}

.filter-btn svg {
  flex-shrink: 0;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 0.375rem;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: auto;
}

.filter-btn.active .count-badge {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.count-badge.oxford {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

/* ✅ Añadido para el badge de staff */
.count-badge.staff {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

.submenu-arrow {
  margin-left: auto;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.submenu-arrow.rotated {
  transform: rotate(180deg);
}

.filter-with-submenu {
  position: relative;
}

.filter-submenu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 220px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.submenu-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.submenu-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.submenu-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 0.25rem;
}

.submenu-btn {
  padding: 0.625rem 0.875rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  width: 100%;
  gap: 0.5rem;
}

.submenu-btn-content {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex: 1;
}

.submenu-btn:hover {
  background: #f9fafb;
  color: #0d2954;
  transform: translateX(2px);
}

.submenu-btn.active {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #1e40af;
  font-weight: 600;
}

.submenu-btn svg {
  flex-shrink: 0;
}

.count-badge-small {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 0.25rem;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 9px;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
}

.submenu-btn.active .count-badge-small {
  background: #3b82f6;
  color: #ffffff;
}

.active-filter-indicator {
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  color: #1e40af;
  font-size: 0.875rem;
  font-weight: 600;
}

.active-filter-indicator svg {
  flex-shrink: 0;
}

.clear-filter-btn {
  margin-left: auto;
  background: transparent;
  border: none;
  color: #1e40af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-filter-btn:hover {
  background: rgba(59, 130, 246, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #ffffff;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #dbb067;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.1);
  outline: none;
}

.clear-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 1600px;
  margin: 0 auto;
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
  max-width: 1600px;
  margin: 0 auto;
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
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.users-table-container {
  padding: 2rem 2.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.users-table th,
.users-table td {
  padding: 1.25rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.users-table th {
  background: #f9fafb;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.users-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.users-table th.sortable:hover {
  background-color: #f0f2f5;
}

.sort-icon {
  display: inline-block;
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.users-table td {
  color: #4b5563;
  font-weight: 500;
}

.user-row {
  transition: background-color 0.2s ease;
}

.user-row:hover {
  background-color: #fafbfc;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: capitalize;
  transition: all 0.2s ease;
}

.type-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ✅ Staff - Azul cielo */
.type-badge.staff {
  background-color: #e0f2fe;
  color: #0369a1;
  border: 1px solid #7dd3fc;
}

/* ✅ Scanner/Organizador - Cyan/Turquesa */
.type-badge.scanner {
  background-color: #cffafe;
  color: #155e75;
  border: 1px solid #67e8f9;
}

/* ✅ Student - Azul índigo */
.type-badge.student {
  background-color: #e0e7ff;
  color: #4f46e5;
  border: 1px solid #a5b4fc;
}

/* ✅ Professor - Púrpura */
.type-badge.professor {
  background-color: #f3e8ff;
  color: #9333ea;
  border: 1px solid #d8b4fe;
}

/* ✅ Oxford genérico - Azul royal */
.type-badge.other {
  background-color: #dbeafe;
  color: #2563eb;
  border: 1px solid #93c5fd;
}

.type-icon {
  flex-shrink: 0;
}

.type-badge-modern {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: capitalize;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.type-badge-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.type-badge-modern:hover::before {
  left: 100%;
}

.type-badge-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* ✅ Efecto de pulso cuando hover en la fila */
.user-row:hover .type-badge-modern {
  animation: subtlePulse 2s ease-in-out infinite;
}

@keyframes subtlePulse {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  50% {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.badge-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.25);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.type-badge-modern:hover .badge-icon-wrapper {
  transform: rotate(-5deg) scale(1.1);
}

.badge-icon {
  flex-shrink: 0;
}

.badge-label {
  font-weight: 600;
  letter-spacing: 0.025em;
}

/* ✅ Staff - Azul cielo con degradado */
.type-badge-modern.staff {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: #ffffff;
  border: 2px solid #7dd3fc;
}

.type-badge-modern.staff .badge-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
}

/* ✅ Student - Azul índigo vibrante */
.type-badge-modern.student {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  border: 2px solid #a5b4fc;
}

.type-badge-modern.student .badge-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
}

/* ✅ Professor - Púrpura real */
.type-badge-modern.professor {
  background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  color: #ffffff;
  border: 2px solid #d8b4fe;
}

.type-badge-modern.professor .badge-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
}

/* ✅ Oxford genérico - Azul elegante */
.type-badge-modern.other {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  border: 2px solid #93c5fd;
}

.type-badge-modern.other .badge-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.875rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: capitalize;
  transition: all 0.2s ease;
}

.role-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ✅ Admin - Rojo suave */
.role-badge.admin {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* ✅ User - Azul suave */
.role-badge.user {
  background-color: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
}

/* ✅ Staff-User - Verde suave */
.role-badge.staff-user {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

/* ✅ Moderator - Amarillo suave */
.role-badge.moderator {
  background-color: #fef3c7;
  color: #854d0e;
  border: 1px solid #fcd34d;
}

/* ✅ Scanner - Cyan/Turquesa */
.role-badge.scanner {
  background-color: #cffafe;
  color: #155e75;
  border: 1px solid #67e8f9;
}

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
  transition: all 0.2s ease;
  margin-left: 0.5rem;
}

.action-btn.edit {
  color: #3b82f6;
}

.action-btn.edit:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  transform: scale(1.05);
}

.action-btn.delete {
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #fee2e2;
  border-color: #fecaca;
  transform: scale(1.05);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.page-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #dbb067;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #6b7280;
  font-weight: 500;
}

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
  padding: 1rem;
}

.modal-content {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-content.small {
  max-width: 450px;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.modal-close {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

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
  margin: 0.5rem 0;
}

.warning-text {
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-danger {
  background: #ef4444;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background: #dc2626;
}
</style>