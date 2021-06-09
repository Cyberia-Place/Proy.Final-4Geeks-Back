"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.createClass = exports.getClasses = exports.createCategory = exports.getCategories = exports.updatePassword = exports.updateProfile = exports.profile = exports.logIn = exports.signUp = void 0;
var typeorm_1 = require("typeorm"); // getRepository"  traer una tabla de la base de datos asociada al objeto
var utils_1 = require("./utils");
var Usuario_1 = require("./entities/Usuario");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var Categoria_1 = require("./entities/Categoria");
var Clase_1 = require("./entities/Clase");
var validator_1 = __importDefault(require("validator"));
var moment_1 = __importDefault(require("moment"));
var signUp = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var usuario, salt, hashedPassword, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Validar datos ingresados
                if (!request.body.email)
                    throw new utils_1.Exception('Falta la propiedad email en el body');
                if (!validator_1["default"].isEmail(request.body.email))
                    throw new utils_1.Exception('Email invalido');
                if (!request.body.contrasenia)
                    throw new utils_1.Exception('Falta la propiedad contrasenia en el body');
                if (!request.body.nombre)
                    throw new utils_1.Exception('Falta la propiedad nombre en el body');
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).findOne({
                        where: { email: request.body.email }
                    })];
            case 1:
                usuario = _a.sent();
                if (usuario)
                    throw new utils_1.Exception('Ya existe un usuario con ese email');
                return [4 /*yield*/, bcrypt_1["default"].genSalt()];
            case 2:
                salt = _a.sent();
                return [4 /*yield*/, bcrypt_1["default"].hash(request.body.contrasenia, salt)];
            case 3:
                hashedPassword = _a.sent();
                // Se crea la nueva instancia de usuario
                usuario = typeorm_1.getRepository(Usuario_1.Usuario).create({
                    email: request.body.email,
                    contrasenia: hashedPassword,
                    nombre: request.body.nombre
                });
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).save(usuario)];
            case 4:
                result = _a.sent();
                return [2 /*return*/, response.json(result)];
        }
    });
}); };
exports.signUp = signUp;
var logIn = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var usuario, payLoad, token, expires;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Validar datos ingresados
                if (!request.body.email)
                    throw new utils_1.Exception('Falta la propiedad email en el body');
                if (!validator_1["default"].isEmail(request.body.email))
                    throw new utils_1.Exception('Email invalido');
                if (!request.body.contrasenia)
                    throw new utils_1.Exception('Falta la propiedad contrasenia en el body');
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).findOne({
                        where: { email: request.body.email }
                    })];
            case 1:
                usuario = _a.sent();
                if (!usuario)
                    throw new utils_1.Exception('No existe un usuario con el email ingresado');
                return [4 /*yield*/, bcrypt_1["default"].compare(request.body.contrasenia, usuario.contrasenia)];
            case 2:
                // Valido la contraseña del usuario
                if (!(_a.sent()))
                    throw new utils_1.Exception('Contraseña incorrecta');
                payLoad = {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email
                };
                token = jsonwebtoken_1["default"].sign({ usuario: payLoad }, process.env.JWT_KEY, { expiresIn: '1day' });
                expires = new Date();
                expires.setDate(expires.getDate() + 1);
                expires.setHours(expires.getHours() - 3);
                return [2 /*return*/, response.json({ usuario: payLoad, token: token, expires: expires })];
        }
    });
}); };
exports.logIn = logIn;
var profile = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var usuario;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).findOne({
                    select: ['id', 'email', 'nombre', 'imagen', 'pais', 'edad', 'descripcion', 'idioma', 'ocupacion'],
                    where: { id: request.body.usuario.id }
                })];
            case 1:
                usuario = _a.sent();
                if (!usuario)
                    throw new utils_1.Exception('No se encontro el usuario');
                return [2 /*return*/, response.json(usuario)];
        }
    });
}); };
exports.profile = profile;
var updateProfile = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!request.body.nombre) return [3 /*break*/, 2];
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).update(request.body.usuario.id, { nombre: request.body.nombre })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!request.body.imagen) return [3 /*break*/, 4];
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).update(request.body.usuario.id, { imagen: request.body.imagen })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!request.body.pais) return [3 /*break*/, 6];
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).update(request.body.usuario.id, { pais: request.body.pais })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                if (!request.body.descripcion) return [3 /*break*/, 8];
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).update(request.body.usuario.id, { descripcion: request.body.descripcion })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                if (!request.body.edad) return [3 /*break*/, 10];
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).update(request.body.usuario.id, { edad: request.body.edad })];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                if (!request.body.idioma) return [3 /*break*/, 12];
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).update(request.body.usuario.id, { idioma: request.body.idioma })];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12:
                if (!request.body.ocupacion) return [3 /*break*/, 14];
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).update(request.body.usuario.id, { ocupacion: request.body.ocupacion })];
            case 13:
                _a.sent();
                _a.label = 14;
            case 14: return [2 /*return*/, response.json({ msg: "usuario actualizado" })];
        }
    });
}); };
exports.updateProfile = updateProfile;
var updatePassword = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var usuario, salt, hashedPassword, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!request.body.contraseniaPrevia)
                    throw new utils_1.Exception('Falta la propiedad contrasenia previa en el body');
                if (!request.body.contraseniaNueva)
                    throw new utils_1.Exception('Falta la propiedad contrasenia nueva en el body');
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).findOne(request.body.usuario.id)];
            case 1:
                usuario = _a.sent();
                if (!usuario)
                    throw new utils_1.Exception('No existe usuario');
                return [4 /*yield*/, bcrypt_1["default"].compare(request.body.contraseniaPrevia, usuario.contrasenia)];
            case 2:
                if (!(_a.sent()))
                    throw new utils_1.Exception('Contraseña incorrecta');
                return [4 /*yield*/, bcrypt_1["default"].genSalt()];
            case 3:
                salt = _a.sent();
                return [4 /*yield*/, bcrypt_1["default"].hash(request.body.contraseniaNueva, salt)];
            case 4:
                hashedPassword = _a.sent();
                // Actualizo contraseña
                usuario.contrasenia = hashedPassword;
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).save(usuario)];
            case 5:
                result = _a.sent();
                return [2 /*return*/, response.json(result)];
        }
    });
}); };
exports.updatePassword = updatePassword;
var getCategories = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var categories;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_1.getRepository(Categoria_1.Categoria).find()];
            case 1:
                categories = _a.sent();
                return [2 /*return*/, response.json(categories)];
        }
    });
}); };
exports.getCategories = getCategories;
var createCategory = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var category, newCat, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!request.body.nombre)
                    throw new utils_1.Exception('Falta la propiedad nombre de la categoria');
                if (!request.body.descripcion)
                    throw new utils_1.Exception('Falta la propiedad descripcion de la categoria');
                return [4 /*yield*/, typeorm_1.getRepository(Categoria_1.Categoria).findOne({
                        where: { nombre: request.body.nombre }
                    })];
            case 1:
                category = _a.sent();
                if (category)
                    throw new utils_1.Exception('Ya hay una categoria con el nombre ingresado');
                newCat = typeorm_1.getRepository(Categoria_1.Categoria).create(request.body);
                return [4 /*yield*/, typeorm_1.getRepository(Categoria_1.Categoria).save(newCat)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, response.json(result)];
        }
    });
}); };
exports.createCategory = createCategory;
var getClasses = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_1.getRepository(Clase_1.Clase).find({
                    where: { fecha: typeorm_1.MoreThanOrEqual(new Date()) },
                    relations: ['profesor']
                })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, response.json(result)];
        }
    });
}); };
exports.getClasses = getClasses;
var createClass = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var fecha, formatTime, momentInicio, momentFin, hora_inicio, hora_fin, categories, profesor, clases, newClass, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Validate data
                if (!request.body.nombre)
                    throw new utils_1.Exception('Falta la propiedad nombre de la clase');
                if (!request.body.fecha)
                    throw new utils_1.Exception('Falta la propiedad fecha de la clase');
                if (!request.body.hora_inicio)
                    throw new utils_1.Exception('Falta la hora de inicio de la clase');
                if (!request.body.hora_fin)
                    throw new utils_1.Exception('Falta la hora de finalizacion de la clase');
                // Validate Date
                if (!moment_1["default"](request.body.fecha, 'YYYY-MM-DD').isValid())
                    throw new utils_1.Exception('Fecha invalida (YYYY-MM-DD)');
                if (!moment_1["default"](request.body.fecha).isAfter())
                    throw new utils_1.Exception('La Fecha ingresada debe ser posterior a la fecha actual');
                fecha = moment_1["default"](request.body.fecha, 'YYYY-MM-DD').format('YYYY-MM-DD');
                formatTime = 'LT';
                if (!moment_1["default"](request.body.hora_inicio, formatTime).isValid())
                    throw new utils_1.Exception('Hora de inicio invalida');
                if (!moment_1["default"](request.body.hora_fin, formatTime).isValid())
                    throw new utils_1.Exception('Hora de finalizacion invalida');
                momentInicio = moment_1["default"](request.body.hora_inicio, formatTime);
                momentFin = moment_1["default"](request.body.hora_fin, formatTime);
                if (!momentFin.isAfter(momentInicio))
                    throw new utils_1.Exception('La hora de finalizacion debe ser posterior a la de inicio');
                hora_inicio = momentInicio.format(formatTime);
                hora_fin = momentFin.format(formatTime);
                // Validate categorias
                if (!request.body.categorias)
                    throw new utils_1.Exception('Falta la propiedad categorias de la clase');
                if (request.body.categorias.length === 0)
                    throw new utils_1.Exception('Se debe seleccionar al menos una categoria para la clase');
                return [4 /*yield*/, getCategoriesByNames(request.body.categorias)];
            case 1:
                categories = _a.sent();
                if (categories.length === 0)
                    throw new utils_1.Exception('Debe haber al menos una categoria valida');
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).findOne(request.body.usuario.id)];
            case 2:
                profesor = _a.sent();
                return [4 /*yield*/, typeorm_1.getRepository(Clase_1.Clase).find({
                        where: { fecha: fecha, profesor: profesor }
                    })];
            case 3:
                clases = _a.sent();
                // Vlaidate that the teacher does not have a class this dates
                if (clases) {
                    clases.forEach(function (clase) {
                        var beforeTime = moment_1["default"](clase.hora_inicio, formatTime);
                        var afterTime = moment_1["default"](clase.hora_fin, formatTime);
                        if (momentInicio.isSame(beforeTime) || momentInicio.isSame(afterTime) || momentInicio.isBetween(beforeTime, afterTime)) {
                            throw new utils_1.Exception("Ya hay una clase en la fecha de inicio ingresada: " + clase.id + " - " + clase.nombre);
                        }
                        if (momentFin.isSame(beforeTime) || momentFin.isSame(afterTime) || momentFin.isBetween(beforeTime, afterTime)) {
                            throw new utils_1.Exception("Ya hay una clase en la fecha de finalizacion ingresada: " + clase.id + " - " + clase.nombre);
                        }
                    });
                }
                newClass = typeorm_1.getRepository(Clase_1.Clase).create({
                    nombre: request.body.nombre,
                    fecha: fecha,
                    hora_inicio: hora_inicio,
                    hora_fin: hora_fin,
                    categorias: categories,
                    profesor: profesor
                });
                return [4 /*yield*/, typeorm_1.getRepository(Clase_1.Clase).save(newClass)];
            case 4:
                result = _a.sent();
                return [2 /*return*/, response.json(result)];
        }
    });
}); };
exports.createClass = createClass;
var getCategoriesByNames = function (array) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, i, cat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                categories = [];
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < array.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, typeorm_1.getRepository(Categoria_1.Categoria).findOne({
                        where: { nombre: array[i] }
                    })];
            case 2:
                cat = _a.sent();
                if (cat)
                    categories.push(cat);
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4:
                ;
                return [2 /*return*/, categories];
        }
    });
}); };
