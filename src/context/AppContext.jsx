import { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import useLocalStorage from '../hooks/useLocalStorage';
import { courses, lessonsByCourse, seedEnrollments, defaultProfile } from '../data/mockData';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [enrollments, setEnrollments] = useLocalStorage('ocmp_enrollments', seedEnrollments);
  const [profile, setProfile] = useLocalStorage('ocmp_profile', defaultProfile);
  const [toast, setToast] = useState(null);
  const notify = (message, severity = 'success') => setToast({ message, severity });
  const getEnrollment = id => enrollments.find(e => e.courseId === id);

  const enroll = id => {
    if (getEnrollment(id)) return notify('You are already enrolled in this course', 'info');
    const now = new Date().toISOString();
    setEnrollments(p => [...p, { courseId: id, enrolledAt: now, completed: {}, lastLessonId: lessonsByCourse[id][0].id, lastAccessed: now, completedAt: null }]);
    notify('Course enrolled successfully');
  };

  const openLesson = (id, lessonId) =>
    setEnrollments(p => p.map(e => (e.courseId === id ? { ...e, lastLessonId: lessonId, lastAccessed: new Date().toISOString() } : e)));

  const toggleLesson = (id, lessonId) => {
    const total = lessonsByCourse[id].length, now = new Date().toISOString();
    const e = getEnrollment(id), completed = { ...e.completed }, wasDone = !!completed[lessonId];
    if (wasDone) delete completed[lessonId]; else completed[lessonId] = now;
    const finished = Object.keys(completed).length === total;
    setEnrollments(p => p.map(x => (x.courseId === id ? { ...x, completed, lastLessonId: lessonId, lastAccessed: now, completedAt: finished ? x.completedAt || now : null } : x)));
    if (finished) notify('Course completed. Your certificate is available!');
    else notify(wasDone ? 'Lesson reopened' : 'Lesson completed', wasDone ? 'info' : 'success');
  };

  return (
    <Ctx.Provider value={{ courses, enrollments, getEnrollment, enroll, openLesson, toggleLesson, profile, setProfile, notify }}>
      {children}
      <Snackbar open={!!toast} autoHideDuration={3500} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        {toast ? <Alert severity={toast.severity} variant="filled" onClose={() => setToast(null)}>{toast.message}</Alert> : undefined}
      </Snackbar>
    </Ctx.Provider>
  );
}
