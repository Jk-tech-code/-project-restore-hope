# Project Restore Hope (PRH)

> Restoring hope, transforming lives, and building futures for children and families in Mukuru, Kenya through education, daily nutrition, and community development since 2006.

[![Website](https://img.shields.io/badge/website-projectrestorehope.com-blue)](https://projectrestorehope.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/hosted-GitHub%20Pages-brightgreen)](https://jk-tech-code.github.io/-project-restore-hope/)

## Overview

Project Restore Hope is a nonprofit organization providing education, daily meals, and support to 800+ children at Glorious Group of Schools in Mukuru, Nairobi, Kenya. Founded by Dr. Mitchelle Scott after a medical mission in 2006, the organization operates a full primary and secondary school, feeding program, orphan support, and community development initiatives.

This repository contains the official public website for Project Restore Hope.

## Features

- **20-page nonprofit website** — Home, About, Programs, Impact, Gallery, Donate, Students, News, and more
- **Dynamic photo gallery** — 400+ photos organized by category with pagination and lightbox
- **Video showcase** — Embedded video grid with lightbox playback
- **Student sponsorship profiles** — 57 orphan and vulnerable children profiles
- **Donation system** — Stripe payment intent integration
- **Contact & volunteer forms** — Backend API with email notifications
- **Newsletter subscription** — Email collection with backend integration
- **Interactive timeline** — Organization transformation history
- **SEO optimized** — Full Open Graph, Twitter Cards, JSON-LD structured data, sitemap
- **Accessibility friendly** — Skip navigation, ARIA labels, semantic HTML, keyboard navigation
- **Mobile responsive** — Fully responsive across all device sizes

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic markup |
| CSS3 | Styling with custom properties |
| Vanilla JavaScript | All interactivity (no frameworks) |
| Node.js / Express | Backend API server |
| MongoDB / Mongoose | Database |
| Stripe API | Payment processing |
| Nodemailer | Email notifications |

## File Structure

```
project-restore-hope/
├── index.html              # Homepage
├── about.html              # About Us
├── programs.html           # Programs / What We Do
├── impact.html             # Impact & Results
├── gallery.html            # Photo Gallery
├── videos.html             # Video Gallery
├── donate.html             # Donation Page
├── students.html           # Student Sponsorship Profiles
├── news.html               # News & Updates
├── contact.html            # Contact & Get Involved
├── healthcare.html         # Healthcare Program
├── mukuru.html             # About Mukuru Slum
├── partners.html           # Partners & Sponsors
├── schools.html            # Glorious Group of Schools
├── transformation.html     # Transformation Timeline
├── transparency.html       # Financial Transparency
├── vision.html             # Future Building Plan
├── volunteer.html          # Volunteer Information
├── faq.html                # Frequently Asked Questions
├── reports.html            # Annual Reports
├── css/
│   └── styles.css          # Single stylesheet
├── js/
│   ├── config.js           # API base URL configuration
│   ├── script.js           # All JavaScript logic
│   └── media-catalog.js    # Media catalog
├── images/                 # All site images
├── assets/
│   └── reports/            # Annual report PDFs (2019-2025)
├── backend/                # Express API server
│   ├── server.js           # Server entry point
│   ├── .env.example        # Environment variables template
│   ├── package.json
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express route definitions
│   ├── middleware/         # Custom middleware
│   └── utils/              # Email utility
├── robots.txt
├── sitemap.xml
├── .gitignore
├── LICENSE
├── SECURITY.md
├── CONTRIBUTING.md
└── README.md
```

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (test mode)

### Setup

```bash
# Clone the repository
git clone https://github.com/Jk-tech-code/-project-restore-hope.git
cd project-restore-hope

# Install backend dependencies
cd backend
npm install

# Copy environment template and fill in your values
cp .env.example .env

# Start the backend server
npm start
```

Open any `.html` file directly in your browser for the frontend. The backend API must be running for form submissions and donation processing.

### Environment Variables

Create `backend/.env` with the following:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=info@projectrestorehope.com
FRONTEND_URL=http://localhost:5500
```

## Deployment

### GitHub Pages (Frontend Only)

1. Push to the `main` branch
2. Go to Settings > Pages
3. Source: Deploy from branch, main, / (root)
4. The site will be available at `https://jk-tech-code.github.io/-project-restore-hope/`

**Note:** The backend API must be hosted separately.

### Netlify (Frontend Only)

1. Connect your GitHub repository
2. Publish directory: `/`
3. No build command required (static site)

### Vercel (Frontend Only)

1. Import your GitHub repository
2. Framework preset: Other
3. Root directory: `.`
4. Build command: none
5. Output directory: `.`

### Backend Hosting Options

The Express API can be deployed to:
- **Render** — render.com (free tier available)
- **Railway** — railway.app
- **Fly.io** — fly.io
- **DigitalOcean App Platform**

### Full-Stack Deployment

1. Deploy backend to Render or Railway
2. Update `js/config.js` with the deployed API URL
3. Deploy frontend to Vercel or Netlify
4. Update CORS settings in `backend/server.js` with your frontend domain

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Samsung Internet
- Opera (last 2 versions)

## License

[MIT](LICENSE) © Project Restore Hope

## Security

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
