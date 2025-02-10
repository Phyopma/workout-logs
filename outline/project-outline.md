# Workout Logs App Plan

## **Project Overview**

A React Native app with a Node.js backend for tracking workout sessions, visualizing progress, and analyzing workout performance based on volume and other key metrics.

### **Core Features**

#### **Basic Features**

- **User Authentication**
  - Simple login & sign-up (email/password)
  - JWT-based authentication
  
- **Workout Tracking**
  - Log workout sessions with date and time
  - Exercises list with standardized names (API integration)
  - Sets with attributes: weight, reps, and optional notes
  - Edit or delete workouts

- **Data Visualization**
  - Volume trend (total weight lifted per session)
  - Progress charts for key exercises
  - Workout frequency trends

- **Exercise Database**
  - Use an API to fetch a list of standard exercises
  - Allow users to add custom exercises if not found

#### **Advanced Features**

- **Personalized Insights**
  - One-rep max (1RM) estimations
  - PR (Personal Record) tracking for key lifts
  - Strength balance insights (e.g., push vs. pull volume)
  
- **Workout Templates**
  - Save frequently used workouts
  - Clone previous workouts for faster logging

- **Social & Sharing**
  - Share workouts with friends
  - Workout streaks and consistency tracking

- **AI-Powered Suggestions**
  - Exercise recommendations based on past workouts
  - Auto-generate progressive overload suggestions

- **Wearable Integration**
  - Sync with Apple Health, Google Fit, or Fitbit
  - Track heart rate, calories burned (future goal)

- **Offline Mode**
  - Save workouts locally and sync when online

---

## **App Screens & UI Flow**

### **1. Authentication Flow**

- **Onboarding Screen** → Brief app introduction
- **Login Screen** → Email/Password authentication
- **Sign-Up Screen** → Register new account

### **2. Workout Logging Flow**

- **Home Screen (Dashboard)**
  - Displays weekly/monthly workout summary
  - Quick access to start a new workout
  
- **New Workout Session Screen**
  - Select exercises (API-fetched list)
  - Add sets (Weight x Reps)
  - Save session

- **Workout History Screen**
  - List of past workouts with timestamps
  - Expandable to see exercises, sets, and notes

### **3. Visualization Flow**

- **Progress Analytics Screen**
  - Volume charts (line graph)
  - Strength progression by exercise
  - Workout consistency over time

- **Exercise Stats Screen**
  - Graph of max lift progression
  - PRs and trends per exercise

### **4. Profile & Settings Flow**

- **Profile Screen**
  - Basic user info
  - Workout streak tracking
- **Settings Screen**
  - Theme selection (dark/light mode)
  - API preferences (exercise database)
  - Data export option

---

## **User Flow**

1. **User logs in** → Lands on **Dashboard**.
2. **User starts a workout** → Selects exercises from API list.
3. **User logs sets** → Inputs weight & reps.
4. **User saves workout** → Data is stored & visualized.
5. **User reviews history & progress** in the **Workout History** or **Analytics** section.
6. **User explores insights** (e.g., PR tracking, strength balance).
7. **User adjusts settings or profile preferences** as needed.

---

## **Tech Stack**

- **Frontend:** React Native (Expo for quick development)
- **Backend:** Node.js (Express) + MongoDB (Mongoose ORM)
- **Authentication:** Firebase Auth or JWT
- **Data Storage:** MongoDB Atlas or PostgreSQL
- **API Integration:** Exercise Database (e.g., Wger API)
- **Graphing Library:** Recharts or Victory Charts

---

## **Project Timeline**

### **Phase 1: Planning & Setup (1 week)**

- Finalize UI/UX wireframes
- Set up React Native & Node.js backend
- Configure Firebase Auth or JWT

### **Phase 2: Core Features (2-3 weeks)**

- Build authentication system
- Implement workout logging system
- Integrate exercise database API
- Develop workout history tracking

### **Phase 3: Data Visualization & Insights (2-3 weeks)**

- Implement volume charts & trends
- Add PR tracking & strength balance insights
- Develop workout frequency analytics

### **Phase 4: Advanced Features & Optimization (3-4 weeks)**

- Implement workout templates & AI-powered suggestions
- Add social sharing & friend comparisons
- Sync with Apple Health/Google Fit (if applicable)
- Implement offline mode & data caching

### **Phase 5: Testing & Deployment (2 weeks)**

- Beta testing with real users
- Debug & optimize performance
- Deploy to App Store/Play Store

---

## **Next Steps**

1. **Design wireframes** (Use Figma or Sketch)
2. **Set up project repositories** (GitHub with CI/CD)
3. **Start with Authentication & Database setup**
4. **Begin building UI components & backend API endpoints**
5. **Integrate exercise API and logging system**
6. **Develop and refine data visualization features**

---

### **Final Recommendations**

- **Start with MVP (Minimum Viable Product)**: Authentication + Workout Logging + Basic Stats
- **Use Expo for easier development & testing**
- **Choose a graphing library early** for seamless visualization
- **Consider local caching (AsyncStorage or SQLite) for offline mode**
- **Think about scalability** – Web app version in the future?
