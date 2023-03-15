import Notebook from '@/apis/notes'
import { Message } from 'element-ui'

const state = {
    notes: [],
    curNote: {}
}

const getters = {
    notes: state => state.notes || [],

  curBook: state => {
    if(!Array.isArray(state.notebooks)) return {}
    if(!state.curBookId) return state.notebooks[0] || {}
    return state.notebooks.find(notebook => notebook.id == state.curBookId) || {}
  }
}

const mutations = {
  setNote(state, payload) {
    state.notes = payload.notes
  },

  addNote(state, payload) {
    state.notes.unshift(payload.note)
  },

  updateNote(state, payload) {
    let note = state.notes.find(note => note.id == payload.noteId) || {}
    note.title = payload.title
    note.content = payload.content
  },

  deleteNote(state, payload) {
    state.notes = state.notes.filter(note => note.id != payload.noteId)
  },

  setCurBook(state, payload) {
    state.curBookId = payload.curBookId
  }
}

const actions = {
  getNotes({ commit },{notebookId}) {
    return Notebook.getAll({notebookId})
      .then(res => {
        commit('setNote', { notes: res.data })
      })
  },

  addNote({ commit }, {noteId,title,content}) {
    return Note.addNote({notebookId},{ title,content})
      .then(res => {
        console.log('add success...', res)
        commit('addNote', { note: res.data })
        Message.success(res.msg)
      })
  },

  updateNote({ commit }, {noteId,title,content}) {
    return Notebook.updateNote({noteId}, { title,content})
      .then(res => {
        commit('updateNote', { noteId, title,content})
        Message.success(res.msg)
      })
  },

  deleteNote({ commit }, {noteId}) {
    return Note.deleteNote({noteId})
      .then(res => {
        commit('deleteNote', { noteId})
        Message.success(res.msg)
      })
  } 
}


export default {
  state,
  getters,
  mutations,
  actions
}