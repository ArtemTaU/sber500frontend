import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHeart, faCircleQuestion, faCircleXmark} from '@fortawesome/free-solid-svg-icons'

library.add(faHeart)
library.add(faCircleQuestion)
library.add(faCircleXmark)
const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)

app.mount('#app')
