import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Alert, Typography } from '@mui/material';
import { useAuth, DEMO_ACCOUNT } from '../context/AuthContext';
import AuthLayout from './AuthLayout';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/courses';
  const [f, setF] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const change = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const submit = async ev => {
    ev.preventDefault();
    const er = {};
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email address';
    if (!f.password) er.password = 'Enter your password';
    setErrors(er); setFormError('');
    if (Object.keys(er).length) return;
    setBusy(true);
    const r = await login(f.email, f.password);
    setBusy(false);
    if (r.ok) navigate(from, { replace: true }); else setFormError(r.error);
  };

  return (
    <AuthLayout title="Log in" subtitle="Log in to continue learning.">
      {from !== '/courses' && <Alert severity="info" sx={{ mb: 2 }}>Log in to open that page.</Alert>}
      {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
      <Box component="form" onSubmit={submit} noValidate sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Email" type="email" autoComplete="email" value={f.email} onChange={change('email')} error={!!errors.email} helperText={errors.email} />
        <TextField label="Password" type="password" autoComplete="current-password" value={f.password} onChange={change('password')} error={!!errors.password} helperText={errors.password} />
        <Button type="submit" variant="contained" size="large" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</Button>
        <Typography variant="body2">No account yet? <Link to="/signup">Sign up</Link></Typography>
        <Button size="small" onClick={() => setF({ email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password })}>Fill demo account (has sample progress)</Button>
      </Box>
    </AuthLayout>
  );
}
