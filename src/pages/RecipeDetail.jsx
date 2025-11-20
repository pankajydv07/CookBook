import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHeart, FaRegHeart, FaClock, FaUtensils, FaEdit, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { api, getRecipeInfoExternal } from '../services/api'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        if (String(id).startsWith('ext-')) {
          const info = await getRecipeInfoExternal(id)
          const normalized = {
            id,
            title: info.title,
            image: info.image,
            cuisine: (info.cuisines && info.cuisines[0]) || '',
            time: info.readyInMinutes,
            ingredients: (info.extendedIngredients || []).map(i => i.original),
            steps: (info.analyzedInstructions?.[0]?.steps || []).map(s => s.step)
          }
          setRecipe(normalized)
          setLoading(false)
          return
        }
        try {
          const { data } = await api.get(`/recipes/${id}`)
          if (data && data.id) { setRecipe(data); setLoading(false); return }
        } catch { }
        const { data: list } = await api.get('/recipes', { params: { id } })
        const found = Array.isArray(list) && list.length ? list[0] : null
        if (found) { setRecipe(found); setLoading(false); return }
        toast.error('Recipe not found')
        setRecipe({ _error: true })
      } catch {
        toast.error('Recipe not found')
        setRecipe({ _error: true })
      }
      setLoading(false)
    })()
  }, [id])

  useEffect(() => {
    (async () => {
      if (!user) return
      const { data } = await api.get('/favorites', { params: { userId: user.id } })
      setFavorites(data)
    })()
  }, [user?.id])

  function isFavorite(recipeId) { return favorites.some(f => f.recipeId === recipeId) }

  async function toggleFavorite() {
    if (!recipe) return
    const fav = favorites.find(f => f.recipeId === recipe.id)
    if (fav) {
      await api.delete(`/favorites/${fav.id}`)
      setFavorites(prev => prev.filter(x => x.id !== fav.id))
      toast.info('Removed from favorites')
    } else {
      const { data } = await api.post('/favorites', { userId: user.id, recipeId: recipe.id })
      setFavorites(prev => [...prev, data])
      toast.success('Added to favorites! ❤️')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    )
  }

  if (recipe?._error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-card p-12 text-center max-w-md">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-3">Recipe Not Found</h2>
          <p className="text-neutral-600 mb-6">We couldn't find this recipe. It may have been deleted or moved.</p>
          <Link
            to="/cookbook"
            className="inline-block bg-gradient-warm text-white px-6 py-3 rounded-xl font-semibold shadow-glow hover:shadow-glow-lg transition-all"
          >
            Back to Cookbook
          </Link>
        </div>
      </div>
    )
  }

  if (!recipe) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors"
        >
          <FaArrowLeft />
          <span className="font-medium">Back</span>
        </motion.button>

        {/* Recipe Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-card overflow-hidden"
        >
          {/* Hero Image */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Floating Info */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{recipe.title}</h1>
                  {recipe.cuisine && (
                    <span className="inline-block bg-primary-500/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-white font-semibold">
                      {recipe.cuisine}
                    </span>
                  )}
                </div>
                <button
                  onClick={toggleFavorite}
                  className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  {isFavorite(recipe.id) ? (
                    <FaHeart className="text-spice-red text-2xl" />
                  ) : (
                    <FaRegHeart className="text-neutral-600 text-2xl" />
                  )}
                </button>
              </div>
            </div>

            {/* Edit Button for Owner */}
            {!String(id).startsWith('ext-') && recipe.authorId === user?.id && (
              <Link
                to={`/edit/${recipe.id}`}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2 font-semibold text-primary-600"
              >
                <FaEdit />
                <span>Edit</span>
              </Link>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Quick Info */}
            {recipe.time && (
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-neutral-200">
                <div className="flex items-center gap-3 bg-primary-50 px-5 py-3 rounded-xl">
                  <FaClock className="text-primary-600 text-xl" />
                  <div>
                    <p className="text-xs text-neutral-600 font-medium">Cook Time</p>
                    <p className="text-lg font-bold text-primary-600">{recipe.time} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-secondary-50 px-5 py-3 rounded-xl">
                  <FaUtensils className="text-secondary-600 text-xl" />
                  <div>
                    <p className="text-xs text-neutral-600 font-medium">Servings</p>
                    <p className="text-lg font-bold text-secondary-600">4-6</p>
                  </div>
                </div>
              </div>
            )}

            {/* Ingredients & Steps Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-3">
                  <div className="bg-accent-500 p-2 rounded-lg">
                    <FaUtensils className="text-white" />
                  </div>
                  Ingredients
                </h2>
                <div className="space-y-3">
                  {recipe.ingredients?.map((ing, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 bg-neutral-50 p-3 rounded-lg"
                    >
                      <FaCheckCircle className="text-secondary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700">{ing}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-3">
                  <div className="bg-primary-500 p-2 rounded-lg">
                    <span className="text-white text-xl">📝</span>
                  </div>
                  Instructions
                </h2>
                <div className="space-y-4">
                  {recipe.steps?.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-warm text-white flex items-center justify-center font-bold shadow-glow">
                        {i + 1}
                      </div>
                      <p className="text-neutral-700 pt-1">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}