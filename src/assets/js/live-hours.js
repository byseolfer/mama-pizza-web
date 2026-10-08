// Cartel de horarios: placa ABIERTO/CERRADO y día de hoy, con la hora de Madrid.
import { liveStatus } from './lib/hours.mjs';

const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : ''));

export function initLiveHours() {
  const sign = document.getElementById('times');
  if (!sign) return;
  const hours = JSON.parse(sign.dataset.hours);
  const tx = JSON.parse(sign.dataset.text);
  const flip = sign.querySelector('[data-live]');
  const sub = sign.querySelector('.live-sub');
  const dayName = (d) => tx.days[(d + 6) % 7];

  const update = () => {
    const s = liveStatus(hours, new Date());
    flip.hidden = false;
    flip.textContent = s.open ? tx.signOpen : tx.signClosed;
    flip.classList.toggle('closed', !s.open);
    const msg = s.kind === 'until' ? fill(tx.until, { time: s.time })
      : s.kind === 'today' ? fill(tx.opensToday, { time: s.time })
      : s.kind === 'next' ? fill(tx.opensOn, { time: s.time, day: dayName(s.nextDay), dayLc: dayName(s.nextDay).toLowerCase() })
      : '';
    sub.textContent = `${s.open ? tx.openNow : tx.closedNow} · ${msg}`;
    sign.querySelectorAll('.hours li').forEach((li) => {
      const isToday = Number(li.dataset.day) === s.today;
      li.classList.toggle('today', isToday);
      li.querySelector('span').toggleAttribute('data-today', isToday);
      if (isToday) li.querySelector('span').dataset.today = tx.today;
    });
  };
  update();
  setInterval(update, 60_000);
}
