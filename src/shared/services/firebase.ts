import {
  inject,
  type InjectionKey,
  type Plugin,
} from 'vue'
import {
  initializeApp,
} from 'firebase/app'
import {
  getDatabase,
} from 'firebase/database'
import {
  type Database,
} from '@firebase/database'

interface Firebase {
  db: Database
}

const FIREBASE_PROVIDE_KEY: InjectionKey<Firebase> = Symbol('FIREBASE')

export const createFirebasePlugin = (): Plugin => ({
  install: (app) => {
    const firebaseConfig = {
      apiKey: import.meta.env['VITE_FIREBASE_API_KEY'],
      authDomain: import.meta.env['VITE_FIREBASE_AUTH_DOMAIN'],
      databaseURL: 'https://copy-calcv2-default-rtdb.europe-west1.firebasedatabase.app',
      projectId: import.meta.env['VITE_FIREBASE_PROJECT_ID'],
      storageBucket: import.meta.env['VITE_FIREBASE_STORAGE_BUCKET'],
      messagingSenderId: import.meta.env['VITE_FIREBASE_MESSAGING_SENDER_ID'],
      appId: import.meta.env['VITE_FIREBASE_APP_ID'],
      measurementId: 'G-R4GT0JXXB4',
    }

    const fbApp = initializeApp(firebaseConfig)

    const db = getDatabase(fbApp)

    app.provide(FIREBASE_PROVIDE_KEY, {db})
  },
})

export const useFirebase = (): {
  db: Database
} => {
  const {db} = inject(FIREBASE_PROVIDE_KEY)!

  return {
    db,
  }
}
