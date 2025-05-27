# Art Gallery Website

A modern, responsive art gallery website built with Next.js, featuring a beautiful admin dashboard for managing artworks and a stunning frontend for showcasing art.

## 🎨 Features

### Frontend
- **Modern Design**: Dark theme with purple/pink gradients and glassmorphism effects
- **Responsive Layout**: Mobile-first design that works on all devices
- **Interactive Gallery**: Masonry and grid layouts with full-screen lightbox
- **Advanced Filtering**: Search and category filtering with smooth animations
- **Artist Showcase**: Dedicated about page with timeline and achievements
- **Contact Forms**: Beautiful contact page with social media integration

### Admin Dashboard
- **Easy Management**: User-friendly dashboard for managing artworks and categories
- **Image Uploads**: Automatic image compression and S3 storage
- **Dynamic Categories**: Create and manage artwork categories
- **Featured Content**: Control which artworks appear on homepage
- **Site Settings**: Manage artist bio, contact info, and social media links
- **Responsive Design**: Dashboard works perfectly on mobile devices

### Technical Features
- **Next.js 14**: Latest features with TypeScript
- **Prisma ORM**: Type-safe database operations
- **AWS S3**: Secure image storage with compression
- **NextAuth**: Simple authentication for admin access
- **Tailwind CSS**: Modern styling with custom animations
- **Image Optimization**: Automatic compression to prevent theft while maintaining quality

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- AWS S3 bucket
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd art-gallery-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/art_gallery_db"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # AWS S3
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_REGION="us-east-1"
   AWS_S3_BUCKET_NAME="your-bucket-name"

   # Admin Credentials
   ADMIN_USERNAME="admin"
   ADMIN_PASSWORD="your-secure-password"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # Seed admin user and initial data
   npx ts-node scripts/seed-admin.ts
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see the website.
   Admin dashboard: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## 📁 Project Structure

```
art-gallery-nextjs/
├── components/           # Reusable UI components
│   ├── admin/           # Admin dashboard components
│   ├── Layout.tsx       # Main site layout
│   └── ImageUpload.tsx  # Image upload component
├── lib/                 # Utility libraries
│   ├── prisma.ts        # Database client
│   ├── auth.ts          # Authentication config
│   ├── s3.ts            # AWS S3 utilities
│   └── imageUtils.ts    # Image processing
├── pages/               # Next.js pages
│   ├── api/             # API routes
│   ├── admin/           # Admin dashboard pages
│   ├── index.tsx        # Homepage
│   ├── gallery.tsx      # Gallery page
│   ├── about.tsx        # About page
│   └── contact.tsx      # Contact page
├── prisma/              # Database schema
├── styles/              # Global styles
├── types/               # TypeScript types
└── scripts/             # Utility scripts
```

## 🎯 Usage

### Admin Dashboard

1. **Login**: Visit `/admin/login` with your credentials
2. **Dashboard**: Overview of your artworks and statistics
3. **Artworks**: Add, edit, delete artworks with image uploads
4. **Categories**: Manage artwork categories dynamically
5. **Settings**: Update artist bio, contact info, social links

### Content Management

- **Featured Artworks**: Toggle featured status to show on homepage
- **Categories**: Create custom categories like "Paintings", "Digital Art", etc.
- **Image Quality**: Automatic compression optimizes for web while preventing theft
- **Responsive Images**: Different sizes generated for various devices

## 🔧 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `styles/globals.css` for global styles
- Component styles use Tailwind CSS classes

### Features
- Add new fields to artwork model in `prisma/schema.prisma`
- Extend API routes in `pages/api/`
- Create new pages following existing patterns

### Deployment
- **Vercel**: Simple deployment with GitHub integration
- **Database**: Use PostgreSQL on platforms like Supabase or Railway
- **Storage**: Configure S3 bucket with proper CORS settings

## 📱 Responsive Design

The website is fully responsive and tested on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Design Features

- **Glassmorphism**: Modern glass-like effects
- **Gradient Accents**: Purple to pink gradients throughout
- **Smooth Animations**: Subtle hover and transition effects
- **Dark Theme**: Professional dark color scheme
- **Typography**: Inter font for clean readability

## 🔒 Security

- Admin routes protected with NextAuth
- Image uploads validated and compressed
- Environment variables for sensitive data
- CSRF protection on forms
- Secure headers configured

## 📧 Support

For questions or issues:
- Check existing documentation
- Review environment variable setup
- Ensure database connection is working
- Verify S3 bucket permissions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first styling
- Prisma for the excellent database toolkit
- Lucide React for beautiful icons