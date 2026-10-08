export const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);
export const statusOf = p => (p === 100 ? 'Completed' : p > 0 ? 'In Progress' : 'Not Started');
export const statsOf = (e, total) => {
  const done = Object.keys(e.completed).length, progress = pct(done, total);
  return { done, total, remaining: total - done, progress, status: statusOf(progress) };
};
