const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(express.static('public'));

// Vulnerability scanning function
async function scanWebsite(url) {
  const results = {
    url: url,
    timestamp: new Date().toISOString(),
    vulnerabilities: [],
    warnings: [],
    passed: [],
    score: 0
  };

  try {
    // 1. Check SSL/TLS
    if (!url.startsWith('https://')) {
      results.vulnerabilities.push({
        type: 'SSL/TLS',
        severity: 'HIGH',
        issue: 'Website does not use HTTPS',
        recommendation: 'Implement SSL/TLS certificate'
      });
    } else {
      results.passed.push({ type: 'SSL/TLS', message: 'HTTPS enabled' });
    }

    // 2. Fetch website content
    const response = await axios.get(url, {
      timeout: 10000,
      validateStatus: () => true,
      maxRedirects: 5
    });

    const headers = response.headers;
    const $ = cheerio.load(response.data);

    // 3. Check Security Headers
    const securityHeaders = {
      'x-frame-options': 'Clickjacking protection',
      'x-content-type-options': 'MIME type sniffing protection',
      'strict-transport-security': 'HSTS enforcement',
      'content-security-policy': 'XSS and injection protection',
      'x-xss-protection': 'XSS filter'
    };

    for (const [header, description] of Object.entries(securityHeaders)) {
      if (!headers[header]) {
        results.warnings.push({
          type: 'Security Headers',
          severity: 'MEDIUM',
          issue: `Missing ${header} header`,
          recommendation: `Add ${header} header for ${description}`
        });
      } else {
        results.passed.push({ type: 'Security Headers', message: `${header} present` });
      }
    }

    // 4. Check for mixed content
    const mixedContent = [];
    $('script[src], img[src], link[href]').each((i, elem) => {
      const src = $(elem).attr('src') || $(elem).attr('href');
      if (src && src.startsWith('http://')) {
        mixedContent.push(src);
      }
    });

    if (mixedContent.length > 0) {
      results.vulnerabilities.push({
        type: 'Mixed Content',
        severity: 'MEDIUM',
        issue: `Found ${mixedContent.length} insecure resources`,
        recommendation: 'Use HTTPS for all resources',
        details: mixedContent.slice(0, 5)
      });
    } else {
      results.passed.push({ type: 'Mixed Content', message: 'No insecure resources found' });
    }

    // 5. Check for potential XSS vulnerabilities
    const forms = $('form');
    if (forms.length > 0) {
      results.warnings.push({
        type: 'XSS Risk',
        severity: 'MEDIUM',
        issue: `Found ${forms.length} form(s) - potential XSS entry points`,
        recommendation: 'Ensure proper input validation and output encoding'
      });
    }

    // 6. Check for inline JavaScript
    const inlineScripts = $('script:not([src])').length;
    if (inlineScripts > 5) {
      results.warnings.push({
        type: 'CSP Compliance',
        severity: 'LOW',
        issue: `Found ${inlineScripts} inline scripts`,
        recommendation: 'Move scripts to external files for better CSP compliance'
      });
    }

    // 7. Check cookies
    const cookies = headers['set-cookie'];
    if (cookies) {
      const insecureCookies = cookies.filter(c => 
        !c.toLowerCase().includes('secure') || !c.toLowerCase().includes('httponly')
      );
      if (insecureCookies.length > 0) {
        results.vulnerabilities.push({
          type: 'Cookie Security',
          severity: 'MEDIUM',
          issue: 'Cookies missing Secure or HttpOnly flags',
          recommendation: 'Set Secure and HttpOnly flags on all cookies'
        });
      }
    }

    // 8. Check server header
    if (headers['server']) {
      results.warnings.push({
        type: 'Information Disclosure',
        severity: 'LOW',
        issue: `Server header exposed: ${headers['server']}`,
        recommendation: 'Hide or obfuscate server information'
      });
    }

    // Calculate security score
    const totalChecks = results.vulnerabilities.length + results.warnings.length + results.passed.length;
    const passedChecks = results.passed.length;
    results.score = Math.round((passedChecks / totalChecks) * 100);

  } catch (error) {
    results.vulnerabilities.push({
      type: 'Scan Error',
      severity: 'HIGH',
      issue: `Failed to scan website: ${error.message}`,
      recommendation: 'Verify URL is accessible and try again'
    });
  }

  return results;
}

// API endpoint
app.post('/api/scan', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Validate URL
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    const results = await scanWebsite(url);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Scan failed', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Vulnerability scanner running on port ${PORT}`);
});
