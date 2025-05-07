# Security Policy

## Supported Versions

The following versions of excelify-json are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of excelify-json seriously. If you believe you have found a security vulnerability, please follow these steps:

1. **Do not disclose the vulnerability publicly**
2. Email your findings to [info@alpaharges.com] with the subject line "Security Vulnerability Report"
3. Include the following information in your report:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes (if available)

### What to expect

- You will receive an initial response within 48 hours
- We will investigate the report and keep you updated on our progress
- If the vulnerability is accepted, we will:
  - Acknowledge your contribution
  - Work on a fix
  - Notify you when the fix is released
- If the vulnerability is declined, we will explain why

### Security Best Practices

When using excelify-json, please ensure you:

1. Keep your dependencies up to date
2. Use the latest version of Node.js (>=22.0.0)
3. Implement proper input validation for Excel files
4. Set appropriate file size limits for uploads
5. Use HTTPS in production environments
6. Configure CORS appropriately for your use case

For more information about security features and best practices, please refer to our [Technical Documentation](Technical%20Document.md).
