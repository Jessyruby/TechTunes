require('./config/db.js')

const app = require('express')()
const PORT = 3000

const cors = require('cors');

// Permitir todas as origens (cuidado em produção)
app.use(cors());

const UserRoutes = require('./api/User.js')

const bodyParser = require('express').json
app.use(bodyParser())

app.use('/user', UserRoutes)

app.listen(PORT, () => {
    console.log(`Escutando na porta ${PORT}`)
})
