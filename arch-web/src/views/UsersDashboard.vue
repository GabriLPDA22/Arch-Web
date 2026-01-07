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
                  :class="{ active: oxfordSubtypeFilter === 'current_student' }"
                  @click="handleOxfordSubfilter('current_student')"
                >
                  <div class="submenu-btn-content">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                    </svg>
                    <span>Students</span>
                  </div>
                  <span v-if="oxfordSubtypeFilter === 'current_student'" class="count-badge-small">{{ getOxfordCount('current_student') }}</span>
                </button>
                
                <button
                  class="submenu-btn"
                  :class="{ active: oxfordSubtypeFilter === 'alumni' }"
                  @click="handleOxfordSubfilter('alumni')"
                >
                  <div class="submenu-btn-content">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                    </svg>
                    <span>Alumni</span>
                  </div>
                  <span v-if="oxfordSubtypeFilter === 'alumni'" class="count-badge-small">{{ getOxfordCount('alumni') }}</span>
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

    <div v-else-if="paginatedUsers.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
        />
      </svg>
      <h3>No users found</h3>
      <p v-if="searchQuery || userTypeFilter">Try adjusting your filters</p>
      <p v-else>Get started by creating your first user</p>
    </div>

    <!-- View Toggle -->
    <div v-if="!loading && paginatedUsers.length > 0" class="view-controls">
      <div class="view-toggle">
        <button
          class="toggle-btn"
          :class="{ active: viewMode === 'table' }"
          @click="viewMode = 'table'"
          title="Table View"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,3H21V5H3V3M3,7H21V9H3V7M3,11H21V13H3V11M3,15H21V17H3V15M3,19H21V21H3V19Z" />
          </svg>
          <span>Table</span>
        </button>
        <button
          class="toggle-btn"
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
          title="Grid View"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,11H11V3H3M3,21H11V13H3M13,11H21V3H13M13,21H21V13H13Z" />
          </svg>
          <span>Grid</span>
        </button>
      </div>
      <div class="results-info">
        Showing {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredUsersCount) }} of {{ filteredUsersCount }} users
      </div>
    </div>

    <!-- Table View -->
    <div v-if="!loading && paginatedUsers.length > 0 && viewMode === 'table'" class="users-table-container">
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
          <tr v-for="user in paginatedUsers" :key="user.userID" class="user-row">
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
                <svg v-else-if="user.userType === 'user' && user.userRole === 'current_student'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                </svg>
                <svg v-else-if="user.userType === 'user' && user.userRole === 'alumni'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
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

    <!-- Grid View -->
    <div v-if="!loading && paginatedUsers.length > 0 && viewMode === 'grid'" class="users-grid-container">
      <div class="users-grid">
        <div v-for="user in paginatedUsers" :key="user.userID" class="user-card">
          <div class="card-header">
            <div class="user-avatar-card">
              <div class="avatar-initial">{{ getCleanName(user.name).charAt(0).toUpperCase() }}</div>
            </div>
            <div class="user-title">
              <h3 class="user-name-card">{{ getCleanName(user.name) }}</h3>
              <p class="user-email-card">{{ user.email }}</p>
            </div>
          </div>
          <div class="card-body">
            <div class="user-type-section">
              <span :class="['type-badge', getUserTypeBadgeClass(user)]">
                <svg v-if="user.userType === 'staff-user'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                </svg>
                <svg v-else-if="user.userType === 'scanner'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H20V6H4M5,8H19V10H5V8M5,11H19V13H5V11M5,14H19V16H5V14Z" />
                </svg>
                <svg v-else-if="user.userType === 'user' && user.userRole === 'current_student'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                </svg>
                <svg v-else-if="user.userType === 'user' && user.userRole === 'alumni'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
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
            </div>
            <div class="user-role-section">
              <span :class="['role-badge', user.userType]">{{ user.userType }}</span>
            </div>
          </div>
          <div class="card-footer">
            <button class="action-btn-card edit" @click="openEditModal(user)" title="Edit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>
              Edit
            </button>
            <button class="action-btn-card delete" @click="openDeleteModal(user)" title="Delete">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && calculatedTotalPages > 1" class="pagination-container">
      <div class="pagination">
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1" 
          class="page-btn prev"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
          </svg>
          <span>Previous</span>
        </button>
        
        <div class="page-numbers">
          <button
            v-for="page in getPageNumbers()"
            :key="page"
            @click="typeof page === 'number' ? goToPage(page) : null"
            :class="['page-number', { active: page === currentPage, ellipsis: page === '...' }]"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === calculatedTotalPages" 
          class="page-btn next"
        >
          <span>Next</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
          </svg>
        </button>
      </div>
      
      <div class="pagination-info">
        <span>Page {{ currentPage }} of {{ calculatedTotalPages }}</span>
        <span class="separator">•</span>
        <span>{{ filteredUsersCount }} total users</span>
      </div>
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

// users ahora es computed (paginatedUsers)
const allUsers = ref<UserListDto[]>([])
const loading = ref(true)
const searchQuery = ref('')
const userTypeFilter = ref<string | null>(null)
const oxfordSubtypeFilter = ref<'current_student' | 'alumni' | null>(null)
const showOxfordSubmenu = ref(false)
// ✅ Nuevos refs para el subfiltro de Staff
const staffSubtypeFilter = ref<string | null>(null)
const showStaffSubmenu = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
// totalPages ahora es calculado (calculatedTotalPages)
const sortBy = ref('name')
const sortOrder = ref<'asc' | 'desc'>('asc')
const viewMode = ref<'table' | 'grid'>('table')
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

// Computed para usuarios filtrados (sin paginación)
const allFilteredUsers = computed(() => applyFilters(allUsers.value))

// Computed para contar usuarios filtrados
const filteredUsersCount = computed(() => allFilteredUsers.value.length)

// Computed para calcular total de páginas basado en usuarios filtrados
const calculatedTotalPages = computed(() => Math.max(1, Math.ceil(filteredUsersCount.value / pageSize.value)))

// Computed para usuarios de la página actual
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allFilteredUsers.value.slice(start, end)
})

// Función para contar usuarios Oxford por userRole
const getOxfordCount = (subtype?: 'current_student' | 'alumni'): number => {
  const oxfordUsers = allUsers.value.filter(u => u.userType === 'user')
  
  if (!subtype) {
    return oxfordUsers.length
  }
  
  return oxfordUsers.filter(u => u.userRole === subtype).length
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
    if (oxfordSubtypeFilter.value === 'current_student') {
      return `Showing Students only (${getOxfordCount('current_student')} users)`
    } else if (oxfordSubtypeFilter.value === 'alumni') {
      return `Showing Alumni only (${getOxfordCount('alumni')} users)`
    }
    return `Showing Oxford users only (${getOxfordCount()} users)`
  } else if (userTypeFilter.value === 'staff-user') {
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
    const userRole = user.userRole
    if (userRole === 'alumni') return 'alumni'
    if (userRole === 'current_student') return 'current_student'
    // Si no tiene userRole definido, mostrar como current_student por defecto
    return 'current_student'
  }
  return 'other'
}

const getUserTypeLabel = (user: UserListDto): string => {
  if (user.userType === 'staff-user') {
    return 'Staff'
  } else if (user.userType === 'scanner') {
    return 'Organizador'
  } else if (user.userType === 'user') {
    const userRole = user.userRole
    if (userRole === 'current_student') {
      return 'Student'
    } else if (userRole === 'alumni') {
      return 'Alumni'
    }
    // Si no tiene userRole definido, mostrar como "Oxford"
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
    
    // Si es Oxford y hay subfiltro específico por userRole, aplicarlo
    if (userTypeFilter.value === 'user' && oxfordSubtypeFilter.value) {
      filtered = filtered.filter(u => u.userRole === oxfordSubtypeFilter.value)
    }
    
    // Si es Staff y hay subfiltro específico, aplicarlo
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
      page: 1,
      pageSize: 1000, // Cargar todos los usuarios para filtrado local
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    }
    const response = await UserApi.list(params)
    
    // Guardar todos los usuarios
    allUsers.value = response.items
    
    // Resetear a página 1 si la página actual excede las páginas disponibles
    if (currentPage.value > calculatedTotalPages.value) {
      currentPage.value = 1
    }
  } catch (error: unknown) {
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

const handleOxfordSubfilter = (subtype: 'current_student' | 'alumni' | null) => {
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

watch([userTypeFilter, oxfordSubtypeFilter, staffSubtypeFilter], () => {
  // Resetear a página 1 cuando cambian los filtros
  currentPage.value = 1
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
  if (page >= 1 && page <= calculatedTotalPages.value) {
    currentPage.value = page
  }
}

const getPageNumbers = (): (number | string)[] => {
  const pages: (number | string)[] = []
  const total = calculatedTotalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    // Si hay 7 o menos páginas, mostrar todas
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Siempre mostrar primera página
    pages.push(1)
    
    if (current <= 3) {
      // Cerca del inicio
      pages.push(2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      // Cerca del final
      pages.push('...', total - 3, total - 2, total - 1, total)
    } else {
      // En el medio
      pages.push('...', current - 1, current, current + 1, '...', total)
    }
  }
  
  return pages
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
  } catch (error: unknown) {
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
  border-bottom: 1px solid #e2e8f0;
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
  border: 1px solid #e2e8f0;
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
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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
  border-bottom: 1px solid #e2e8f0;
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
  padding: 2rem;
  margin: 0 auto;
  background: transparent;
}

.users-grid-container {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.users-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.users-table th,
.users-table td {
  padding: 1.25rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.users-table th {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  color: #475569;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: sticky;
  top: 0;
  z-index: 10;
}

.users-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  position: relative;
}

.users-table th.sortable:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #0d2954;
}

.sort-icon {
  display: inline-block;
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: #0d2954;
  font-weight: 700;
}

.users-table td {
  color: #1e293b;
  font-weight: 500;
  font-size: 0.9375rem;
}

.users-table tbody tr:last-child td {
  border-bottom: none;
}

.user-row {
  transition: all 0.2s ease;
}

.user-row:hover {
  background-color: #f8fafc;
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

/* ✅ Current Student - Azul índigo */
.type-badge.current_student {
  background-color: #e0e7ff;
  color: #4f46e5;
  border: 1px solid #a5b4fc;
}

/* ✅ Alumni - Púrpura */
.type-badge.alumni {
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

/* ✅ Current Student - Azul índigo vibrante */
.type-badge-modern.current_student {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  border: 2px solid #a5b4fc;
}

.type-badge-modern.current_student .badge-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
}

/* ✅ Alumni - Púrpura real */
.type-badge-modern.alumni {
  background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  color: #ffffff;
  border: 2px solid #d8b4fe;
}

.type-badge-modern.alumni .badge-icon-wrapper {
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

/* View Controls */
.view-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  margin: 0 auto;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 0.25rem;
  border-radius: 10px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  color: #64748b;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  color: #475569;
}

.toggle-btn.active {
  background: #ffffff;
  color: #0d2954;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.results-info {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* Grid View Styles */
.users-grid-container {
  padding: 2rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.user-avatar-card {
  flex-shrink: 0;
}

.avatar-initial {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d2954 0%, #1a3d6e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(13, 41, 84, 0.2);
}

.user-title {
  flex: 1;
  min-width: 0;
}

.user-name-card {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email-card {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-type-section,
.user-role-section {
  display: flex;
  align-items: center;
}

.card-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-radius: 0 0 12px 12px;
}

.action-btn-card {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.action-btn-card.edit {
  color: #3b82f6;
}

.action-btn-card.edit:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  transform: translateY(-1px);
}

.action-btn-card.delete {
  color: #ef4444;
}

.action-btn-card.delete:hover {
  background: #fee2e2;
  border-color: #fecaca;
  transform: translateY(-1px);
}

/* Pagination Styles */
.pagination-container {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  color: #475569;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #0d2954;
  color: #0d2954;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.page-number {
  min-width: 40px;
  height: 40px;
  padding: 0 0.75rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  color: #475569;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-number:hover:not(:disabled):not(.ellipsis) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.page-number.active {
  background: linear-gradient(135deg, #0d2954 0%, #1a3d6e 100%);
  color: #ffffff;
  border-color: #0d2954;
  box-shadow: 0 2px 8px rgba(13, 41, 84, 0.2);
}

.page-number.ellipsis {
  border: none;
  background: transparent;
  cursor: default;
  color: #94a3b8;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.pagination-info .separator {
  color: #cbd5e1;
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