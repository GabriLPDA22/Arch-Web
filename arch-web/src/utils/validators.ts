// src/utils/validators.ts
import { useToast } from '@/composables/useToast'

const { error, success } = useToast()

/**
 * Validates that the email is from Oxford (@ox.ac.uk)
 * Shows an error toast automatically if invalid
 */
export function validateOxfordEmail(email: string): boolean {
  // Check basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    error('Invalid Email', 'Please enter a valid email address', { duration: 4000 })
    return false
  }

  // Check Oxford domain - accepts any subdomain of ox.ac.uk (e.g., @ox.ac.uk, @lmh.ox.ac.uk)
  const oxfordDomainRegex = /@([\w.-]+\.)?ox\.ac\.uk$/i
  if (!oxfordDomainRegex.test(email)) {
    error(
      'Oxford Email Only',
      'This system only accepts institutional Oxford University emails (@ox.ac.uk)',
      { duration: 5000 },
    )
    return false
  }

  return true
}

/**
 * Validates required field
 */
export function validateRequired(
  value: string | number | boolean | null | undefined,
  fieldName: string = 'field',
): boolean {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    error('Required Field', `The ${fieldName} is required`, { duration: 3500 })
    return false
  }
  return true
}

/**
 * Validates minimum length
 */
export function validateMinLength(
  value: string,
  min: number,
  fieldName: string = 'field',
): boolean {
  if (value.length < min) {
    error('Too Short', `The ${fieldName} must be at least ${min} characters`, { duration: 3500 })
    return false
  }
  return true
}

/**
 * Validates password (minimum 8 characters, must include letters and numbers)
 */
export function validatePassword(password: string): boolean {
  if (!validateRequired(password, 'password')) return false
  if (!validateMinLength(password, 8, 'password')) return false

  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  if (!hasLetter || !hasNumber) {
    error('Weak Password', 'Password must include at least one letter and one number', {
      duration: 4000,
    })
    return false
  }

  return true
}

/**
 * Validates that passwords match
 */
export function validatePasswordMatch(password: string, confirmPassword: string): boolean {
  if (password !== confirmPassword) {
    error('Passwords Do Not Match', 'Please verify that both passwords are the same', {
      duration: 3500,
    })
    return false
  }
  return true
}

/**
 * ✅ NUEVA VERSIÓN MEJORADA
 * Handles API errors by showing appropriate notifications based on HTTP status code.
 * It can now parse complex validation error objects from modern APIs.
 */
export function handleApiError(err: any) {
  console.error('API Error:', err)

  if (err.response) {
    const status = err.response.status
    const data = err.response.data

    switch (status) {
      case 400: // Bad Request / Validation Error
        let validationMessage = 'The provided data is not valid.' // Default message

        // Check for complex validation error object (e.g., from ASP.NET Core)
        if (data && data.errors && typeof data.errors === 'object') {
          const errorMessages = Object.values(data.errors).flat()
          if (errorMessages.length > 0) {
            validationMessage = errorMessages.join(' ')
          }
        } else if (data && data.message) {
          // Fallback for simple { "message": "..." } responses
          validationMessage = data.message
        }

        error('Validation Failed', validationMessage, { duration: 6000 })
        break

      case 401:
        error('Session Expired', 'Your session has expired. Please log in again', {
          duration: 5000,
        })
        break

      case 403:
        error('Access Denied', 'You do not have permission to perform this action', {
          duration: 4000,
        })
        break

      case 404:
        error('Not Found', 'The requested resource does not exist', { duration: 3500 })
        break

      case 409: // Conflict
        error('Conflict', data.message || 'This resource already exists.', {
          duration: 4500,
        })
        break

      case 422:
        error('Incorrect Data', 'The data could not be processed. Please verify the information', {
          duration: 4500,
        })
        break

      case 500:
      case 502:
      case 503:
        error('Server Error', 'An unexpected error occurred. Please try again later', {
          duration: 5000,
        })
        break

      default:
        error('Error', data.message || `An unexpected error occurred (Code: ${status})`, {
          duration: 4000,
        })
    }
  } else if (err.request) {
    // Network error
    error('Connection Error', 'Could not connect to the server. Check your internet connection', {
      duration: 5000,
    })
  } else {
    // Other type of error
    error('Error', err.message || 'An unexpected error occurred', { duration: 4000 })
  }
}

/**
 * Predefined success messages for common operations
 */
export const successMessages = {
  created: (entity: string = 'record') => {
    success('Created Successfully!', `The ${entity} has been created successfully.`, {
      duration: 3500,
    })
  },

  updated: (entity: string = 'record') => {
    success('Updated!', `The ${entity} has been updated successfully.`, { duration: 3500 })
  },

  deleted: (entity: string = 'record') => {
    success('Deleted!', `The ${entity} has been deleted successfully.`, { duration: 3500 })
  },

  saved: () => {
    success('Saved!', 'Changes have been saved successfully.', { duration: 3000 })
  },

  sent: () => {
    success('Sent!', 'Message has been sent successfully.', { duration: 3000 })
  },
}
