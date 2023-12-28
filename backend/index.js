const express = require('express')
require("dotenv").config()
const cors = require('cors')
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))


const PetRoutes = require('./routes/PetRoutes')
const UserRoutes = require('./routes/UserRoutes')
app.use('/pets', PetRoutes)
app.use('/users', UserRoutes)

app.listen(process.env.SERVER, ()=> console.log("Server running port:" + process.env.SERVER))
 