const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

// Custom body data token for POST requests.
morgan.token('body', function getBody (req) {
    // If the method is POST
    let data = ""
    if (req.method === 'POST') {
        data = JSON.stringify(req.body) // Get the body contents.
    }
    return data
})

app.use(morgan(':method :url :status :res[content-length] :response-time[2] ms - :body'))

// const requestLogger = (req, res, next) =>{
//     console.log("Method:", req.method)
//     console.log("Path:", req.path)
//     console.log("Body:", req.body)
//     console.log("---")
//     next()
// }
// app.use(requestLogger)


let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

// Get a list of all people.
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// Get info about the number of entries.
app.get('/info', (req, res) => {

    // Get the number of entries.
    const entryCount = persons.length
    const entries = entryCount > 0 ? `Phonebook has info for ${entryCount} people` : "Phonebook has no entries"
    // Get the time of the request.
    const timestamp = new Date()

    res.send(`<div><p>${entries}</p><p>${timestamp}</p></div>`)

})

// Find the person with a given id.
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find((person) => person.id === id)

    if (!person){
        return res.status(404).end('Person was not found.')
    }
    return res.json(person)
})

// Delete an entry.
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

// Generate a unique new id.
function generateId(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

// Add a new entry.
app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name){
        // If info is missing, send error.
        return res.status(404).end('Entry is missing a name.')
    }
    if (!body.number){
        return res.status(404).end('Entry is missing a number.')
    }
    // Check if the name already exists.
    if(persons.find((person) => person.name === body.name)){
        // Return error.
        return res.status(409).end('Person with this name already exists.')
    }
    // Create new entry.
    const person ={
        id : generateId(0, 200000000),
        name: body.name,
        number: body.number,
    }
    // Append.
    persons = persons.concat(person)
    res.json(person)
})

// Catch all.
const unknownEndpoint = (req, res) => {
    res.status(404).end('Unknown endpoint')
}
app.use(unknownEndpoint)