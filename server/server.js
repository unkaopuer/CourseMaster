require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser =require('cookie-parser')
const compress = require('compression')
const cors = require('cors')


const PORT = process.env.PORT
const CURRENT_WORKING_DIR = process.cwd()
console.log(process.env.NODE_ENV)

connectDB()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(compress())
app.use(helmet())
app.use(cors())

app.use('/dist',express.static(path.join(CURRENT_WORKING_DIR,'dist')))

app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', courseRoutes)
app.use('/', enrollmentRoutes)


/*Catch unauthorised errors */
app.use((err,req,res,next) =>{
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({"error":err.name + ":" + err.message})
    } else if(err){
        res.status(400).json({"error":err.name + ":" + err.message})
        console.log(err)
    }
})



mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB')
    app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))
})


mongoose.connection.on('error',err=>{
    throw new Error(`unable to connect to database: ${process.env.MONGODB_URI}`)
})
