import { useState, useMemo } from 'react';
import { Box, Typography, TextField, MenuItem, Button } from '@mui/material';
import { useApp } from '../context/AppContext';
import { categories, levels, statuses } from '../data/mockData';
import { CourseCard, CardGrid, Empty } from '../components/Common';


const init = { q: '', category: '', level: '', duration: '', status: '', sort: 'title' };
const bucket = h => (h <= 8 ? 'Short' : h <= 14 ? 'Medium' : 'Long');

export default function Courses() {
  const { courses, getEnrollment } = useApp();
  const [f, setF] = useState(init);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const list = useMemo(() => {
    const q = f.q.toLowerCase();
    return courses
      .filter(c => [c.title, c.code, c.instructor, c.category].some(s => s.toLowerCase().includes(q)))
      .filter(c => (!f.category || c.category === f.category) && (!f.level || c.level === f.level) && (!f.status || c.status === f.status) && (!f.duration || bucket(c.durationHours) === f.duration))
      .sort((a, b) => f.sort === 'title' ? a.title.localeCompare(b.title) : f.sort === 'rating' ? b.rating - a.rating : f.sort === 'duration' ? a.durationHours - b.durationHours : b.students - a.students);
  }, [courses, f]);

  const sel = (label, key, opts) => (
    <TextField select size="small" label={label} value={f[key]} onChange={set(key)} sx={{ minWidth: 140 }}>
      <MenuItem value="">All</MenuItem>{opts.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
    </TextField>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Courses</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
        <TextField size="small" label="Search title, code, instructor, category" value={f.q} onChange={set('q')} sx={{ minWidth: 280 }} />
        {sel('Category', 'category', categories)}{sel('Level', 'level', levels)}
        {sel('Duration', 'duration', ['Short', 'Medium', 'Long'])}{sel('Status', 'status', statuses)}
        <TextField select size="small" label="Sort by" value={f.sort} onChange={set('sort')} sx={{ minWidth: 150 }}>
          <MenuItem value="title">Course name</MenuItem><MenuItem value="rating">Rating</MenuItem>
          <MenuItem value="duration">Duration</MenuItem><MenuItem value="students">Students</MenuItem>
        </TextField>
        <Button onClick={() => setF(init)}>Clear filters</Button>
      </Box>
      {list.length === 0 ? <Empty text="No courses found. Try clearing the filters." /> :
        <CardGrid>{list.map(c => <CourseCard key={c.id} course={c} enrolled={!!getEnrollment(c.id)} />)}</CardGrid>}
    </Box>
  );
}
