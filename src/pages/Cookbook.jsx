import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBook, FaHeart, FaUser, FaSearch } from 'react-icons/fa'
import { api, searchRecipesExternal } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import Book from '../components/cookbook/Book'
import SearchBar from '../components/common/SearchBar'
import RecipeCard from '../components/common/RecipeCard'

export default function Cookbook() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [localRecipes, setLocalRecipes] = useState([])
  const [external, setExternal] = useState([])
  const [localResults, setLocalResults] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBook, setShowBook] = useState(false)
  const [favExternalCache, setFavExternalCache] = useState({})
  const [cookbookFilter, setCookbookFilter] = useState('favorites')
  const userId = user?.id

  async function load() {
    setLoading(true)
    const { data: recs } = await api.get('/recipes')
    setLocalRecipes(recs)
    if (userId) {
      const { data: favs } = await api.get('/favorites', { params: { userId } })
      setFavorites(favs)
    } else {
      setFavorites([])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [userId])

  async function onSearch({ query, cuisine, ingredients }) {
    const q = (query || '').toLowerCase()
    const ing = (ingredients || []).map(s => s.toLowerCase())

    const locals = localRecipes.filter(r => {
      const titleMatch = q ? (r.title || '').toLowerCase().includes(q) : true
      const cuisineMatch = cuisine ? (r.cuisine || '').toLowerCase().includes(cuisine.toLowerCase()) : true
      const ingredientsMatch = ing.length
        ? (Array.isArray(r.ingredients) ? r.ingredients : []).some(i => ing.some(x => (i || '').toLowerCase().includes(x)))
        : true
      return titleMatch && cuisineMatch && ingredientsMatch
    })
    setLocalResults(locals)

    try {
      const results = await searchRecipesExternal({ query, cuisine })
      setExternal(results.map(r => ({
        id: `ext-${r.id}`,
        title: r.title,
        image: r.image,
        cuisine,
        summary: r.summary || ''
      })))
    } catch (e) {
      toast.error('Failed to search external recipes')
    }
  }

  const favoriteItems = useMemo(() => {
    const localFavs = localRecipes
      .filter(r => favorites.some(f => f.recipeId === r.id))
      .map(r => ({ ...r, isFavorite: true }))
    const externalFavs = Object.values(favExternalCache).map(r => ({ ...r, isFavorite: true }))
    return [...localFavs, ...externalFavs]
  }, [localRecipes, favorites, favExternalCache])

  const authoredItems = useMemo(() => {
    return localRecipes
      .filter(r => (userId ? r.authorId === userId : false))
      .map(r => ({ ...r, isMine: true }))
  }, [localRecipes, userId])

  const cookbookItems = useMemo(() => {
    return cookbookFilter === 'favorites' ? favoriteItems : authoredItems
  }, [favoriteItems, authoredItems, cookbookFilter])

  function isFavorite(recipeId) {
    return favorites.some(f => f.recipeId === recipeId)
  }

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

  async function deleteRecipe(recipe) {
    if (String(recipe.id).startsWith('ext-')) return
    if (recipe.authorId !== user.id) return
    await api.delete(`/recipes/${recipe.id}`)
    setLocalRecipes(prev => prev.filter(r => r.id !== recipe.id))
    toast.success('Recipe deleted')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-warm rounded-3xl p-8 shadow-glow-lg text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Your Virtual Kitchen</h1>
                <p className="text-primary-50 text-lg">Discover, create, and master delicious recipes</p>
              </div>
              <button
                onClick={async () => {
                  const extIds = favorites.filter(f => String(f.recipeId).startsWith('ext-')).map(f => f.recipeId)
                  const missing = extIds.filter(id => !favExternalCache[id])
                  if (missing.length) {
                    try {
                      const entries = await Promise.all(missing.map(async (id) => {
                        const info = await (await import('../services/api')).getRecipeInfoExternal(id)
                        return [id, {
                          id,
                          title: info.title,
                          image: info.image,
                          cuisine: (info.cuisines && info.cuisines[0]) || '',
                          summary: info.summary || ''
                        }]
                      }))
                      setFavExternalCache(prev => ({ ...prev, ...Object.fromEntries(entries) }))
                    } catch { /* ignore */ }
                  }
                  setCookbookFilter('favorites')
                  setShowBook(true)
                }}
                className="flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
              >
                <FaBook />
                <span>Open Cookbook</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <SearchBar onSearch={onSearch} />
          </div>
        </motion.div>

        {/* Local Results */}
        {localResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaSearch className="text-primary-500 text-2xl" />
              <h2 className="text-2xl font-bold text-neutral-800">Search Results</h2>
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                {localResults.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {localResults.map((r, index) => (
                <RecipeCard key={r.id} recipe={r} index={index} isFavorite={isFavorite(r.id)} onToggleFavorite={toggleFavorite} onDelete={deleteRecipe} canDelete={r.authorId === user.id} />
              ))}
            </div>
          </motion.div>
        )}

        {/* External Results */}
        {external.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-secondary-500 p-2 rounded-lg">
                <FaSearch className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-800">Discover More</h2>
              <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm font-semibold">
                {external.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {external.map((r, index) => (
                <RecipeCard key={r.id} recipe={r} index={index} isFavorite={isFavorite(r.id)} onToggleFavorite={toggleFavorite} />
              ))}
            </div>
          </motion.div>
        )}

        {/* All Recipes */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-golden p-2 rounded-lg">
              <FaBook className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-800">All Recipes</h2>
            <span className="bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-semibold">
              {localRecipes.length}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {localRecipes.map((r, index) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  index={index}
                  isFavorite={isFavorite(r.id)}
                  onToggleFavorite={toggleFavorite}
                  onDelete={deleteRecipe}
                  canDelete={r.authorId === user.id}
                />
              ))}
              {localRecipes.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <p className="text-neutral-500 text-lg">No recipes found. Start by adding your first recipe!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cookbook Modal */}
        {showBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="relative w-full max-w-6xl mx-auto">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <button
                  onClick={() => setCookbookFilter('favorites')}
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${cookbookFilter === 'favorites' ? 'bg-gradient-warm text-white shadow-glow' : 'bg-white text-neutral-700 hover:bg-neutral-50'}`}
                >
                  <FaHeart className="inline mr-2" />
                  Favorites
                </button>
                <button
                  onClick={() => setCookbookFilter('mine')}
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${cookbookFilter === 'mine' ? 'bg-gradient-warm text-white shadow-glow' : 'bg-white text-neutral-700 hover:bg-neutral-50'}`}
                >
                  <FaUser className="inline mr-2" />
                  My Recipes
                </button>
              </div>
              <Book key={`${cookbookFilter}-${cookbookItems.length}`} items={cookbookItems} onSelect={(page) => navigate(`/recipe/${page.id}`)} coverTitle="Cookbook" onClose={() => setShowBook(false)} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}