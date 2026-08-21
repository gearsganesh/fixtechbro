(() => {
  const SUPABASE_URL = 'https://socglsgkdivewhvohlrh.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_vHq2kkVTOSVLr7qFdhBasQ_EWQyEOVX';
  const VISIT_SESSION_KEY = 'fixtechbro_visit_recorded_v1';
  const ENQUIRY_API = '/api/send-enquiry';

  const api = async (fn, body) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    });
    if (!response.ok) throw new Error(`Analytics request failed: ${response.status}`);
    return response.json();
  };

  const addStyles = () => {
    if (document.getElementById('ftb-analytics-style')) return;
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontLink);

    const style = document.createElement('style');
    style.id = 'ftb-analytics-style';
    style.textContent = `
      body{font-family:'Inter',system-ui,sans-serif!important;font-weight:400!important}
      body p,body li,body input,body select,body textarea{font-family:'Inter',system-ui,sans-serif!important;font-weight:400!important}
      h1,h2,h3,h4,h5,h6,.brand,.navcta,.btn,.service-body h3,.contact-card h2,.form-card h3,.platform-copy h2,.business h2,.section-head h2{font-family:'Space Grotesk',Inter,sans-serif!important;font-weight:600!important}
      .hero h1{font-weight:700!important}.navlinks{font-family:'Inter',system-ui,sans-serif!important;font-weight:500!important}
      label,.eyebrow,.service-no,.service-link,.ticker span,.hero-proof b,.hero-badge,.stamp,.contact-row span,.ftb-live-kicker,.ftb-live-label,.ftb-live-status{font-family:'DM Mono',monospace!important;font-weight:500!important}
      .brand small{font-family:'DM Mono',monospace!important;font-weight:400!important}.contact-row b,.contact-row a{font-family:'Inter',system-ui,sans-serif!important;font-weight:600!important}
      .hero-copy,.section-head p,.platform-copy>p,.business>div>p,.service-body p,.process-card p,.platform-item span,.business-point span,.contact-card>p{font-weight:400!important}
      .ftb-live-stats{background:#06111f;color:#f7f9fc;border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08);padding:26px 0}
      .ftb-live-inner{width:min(1240px,92%);margin:auto;display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:14px;align-items:stretch}
      .ftb-live-intro{padding:8px}.ftb-live-kicker{color:#ffc928;font-size:.64rem;letter-spacing:1.5px;text-transform:uppercase}.ftb-live-title{font-family:'Space Grotesk',Inter,sans-serif;font-size:clamp(1.35rem,2.4vw,2rem);font-weight:600;line-height:1;margin:6px 0}.ftb-live-copy{color:#9fb0c2;font-size:.76rem;max-width:390px}
      .ftb-live-card{border:1px solid rgba(255,255,255,.1);background:#0d2137;border-radius:14px;padding:18px;position:relative;overflow:hidden}.ftb-live-card:after{content:"";position:absolute;right:-30px;top:-35px;width:90px;height:90px;border-radius:50%;background:rgba(255,201,40,.07)}
      .ftb-live-number{font-family:'Space Grotesk',Inter,sans-serif;font-size:clamp(1.9rem,3.4vw,2.7rem);font-weight:700;letter-spacing:-1px;color:#ffc928;line-height:1}.ftb-live-label{display:block;margin-top:6px;font-size:.68rem;color:#d5dfeb;text-transform:uppercase;letter-spacing:.8px}.ftb-live-status{font-size:.59rem;color:#8fa2b6;margin-top:6px}.ftb-live-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#38d39f;margin-right:5px;box-shadow:0 0 0 4px rgba(56,211,159,.08)}
      .ftb-contact-email-note{color:#657487;font-size:.72rem;margin-top:12px;line-height:1.55}
      .ftb-contact-email-note a{color:#0a1725;text-decoration:underline;text-decoration-color:#ffc928;text-underline-offset:3px}
      .ftb-form-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:2px}
      .ftb-form-actions .btn{width:100%;margin:0}
      .ftb-email-btn{background:#fff!important;color:#0a1725!important;border:1px solid #d6dde5!important}
      .ftb-email-btn:hover{border-color:#ffc928!important}
      .ftb-email-status{font-size:.72rem;color:#4d6174;margin-top:2px;display:none}
      .ftb-email-status.show{display:block}
      @media(max-width:760px){.ftb-live-inner{grid-template-columns:1fr 1fr}.ftb-live-intro{grid-column:1/-1}.ftb-live-card{padding:16px}.ftb-form-actions{grid-template-columns:1fr}}
      @media(max-width:450px){.ftb-live-inner{grid-template-columns:1fr}.ftb-live-intro{grid-column:auto}}
    `;
    document.head.appendChild(style);
  };

  const createStats = () => {
    if (document.querySelector('.ftb-live-stats')) return;
    const section = document.createElement('section');
    section.className = 'ftb-live-stats';
    section.setAttribute('aria-label', 'FixTechBro live activity');
    section.innerHTML = `
      <div class="ftb-live-inner">
        <div class="ftb-live-intro"><div class="ftb-live-kicker">Live Activity</div><div class="ftb-live-title">FixTechBro in motion.</div><div class="ftb-live-copy">Real website activity. Visits and service enquiries update automatically.</div></div>
        <div class="ftb-live-card"><div class="ftb-live-number" id="ftb-visits">0</div><span class="ftb-live-label">Website Visits</span><div class="ftb-live-status"><span class="ftb-live-dot"></span>Live counter</div></div>
        <div class="ftb-live-card"><div class="ftb-live-number" id="ftb-enquiries">0</div><span class="ftb-live-label">Service Enquiries</span><div class="ftb-live-status"><span class="ftb-live-dot"></span>Live counter</div></div>
      </div>`;
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');
    if (header) header.after(section); else if (hero) hero.before(section); else document.querySelector('main')?.prepend(section);
  };

  const animateNumber = (element, target) => {
    if (!element) return;
    const end = Number(target) || 0;
    const start = Number(element.dataset.value || 0);
    const duration = 700;
    const startTime = performance.now();
    const step = now => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(start + (end - start) * eased).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(step);
    };
    element.dataset.value = String(end);
    requestAnimationFrame(step);
  };

  const showStats = data => {
    const row = Array.isArray(data) ? data?.[0] : data;
    if (!row) return;
    animateNumber(document.getElementById('ftb-visits'), row.visit_count);
    animateNumber(document.getElementById('ftb-enquiries'), row.enquiry_count);
  };

  const recordVisit = async () => {
    try {
      const alreadyRecorded = sessionStorage.getItem(VISIT_SESSION_KEY) === '1';
      const data = alreadyRecorded ? await api('get_site_stats') : await api('record_site_visit');
      if (!alreadyRecorded) sessionStorage.setItem(VISIT_SESSION_KEY, '1');
      showStats(data);
    } catch (error) { console.warn('FixTechBro analytics:', error.message); }
  };

  const getFormPayload = form => {
    const value = key => { const el = form.querySelector(`[name="${key}"], #${key}`); return el ? el.value.trim() : ''; };
    return {
      name: value('name') || value('fullName') || value('fullname'),
      phone: value('phone') || value('mobile') || value('contact'),
      service: value('service') || value('serviceType'),
      preferred_date: value('date') || value('preferred_date') || null,
      location: value('location') || 'Perambur, Chennai',
      message: value('message') || value('requirement') || value('details')
    };
  };

  const sendEnquiryByEmail = async form => {
    const status = form.querySelector('.ftb-email-status');
    const button = form.querySelector('.ftb-email-btn');
    const payload = getFormPayload(form);
    if (!payload.name || !payload.phone || !payload.service) {
      form.reportValidity();
      return;
    }

    try {
      if (button) { button.disabled = true; button.textContent = 'SENDING…'; }
      if (status) { status.textContent = 'Sending enquiry to Sachin and Ganesh…'; status.classList.add('show'); }

      const response = await fetch(ENQUIRY_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      });
      if (!response.ok) throw new Error(`Enquiry endpoint failed: ${response.status}`);
      const result = await response.json();
      showStats(result.stats);
      if (status) { status.textContent = '✓ Enquiry sent to sachin@fixtechbro.com and ganesh@fixtechbro.com'; }
      if (button) { button.textContent = 'EMAIL SENT ✓'; }
    } catch (error) {
      console.warn('FixTechBro email enquiry:', error.message);
      if (status) { status.textContent = 'Could not send the email right now. Please try again.'; }
      if (button) { button.disabled = false; button.textContent = 'SEND VIA EMAIL →'; }
    }
  };

  const setupContactDetails = () => {
    if (document.querySelector('.ftb-contact-email-note')) return;
    const card = document.querySelector('.contact-card');
    if (!card) return;
    const serviceRow = Array.from(card.querySelectorAll('.contact-row')).find(row => row.textContent.includes('Service'));
    const block = document.createElement('div');
    block.className = 'ftb-contact-email-note';
    block.innerHTML = 'Email enquiries: <a href="mailto:sachin@fixtechbro.com">sachin@fixtechbro.com</a> · <a href="mailto:ganesh@fixtechbro.com">ganesh@fixtechbro.com</a>';
    if (serviceRow) serviceRow.after(block); else card.appendChild(block);
  };

  const setupFormButtons = () => {
    const form = document.querySelector('#enquiryForm, form');
    if (!form || form.dataset.ftbEmailButtonsBound === '1') return;
    form.dataset.ftbEmailButtonsBound = '1';

    const submit = form.querySelector('button.submit');
    if (submit) submit.textContent = 'SEND VIA WHATSAPP →';

    const actions = document.createElement('div');
    actions.className = 'ftb-form-actions';
    if (submit) {
      submit.parentNode.insertBefore(actions, submit);
      actions.appendChild(submit);
    } else {
      form.appendChild(actions);
    }

    const emailButton = document.createElement('button');
    emailButton.type = 'button';
    emailButton.className = 'btn ftb-email-btn';
    emailButton.textContent = 'SEND VIA EMAIL →';
    actions.appendChild(emailButton);

    const status = document.createElement('div');
    status.className = 'ftb-email-status';
    actions.after(status);

    emailButton.addEventListener('click', () => sendEnquiryByEmail(form));

    const intro = document.querySelector('#contact .section-head p');
    if (intro) intro.textContent = 'Submit the details and send your enquiry by WhatsApp or email.';
  };

  const captureEnquiry = () => {
    const form = document.querySelector('#enquiryForm, form');
    if (!form || form.dataset.ftbAnalyticsBound === '1') return;
    form.dataset.ftbAnalyticsBound = '1';
    form.addEventListener('submit', async () => {
      try {
        const payload = getFormPayload(form);
        if (!payload.name || !payload.phone || !payload.service) return;
        const response = await fetch(ENQUIRY_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        });
        if (!response.ok) throw new Error(`Enquiry endpoint failed: ${response.status}`);
        const result = await response.json();
        showStats(result.stats);
      } catch (error) { console.warn('FixTechBro enquiry email:', error.message); }
    });
  };

  const init = () => {
    addStyles();
    createStats();
    setupContactDetails();
    setupFormButtons();
    recordVisit();
    captureEnquiry();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
