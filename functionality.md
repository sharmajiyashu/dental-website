# "Healthy Life" App & Website - Comprehensive Functional Analysis

Based on the screen flows provided in the images, this document outlines the features and functionalities of the "Healthy Life" (Dental & General Health Tracking) application, mapped to a public-facing website and a comprehensive admin panel.

---

## 1. App Features & Screen Analysis

### Flow A: Mobile Application - Screen Flow (Selected Dental Survey)
This flow represents a digital health assessment focusing on dental hygiene.

| Screen | Components & Inputs | Functionality |
| :--- | :--- | :--- |
| **1. Demographic Info** | Name, Age, Gender, Education Level, Occupation, "Next" Button, Progress bar (1 of 5) | Captures basic user context. Gender options: Male, Female, Other. Dropdowns for Age, Education, Occupation. |
| **2. Oral Hygiene Practices** | Multiple-choice questions: Brushing frequency, toothpaste usage, flossing, mouthwash, dentist visits, "Next" Button, Progress bar (2 of 5) | Analyzes daily habits and routines. |
| **3. Learn** | Card list: How to Brush properly (5 min), Benefits of Flossing (4 min), Choosing Toothpaste (3 min), Mouthwash Do's & Don'ts (3 min), Regular Visits (4 min), "Next" Button, Progress bar (3 of 5) | Educational content recommendation based on survey results or as general onboarding. |
| **4. Trivia Question** | "Which is the correct way to brush teeth?", Options A-D, "Submit" Button, Progress bar (4 of 5) | Tests dental knowledge. Immediate feedback (Green highlighting for correct, checkmark icon). |
| **5. Score** | Accuracy circle (e.g., 90%), Correct/Wrong counters, Accuracy, "Finish" Button, Progress bar (5 of 5) | Summarizes performance and saves the assessment. |

### Flow B: Mobile Application - Screen Flow (Front to Last General Health App)
This flow represents the core app onboarding and daily dashboards.

| Screen | Components & Inputs | Functionality |
| :--- | :--- | :--- |
| **1. Welcome / Splash** | App Logo, Title ("Healthy Life"), Description, "Get Started" and "Login" buttons | Onboarding entry point. |
| **2. Login** | Mobile Number, Password, "Forgot Password?", "Login" Button, "Login with OTP", "Register" Link | Dual-method authentication (password/OTP). |
| **3. OTP Verification** | 6-digit OTP fields, Timer ("Resend OTP in 00:45"), "Verify", "Change Number" | Secure MFA / Passwordless login. |
| **4. Register** | Full Name, Age, Gender, Role dropdown, Email (Optional), "Register" Button, "Login" Link | Profile creation onboarding. |
| **5. Home / Dashboard** | User Welcome, Health Score circle gauge, Quick Actions (Track, Learn, Reminders, Profile), Today's Progress progress items (Steps, Water, Sleep), Bottom Nav Bar | Central control hub showing real-time stats and health score. |
| **6. Track** | Category values (Steps, Water, Sleep, Weight), Add Record button, Bottom Nav Bar | Logging health metrics. |
| **7. Learning Section** | Search bar, Category filters (All, Nutrition, Fitness, Mental Health), Recommendation cards | Article list and search engine. |
| **8. Video / Content** | Video player (Brushing Technique), Bulleted instructions list, "Mark as Completed" button | Multimedia learning viewer. |
| **9. Reminders** | Reminders toggle list (Drink Water, Morning Walk, Take Medicine, Sleep Early), "Add Reminder" button | Schedule task notifications. |
| **10. Profile** | Avatar, User details (email, phone), Health Goals, Achievements, Settings, Help, Logout | Manage personal account data and preferences. |

---

## 2. Website Mapping (`/`)
The website serves as a landing page and interactive portal to attract, engage, and onboard users.

### 🌟 Key Pages & Sections:
1. **Landing Page (Hero & Call-to-Action)**:
   - Catchy tagline ("Track, Learn, Improve your health. Start your journey towards a healthier you!").
   - App screenshots/mockups showing dashboard and tracking screens.
   - Quick CTA to "Take Free Dental Assessment" or "Download App".
2. **Interactive Oral Health Assessment (Embed)**:
   - A web version of the 5-step quiz (Demographics -> Practices -> Educational Material Preview -> Trivia Question -> Score Summary).
   - Leads generation: At the end of the survey, prompts the user to enter their phone number/email to save their score and create an account.
3. **Features Showcase**:
   - Interactive preview of:
     - **Health Tracking**: Visual dashboard showing simulated steps, water intake, sleep quality, and weight metrics.
     - **Daily Reminders**: Interactive reminder mockup toggling drink water, walk, etc.
     - **Learning Hub**: Preview cards of articles with search filters.
4. **Educational Articles Preview**:
   - Blog/Resource grid showcasing articles like "How to Brush Properly" and "Benefits of Flossing".
5. **Contact / Enquiry Form**:
   - For user support, business inquiries, or general questions.

---

## 3. Admin Panel Mapping (`/admin`)
The admin panel provides complete management of the application, survey results, user data, and website contents.

### 🛠️ Key Dashboard & Pages:
1. **Overview Dashboard**:
   - Total Users registered.
   - Average Health Score of active users.
   - Completed Surveys today.
   - Pending Enquiries.
   - Interactive charts showing registration growth and average sleep/steps logs.
2. **User Management**:
   - Datatable of all registered users.
   - View detailed profile, logged tracking metrics (steps, water, sleep, weight), and reminder settings.
3. **Survey & Assessment Analytics**:
   - Log of completed survey assessments.
   - Insights on demographic distributions (Age, Gender, Role) and answer accuracy.
4. **Content / Learning Hub Management**:
   - CRUD interface for articles & videos (Title, Category, Read Time, Description, Video URL, Image URL, steps).
5. **Contact / Enquiry Management**:
   - Datatable of user queries received through the website contact form, with "Mark as Read" or "Reply" actions.
