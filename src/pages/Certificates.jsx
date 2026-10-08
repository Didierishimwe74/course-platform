import { useState } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Dialog, DialogContent, DialogActions, Alert } from '@mui/material';
import { useApp } from '../context/AppContext';
import { lessonsByCourse } from '../data/mockData';
import { CardGrid, StatusChip, Empty } from '../components/Common';
import { statsOf } from '../utils/progress';

function CertificateCard({ cert, onView }) {
  return (
    <Card variant="outlined"><CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="h6">{cert.course.title}</Typography><StatusChip status="Completed" /></Box>
      <Typography variant="body2">Certificate {cert.id}, {cert.course.code}</Typography>
      <Typography variant="body2">Instructor: {cert.course.instructor}. Completed: {cert.date}</Typography>
    </CardContent><CardActions><Button onClick={() => onView(cert)}>View certificate</Button></CardActions></Card>
  );
}

export default function Certificates() {
  const { enrollments, courses, profile } = useApp();
  const [open, setOpen] = useState(null);
  const items = enrollments.map(e => {
    const course = courses.find(c => c.id === e.courseId), s = statsOf(e, lessonsByCourse[course.id].length);
    return { course, s, e, id: `CERT-${course.code}-${profile.studentId.slice(-3)}`, date: e.completedAt ? new Date(e.completedAt).toLocaleDateString() : '' };
  });
  const earned = items.filter(i => i.s.progress === 100), pending = items.filter(i => i.s.progress < 100);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Certificates</Typography>
      {earned.length === 0 ? <Empty text="No certificates yet." /> : <CardGrid>{earned.map(c => <CertificateCard key={c.id} cert={c} onView={setOpen} />)}</CardGrid>}
      {pending.length > 0 && <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Not yet available</Typography>}
      {pending.map(p => <Alert key={p.id} severity="info" sx={{ mb: 1 }}>{p.course.title}: Complete all lessons to receive your certificate ({p.s.progress}% done).</Alert>)}
      <Dialog open={!!open} onClose={() => setOpen(null)} maxWidth="md" fullWidth>
        {open && <DialogContent className="cert-print" sx={{ textAlign: 'center', p: 6, border: '8px double #1F5F6B', m: 2 }}>
          <Typography variant="h3" gutterBottom>Certificate of Completion</Typography>
          <Typography>This certifies that</Typography>
          <Typography variant="h4" sx={{ my: 2 }}>{profile.fullName}</Typography>
          <Typography>has successfully completed</Typography>
          <Typography variant="h5" sx={{ my: 2 }}>{open.course.title} ({open.course.code})</Typography>
          <Typography>Instructor: {open.course.instructor}</Typography>
          <Typography>Completion date: {open.date}</Typography>
          <Typography variant="caption">Certificate ID: {open.id}. Status: Issued</Typography>
        </DialogContent>}
        <DialogActions><Button onClick={() => window.print()}>Print or save as PDF</Button><Button onClick={() => setOpen(null)}>Close</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
