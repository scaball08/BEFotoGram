import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario'],
  },
  avatar: {
    type: String,
    default: 'av-1.png',
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es necesario'],
  },
  password: {
    type: String,
    required: [true, 'La Contrasenia es obligatoria'],
  },
});

usuarioSchema.method('comparaPassword', function (
  password: string = ''
): boolean {
  // para quitar error con this  ir al archivo tsconfig.json
  // descomentar y colocarla en false la propiedad 'noImplicitThis'
  if (bcrypt.compareSync(password, this.password)) {
    return true;
  } else {
    return false;
  }
});

// se crea una interface para que el modelo  tenga un tipado extendiendo de Document
interface IUsuario extends Document {
  nombre: string;
  email: string;
  password: string;
  avatar?: string;

  comparaPassword(password: string): boolean;
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);
