# FileShare Hub 🚀

A comprehensive decentralized file sharing platform built with Next.js, featuring drag & drop upload to IPFS via Pinata, secure download links, QR code generation, user authentication, dashboard management, and admin panel with real-time statistics.

## ✨ Features

- 🌐 **Decentralized Storage**: Upload files to IPFS via Pinata for permanent, distributed storage
- 🔐 **Secure Sharing**: Password-protected downloads with expiration dates and download limits
- 📱 **QR Code Generation**: Instant QR codes for easy mobile sharing with download functionality
- 👥 **User Authentication**: GitHub OAuth and email/password authentication with NextAuth.js
- 📊 **Real-time Analytics**: Live dashboard with file uploads, downloads, and user statistics
- 🛡️ **Admin Panel**: Comprehensive user management, system monitoring, and health checks
- 📧 **Email Notifications**: Welcome emails and password reset functionality with SMTP
- 🌙 **Modern UI**: Responsive design with dark mode support and Framer Motion animations
- ⚡ **Rate Limiting**: Built-in protection against abuse with configurable limits
- 📈 **Dynamic Statistics**: Auto-refreshing homepage with total files, users, and uptime
- 🔒 **Security Features**: File type validation, size limits, and secure token-based authentication
- 📱 **Mobile Responsive**: Optimized for all devices with touch-friendly interfaces

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Authentication**: NextAuth.js with GitHub OAuth and JWT
- **Database**: MongoDB with Mongoose ODM
- **Storage**: IPFS via Pinata (HTTP API + Gateway)
- **Email**: Nodemailer with SMTP support
- **Charts**: Recharts for analytics visualization  
- **QR Codes**: qrcode library for generation
- **UI/UX**: Framer Motion, React Dropzone, React Hot Toast
- **Deployment**: Vercel with optimized function configuration

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- Pinata account and JWT token (free 1GB storage)
- Email provider credentials (Gmail, Outlook, etc.)
- GitHub OAuth app (optional, for GitHub authentication)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fileshare-hub.git
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

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# IPFS Storage - Pinata (1GB free, unlimited uploads)
PINATA_JWT=your-pinata-jwt-token
PINATA_GATEWAY_URL=https://gateway.pinata.cloud/ipfs/

# JWT Secret for password reset tokens
JWT_SECRET=your-jwt-secret-key-generate-with-openssl-rand-base64-32

# Email Configuration (Required for password reset and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

### Optional Variables

```bash
# GitHub OAuth (Optional - for GitHub authentication)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# File Upload Settings
MAX_FILE_SIZE=52428800  # 50MB in bytes
UPLOAD_DIR=./uploads

# Admin Configuration
ADMIN_EMAIL=admin@yourcompany.com

# Security Settings
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_MAX=100  # Max requests per window
RATE_LIMIT_WINDOW=900000  # 15 minutes in milliseconds

# File Type Restrictions
ALLOWED_FILE_TYPES=image/*,application/pdf,text/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# Storage and Analytics
MAX_STORAGE_PER_USER=1073741824  # 1GB per user
ANALYTICS_RETENTION_DAYS=90

# Development
NODE_ENV=development
DEBUG_MODE=false
```

## 📁 Project Structure

```
fileshare-hub/
├── app/                          # Next.js 15 app directory
│   ├── admin/                    # Admin panel pages
│   │   ├── analytics/           # System analytics dashboard
│   │   ├── settings/            # Admin configuration
│   │   └── users/               # User management
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin APIs (health, users, etc.)
│   │   ├── auth/                # NextAuth.js authentication
│   │   ├── download/[id]/       # File download handler
│   │   ├── files/               # File management APIs
│   │   │   └── generate-qr/     # QR code generation
│   │   ├── stats/               # Real-time statistics API
│   │   ├── test-db/             # Database connectivity test
│   │   └── upload/              # File upload to IPFS
│   ├── auth/                    # Authentication pages
│   │   ├── signin/              # Custom sign-in page
│   │   ├── signup/              # User registration
│   │   └── forgot-password/     # Password reset
│   ├── components/              # React components
│   │   ├── Home/               # Homepage components
│   │   │   ├── Hero.js         # Hero with dynamic stats
│   │   │   ├── Features.js     # Feature showcase
│   │   │   └── FAQ.js          # Frequently asked questions
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.js       # Custom button component
│   │   │   ├── Card.js         # Card component
│   │   │   ├── Input.js        # Form input component
│   │   │   ├── Loading.js      # Loading spinner
│   │   │   ├── QRCodeDisplay.js # QR code modal component
│   │   │   └── Toast.js        # Toast notifications
│   │   ├── Upload/             # Upload-related components
│   │   │   ├── FileUploader.js # Main upload component
│   │   │   └── DropZone.js     # Drag & drop interface
│   │   └── Dashboard/          # Dashboard components
│   ├── dashboard/              # User dashboard
│   ├── download/[id]/          # File download pages
│   └── upload/                 # File upload interface
├── lib/                        # Utilities and configurations
│   ├── models/                 # MongoDB Mongoose models
│   │   ├── File.js            # File schema with QR codes
│   │   └── User.js            # User schema
│   ├── pinataService.js        # IPFS upload via Pinata
│   ├── emailService.js         # SMTP email service
│   ├── errorHandler.js         # Centralized error handling
│   ├── mongodb.js              # Database connection
│   └── utils.js                # Utility functions
├── public/                     # Static assets
├── scripts/                    # Development scripts
│   └── test-vercel-upload.js   # Upload testing script
├── vercel.json                 # Vercel deployment config
└── README.md                   # This file
```

## 🎯 Usage

### For Users

1. **Upload Files**
   - Visit `/upload` or drag files to homepage
   - Set optional expiration date (hours/days)
   - Configure maximum download limits
   - Add password protection if needed
   - Get instant shareable link and QR code
   - Files are stored permanently on IPFS

2. **Share Files**
   - Copy download link to clipboard
   - Share QR code for mobile access
   - Download QR code as PNG image
   - Send via email or messaging apps

3. **Manage Files (Dashboard)**
   - View all uploaded files with statistics
   - Monitor download counts and remaining limits
   - See QR codes for each file (click to enlarge)
   - Delete files or update settings
   - Track upload history and storage usage

4. **Download Files**
   - Use shared links to access files
   - Enter password if file is protected
   - Files served directly from IPFS gateway
   - Download count automatically tracked

### For Administrators

1. **Admin Panel** (`/admin`)
   - System overview with key metrics
   - Real-time statistics dashboard
   - User management and activity monitoring
   - File management and moderation tools

2. **Health Monitoring**
   - Database connectivity status
   - IPFS/Pinata service health
   - Email service configuration test
   - Error logs and system diagnostics

3. **User Management**
   - View all registered users
   - Monitor user activity and uploads
   - Manage user permissions
   - Ban or restrict problematic users

4. **System Settings**
   - Configure file size limits
   - Set rate limiting rules
   - Manage allowed file types
   - Monitor storage usage and quotas

## 🔒 Security Features

- **Input Validation**: Comprehensive server-side validation for all inputs
- **Rate Limiting**: Configurable request limits to prevent abuse (100 req/15min default)
- **File Type Restrictions**: Whitelist-based file type validation
- **Size Limits**: Configurable maximum file size (50MB default)
- **Password Protection**: Optional bcrypt-hashed password protection for downloads
- **Expiration Dates**: Automatic file cleanup after expiration
- **CSRF Protection**: NextAuth.js provides built-in CSRF protection
- **JWT Security**: Secure token-based authentication with configurable expiration
- **MongoDB Injection Protection**: Mongoose ODM provides automatic sanitization
- **Environment Security**: Sensitive configuration isolated in environment variables
- **HTTPS Enforcement**: Production deployments enforce HTTPS connections
- **Admin Access Control**: Role-based access control for administrative functions

## 📊 Analytics & Monitoring

The platform includes comprehensive analytics and monitoring:

### Real-time Statistics
- Total files uploaded and storage used
- Active users and registration trends
- Download counts and popular files
- System uptime and performance metrics
- Geographic distribution of users (IP-based)

### Dashboard Features
- Upload/download trends over time
- File type distribution analytics
- User activity patterns and engagement
- Storage usage per user and globally
- Error rates and system health metrics

### Admin Monitoring
- System health checks (Database, IPFS, Email)
- User activity logs and audit trails
- File moderation and content management
- Performance metrics and resource usage
- Security event logging and alerts

## 🛡️ Error Handling & Debugging

### Comprehensive Error Management
- Centralized error handling with consistent error responses
- Detailed logging for production debugging
- User-friendly error messages with actionable guidance
- Automatic retry mechanisms for transient failures

### Development Tools
- Debug mode with enhanced logging (`DEBUG_MODE=true`)
- Database connectivity testing endpoint (`/api/test-db`)
- IPFS service health check (`/api/admin/health/ipfs`)
- Upload testing script (`scripts/test-vercel-upload.js`)

### Common Issues & Solutions
1. **Upload Failures**: Check Pinata JWT token and network connectivity
2. **Database Errors**: Verify MongoDB connection string and network access
3. **Email Issues**: Confirm SMTP credentials and app password setup
4. **Authentication Problems**: Check NextAuth configuration and secrets

## 🤝 Contributing

We welcome contributions to FileShare Hub! Here's how you can help:

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/fileshare-hub.git
   cd fileshare-hub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment**
   ```bash
   cp .env.example .env.local
   # Fill in your development environment variables
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Making Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make Your Changes**
   - Follow the existing code style and patterns
   - Add comments for complex logic
   - Update documentation if needed

3. **Test Your Changes**
   ```bash
   # Test locally
   npm run dev
   
   # Run any available tests
   npm run lint
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "Add amazing feature: description of changes"
   git push origin feature/amazing-feature
   ```

5. **Create Pull Request**
   - Open a PR with a clear description
   - Include screenshots for UI changes
   - Reference any related issues

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🆘 Support & Troubleshooting

### Getting Help

If you encounter any issues:

1. **Check the Documentation**: Review this README and other docs in the repository
2. **Search Issues**: Look through existing [GitHub Issues](../../issues) for solutions
3. **Create an Issue**: If you can't find a solution, create a detailed issue report
4. **Community Support**: Join discussions in the repository's Discussion tab

## 📈 Roadmap & Future Features

### Upcoming Features

- [ ] **File Versioning**: Track file versions and allow rollbacks
- [ ] **Bulk Operations**: Upload and manage multiple files at once
- [ ] **Advanced Permissions**: Granular sharing permissions and user roles
- [ ] **API Authentication**: Token-based API access for developers
- [ ] **File Encryption**: Client-side encryption before IPFS upload
- [ ] **Mobile App**: React Native app for iOS and Android
- [ ] **Advanced Analytics**: Detailed reporting and insights dashboard
- [ ] **Storage Integrations**: Support for AWS S3, Google Cloud Storage
- [ ] **Collaboration**: Shared folders and team workspaces
- [ ] **File Preview**: In-browser preview for common file types

---

## 👨‍💻 About

**FileShare Hub** is a modern, decentralized file sharing platform built with the latest web technologies. It leverages IPFS for permanent, distributed storage and provides a seamless user experience for sharing files securely.

### Key Highlights

- ⚡ **Modern Stack**: Built with Next.js 15, React 19, and Tailwind CSS 4
- 🌐 **Decentralized**: Files stored on IPFS for permanent availability
- 🔒 **Secure**: Comprehensive security features and best practices
- 📱 **Responsive**: Mobile-first design with PWA capabilities
- 🚀 **Fast**: Optimized for performance with modern build tools
- 🛠️ **Developer Friendly**: Well-documented API and clear code structure

### Live Demo

Visit our live deployment: [https://filesharehub.vercel.app](https://filesharehub.vercel.app)

### Repository Stats

![GitHub stars](https://img.shields.io/github/stars/your-username/fileshare-hub)
![GitHub forks](https://img.shields.io/github/forks/your-username/fileshare-hub)
![GitHub issues](https://img.shields.io/github/issues/your-username/fileshare-hub)
![GitHub license](https://img.shields.io/github/license/your-username/fileshare-hub)

---

**Made with ❤️ by [the-pranay](https://github.com/the-pranay)**

*If you find this project helpful, please consider giving it a ⭐ on GitHub!*
