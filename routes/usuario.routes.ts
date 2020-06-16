import { verificaToken } from './../middlewares/authentication';
import { Router, Request, Response } from 'express';
import { Usuario } from '../models/usuario.models';
import bcrypt from 'bcrypt';
import Token from '../classes/token';

const userRoutes = Router();

// userRoutes.get('/prueba', (req: Request, res: Response) => {
//   res.json({ ok: true, mensaje: 'Todo funciona Bien!!' });
// });

//Login
userRoutes.post('/login', (req: Request, res: Response) => {
  const body = req.body;

  Usuario.findOne({ email: body.email }, (error, userDB) => {
    if (error) throw error;

    if (!userDB) {
      return res.json({
        ok: false,
        mensaje: 'Usuario/constraseña no son correctas',
      });
    }

    if (userDB.comparaPassword(body.password)) {
      const newToken = Token.getJwtToken({
        _id: userDB._id,
        nombre: userDB.nombre,
        email: userDB.email,
        avatar: userDB.avatar,
      });

      res.json({
        ok: true,
        token: newToken,
      });
    } else {
      return res.json({
        ok: false,
        mensaje: 'Usuario/constraseña no son correctas ****',
      });
    }
  });
});

// Crear Usuarios
userRoutes.post('/create', (req: Request, res: Response) => {
  const user = {
    nombre: req.body.nombre,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    avatar: req.body.avatar,
  };

  Usuario.create(user)
    .then((userDB: any) => {
      const newToken = Token.getJwtToken({
        _id: userDB._id,
        nombre: userDB.nombre,
        email: userDB.email,
        avatar: userDB.avatar,
      });

      res.json({
        ok: true,
        token: newToken,
      });
    })
    .catch((err) => {
      res.json({
        ok: false,
        err,
      });
    });
});

//Actualizar usuario
userRoutes.post('/update', verificaToken, (req: any, res: Response) => {
  const body = req.body;
  console.log('bodyUpdate', body);
  const user = {
    nombre: body.nombre,
    email: body.email,
    avatar: body.avatar,
  };

  Usuario.findByIdAndUpdate(
    req.usuario._id,
    user,
    { new: true },
    (err, userDB) => {
      if (err) throw err;

      if (!userDB) {
        return res.json({
          ok: false,
          mensaje: 'No existe usuario con ese id',
        });
      }

      // como se modifico el usuario se debe generar un nuevo token con los datos actualizados
      const newToken = Token.getJwtToken({
        _id: userDB._id,
        nombre: userDB.nombre || req.usuario.nombre,
        email: userDB.email || req.usuario.email,
        avatar: userDB.avatar || req.usuario.avatar,
      });

      res.json({
        ok: true,
        token: newToken,
      });
    }
  );
});

export default userRoutes;
