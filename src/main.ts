import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css' // <- don't forget this line!

const app = createApp(App)

const baseUrl = import.meta.env.VITE_BASE_URL
axios.defaults.baseURL = baseUrl

app.use(createPinia())
app.use(router)
app.use(Toast) // ✅ Moved above mount()

app.mount('#app') // ✅ Mount only after all plugins
