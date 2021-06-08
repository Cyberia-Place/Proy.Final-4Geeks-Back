import { Request, Response } from 'express'
import { getRepository, MoreThanOrEqual } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Exception } from './utils'
import { Usuario } from './entities/Usuario';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Categoria } from './entities/Categoria';
import { Clase } from './entities/Clase';
import validator from 'validator';

export const signUp = async (request: Request, response: Response): Promise<Response> => {
    // Validar datos ingresados
    if (!request.body.email) throw new Exception('Falta la propiedad email en el body');
    if (!request.body.contrasenia) throw new Exception('Falta la propiedad contrasenia en el body');
    if (!request.body.nombre) throw new Exception('Falta la propiedad nombre en el body');

    // Validar email unico
    let usuario = await getRepository(Usuario).findOne({
        where: { email: request.body.email }
    });
    if (usuario) throw new Exception('Ya existe un usuario con ese email');

    // Hash de password
    let salt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(request.body.contrasenia, salt);

    // Se crea la nueva instancia de usuario
    usuario = getRepository(Usuario).create({
        email: request.body.email,
        contrasenia: hashedPassword,
        nombre: request.body.nombre,
    });

    let result = await getRepository(Usuario).save(usuario);

    return response.json(result);
}

export const logIn = async (request: Request, response: Response): Promise<Response> => {
    // Validar datos ingresados
    if (!request.body.email) throw new Exception('Falta la propiedad email en el body');
    if (!request.body.contrasenia) throw new Exception('Falta la propiedad contrasenia en el body');

    // Verificar que existe un usuario con la password y el email
    let usuario = await getRepository(Usuario).findOne({
        where: { email: request.body.email }
    });
    if (!usuario) throw new Exception('No existe un usuario con el email ingresado');

    // Valido la contraseña del usuario
    if (! await bcrypt.compare(request.body.contrasenia, usuario.contrasenia)) throw new Exception('Contraseña incorrecta');

    // Genero un token con la firma del usuario
    let payLoad = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
    }
    let token = jwt.sign({ usuario: payLoad }, process.env.JWT_KEY as string, { expiresIn: '1day' });

    // Agrego fexha de expiracion
    let expires = new Date();
    expires.setDate(expires.getDate() + 1);
    expires.setHours(expires.getHours() - 3);

    return response.json({ usuario: payLoad, token, expires });
}

export const profile = async (request: Request, response: Response): Promise<Response> => {
    let usuario = await getRepository(Usuario).findOne({
        select: ['id', 'email', 'nombre', 'imagen', 'pais', 'edad', 'descripcion', 'idioma', 'ocupacion'],
        where: { id: request.body.usuario.id }
    });

    if (!usuario) throw new Exception('No se encontro el usuario');

    return response.json(usuario);
}

export const updateProfile = async (request: Request, response: Response): Promise<Response> => {
    if (request.body.nombre) await getRepository(Usuario).update(request.body.usuario.id, { nombre: request.body.nombre });

    if (request.body.imagen) await getRepository(Usuario).update(request.body.usuario.id, { imagen: request.body.imagen });

    if (request.body.pais) await getRepository(Usuario).update(request.body.usuario.id, { pais: request.body.pais });

    if (request.body.descripcion) await getRepository(Usuario).update(request.body.usuario.id, { descripcion: request.body.descripcion });

    if (request.body.edad) await getRepository(Usuario).update(request.body.usuario.id, { edad: request.body.edad });

    if (request.body.idioma) await getRepository(Usuario).update(request.body.usuario.id, { idioma: request.body.idioma });

    if (request.body.ocupacion) await getRepository(Usuario).update(request.body.usuario.id, { ocupacion: request.body.ocupacion });

    return response.json({ msg: "usuario actualizado" });
}

export const updatePassword = async (request: Request, response: Response): Promise<Response> => {
    if (!request.body.contraseniaPrevia) throw new Exception('Falta la propiedad contrasenia previa en el body');
    if (!request.body.contraseniaNueva) throw new Exception('Falta la propiedad contrasenia nueva en el body');

    let usuario = await getRepository(Usuario).findOne(request.body.usuario.id);

    if (!usuario) throw new Exception('No existe usuario');

    if (! await bcrypt.compare(request.body.contraseniaPrevia, usuario.contrasenia)) throw new Exception('Contraseña incorrecta');

    // Hash de nueva contraseña
    let salt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(request.body.contraseniaNueva, salt);

    // Actualizo contraseña
    usuario.contrasenia = hashedPassword;
    let result = await getRepository(Usuario).save(usuario);

    return response.json(result);
}

export const getCategories = async (request: Request, response: Response): Promise<Response> => {
    let categories = await getRepository(Categoria).find();

    return response.json(categories);
}

export const createCategory = async (request: Request, response: Response): Promise<Response> => {
    if (!request.body.nombre) throw new Exception('Falta la propiedad nombre de la categoria');
    if (!request.body.descripcion) throw new Exception('Falta la propiedad descripcion de la categoria');

    let category = await getRepository(Categoria).findOne({
        where: { nombre: request.body.nombre }
    });

    if (category) throw new Exception('Ya hay una categoria con el nombre ingresado');

    let newCat = getRepository(Categoria).create(request.body);
    let result = await getRepository(Categoria).save(newCat);

    return response.json(result);
}

export const getClasses = async (request: Request, response: Response): Promise<Response> => {
    let result = await getRepository(Clase).find({
        where: { fecha: MoreThanOrEqual(new Date()) },
        relations: ['profesor']
    });

    return response.json(result);
}

export const createClass = async (request: Request, response: Response): Promise<Response> => {
    // Validate data
    if (!request.body.nombre) throw new Exception('Falta la propiedad nombre de la clase');
    if (!request.body.fecha) throw new Exception('Falta la propiedad fecha de la clase');

    // Validate Date
    let timestamp = Date.parse(request.body.fecha);
    if (isNaN(timestamp)) throw new Exception('Fecha invalida');

    let fecha = new Date(timestamp);

    if (fecha.getTime() < new Date().getTime()) throw new Exception('La Fecha ingresada debe ser posterior a la fecha actual');

    // Validate duracion
    if (!request.body.duracion) throw new Exception('Falta la propiedad duracion de la clase');
    if (!validator.isNumeric(request.body.duracion)) throw new Exception('Duracion invalida');

    // Validate categorias
    if (!request.body.categorias) throw new Exception('Falta la propiedad categorias de la clase');
    if (request.body.categorias.length === 0) throw new Exception('Se debe seleccionar al menos una categoria para la clase');

    let categories: Categoria[] = [];
    for(let i = 0; i < request.body.categorias.length; i++) {
        let cat = await getRepository(Categoria).findOne({
            where: { nombre: request.body.categorias[i] }
        });
        if(cat) categories.push(cat);
    };

    if (categories.length === 0) throw new Exception('Debe haber al menos una ctegoria valida');

    let profesor = await getRepository(Usuario).findOne(request.body.usuario.id);

    let newClass = getRepository(Clase).create({
        nombre: request.body.nombre,
        fecha: fecha,
        duracion: request.body.duracion,
        categorias: categories,
        profesor: profesor
    });

    let result = await getRepository(Clase).save(newClass);

    return response.json(result);
}