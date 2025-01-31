import { parse, isValid, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function parseFrenchDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;

  try {
    // Pour les dates au format JJ/MM/AAAA
    if (dateStr.includes('/')) {
      const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
      if (isValid(parsed)) return parsed;
    }
    
    // Pour les dates au format ISO
    const isoDate = new Date(dateStr);
    if (isValid(isoDate)) return isoDate;
    
    return null;
  } catch (error) {
    console.error('Error parsing date:', { dateStr, error });
    return null;
  }
}

export function formatFrenchDate(date: string): string {
  const parsed = parseFrenchDate(date);
  if (!parsed) return '';
  
  return format(parsed, 'dd MMMM yyyy', { locale: fr });
}