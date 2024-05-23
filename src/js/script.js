// IMPORTS
import { searchTask } from './filterTask.js'
import { renderTodo } from './renderTodo.js'
import { saveDataTask } from "./saveTodo.js"
import { setLocalStorage } from  "./moduleStorage.js"
import { saveEditTask, openEditMode, toggleEditMode  } from './settingEditTodo.js'
import { deleteTask, getAlltask, putTask } from './apiControl.js'

// GLOBAL VARIABLES
let dataFrame = []
let back4app = 'https://parseapi.back4app.com//parse/classes/'

// SELEÇÃO DE ELEMENTOS DO DOM
const todoAddTask = document.querySelector("#form-add-task")
const todoTitleInputTask = document.querySelector("#todo-title-task")
const todoDescriptionInputTask = document.querySelector("#todo-description-task")
const btnCancelEditTask = document.querySelector('#todo-cancel-edit')
const btnSaveEditTask = document.querySelector('#todo-save-edit')
const inputSearch = document.querySelector('#input-search')
const filterSelect = document.querySelector('#filter-select')



// EVENTOS
    // EVENTO QUE ESCUTA SE O CONTEÚDO DA PÁGINA FOI CARREGADO

    btnCancelEditTask.addEventListener('click', toggleEditMode)
    btnSaveEditTask.addEventListener('click', ()=>{
        saveEditTask(dataFrame)
    })

    document.addEventListener("DOMContentLoaded", ()=>{
        getAlltask().then(data => {
            dataFrame = data.results
            setLocalStorage(JSON.stringify(dataFrame))
            renderTodo(dataFrame)
        })
    })

    // EVENTO PARA ESCUTAR O INPUT DE PESQUISA
    document.addEventListener('change', (element)=>{
        element.preventDefault()
        const elementChanged = element.target
        if (elementChanged.getAttribute('id') === 'filter-select'){
            searchTask(inputSearch.value, elementChanged.value)
        }
    })
    

    // EVENTO DE ESCUTA O SUBMIT DO FORMULÁRIO PARA ADICIONAR TASK
    todoAddTask.addEventListener("submit", (element)=>{
        element.preventDefault()
        const titleAddTask = todoTitleInputTask.value
        const descriptionAddTask = todoDescriptionInputTask.value

        if (titleAddTask && descriptionAddTask){
            saveDataTask(titleAddTask, descriptionAddTask, dataFrame)

            // LIMPAMOS OS INPUTS DE INSERIR TASK E COLOCAMOS O CURSOS NO CAMPO TITLE
            todoTitleInputTask.value = ''
            todoDescriptionInputTask.value = ''
            todoTitleInputTask.focus()
        }

    })

    // EVENTO QUE ESCUTA O BOTÃO DE CONTROLE "FINISH-TODO"
    document.addEventListener('click', (element) => {
        // PEGANDO O ELEMENTO CLICADO
        const btnClicked = element.target
        
        // IDENTIFICANDO O ID DA ELEMENTO
        let id
        for (let char of btnClicked.id){
            id = parseInt(char)
        }

        // VERIFICANDO SE O ID DO BOTÃO É "erase-search"
        if (btnClicked.getAttribute('id') === 'erase-search'){
            // IMPEDINDO O RECARREGAMENTO DA PÁGINA
            element.preventDefault()
            // RECUPERANDO OS DADOS DOS INPUTS [SEARCH E FILTER SELECT]
            searchTask(inputSearch.value, filterSelect.value)
        }

        // VERIFICANDO SE O ELEMENTO CLICADO É O BOTÃO DE FINALIZAR A TASK
        if (btnClicked.classList.contains('finish-todo')){
            // FUNÇÃO PARA MUDAR O VALOR DO STATUS
            dataFrame.forEach(task => {
                if (task.code === id) {
                    // SE O VALOR DO CAMPO STATUS FOR IGUAL A "DONE", DEVE SER ALTERADO PARA "TO-DO"
                    if (task.status === 'done'){
                        task.status = 'todo'                       
                    }
                    // DO CONTRÁRIO DEVE INSERIR O VALOR "DONE" NO CAMPO STATUS
                    else {
                        // ALTERANDO O STATUS DA TASK
                        task.status = 'done'
                    }
                    putTask(task, task.objectId)
                    renderTodo(dataFrame)
                    setLocalStorage(JSON.stringify(dataFrame))
                }
            })
        }

        // VERIFICANDO SE O ELEMENTO CLICADO É O BOTÃO DE EDITAR
        if (btnClicked.classList.contains('edit-todo')){
            toggleEditMode()
            openEditMode(dataFrame, id)
        }
        

        // VERIFICANDO SE O ELEMENTO CLICADO É O BOTÃO DE DELETAR
        if (btnClicked.classList.contains('delete-todo')){
            if (dataFrame.length === 0){
                alert("Não existe nenhuma tarefa registrada!!!")
            } else {
                for (let i = 0; i < dataFrame.length; i++ ){
                    if ( dataFrame[i].code === id){
                        deleteTask(dataFrame[i].objectId)
                        dataFrame.splice(i, 1)
                    }                         
                }                    
            }
            setLocalStorage(JSON.stringify(dataFrame))
            renderTodo(dataFrame)
        }
    })


export { dataFrame as default, back4app }