import { Router } from 'express';
import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1011396055',
    database: 'summa_integraciones',
  },
});

export function createIntegracionesRouter(): Router {
  const router = Router();

  // GET todas las integraciones
  router.get('/integraciones', async (_req, res) => {
    try {
      const integraciones = await db('integraciones')
        .select('*')
        .orderBy('fecha_registro', 'desc');
      res.json(integraciones);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al obtener integraciones' });
    }
  });

  // GET por ID
  router.get('/integraciones/:id', async (req, res) => {
    try {
      const integracion = await db('integraciones')
        .where('id', req.params.id)
        .first();
      if (!integracion) return res.status(404).json({ error: 'No encontrada' });
      res.json(integracion);
    } catch (error) {
      res.status(500).json({ error: 'Error' });
    }
  });

  // POST crear
  router.post('/integraciones', async (req, res) => {
    try {
      const data = req.body;
      const [id] = await db('integraciones').insert({
        identificador_escenario: data.identificador_escenario,
        aplicaciones_involucradas: data.aplicaciones_involucradas,
        componente_emisor: data.componente_emisor,
        componente_receptor: data.componente_receptor,
        namespace_interfaz: data.namespace_interfaz,
        tipo_interfaz: data.tipo_interfaz,
        protocolo_comunicacion: data.protocolo_comunicacion,
        criticidad: data.criticidad || 'Media',
        responsable: data.responsable,
        documentacion_soporte: data.documentacion_soporte || '',
        descripcion_flujo: data.descripcion_flujo || '',
        estado: data.estado || 'Activo',
      });
      const nueva = await db('integraciones').where('id', id).first();
      res.status(201).json(nueva);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear' });
    }
  });

  // PUT actualizar
  router.put('/integraciones/:id', async (req, res) => {
    try {
      await db('integraciones').where('id', req.params.id).update(req.body);
      const actualizada = await db('integraciones')
        .where('id', req.params.id)
        .first();
      res.json(actualizada);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar' });
    }
  });

  // DELETE eliminar
  router.delete('/integraciones/:id', async (req, res) => {
    try {
      await db('integraciones').where('id', req.params.id).delete();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar' });
    }
  });

  // GET estadísticas
  router.get('/integraciones/stats/resumen', async (_req, res) => {
    try {
      const total = await db('integraciones').count('id as count').first();
      const activas = await db('integraciones')
        .where('estado', 'Activo')
        .count('id as count')
        .first();
      const altaCriticidad = await db('integraciones')
        .where('criticidad', 'Alta')
        .count('id as count')
        .first();
      const responsables = await db('integraciones').distinct('responsable');

      res.json({
        totalIntegraciones: Number(total?.count) || 0,
        activas: Number(activas?.count) || 0,
        altaCriticidad: Number(altaCriticidad?.count) || 0,
        responsablesUnicos: responsables.length,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error' });
    }
  });

  return router;
}
