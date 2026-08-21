const SUPABASE_URL = process.env.SUPABASE_URL || 'https://socglsgkdivewhvohlrh.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_vHq2kkVTOSVLr7qFdhBasQ_EWQyEOVX';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FIXTECHBRO_FROM_EMAIL || 'FixTechBro Enquiries <enquiry@fixtechbro.com>';

const json = (res, status, body) => {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!RESEND_API_KEY) return json(res, 503, { error: 'Email service is not configured yet' });

  try {
    const { name, phone, service, preferred_date, location, message } = req.body || {};
    if (!name || !phone || !service) return json(res, 400, { error: 'Name, phone and service are required' });

    const enquiry = {
      p_name: String(name).slice(0, 120),
      p_phone: String(phone).slice(0, 40),
      p_service: String(service).slice(0, 120),
      p_preferred_date: preferred_date || null,
      p_location: String(location || 'Perambur, Chennai').slice(0, 300),
      p_message: String(message || '').slice(0, 3000)
    };

    const dbResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_enquiry`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(enquiry)
    });

    if (!dbResponse.ok) {
      const detail = await dbResponse.text();
      console.error('Supabase enquiry error:', detail);
      return json(res, 502, { error: 'Could not save enquiry' });
    }

    const date = enquiry.p_preferred_date || 'Not specified';
    const text = [
      'NEW FIXTECHBRO SERVICE ENQUIRY',
      '',
      `Customer: ${enquiry.p_name}`,
      `Phone: ${enquiry.p_phone}`,
      `Service: ${enquiry.p_service}`,
      `Preferred date: ${date}`,
      `Location: ${enquiry.p_location}`,
      '',
      'Requirement:',
      enquiry.p_message || 'Not specified',
      '',
      `Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
    ].join('\n');

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: ['sachin@fixtechbro.com', 'ganesh@fixtechbro.com'],
        subject: `New FixTechBro Enquiry - ${enquiry.p_service}`,
        text,
        reply_to: enquiry.p_phone.includes('@') ? enquiry.p_phone : undefined
      })
    });

    if (!emailResponse.ok) {
      const detail = await emailResponse.text();
      console.error('Resend error:', detail);
      return json(res, 502, { error: 'Enquiry saved, but email notification failed' });
    }

    const stats = await dbResponse.json();
    return json(res, 200, { ok: true, stats: Array.isArray(stats) ? stats[0] : stats });
  } catch (error) {
    console.error('FixTechBro enquiry endpoint:', error);
    return json(res, 500, { error: 'Unexpected server error' });
  }
};
