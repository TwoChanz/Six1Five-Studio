/**
 * Professional HTML email templates for Six1Five Studio
 * Uses inline styles for maximum email client compatibility
 */

interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  location: string;
  services?: string[] | null;
  timeline?: string | null;
  budgetRange?: string | null;
  projectDetails: string;
  referenceFiles?: string[] | null;
}

/**
 * Generates a professional HTML email for contact form submissions
 */
export function generateContactFormEmail(data: ContactFormData): string {
  const servicesList = data.services && data.services.length > 0 
    ? `<li><strong>Services Requested:</strong> ${data.services.join(', ')}</li>`
    : '';
  
  const timelineRow = data.timeline 
    ? `<li><strong>Timeline:</strong> ${data.timeline}</li>`
    : '';
  
  const budgetRow = data.budgetRange 
    ? `<li><strong>Budget Range:</strong> ${data.budgetRange}</li>`
    : '';

  const filesSection = data.referenceFiles && data.referenceFiles.length > 0
    ? `
      <tr>
        <td style="padding: 20px 30px; background-color: #f8f9fa; border-radius: 8px;">
          <h3 style="color: #1e1e1e; margin: 0 0 10px 0; font-size: 16px;">📎 Reference Files (${data.referenceFiles.length})</h3>
          <ul style="margin: 0; padding-left: 20px; color: #666;">
            ${data.referenceFiles.map(file => `<li style="margin-bottom: 5px;"><code style="background: #e9ecef; padding: 2px 6px; border-radius: 3px; font-size: 12px;">${file}</code></li>`).join('')}
          </ul>
        </td>
      </tr>
    `
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project Inquiry - Six1Five Studio</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ff6600 0%, #00aaff 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                🚁 New Project Inquiry
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                Six1Five Studio Reality Capture
              </p>
            </td>
          </tr>

          <!-- Contact Information -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #1e1e1e; margin: 0 0 20px 0; font-size: 20px; border-bottom: 3px solid #ff6600; padding-bottom: 10px;">
                Contact Details
              </h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">
                    <strong style="color: #1e1e1e;">Name:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #1e1e1e; font-size: 14px;">
                    ${data.name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">
                    <strong style="color: #1e1e1e;">Email:</strong>
                  </td>
                  <td style="padding: 8px 0;">
                    <a href="mailto:${data.email}" style="color: #00aaff; text-decoration: none; font-size: 14px;">
                      ${data.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">
                    <strong style="color: #1e1e1e;">Project Type:</strong>
                  </td>
                  <td style="padding: 8px 0;">
                    <span style="background-color: #e7f3ff; color: #0066cc; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 600;">
                      ${data.projectType}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">
                    <strong style="color: #1e1e1e;">Location:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #1e1e1e; font-size: 14px;">
                    📍 ${data.location}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Project Requirements -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="color: #1e1e1e; margin: 0 0 20px 0; font-size: 20px; border-bottom: 3px solid #00aaff; padding-bottom: 10px;">
                Project Requirements
              </h2>
              <ul style="margin: 0; padding-left: 20px; color: #1e1e1e; font-size: 14px; line-height: 1.8;">
                ${servicesList}
                ${timelineRow}
                ${budgetRow}
              </ul>
            </td>
          </tr>

          <!-- Project Details -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="color: #1e1e1e; margin: 0 0 15px 0; font-size: 20px; border-bottom: 3px solid #33cc99; padding-bottom: 10px;">
                Project Details
              </h2>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #33cc99;">
                <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">
${data.projectDetails}
                </p>
              </div>
            </td>
          </tr>

          <!-- Reference Files -->
          ${filesSection}

          <!-- Footer / Next Steps -->
          <tr>
            <td style="background-color: #1e1e1e; padding: 25px 30px; text-align: center;">
              <p style="margin: 0 0 15px 0; color: #cccccc; font-size: 14px;">
                <strong style="color: #ffffff;">Next Steps:</strong> Review project requirements and respond within 24 hours
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                This inquiry was submitted via the Six1Five Studio contact form
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generates a plain-text fallback email for contact form submissions
 */
export function generateContactFormPlainText(data: ContactFormData): string {
  const servicesList = data.services && data.services.length > 0 
    ? `Services Requested: ${data.services.join(', ')}\n`
    : '';
  
  const timeline = data.timeline ? `Timeline: ${data.timeline}\n` : '';
  const budget = data.budgetRange ? `Budget Range: ${data.budgetRange}\n` : '';
  const files = data.referenceFiles && data.referenceFiles.length > 0
    ? `\n\nReference Files (${data.referenceFiles.length}):\n${data.referenceFiles.map(f => `  - ${f}`).join('\n')}`
    : '';

  return `
New Project Inquiry - Six1Five Studio Reality Capture

CONTACT DETAILS
===============
Name: ${data.name}
Email: ${data.email}
Project Type: ${data.projectType}
Location: ${data.location}

PROJECT REQUIREMENTS
====================
${servicesList}${timeline}${budget}

PROJECT DETAILS
===============
${data.projectDetails}${files}

---
This inquiry was submitted via the Six1Five Studio contact form.
Next Steps: Review project requirements and respond within 24 hours.
  `.trim();
}

