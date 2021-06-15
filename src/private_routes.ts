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

import { Router, NextFunction, Request, Response } from 'express';
import { safe, Exception } from './utils';
import * as actions from './actions';
import jwt from 'jsonwebtoken';
const mercadopago = require("mercadopago");

// declare a new router to include all the endpoints
const router = Router();
mercadopago.configurations.setAccessToken("APP_USR-1508248924277931-061013-ef7310941fe2abe705b765227a933eb7-773429653"); 

const auth = (request: Request, response: Response, next: NextFunction) => {
    let token = request.header('Authorization');
    if (!token) throw new Exception('Acceso Denegado');

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_KEY as string);
    } catch (error) {
    }

    if (!decoded) throw new Exception('Invalid token');

    Object.assign(request.body, decoded);

    next();
}

// Ruta para dar los datos del usuario logeado
router.get('/user/profile', auth, safe(actions.profile));

// Ruta para dar los datos de un usuario particular
router.get('/user/profile/:id', auth, safe(actions.profile));

// Ruta para dar las stats del usuario logeado
router.get('/user/stats', auth, safe(actions.getUserStats));

// Ruta para dar las stats de un usuario particular
router.get('/user/stats/:id', auth, safe(actions.getUserStats));

// Ruta para actualizar el perfil del usuario
router.put('/user/update', auth, safe(actions.updateProfile));

// Ruta para actualizar la contrasenia del usuario
router.put('/user/updatePassword', auth, safe(actions.updatePassword));

// Ruta para listar las clases
router.get('/clases', auth, safe(actions.getClasses));

// Ruta para listar las clases filtradas
router.get('/clases/filtered', auth, safe(actions.getClassesFiltered));

// Ruta para tarer datos de una clase
router.get('/class', auth, safe(actions.getClass));

// Ruta para crear una clase
router.post('/class', auth, safe(actions.createClass));

// Ruta para inscribirse a una clase
router.post('/enroll', auth, safe(actions.enroll));

// Ruta para valorar un docente
router.post('/valorate', auth, safe(actions.valorate));

// Ruta para conseguir siguientes clases como alumno
router.get('/user/nextClases', auth, safe(actions.getUserClases));

// Ruta para conseguir siguientes clases como profesor
router.get('/teacher/nextClases', auth, safe(actions.getNextClasesDocente));

router.get("/", function (req, res) {
  res.status(200).sendFile("index.html");
}); 

router.post("/checkout", (req, res) => {


	let preference = {
		items: [{
			title: "Creditos",
			unit_price: 100,
			quantity: 1,
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
    auto_return: 'approved',
    },

}

	mercadopago.preferences.create(preference)
		.then(function (response: { body: { init_point: string; }; }) {
            console.log(response)
            res.redirect(response.body.init_point)
		}).catch(function (error: any) {
			console.log(error);
		});
});

router.get('/feedback', function(request, response) {
	 response.json({
		Payment: request.query.payment_id,
		Status: request.query.status,
		MerchantOrder: request.query.merchant_order_id
    })
});



export default router;
