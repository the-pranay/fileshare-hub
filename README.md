# FileShare Hub 🚀

A comprehensive file sharing platform built with Next.js, featuring drag & drop upload to IPFS, secure download links, user authentication, dashboard management, and admin panel.

## ✨ Features

- 🌐 **Decentralized Storage**: Upload files to IPFS via Web3.Storage
- 🔐 **Secure Sharing**: Password-protected downloads with expiration dates
- 📱 **QR Code Generation**: Easy mobile sharing with auto-generated QR codes
- 👥 **User Authentication**: GitHub OAuth and email/password authentication
- 📊 **Analytics Dashboard**: Comprehensive file and user analytics
- 🛡️ **Admin Panel**: User management, system settings, and monitoring
- 📧 **Email Notifications**: Welcome emails and password reset functionality
- 🌙 **Dark Mode**: Responsive UI with dark mode support
- ⚡ **Rate Limiting**: Built-in protection against abuse
- 📈 **Real-time Stats**: Live file upload/download tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Authentication**: NextAuth.js with GitHub OAuth
- **Database**: MongoDB with Mongoose
- **Storage**: IPFS via Web3.Storage
- **Email**: Nodemailer with SMTP
- **Charts**: Recharts for analytics
- **QR Codes**: qrcode library
- **UI Components**: Custom component library

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- Web3.Storage account and API token
- Email provider (Gmail, Outlook, etc.)
- GitHub OAuth app (optional)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fileshare-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables** (see [Environment Variables](#-environment-variables) section)

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/fileshare-hub

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Web3.Storage (Required for file uploads)
WEB3_STORAGE_TOKEN=your-web3-storage-token

# JWT Secret
JWT_SECRET=your-jwt-secret-key-generate-with-openssl-rand-base64-32

# Email Configuration (Required for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

### Optional Variables

```bash
# GitHub OAuth (Optional)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# File Upload Settings
MAX_FILE_SIZE=52428800  # 50MB in bytes
UPLOAD_DIR=./uploads

# Admin Configuration
ADMIN_EMAIL=admin@yourcompany.com

# Security Settings
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000  # 15 minutes in milliseconds

# File Type Restrictions
ALLOWED_FILE_TYPES=image/*,application/pdf,text/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# Storage Limits
MAX_STORAGE_PER_USER=1073741824  # 1GB in bytes

# Analytics
ANALYTICS_RETENTION_DAYS=90

# Development
NODE_ENV=development
DEBUG_MODE=false
```

## 🔑 Service Setup

### Web3.Storage Setup

1. Go to [web3.storage](https://web3.storage)
2. Sign up for a free account
3. Generate an API token
4. Add the token to your `.env.local` as `WEB3_STORAGE_TOKEN`

### Email Setup (Gmail Example)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the app password in `EMAIL_PASS`

### GitHub OAuth Setup (Optional)

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Add the Client ID and Secret to your `.env.local`

### MongoDB Setup

#### Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod

# Or using Homebrew (macOS)
brew services start mongodb-community
```

#### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string and add to `MONGODB_URI`

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in project settings
   - Deploy

3. **Update Environment Variables**
   - Update `NEXTAUTH_URL` to your production domain
   - Ensure all API tokens are production-ready

### Other Platforms

The app can be deployed to any Node.js hosting platform:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 📁 Project Structure

```
fileshare-hub/
├── app/                          # Next.js app directory
│   ├── admin/                    # Admin panel pages
│   │   ├── analytics/           # Analytics dashboard
│   │   └── settings/            # Admin settings
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin APIs
│   │   ├── auth/                # Authentication APIs
│   │   ├── download/            # Download APIs
│   │   ├── files/               # File management APIs
│   │   └── upload/              # Upload APIs
│   ├── auth/                    # Authentication pages
│   ├── components/              # React components
│   │   ├── Home/               # Homepage components
│   │   ├── ui/                 # UI components
│   │   ├── Upload/             # Upload components
│   │   └── Utilities/          # Utility components
│   ├── dashboard/              # User dashboard
│   ├── download/               # Download pages
│   └── upload/                 # Upload pages
├── lib/                        # Utilities and configurations
│   ├── models/                 # MongoDB models
│   ├── emailService.js         # Email service
│   ├── errorHandler.js         # Error handling
│   ├── mongodb.js              # Database connection
│   └── utils.js                # Utility functions
└── public/                     # Static assets
```

## 🎯 Usage

### For Users

1. **Upload Files**
   - Drag and drop files or click to browse
   - Set expiration date and download limits
   - Add password protection (optional)
   - Get shareable link and QR code

2. **Manage Files**
   - View uploaded files in dashboard
   - Monitor download statistics
   - Delete or update file settings

3. **Download Files**
   - Use shared links to download files
   - Enter password if required
   - Files are served directly from IPFS

### For Admins

1. **Admin Panel**
   - Access via `/admin` (requires admin role)
   - View system statistics and analytics
   - Manage users and files

2. **Settings**
   - Configure file size limits
   - Set rate limiting rules
   - Monitor system health
   - Test email configuration

## 🔒 Security Features

- **Input Validation**: Comprehensive validation on all inputs
- **Rate Limiting**: Prevents abuse and spam
- **File Type Restrictions**: Configurable allowed file types
- **Size Limits**: Configurable file size restrictions
- **Password Protection**: Optional password protection for downloads
- **Expiration Dates**: Automatic file expiration
- **CSRF Protection**: NextAuth.js provides CSRF protection
- **SQL Injection Protection**: MongoDB with Mongoose provides protection

## 📊 Analytics

The platform includes comprehensive analytics:
- Upload/download trends
- User activity patterns
- File type distribution
- Storage usage statistics
- Geographic distribution (IP-based)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](../../issues) page
2. Review the environment variable configuration
3. Ensure all services (MongoDB, Web3.Storage, Email) are properly configured
4. Check the console logs for detailed error messages

## 🔮 Roadmap

- [ ] File versioning system
- [ ] Bulk upload functionality
- [ ] Advanced user permissions
- [ ] API rate limiting per user
- [ ] File encryption at rest
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Integration with more storage providers
- [ ] Folder organization system
- [ ] Collaborative file sharing

---

Made By the-pranay
