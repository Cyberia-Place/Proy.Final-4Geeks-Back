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

// declare a new router to include all the endpoints
const router = Router();

const auth = (request: Request, response: Response, next: NextFunction) => {
    let token = request.header('Authorization');
    if(!token) throw new Exception('Acceso Denegado');

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_KEY as string);
    } catch (error) {
    }

    if(!decoded) throw new Exception('Invalid token');

    Object.assign(request.body, decoded);

    next();
}

router.get('/profile', auth, safe(actions.profile));

export default router;
