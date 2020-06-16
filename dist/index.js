"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const server = new server_1.default();
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// FileUpload
// configurar :se deve enviar  un obj  con la propiedad 'useTempFiles'
//para que permita user los archivos tremporales del 'fs'
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
// Rutas de mi aplicacion
server.app.use('/user', usuario_routes_1.default);
server.app.use('/post', post_routes_1.default);
// conectar a Base de datos
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram', {
    useNewUrlParser: true,
    useCreateIndex: true,
}, (error) => {
    if (error)
        throw error;
    console.log('Base de Datos Online');
});
// levantar Express
server.start(() => {
    console.log(`Servidor corriendo en el puesto ${server.port}`);
});
