export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function toISODateString(date: string): string {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
}

export function fromISODateString(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}