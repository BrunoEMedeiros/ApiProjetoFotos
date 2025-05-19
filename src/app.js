import express from 'express'
import cors from 'cors'
import routes from './routes.js'
import fileUpload from 'express-fileupload';

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(routes)

app.listen(3000, ()=>{
    console.log('Api no ar!')
})