import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/page/Login'
import NotebooksList from '@/page/NotebooksList'
import NoteDetail from '@/page/NoteDetail'
import TrashDetail from '@/page/TrashDetail'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      redirect: NotebooksList
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/notebooks',
      name: 'NotebooksList',
      component: NotebooksList
    },
    {
      path: '/note',
      name: 'NoteDetail',
      component: NoteDetail
    },
    {
      path: '/trash/:noteId',
      name: 'TrashDetail',
      component: TrashDetail
    }
  ]
})
