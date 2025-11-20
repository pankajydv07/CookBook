import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaImage, FaClock, FaUtensils, FaListOl, FaPlus } from 'react-icons/fa'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function AddRecipe() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [time, setTime] = useState(20)
  const [cuisine, setCuisine] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        title,
        image,
        ingredients: ingredients.split('\n').map(s => s.trim()).filter(Boolean),
        steps: steps.split('\n').map(s => s.trim()).filter(Boolean),
        time: Number(time),
        cuisine,
        authorId: user.id
      }
      const { data } = await api.post('/recipes', payload)
      toast.success('Recipe created successfully! 🎉')
      navigate(`/recipe/${data.id}`)
    } catch (error) {
      toast.error('Failed to create recipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-2">Create New Recipe</h1>
          <p className="text-neutral-600 text-lg">Share your culinary masterpiece with the world</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="bg-white rounded-3xl shadow-card p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
              <FaUtensils className="text-primary-500" />
              Recipe Title
            </label>
            <input
              className="w-full border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-xl p-4 transition-all text-lg"
              placeholder="e.g., Grandma's Secret Chocolate Cake"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Grid for Image, Cuisine, Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                <FaImage className="text-primary-500" />
                Image URL
              </label>
              <input
                className="w-full border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-xl p-4 transition-all"
                placeholder="https://example.com/image.jpg"
                value={image}
                onChange={e => setImage(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                <FaClock className="text-primary-500" />
                Time (mins)
              </label>
              <input
                className="w-full border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-xl p-4 transition-all"
                type="number"
                placeholder="30"
                value={time}
                onChange={e => setTime(e.target.value)}
                min="1"
              />
            </div>
          </div>

          {/* Cuisine */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
              <span className="text-primary-500">🌍</span>
              Cuisine Type
            </label>
            <input
              className="w-full border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-xl p-4 transition-all"
              placeholder="e.g., Italian, Mexican, Indian"
              value={cuisine}
              onChange={e => setCuisine(e.target.value)}
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
              <FaListOl className="text-primary-500" />
              Ingredients
              <span className="text-xs text-neutral-500 font-normal">(one per line)</span>
            </label>
            <textarea
              className="w-full border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-xl p-4 transition-all min-h-[160px] font-mono text-sm"
              placeholder="2 cups all-purpose flour&#10;1 cup sugar&#10;3 eggs&#10;1 tsp vanilla extract"
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              required
            />
          </div>

          {/* Steps */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
              <FaListOl className="text-primary-500" />
              Cooking Steps
              <span className="text-xs text-neutral-500 font-normal">(one per line)</span>
            </label>
            <textarea
              className="w-full border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-xl p-4 transition-all min-h-[200px] font-mono text-sm"
              placeholder="Preheat oven to 350°F&#10;Mix dry ingredients in a bowl&#10;Beat eggs and add to mixture&#10;Pour into greased pan and bake for 30 minutes"
              value={steps}
              onChange={e => setSteps(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/cookbook')}
              className="px-6 py-3 rounded-xl border-2 border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-warm text-white px-6 py-3 rounded-xl font-semibold shadow-glow hover:shadow-glow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaPlus />
              {loading ? 'Creating Recipe...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}