# SIAMESE FILMART Backend API

Backend API สำหรับระบบจัดการ SIAMESE FILMART Admin System

## 🚀 เทคโนโลยีที่ใช้

- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **MongoDB** - NoSQL Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

## 📋 ข้อกำหนดเบื้องต้น

- Node.js (v18 หรือสูงกว่า)
- MongoDB (v6 หรือสูงกว่า)
- npm หรือ yarn

## 🛠️ การติดตั้ง

### 1. Clone repository

```bash
cd /Volumes/Back\ up\ data\ Devjuu/backednsiam
```

### 2. ติดตั้ง dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` จาก `.env.example`:

```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/siamese-filmart
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### 4. เริ่มต้น MongoDB

ตรวจสอบว่า MongoDB กำลังทำงานอยู่:

```bash
# macOS (ถ้าติดตั้งผ่าน Homebrew)
brew services start mongodb-community

# หรือ
mongod
```

### 5. รัน Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server จะรันที่ `http://localhost:5000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | สมัครสมาชิก Admin | ❌ |
| POST | `/api/auth/login` | เข้าสู่ระบบ | ❌ |
| GET | `/api/auth/me` | ดูข้อมูลตัวเอง | ✅ |
| POST | `/api/auth/logout` | ออกจากระบบ | ✅ |

### Admin Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admins` | ดูรายการ Admin ทั้งหมด | ✅ |
| GET | `/api/admins/:id` | ดูข้อมูล Admin | ✅ |
| POST | `/api/admins` | สร้าง Admin ใหม่ | ✅ (Super Admin) |
| PUT | `/api/admins/:id` | แก้ไขข้อมูล Admin | ✅ |
| DELETE | `/api/admins/:id` | ลบ Admin | ✅ (Super Admin) |

### Agenda Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/agenda` | ดูรายการกำหนดการ | ❌ |
| GET | `/api/agenda/:id` | ดูรายละเอียดกำหนดการ | ❌ |
| POST | `/api/agenda` | สร้างกำหนดการใหม่ | ✅ |
| PUT | `/api/agenda/:id` | แก้ไขกำหนดการ | ✅ |
| DELETE | `/api/agenda/:id` | ลบกำหนดการ | ✅ |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | ตรวจสอบสถานะ API |

## 🔐 Authentication

API ใช้ JWT (JSON Web Token) สำหรับ authentication

### การใช้งาน:

1. Login ผ่าน `/api/auth/login` เพื่อรับ token
2. ส่ง token ใน Header ของทุก request:

```
Authorization: Bearer <your-token>
```

### ตัวอย่าง Request:

```javascript
fetch('http://localhost:5000/api/admins', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Content-Type': 'application/json'
  }
})
```

## 📝 Models

### Admin
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (Super Admin, Admin, Editor),
  status: String (active, inactive),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Agenda
```javascript
{
  title: String,
  date: Date,
  time: String,
  location: String,
  speaker: String,
  status: String (upcoming, ongoing, completed),
  description: String,
  createdBy: ObjectId (ref: Admin)
}
```

### Speaker
```javascript
{
  name: String,
  email: String,
  phone: String,
  organization: String,
  position: String,
  bio: String,
  photo: String,
  expertise: [String],
  socialMedia: Object,
  status: String (confirmed, pending, cancelled)
}
```

### Participant
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  organization: String,
  country: String,
  participantType: String (attendee, exhibitor, speaker, student),
  registrationDate: Date,
  checkedIn: Boolean,
  status: String (registered, confirmed, cancelled)
}
```

### Multimedia
```javascript
{
  title: String,
  type: String (image, video),
  url: String,
  thumbnail: String,
  description: String,
  category: String (event, exhibition, speaker, general),
  tags: [String],
  uploadedBy: ObjectId (ref: Admin),
  views: Number,
  featured: Boolean
}
```

## 🧪 การทดสอบ API

### ใช้ cURL:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@siamese.com","password":"password123"}'

# Get all admins (ต้องมี token)
curl -X GET http://localhost:5000/api/admins \
  -H "Authorization: Bearer <your-token>"
```

### ใช้ Postman หรือ Thunder Client:

1. Import collection จาก `/postman` (ถ้ามี)
2. ตั้งค่า Environment Variables
3. ทดสอบ endpoints

## 📁 โครงสร้างโปรเจค

```
backednsiam/
├── controllers/          # Business logic
│   ├── authController.js
│   ├── adminController.js
│   └── agendaController.js
├── middleware/          # Middleware functions
│   └── auth.js
├── models/             # Database models
│   ├── Admin.js
│   ├── Agenda.js
│   ├── Speaker.js
│   ├── Participant.js
│   └── Multimedia.js
├── routes/             # API routes
│   ├── auth.js
│   ├── admin.js
│   ├── agenda.js
│   ├── speaker.js
│   ├── participant.js
│   └── multimedia.js
├── .env.example        # Environment variables example
├── .gitignore
├── package.json
├── server.js           # Entry point
└── README.md
```

## 🔒 Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- CORS enabled for specified origins
- Input validation using express-validator
- MongoDB injection protection

## 🚧 TODO

- [ ] Implement Speaker CRUD operations
- [ ] Implement Participant CRUD operations
- [ ] Implement Multimedia upload
- [ ] Add email notifications
- [ ] Add file upload for images
- [ ] Add pagination
- [ ] Add search and filtering
- [ ] Add rate limiting
- [ ] Add API documentation (Swagger)
- [ ] Add unit tests

## 📞 Support

หากมีปัญหาหรือต้องการความช่วยเหลือ กรุณาติดต่อทีมพัฒนา

---

**Made with ❤️ for SIAMESE FILMART**
