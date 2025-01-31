import { parseFrenchDate } from './dates';
import { format } from 'date-fns';

export function checkImageRights(startDate: string | null, endDate: string | null): boolean {
  const now = new Date();
  
  // Si aucune date n'est définie, l'image est considérée comme active
  if (!startDate && !endDate) return true;
  
  const start = parseFrenchDate(startDate);
  const end = parseFrenchDate(endDate);
  
  // Log pour le debugging
  console.log('Checking image rights:', {
    startDate,
    endDate,
    parsedStart: start?.toISOString(),
    parsedEnd: end?.toISOString(),
    now: now.toISOString()
  });

  // L'image n'est active que si elle a une date de début ET une date de fin
  // ET que la date actuelle est comprise entre les deux
  if (!start || !end) return false;
  
  const isActive = now >= start && now <= end;
  
  console.log('Rights check result:', {
    isActive,
    beforeStart: now < start,
    afterEnd: now > end,
    startFormatted: format(start, 'dd/MM/yyyy'),
    endFormatted: format(end, 'dd/MM/yyyy'),
    nowFormatted: format(now, 'dd/MM/yyyy')
  });
  
  return isActive;
}