const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.DB_URI

console.log("Connecting to database...")
mongoose.connect(url, {family: 4})
.then(() => {
    console.log("Database Connected Successfully")
})
.catch((err) => {
    console.log("Database Connection Unsuccessful:", err.message)
})

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)