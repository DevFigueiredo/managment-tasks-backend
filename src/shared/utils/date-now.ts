import { DateTime } from 'luxon';

export function DateNow() {
  return DateTime.now().setZone('America/Sao_Paulo').toJSDate();
}
