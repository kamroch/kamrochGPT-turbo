import express, { json } from 'express'
import cors from 'cors'
const PORT = 8000
require('dotenv').config()
const app = express()
app.use(json())
app.use(cors())
const API_KEY = process.env.REACT_APP_API_KEY

app.post('/completions',async (req, res) => {
    const options = {
        method : 'POST',
        headers :{
            "Authorization" : `Bearer ${API_KEY}`,
            "Content-Type" : "application/json"
        },
        body:JSON.stringify({
             model: "gpt-3.5-turbo",
             messages : [{ role : "user", content : req.body.message}],
             max_tokens: 3000,
        })
    }
    try {
       const response =  await fetch('https://api.openai.com/v1/chat/completions', options)
       const data = await response.json()
       res.send(data)
    }catch(error){
         console.error(error)
    }
})

app.listen(PORT, () => console.log('Your server is running on PORT' + PORT))