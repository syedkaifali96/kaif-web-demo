'use strict';
const toggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('main-nav');
const closeMenu = () => { if (!toggle || !navigation) return; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); navigation.classList.remove('is-open'); };
toggle?.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); navigation.classList.toggle('is-open', open); });
document.addEventListener('keydown', event => { if(event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if(toggle && navigation && !navigation.contains(event.target) && !toggle.contains(event.target)) closeMenu(); });
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.matchMedia('(min-width:761px)').addEventListener('change', closeMenu);

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => { const selected = item === button; item.classList.toggle('is-active', selected); item.setAttribute('aria-pressed', String(selected)); });
  let visible = 0;
  document.querySelectorAll('[data-category]').forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; if(!card.hidden) visible++; });
  const status = document.getElementById('filter-status');
  if(status) status.textContent = `${visible} project${visible === 1 ? '' : 's'} shown.`;
}));

const concepts = {
  "uninest": {
    "title": "UniNest Pakistan",
    "description": "An educational team project exploring a student hostel and roommate finder for Pakistan. The project repository includes the application and setup notes.",
    "scope": [
      "Team educational project; this portfolio does not claim sole authorship",
      "Hostel discovery, bookings, reviews and administration",
      "Node.js / Express and SQLite; source available on GitHub"
    ]
  },
  "careswitch": {
    "title": "CareSwitch",
    "description": "My personal student prototype for a browser-based communication board, exploring phrase buttons, speech output and optional head-control interactions.",
    "scope": [
      "Personal educational prototype with a live browser demo",
      "Speech and interaction experiments; camera use is optional",
      "Experimental project, without clinical validation or emergency-use claims"
    ]
  }
};
const dialog = document.getElementById('project-dialog');
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = concepts[button.dataset.project]; if(!project || !dialog) return;
  document.getElementById('project-title').textContent = project.title;
  document.getElementById('project-description').textContent = project.description;
  const list = document.getElementById('project-scope'); list.replaceChildren(...project.scope.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  dialog.showModal();
}));
dialog?.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => { const rect = dialog.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); });

const form = document.getElementById('inquiry-form');
if(form) {
  const returnTo = form.querySelector('input[name="_next"]');
  if(returnTo && ['https:','http:'].includes(location.protocol)) {
    returnTo.value = new URL('contact.html?submitted=1', location.href).href;
  }
  const service = document.getElementById('service');
  const requested = new URLSearchParams(location.search).get('service');
  if(['landing','website','updates','other'].includes(requested)) service.value = requested;
  const message = document.getElementById('message');
  const count = document.getElementById('message-count');
  message.addEventListener('input', () => { count.textContent = `${message.value.length} / 3000`; message.setCustomValidity(''); });
  const result = document.getElementById('inquiry-result');
  const personName = document.getElementById('name');
  personName.addEventListener('input', () => personName.setCustomValidity(''));
  const sendButton = document.getElementById('send-inquiry');
  let sendRequested = false;
  let inquiry = '';
  form.addEventListener('submit', event => {
    if(sendRequested) return;
    event.preventDefault();
    if(!personName.value.trim()) { personName.setCustomValidity('Please enter your name.'); personName.reportValidity(); return; }
    personName.setCustomValidity('');
    if(message.value.trim().length < 10) { message.setCustomValidity('Please describe your project in at least 10 characters.'); message.reportValidity(); return; }
    message.setCustomValidity('');
    if(!form.reportValidity()) return;
    const data = new FormData(form);
    const entries = [['Name',String(data.get('name')).trim()],['Email',String(data.get('email')).trim()],['Service',service.selectedOptions[0].textContent],['Budget',String(data.get('budget'))],['Timeline',String(data.get('timeline')).trim() || 'Not specified'],['Project',String(data.get('message')).trim()]];
    const summary = document.getElementById('inquiry-summary');
    summary.replaceChildren(...entries.flatMap(([label,value]) => { const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = label; dd.textContent = value; return [dt,dd]; }));
    inquiry = `SYED KAIF ALI — INQUIRY COPY\nThis copy does not confirm email delivery.\n\n${entries.map(([label,value]) => `${label}: ${value}`).join('\n\n')}`;
    form.hidden = true; result.hidden = false; result.focus({preventScroll:true}); result.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'center'});
  });
  document.getElementById('edit-inquiry').addEventListener('click', () => { result.hidden = true; form.hidden = false; document.getElementById('name').focus(); });
  sendButton.addEventListener('click', () => {
    sendRequested = true;
    try { form.requestSubmit(); } finally { sendRequested = false; }
  });
  if(new URLSearchParams(location.search).get('submitted') === '1') {
    const notice = document.createElement('p');
    notice.className = 'submission-notice';
    notice.setAttribute('role','status');
    notice.textContent = 'Your inquiry was submitted. Thank you for sharing your project.';
    document.querySelector('.contact-intro').after(notice);
  }
  document.getElementById('download-inquiry').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([inquiry], {type:'text/plain;charset=utf-8'})); const a = document.createElement('a'); a.href=url; a.download='kaif-website-inquiry.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000); });
}
