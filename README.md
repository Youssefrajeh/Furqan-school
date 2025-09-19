# Quran Recitation Logger

A bilingual (Arabic/English) static web application for managing Quran recitation results for students. Teachers can log daily results, and parents can view their children's progress through secure portals.

## Features

- **Bilingual Support**: Full Arabic/English interface with RTL support
- **Teacher Portal**: Password-protected admin interface for logging daily recitation results
- **Parent Portal**: Individual login system for parents to view their children's progress
- **Student Management**: Add, edit, and manage student information
- **Daily Entries**: Log recitation results with detailed evaluation criteria
- **Real-time Updates**: Changes appear instantly in parent portals
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern, professional interface

## Security Notice

⚠️ **IMPORTANT**: This is a DEMO version with placeholder credentials. Before using in production:

1. **Replace Demo Credentials**: Update all usernames and passwords in the code
2. **Use Real Names**: Replace generic student and parent names with actual data
3. **Secure Deployment**: Consider using environment variables for sensitive data
4. **Private Repository**: Keep your production version in a private repository

## Demo Credentials

### Teacher Login
- **Password**: Set during first-time setup

### Parent Logins
- **Username**: parent1, parent2, parent3, etc.
- **Password**: demo123 (for all demo accounts)

## Installation

1. Clone or download the repository
2. Open `index.html` in a web browser
3. Set up the teacher password on first use
4. Start logging student recitation results

## File Structure

- `index.html` - Landing page with access options
- `admin.html` - Teacher/admin portal
- `parent.html` - Parent portal
- `style.css` - Styling and theme
- `app.js` - Application logic and data management

## Usage

### For Teachers
1. Visit the landing page
2. Click "Admin Access"
3. Set password on first use
4. Add student information
5. Log daily recitation results
6. Share parent login credentials

### For Parents
1. Visit the landing page
2. Click "Parent Access"
3. Enter provided username and password
4. View children's recitation progress
5. Switch between children if multiple

## Customization

### Adding Real Data
1. Edit `app.js` - Update `createDefaultStudents()` function
2. Edit `parent.html` - Update `PARENT_CREDENTIALS` object
3. Edit `app.js` - Update parent credentials mapping in `generateParentCredentials()`

### Styling
- Modify `style.css` for custom themes
- Update CSS variables in `:root` for color schemes
- Responsive design breakpoints can be adjusted

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## License

This project is open source. Please ensure you replace all demo data with real information before using in production.

## Support

For questions or issues, please check the code comments or create an issue in the repository.
