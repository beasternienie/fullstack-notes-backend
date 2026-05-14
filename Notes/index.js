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

// Landing page.
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// Get all notes.
app.get('/api/notes', (request, response) => {
    Note.find({}).then((notes) => response.json(notes))
})

// Get specific note by id.
app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then((note) => {
            if(note){
                response.json(note)
            }
            else{
                response.status(404).end()
            }
        })
        .catch((err) => {
            next(err)
        })
})

// Delete a note by id.
app.delete('/api/notes/:id', (request, response, next) => {

    Note.findByIdAndDelete(request.params.id)
        .then((result) =>{
            response.status(204).end()
        })
        .catch((err) => {
            next(err)
        })

})

// Add a new note.
app.post('/api/notes', (request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save()
        .then(note => {
            response.json(note)
        })
        .catch((err) => {
            next(err)
        })

})

// Update a note.
app.put('/api/notes/:id', (request, response, next) => {

    const {content, important} = request.body
    Note.findById(request.params.id)
        .then((note) => {
            if(!note){
                return response.status(404).end()
            }

            note.content = content
            note.important = important

            return note.save().then(note => {response.json(note)})

        })
        .catch((err) => {
            next(err)
        })

})

// Error handling.
const errorHandler = (err, req, res, next) => {
    console.error(err.message)
    if (err.name === 'CastError'){
        return res.status(400).send({ error: 'ID is malformed.'})
    }
    if (err.name === 'ValidationError'){
        return res.status(400).json({ error: err.message})
    }

    next(err)
}

app.use(errorHandler)

