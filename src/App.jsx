import { useState } from 'react';
import { Routes, Route, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Badge, Button, useMediaQuery, useTheme } from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Explore from '@mui/icons-material/Explore';
import Library from '@mui/icons-material/LibraryBooks';
import Insights from '@mui/icons-material/Insights';
import Award from '@mui/icons-material/WorkspacePremium';
import Person from '@mui/icons-material/Person';
import { useApp, AppProvider } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Lessons from './pages/Lessons';
import MyCourses from './pages/MyCourses';
import Progress from './pages/Progress';
import Certificates from './pages/Certificates';
import Profile from './pages/Profile';

const W = 230;
function Layout() {
  const [open, setOpen] = useState(false);
  const { enrollments } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };
  const desktop = useMediaQuery(useTheme().breakpoints.up('md'));
  const nav = [['/courses', 'Courses', <Explore />], ['/my-courses', 'My Courses', <Badge badgeContent={enrollments.length} color="secondary"><Library /></Badge>], ['/progress', 'Learning Progress', <Insights />], ['/certificates', 'Certificates', <Award />], ['/profile', 'Profile', <Person />]];
  const drawer = (
    <Box sx={{ width: W }}>
      <Toolbar><Typography variant="h6" color="primary">LearnHub</Typography></Toolbar>
      <List>{nav.map(([to, label, icon]) => (
        <ListItemButton key={to} component={NavLink} to={to} onClick={() => setOpen(false)} sx={{ '&.active': { bgcolor: 'action.selected' } }}>
          <ListItemIcon>{icon}</ListItemIcon><ListItemText primary={label} />
        </ListItemButton>))}</List>
    </Box>
  );
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: t => t.zIndex.drawer + 1 }}>
        <Toolbar>
          {!desktop && <IconButton color="inherit" edge="start" aria-label="Open menu" onClick={() => setOpen(true)}><MenuIcon /></IconButton>}
          <Typography variant="h6" sx={{ ml: 1, flex: 1 }} noWrap>Online Course Management Platform</Typography>
          {desktop && <Typography variant="body2" sx={{ mr: 2 }}>{user.fullName}</Typography>}
          {desktop ? <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>Log out</Button>
            : <IconButton color="inherit" aria-label="Log out" onClick={handleLogout}><Logout /></IconButton>}
        </Toolbar>
      </AppBar>
      <Drawer variant={desktop ? 'permanent' : 'temporary'} open={desktop || open} onClose={() => setOpen(false)} sx={{ width: desktop ? W : 0, '& .MuiDrawer-paper': { width: W } }}>{drawer}</Drawer>
      <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 2, md: 3 }, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

// Providers that need a logged-in user live here, keyed so each user gets their own data.
function Shell() {
  const { user } = useAuth();
  return <AppProvider key={user.id} user={user}><Layout /></AppProvider>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<Shell />}>
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />
          <Route path="/courses/:courseId/lessons" element={<Lessons />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/courses" replace />} />
      <Route path="*" element={<Navigate to="/courses" replace />} />
    </Routes>
  );
}
