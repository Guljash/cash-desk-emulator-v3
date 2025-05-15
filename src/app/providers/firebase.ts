import {
  type Plugin,
} from 'vue'
import {
  createFirebasePlugin,
} from '@/shared/services/firebase.js'

export const withFirebase = (): Plugin => createFirebasePlugin()
