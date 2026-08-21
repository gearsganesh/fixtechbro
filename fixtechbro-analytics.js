(() => {
  const SUPABASE_URL = 'https://socglsgkdivewhvohlrh.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_vHq2kkVTOSVLr7qFdhBasQ_EWQyEOVX';
  const VISIT_SESSION_KEY = 'fixtechbro_visit_recorded_v1';

  const api = async (fn, body) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body || {})
    });
    if (!response.ok) throw new Error(`Analytics request failed: ${response.status}`);
    return response.json();
  };

  const addStyles = () => {
    if (document.getElementById('ftb-analytics-style')) return;
    const style = document.createElement('style');
    style.id = 'ftb-analytics-style';
    style.textContent = `
      .ftb-live-stats{background:#06111f;color:#f7f9fc;border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08);padding:42px 0}
      .ftb-live-inner{width:min(1240px,92%);margin:auto;display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:18px;align-items:stretch}
      .ftb-live-intro{padding:10px 8px}.ftb-live-kicker{color:#ffc928;font-size:.68rem;font-weight:950;letter-spacing:1.5px;text-transform:uppercase}.ftb-live-title{font-size:clamp(1.6rem,3vw,2.35rem);font-weight:950;line-height:1;margin:8px 0}.ftb-live-copy{color:#9fb0c2;font-size:.8rem;max-width:390px}
      .ftb-live-card{border:1px solid rgba(255,255,255,.1);background:#0d2137;border-radius:16px;padding:22px;position:relative;overflow:hidden}.ftb-live-card:after{content:"";position:absolute;right:-30px;top:-35px;width:100px;height:100px;border-radius:50%;background:rgba(255,201,40,.07)}
      .ftb-live-number{font-size:clamp(2rem,4vw,3rem);font-weight:1000;letter-spacing:-1px;color:#ffc928;line-height:1}.ftb-live-label{display:block;margin-top:7px;font-size:.72rem;font-weight:850;color:#d5dfeb;text-transform:uppercase;letter-spacing:.8px}.ftb-live-status{font-size:.62rem;color:#8fa2b6;margin-top:8px}.ftb-live-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#38d39f;margin-right:5px;box-shadow:0 0 0 4px rgba(56,211,159,.08)}
      @media(max-width:760px){.ftb-live-inner{grid-template-columns:1fr 1fr}.ftb-live-intro{grid-column:1/-1}.ftb-live-card{padding:18px}.ftb-live-number{font-size:2rem}}
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
        <div class="ftb-live-intro">
          <div class="ftb-live-kicker">Live Activity</div>
          <div class="ftb-live-title">FixTechBro in motion.</div>
          <div class="ftb-live-copy">Real activity from the FixTechBro website. Visits and service enquiries are updated automatically.</div>
        </div>
        <div class="ftb-live-card"><div class="ftb-live-number" id="ftb-visits">0</div><span class="ftb-live-label">Website Visits</span><div class="ftb-live-status"><span class="ftb-live-dot"></span>Live counter</div></div>
        <div class="ftb-live-card"><div class="ftb-live-number" id="ftb-enquiries">0</div><span class="ftb-live-label">Service Enquiries</span><div class="ftb-live-status"><span class="ftb-live-dot"></span>Live counter</div></div>
      </div>`;
    const ticker = document.querySelector('.ticker');
    if (ticker) ticker.after(section); else document.querySelector('main')?.appendChild(section);
  };

  const animateNumber = (element, target) => {
    if (!element) return;
    const end = Number(target) || 0;
    const start = Number(element.dataset.value || 0);
    const duration = 850;
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
    if (!data) return;
    const row = Array.isArray(data) ? data[0] : data;
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
    } catch (error) {
      console.warn('FixTechBro analytics:', error.message);
    }
  };

  const captureEnquiry = () => {
    const form = document.querySelector('form');
    if (!form || form.dataset.ftbAnalyticsBound === '1') return;
    form.dataset.ftbAnalyticsBound = '1';
    form.addEventListener('submit', async () => {
      try {
        const value = key => {
          const el = form.querySelector(`[name="${key}"]`);
          return el ? el.value.trim() : '';
        };
        const payload = {
          p_name: value('name') || value('fullName') || value('fullname'),
          p_phone: value('phone') || value('mobile') || value('contact'),
          p_service: value('service') || value('serviceType'),
          p_preferred_date: value('date') || value('preferred_date') || null,
          p_location: value('location') || 'Perambur, Chennai',
          p_message: value('message') || value('requirement') || value('details')
        };
        if (!payload.p_name || !payload.p_phone || !payload.p_service) return;
        const data = await api('submit_enquiry', payload);
        showStats(data);
      } catch (error) {
        console.warn('FixTechBro enquiry analytics:', error.message);
      }
    });
  };

  const init = () => {
    addStyles();
    createStats();
    recordVisit();
    captureEnquiry();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
