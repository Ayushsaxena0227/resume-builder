📄 Resume Builder AI

> **Motto:** *“Build. Score. Iterate. Get hired.”*  
> Because job-hunting is stressful enough—your resume workflow shouldn’t be.

---

## Why I built this

After helping friends polish their CVs (and losing track of version _17_Final-v2.pdf_), I noticed the same headaches kept popping up:

1. Endless file versions, zero clarity on **which** resume was sent.  
2. Copy-pasting keywords from random job posts just to get past ATS filters.  
3. No quick way to gauge “Is this resume actually any good?”  
4. Sharing for feedback meant emailing bulky attachments and begging for comments.  
5. Zero insight into whether anyone even opened the file.

So I rolled these pain points into one goal:

**One tool that lets you draft, improve, share, and measure a resume—without the spreadsheet gymnastics.**

---

## The solution, in a nutshell

- **Secure sign-in (or jump in as a guest).** Firebase handles auth, so your data stays yours.  
- **Dashboard overview.** See every resume at a glance plus a live “Resume Score” powered by AI.  
- **AI Lab** with role-specific templates (100+ job titles), smart keyword suggestions, professional summary generator, and a Job Description Analyzer that compares your saved resume against any posting you paste in.  
- **Version history.** Create multiple drafts (“Frontend Dev”, “ML Engineer”), compare diffs, restore older copies, and re-run AI analysis on the fly.  
- **Share-for-feedback links.** Send a neat web preview to peers or recruiters; they can comment anonymously, all feedback funnels back to your dashboard.  
- **Resume analytics.** Track views, feedback counts, last opened timestamps, and trend charts so you know what’s landing and what’s not.

---
---<img width="1290" height="694" alt="Screenshot 2025-07-17 213224" src="https://github.com/user-attachments/assets/c70e3c7b-202c-4c4e-ab86-c63643b656ad" />
##  Key features

| Category | What you get |
|  Authentication | Email / password, reset, or *Continue as Guest* |
|  AI Assist | Resume Score, JD Analyzer, keyword & summary generators |
|  Sections | Experience, skills, achievements, education, projects |
|  Versioning | Timestamps, diff view, restore, per-draft AI scoring |
|  Sharing | Public/secret links, feedback form, comment dashboard |
|  Analytics | View count, feedback metrics, trend charts |

<img width="1906" height="821" alt="Screenshot 2025-07-27 103001" src="https://github.com/user-attachments/assets/a3eeb67b-ab53-4180-b901-4aefcfd383d7" />


<img width="1911" height="843" alt="Screenshot 2025-07-27 102951" src="https://github.com/user-attachments/assets/bccd7f3a-3b10-42b1-a691-7aa5cfa22c13" />

## Tech stack

- **Frontend:** React 18 + Vite + TailwindCSS  
- **Backend:** Node.js / Express, serverless functions  
- **Auth & DB:** Firebase Auth, Firestore  
- **AI:** OpenAI GPT-4  
- **Charts:** Recharts

---
<img width="1199" height="980" alt="Screenshot 2025-07-19 013906" src="https://github.com/user-attachments/assets/4136deae-2f2d-4d01-bcf2-65587f81df10" />

## Getting started

```bash
git clone https://github.com/yourUser/resume-builder.git
cd resume-builder
npm install           # or pnpm / yarn
cp .env.example .env  # add Firebase + OpenAI keys
npm run dev
