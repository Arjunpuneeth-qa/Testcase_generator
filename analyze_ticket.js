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

(async () => {
  try {
    const ticket = await fetchTicket('GAAM-744');
    const fields = ticket.fields || {};
    
    console.log('\n=== GAAM-744 FULL ANALYSIS ===\n');
    console.log('Summary:', fields.summary);
    console.log('\nDescription:');
    console.log(extractText(fields.description));
    console.log('\nAcceptance Criteria:');
    if (fields.customfield_10039) {
      console.log(extractText(fields.customfield_10039));
    }
    console.log('\nType:', fields.issuetype?.name);
    console.log('Status:', fields.status?.name);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
