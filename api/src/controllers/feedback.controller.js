const { Feedback, Usuario } = require('../models');

async function crear(req, res) {
  try {
    const { ruta, tipo, descripcion, prioridad } = req.body;

    if (!ruta || !tipo || !descripcion) {
      return res.status(400).json({ error: 'ruta, tipo y descripcion son requeridos' });
    }

    const feedback = await Feedback.create({
      ruta,
      tipo,
      descripcion,
      prioridad: prioridad || 'media',
      usuarioId: req.usuario.id,
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error al crear feedback:', error);
    res.status(500).json({ error: 'Error al crear feedback' });
  }
}

async function listar(req, res) {
  try {
    const { estado, tipo, prioridad, page = 1, limit = 50 } = req.query;
    const where = {};
    if (estado) where.estado = estado;
    if (tipo) where.tipo = tipo;
    if (prioridad) where.prioridad = prioridad;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Feedback.findAndCountAll({
      where,
      include: [{ model: Usuario, attributes: ['id', 'username', 'nombreCompleto'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      feedbacks: rows,
      total: count,
      totalPages: Math.ceil(count / parseInt(limit)),
      page: parseInt(page),
    });
  } catch (error) {
    console.error('Error al listar feedbacks:', error);
    res.status(500).json({ error: 'Error al listar feedbacks' });
  }
}

async function obtener(req, res) {
  try {
    const feedback = await Feedback.findByPk(req.params.id, {
      include: [{ model: Usuario, attributes: ['id', 'username', 'nombreCompleto'] }],
    });
    if (!feedback) return res.status(404).json({ error: 'Feedback no encontrado' });
    res.json(feedback);
  } catch (error) {
    console.error('Error al obtener feedback:', error);
    res.status(500).json({ error: 'Error al obtener feedback' });
  }
}

async function actualizarEstado(req, res) {
  try {
    const { estado } = req.body;
    const estadosValidos = ['nuevo', 'en_progreso', 'resuelto', 'cerrado'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) return res.status(404).json({ error: 'Feedback no encontrado' });

    await feedback.update({ estado });
    res.json(feedback);
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
}

module.exports = { crear, listar, obtener, actualizarEstado };
