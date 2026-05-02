#!/usr/bin/env node

require('dotenv').config();

const https = require('https');

const CONFIG = {
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN
};

function fetchTicket(ticketKey) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${CONFIG.email}:${CONFIG.apiToken}`).toString('base64');
    const options = {
      hostname: 'bounteous.jira.com',
      path: `/rest/api/2/issue/${ticketKey}`,
      method: 'GET',
      rejectUnauthorized: false,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function extractText(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (obj.type === 'doc' && Array.isArray(obj.content)) {
    return obj.content.map(block => extractText(block)).join('\n');
  }
  if (obj.type === 'paragraph' && Array.isArray(obj.content)) {
    return obj.content.map(item => extractText(item)).join('');
  }
  if (obj.type === 'text') return obj.text || '';
  if (Array.isArray(obj)) return obj.map(item => extractText(item)).join('\n');
  return '';
}

function parseSections(text) {
  const sections = {};
  const lines = text.split('\n');
  let currentSection = 'General';
  let currentContent = [];

  lines.forEach(line => {
    // Check if it's a section header (h2, h3, or bold text)
    if (line.match(/^h[23]\./) || line.match(/^\*\*[^*]+\*\*$/) || line.match(/^[A-Z][a-z\s]+$/) && line.length < 50) {
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = line.replace(/^h[23]\./, '').replace(/\*\*/g, '').trim();
      currentContent = [];
    } else if (line.trim()) {
      currentContent.push(line);
    }
  });

  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n').trim();
  }

  return sections;
}

(async () => {
  try {
    const ticket = await fetchTicket('GAAM-744');
    const fields = ticket.fields || {};
    const description = extractText(fields.description) || '';

    console.log('\n=== DETAILED TICKET ANALYSIS ===\n');
    console.log('RAW DESCRIPTION:');
    console.log('=====================================');
    console.log(description);
    console.log('\n=====================================\n');

    const sections = parseSections(description);
    console.log('PARSED SECTIONS:');
    Object.entries(sections).forEach(([section, content]) => {
      console.log(`\n[${section}]`);
      console.log('-------------------------------------');
      console.log(content);
    });

    // Extract specific Responsive Behavior requirements
    console.log('\n\n=== SPECIFIC RESPONSIVE REQUIREMENTS ===\n');
    const responsiveMatch = description.match(/Responsive Behavior[\s\S]*?(?=\n[A-Z]|\n\n[A-Z]|$)/);
    if (responsiveMatch) {
      console.log('Responsive Behavior Section:');
      console.log(responsiveMatch[0]);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
})();
