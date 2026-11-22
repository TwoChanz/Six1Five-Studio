# 🛰️ Six1Five Studio — AEC Reality Capture Portfolio

A modern, interactive portfolio showcasing the work and services of **Six1Five Studio**, specializing in **drone mapping, Reality Capture, BIM/VDC consulting, and digital tool development**.  
Built for performance, visual impact, and modular scalability using **Next.js**, **Tailwind CSS**, and **Vercel**.

---

## 🚀 Project Overview

**Six1Five Studio** highlights the intersection of **AEC technology**, **drone-based surveying**, and **AI-enhanced visualization**.  
The portfolio serves as both a professional showcase and a central hub for interactive tools like:

- 📸 **Reality Capture Viewer** — 3D models, orthomosaics, and point clouds  
- 🧮 **ROI Calculators** — for Reality Capture and AEC workflows  
- 🧭 **Scanner Finder (ScanSpec.ai)** — recommends 3D scanners based on user goals  
- 🧰 **Tool Stack ROI Tracker** — evaluate software subscriptions for business value  
- 🧱 **AEC Solutions Directory** — curated tool database for BIM/VDC professionals  

The site is optimized for high-resolution visual assets, fast navigation, and easy integration with new product launches.

---

## 🧩 Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | [Next.js 14](https://nextjs.org/) | App framework with server components |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first responsive styling |
| **Deployment** | [Vercel](https://vercel.com/) | Hosting and CI/CD |
| **Assets** | WebP, OBJ, PLY, HEIC | 3D and high-resolution media |
| **Analytics** | Vercel Analytics / PostHog (optional) | User tracking and engagement |
| **3D Embeds** | [Sketchfab](https://sketchfab.com/) / Three.js | Model visualization |
| **Version Control** | GitHub | Repo: `https://github.com/TwoChanz/Six1Five-Studio` |

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 18+  
- npm or pnpm  
- macOS, Windows, or Linux environment

### Installation

```bash
# Clone the repo
git clone https://github.com/TwoChanz/Six1Five-Studio.git

# Navigate to project
cd Six1Five-Studio/client

# Install dependencies
npm install
Run Locally
bash
Copy code
npm run dev
Visit http://localhost:3000 to view the site locally.

🧱 Folder Structure
php
Copy code
Six1Five-Studio/
├── client/
│   ├── public/               # Static assets (logos, 3D models, thumbnails)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Next.js pages
│   │   ├── data/             # JSON data for tools and projects
│   │   └── assets/           # Logos and media
│   └── package.json
├── attached_assets/           # High-res and 3D model files
├── BEGINNER_IMPROVEMENT_GUIDE.md
└── README.md
🌐 Deployment
The project is deployed automatically via Vercel connected to the GitHub repository.

Main Branch → Production:
https://six1fivestudio.com

Preview Branches:
Vercel auto-generates preview URLs for pull requests and feature branches.

To manually deploy:

bash
Copy code
vercel --prod
🧭 Key Features
Dynamic project gallery for orthomosaics, point clouds, and construction mapping

3D model previews using OBJ/PLY integration

Interactive service calculators for ROI and cost savings

Dark/Light mode toggle

SEO-optimized routes for portfolio categories

Mobile-first responsive design

Expandable tool directory for future AI projects

🧠 Vision
Six1Five Studio aims to become the regional leader in Reality Capture and AEC technology integration across Middle Tennessee and beyond.
This portfolio reflects a blend of field expertise, digital craftsmanship, and AI-assisted project delivery.

🪪 Branding
Element	Example
Primary Logo	/client/src/assets/logo-horizontal-final.webp
Dark Theme Logo	/client/src/assets/logo-matrix-style-desktop.webp
Accent Colors	#1C1C1E (Dark), #00ADB5 (Accent), #F8F8F8 (Light)
Typography	Inter / JetBrains Mono
Design Style	Industrial minimalism + tech realism

📦 Integration Notes
If running locally with large media assets:

Move .obj or .ply files to /attached_assets/

Compress images to .webp for faster load times

Keep total repo size under 500MB when possible for deployment

🧰 Developer Notes
The BEGINNER_IMPROVEMENT_GUIDE.md includes setup improvement notes for newcomers.

Avoid committing .local/state/ or .replit/ binaries.

Repomix can be used to summarize or audit the project:

bash
Copy code
npx repomix --remote https://github.com/TwoChanz/Six1Five-Studio.git
🧩 Roadmap
 Add dynamic CMS (Sanity or Supabase)

 Integrate 3D Viewer (Three.js / Sketchfab API)

 Launch Tool Stack ROI Tracker dashboard

 Add embedded ROI calculators per service

 Build out affiliate links for gear/software

 Publish blog with SEO-optimized case studies

🤝 Contributing
Fork the repository

Create a new feature branch: git checkout -b feature/new-section

Commit changes: git commit -m "Add new section"

Push to the branch: git push origin feature/new-section

Submit a Pull Request for review

📬 Contact
Six1Five Studio
📍 Nashville, Tennessee
🌐 https://six1fivestudio.com
📧 six1fivestudio@gmail.com (example placeholder)

🧾 License
This project is proprietary under the Six1Five Studio brand.
Unauthorized reproduction, resale, or redistribution of assets (models, images, or data) is prohibited without written consent.

“From field to digital twin — precision, clarity, and value.”
— Six1Five Studio
