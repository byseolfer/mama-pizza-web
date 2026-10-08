// Horarios de MAMA PIZZA. Se usa en el build (Node) y en el navegador.
// Toda la lógica trabaja en hora de Madrid, sea cual sea la zona del dispositivo.

const WEEKDAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
});

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export function madridParts(date) {
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  return { day: WEEKDAYS[parts.weekday], minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export function liveStatus(hours, date) {
  const { day, minutes } = madridParts(date);
  const byDay = (d) => hours.find((h) => h.day === d);
  const today = byDay(day);
  if (today.open && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { open: true, today: day, kind: 'until', time: today.close };
  }
  if (today.open && minutes < toMinutes(today.open)) {
    return { open: false, today: day, kind: 'today', time: today.open };
  }
  for (let k = 1; k <= 7; k++) {
    const next = byDay((day + k) % 7);
    if (next.open) return { open: false, today: day, kind: 'next', time: next.open, nextDay: next.day };
  }
  return { open: false, today: day, kind: 'closed' };
}

const to12 = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

export function formatRange(open, close, clock) {
  return clock === '12' ? `${to12(open)} – ${to12(close)}` : `${open} – ${close}`;
}
