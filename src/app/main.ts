import {
  createApp,
} from 'vue'
import App from '@/app/app.vue'
import router from '@/app/router/index.ts'
import {
  withFirebase,
} from '@/app/providers/firebase.js'

const app = createApp(App)

app.use(router)
app.use(withFirebase())

app.mount('#app')
