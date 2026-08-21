const SUPABASE_URL = process.env.SUPABASE_URL || 'https://socglsgkdivewhvohlrh.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_vHq2kkVTOSVLr7qFdhBasQ_EWQyEOVX';

// Free Google Apps Script mail bridge.
// The script forwards FixTechBro enquiries to the configured FixTechBro addresses.
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx7Z_qKgtD1Vpk3uc780uhdhG2CKUXxR9DeMe1SORoHSexNjaE57MOy9Fk-OHl0Wcia/exec';

const json = (res, status, body) => {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    const { name, phone, service, preferred_date, location, message } = req.body || {};
    if (!name || !phone || !service) {
      return json(res, 400, { error: 'Name, phone and service are required' });
    }

    const enquiry = {
      p_name: String(name).slice(0, 120),
      p_phone: String(phone).slice(0, 40),
      p_service: String(service).slice(0, 120),
      p_preferred_date: preferred_date || null,
      p_location: String(location || 'Perambur, Chennai').slice(0, 300),
      p_message: String(message || '').slice(0, 3000)
    };

    // 1. Save the enquiry and update the website enquiry counter.
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
      console.error('Supabase enquiry error:', await dbResponse.text());
      return json(res, 502, { error: 'Could not save enquiry' });
    }

    const date = enquiry.p_preferred_date || 'Not specified';
    const emailPayload = {
      name: enquiry.p_name,
      phone: enquiry.p_phone,
      service: enquiry.p_service,
      date,
      location: enquiry.p_location,
      issue: enquiry.p_message
    };

    // 2. Send the enquiry through Google Apps Script.
    // Google Apps Script then emails sachin@fixtechbro.com and ganesh@fixtechbro.com.
    const emailResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    if (!emailResponse.ok) {
      console.error('Google Apps Script error:', await emailResponse.text());
      return json(res, 502, { error: 'Enquiry saved, but email notification failed' });
    }

    let emailResult = {};
    try {
      emailResult = await emailResponse.json();
    } catch (_) {
      // Some Apps Script responses may not be returned as JSON even when successful.
    }

    if (emailResult.success === false) {
      console.error('Google Apps Script reported an error:', emailResult.error);
      return json(res, 502, { error: 'Enquiry saved, but email notification failed' });
    }

    const stats = await dbResponse.json();
    return json(res, 200, {
      ok: true,
      stats: Array.isArray(stats) ? stats[0] : stats
    });
  } catch (error) {
    console.error('FixTechBro enquiry endpoint:', error);
    return json(res, 500, { error: 'Unexpected server error' });
  }
};
