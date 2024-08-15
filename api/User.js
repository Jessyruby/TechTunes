const express = require('express')
const { startSession } = require('mongoose')
const router = express.Router()

const User = require('../models/User')

const bcrypt = require('bcrypt')


//SignUp
router.post('/signup', (req, res) => {
    let {name, email, password, passwordConfirm} = req.body

    name = name.trim()
    email = email.trim()
    password = password.trim()
    passwordConfirm = passwordConfirm.trim()

    if (name == "" || email == "" || password == "" || passwordConfirm == "") {
        res.json({
            status: "FAILED",
            message: "Campos de entrada vazios!"
        })
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Nome Invalido!"
        })

    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Email Invalido!"
        })

    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "A senha precisa ter no minimo 8 caracteres."
        })

    } else if (passwordConfirm !== password) {
        res.json({
            status: "FAILED",
            message: "As senhas não são iguais"
        })

    } else {

        User.find({email}).then( result => {

            if(result.length) {
                res.json({
                    status: "FAILED",
                    message: "usuário com o e-mail fornecido já existe"
                })

            } else {


                //password handling

                const saltRounds = 10

                bcrypt.hash(password, saltRounds).then( hashedPassword => {

                    const newUser = new User({

                        name,
                        email,
                        password: hashedPassword,
                        passwordConfirm: hashedPassword
                    })

                    newUser.save().then( result => {

                        res.json({
                            status: "SUCCESS",
                            message: "Cadastrado com sucesso!",
                            data: result
                        })
                        
                    }).catch( err => {
                        
                        console.log(err)
                        res.json({
                            status: "FAILED",
                            message: "Ocorreu um erro ao salvar a conta do usuário!"
                        })
                    })

                }).catch( err => {
                        
                        console.log(err)
                        res.json({
                            status: "FAILED",
                            message: "Ocorreu um erro ao fazer o hash da senha!"
                        })
                    })
            }

        }).catch( err => {
            
            console.log(err)
            res.json({
                status: "FAILED",
                message: "ocorreu um erro durante a verificação do usuário existente!"
            })
        })

    }
})

//SignIn
router.post('/signin', (req, res) => {

    let {email, password} = req.body

    email = email.trim()
    password = password.trim()

    if(email == "" || password == "") {

            res.json({
                status: "FAILED",
                message: "Campos de entrada vazios!"
            })

    } else {

        User.find({email}).then( data => {

            const hashedPassword = data[0].password

            bcrypt.compare(password, hashedPassword).then( result => {

                if(result) {
                    res.json({
                        status: "SUCCESS",
                        message: "Sucesso ao entrar!",
                        data: data
                    })

                } else {
                    res.json({
                        status: "FAILED",
                        message: "Senha invalida!",
                        data: data
                    })
                }
            }).catch( err => {

                console.log(err)
                res.json({
                    status: "FAILED",
                    message: "Ocorreu erro ao comparar as senhas!"
                })
            })

        }).catch( err => {

            console.log(err)
            res.json({
                status: "FAILED",
                message: "ocorreu um erro durante a verificação do usuário existente!"
            })
        })
    }

})

module.exports = router