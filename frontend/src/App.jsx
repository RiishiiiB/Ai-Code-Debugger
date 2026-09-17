import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/dashboard'
import Login from './pages/login'
import ProtectedRoute from './routes/ProtectedRoute'
import CodeReview from './pages/CodeReview'

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/code-review" element={<CodeReview />} />
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
        <Route path="/login" element={<Login />} />

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