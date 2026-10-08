import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { lessonsByCourse } from '../data/mockData';
import { CardGrid, ProgressBar, StatusChip, Empty } from '../components/Common';
import { statsOf } from '../utils/progress';

export default function MyCourses() {
  const { enrollments, courses } = useApp();
  const items = [...enrollments].sort((a, b) => b.lastAccessed.localeCompare(a.lastAccessed));
  return (
    <Box>
      <Typography variant="h4" gutterBottom>My courses</Typography>
      {items.length === 0 ? <Empty text="You have not enrolled in any course yet." /> : (
        <CardGrid min={340}>{items.map(e => {
          const c = courses.find(x => x.id === e.courseId), ls = lessonsByCourse[c.id], s = statsOf(e, ls.length);
          const last = ls.find(l => l.id === e.lastLessonId);
          return (
            <Card key={c.id} variant="outlined"><CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="h6">{c.title}</Typography><StatusChip status={s.status} /></Box>
              <Typography variant="body2" color="text.secondary">{c.instructor}, {c.category}, course {c.status}</Typography>
              <Box sx={{ my: 1.5 }}><ProgressBar value={s.progress} /></Box>
              <Typography variant="body2">{s.done} of {s.total} lessons completed</Typography>
              <Typography variant="body2">Last lesson: {last?.title}</Typography>
              <Typography variant="body2">Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}</Typography>
            </CardContent>
            <CardActions>
              <Button component={Link} to={`/courses/${c.id}/lessons`} variant="contained" size="small">Continue learning</Button>
              <Button component={Link} to={`/courses/${c.id}`} size="small">View course</Button>
            </CardActions></Card>
          );
        })}</CardGrid>
      )}
    </Box>
  );
}
