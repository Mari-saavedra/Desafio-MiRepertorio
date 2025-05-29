import express from 'express'
import 'dotenv/config'
import fs from 'fs'
import crypto from 'crypto'
import path from 'path'

const filePath = path.resolve('frontend/index.html')

const app = express()
const PORT = process.env.PORT ?? 3000
app.use(express.json())

app.listen(PORT, console.log(`Server: http://localhost:${PORT}`))

app.get('/', (req, res) => {
  res.sendFile(filePath)
})

// Leer el repertorio
app.get('/canciones', (req, res) => {
  try {
    const repertorio = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'))
    res.json(repertorio)
  } catch (error) {
    console.error('Error al leer el repertorio', error)
  }
})

// Registrar una cancion en el repertorio
app.post('/canciones', (req, res) => {
  try {
    const { titulo, artista, tono } = req.body

    const data = fs.readFileSync('repertorio.json', 'utf8')
    const repertorio = JSON.parse(data)

    if (!titulo || !artista || !tono) {
      console.log('Por favor ingrese todos los datos')
      return
    }

    const id = crypto.randomUUID()

    repertorio.push({ id, titulo, artista, tono })

    fs.writeFileSync('repertorio.json', JSON.stringify(repertorio))
    res.send('Se agrego cancion al repertorio')
  } catch (error) {
    console.error('Error al registrar cancion', error)
  }
})

// Actualizar una cancion del repertorio
app.put('/canciones/:id', (req, res) => {
  try {
    const { id } = req.params
    const { titulo, artista, tono } = req.body

    const data = fs.readFileSync('repertorio.json', 'utf8')
    const repertorio = JSON.parse(data || '[]')

    const index = repertorio.findIndex(e => e.id === id)

    if (index === -1) {
      console.error('Error: ID no encontrado')
      return
    }

    const nuevoRepertorio = repertorio.map(e => e.id === id ? { id, titulo, artista, tono } : e)
    fs.writeFileSync('repertorio.json', JSON.stringify(nuevoRepertorio))
    res.json(nuevoRepertorio)

    console.log('Actualizacion exitosa:', nuevoRepertorio)
  } catch (error) {
    console.log('Error al actualizar', error)
  }
})

// Borrar una cancion del repertorio
app.delete('/canciones/:id', (req, res) => {
  try {
    const { id } = req.params

    const data = fs.readFileSync('repertorio.json', 'utf8')
    const repertorio = JSON.parse(data || '[]')

    const index = repertorio.findIndex(e => e.id === id)

    if (index === -1) {
      console.error('Error: ID no encontrado')
      return
    }

    repertorio.splice(index, 1)
    fs.writeFileSync('repertorio.json', JSON.stringify(repertorio))
    res.json(repertorio)

    console.log('Borrado exitoso:', repertorio)
  } catch (error) {
    console.log('Error al borrar', error)
  }
})
