export const categories = ['Web Development','Programming','Database','Networking','Cybersecurity','Data Science','Mobile Development','Computer Applications','Design','Cloud Computing'];
export const instructors = ['Dr. Alice Uwase','Prof. Eric Mugisha','Jane Ingabire','Patrick Habimana','Sandra Mukamana','David Nshuti','Grace Uwimana','Samuel Kalisa','Chantal Irakoze','Robert Niyonzima'];
export const levels = ['Beginner','Intermediate','Advanced'];
export const statuses = ['Active','Upcoming','Archived'];
const T = [['React.js Fundamentals',0],['JavaScript Programming',1],['Web Design',8],['Database Fundamentals',2],['Computer Networking',3],['Cybersecurity Fundamentals',4],['Python Programming',1],['Mobile Application Development',6],['Data Analysis',5],['UI/UX Design',8],['HTML & CSS Essentials',0],['Node.js Basics',0],['SQL for Beginners',2],['Network Security',4],['Machine Learning Intro',5],['Flutter App Development',6],['Microsoft Excel Mastery',7],['Cloud Computing Basics',9],['Java Programming',1],['Linux Administration',3]];
const types = ['Video','Reading','Presentation','Practical','Quiz','Video'];

export const courses = T.map(([title, c], i) => ({
  id: `c${i + 1}`, title, code: `${categories[c].slice(0, 3).toUpperCase()}${101 + i}`,
  category: categories[c], instructor: instructors[i % 10], level: levels[i % 3],
  durationHours: 6 + (i % 5) * 3, lessonCount: 6, rating: +(4 + ((i * 7) % 10) / 10).toFixed(1),
  students: 120 + i * 37, status: i === 18 ? 'Archived' : i === 19 ? 'Upcoming' : 'Active',
  description: `A practical ${title} course with hands-on lessons, quizzes and mini projects.`,
  objectives: [`Understand the core ideas of ${title}`, 'Apply concepts in practical exercises', 'Complete a small project'],
  prerequisites: i % 3 === 0 ? 'None' : 'Basic computer skills',
}));

export const lessonsByCourse = Object.fromEntries(courses.map(c => [c.id, Array.from({ length: c.lessonCount }, (_, k) => ({
  id: `${c.id}-l${k + 1}`, number: k + 1, title: `${c.title}: Part ${k + 1}`, type: types[k],
  description: `Lesson ${k + 1} of ${c.title}.`, duration: 15 + k * 5,
  content: `Mock content for lesson ${k + 1}. Follow the ${types[k].toLowerCase()} activity, then mark the lesson as completed.`,
}))]));

const daysAgo = n => new Date(Date.now() - n * 864e5).toISOString();
export const seedEnrollments = () => courses.slice(0, 10).map((c, i) => {
  const n = [6, 6, 6, 4, 2, 5, 1, 3, 0, 2][i], ls = lessonsByCourse[c.id], completed = {};
  ls.slice(0, n).forEach((l, k) => { completed[l.id] = daysAgo(55 - i * 3 - k * 2); });
  const last = n ? completed[ls[n - 1].id] : daysAgo(58 - i * 3);
  return { courseId: c.id, enrolledAt: daysAgo(60 - i * 3), completed, lastLessonId: ls[Math.min(n, 5)].id, lastAccessed: last, completedAt: n === 6 ? last : null };
});

export const defaultProfile = user => ({
  studentId: `STU-2026-${String(user.id).replace(/\D/g, '').slice(-3).padStart(3, '0') || '014'}`,
  regNo: `RP/KAR/26/${String(user.id).replace(/\D/g, '').slice(-4).padStart(4, '0') || '0142'}`,
  fullName: user.fullName, email: user.email, phone: user.phone,
  programme: 'Information Technology', level: 'Level 6', academicYear: '2026/2027',
});
