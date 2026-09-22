import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

import Dashboard from './pages/dashboard'
import Login from './pages/login'
import CodeReview from './pages/CodeReview'
import History from './pages/History'
import ReviewDetails from './pages/ReviewDetails'
import Learning from './pages/Learning'
import LearningAttempt from './pages/LearningAttempt'

import ProtectedRoute from './routes/ProtectedRoute'


function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">
          <Routes>
            {/* Dashboard */}
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* Code Review */}
            <Route
              path="/code-review"
              element={<CodeReview />}
            />

            {/* History */}
            <Route
              path="/history"
              element={<History />}
            />

            <Route
              path="/history/:submissionId"
              element={<ReviewDetails />}
            />

            {/* Learning Mode */}
            <Route
              path="/learning"
              element={<Learning />}
            />

            <Route
              path="/learning/:submissionId"
              element={<Learning />}
            />

            {/* Learning Attempt */}
            <Route
              path="/learning/:submissionId/attempt"
              element={<LearningAttempt />}
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public route */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected application */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App