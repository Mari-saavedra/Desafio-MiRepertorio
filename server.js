import express from 'express'
import 'dotenv/config'
import { getHtml, getCanciones, postCanciones, putCanciones, deleteCanciones } from './src/controllers/canciones.controllers.js'

const app = express()
const PORT = process.env.PORT ?? 3000
app.use(express.json())
app.listen(PORT, console.log(`Server: http://localhost:${PORT}`))

app.get('/', getHtml)

// Leer el repertorio
app.get('/canciones', getCanciones)

// Registrar una cancion en el repertorio
app.post('/canciones', postCanciones)

// Actualizar una cancion del repertorio
app.put('/canciones/:id', putCanciones)

// Borrar una cancion del repertorio
app.delete('/canciones/:id', deleteCanciones)
