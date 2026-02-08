# 🚀 React Frontend Setup Guide

## Step 1: Install Node.js

1. Download Node.js from: https://nodejs.org/
2. Install the LTS version (recommended)
3. Restart VS Code after installation

## Step 2: Install Dependencies

Open a new terminal and run:

```bash
cd frontend
npm install
```

This will install:
- React 18
- React DOM
- Axios (for API calls)
- React Scripts

## Step 3: Start the React App

```bash
npm start
```

The app will automatically open at `http://localhost:3000`

## Step 4: Start the Backend API

In a separate terminal, run:

```bash
uvicorn src.main:app --host 127.0.0.1 --port 8000
```

## Step 5: Test the Application

1. Fill out the loan application form
2. Click "Assess Credit Risk"
3. View the beautiful assessment report!

---

## ✨ Features of Your React Frontend

### 🎨 Beautiful UI Design
- **Modern Gradient Theme**: Purple gradient background
- **Professional Cards**: Clean white cards with shadows
- **Smooth Animations**: Fade-in and slide-up effects
- **Responsive Design**: Works on mobile, tablet, and desktop

### 📝 Loan Application Form
- **Personal Information**: Age, Income, Home Ownership, Employment
- **Loan Details**: Purpose, Grade, Amount, Interest Rate
- **Credit History**: Previous Defaults, Credit History Length
- **Pre-filled Defaults**: Sample data for quick testing
- **Input Validation**: Required fields and proper data types

### 📊 Assessment Report Display
- **Section 1: Model Predictions**
  - Probability of Default with percentage and progress bar
  - Credit Score (300-900) with rating (Excellent/Good/Fair/Poor)
  - Decision Outcome with color coding (Green/Red/Orange)
  - Risk Level indicator

- **Section 2: Decision Rationale**
  - Primary Decision Factors with impact badges
  - Factor details and explanations
  - Feature Importance Ranking (Top 5)

- **Section 3: Recommendations**
  - For Approved: Application strengths + maintenance tips
  - For Rejected: Rejection codes + improvement actions
  - For Refer: Manual review reasons

### 🎯 User Experience
- Loading spinner during API call
- Error handling with clear messages
- "New Assessment" button to start over
- Professional color coding:
  - 🟢 Green for Approved
  - 🔴 Red for Rejected
  - 🟠 Orange for Manual Review

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── LoanForm.js         # Form component
│   │   ├── LoanForm.css        # Form styles
│   │   ├── ResultDisplay.js    # Results component
│   │   └── ResultDisplay.css   # Results styles
│   ├── App.js                  # Main app
│   ├── App.css                 # App styles
│   ├── index.js                # Entry point
│   └── index.css               # Global styles
├── package.json                # Dependencies
└── README.md                   # Documentation
```

---

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks
- **Axios**: HTTP client for API calls
- **CSS3**: Custom styling with animations
- **No UI Library**: Pure custom design for uniqueness

---

## 🔧 Configuration

### Change API Endpoint

Edit `src/App.js` line 14:

```javascript
const response = await axios.post('http://YOUR_API_URL/predict', formData);
```

### Customize Colors

Edit CSS files to change the color scheme:
- Primary: `#667eea` (purple)
- Secondary: `#764ba2` (darker purple)

---

## 📱 Screenshots

### Form View
- Clean, organized form with sections
- Purple theme with white cards
- Smooth hover effects

### Results View
- Professional assessment report
- Color-coded decisions
- Progress bars and badges
- Detailed recommendations

---

## 🚀 Build for Production

```bash
npm run build
```

Creates optimized build in `build/` folder ready for deployment.

---

## ⚡ Quick Start (After Node.js Installation)

```bash
# Terminal 1 - Backend
uvicorn src.main:app --host 127.0.0.1 --port 8000

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

Then open `http://localhost:3000` in your browser!

---

## 🎉 Enjoy Your Beautiful Credit Risk Assessment System!

Your website features:
- ✅ Modern, professional design
- ✅ Smooth animations
- ✅ Responsive layout
- ✅ Color-coded results
- ✅ Detailed insights
- ✅ User-friendly interface
