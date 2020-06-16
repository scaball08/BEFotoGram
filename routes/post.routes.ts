import { Router, Request, Response } from 'express';
import { verificaToken } from '../middlewares/authentication';
import { Post } from '../models/post.models';
import { FileUpload } from '../interfaces/file-upload';
import { FileSystem } from '../classes/file-system';

const postRoutes = Router();

const fileSystem = new FileSystem();

// Obtener POST paginados
postRoutes.get('/', async (req: any, res: Response) => {
  let pagina: number = Number(req.query.pagina) || 1;
  let skip = pagina - 1;
  let limite = 10;
  skip = skip * limite;

  const posts = await Post.find()
    .populate('usuario', '-password')
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limite)
    .exec();

  const countPages = await Post.countDocuments();

  res.json({
    ok: true,
    pagina,
    totalPaginas: Math.ceil(countPages / limite),
    posts,
  });
});

// Crear POST
postRoutes.post('/', [verificaToken], (req: any, res: Response) => {
  const body = req.body;

  body.usuario = req.usuario._id;

  const imagenes = fileSystem.moverImgsTempAPost(req.usuario._id);

  body.imgs = imagenes;

  Post.create(body)
    .then(async (postDB) => {
      //carga la relacion o referencia que tenemos en nuestro model post con lo datos faltantes
      await postDB.populate('usuario', '-password').execPopulate();
      res.json({
        ok: true,
        post: postDB,
      });
    })
    .catch((err) => {
      res.json({
        ok: false,
        mensaje: 'Error  al hacer un post',
        err,
      });
    });
});

// Servicio para subir archivos
postRoutes.post('/upload', [verificaToken], async (req: any, res: Response) => {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: 'No se subio ningun archivo',
    });
  }

  const file: FileUpload = req.files.image;

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

  await fileSystem.guardarImagenTemp(file, req.usuario._id);
  res.json({
    ok: true,
    file: file.mimetype,
  });
});

postRoutes.get(
  '/imagen/:userid/:img',
  [verificaToken],
  (req: any, res: Response) => {
    const userId = req.params.userid;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl(userId, img);

    res.sendFile(pathFoto);
  }
);

export default postRoutes;
