export function getDateAndTime(time: Date) {
  const date = time.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
  const hour = time.toLocaleTimeString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
  return `${date} ${hour}`;
}