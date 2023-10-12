const express = require('express')
const app = express()
require("dotenv").config()
const cors = require('cors')
const bodyParser = require("body-parser")

app.use(bodyParser.json())
app.use(cors({ credentials: true, origin: process.env.PORT_FRONT }))
app.use(express.static('public'))


const PetRoutes = require('./routes/PetRoutes')
const UserRoutes = require('./routes/UserRoutes')
app.use('/pets', PetRoutes)
app.use('/users', UserRoutes)

app.listen(process.env.SERVER, ()=> console.log("Server running port:" + process.env.SERVER))
