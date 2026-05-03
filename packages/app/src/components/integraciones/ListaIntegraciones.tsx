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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchIntegraciones = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'http://localhost:7007/api/integraciones/integraciones',
        );
        if (!response.ok) throw new Error('Error al cargar');
        const data = await response.json();
        setIntegraciones(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Error al cargar integraciones'),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIntegraciones();
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

  if (loading) return <Typography>Cargando...</Typography>;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

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
                    {row.aplicacionesInvolucradas?.map(a => (
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
