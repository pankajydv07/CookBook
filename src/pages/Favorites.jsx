import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaHeart, FaSearch } from 'react-icons/fa'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import RecipeCard from '../components/common/RecipeCard'

export default function Favorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      const { data: favs } = await api.get('/favorites', { params: { userId: user.id } })
      setFavorites(favs)
      const { data: recs } = await api.get('/recipes')
      setRecipes(recs)
      setLoading(false)
    })()
  }, [user.id])

  function isFavorite(id) { return favorites.some(f => f.recipeId === id) }

  async function toggleFavorite(recipe) {
    const fav = favorites.find(f => f.recipeId === recipe.id)
    if (fav) {
      await api.delete(`/favorites/${fav.id}`)
      setFavorites(prev => prev.filter(x => x.id !== fav.id))
    } else {
      const { data } = await api.post('/favorites', { userId: user.id, recipeId: recipe.id })
      setFavorites(prev => [...prev, data])
    }
  }

  const favRecipes = recipes.filter(r => isFavorite(r.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-gradient-to-br from-spice-red to-red-600 p-4 rounded-2xl shadow-lg">
              <FaHeart className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent">Your Favorites</h1>
              <p className="text-neutral-600 text-lg">Recipes you love, all in one place</p>
            </div>
          </div>

          {!loading && (
            <div className="bg-white rounded-2xl shadow-card p-4 mt-6 inline-flex items-center gap-3">
              <span className="text-neutral-600 font-medium">Total Favorites:</span>
              <span className="bg-gradient-warm text-white px-4 py-2 rounded-lg font-bold text-lg">
                {favRecipes.length}
              </span>
            </div>
          )}
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        ) : favRecipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-card p-12 text-center"
          >
            <div className="bg-neutral-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSearch className="text-neutral-400 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-3">No Favorites Yet</h2>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Start exploring recipes and click the heart icon to save your favorites here!
            </p>
            <a
              href="/cookbook"
              className="inline-block bg-gradient-warm text-white px-8 py-3 rounded-xl font-semibold shadow-glow hover:shadow-glow-lg transition-all hover:scale-105"
            >
              Discover Recipes
            </a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favRecipes.map((r, index) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                index={index}
                isFavorite
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}