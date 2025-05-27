# Debugging Issues

## Fixed Issues:

### 1. Next.js Config Warning
**Problem**: `env.CUSTOM_KEY is missing`
**Solution**: Commented out the unused env variable in next.config.js

### 2. @next/font Warning
**Problem**: Using deprecated @next/font package
**Solution**: Removed @next/font from package.json (Next.js 14 has built-in font optimization)

### 3. NEXTAUTH_URL Warning
**Problem**: NextAuth URL warning
**Solution**: Make sure your .env file has NEXTAUTH_URL="http://localhost:3000" and NEXTAUTH_SECRET with a long random string

## Gallery Page 404 Issue

If the gallery page shows 404, try these steps:

### Step 1: Check File Structure
Make sure `pages/gallery.tsx` exists in the correct location:
```
pages/
├── gallery.tsx  ← This file should exist
├── index.tsx
├── about.tsx
└── contact.tsx
```

### Step 2: Restart Development Server
```bash
# Stop the dev server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Check Database Connection
The gallery page needs database data. Make sure:

1. Database is running and accessible
2. Environment variables are set correctly
3. Run database commands:
```bash
npm run db:generate
npm run db:push
npm run seed
```

### Step 4: Check for Compilation Errors
Look in the terminal for any TypeScript or compilation errors when accessing /gallery

### Step 5: Test with Simple Gallery Page
If the issue persists, temporarily replace the content of `pages/gallery.tsx` with this simple version:

```tsx
export default function Gallery() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold">Gallery Page</h1>
      <p>This is a test gallery page.</p>
    </div>
  )
}
```

If this works, the issue is with the original gallery page code (likely database connection).

### Step 6: Check Browser Console
Open browser dev tools (F12) and check for any JavaScript errors when visiting /gallery

## Quick Fix Commands:

```bash
# Clean everything and restart
rm -rf .next
rm -rf node_modules
npm install
npm run db:generate
npm run db:push
npm run seed
npm run dev
```

## Environment Variables Checklist:

Make sure your `.env` file has all required variables:
- DATABASE_URL (pointing to your database)
- NEXTAUTH_URL="http://localhost:3000"
- NEXTAUTH_SECRET (long random string)
- AWS credentials (can be dummy values for testing)

The gallery page should work once database connection is established!