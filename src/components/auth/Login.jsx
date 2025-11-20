import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('demo@cookbook.app')
  const [password, setPassword] = useState('demo123')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/cookbook')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow p-8">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-warm bg-clip-text text-transparent">Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
            <input className="mt-1 w-full border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-lg p-3 transition-all" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
            <input className="mt-1 w-full border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-lg p-3 transition-all" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button disabled={loading} className="w-full bg-gradient-warm text-white py-3 rounded-lg font-semibold shadow-glow hover:shadow-glow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        <p className="text-sm mt-6 text-center text-neutral-600">No account? <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">Sign up</Link></p>
      </div>
    </div>
  )
}