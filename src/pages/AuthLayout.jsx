import { Box, Paper, Typography } from '@mui/material';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2, bgcolor: 'background.default' }}>
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 440 }}>
        <Typography variant="h6" color="primary" gutterBottom>LearnHub</Typography>
        <Typography variant="h4">{title}</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>{subtitle}</Typography>
        {children}
      </Paper>
    </Box>
  );
}
