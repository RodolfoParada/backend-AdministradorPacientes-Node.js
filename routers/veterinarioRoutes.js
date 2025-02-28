import express from 'express';
const router = express.Router();
import {registrar,perfil, confirmar, autenticar, olvidePassword,comprobarToken, 
    nuevoPassword,actualizarPerfil, actualizarPassword,} from '../controllers/veterinarioControlller.js';
import checkAuth from '../middleware/authMiddleware.js';

//área publica
router.post('/', registrar);
router.get('/confirmar/:token', confirmar); // siempre se va a leer con request params de la url
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);

// router.post('/olvide-password/:token', comprobarToken);
// router.post('/olvide-password/:token', nuevoPassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);


//área privada
router.get('/perfil',checkAuth,perfil );
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.put("/actualizar-password", checkAuth, actualizarPassword);
export default router;