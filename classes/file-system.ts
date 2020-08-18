import { FileUpload } from './../interfaces/file-upload';
import path from 'path';
import fs from 'fs';

import uniqid from 'uniqid';

export class FileSystem {
  constructor() {}

  // nota: Se debe  retornar   como promesa ya que  nuestra funcion 'mv' funciona con callback
  // ose q donde llamemos a 'guardarImagenTemp' se llamara como otro
  //callback  y tendriamos un hell callback
  guardarImagenTemp(file: FileUpload, userId: string) {
    return new Promise((resolve, reject) => {
      //Crear Carpetas userId/temp
      const path = this.crearCarpetaUsuario(userId);

      //Nombre del Archivo
      const nombreArchivo = this.generarNombreUnico(file.name);
      console.log('nombreArchivo', nombreArchivo);

      // Mover archivo Temp del filesystem a muestra carpeta 'temp'
      file.mv(`${path}/${nombreArchivo}`, (err: any) => {
        if (err) {
          // no se pudo mover el archivo a 'tem'
          reject(err);
        } else {
          // Archivo movido con exito
          resolve();
        }
      });
    });
  }

  private generarNombreUnico(nombreOroginal: string) {
    const nombreArr = nombreOroginal.split('.');

    const ext = nombreArr[nombreArr.length - 1];

    // Usar package de node 'npm install uniqid'
    const idUnico = uniqid();

    return `${idUnico}.${ext}`;
  }

  private crearCarpetaUsuario(userId: string) {
    const pathUser = path.resolve(__dirname, '../uploads', userId);
    const pathUserTemp = pathUser + '/temp';
    // console.log(pathUser);

    const existe = fs.existsSync(pathUser);

    if (!existe) {
      fs.mkdirSync(pathUser);
      fs.mkdirSync(pathUserTemp);
    }

    return pathUserTemp;
  }

  moverImgsTempAPost(userId: string) {
    const pathTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
    const pathPost = path.resolve(__dirname, '../uploads', userId, 'posts');

    // validar si existe la carpeta 'temp'
    if (!fs.existsSync(pathTemp)) {
      return [];
    }

    if (!fs.existsSync(pathPost)) {
      fs.mkdirSync(pathPost);
    }

    const imagenesTemp = this.obtenerImagenesEnTemp(userId);

    // recorremos  el arrray de imagenes para moverlas una a una
    imagenesTemp.forEach((imagen) => {
      // metodo 'renameSync(pathAnterior,nuevoPath)' para mover archivos de una ruta a otra
      fs.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`);
    });

    // envio mi array de imagenes par a posterior guardarlas en la DB
    return imagenesTemp;
  }

  private obtenerImagenesEnTemp(userId: string) {
    const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');

    return fs.readdirSync(pathTemp) || [];
  }

  getFotoUrl(userId: string, img: string) {
    // path POST
    const pathFoto = path.resolve(
      __dirname,
      '../uploads',
      userId,
      'posts',
      img
    );

    const existe = fs.existsSync(pathFoto);

    if(!existe){
      return path.resolve(__dirname,'../assets/400x250.jpg');
    }


    return pathFoto;
  }
}
