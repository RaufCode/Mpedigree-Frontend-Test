import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import { useToast } from 'vue-toastification'


// const toast = useToast()

export const useAuthStore = defineStore('auth', () => {
  const individual = ref<any>(JSON.parse(localStorage.getItem('individual') || 'null'))
  const entity = ref<any>(JSON.parse(localStorage.getItem('entity') || 'null'))
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getEntityId = computed(() => entity.value?.id)

  async function signUp(form: any) {
    try {
      const response = await axios.post("entity/signup", form)
      router.push({ name: 'signin' })
      return response.data
    } catch (err: any) {
      error.value = 'Signup failed'
      console.error(err)
      throw err
    }
  }

  async function signIn(form: any) {
    try {
      loading.value = true
      const response = await axios.post('individual/signin', form)

      token.value = response.data.token
      entity.value = response.data.entities[0]?.entity
      individual.value = response.data.individual

      if (token.value !== null) {
        localStorage.setItem('token', token.value)
      }
      localStorage.setItem('entity', JSON.stringify(entity.value))
      localStorage.setItem('individual', JSON.stringify(individual.value))

      router.push({ name: 'dashboard' })
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Signin failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    const toast = useToast()
    individual.value = null
    token.value = null
    entity.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('individual')
    localStorage.removeItem('entity')
    toast.success("Logged Out Successful")
  }

  return {
    individual,
    entity,
    token,
    loading,
    error,
    signUp,
    signIn,
    logout,
    getEntityId
  }
})
