'use strict';
const toggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('main-nav');
const closeMenu = () => { if (!toggle || !navigation) return; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); navigation.classList.remove('is-open'); };
toggle?.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); navigation.classList.toggle('is-open', open); });
document.addEventListener('keydown', event => { if(event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if(toggle && navigation && !navigation.contains(event.target) && !toggle.contains(event.target)) closeMenu(); });
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.matchMedia('(min-width:761px)').addEventListener('change', closeMenu);

const projectCards = [...document.querySelectorAll('.repo-card')];
const search = document.getElementById('repository-search');
let selectedFilter = 'all';
function filterRepositories() {
  const query = (search?.value || '').trim().toLowerCase();
  let visible = 0;
  projectCards.forEach(card => {
    card.hidden = (selectedFilter !== 'all' && card.dataset.category !== selectedFilter) || !card.dataset.search.includes(query);
    if (!card.hidden) visible++;
  });
  const status = document.getElementById('filter-status');
  if (status) status.textContent = visible + (visible === 1 ? ' repository shown.' : ' repositories shown.');
  const empty = document.getElementById('repository-empty');
  if (empty) empty.hidden = visible !== 0;
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  selectedFilter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => { const selected = item === button; item.classList.toggle('is-active', selected); item.setAttribute('aria-pressed', String(selected)); });
  filterRepositories();
}));
search?.addEventListener('input', filterRepositories);
const concepts = {"circlechat":{"title":"CircleChat","description":"A small-circle messenger combining a mobile client, persistent conversations and real-time communication.","scope":["Small-group messaging without relying on phone numbers.","Circles, invites, direct messaging and circle conversations.","Repository: CircleChat","Private repository; source access is restricted.","Cover: original project illustration."]},"batch-file-converter":{"title":"BatchMorph Pro","description":"Batch document and image conversion, with a React interface and server-side processing.","scope":["Document and image conversion workflows.","Work across runtime dependencies, deployment and large-file handling.","Repository: batch-file-converter","Private repository; source access is restricted.","Cover: original project illustration."]},"fandomverse":{"title":"FandomVerse","description":"A responsive fan discovery interface with navigation, search, authentication and cart interactions.","scope":["Responsive interface work across mobile and desktop.","Navigation, modals, toast notifications and cart UI.","Repository: fandomverse","Private repository; source access is restricted.","Cover: original project illustration."]},"livefit-ai":{"title":"Livefit-AI","description":"A research project exploring garment rendering, virtual try-on and generative AI workflows.","scope":["Garment-rendering experiments and model research.","Exploring realism, compute constraints and live webcam ideas.","Research experiment; no production-release claim.","Repository: Livefit-Ai","Private repository; source access is restricted.","Cover: original project illustration."]},"uninestpakistan":{"title":"UniNest Pakistan","description":"An educational team project for student hostel discovery, bookings and roommate finding in Pakistan.","scope":["Educational team project; this portfolio does not claim sole authorship.","Hostel discovery, bookings, reviews and administration.","Repository: UninestPakistan","Public repository; source available on GitHub.","Cover: original project illustration."]},"careswitch":{"title":"CareSwitch","description":"A student communication-board prototype with phrase buttons, multilingual speech and optional head-control interactions.","scope":["Personal student prototype with a live browser demo.","Camera use is optional; face-landmark processing runs on device.","No clinical validation or emergency-use claims.","Repository: careswitch","Public repository; source available on GitHub.","Cover: original project illustration."]},"maalbot":{"title":"MaalBot","description":"A conversational project exploring financial learning in Roman Urdu and English, with a savings calculator.","scope":["Financial-learning chatbot concept and calculator interactions.","Early prototype; its outputs are educational.","Repository: maalbot","Private repository; source access is restricted.","Cover: original project illustration."]}};
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
  const service = document.getElementById('service');
  const requested = new URLSearchParams(location.search).get('service');
  if(['landing','website','updates','mobile','ai','other'].includes(requested)) service.value = requested;
  const message = document.getElementById('message');
  const count = document.getElementById('message-count');
  message.addEventListener('input', () => { count.textContent = `${message.value.length} / 3000`; message.setCustomValidity(''); });
  const result = document.getElementById('inquiry-result');
  const personName = document.getElementById('name');
  personName.addEventListener('input', () => personName.setCustomValidity(''));
  const sendButton = document.getElementById('send-inquiry');
  const deliveryStatus = document.getElementById('inquiry-delivery-status');
  const previewNote = document.getElementById('inquiry-preview-note');
  const editButton = document.getElementById('edit-inquiry');
  let sending = false;
  let sent = false;
  let emailValues = null;
  let inquiry = '';
  form.addEventListener('submit', event => {
    event.preventDefault();
    if(sending || sent) return;
    if(!personName.value.trim()) { personName.setCustomValidity('Please enter your name.'); personName.reportValidity(); return; }
    personName.setCustomValidity('');
    if(message.value.trim().length < 10) { message.setCustomValidity('Please describe your project in at least 10 characters.'); message.reportValidity(); return; }
    message.setCustomValidity('');
    if(!form.reportValidity()) return;
    const data = new FormData(form);
    emailValues = {name:String(data.get('name')).trim(),email:String(data.get('email')).trim(),service:service.selectedOptions[0].textContent,budget:String(data.get('budget')),timeline:String(data.get('timeline')).trim() || 'Not specified',message:String(data.get('message')).trim()};
    const entries = [['Name',String(data.get('name')).trim()],['Email',String(data.get('email')).trim()],['Service',service.selectedOptions[0].textContent],['Budget',String(data.get('budget'))],['Timeline',String(data.get('timeline')).trim() || 'Not specified'],['Project',String(data.get('message')).trim()]];
    const summary = document.getElementById('inquiry-summary');
    summary.replaceChildren(...entries.flatMap(([label,value]) => { const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = label; dd.textContent = value; return [dt,dd]; }));
    inquiry = `SYED KAIF ALI — INQUIRY COPY\nThis copy does not confirm email delivery.\n\n${entries.map(([label,value]) => `${label}: ${value}`).join('\n\n')}`;
    deliveryStatus.textContent = '';
    sendButton.disabled = false;
    form.hidden = true; result.hidden = false; result.focus({preventScroll:true}); result.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'center'});
  });
  editButton.addEventListener('click', () => { if(sending || sent) return; result.hidden = true; form.hidden = false; document.getElementById('name').focus(); });
  sendButton.addEventListener('click', async () => {
    if(sending || sent || !emailValues) return;
    sending = true;
    sendButton.disabled = true;
    editButton.disabled = true;
    result.setAttribute('aria-busy','true');
    deliveryStatus.textContent = 'Sending your inquiry…';
    try {
      await window.sendKaifInquiry(emailValues, window.KAIF_EMAILJS_CONFIG);
      sent = true;
      sendButton.textContent = 'Inquiry sent ✓';
      previewNote.textContent = 'Your inquiry has been submitted. You can keep a copy of the details below.';
      deliveryStatus.textContent = 'Your inquiry was accepted for email delivery. Thank you for sharing your project.';
    } catch {
      deliveryStatus.textContent = 'We couldn’t confirm the send. Your details are still here. Try again, or email syedkaifali96@gmail.com directly.';
    } finally {
      sending = false;
      result.setAttribute('aria-busy','false');
      sendButton.disabled = sent;
      editButton.disabled = sent;
    }
  });
  document.getElementById('download-inquiry').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([inquiry], {type:'text/plain;charset=utf-8'})); const a = document.createElement('a'); a.href=url; a.download='kaif-website-inquiry.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000); });
}
