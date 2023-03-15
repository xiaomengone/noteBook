import request from '@/Http/request'
import {friendlyDate} from '@/Http/util.js'
const URL = {
    GET:'/notebooks',
    ADD:'/notebooks',
    UPDATE:'/notebooks/:id',
    DELETE:'/notebooks/:id'
}
export default {
    getAll(){
        return new Promise((resolve,reject) => {
            request(URL.GET).then(res => {
                res.data = res.data.sort((notebook1, notebook2) => notebook1.createAt < notebook2.createAt ? 1 : -1)
                res.data.forEach(notebook => {
                    //判断是多少天前
                notebook.friendlyCreatedAt = friendlyDate(notebook.createdAt)
               })
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
        return request(URL.GET)
    },
    updateNotebook(notebookId,{ title=''} ={title:''}){
        return request(URL.UPDATE.replace(':id',notebookId),'PATCH',{title})
    },
    deleteNotebook(notebookId){
        return request(URL.DELETE.replace(':id',notebookId),'DELETE')
    },
    addNoteBook({title=''}={title:''}){
        return request(URL.ADD,'POST',{title})
    }
}