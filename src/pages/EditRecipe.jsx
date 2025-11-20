import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'
import { toast } from 'react-toastify'

export default function EditRecipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/recipes/${id}`)
      setRecipe(data)
    })()
  }, [id])

  async function submit(e) {
    e.preventDefault()
    const payload = {
      ...recipe,
      ingredients: recipe.ingredients.split ? recipe.ingredients.split('\n') : recipe.ingredients,
      steps: recipe.steps.split ? recipe.steps.split('\n') : recipe.steps
    }
    await api.put(`/recipes/${id}`, payload)
    toast.success('Recipe updated')
    navigate(`/recipe/${id}`)
  }

  if (!recipe) return <div className="max-w-3xl mx-auto px-4 py-6">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border rounded p-2" value={recipe.title} onChange={e=>setRecipe(r=>({ ...r, title: e.target.value }))} />
        <input className="border rounded p-2" value={recipe.image} onChange={e=>setRecipe(r=>({ ...r, image: e.target.value }))} />
        <input className="border rounded p-2" value={recipe.cuisine || ''} onChange={e=>setRecipe(r=>({ ...r, cuisine: e.target.value }))} />
        <input className="border rounded p-2" type="number" value={recipe.time} onChange={e=>setRecipe(r=>({ ...r, time: Number(e.target.value) }))} />
        <textarea className="border rounded p-2 md:col-span-2 min-h-[120px]" value={Array.isArray(recipe.ingredients)? recipe.ingredients.join('\n'): recipe.ingredients} onChange={e=>setRecipe(r=>({ ...r, ingredients: e.target.value }))} />
        <textarea className="border rounded p-2 md:col-span-2 min-h-[160px]" value={Array.isArray(recipe.steps)? recipe.steps.join('\n'): recipe.steps} onChange={e=>setRecipe(r=>({ ...r, steps: e.target.value }))} />
        <div className="md:col-span-2">
          <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  )
}