# Vercel System Design (Subdomain-Based Hosting with AWS + Vercel)

This project implements a **mini-Vercel-like system** capable of:

* Hosting multiple static sites (like Next.js builds) under **subdomains**
* Using **AWS S3 + CloudFront** as the backend storage
* Programmatically deploying sites via the **Vercel API**
* Serving sites via a central request handler
* Dynamically rendering content based on subdomain


---

## 🧹 Architecture Overview

```
User ↔️ [localhost:5432] Frontend (Next.js)
     ↕︎
Frontend ➡️ Upload-Service[localhost:3000] ➡️ AWS S3
         ➡️ Vercel Deploy Service [build the project]
         ↕︎
    [localhost:3001] Request Handler (Proxy)
```
* Repo Files are fetched from **Github** and then uploaded to **S3** with keys like `dist/<id>/src/...`
* The whole repo code fetched to local mahchine and got build and make build files and assets. 
* Build Files are uploaded to **S3** with keys like `dist/<subdomain>/index.html`
* `request-handler-service` maps subdomains to S3 folders
* CloudFront handles public delivery (or fallback to local proxy)
* Vercel deployment is triggered via the Vercel API(Not done yet)

---

## 🧠 Tech Stack

* **Frontend:** React.js (Dynamic Subdomain Routing)
* **Backend Services:** Node.js + TypeScript + Express
* **Storage:** AWS/CloudFlare S3 (with optional CloudFront)
* **Caches and Queues :** Redis SQS

---

## 💍 Local Setup Instructions

> 🧠 All services run independently, you must start them individually.

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/zunxii/vercel-system-design.git
cd vercel-system-design
```

### 2️⃣ Install Dependencies

```bash
npm install --prefix frontend
npm install --prefix request-handler-service
npm install --prefix upload-service
npm install --prefix vercel-deploy-service
```

---

## 🔑 Setup `.env` FilesCreate a `.env` file in the root with:

```env
ACCESS_KEY_ID=your_aws_access_key
SECRET_ACCESS_KEY=your_aws_secret_key
ENDPOINT=https://s3.amazonaws.com

```

### ✅ Get AWS/Cloudflare Credentials

1. Create a bucket on S3 (publicly accessible)
2. Enable static website hosting on the bucket

### ✅ Get Vercel Token



## 🚀 Run Each Service

### Frontend (React.js)

```bash
npm run dev --prefix frontend
# Runs at http://localhost:5432
```

### Request Handler Service

```bash
npm run dev --prefix request-handler-service
# Runs at http://localhost:3001
```

### Upload Service

```bash
npm run dev --prefix upload-service
# Runs at http://localhost:3000
```


## 🌐 Test Subdomain-Based Routing Locally

To emulate subdomains:

### Linux/macOS:

Edit `/etc/hosts`:

```
127.0.0.1 site1.localhost
127.0.0.1 site2.localhost
```

Now visit:

```
http://site1.localhost:3000
http://site2.localhost:3000
```

Each subdomain serves a different static site from S3.

---

## 📂 Folder Structure

```
vercel-system-design/
├── frontend/                # Next.js app
├── request-handler-service/ # S3/CloudFront-based proxy
├── upload-service/         # Uploads static sites to S3
├── vercel-deploy-service/  # Deploys projects to Vercel
├── .env                    # Environment variables
```

---

## 📌 Important Notes

* ⚠️ Ensure CORS settings are enabled on your S3 bucket.
* 🌐 If using CloudFront, make sure its origin is your S3 bucket.
* 📦 `upload-service` automatically uploads builds to `s3://bucket/dist/<subdomain>/`

---



MIT – use this freely and modify it for your own custom hosting platform!
