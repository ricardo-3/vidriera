export function lessonUrl(id) { return './temas/' + id + '.html'; }

export function parseRoute(hash, order) {
  const value = String(hash || '').replace(/^#/, '');
  const match = /^(?:\/tema\/|lesson-)(S\d{2})$/.exec(value) || /(?:^|\/)temas\/(S\d{2})\.html$/.exec(value);
  if (match && order.includes(match[1])) return {page: 'lesson', id: match[1]};
  if (value === '/cierre') return {page: 'finish'};
  if (value === 'course' || value === '/curso') return {page: 'entry'};
  if (value === '/indice') return {page: 'overview'};
  return {page: 'home', anchor: value === 'about' ? 'about' : 'top'};
}

export function resolveRoute(route, state, order) {
  const available = order[Math.min(state.completed.length, order.length - 1)];
  if(route.page==='entry') {
    const last=order.indexOf(state.lastLesson);
    return {page:'lesson',id:last>=0&&last<=state.completed.length?state.lastLesson:available,entry:true};
  }
  if (route.page === 'lesson' && order.indexOf(route.id) > state.completed.length) {
    return {page: 'lesson', id: available, redirected: true};
  }
  if (route.page === 'finish' && state.completed.length < order.length) {
    return {page: 'lesson', id: available, redirected: true};
  }
  return route;
}
