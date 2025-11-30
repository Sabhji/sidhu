# Website Vulnerability Scanner 🔒

An automated web application that scans websites for common security vulnerabilities and provides actionable recommendations.

## Features

- **SSL/TLS Check** - Verifies HTTPS implementation
- **Security Headers Analysis** - Checks for essential security headers
- **Mixed Content Detection** - Identifies insecure resources
- **XSS Risk Assessment** - Detects potential XSS entry points
- **Cookie Security** - Validates secure cookie configurations
- **Information Disclosure** - Identifies exposed server information
- **CSP Compliance** - Analyzes Content Security Policy implementation
- **Security Score** - Overall security rating (0-100)

## Tech Stack

- **Backend**: Node.js + Express
- **Security**: Helmet.js
- **HTTP Client**: Axios
- **HTML Parser**: Cheerio
- **Frontend**: Vanilla JavaScript + Modern CSS

## Installation

```bash
# Clone the repository
git clone https://github.com/Sabhji/website-vulnerability-scanner.git

# Navigate to directory
cd website-vulnerability-scanner

# Install dependencies
npm install

# Start the server
npm start
```

The application will run on `http://localhost:3000`

## Usage

1. Open the application in your browser
2. Enter the target website URL (e.g., `https://example.com`)
3. Click "Scan Now"
4. Review the security report with:
   - Overall security score
   - Critical vulnerabilities
   - Warnings
   - Passed security checks

## API Endpoint

### POST `/api/scan`

Scan a website for vulnerabilities.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "timestamp": "2025-11-30T14:23:00.000Z",
  "score": 75,
  "vulnerabilities": [...],
  "warnings": [...],
  "passed": [...]
}
```

## Security Checks

### High Severity
- Missing HTTPS
- Insecure cookies
- Critical security header absence

### Medium Severity
- Mixed content
- Missing security headers
- XSS risk factors

### Low Severity
- Information disclosure
- CSP compliance issues

## Deployment

### Vercel
```bash
vercel deploy
```

### Heroku
```bash
heroku create
git push heroku main
```

### Docker
```bash
docker build -t vuln-scanner .
docker run -p 3000:3000 vuln-scanner
```

## Limitations

- This is a basic scanner for common vulnerabilities
- Does not perform penetration testing
- Cannot detect all security issues
- Use professional security audits for production systems

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Disclaimer

This tool is for educational and authorized security testing purposes only. Always obtain permission before scanning websites you don't own.
