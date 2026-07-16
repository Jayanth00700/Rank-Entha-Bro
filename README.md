# 🎓 Rank Entha Bro



<p align="left">
Helping Telangana EAPCET aspirants make smarter counselling decisions.
</p>

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

---

## 📌 About

**Rank Entha Bro** is a web application developed to simplify the Telangana EAPCET counselling process.

Students often spend hours comparing previous year cutoff PDFs and manually preparing their web options. This project automates that process by generating a personalized counselling preference list based on the student's rank, category, gender, preferred branch, district, and college type.

The application processes the official **TG EAPCET 2025 Final Phase Last Rank** dataset and recommends eligible colleges and branches in an optimized order.

---

## ✨ Features

- 🎯 Smart Preference Generator
- 🏫 College First Mode
- 🌿 Branch First Mode
- 📊 Personalized Counselling List
- 📍 District-wise Filtering
- 🏛 College Type Filtering
- 📚 Multiple Branch Support
- ⚡ Fast Recommendation Engine
- 📱 Responsive Design
- 🌙 Premium Glassmorphism UI
- 🔎 Search & Filter Colleges
- 📄 Generate up to 150 Web Options

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js | React framework for application development |
| React.js | Building interactive user interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive layouts |
| Framer Motion | Animations and transitions |
| JSON | Structured counselling dataset |
| Git | Version Control |
| GitHub | Source Code Management |
| Vercel | Deployment |

---

## ⚙️ Working

The recommendation engine analyzes the student's

- EAPCET Rank
- Category
- Gender
- Preferred Course
- Preferred District
- College Type

and compares them against the **official 2025 TG EAPCET Final Phase cutoff data**.

Based on eligibility, it generates an optimized counselling preference list.

The application supports two recommendation modes.

### 🏫 College First

Displays all eligible branches grouped under each college.

Example

```
CBIT

• CSE
• CSM
• IT

VNR VJIET

• CSE
• AIML
• ECE
```

---

### 🌿 Branch First

Displays colleges offering the selected branch.

Example

```
CSE

CBIT

VNR

VASAVI

GRIET

MGIT
```

---

## 📂 Project Structure

```
Rank-Entha-Bro/
│
├── public/
│   ├── Logo.png
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── Form.tsx
│   │   ├── Loader.tsx
│   │   ├── Navigation.tsx
│   │   └── Results.tsx
│   │
│   └── data/
│       ├── college_precedence.json
│       └── data.json
│
├── .gitignore
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
```

---

## 📊 Dataset

This project uses

**TG EAPCET 2025 Final Phase Last Rank Statement**

The dataset contains

- Institute Name
- Branch
- District
- College Type
- Category-wise Closing Rank
- Gender-wise Closing Rank
- Affiliated University

The recommendation engine processes this dataset locally to generate counselling suggestions.

---

## 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/Jayanth00700/Rank-Entha-Bro.git
```

Navigate to the project

```bash
cd Rank-Entha-Bro
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---


---

## 🎯 Future Improvements

- Bookmark Colleges
- Counselling Timeline
- Latest Cutoff Support
- AI-assisted Recommendation Engine

---

## 🤝 Contributing

Contributions are welcome.

If you find any issue or have suggestions for improvements, feel free to fork the repository and submit a pull request.

---

## 📜 Disclaimer

This project is intended solely to assist Telangana EAPCET aspirants during counselling.

All recommendations are generated using the official **TG EAPCET 2025 Final Phase Last Rank** dataset.

The generated preference list should be considered as guidance and not as an official counselling recommendation.

---

## 👨‍💻 Developer

**Jayanth**

Designed & Developed by Jayanth

GitHub

https://github.com/Jayanth00700

---

## ⭐ Support

If you found this project helpful,

⭐ Star the repository.

It motivates future improvements.

---

<p align="center">

Designed & Developed by Jayanth ❤️

</p>
