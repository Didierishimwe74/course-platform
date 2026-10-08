import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button, Paper, List, Chip, Alert } from '@mui/material';
import { useApp } from '../context/AppContext';
import { lessonsByCourse } from '../data/mockData';
import { StatusChip, LessonItem, ProgressBar } from '../components/Common';
import { statsOf } from '../utils/progress';

function EnrollmentButton({ courseId, enrolled }) {
  const { enroll } = useApp();
  return enrolled
    ? <Button variant="contained" component={Link} to={`/courses/${courseId}/lessons`}>Continue learning</Button>
    : <Button variant="contained" onClick={() => enroll(courseId)}>Enroll now</Button>;
}

export default function CourseDetails() {
  const { courseId } = useParams();
  const { courses, getEnrollment } = useApp();
  const c = courses.find(x => x.id === courseId);
  if (!c) return <Alert severity="error">Course not found. <Link to="/courses">Back to courses</Link></Alert>;
  const lessons = lessonsByCourse[c.id], e = getEnrollment(c.id);
  const s = e && statsOf(e, lessons.length);

  return (
    <Box sx={{ maxWidth: 900 }}>
      <Typography variant="h4">{c.title}</Typography>
      <Typography color="text.secondary" gutterBottom>{c.code} by {c.instructor}</Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 1 }}>
        <Chip label={c.category} /><Chip label={c.level} /><Chip label={`${c.durationHours}h`} /><Chip label={`${c.lessonCount} lessons`} /><Chip label={`Rating ${c.rating}`} /><StatusChip status={c.status} />
      </Box>
      <Typography sx={{ my: 2 }}>{c.description}</Typography>
      <Typography variant="h6">Learning objectives</Typography>
      <ul>{c.objectives.map(o => <li key={o}>{o}</li>)}</ul>
      <Typography><b>Prerequisites:</b> {c.prerequisites}</Typography>
      <Box sx={{ my: 2 }}>{s && <ProgressBar value={s.progress} />}</Box>
      <EnrollmentButton courseId={c.id} enrolled={!!e} />
      <Typography variant="h6" sx={{ mt: 3 }}>Course content</Typography>
      <Paper variant="outlined"><List>{lessons.map(l => <LessonItem key={l.id} lesson={l} done={!!e?.completed[l.id]} />)}</List></Paper>
    </Box>
  );
}
