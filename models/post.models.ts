import { Schema, Document, model } from 'mongoose';
import { Usuario } from './usuario.models';

const postSchema = new Schema({
  created: {
    type: Date,
  },
  mensaje: {
    type: String,
  },
  imgs: [
    {
      type: String,
    },
  ],
  coords: {
    type: String, //  -13.543241231321, 12.3465451321
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'debe de Existir una referencia a un usuario'],
  },
});

// tipo de middleware para realizar la creacion de la fecha antes de guardar
postSchema.pre<IPost>('save', function (next) {
  this.created = new Date();
  next();
});

interface IPost extends Document {
  created: Date;
  mensaje: string;
  imgs: string[];
  coords: string;
  usuario: any;
}

export const Post = model<IPost>('Post', postSchema);
