const API_URL = 'http://localhost:8000'

export async function getDashboardStats() {
  const token = localStorage.getItem('access_token')

  const response = await fetch(`${API_URL}/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard statistics')
  }

  return response.json()
}
export async function createSubmission(code, language) {
  const token = localStorage.getItem('access_token')

  const response = await fetch('http://localhost:8000/submissions/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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
  const token = localStorage.getItem('access_token')

  const response = await fetch(
    `${API_URL}/submissions/${submissionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch submission')
  }

  return response.json()
}
export async function getSubmissionHistory() {
  const token = localStorage.getItem('access_token')

  const response = await fetch(`${API_URL}/submissions/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch submission history')
  }

  return response.json()
}