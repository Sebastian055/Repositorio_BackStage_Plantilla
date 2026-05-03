import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ApiIcon from '@mui/icons-material/Api';
import StorageIcon from '@mui/icons-material/Storage';
import PeopleIcon from '@mui/icons-material/People';

export const TableroResumen = () => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    setMetrics({
      totalIntegraciones: 24,
      activas: 18,
      altaCriticidad: 7,
      protocolosUsados: ['REST', 'SOAP', 'Kafka', 'GraphQL'],
      responsablesUnicos: 12,
    });
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <ApiIcon sx={{ fontSize: 48, color: '#2e7d32', mb: 1 }} />
            <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {metrics?.totalIntegraciones || 0}
            </Typography>
            <Typography sx={{ color: '#666' }}>Total integraciones</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <TrendingUpIcon sx={{ fontSize: 48, color: '#2e7d32', mb: 1 }} />
            <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {metrics?.activas || 0}
            </Typography>
            <Typography sx={{ color: '#666' }}>
              Integraciones activas
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <StorageIcon sx={{ fontSize: 48, color: '#d32f2f', mb: 1 }} />
            <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {metrics?.altaCriticidad || 0}
            </Typography>
            <Typography sx={{ color: '#666' }}>Alta criticidad</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <PeopleIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
            <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {metrics?.responsablesUnicos || 0}
            </Typography>
            <Typography sx={{ color: '#666' }}>Responsables</Typography>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Protocolos utilizados
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {metrics?.protocolosUsados.map((p: string) => (
                <Chip key={p} label={p} color="primary" variant="outlined" />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};
