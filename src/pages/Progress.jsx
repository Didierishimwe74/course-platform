import { useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import School from '@mui/icons-material/School';
import Done from '@mui/icons-material/TaskAlt';
import Pending from '@mui/icons-material/HourglassTop';
import Menu from '@mui/icons-material/MenuBook';
import Check from '@mui/icons-material/CheckCircle';
import Trend from '@mui/icons-material/TrendingUp';
import { useApp } from '../context/AppContext';
import { lessonsByCourse } from '../data/mockData';
import { CardGrid, StatCard } from '../components/Common';
import { statsOf } from '../utils/progress';

export default function Progress() {
  const { enrollments, courses } = useApp();
  const rows = useMemo(() => enrollments.map(e => {
    const c = courses.find(x => x.id === e.courseId);
    return { id: c.id, course: c.title, ...statsOf(e, lessonsByCourse[c.id].length) };
  }), [enrollments, courses]);

  const t = useMemo(() => {
    const total = rows.reduce((a, r) => a + r.total, 0), done = rows.reduce((a, r) => a + r.done, 0);
    return {
      total, done, completed: rows.filter(r => r.status === 'Completed').length, inProg: rows.filter(r => r.status === 'In Progress').length,
      avg: rows.length ? Math.round(rows.reduce((a, r) => a + r.progress, 0) / rows.length) : 0, overall: total ? Math.round((done / total) * 100) : 0,
    };
  }, [rows]);

  const line = useMemo(() => {
    const byDay = {};
    enrollments.forEach(e => Object.values(e.completed).forEach(d => { const k = d.slice(0, 10); byDay[k] = (byDay[k] || 0) + 1; }));
    let sum = 0;
    return Object.keys(byDay).sort().map(k => ({ date: k.slice(5), lessons: (sum += byDay[k]) }));
  }, [enrollments]);

  const recent = [...enrollments].sort((a, b) => b.lastAccessed.localeCompare(a.lastAccessed)).slice(0, 3).map(e => courses.find(c => c.id === e.courseId).title);
  const pie = [{ name: 'Completed', value: t.done }, { name: 'Remaining', value: t.total - t.done }];
  const cols = [
    { field: 'course', headerName: 'Course', flex: 1, minWidth: 200 }, { field: 'total', headerName: 'Total', width: 90 },
    { field: 'done', headerName: 'Completed', width: 110 }, { field: 'remaining', headerName: 'Remaining', width: 110 },
    { field: 'progress', headerName: 'Progress %', width: 110 }, { field: 'status', headerName: 'Status', width: 130 },
  ];
  const box = (title, child) => <Paper variant="outlined" sx={{ p: 2 }}><Typography variant="subtitle1" gutterBottom>{title}</Typography><Box sx={{ height: 280 }}>{child}</Box></Paper>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Learning progress</Typography>
      <CardGrid min={200}>
        <StatCard label="Enrolled courses" value={rows.length} icon={<School />} /> 
        <StatCard label="Completed courses" value={t.completed} icon={<Done />} />
        <StatCard label="In progress" value={t.inProg} icon={<Pending />} />
        <StatCard label="Total lessons" value={t.total} icon={<Menu />} />
        <StatCard label="Completed lessons" value={t.done} icon={<Check />} />
        <StatCard label="Overall progress" value={`${t.overall}%`} icon={<Trend />} />
      </CardGrid>
      <Typography sx={{ my: 2 }}>Average course progress: {t.avg}%. Recently accessed: {recent.join(', ') || 'none'}.</Typography>
      <Box sx={{ height: 420, mb: 3 }}><DataGrid rows={rows} columns={cols} pageSizeOptions={[5, 10]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} /></Box>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
        {box('Progress by course', <ResponsiveContainer><BarChart data={rows}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="id" /><YAxis domain={[0, 100]} /><Tooltip /><Bar dataKey="progress" fill="#1F5F6B" /></BarChart></ResponsiveContainer>)}
        {box('Overall learning progress', <ResponsiveContainer><PieChart><Pie data={pie} dataKey="value" innerRadius={60} outerRadius={95}><Cell fill="#2E7D32" /><Cell fill="#CFD8DC" /></Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>)}
        {box('Lessons completed over time', <ResponsiveContainer><LineChart data={line}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="lessons" stroke="#E08A00" strokeWidth={2} /></LineChart></ResponsiveContainer>)}
      </Box>
    </Box>
  );
}
