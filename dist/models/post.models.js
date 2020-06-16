"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
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
        type: String,
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'debe de Existir una referencia a un usuario'],
    },
});
// tipo de middleware para realizar la creacion de la fecha antes de guardar
postSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Post = mongoose_1.model('Post', postSchema);
