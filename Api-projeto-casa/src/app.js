const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/musica-brasileira", {
    useNewUrlParser: true,
    useUnifiedTopology: true,

})

let db = mongoose.connection

db.on("error", console.log.bind(console, "connection error"))
db.once("open", function() {
    console.log("conexao feita com sucesso")
})

const app = express()

const musicRoute = require("../src/routes/musicRoutes.js")

app.use(cors())
app.use(express.json())
app.use("/", musicRoute)



module.exports = app
