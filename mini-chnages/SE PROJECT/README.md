# Online Exam Registration System - Fixed Flow

## Pages & Flow
**Full flow:** `index.html` (landing) → `login.html` / `register-user.html` → `dashboard.html` (course selection) → `exam-personal.html` → `exam-education.html` → `exam-documents.html` → `confirmation.html`

| Page | Description | Links To |
|------|-------------|----------|
| [index.html](index.html) | Landing - Start here | login.html, register-user.html |
| [login.html](login.html) | Login (Demo button) | dashboard.html |
| [register-user.html](register-user.html) | New user register | login.html |
| [dashboard.html](dashboard.html) | **Course Selection** - Click category → select course | exam-personal.html, index.html (logout) |
| [exam-personal.html](exam-personal.html) | Personal details step 1 | exam-education.html |
| [exam-education.html](exam-education.html) | Education details step 2 | exam-documents.html, dashboard.html (back) |
| [exam-documents.html](exam-documents.html) | Upload documents step 3 | confirmation.html |
| [confirmation.html](confirmation.html) | Success page | dashboard.html |
| [reset-users.html](reset-users.html) | **RESET localStorage** - Use if register fails | index.html |
| [courses.json](courses.json) | Course data | - |

## Quick Start
1. **Reset**: Open [reset-users.html](reset-users.html)
2. Open [index.html](index.html)
3. **Demo**: Login → "Demo Login" button → course dashboard
4. Select course → complete exam registration flow.

All pages linked, navigation smooth. Dashboard is the course page after login as requested.
