import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button, Paper, List, Alert, Chip } from '@mui/material';
import { useApp } from '../context/AppContext';
import { lessonsByCourse } from '../data/mockData';
import { LessonItem, ProgressBar, Empty } from '../components/Common';
import { statsOf } from '../utils/progress';

export default function Lessons() {
  const { courseId } = useParams();
  const { courses, getEnrollment, toggleLesson, openLesson } = useApp();
  const c = courses.find(x => x.id === courseId), e = getEnrollment(courseId);
  const lessons = lessonsByCourse[courseId] || [];
  const [currentId, setCurrentId] = useState(e?.lastLessonId || lessons[0]?.id);

  if (!c) return <Alert severity="error">Course not found.</Alert>;
  if (!e) return <Alert severity="warning" action={<Button component={Link} to={`/courses/${c.id}`}>Enroll</Button>}>Enroll in this course to open its lessons.</Alert>;
  if (!lessons.length) return <Empty text="No lessons available." />;

  const cur = lessons.find(l => l.id === currentId) || lessons[0], done = !!e.completed[cur.id], s = statsOf(e, lessons.length);
  return (
    <Box>
      <Typography variant="h4">{c.title}</Typography>
      <Box sx={{ my: 2, maxWidth: 500 }}><ProgressBar value={s.progress} /></Box>
      <Typography variant="body2" gutterBottom>{s.done} completed, {s.remaining} remaining</Typography>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '320px 1fr' } }}>
        <Paper variant="outlined"><List>{lessons.map(l => (
          <LessonItem key={l.id} lesson={l} done={!!e.completed[l.id]} active={l.id === cur.id} onClick={() => { setCurrentId(l.id); openLesson(c.id, l.id); }} />
        ))}</List></Paper>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Chip size="small" label={cur.type} sx={{ mb: 1 }} />
          <Typography variant="h5">{cur.number}. {cur.title}</Typography>
          <Typography color="text.secondary">{cur.duration} min. {cur.description}</Typography>
          <Typography sx={{ my: 3 }}>{cur.content}</Typography>
          <Button variant={done ? 'outlined' : 'contained'} color={done ? 'inherit' : 'success'} onClick={() => toggleLesson(c.id, cur.id)}>
            {done ? 'Reopen lesson' : 'Mark as completed'}
          </Button>
          {s.progress === 100 && <Button component={Link} to="/certificates" sx={{ ml: 1 }}>View certificate</Button>}
        </Paper>
      </Box>
    </Box>
  );
}
