import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_JSON_SERVER_URL || 'http://localhost:5000'
})

const SPOONACULAR_KEY = import.meta.env.VITE_SPOONACULAR_KEY
export const spoonacular = axios.create({
  baseURL: 'https://api.spoonacular.com'
})

export async function searchRecipesExternal({ query, cuisine, ingredients, number = 12 }) {
  const params = { apiKey: SPOONACULAR_KEY, number }
  if (query) params.query = query
  if (cuisine) params.cuisine = cuisine
  const { data } = await spoonacular.get('/recipes/complexSearch', { params })
  return data?.results || []
}

export async function findByIngredients({ ingredients, number = 12 }) {
  const { data } = await spoonacular.get('/recipes/findByIngredients', {
    params: { apiKey: SPOONACULAR_KEY, ingredients: ingredients?.join(',') || '', number }
  })
  return data || []
}

export async function getRecipeInfoExternal(id) {
  const cleanId = String(id).replace('ext-', '')
  const { data } = await spoonacular.get(`/recipes/${cleanId}/information`, {
    params: { apiKey: SPOONACULAR_KEY, includeNutrition: false }
  })
  return data
}