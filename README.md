# 🏡 Property Pulse — Backend (Node + Express + MongoDB + Render)

This is the backend API for the **Property Pulse Real Estate Website**, built using:

- Node.js  
- Express  
- MongoDB (Atlas)  
- Cloudinary (image uploads)  
- Render (deployment)

---

# 🔗 Important Links

| Service | URL |
|--------|-----|
| Backend Dashboard (Render) | https://dashboard.render.com/project/prj-d6u1k7fpm1nc73cumva0/environment/evm-d6u1k7fpm1nc73cumvag |
| GitHub (Backend Repo) | https://github.com/blesson189-rgb/real-estate-backend |
| Live Frontend | https://www.propertypulse.it.com |
| MongoDB Atlas  | https://cloud.mongodb.com/v2/69bd08e3bba37b921713dcbe#/overview |
| Cloudinary - dovcyyubv  | https://console.cloudinary.com/app/c-3082f930f79a273839997d5001896e/assets/media_library/search?q=&view_mode=mosaic |

---

# 📁 Project Structure

server/
│── src/
│   ├── server.ts
│   ├── cloudinary.ts
│── package.json
│── .env


---

# ⚙️ Environment Variables

Create `.env`:

CLOUD_NAME=dovcyyubv
CLOUD_KEY=331585223883497
CLOUD_SECRET=-4mCI_BknG3iO4xWIlTandKi9Ko
MONGO_URL=mongodb+srv://relEstAdmin:Blesson%40189@cluster1.g34vn4n.mongodb.net/realestate?retryWrites=true&w=majority&appName=Cluster1



---

# 🚀 Running Locally

npm install
npm start


Backend runs at:

https://localhost:5000


---

# 🧭 API Routes

## Public Routes
GET /api/slider
GET /api/trusted
GET /api/projects
GET /api/contacts
GET /api/about
POST /api/contact



## Admin Routes (Protected with JWT)
POST /api/admin/login

POST /api/slider
DELETE /api/slider/:id

POST /api/trusted
DELETE /api/trusted/:id

POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id

POST /api/admin/login

POST /api/slider
DELETE /api/slider/:id

POST /api/trusted
DELETE /api/trusted/:id

POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id



---

# 🔐 Admin Credentials

| Field | Value |
|-------|--------|
| Username | `admin@property` |
| Password | `Admin@123` |

# 🔐 MongoDB Credentials 

| Field | Value |
|-------|--------|
| Username | `relEstAdmin` |
| Password | `Blesson@189` |

---

# 🧩 Features

### ✔ Slider Management  
Upload/delete slider images (Cloudinary)

### ✔ Trusted Logos  
Upload/delete partner logos

### ✔ Projects  
Add/edit/delete real estate projects

### ✔ Contact Info  
Editable contact details

### ✔ About Us  
Admin‑editable About Us content

### ✔ Enquiries  
View/delete customer enquiries

---

# 🚀 Deployment (Render)

### Push backend changes:

git add .
git commit -m "Backend update"
git push origin master

in the github merge the master to main : https://github.com/blesson189-rgb/real-estate-backend


Render auto‑deploys.

---

# 🌍 CORS Configuration

Backend allows:
http://localhost:3000
https://www.propertypulse.it.com (propertypulse.it.com in Bing)
https://propertypulse.it.com (propertypulse.it.com in Bing)


---

# 📦 Image Uploads

Handled via:

- `multer`
- `multer-storage-cloudinary`
- Cloudinary SDK

Images are stored in:

Cloudinary folder: real-estate


---

# 📞 Support

For frontend details, see the frontend README in `/client`.





