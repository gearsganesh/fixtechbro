const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const filePath = path.join(process.cwd(), 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');
  const analyticsTag = '<script src="/fixtechbro-analytics.js"></script>';

  if (!html.includes(analyticsTag)) {
    html = html.replace('</body>', `${analyticsTag}\n</body>`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).send(html);
};
