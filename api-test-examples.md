# FileShare Hub API Testing Examples

## Authentication Testing

### Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Forgot Password
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

## File Management Testing

### Upload File (with authentication)
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -F "file=@/path/to/your/file.pdf" \
  -F "password=optional_password" \
  -F "expiresIn=24h"
```

### Get User Files
```bash
curl -X GET "http://localhost:3000/api/files?page=1&limit=10" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Download File
```bash
curl -X GET "http://localhost:3000/api/download/DOWNLOAD_ID?password=file_password"
```

## Admin API Testing (Requires Admin Role)

### Get Admin Stats
```bash
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Cookie: next-auth.session-token=YOUR_ADMIN_SESSION_TOKEN"
```

### Get All Users (Admin)
```bash
curl -X GET "http://localhost:3000/api/admin/users?page=1&limit=20" \
  -H "Cookie: next-auth.session-token=YOUR_ADMIN_SESSION_TOKEN"
```

### Get Analytics
```bash
curl -X GET "http://localhost:3000/api/admin/analytics?period=30d" \
  -H "Cookie: next-auth.session-token=YOUR_ADMIN_SESSION_TOKEN"
```

### Health Checks
```bash
# Database Health
curl -X GET http://localhost:3000/api/admin/health/database \
  -H "Cookie: next-auth.session-token=YOUR_ADMIN_SESSION_TOKEN"

# IPFS Health  
curl -X GET http://localhost:3000/api/admin/health/ipfs \
  -H "Cookie: next-auth.session-token=YOUR_ADMIN_SESSION_TOKEN"
```

## Utility Testing

### Promote User to Admin
```bash
curl -X POST http://localhost:3000/api/promote-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "thepranay2004@gmail.com",
    "action": "promote"
  }'
```

### Get All Users (Promote Admin)
```bash
curl -X GET http://localhost:3000/api/promote-admin
```

## Notes:
1. Replace `YOUR_SESSION_TOKEN` with actual session token from browser cookies
2. Replace `DOWNLOAD_ID` with actual download ID from uploaded files
3. Replace file paths with actual file paths on your system
4. Admin endpoints require admin role authentication
5. Some endpoints require specific authentication states
