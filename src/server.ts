import express from 'express'
import router from './router'
import cors, { CorsOptions } from 'cors'
import swaggerUi from 'swagger-ui-express'
import morgan from 'morgan'

import swaggerSpec, { swaggerUIOptions } from './config/swagger'
import db from './config/db'
import { colors } from './config'

// Conectar a base de datos
export async function connectDB() {
    try {
        
        await db.authenticate()
        db.sync()
        // console.log( colors.blue( 'Conexión exitosa a la BD' ))

    } catch (error) {
        console.log(error);
        console.log( colors.red.white( 'Hubo error en la conexión a la BD' ))
    }
}

connectDB()

// Instancia de express
const server = express()

// Hablitar CORS
const corsOptions: CorsOptions = {
    origin: function( origin, callback ) {
        if ( origin === process.env.FRONTEND_URL ) { // Permitir conexión si es esa url
            callback( null, true )
        } else {
            console.log(process.env.FRONTEND_URL);
            
            callback( new Error('Error de cors') )

        }
    }
}
server.use(cors( corsOptions ))

// Leer datos de body - JSON
server.use( express.json() )

// Sistema de logs
server.use( morgan('dev') )

// Routing
server.use( '/api/products', router )

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup( swaggerSpec, swaggerUIOptions ) )

// server.get('/api', ( req, res ) => {
//     res.json({ msg: 'Desde API' })
// })

export default server