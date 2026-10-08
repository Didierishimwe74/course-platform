import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Alert, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AuthLayout from './AuthLayout';

const validate = f => {
  const e = {};
  if (f.fullName.trim().length < 3) e.fullName = 'Enter your full name (at least 3 characters)';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address';
  if (!/^\+?\d{9,13}$/.test(f.phone)) e.phone = 'Enter 9 to 13 digits, e.g. +250780000000';
  if (f.password.length < 8 || !/\d/.test(f.password) || !/[A-Za-z]/.test(f.password)) e.password = 'Use at least 8 characters with letters and numbers';
  if (f.confirm !== f.password) e.confirm = 'Passwords do not match';
  return e;
};

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const change = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const submit = async ev => {
    ev.preventDefault();
    const er = validate(f);
    setErrors(er); setFormError('');
    if (Object.keys(er).length) return;
    setBusy(true);
    const r = await signup(f);
    setBusy(false);
    if (r.ok) navigate('/courses', { replace: true }); else setFormError(r.error);
  };

  const field = (label, k, extra = {}) => (
    <TextField label={label} value={f[k]} onChange={change(k)} error={!!errors[k]} helperText={errors[k]} {...extra} />
  );

  return (
    <AuthLayout title="Create account" subtitle="Sign up to enroll in courses and track your progress.">
      {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
      <Box component="form" onSubmit={submit} noValidate sx={{ display: 'grid', gap: 2 }}>
        {field('Full name', 'fullName', { autoComplete: 'name' })}
        {field('Email', 'email', { type: 'email', autoComplete: 'email' })}
        {field('Phone', 'phone', { autoComplete: 'tel' })}
        {field('Password', 'password', { type: 'password', autoComplete: 'new-password' })}
        {field('Confirm password', 'confirm', { type: 'password', autoComplete: 'new-password' })}
        <Button type="submit" variant="contained" size="large" disabled={busy}>{busy ? 'Creating account...' : 'Sign up'}</Button>
        <Typography variant="body2">Already have an account? <Link to="/login">Log in</Link></Typography>
      </Box>
    </AuthLayout>
  );
}
