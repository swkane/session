const express = require('express')
const parseurl = require('parseurl')
const session = require('express-session')

let app = express()

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use((req, res, next) => {
    !req.session.views ? req.session.views = {} : null

    // get the url pathname
    let pathname = parseurl(req).pathname

    // count the views
    req.session.views[pathname] = (req.session.views[pathname] || 0 ) + 1

    next()
})

app.get('/foo', (req, res, next) => {
    console.log(req.session)
    res.send(`you viewed this page ${req.session.views['/foo']} times`)
})

app.get('/bar', (req, res, next) => {
    // console.log(req)
    res.send(`you viewed this page ${req.session.views['/bar']} times`)
})

app.get('/logout', (req, res, next) => {
    req.session.destroy( err => {
        err ? console.error(err) : console.log('session destroyed')
        res.send('You have successfully logged out')
    })
})

app.listen(3000, () => console.log('Session Server Running on http://localhost:3000'))