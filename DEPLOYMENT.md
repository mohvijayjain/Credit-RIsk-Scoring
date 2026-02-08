# Deployment Guide for Render

## Backend Deployment (FastAPI)

### Prerequisites
- Render account
- GitHub repository with your code

### Steps

1. **Create New Web Service** on Render
   - Connect your GitHub repository
   - Select the repository

2. **Configuration**
   - **Name**: credit-risk-api (or your choice)
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free or Starter

3. **Environment Variables**
   Add these in Render Dashboard:
   ```
   GOOGLE_API_KEY=your_google_api_key
   ALLOWED_ORIGINS=https://your-frontend-domain.onrender.com,http://localhost:3000
   API_BASE_URL=https://your-backend-domain.onrender.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

## Frontend Deployment (React)

### Option 1: Deploy to Render

1. **Create New Static Site** on Render
   - Connect your GitHub repository
   - Root Directory: `frontend`

2. **Configuration**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

3. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-domain.onrender.com
   ```

### Option 2: Deploy to Vercel/Netlify

1. Connect repository
2. Set root directory to `frontend`
3. Add environment variable: `REACT_APP_API_URL`

## Local Development

### Backend
```bash
cd Credit-Risk-Scoring
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Important Notes

1. **CORS**: Update `ALLOWED_ORIGINS` in backend environment variables to include your frontend URL
2. **API URL**: Update `REACT_APP_API_URL` in frontend to point to your deployed backend
3. **Model File**: Ensure `models/credit_risk_pipeline.pkl` is in the repository (should be tracked by git)
4. **Environment Variables**: Never commit `.env` files with real credentials

## Troubleshooting

### Backend Issues
- Check logs in Render dashboard
- Verify model file exists: `models/credit_risk_pipeline.pkl`
- Verify all requirements are in `requirements.txt`

### Frontend Issues
- Check CORS errors in browser console
- Verify API URL is correct
- Check network tab for failed requests

### CORS Errors
- Add your frontend domain to `ALLOWED_ORIGINS` in backend
- Format: `https://your-app.onrender.com,http://localhost:3000`
