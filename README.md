# Codebook - Fullstack Website

Professional IT company website with admin panel.

## 📁 Project Structure

```
codebook/
├── codebook-backend/        # Backend (Node.js + Express)
│   ├── config/              # Database configuration
│   ├── controllers/         # API controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── server.js            # Main server file
│   └── package.json
│
├── codebook-frontend/       # Frontend
│   ├── css/                 # Stylesheets
│   │   ├── style.css       # Main styles
│   │   └── admin.css       # Admin panel styles
│   ├── js/                  # JavaScript files
│   │   ├── main.js         # Main frontend JS
│   │   └── admin.js        # Admin panel JS
│   ├── admin/              # Admin panel
│   │   └── index.html
│   └── index.html          # Main website
│
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Backend Setup (pnpm)

```bash
# Install dependencies
cd codebook-backend
pnpm install

# Start server
pnpm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

Simply open `codebook-frontend/index.html` in a browser, or use a local server:

```bash
# Using pnpm
cd codebook-frontend
pnpm exec serve .

# Using Python
cd codebook-frontend
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### Admin Panel

Access the admin panel at: `http://localhost:8000/admin/`

## 📡 API Endpoints

### Contact
- `GET /api/contact` - Get all contacts (Admin)
- `POST /api/contact` - Submit contact form (Public)
- `PUT /api/contact/:id/read` - Mark as read (Admin)
- `DELETE /api/contact/:id` - Delete contact (Admin)

### Portfolio
- `GET /api/portfolio` - Get all portfolio items
- `GET /api/portfolio/featured` - Get featured items
- `POST /api/portfolio` - Create portfolio (Admin)
- `PUT /api/portfolio/:id` - Update portfolio (Admin)
- `DELETE /api/portfolio/:id` - Delete portfolio (Admin)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/featured` - Get featured services
- `POST /api/services` - Create service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)

### Team
- `GET /api/team` - Get all team members
- `POST /api/team` - Create team member (Admin)
- `PUT /api/team/:id` - Update team member (Admin)
- `DELETE /api/team/:id` - Delete team member (Admin)

## 🛠️ Technologies

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome Icons
- Google Fonts

## 🌐 Deployment

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Deploy the `codebook-frontend` folder

### Backend (Render/Railway)
1. Push backend code to GitHub
2. Connect to Render or Railway
3. Set environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `PORT` - Server port (default: 5000)

## 📝 Features

### Frontend Website
- ✅ Hero section with company name and slogan
- ✅ About us section
- ✅ Services section
- ✅ Portfolio section with filtering
- ✅ Why choose us section
- ✅ Team section
- ✅ Contact form with validation
- ✅ Footer with newsletter
- ✅ Responsive design
- ✅ Smooth animations

### Admin Panel
- ✅ Dashboard with statistics
- ✅ View and manage contact messages
- ✅ Add/Edit/Delete portfolio items
- ✅ Add/Edit/Delete services
- ✅ Add/Edit/Delete team members

## 📄 License

MIT License
