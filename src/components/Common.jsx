import { Box, Card, CardContent, CardActions, Typography, Chip, Button, LinearProgress, Rating, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import RadioButtonUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import { Link } from 'react-router-dom';

export const CardGrid = ({ children, min = 300 }) => (
  <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))` }}>{children}</Box>
);

const colors = { Completed: 'success', 'In Progress': 'warning', 'Not Started': 'default', Active: 'success', Upcoming: 'info', Archived: 'default' };
export const StatusChip = ({ status }) => <Chip size="small" label={status} color={colors[status] || 'default'} />;

export const ProgressBar = ({ value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <LinearProgress variant="determinate" value={value} sx={{ flex: 1, height: 8, borderRadius: 4 }} color={value === 100 ? 'success' : 'primary'} />
    <Typography variant="body2" sx={{ minWidth: 38 }}>{value}%</Typography>
  </Box>
);

export const StatCard = ({ label, value, icon }) => (
  <Card variant="outlined"><CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ color: 'primary.main' }}>{icon}</Box>
    <Box><Typography variant="h5" fontWeight={700}>{value}</Typography><Typography variant="body2" color="text.secondary">{label}</Typography></Box>
  </CardContent></Card>
);

export const CourseCard = ({ course: c, enrolled }) => (
  <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flex: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Chip size="small" label={c.category} variant="outlined" /><StatusChip status={c.status} />
      </Box>
      <Typography variant="h6">{c.title}</Typography>
      <Typography variant="body2" color="text.secondary">{c.code} ({c.id}) by {c.instructor}</Typography>
      <Typography variant="body2" sx={{ my: 1 }}>{c.description}</Typography>
      <Rating size="small" value={c.rating} precision={0.1} readOnly />
      <Typography variant="caption" display="block">{c.level}, {c.durationHours}h, {c.lessonCount} lessons, {c.students} students</Typography>
    </CardContent>
    <CardActions>
      <Button component={Link} to={`/courses/${c.id}`}>View details</Button>
      {enrolled && <Chip size="small" color="primary" label="Enrolled" />}
    </CardActions>
  </Card>
);

export const LessonItem = ({ lesson, done, active, onClick }) => (
  <ListItemButton selected={active} onClick={onClick}>
    <ListItemIcon>{done ? <CheckCircle color="success" /> : <RadioButtonUnchecked />}</ListItemIcon>
    <ListItemText primary={`${lesson.number}. ${lesson.title}`} secondary={`${lesson.type}, ${lesson.duration} min`} />
    <Tooltip title={done ? 'Completed' : 'Not completed'}><Chip size="small" label={done ? 'Done' : 'To do'} color={done ? 'success' : 'default'} /></Tooltip>
  </ListItemButton>
);

export const Empty = ({ text }) => <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}><Typography>{text}</Typography></Box>;
