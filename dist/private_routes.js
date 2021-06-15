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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var utils_1 = require("./utils");
var actions = __importStar(require("./actions"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var mercadopago = require("mercadopago");
// declare a new router to include all the endpoints
var router = express_1.Router();
mercadopago.configurations.setAccessToken("APP_USR-1508248924277931-061013-ef7310941fe2abe705b765227a933eb7-773429653");
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
// Ruta para dar los datos del usuario logeado
router.get('/user/profile', auth, utils_1.safe(actions.profile));
// Ruta para actualizar el perfil del usuario
router.put('/user/update', auth, utils_1.safe(actions.updateProfile));
// Ruta para actualizar la contrasenia del usuario
router.put('/user/updatePassword', auth, utils_1.safe(actions.updatePassword));
router.get("/", function (req, res) {
    res.status(200).sendFile("index.html");
});
router.post("/checkout", function (req, res) {
    var preference = {
        items: [{
                title: "Creditos",
                unit_price: 100,
                quantity: 1
            }],
        payer: {
            name: "Test",
            surname: "Test",
            email: "test_user_61138522@testuser.com",
            date_created: "2015-06-02T12:58:41.425-04:00",
            phone: {
                area_code: "598",
                number: 92884093
            },
            identification: {
                type: "CI",
                number: "11111111"
            },
            address: {
                street_name: "Oribe",
                street_number: 790,
                zip_code: "80000"
            },
            back_urls: {
                "success": process.env.FRONT_URL_COMPRA,
                "failure": process.env.FRONT_URL_COMPRA,
                "pending": process.env.FRONT_URL_COMPRA
            },
            auto_return: 'approved'
        }
    };
    mercadopago.preferences.create(preference)
        .then(function (response) {
        console.log(response);
        res.redirect(response.body.init_point);
    })["catch"](function (error) {
        console.log(error);
    });
});
router.get('/feedback', function (request, response) {
    response.json({
        Payment: request.query.payment_id,
        Status: request.query.status,
        MerchantOrder: request.query.merchant_order_id
    });
});
exports["default"] = router;
