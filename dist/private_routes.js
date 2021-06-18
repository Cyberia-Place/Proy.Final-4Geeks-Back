"use strict";
/**
 * Pivate Routes are those API urls that require the user to be
 * logged in before they can be called from the front end.
 *
 * Basically all HTTP requests to these endpoints must have an
 * Authorization header with the value "Bearer <token>"
 * being "<token>" a JWT token generated for the user using
 * the POST /token endpoint
 *
 * Please include in this file all your private URL endpoints.
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var express_1 = require("express");
var utils_1 = require("./utils");
var actions = __importStar(require("./actions"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var typeorm_1 = require("typeorm");
var Usuario_1 = require("./entities/Usuario");
var mercadopago = require("mercadopago");
// declare a new router to include all the endpoints
var router = express_1.Router();
mercadopago.configurations.setAccessToken("TEST-7130492618854174-060916-bc2325b74166cc458196122519ad7382-356214762");
var auth = function (request, response, next) {
    var token = request.header('Authorization');
    if (!token)
        throw new utils_1.Exception('Acceso Denegado');
    var decoded;
    try {
        decoded = jsonwebtoken_1["default"].verify(token, process.env.JWT_KEY);
    }
    catch (error) {
    }
    if (!decoded)
        throw new utils_1.Exception('Invalid token');
    Object.assign(request.body, decoded);
    next();
};
// Ruta para dar los creditos del usuario logeado
router.get('/user/credits', auth, utils_1.safe(actions.getCredits));
// Ruta para dar los datos del usuario logeado
router.get('/user/profile', auth, utils_1.safe(actions.profile));
// Ruta para dar los datos de un usuario particular
router.get('/user/profile/:id', auth, utils_1.safe(actions.profile));
// Ruta para dar las stats del usuario logeado
router.get('/user/stats', auth, utils_1.safe(actions.getUserStats));
// Ruta para dar las stats de un usuario particular
router.get('/user/stats/:id', auth, utils_1.safe(actions.getUserStats));
// Ruta para actualizar el perfil del usuario
router.put('/user/update', auth, utils_1.safe(actions.updateProfile));
// Ruta para actualizar la contrasenia del usuario
router.put('/user/updatePassword', auth, utils_1.safe(actions.updatePassword));
// Ruta para listar las clases
router.get('/clases', auth, utils_1.safe(actions.getClasses));
// Ruta para listar las clases filtradas
router.get('/clases/filtered', auth, utils_1.safe(actions.getClassesFiltered));
// Ruta para tarer datos de una clase
router.get('/class', auth, utils_1.safe(actions.getClass));
// Ruta para crear una clase
router.post('/class', auth, utils_1.safe(actions.createClass));
// Ruta para inscribirse a una clase
router.post('/enroll', auth, utils_1.safe(actions.enroll));
// Ruta para eliminar inscripcion a una clase
router["delete"]('/enroll', auth, utils_1.safe(actions.removeEnroll));
// Ruta para valorar un docente
router.post('/valorate', auth, utils_1.safe(actions.valorate));
// Ruta para conseguir siguientes clases como alumno
router.get('/user/nextClases', auth, utils_1.safe(actions.getUserClases));
// Ruta para conseguir siguientes clases como profesor
router.get('/teacher/nextClases', auth, utils_1.safe(actions.getNextClasesDocente));
router.get("/", function (req, res) {
    res.status(200).sendFile("index.html");
});
router.post("/checkout", auth, function (req, res) {
    var preference = {
        items: [{
                title: "Creditos",
                unit_price: 100,
                quantity: 1
            }],
        back_urls: {
            "success": process.env.FRONT_URL_COMPRA,
            "failure": process.env.FRONT_URL_COMPRA,
            "pending": process.env.FRONT_URL_COMPRA
        },
        auto_return: 'approved'
    };
    mercadopago.preferences.create(preference)
        .then(function (response) {
        console.log(response);
        actions.setUser(req.body.usuario.id);
        return res.json(response.body.init_point);
    })["catch"](function (error) {
        console.log(error);
    });
});
router.get('/feedback', function (request, response) {
    return __awaiter(this, void 0, void 0, function () {
        var usuario;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof request.query.status === 'string' && request.query.status === 'approved')) return [3 /*break*/, 2];
                    return [4 /*yield*/, typeorm_1.getRepository(Usuario_1.Usuario).findOne(actions.getUser())];
                case 1:
                    usuario = _a.sent();
                    if (!usuario)
                        throw new utils_1.Exception('No se encontro elusuario');
                    actions.addCredits(100, usuario);
                    return [2 /*return*/, response.redirect(process.env.FRONT_URL + '/inicio/compra')];
                case 2: return [2 /*return*/];
            }
        });
    });
});
exports["default"] = router;
