const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const authMiddleware = require('../middleware/auth');
const { requirePermisos } = require('../middleware/roles');

router.use(authMiddleware);

router.post('/', feedbackController.crear);
router.get('/', requirePermisos('feedback:read'), feedbackController.listar);
router.get('/:id', requirePermisos('feedback:read'), feedbackController.obtener);
router.put('/:id/estado', requirePermisos('feedback:read'), feedbackController.actualizarEstado);

module.exports = router;
