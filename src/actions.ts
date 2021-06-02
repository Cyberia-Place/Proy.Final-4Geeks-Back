import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Exception } from './utils'
import { Usuario } from './entities/Usuario';
import jwt from 'jsonwebtoken';

export const signUp = async (request: Request, response: Response): Promise<Response> => {
    // Validar datos ingresados
    if(!request.body.email) throw new Exception('Falta la propiedad email en el body');
    if(!request.body.contrasenia) throw new Exception('Falta la propiedad contrasenia en el body');
    if(!request.body.nombre) throw new Exception('Falta la propiedad nombre en el body');
    if(!request.body.apellido) throw new Exception('Falta la propiedad apellido en el body');

    // Validar email unico
    let usuario = await getRepository(Usuario).findOne({
        where: { email: request.body.email }
    });
    if(usuario) throw new Exception('Ya existe un usuario con ese email');

    // Se crea la nueva instancia de usuario
    usuario = getRepository(Usuario).create({
        email: request.body.email,
        contrasenia: request.body.contrasenia,
        nombre: request.body.nombre,
        apellido: request.body.apellido
    });

    let result = await getRepository(Usuario).save(usuario);

    return response.json(result);
}

export const logIn = async (request: Request, response: Response): Promise<Response> => {
    // Validar datos ingresados
    if(!request.body.email) throw new Exception('Falta la propiedad email en el body');
    if(!request.body.contrasenia) throw new Exception('Falta la propiedad contrasenia en el body');

    // Verificar que existe un usuario con la password y el email
    let usuario = await getRepository(Usuario).findOne({
        select: ['email', 'nombre', 'apellido'] ,
        where: { email: request.body.email, contrasenia: request.body.contrasenia }
    });
    if(!usuario) throw new Exception('Email o contraseña incorrectos');
    
    // Genero un token con la firma del usuario
    let token = jwt.sign({ usuario }, process.env.JWT_KEY as string, { expiresIn: '1day' });

    let expires = new Date();
    expires.setDate(expires.getDate() + 1);
    expires.setHours(expires.getHours() - 3);

    return response.json({usuario , token, expires});
}