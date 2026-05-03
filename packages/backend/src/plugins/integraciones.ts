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

  // GET una integración por ID
  router.get('/integraciones/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const integracion = await db('integraciones').where('id', id).first();

      if (!integracion) {
        return res.status(404).json({ error: 'Integración no encontrada' });
      }

      res.json(integracion);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al obtener integración' });
    }
  });

  // POST crear integración
  router.post('/integraciones', async (req, res) => {
    try {
      const data = req.body;

      // Validar campos requeridos
      const requiredFields = [
        'identificadorEscenario',
        'aplicacionesInvolucradas',
        'componenteEmisor',
        'componenteReceptor',
        'namespaceInterfaz',
        'tipoInterfaz',
        'protocoloComunicacion',
        'responsable',
      ];

      for (const field of requiredFields) {
        if (!data[field]) {
          return res
            .status(400)
            .json({ error: `El campo ${field} es requerido` });
        }
      }

      // Convertir camelCase a snake_case
      const insertData = {
        identificador_escenario: data.identificadorEscenario,
        aplicaciones_involucradas: data.aplicacionesInvolucradas,
        componente_emisor: data.componenteEmisor,
        componente_receptor: data.componenteReceptor,
        namespace_interfaz: data.namespaceInterfaz,
        tipo_interfaz: data.tipoInterfaz,
        protocolo_comunicacion: data.protocoloComunicacion,
        criticidad: data.criticidad || 'Media',
        responsable: data.responsable,
        documentacion_soporte: data.documentacionSoporte || '',
        descripcion_flujo: data.descripcionFlujo || '',
        estado: data.estado || 'Activo',
        fecha_actualizacion: new Date(),
      };

      // Insertar y obtener el registro creado
      const result = await db('integraciones')
        .insert(insertData)
        .returning('*');

      res.status(201).json(result[0]);
    } catch (error: any) {
      console.error('Error al crear:', error);

      // Manejar error de llave duplicada (código 23505 en PostgreSQL)
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'Ya existe una integración con ese identificador',
          detalle: error.detail,
        });
      }

      res.status(500).json({ error: 'Error al crear integración' });
    }
  });

  // PUT actualizar integración (EDITAR)
  router.put('/integraciones/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      // Verificar si la integración existe
      const existe = await db('integraciones').where('id', id).first();
      if (!existe) {
        return res.status(404).json({ error: 'Integración no encontrada' });
      }

      // Convertir camelCase a snake_case para actualización
      const updateData: any = {
        fecha_actualizacion: new Date(),
      };

      // Mapear campos si vienen en camelCase
      if (data.identificadorEscenario !== undefined)
        updateData.identificador_escenario = data.identificadorEscenario;
      if (data.aplicacionesInvolucradas !== undefined)
        updateData.aplicaciones_involucradas = data.aplicacionesInvolucradas;
      if (data.componenteEmisor !== undefined)
        updateData.componente_emisor = data.componenteEmisor;
      if (data.componenteReceptor !== undefined)
        updateData.componente_receptor = data.componenteReceptor;
      if (data.namespaceInterfaz !== undefined)
        updateData.namespace_interfaz = data.namespaceInterfaz;
      if (data.tipoInterfaz !== undefined)
        updateData.tipo_interfaz = data.tipoInterfaz;
      if (data.protocoloComunicacion !== undefined)
        updateData.protocolo_comunicacion = data.protocoloComunicacion;
      if (data.criticidad !== undefined)
        updateData.criticidad = data.criticidad;
      if (data.responsable !== undefined)
        updateData.responsable = data.responsable;
      if (data.documentacionSoporte !== undefined)
        updateData.documentacion_soporte = data.documentacionSoporte;
      if (data.descripcionFlujo !== undefined)
        updateData.descripcion_flujo = data.descripcionFlujo;
      if (data.estado !== undefined) updateData.estado = data.estado;

      // También aceptar snake_case directamente
      if (data.identificador_escenario !== undefined)
        updateData.identificador_escenario = data.identificador_escenario;
      if (data.aplicaciones_involucradas !== undefined)
        updateData.aplicaciones_involucradas = data.aplicaciones_involucradas;
      if (data.componente_emisor !== undefined)
        updateData.componente_emisor = data.componente_emisor;
      if (data.componente_receptor !== undefined)
        updateData.componente_receptor = data.componente_receptor;
      if (data.namespace_interfaz !== undefined)
        updateData.namespace_interfaz = data.namespace_interfaz;
      if (data.tipo_interfaz !== undefined)
        updateData.tipo_interfaz = data.tipo_interfaz;
      if (data.protocolo_comunicacion !== undefined)
        updateData.protocolo_comunicacion = data.protocolo_comunicacion;
      if (data.documentacion_soporte !== undefined)
        updateData.documentacion_soporte = data.documentacion_soporte;
      if (data.descripcion_flujo !== undefined)
        updateData.descripcion_flujo = data.descripcion_flujo;

      await db('integraciones').where('id', id).update(updateData);

      const integracionActualizada = await db('integraciones')
        .where('id', id)
        .first();

      res.json(integracionActualizada);
    } catch (error: any) {
      console.error('Error al actualizar:', error);

      // Manejar error de llave duplicada (si cambia el identificador)
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'Ya existe otra integración con ese identificador',
          detalle: error.detail,
        });
      }

      res.status(500).json({ error: 'Error al actualizar integración' });
    }
  });

  // DELETE eliminar integración
  router.delete('/integraciones/:id', async (req, res) => {
    try {
      const { id } = req.params;

      // Verificar si la integración existe
      const existe = await db('integraciones').where('id', id).first();
      if (!existe) {
        return res.status(404).json({ error: 'Integración no encontrada' });
      }

      await db('integraciones').where('id', id).delete();

      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar:', error);
      res.status(500).json({ error: 'Error al eliminar integración' });
    }
  });

  // GET estadísticas / resumen
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

      // Obtener protocolos más usados
      const protocolosUsados = await db('integraciones')
        .select('protocolo_comunicacion')
        .distinct();

      res.json({
        totalIntegraciones: Number(total?.count) || 0,
        activas: Number(activas?.count) || 0,
        altaCriticidad: Number(altaCriticidad?.count) || 0,
        responsablesUnicos: responsables.length,
        protocolosUsados: protocolosUsados.map(p => p.protocolo_comunicacion),
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  });

  return router;
}
