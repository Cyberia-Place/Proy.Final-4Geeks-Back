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
exports.updatePassword = exports.updateProfile = exports.profile = exports.logIn = exports.signUp = void 0;
var typeorm_1 = require("typeorm"); // getRepository"  traer una tabla de la base de datos asociada al objeto
var utils_1 = require("./utils");
var Usuario_1 = require("./entities/Usuario");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var signUp = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var usuario, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Validar datos ingresados
                if (!request.body.email)
                    throw new utils_1.Exception('Falta la propiedad email en el body');
                if (!request.body.contrasenia)
                    throw new utils_1.Exception('Falta la propiedad contrasenia en el body');
                if (!request.body.nombre)
                    throw new utils_1.Exception('Falta la propiedad nombre en el body');
                if (!request.body.apellido)
                    throw new utils_1.Exception('Falta la propiedad apellido en el body');
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).findOne({
                        where: { email: request.body.email }
                    })];
            case 1:
                usuario = _a.sent();
                if (usuario)
                    throw new utils_1.Exception('Ya existe un usuario con ese email');
                // Se crea la nueva instancia de usuario
                usuario = typeorm_1.getRepository(Usuario_1.Usuario).create({
                    email: request.body.email,
                    contrasenia: request.body.contrasenia,
                    nombre: request.body.nombre,
                    apellido: request.body.apellido
                });
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).save(usuario)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, response.json(result)];
        }
    });
}); };
exports.signUp = signUp;
var logIn = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var usuario, token, expires;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Validar datos ingresados
                if (!request.body.email)
                    throw new utils_1.Exception('Falta la propiedad email en el body');
                if (!request.body.contrasenia)
                    throw new utils_1.Exception('Falta la propiedad contrasenia en el body');
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).findOne({
                        select: ['id', 'email', 'nombre', 'apellido'],
                        where: { email: request.body.email, contrasenia: request.body.contrasenia }
                    })];
            case 1:
                usuario = _a.sent();
                if (!usuario)
                    throw new utils_1.Exception('Email o contraseña incorrectos');
                token = jsonwebtoken_1["default"].sign({ usuario: usuario }, process.env.JWT_KEY, { expiresIn: '1day' });
                expires = new Date();
                expires.setDate(expires.getDate() + 1);
                expires.setHours(expires.getHours() - 3);
                return [2 /*return*/, response.json({ usuario: usuario, token: token, expires: expires })];
        }
    });
}); };
exports.logIn = logIn;
var profile = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var usuario;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).findOne({
                    select: ['id', 'email', 'nombre', 'apellido', 'imagen', 'pais', 'edad', 'descripcion', 'idioma', 'ocupacion'],
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
                if (!request.body.apellido) return [3 /*break*/, 4];
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).update(request.body.usuario.id, { apellido: request.body.apellido })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!request.body.imagen) return [3 /*break*/, 6];
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).update(request.body.usuario.id, { imagen: request.body.imagen })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                if (!request.body.pais) return [3 /*break*/, 8];
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).update(request.body.usuario.id, { pais: request.body.pais })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                if (!request.body.descripcion) return [3 /*break*/, 10];
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).update(request.body.usuario.id, { descripcion: request.body.descripcion })];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                if (!request.body.edad) return [3 /*break*/, 12];
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).update(request.body.usuario.id, { edad: request.body.edad })];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12:
                if (!request.body.idioma) return [3 /*break*/, 14];
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).update(request.body.usuario.id, { idioma: request.body.idioma })];
            case 13:
                _a.sent();
                _a.label = 14;
            case 14:
                if (!request.body.ocupacion) return [3 /*break*/, 16];
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).update(request.body.usuario.id, { ocupacion: request.body.ocupacion })];
            case 15:
                _a.sent();
                _a.label = 16;
            case 16: return [2 /*return*/, response.json({ msg: "usuario actualizado" })];
        }
    });
}); };
exports.updateProfile = updateProfile;
var updatePassword = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var usuario, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!request.body.contraseniaPrevia)
                    throw new utils_1.Exception('Falta la propiedad contrasenia previa en el body');
                if (!request.body.contraseniaNueva)
                    throw new utils_1.Exception('Falta la propiedad contrasenia nueva en el body');
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).findOne({
                        where: { id: request.body.usuario.id, contrasenia: request.body.contraseniaPrevia }
                    })];
            case 1:
                usuario = _a.sent();
                if (!usuario)
                    throw new utils_1.Exception('Contraseña incorrecta');
                usuario.contrasenia = request.body.contraseniaNueva;
                return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).save(usuario)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, response.json(result)];
        }
    });
}); };
exports.updatePassword = updatePassword;
