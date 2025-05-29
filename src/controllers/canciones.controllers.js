import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

// enviamos al front
const filePath = path.resolve('frontend/index.html')

const getHtml = (req, res) => {
  res.sendFile(filePath)
}

// Leer el repertorio
const getCanciones = (req, res) => {
  try {
    const repertorio = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'))
    res.json(repertorio)
  } catch (error) {
    console.error('Error al leer el repertorio', error)
  }
}

// Registrar una cancion en el repertorio
const postCanciones = (req, res) => {
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
    console.log('Se agrego cancion al repertorio')
    res.send('Se agrego cancion al repertorio')
  } catch (error) {
    console.error('Error al agregar cancion al repertorio', error)
  }
}

// Actualizar una cancion del repertorio
const putCanciones = (req, res) => {
  try {
    const { id } = req.params
    const { titulo, artista, tono } = req.body

    const data = fs.readFileSync('repertorio.json', 'utf8')
    const repertorio = JSON.parse(data || '[]')

    const index = repertorio.findIndex(e => e.id === id)

    if (index === -1) {
      console.error('Error al actualizar: ID no encontrado')
      return
    }

    const nuevoRepertorio = repertorio.map(e => e.id === id ? { id, titulo, artista, tono } : e)
    fs.writeFileSync('repertorio.json', JSON.stringify(nuevoRepertorio))
    res.json(nuevoRepertorio)

    console.log('Actualizacion exitosa:', nuevoRepertorio)
  } catch (error) {
    console.log('Error al actualizar: ', error)
  }
}

// Borrar una cancion del repertorio
const deleteCanciones = (req, res) => {
  try {
    const { id } = req.params

    const data = fs.readFileSync('repertorio.json', 'utf8')
    const repertorio = JSON.parse(data || '[]')

    const index = repertorio.findIndex(e => e.id === id)

    if (index === -1) {
      console.error('Error al eliminar: ID no encontrado')
      return
    }

    repertorio.splice(index, 1)
    fs.writeFileSync('repertorio.json', JSON.stringify(repertorio))
    res.json(repertorio)

    console.log('Se elimino correctamente:', repertorio)
  } catch (error) {
    console.log('Error al eliminar: ', error)
  }
}

export { getHtml, getCanciones, postCanciones, putCanciones, deleteCanciones }
