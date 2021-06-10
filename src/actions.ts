import { Request, Response } from 'express'
import { getRepository, MoreThanOrEqual, MoreThan } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Exception } from './utils'
import { Usuario } from './entities/Usuario';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Categoria } from './entities/Categoria';
import { Clase } from './entities/Clase';
import validator from 'validator';
import moment from 'moment';
import { Inscripcion } from './entities/Inscripcion';
import { Valoracion } from './entities/Valoracion';

let formatTime = 'LT';
let formatDate = 'YYYY-MM-DD';

export const signUp = async (request: Request, response: Response): Promise<Response> => {
    // Validar datos ingresados
    if (!request.body.email) throw new Exception('Falta la propiedad email en el body');
    if (!validator.isEmail(request.body.email)) throw new Exception('Email invalido');
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
    if (!validator.isEmail(request.body.email)) throw new Exception('Email invalido');
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
        email: usuario.email,
        imagen: usuario.imagen
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
    let clases = await getRepository(Clase).find({
        where: { fecha: MoreThan(moment().format(formatDate)) },
        relations: ['profesor', 'categorias']
    });

    let result = [];
    for (let i = 0; i < clases.length; i++) {
        result.push({
            id: clases[i].id,
            hora_inicio: clases[i].hora_inicio,
            hora_fin: clases[i].hora_fin,
            fecha: clases[i].fecha,
            nombre: clases[i].nombre,
            categorias: clases[i].categorias,
            profesor: {
                id: clases[i].profesor.id,
                email: clases[i].profesor.email,
                nombre: clases[i].profesor.nombre,
                imagen: clases[i].profesor.imagen
            }
        });
    }

    return response.json(result);
}

export const getClassesFiltered = async (request: Request, response: Response): Promise<Response> => {
    let compareDay = moment().add(1, 'day');
    if (request.query.week_day && typeof request.query.week_day == 'string') {
        let week_day = parseInt(request.query.week_day);
        if (moment().isoWeekday() <= week_day) {
            compareDay = moment().isoWeekday(week_day);
        } else {
            compareDay = moment().add(1, 'weeks').isoWeekday(week_day);
        }
    }

    let where = { fecha: compareDay.format(formatDate) };

    let hora_inicio = moment();
    if (request.query.hora_inicio && typeof request.query.hora_inicio === 'string' && moment(request.query.hora_inicio, formatTime).isValid()) {
        hora_inicio = moment(request.query.hora_inicio, formatTime);
        Object.assign(where, { hora_inicio: MoreThan(hora_inicio.format(formatTime)) });
    }

    let clases = await getRepository(Clase).find({
        where: where,
        relations: ['profesor', 'categorias']
    });

    let result = [];
    for (let i = 0; i < clases.length; i++) {
        result.push({
            id: clases[i].id,
            hora_inicio: clases[i].hora_inicio,
            hora_fin: clases[i].hora_fin,
            fecha: clases[i].fecha,
            nombre: clases[i].nombre,
            categorias: clases[i].categorias,
            profesor: {
                id: clases[i].profesor.id,
                email: clases[i].profesor.email,
                nombre: clases[i].profesor.nombre,
                imagen: clases[i].profesor.imagen
            }
        });
    }

    return response.json(result);
}

export const createClass = async (request: Request, response: Response): Promise<Response> => {
    // Validate data
    if (!request.body.nombre) throw new Exception('Falta la propiedad nombre de la clase');
    if (!request.body.fecha) throw new Exception('Falta la propiedad fecha de la clase');
    if (!request.body.hora_inicio) throw new Exception('Falta la hora de inicio de la clase');
    if (!request.body.hora_fin) throw new Exception('Falta la hora de finalizacion de la clase');

    // Validate Date
    if (!moment(request.body.fecha, formatDate).isValid()) throw new Exception('Fecha invalida (YYYY-MM-DD)');
    if (!moment(request.body.fecha).isAfter()) throw new Exception('La Fecha ingresada debe ser posterior a la fecha actual');

    let fecha = moment(request.body.fecha, formatDate).format(formatDate);

    // Validate starting and ending time
    if (!moment(request.body.hora_inicio, formatTime).isValid()) throw new Exception('Hora de inicio invalida');
    if (!moment(request.body.hora_fin, formatTime).isValid()) throw new Exception('Hora de finalizacion invalida');

    let momentInicio = moment(request.body.hora_inicio, formatTime);
    let momentFin = moment(request.body.hora_fin, formatTime);
    if (!momentFin.isAfter(momentInicio)) throw new Exception('La hora de finalizacion debe ser posterior a la de inicio');

    let hora_inicio = momentInicio.format(formatTime);
    let hora_fin = momentFin.format(formatTime);

    // Validate categorias
    if (!request.body.categorias) throw new Exception('Falta la propiedad categorias de la clase');
    if (request.body.categorias.length === 0) throw new Exception('Se debe seleccionar al menos una categoria para la clase');

    // Get categories from db
    let categories = await getCategoriesByNames(request.body.categorias);

    if (categories.length === 0) throw new Exception('Debe haber al menos una categoria valida');

    let profesor = await getRepository(Usuario).findOne(request.body.usuario.id);

    let clases = await getRepository(Clase).find({
        where: { fecha: fecha, profesor: profesor }
    });

    // Vlaidate that the teacher does not have a class this dates
    if (clases) {
        clases.forEach(clase => {
            let beforeTime = moment(clase.hora_inicio, formatTime);
            let afterTime = moment(clase.hora_fin, formatTime);

            if (momentInicio.isSame(beforeTime) || momentInicio.isSame(afterTime) || momentInicio.isBetween(beforeTime, afterTime)) {
                throw new Exception(`Ya hay una clase en la fecha de inicio ingresada: ${clase.id} - ${clase.nombre}`);
            }

            if (momentFin.isSame(beforeTime) || momentFin.isSame(afterTime) || momentFin.isBetween(beforeTime, afterTime)) {
                throw new Exception(`Ya hay una clase en la fecha de finalizacion ingresada: ${clase.id} - ${clase.nombre}`);
            }

            if (beforeTime.isBetween(momentInicio, momentFin) || afterTime.isBetween(momentInicio, momentFin)) {
                throw new Exception(`Ya hay una clase entre las fechas ingresadas: ${clase.id} - ${clase.nombre}`);
            }
        });
    }

    // Create new class
    let newClass = getRepository(Clase).create({
        nombre: request.body.nombre,
        fecha: fecha,
        hora_inicio,
        hora_fin,
        categorias: categories,
        profesor: profesor
    });

    let result = await getRepository(Clase).save(newClass);

    return response.json(result);
}

const getCategoriesByNames = async (array: string) => {
    let categories: Categoria[] = [];

    for (let i = 0; i < array.length; i++) {
        let cat = await getRepository(Categoria).findOne({
            where: { nombre: array[i] }
        });
        if (cat) categories.push(cat);
    };

    return categories
}

export const enroll = async (request: Request, response: Response): Promise<Response> => {
    // Validate data
    if (!request.body.clase_id) throw new Exception('Falta el id de la clase a inscribirse');

    // Validate that the class exists
    let clase = await getRepository(Clase).findOne(request.body.clase_id, {
        relations: ['profesor']
    });
    if (!clase) throw new Exception('No existe ninguna clase con el id ingresado');

    if (!moment(clase.fecha).isAfter()) throw new Exception('La clase ya ha terminado');

    let estudiante = await getRepository(Usuario).findOne(request.body.usuario.id);

    if (!estudiante) throw new Exception('No se encontro el usuario');

    if (clase.profesor.id === estudiante.id) throw new Exception('No puedes inscribirte a tu propia clase');

    let inscripcion = await getRepository(Inscripcion).findOne({
        where: { usuario: estudiante, clase: clase }
    });

    if (inscripcion) throw new Exception('Ya te encuentras inscripto a esta clase');

    let inscripciones = await getRepository(Inscripcion).createQueryBuilder("inscripcion")
        .innerJoinAndSelect("inscripcion.clase", "clase")
        .where("inscripcion.usuario = :usuario", { usuario: estudiante.id })
        .andWhere("clase.fecha = :fecha", { fecha: clase.fecha })
        .getMany();

    let momentInicio = moment(clase.hora_inicio, formatTime);
    let momentFin = moment(clase.hora_fin, formatTime);

    inscripciones.forEach(element => {
        let beforeTime = moment(element.clase.hora_inicio, formatTime);
        let afterTime = moment(element.clase.hora_fin, formatTime);

        if (momentInicio.isSame(beforeTime) || momentInicio.isSame(afterTime) || momentInicio.isBetween(beforeTime, afterTime)) {
            throw new Exception('Ya te encuentras inscripto en una clase a esa hora');
        }

        if (momentFin.isSame(beforeTime) || momentFin.isSame(afterTime) || momentFin.isBetween(beforeTime, afterTime)) {
            throw new Exception('Ya te encuentras inscripto en una clase a esa hora');
        }

        if (beforeTime.isBetween(momentInicio, momentFin) || afterTime.isBetween(momentInicio, momentFin)) {
            throw new Exception('Ya te encuentras inscripto en una clase a esa hora');
        }
    });

    let newEnroll = getRepository(Inscripcion).create({
        clase: clase,
        usuario: estudiante
    });

    let result = await getRepository(Inscripcion).save(newEnroll);

    return response.json(result);
}

export const getClass = async (request: Request, response: Response): Promise<Response> => {
    if (!request.query.id) throw new Exception('Falta el parametro id de la clase');

    let profesor = await getRepository(Usuario).findOne({
        where: { id: request.body.usuario.id }
    });

    let clase = await getRepository(Clase).findOne({
        where: { profesor: profesor, id: request.query.id },
        relations: ['categorias', 'profesor', 'inscripciones']
    });

    if (!clase) throw new Exception('No se encontro la clase');

    let inscripciones = await getInscripciones(clase);

    let result = {
        id: clase.id,
        hora_inicio: clase.hora_inicio,
        hora_fin: clase.hora_fin,
        fecha: clase.fecha,
        nombre: clase.nombre,
        categorias: clase.categorias,
        profesor: {
            id: clase.profesor.id,
            email: clase.profesor.email,
            nombre: clase.profesor.nombre,
            imagen: clase.profesor.imagen
        },
        inscripciones: inscripciones
    };

    return response.json(result);
}

const getInscripciones = async (clase: Clase) => {
    let result = [];

    let inscripciones = await getRepository(Inscripcion).find({
        where: { clase: clase },
        relations: ['usuario']
    });

    for (let i = 0; i < inscripciones.length; i++) {
        result.push({
            id: inscripciones[i].id,
            asistio: inscripciones[i].asistio,
            usuario: {
                id: inscripciones[i].usuario.id,
                nombre: inscripciones[i].usuario.nombre,
                email: inscripciones[i].usuario.email,
            },
        });
    }

    return result;
}

export const valorate = async (request: Request, response: Response): Promise<Response> => {
    if (!request.body.valoracion) throw new Exception('Falta la valoracion del docente');
    if (!request.body.id) throw new Exception('Falta el id del docente a valorar');

    let comentario = null;
    if (request.body.comentario) comentario = request.body.comentario;

    let usuario = await getRepository(Usuario).findOne({
        where: { id: request.body.usuario.id }
    });

    if (!usuario) throw new Exception('No se encontro el usuario');

    let docente = await getRepository(Usuario).findOne({
        where: { id: request.body.id }
    });

    if (!docente) throw new Exception('No se encontro el docente');

    let val = await getRepository(Valoracion).findOne({
        where: { valorado: docente, valorador: usuario }
    });

    if(val) throw new Exception('Ya existe una valoracion al docente');

    let clase = await getRepository(Clase).createQueryBuilder("clase")
    .innerJoin("clase.inscripciones", "inscripciones")
    .where("clase.profesor = :profesor", {profesor: docente.id})
    .andWhere("inscripciones.usuario = :usuario", {usuario: usuario.id})
    .getOne();

    console.log(clase);

    return response.json();
}