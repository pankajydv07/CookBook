import { useState } from 'react'
import { FaSearch, FaUtensils, FaCarrot } from 'react-icons/fa'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [ingredients, setIngredients] = useState('')

  function submit(e) {
    e.preventDefault()
    const list = ingredients.split(',').map(s => s.trim()).filter(Boolean)
    onSearch?.({ query, cuisine, ingredients: list })
  }

  return (
    <form onSubmit={submit} className="bg-gradient-to-r from-primary-50/80 to-accent-50/80 backdrop-blur-sm rounded-2xl shadow-card p-4 border border-primary-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search recipes..."
            className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-xl transition-all"
          />
        </div>

        <div className="relative">
          <FaUtensils className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={cuisine}
            onChange={e => setCuisine(e.target.value)}
            placeholder="Cuisine type..."
            className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-xl transition-all"
          />
        </div>

        <div className="relative">
          <FaCarrot className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            placeholder="Ingredients..."
            className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-xl transition-all"
          />
        </div>

        <button className="bg-gradient-warm hover:shadow-glow-lg text-white rounded-xl py-3 font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2">
          <FaSearch />
          <span>Search</span>
        </button>
      </div>
    </form>
  )
}