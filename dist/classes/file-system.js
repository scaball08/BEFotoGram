"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystem = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    // nota: Se debe  retornar   como promesa ya que  nuestra funcion 'mv' funciona con callback
    // ose q donde llamemos a 'guardarImagenTemp' se llamara como otro
    //callback  y tendriamos un hell callback
    guardarImagenTemp(file, userId) {
        return new Promise((resolve, reject) => {
            //Crear Carpetas userId/temp
            const path = this.crearCarpetaUsuario(userId);
            //Nombre del Archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            console.log('nombreArchivo', nombreArchivo);
            // Mover archivo Temp del filesystem a muestra carpeta 'temp'
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    // no se pudo mover el archivo a 'tem'
                    reject(err);
                }
                else {
                    // Archivo movido con exito
                    resolve();
                }
            });
        });
    }
    generarNombreUnico(nombreOroginal) {
        const nombreArr = nombreOroginal.split('.');
        const ext = nombreArr[nombreArr.length - 1];
        // Usar package de node 'npm install uniqid'
        const idUnico = uniqid_1.default();
        return `${idUnico}.${ext}`;
    }
    crearCarpetaUsuario(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';
        // console.log(pathUser);
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    moverImgsTempAPost(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads', userId, 'posts');
        // validar si existe la carpeta 'temp'
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagenesTemp = this.obtenerImagenesEnTemp(userId);
        // recorremos  el arrray de imagenes para moverlas una a una
        imagenesTemp.forEach((imagen) => {
            // metodo 'renameSync(pathAnterior,nuevoPath)' para mover archivos de una ruta a otra
            fs_1.default.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`);
        });
        // envio mi array de imagenes par a posterior guardarlas en la DB
        return imagenesTemp;
    }
    obtenerImagenesEnTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getFotoUrl(userId, img) {
        // path POST
        const pathFoto = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        return pathFoto;
    }
}
exports.FileSystem = FileSystem;
