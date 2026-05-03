import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

interface Integracion {
  id: string;
  identificadorEscenario: string;
  aplicacionesInvolucradas: string[];
  componenteEmisor: string;
  componenteReceptor: string;
  protocoloComunicacion: string;
  responsable: string;
  criticidad: string;
  estado: string;
  fechaRegistro: string;
}

export const ListaIntegraciones = () => {
  const [integraciones, setIntegraciones] = useState<Integracion[]>([]);

  useEffect(() => {
    const mockData: Integracion[] = [
      {
        id: '1',
        identificadorEscenario: 'INT-SAP-SALESFORCE-001',
        aplicacionesInvolucradas: ['SAP', 'Salesforce'],
        componenteEmisor: 'SAP ECC',
        componenteReceptor: 'Salesforce Cloud',
        protocoloComunicacion: 'REST',
        responsable: 'Equipo SAP',
        criticidad: 'Alta',
        estado: 'Activo',
        fechaRegistro: '2026-01-15',
      },
      {
        id: '2',
        identificadorEscenario: 'INT-MAINFRAME-ORACLE-002',
        aplicacionesInvolucradas: ['Mainframe', 'Oracle'],
        componenteEmisor: 'Mainframe Z/OS',
        componenteReceptor: 'Oracle DB',
        protocoloComunicacion: 'SOAP',
        responsable: 'Juan Pérez',
        criticidad: 'Media',
        estado: 'Activo',
        fechaRegistro: '2026-02-01',
      },
      {
        id: '3',
        identificadorEscenario: 'INT-SUMMACORE-KAFKA-003',
        aplicacionesInvolucradas: ['SummaCore', 'Kafka'],
        componenteEmisor: 'SummaCore API',
        componenteReceptor: 'Kafka Broker',
        protocoloComunicacion: 'Kafka',
        responsable: 'Equipo Arquitectura',
        criticidad: 'Alta',
        estado: 'En desarrollo',
        fechaRegistro: '2026-02-20',
      },
    ];
    setIntegraciones(mockData);
  }, []);

  const getCriticidadColor = (criticidad: string) => {
    switch (criticidad) {
      case 'Alta':
        return '#d32f2f';
      case 'Media':
        return '#ed6c02';
      default:
        return '#2e7d32';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Inventario de integraciones
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Total: {integraciones.length} registros
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Identificador</TableCell>
                <TableCell>Aplicaciones</TableCell>
                <TableCell>Emisor → Receptor</TableCell>
                <TableCell>Protocolo</TableCell>
                <TableCell>Responsable</TableCell>
                <TableCell>Criticidad</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {integraciones.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.identificadorEscenario}</TableCell>
                  <TableCell>
                    {row.aplicacionesInvolucradas.map(a => (
                      <Chip key={a} label={a} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    {row.componenteEmisor} → {row.componenteReceptor}
                  </TableCell>
                  <TableCell>{row.protocoloComunicacion}</TableCell>
                  <TableCell>{row.responsable}</TableCell>
                  <TableCell
                    sx={{
                      color: getCriticidadColor(row.criticidad),
                      fontWeight: 'bold',
                    }}
                  >
                    {row.criticidad}
                  </TableCell>
                  <TableCell>
                    <Chip label={row.estado} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{row.fechaRegistro}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
