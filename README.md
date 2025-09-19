# Quran Recitation Logger

A web application for teachers to log Quran recitation progress and for parents to view their children's progress.

## Features

- **Teacher Portal**: Add students, log recitation entries, manage grades
- **Parent Portal**: View children's progress and grades
- **Parent Management**: Edit parent credentials and information
- **Real-time Data**: All data saved to JSON file in real-time
- **Bilingual Support**: English and Arabic interface
- **Calendar Integration**: Easy date selection for entries

## Deployment Options

### Option 1: Vercel (Recommended - Free)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Choose default settings
   - Deploy!

4. **Access your app:**
   - Vercel will provide a URL like: `https://your-app-name.vercel.app`

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   netlify deploy --prod --dir .
   ```

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

## Local Development

1. **Start server:**
   ```bash
   node server.js
   ```

2. **Access application:**
   - Teacher Portal: `http://localhost:3000`
   - Parent Portal: `http://localhost:3000/parent.html`

## Default Credentials

### Teacher Login
- Set password on first visit

### Parent Logins
- Username: `parent1`, `parent2`, etc.
- Password: `demo123`

## Data Storage

- All data is stored in `quran_data.json`
- Data persists across sessions
- Real-time saving on all changes

## File Structure

```
├── admin.html          # Teacher portal
├── parent.html         # Parent portal
├── app.js             # Main application logic
├── style.css          # Styling
├── server.js          # Node.js server
├── quran_data.json    # Data storage
├── vercel.json        # Vercel configuration
└── package.json       # Node.js dependencies
```

## Support

For issues or questions, contact the developer.