const notesRouter = require('express').Router()
const Note = require('../models/note')
const {response} = require("express");

// Fetch all notes.
notesRouter.get('/', (req, res) => {
    Note.find({}).then((notes) => res.json(notes))
})

// Fetch a single note by ID.
notesRouter.get('/:id', (req, res, next) => {
    Note.findById(req.params.id)
        .then((note) => {
            if (note) {
                res.json(note)
            }
            else{
                res.status(404).end()
            }
        })
        .catch((err) => {
            next(err)
        })
})

// Add a new note.
notesRouter.post('/', (req, res, next) => {
    const body = req.body
    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save()
        .then((note) => {
            res.json(note)
        })
        .catch((err) => {
            next(err)
        })
})

// Delete a note by ID.
notesRouter.delete('/:id', (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
    .then(() => {
        res.status(204).end()
    })
        .catch((err) => {
            next(err)
        })
})

// Update a note by ID.
notesRouter.put('/:id', (req, res, next) => {
    const {content, important} = req.body

    Note.findById(req.params.id)
        .then((note) => {
            if(!note) {
                return res.status(404).end()
            }
            note.content = content
            note.important = important

            return note.save()
                .then((note) => {
                    res.json(note)
                })

        })
        .catch((err) => {
            next(err)
        })
})

module.exports = notesRouter