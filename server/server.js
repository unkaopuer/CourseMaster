require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const path = require('path')

const PORT = process.env.PORT
const CURRENT_WORKING_DIR = process.pwd()
console.log(process.env.NODE_ENV)

connectDB()

app.use('/dist',express.static(path.join(CURRENT_WORKING_DIR,'dist')))









mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB')
    app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))
})


mongoose.connection.on('error',err=>{
    throw new Error(`unable to connect to database: ${process.env.MONGODB_URI}`)
})
