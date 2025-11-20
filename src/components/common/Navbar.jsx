import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaBookOpen, FaHeart, FaPlusCircle } from 'react-icons/fa'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-primary-50 to-accent-50 shadow-sm border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-2xl hover:text-primary-700 transition-colors">
          <FaBookOpen className="text-3xl" />
          <span>CookBook</span>
        </Link>
        {user ? (
          <nav className="flex items-center gap-6">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'text-primary-600 font-semibold' : 'text-neutral-700 font-medium hover:text-primary-600 transition-colors')}>Home</NavLink>
            <NavLink to="/cookbook" className={({ isActive }) => (isActive ? 'text-primary-600 font-semibold' : 'text-neutral-700 font-medium hover:text-primary-600 transition-colors')}>Cookbook</NavLink>
            <NavLink to="/favorites" className={({ isActive }) => (isActive ? 'text-primary-600 font-semibold' : 'text-neutral-700 font-medium hover:text-primary-600 transition-colors')}>
              <span className="inline-flex items-center gap-2">
                <FaHeart className="text-red-500" />
                <span>Favorites</span>
              </span>
            </NavLink>
            <NavLink to="/add" className={({ isActive }) => (isActive ? 'text-primary-600 font-semibold' : 'text-neutral-700 font-medium hover:text-primary-600 transition-colors')}>
              <span className="inline-flex items-center gap-2">
                <FaPlusCircle className="text-secondary-500" />
                <span>Add Recipe</span>
              </span>
            </NavLink>
            <div className="h-8 w-px bg-neutral-300 mx-2"></div>
            <span className="text-sm text-neutral-600 font-medium">Hi, {user.name}</span>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="px-5 py-2.5 rounded-lg bg-gradient-warm text-white hover:shadow-glow transition-all font-semibold"
            >
              Logout
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-4">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'text-primary-600 font-semibold' : 'text-neutral-700 font-medium hover:text-primary-600 transition-colors')}>Home</NavLink>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'text-primary-600 font-semibold' : 'text-neutral-700 font-medium hover:text-primary-600 transition-colors')}>Login</NavLink>
            <NavLink to="/signup" className="bg-gradient-warm text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-glow transition-all">
              Sign Up
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  )
}