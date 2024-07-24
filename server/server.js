require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser =require('cookie-parser')
const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const userRoutes = require('./routes/user.routes')
const authRoutes = require('./routes/auth.routes')
const enrollmentRoutes = require('./routes/enrollment.routes')
const courseRoutes = require('./routes/course.routes')

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

app.use('/assets',express.static(path.join(CURRENT_WORKING_DIR,'client/assets')))

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
