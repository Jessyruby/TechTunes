require('./config/db.js')

const app = require('express')()
const PORT = 3000

const UserRoutes = require('./api/User.js')

const bodyParser = require('express').json
app.use(bodyParser())

app.use('/user', UserRoutes)

app.listen(PORT, () => {
    console.log(`Escutando na porta ${PORT}`)
})
