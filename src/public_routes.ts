
/**
 * Public Routes are those API url's that anyone can request
 * whout having to be logged in, for example:
 * 
 * POST /user is the endpoint to create a new user or "sign up".
 * POST /token can be the endpoint to "log in" (generate a token)
 */
import { Router } from 'express';
import { safe } from './utils';
import * as actions from './actions';

const router = Router();

// Ruta para realizar el reguistro de un usuario
router.post('/signup', safe(actions.signUp));

// Ruta para logearse
router.post('/login', safe(actions.logIn));

// Ruta para logearse con google
router.post('/google-login', safe(actions.googleLogin));

// Ruta para obtener las categorias
router.get('/categories', safe(actions.getCategories));

// Ruta para crear una categoria
router.post('/category', safe(actions.createCategory));

// Ruta para solicitar cambio de contrasenia
router.post('/forgot-password', safe(actions.forgotPassword));

// Ruta para cambio de contrasenia
router.post('/reset-password', safe(actions.resetPassword));

export default router;
