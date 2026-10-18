# SETU: Bridging Education, Skills & Opportunity

**SETU** ("Setu" means *bridge* in Bangla) is a government-verified, AI-powered platform that connects students, teachers, publishers, government and industry on one path, from learning to real opportunity.

> **Vision:** value skills, not only grades.

- **Live demo (GitHub Pages):** https://maruf3535.github.io/project-SETU/
- **Repository:** https://github.com/maruf3535/project-SETU

---

## About This Repository

This repository contains a **static, front-end-only interactive demo** of SETU, built for the competition presentation.

- There is **no backend or database**. All data shown in the app is demo data.
- The app is organised as **role-based web portals**: Student, Teacher, Publisher, Industry and Government. It also includes a landing page and an onboarding flow.
- It has an **English / Bangla language toggle** and **light / dark themes**.
- Some portals are still under development.

---

## Competition and Team

SETU was submitted to the **Ziaur Rahaman Foundation competition** by a team from **Bangladesh University of Engineering and Technology (BUET)**:

| # | Name | Role |
|---|------|------|
| 1 | Md. Abdul Kader | Postgraduate Student |
| 2 | Sumir Chowdhury | Undergraduate Student |
| 3 | Maruf Hossain Rafsan | Undergraduate Student |
| 4 | MD Nabil Ahammed | Undergraduate Student |

---

## The Problem

- **906,000 unemployed graduates** in Bangladesh (2023 Labour Force Survey).
- Bangladesh ranks **67th of 81** for how well graduate skills match what employers need.
- During school closures, only **15.9% of rural children** learned remotely, compared with **28.7% in cities**.
- Coaching takes nearly **29% of household education spending** (BBS 2014).

Learning, assessment, publishing and hiring are disconnected. SETU brings them together on one verified platform.

---

## How SETU Works

### Onboarding and Verification

Every user chooses a role and uploads an ID. A four-tier verification pipeline covers **Student ID**, **Teacher ID**, **Publisher ID** and **Industry ID**. A government-authorised review team checks each one. **Nothing is published, sold or matched before approval.**

### Students (Class 6 to postgraduate)

- **AI tutor** grounded in national board (NCTB) textbooks and verified guide books, using retrieval-augmented generation (RAG).
- **Board question bank**, organised by topic and filterable by subject, chapter, question type and board year.
- **Timed, randomised practice exams.**
- **Results by topic**, with short AI video explainers for weak topics.
- **Note sharing**: notes are reviewed before they go live, and contributors earn reward points they can redeem for discounts or free guide books.
- **Verified skill portfolio** and **opportunity matches**.

### Teachers (primary school to university professors)

- **AI question generator**: board-weighted, with a unique set for each student.
- **OMR scanning and grading** with a phone camera.
- **AI-assisted marking** of written answers.
- **Class notes** for students.
- University staff can **post research topics** and **mentor student teams**.

### Publishers

- Publishers with a valid government **Publication ID** can list and sell soft copies, each with **10 to 15 free sample pages**.
- A **sales dashboard** and **review status** for each listing.

### Industry, NGOs and Research Groups

- Post real problems as **challenges**, with funded rewards held in **escrow**.
- Any verified student with the required skills, from school to university, can attempt them alone or in a team. Payment is released when the solution is accepted.
- Each accepted delivery becomes **verified portfolio evidence** for the solver.
- Larger, **milestone-paid projects** can be offered to teacher–student teams.
- **Talent search** by verified skill.

### Government

- A **single review queue** for content, IDs and notes, with AI pre-checks (syllabus match, copied content detection).
- **Anonymised insights**, such as weak topics by division and skills in demand.

### Challenge Lifecycle

```
Post -> Review and fund (escrow) -> Open to solvers -> Solve and submit
     -> Review (accept or revise) -> Pay and rate -> Portfolio evidence
```

---

## Expected Impact

- **Educational standardisation** through verified, board-aligned content.
- **Lower workload for teachers** through automated question setting, grading and marking.
- **New employment**: review jobs, industry projects and part-time work.
- **Sustainable income** for publishers and content contributors.
- **Less educated unemployment**, because students build verified, job-relevant skills.
- **Better access for rural students and teachers.**

---

## Tech Stack

| Area | Tools |
|------|-------|
| UI framework | React 19 |
| Build tool | Vite 8 |
| Routing | React Router (hash routing) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide |
| Charts | Recharts |
| Linting | oxlint |

---

## Getting Started

**Requirements:** Node.js 22 or later.

```bash
# Install dependencies
npm install

# Start the development server (http://localhost:5173)
npm run dev

# Create a production build
npm run build

# Preview the production build locally
npm run preview

# Run the linter
npm run lint
```

---

## Project Structure

Planned layout of the main folders under `src/`:

```
src/
  data/        Demo data used across the portals
  i18n/        English and Bangla text
  components/  Shared UI components
  layouts/     Portal and page layouts
  pages/       Landing page, onboarding and role-based portals
```

---

## Deployment

The demo is deployed to two places:

- **Vercel**, served from the root path (`/`).
- **GitHub Pages**, at https://maruf3535.github.io/project-SETU/

GitHub Pages deployment runs through the workflow in `.github/workflows/deploy.yml`. It builds with `DEPLOY_TARGET=gh-pages`, which sets the base path to `/project-SETU/`.

---

## Contributing

- **Repository:** https://github.com/maruf3535/project-SETU
- **Development branch:** `maruf`
