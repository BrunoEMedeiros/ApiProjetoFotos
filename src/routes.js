import express from 'express'
import sql from './database.js'
import { CompararHash, CriarHash } from './utils.js';

const routes = express.Router()

routes.post('/login', async (req, res)=>{
    try {
        const {email, senha} = req.body;

        const usuario = await sql`select 
        id_user, senha, funcao from Users 
        where email = ${email} and status = 1`

        if(usuario.length == 0){
            return res.status(401).json(`Usuario ou 
                senha incorretos`)
        }

        const teste = await CompararHash(senha, 
            usuario[0].senha)

        if(teste){
            return res.status(200).json('Logado!')
        }
        else{
            return res.status(401).json('Usuario ou senha incorreta')
        }

    } 
    catch (error) {
        return res.status(500).json('Error in login')
     }
})

routes.post('/usuario', async (req, res) =>{
    try {
        const {email, senha} = req.body;

        const hash = await CriarHash(senha, 10)

        await sql`insert into Users(email, senha, funcao, status)
        values(${email},${hash},'padrao',1)`;

        return res.status(201).json('Ok')
    } 
    catch (error) { 
        console.log(error)
        return res.status(500).json('Error to create User')
    }
})

routes.post('/imagem', async (req, res) =>{
    try{
        await sql`insert into Imagens(name, mimetype, data) 
        values(${req.files.imagem.name}, ${req.files.imagem.mimetype}, ${req.files.imagem.data})`
        return res.status(201).json('ok')
    }
    catch(error){
        console.log(error)
        return res.status(500).json('Error at inserting')
    }
})

routes.get('/imagens', async (req, res) =>{
    try {
        const imagens = await sql`select * from Imagens`
        return res.status(200).json(imagens)
    } catch (error) {
        console.log(error)
        return res.status(500).json('Error at fetch images')
    }
})

export default routes