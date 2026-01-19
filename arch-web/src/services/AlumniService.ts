// src/services/AlumniService.ts
// Service for Alumni Verification Management (Admin Panel)

import { useAuthStore } from '@/stores/auth.store'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

// Helper: Si la URL base termina en /api-dev, las rutas no deben incluir /api/
const isDevelopmentApi = BASE_URL?.endsWith('/api-dev')
const normalizePath = (path: string): string => {
  if (isDevelopmentApi && path.startsWith('/api/')) {
    return path.replace(/^\/api\//, '/')
  }
  return path
}

// ==================== TIPOS DE DATOS ====================

export type AlumniStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type AlumniIdentity = 'Alumnus' | 'Alumna' | 'Alum'
export type DocumentSource = 'register' | 'resubmit'

export interface AlumniVerificationListItem {
  userId: string
  fullName: string
  email: string
  graduationYear: number
  identity: AlumniIdentity
  status: AlumniStatus
  submittedAt: string
  reviewedAt: string | null
  latestDocumentUrl: string
  latestDocumentMimeType: string
}

export interface AlumniDocument {
  id: string
  fileName: string
  mimeType: string
  sizeBytes: number
  uploadedAt: string
  source: DocumentSource
  downloadUrl: string
}

export interface AlumniVerificationDetail extends AlumniVerificationListItem {
  reviewedByAdminId: string | null
  reviewReason: string | null
  documents: AlumniDocument[]
}

export interface AlumniVerificationListResponse {
  items: AlumniVerificationListItem[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApproveResponse {
  userId: string
  status: 'APPROVED'
  reviewedAt: string
  message: string
}

export interface RejectResponse {
  userId: string
  status: 'REJECTED'
  reviewedAt: string
  reason: string
  message: string
}

export interface AlumniErrorResponse {
  code: string
  message: string
}

// ==================== FUNCIÓN REQUEST ====================

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const authStore = useAuthStore()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init?.headers as Record<string, string>) || {}),
  }

  if (authStore.isLoggedIn && authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`
  }

  const normalizedPath = normalizePath(path)
  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    ...init,
    headers,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)

    const error = {
      message: data?.message || data?.title || `Request failed with status ${res.status}`,
      code: data?.code || 'UNKNOWN_ERROR',
      response: {
        data: data,
        status: res.status,
      },
    }

    if (res.status === 401) {
      console.error('Received 401 Unauthorized. Logging out.')
      authStore.logout()
    }

    throw error
  }

  if (res.status === 204) return undefined as unknown as T

  const contentType = res.headers.get('content-type')
  const contentLength = res.headers.get('content-length')

  if (!contentType?.includes('application/json') || contentLength === '0') {
    return undefined as unknown as T
  }

  return res.json() as Promise<T>
}

// ==================== ALUMNI VERIFICATION API ====================

export const AlumniVerificationApi = {
  /**
   * List alumni verifications with filtering and pagination
   * GET /api/admin/alumni-verifications
   */
  list: async (params?: {
    status?: AlumniStatus
    page?: number
    pageSize?: number
    search?: string
  }): Promise<AlumniVerificationListResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append('status', params.status)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString())
    if (params?.search) searchParams.append('search', params.search)

    return request<AlumniVerificationListResponse>(
      `/api/admin/alumni-verifications?${searchParams.toString()}`
    )
  },

  /**
   * Get detailed information for a specific alumni verification
   * GET /api/admin/alumni-verifications/{userId}
   */
  getDetail: async (userId: string): Promise<AlumniVerificationDetail> => {
    return request<AlumniVerificationDetail>(
      `/api/admin/alumni-verifications/${userId}`
    )
  },

  /**
   * Approve an alumni verification request
   * POST /api/admin/alumni-verifications/{userId}/approve
   */
  approve: async (userId: string): Promise<ApproveResponse> => {
    return request<ApproveResponse>(
      `/api/admin/alumni-verifications/${userId}/approve`,
      {
        method: 'POST',
      }
    )
  },

  /**
   * Reject an alumni verification request with a reason
   * POST /api/admin/alumni-verifications/{userId}/reject
   */
  reject: async (userId: string, reason: string): Promise<RejectResponse> => {
    return request<RejectResponse>(
      `/api/admin/alumni-verifications/${userId}/reject`,
      {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }
    )
  },
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Format file size from bytes to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Check if a mime type is an image
 */
export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

/**
 * Check if a mime type is a PDF
 */
export function isPdfMimeType(mimeType: string): boolean {
  return mimeType === 'application/pdf'
}

/**
 * Get file icon based on mime type
 */
export function getFileIcon(mimeType: string): string {
  if (isImageMimeType(mimeType)) return '🖼️'
  if (isPdfMimeType(mimeType)) return '📄'
  return '📎'
}

// ==================== QUICK REJECTION REASONS ====================

export const QUICK_REJECTION_REASONS = [
  {
    label: 'Document unreadable',
    value: 'The document provided is not clearly readable. Please upload a higher quality scan or photo of your official degree certificate or alumni card.',
  },
  {
    label: 'Name not visible',
    value: 'Your name is not clearly visible in the document provided. Please upload a document that clearly shows your full name as registered with ARCH.',
  },
  {
    label: 'Not Oxford document',
    value: 'The document provided does not appear to be an official Oxford University document. Please upload your Oxford degree certificate, transcript, or alumni card.',
  },
  {
    label: 'Expired document',
    value: 'The document provided appears to be expired or outdated. Please upload a current valid document that confirms your Oxford alumni status.',
  },
  {
    label: 'Wrong document type',
    value: 'The document type provided is not acceptable for verification. Please upload your official degree certificate, transcript, or Oxford alumni card.',
  },
]
