# 🌐 Netlify Deployment Guide

## Quick Deploy to Netlify

### Method 1: Drag & Drop (Easiest)

1. **Zip your project folder**
   - Select all files in your Quran folder
   - Create a ZIP file named `quran-recitation-logger.zip`

2. **Go to Netlify**
   - Visit: https://app.netlify.com
   - Sign up/Login (free account)

3. **Deploy**
   - Drag and drop your ZIP file onto the Netlify dashboard
   - Wait for deployment (usually 1-2 minutes)

4. **Get your URL**
   - Netlify will give you a URL like: `https://amazing-name-123456.netlify.app`
   - Share this URL with teachers and parents!

### Method 2: Git Integration (Recommended)

1. **Create GitHub Repository**
   - Go to https://github.com
   - Create new repository: `quran-recitation-logger`
   - Upload all your files

2. **Connect to Netlify**
   - In Netlify dashboard, click "New site from Git"
   - Connect your GitHub account
   - Select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.` (root)
   - Click "Deploy site"

## 🔧 Configuration

### Environment Variables (Optional)
- `NODE_VERSION`: 18 (already set in netlify.toml)

### Custom Domain (Optional)
- In Netlify dashboard, go to "Domain settings"
- Add your custom domain (e.g., `quran.yourschool.com`)

## 📱 Access Your Application

Once deployed, your application will be available at:
- **Main Site**: `https://your-site-name.netlify.app`
- **Teacher Portal**: `https://your-site-name.netlify.app/admin.html`
- **Parent Portal**: `https://your-site-name.netlify.app/parent.html`

## 🔄 Updates

To update your application:
1. Make changes to your local files
2. Upload new ZIP file to Netlify, OR
3. Push changes to GitHub (if using Git method)
4. Netlify will automatically redeploy

## 📊 Features Available Online

✅ **Teacher Portal**
- Student management
- Grade entry with calendar
- Parent management
- Real-time data saving

✅ **Parent Portal**
- View child's progress
- Real-time grade updates
- Multi-language support

✅ **Data Persistence**
- All data saved to Netlify's serverless functions
- Automatic backups
- No database setup required

## 🆘 Troubleshooting

### If deployment fails:
1. Check that all files are included in the ZIP
2. Ensure `netlify.toml` is in the root directory
3. Verify `package.json` is present

### If functions don't work:
1. Check Netlify function logs in dashboard
2. Ensure API calls use `/api/` prefix
3. Verify CORS headers are set

### If data doesn't save:
1. Check browser console for errors
2. Verify Netlify functions are deployed
3. Test API endpoints manually

## 💡 Tips

- **Free Plan**: Includes 100GB bandwidth/month (plenty for school use)
- **Custom Domain**: Add your school's domain for professional look
- **SSL**: Automatically included (HTTPS)
- **Backup**: Export data regularly using the teacher portal

## 📞 Support

If you need help:
1. Check Netlify documentation: https://docs.netlify.com
2. Contact Netlify support (free accounts get support)
3. Check function logs in Netlify dashboard

---

**Your Quran Recitation Logger is now live and accessible worldwide! 🌍**
