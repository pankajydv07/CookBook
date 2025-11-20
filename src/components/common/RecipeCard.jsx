import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaTrash, FaClock } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function RecipeCard({ recipe, isFavorite, onToggleFavorite, onDelete, canDelete = false, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover overflow-hidden transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Favorite Button - Floating */}
        <button 
          onClick={() => onToggleFavorite?.(recipe)} 
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          {isFavorite ? (
            <FaHeart className="text-spice-red text-lg" />
          ) : (
            <FaRegHeart className="text-neutral-600 text-lg" />
          )}
        </button>
        
        {/* Cuisine Badge */}
        {recipe.cuisine && (
          <div className="absolute top-3 left-3 bg-primary-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <p className="text-xs font-semibold text-white">{recipe.cuisine}</p>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-neutral-800 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {recipe.title}
        </h3>
        
        {recipe.time && (
          <div className="flex items-center gap-1.5 text-neutral-600 text-sm mb-3">
            <FaClock className="text-primary-500" />
            <span>{recipe.time} min</span>
          </div>
        )}
        
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-100">
          <Link 
            to={`/recipe/${recipe.id}`} 
            className="flex-1 text-center bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 shadow-sm hover:shadow-md"
          >
            View Recipe
          </Link>
          
          {onDelete && canDelete && (
            <button 
              onClick={() => onDelete?.(recipe)} 
              className="p-2.5 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
              title="Delete recipe"
            >
              <FaTrash />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}