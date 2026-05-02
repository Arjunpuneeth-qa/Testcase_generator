require('dotenv').config();

const https = require("https");

const CONFIG = {
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN
};

function fetchTicket(ticketKey) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${CONFIG.email}:${CONFIG.apiToken}`).toString("base64");
    const options = {
      hostname: "bounteous.jira.com",
      path: `/rest/api/2/issue/${ticketKey}`,
      method: "GET",
      rejectUnauthorized: false,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json"
      }
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse: ${e.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

function extractText(obj) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (obj.type === "doc" && Array.isArray(obj.content)) {
    return obj.content.map(block => extractText(block)).join("\n");
  }
  if (obj.type === "paragraph" && Array.isArray(obj.content)) {
    return obj.content.map(item => extractText(item)).join("");
  }
  if (obj.type === "text") return obj.text || "";
  if (Array.isArray(obj)) return obj.map(item => extractText(item)).join("\n");
  return "";
}

(async () => {
  try {
    const ticket = await fetchTicket("GAAM-744");
    const fields = ticket.fields || {};
    const description = extractText(fields.description) || "";
    const summary = fields.summary || "";

    console.log("\n" + "=".repeat(120));
    console.log("GAAM-744 TICKET DETAILS");
    console.log("=".repeat(120) + "\n");
    
    console.log("SUMMARY:");
    console.log(summary);
    console.log("\nDESCRIPTION:");
    console.log(description);
    console.log("\n" + "=".repeat(120) + "\n");

  } catch (error) {
    console.error("Error:", error.message);
  }
})();
