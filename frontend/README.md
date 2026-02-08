# Credit Risk Assessment - React Frontend

A beautiful and professional React frontend for the Credit Risk Scoring System.

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 3. Make Sure Backend is Running

Ensure your FastAPI backend is running on `http://127.0.0.1:8000`

```bash
# In the main project directory
uvicorn src.main:app --host 127.0.0.1 --port 8000
```

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── LoanForm.js          # Loan application form
│   │   ├── LoanForm.css
│   │   ├── ResultDisplay.js     # Results display
│   │   └── ResultDisplay.css
│   ├── App.js                    # Main app component
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## ✨ Features

- **Beautiful UI**: Modern gradient design with smooth animations
- **Responsive**: Works on desktop, tablet, and mobile
- **Real-time Assessment**: Connects to ML backend for instant results
- **Professional Reports**: Clean, corporate-style credit assessment reports
- **User-friendly Forms**: Easy-to-use input forms with validation

## 🎨 Design Features

- Gradient purple theme
- Smooth animations
- Card-based layout
- Progress bars and visual indicators
- Color-coded decision outcomes (Green for Approved, Red for Rejected, Orange for Refer)

## 🛠️ Technologies Used

- React 18
- Axios for API calls
- CSS3 with animations
- Modern ES6+ JavaScript

## 📝 Usage

1. Fill out the loan application form with applicant details
2. Click "Assess Credit Risk" button
3. View comprehensive credit assessment report
4. Click "New Assessment" to start over

## 🔧 Configuration

To change the API endpoint, modify the axios post URL in `src/App.js`:

```javascript
const response = await axios.post('http://127.0.0.1:8000/predict', formData);
```

## 🚀 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.
