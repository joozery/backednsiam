# Gallery API Documentation

## Overview
Gallery API สำหรับจัดการรูปภาพของ SIAMESE FILMART โดยใช้ Cloudinary สำหรับเก็บรูปภาพ

## Cloudinary Configuration
- **Cloud Name**: drd3f0e3q
- **Folder**: siamese-gallery
- **Auto Optimization**: ใช่ (quality: auto, format: auto)
- **Max Dimensions**: 1920x1080

## API Endpoints

### 1. Get All Gallery Images
```
GET /api/gallery
```

**Query Parameters:**
- `category` (optional): festival, exhibition, event, behind-the-scenes, other
- `year` (optional): ปี (เช่น 2025)
- `featured` (optional): true/false

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "title": "SIAMESE FILMART 2025",
      "description": "Opening ceremony",
      "imageUrl": "https://res.cloudinary.com/...",
      "cloudinaryId": "siamese-gallery/...",
      "category": "festival",
      "tags": ["opening", "ceremony"],
      "year": 2025,
      "featured": true,
      "views": 150,
      "uploadedBy": {
        "_id": "...",
        "name": "Admin Name",
        "email": "admin@example.com"
      },
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Get Single Gallery Image
```
GET /api/gallery/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "...",
    "imageUrl": "...",
    "views": 151
  }
}
```

### 3. Upload Gallery Image
```
POST /api/gallery
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- `image` (file, required): รูปภาพ (jpeg, jpg, png, gif, webp, max 5MB)
- `title` (string, required): ชื่อรูปภาพ
- `description` (string, optional): คำอธิบาย
- `category` (string, optional): หมวดหมู่
- `tags` (string, optional): แท็ก (คั่นด้วย comma)
- `year` (number, optional): ปี
- `featured` (boolean, optional): แนะนำ

**Example using cURL:**
```bash
curl -X POST http://localhost:5001/api/gallery \
  -H "Authorization: Bearer <your-token>" \
  -F "image=@/path/to/image.jpg" \
  -F "title=SIAMESE FILMART 2025" \
  -F "description=Opening ceremony" \
  -F "category=festival" \
  -F "tags=opening,ceremony,2025" \
  -F "year=2025" \
  -F "featured=true"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "SIAMESE FILMART 2025",
    "imageUrl": "https://res.cloudinary.com/...",
    "cloudinaryId": "siamese-gallery/..."
  }
}
```

### 4. Update Gallery Image
```
PUT /api/gallery/:id
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- `image` (file, optional): รูปภาพใหม่
- `title` (string, optional): ชื่อรูปภาพ
- `description` (string, optional): คำอธิบาย
- `category` (string, optional): หมวดหมู่
- `tags` (string, optional): แท็ก
- `featured` (boolean, optional): แนะนำ

**Note:** หากอัปโหลดรูปใหม่ รูปเก่าจะถูกลบจาก Cloudinary อัตโนมัติ

### 5. Delete Gallery Image
```
DELETE /api/gallery/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

**Note:** รูปภาพจะถูกลบทั้งจาก Database และ Cloudinary

### 6. Get Gallery Statistics
```
GET /api/gallery/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalImages": 50,
    "featuredImages": 10,
    "categoryCounts": [
      { "_id": "festival", "count": 20 },
      { "_id": "exhibition", "count": 15 },
      { "_id": "event", "count": 10 },
      { "_id": "behind-the-scenes", "count": 5 }
    ]
  }
}
```

## Image Categories
- `festival` - งานเทศกาล
- `exhibition` - นิทรรศการ
- `event` - กิจกรรม
- `behind-the-scenes` - เบื้องหลัง
- `other` - อื่นๆ

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please upload an image"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Image not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Testing with Postman

1. **Login** to get token:
   ```
   POST /api/auth/login
   Body: { "email": "admin@siamese.com", "password": "admin123" }
   ```

2. **Upload Image**:
   - Method: POST
   - URL: http://localhost:5001/api/gallery
   - Headers: Authorization: Bearer <token>
   - Body: form-data
     - image: [select file]
     - title: "Test Image"
     - category: "festival"

3. **Get All Images**:
   ```
   GET /api/gallery
   ```

## Frontend Integration Example

```javascript
// Upload image
const formData = new FormData();
formData.append('image', file);
formData.append('title', 'SIAMESE FILMART 2025');
formData.append('description', 'Opening ceremony');
formData.append('category', 'festival');
formData.append('tags', 'opening,ceremony');
formData.append('featured', 'true');

const response = await fetch('http://localhost:5001/api/gallery', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
```

## Notes
- รูปภาพจะถูก optimize อัตโนมัติโดย Cloudinary
- ขนาดสูงสุด 5MB ต่อรูป
- รองรับไฟล์: jpeg, jpg, png, gif, webp
- รูปภาพจะถูกเก็บใน folder "siamese-gallery" บน Cloudinary
