# Matuku: Modernizing Conservation Field Data

[![Architecture](https://img.shields.io/badge/Architecture-PWA%20(Offline%20First)-blue.svg)](https://en.wikipedia.org/wiki/Progressive_web_app)
[![Status](https://img.shields.io/badge/Status-MVP%20Complete-success.svg)](#)
[![Focus](https://img.shields.io/badge/Focus-Conservation%20Tech-green.svg)](#)

**Matuku** is a specialized Progressive Web Application (PWA) designed to modernize data collection for the endangered Australasian Bittern (Matuku-hūrepo).

Designed and built by a volunteer observer, this tool addresses the specific operational challenges of monitoring cryptic bird species in remote, low-light environments.

---

## 🔍 The Challenge (Field Analysis)

While volunteering for the Department of Conservation (DOC) to monitor the critically endangered Matuku, I observed significant friction in the manual data collection process:

*   **Operational Environment:** Monitoring occurs at dusk and into the night, often in remote wetlands with no cellular coverage.
*   **Data Integrity Risks:** Writing paper notes in the dark leads to illegible timestamps, missed data fields, and transcription errors.
*   **High-Pressure Events:** Male bitterns often call ("boom") in rapid succession (boom trains). Manually recording bearing, distance, and time for every boom is difficult to do accurately in real-time.

## 💡 The Solution

I engineered **Matuku** as a digital solution to these specific pain points, bridging the gap between field requirements and technical implementation.

### Key Features & Design Decisions

| Pain Point | Solution Implemented | Benefit |
| :--- | :--- | :--- |
| **No Cell Coverage** | **Offline-First PWA** | Fully functional without internet. Data is persisted locally and exported to CSV when back online. |
| **Night Blindness** | **Material Design 3 Dark Mode** | A high-contrast, low-glare interface preserves night vision. Large touch targets (FAB) ensure usability with cold hands/gloves. |
| **Rapid "Boom Trains"** | **"Sticky" Logging Logic** | The app remembers the last bird's ID, bearing, and distance. Observers can log a sequence of booms with a single tap, rather than re-entering data. |
| **Distance Estimation** | **Protocol-Aligned Slider** | A custom non-linear slider (`0, 10, 25... >1000m`) matches specific DOC recording protocols, reducing cognitive load. |

---

## 🛠️ Technical Implementation

This project serves as a practical demonstration of modern web application architecture, focusing on reliability and user experience.

*   **Core Stack:** React, TypeScript, Vite.
*   **UI Framework:** Material UI (MUI) v5 – Chosen for its robust accessibility and mobile-first components.
*   **State Management:** Zustand – For efficient, boilerplate-free state handling.
*   **Deployment:** GitHub Actions -> Google Cloud Storage (Automated CI/CD).

## 🚀 About the Author & Intent

**I am a Business Analyst and Developer passionate about using technology to solve real-world problems.**

This project was a self-initiated exercise to demonstrate how digital tools can enhance conservation efforts. I identified a gap in the current workflow, gathered requirements through direct participation, and delivered a functional MVP that solves the problem.

**I am actively seeking opportunities to apply this skillset—identifying operational problems and building digital solutions—within the conservation or public sector.**

If you are involved with DOC, biodiversity monitoring, or similar fields and see value in this approach, I would love to connect.

[Link to your LinkedIn or Portfolio] | [Link to Email]

---

### 📱 Try the App
[Link to hosted app if available]
