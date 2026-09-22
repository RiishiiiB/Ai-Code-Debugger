const API_URL = 'http://localhost:8000'

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('access_token')

  const headers = {
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    localStorage.removeItem('access_token')
    window.location.href = '/login'
    return
  }

  return response
}

export async function getDashboardStats() {
  const response = await apiRequest('/dashboard/stats')

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard statistics')
  }

  return response.json()
}

export async function createSubmission(code, language) {
  const response = await apiRequest('/submissions/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      language,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to analyze code')
  }

  return response.json()
}

export async function getSubmission(submissionId) {
  const response = await apiRequest(`/submissions/${submissionId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch submission')
  }

  return response.json()
}

export async function getSubmissionHistory() {
  const response = await apiRequest('/submissions/')

  if (!response.ok) {
    throw new Error('Failed to fetch submission history')
  }

  return response.json()
}
export async function createLearningAttempt(
  submissionId,
  thinking,
  attemptedCode
) {
  const response = await apiRequest('/learning/attempts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      submission_id: Number(submissionId),
      thinking,
      attempted_code: attemptedCode,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('Learning attempt API error:', data)

    throw new Error(
      data.detail || 'Failed to analyze learning attempt'
    )
  }

  return data
}