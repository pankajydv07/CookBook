import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/common/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './pages/Home'
import Cookbook from './pages/Cookbook'
import AddRecipe from './pages/AddRecipe'
import EditRecipe from './pages/EditRecipe'
import Favorites from './pages/Favorites'
import RecipeDetail from './pages/RecipeDetail'
import { AuthProvider, useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/cookbook" element={<ProtectedRoute><Cookbook /></ProtectedRoute>} />
          <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><EditRecipe /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        </Routes>
        <ToastContainer position="bottom-right" theme="light" />
      </div>
    </AuthProvider>
  )
}