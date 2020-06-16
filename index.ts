import Server from './classes/server';
import userRoutes from './routes/usuario.routes';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import postRoutes from './routes/post.routes';

const server = new Server();

// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// FileUpload
// configurar :se deve enviar  un obj  con la propiedad 'useTempFiles'
//para que permita user los archivos tremporales del 'fs'
server.app.use(fileUpload({ useTempFiles: true }));

// Rutas de mi aplicacion
server.app.use('/user', userRoutes);
server.app.use('/post', postRoutes);

// conectar a Base de datos
mongoose.connect(
  'mongodb://localhost:27017/fotosgram',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  (error) => {
    if (error) throw error;
    console.log('Base de Datos Online');
  }
);

// levantar Express
server.start(() => {
  console.log(`Servidor corriendo en el puesto ${server.port}`);
});
