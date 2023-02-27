const express = require('express')
const app = express()
require('./config/db')

// Port 3000
const PORT = process.env.PORT || 3000

const session = require('express-session')
const passport = require('./lib/passportConfig')
const flash = require('express-flash')


//middleware
app.use(flash())

// session
app.use(session({
    secret: process.env.KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        maxAge: 259200
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
    res.locals = { user: req.user }
    next()
})

//static folder
app.use(express.static('public'))
//node.js to look in a folder 
app.set('view engine', 'ejs')
// initialisation Express layouts
const expressLayouts = require('express-ejs-layouts')
// look into views folder for a file with name layout.ejs
app.use(expressLayouts)
app.use(express.urlencoded({ extended: true }))


// import routes
const indexRouter = require('./routers/index')
const authRouter = require('./routers/auth')
const reviewRouter = require('./routers/review')
const userRouter = require('./routers/user')
const itemRouter = require('./routers/item')
const paymentRouter = require('./routers/payment')

//Mount Routes
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/review', reviewRouter)
app.use('/user', userRouter)
app.use('/item', itemRouter)
app.use('/payment', paymentRouter)


app.listen(PORT, () => console.log('server [RnB] is on', PORT))