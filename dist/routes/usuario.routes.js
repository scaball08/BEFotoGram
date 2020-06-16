"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../middlewares/authentication");
const express_1 = require("express");
const usuario_models_1 = require("../models/usuario.models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const userRoutes = express_1.Router();
// userRoutes.get('/prueba', (req: Request, res: Response) => {
//   res.json({ ok: true, mensaje: 'Todo funciona Bien!!' });
// });
//Login
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    usuario_models_1.Usuario.findOne({ email: body.email }, (error, userDB) => {
        if (error)
            throw error;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/constraseña no son correctas',
            });
        }
        if (userDB.comparaPassword(body.password)) {
            const newToken = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar,
            });
            res.json({
                ok: true,
                token: newToken,
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/constraseña no son correctas ****',
            });
        }
    });
});
// Crear Usuarios
userRoutes.post('/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar,
    };
    usuario_models_1.Usuario.create(user)
        .then((userDB) => {
        const newToken = token_1.default.getJwtToken({
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
userRoutes.post('/update', authentication_1.verificaToken, (req, res) => {
    const body = req.body;
    console.log('bodyUpdate', body);
    const user = {
        nombre: body.nombre,
        email: body.email,
        avatar: body.avatar,
    };
    usuario_models_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe usuario con ese id',
            });
        }
        // como se modifico el usuario se debe generar un nuevo token con los datos actualizados
        const newToken = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre || req.usuario.nombre,
            email: userDB.email || req.usuario.email,
            avatar: userDB.avatar || req.usuario.avatar,
        });
        res.json({
            ok: true,
            token: newToken,
        });
    });
});
exports.default = userRoutes;
