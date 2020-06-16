"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middlewares/authentication");
const post_models_1 = require("../models/post.models");
const file_system_1 = require("../classes/file-system");
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.FileSystem();
// Obtener POST paginados
postRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    let limite = 10;
    skip = skip * limite;
    const posts = yield post_models_1.Post.find()
        .populate('usuario', '-password')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .exec();
    const countPages = yield post_models_1.Post.countDocuments();
    res.json({
        ok: true,
        pagina,
        totalPaginas: Math.ceil(countPages / limite),
        posts,
    });
}));
// Crear POST
postRoutes.post('/', [authentication_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    const imagenes = fileSystem.moverImgsTempAPost(req.usuario._id);
    body.imgs = imagenes;
    post_models_1.Post.create(body)
        .then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        //carga la relacion o referencia que tenemos en nuestro model post con lo datos faltantes
        yield postDB.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDB,
        });
    }))
        .catch((err) => {
        res.json({
            ok: false,
            mensaje: 'Error  al hacer un post',
            err,
        });
    });
});
// Servicio para subir archivos
postRoutes.post('/upload', [authentication_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo',
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(404).json({
            ok: false,
            mensaje: 'No  se subio inguna - Imagen',
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subio no es de tipo imagen',
        });
    }
    yield fileSystem.guardarImagenTemp(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype,
    });
}));
postRoutes.get('/imagen/:userid/:img', [authentication_1.verificaToken], (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
exports.default = postRoutes;
