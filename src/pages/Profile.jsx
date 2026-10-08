import { useState } from 'react';
import { Box, Typography, TextField, Button, Avatar, Paper } from '@mui/material';
import { useApp } from '../context/AppContext';

const validate = f => {
  const e = {};
  if (f.fullName.trim().length < 3) e.fullName = 'Enter your full name (at least 3 characters)';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address';
  if (!/^\+?\d{9,13}$/.test(f.phone)) e.phone = 'Enter 9 to 13 digits, e.g. +250780000000';
  return e;
};

export default function Profile() {
  const { profile, setProfile, notify } = useApp();
  const [f, setF] = useState(profile);
  const [errors, setErrors] = useState({});
  const change = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const save = ev => {
    ev.preventDefault();
    const er = validate(f); setErrors(er);
    if (Object.keys(er).length) return notify('Fix the highlighted fields', 'error');
    setProfile(f); notify('Profile saved');
  };
  const ro = (label, k) => <TextField label={label} value={f[k]} slotProps={{ input: { readOnly: true } }} />;
  const ed = (label, k) => <TextField label={label} value={f[k]} onChange={change(k)} error={!!errors[k]} helperText={errors[k]} />;

  return (
    <Paper variant="outlined" sx={{ p: 3, maxWidth: 640 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>{f.fullName.charAt(0).toUpperCase()}</Avatar>
        <Typography variant="h4">Profile</Typography>
      </Box>
      <Box component="form" onSubmit={save} noValidate sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        {ro('Student ID', 'studentId')}{ro('Registration number', 'regNo')}
        {ed('Full name', 'fullName')}{ed('Email', 'email')}{ed('Phone', 'phone')}{ed('Programme', 'programme')}
        {ro('Level', 'level')}{ro('Academic year', 'academicYear')}
        <Box sx={{ gridColumn: '1 / -1' }}><Button type="submit" variant="contained">Save changes</Button></Box>
      </Box>
    </Paper>
  );
}
