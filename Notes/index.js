require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// Database
const Note = require('./models/note')

// // Notes
// let notes = [
//     {
//         id: "1",
//         content: "HTML is easy",
//         important: true
//     },
//     {
//         id: "2",
//         content: "Browser can execute only JavaScript",
//         important: false
//     },
//     {
//         id: "3",
//         content: "GET and POST are the most important methods of HTTP protocol",
//         important: true
//     }
// ]

// Landing page.
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// Get all notes.
app.get('/api/notes', (request, response) => {
    Note.find({}).then((notes) => response.json(notes))
})

// Get specific note by id.
app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id)
        .then((note) => {
            response.json(note)
        })
})

// Delete a note by id.
app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

// // Generate the next unique note id.
// const generateId = () =>{
//     const maxId = notes.length > 0 ?
//         Math.max(...notes.map(note => Number(note.id))) : 0
//     return String(maxId + 1)
// }

// Add a new note.
app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content){
        return response.status(400).json({
            error: 'Content is missing.'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(note => {
        response.json(note)
    })

})

