# Twodesk Admin — Task List (ละเอียด)

> อ้างอิงจาก `ADMIN_SYSTEM_PLAN.md` — อัปเดตล่าสุด: 2026-03-29

---

## Phase 1: Infrastructure Setup

### 1.1 Supabase Project
- [ ] สมัคร/เข้า Supabase Dashboard → สร้าง project "twodesk-studio"
- [ ] เลือก region: Singapore (ใกล้ไทยสุด)
- [ ] จดค่า: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] จดค่า: `DATABASE_URL` (PostgreSQL connection string)

### 1.2 Environment Variables
- [ ] สร้างไฟล์ `twodesk-web/.env.local`
- [ ] ใส่ค่า:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  DATABASE_URL=
  ```
- [ ] เพิ่ม `.env.local` ใน `.gitignore` (ถ้ายังไม่มี)
- [ ] สร้าง `.env.example` สำหรับ reference

### 1.3 ติดตั้ง Prisma
- [ ] `npm install prisma @prisma/client`
- [ ] `npx prisma init` → สร้าง `prisma/schema.prisma`
- [ ] ตั้งค่า datasource provider เป็น `postgresql`
- [ ] ตั้งค่า `DATABASE_URL` จาก env

### 1.4 สร้าง Database Schema
- [ ] เขียน Prisma schema สำหรับตาราง `projects`
  - id (uuid, default cuid), title_th, title_en, slug (unique), category (enum), location_th, location_en, area_sqm, year, description_th, description_en, content_th (Json), content_en (Json), cover_image, images (Json), image_groups (Json), seo_title, seo_description, seo_keywords (String[]), status (enum: DRAFT/PUBLISHED), sort_order (Int), created_at, updated_at
- [ ] เขียน Prisma schema สำหรับตาราง `articles`
  - id, title_th, title_en, slug (unique), category, excerpt_th, excerpt_en, content_th (Json), content_en (Json), cover_image, seo_title, seo_description, seo_keywords (String[]), status (enum), published_at, created_at, updated_at
- [ ] เขียน Prisma schema สำหรับตาราง `messages`
  - id, name, email, phone, project_type, message, is_read (default false), is_archived (default false), created_at
- [ ] เขียน Prisma schema สำหรับตาราง `media`
  - id, filename, url, folder, size_bytes, mime_type, width, height, alt_text, uploaded_by, created_at
- [ ] เขียน Prisma schema สำหรับตาราง `users`
  - id (uuid from Supabase Auth), email, name, nickname, role (enum: SUPER_ADMIN/ADMIN), avatar_url, created_at
- [ ] เขียน Prisma schema สำหรับตาราง `site_settings`
  - key (PK), value (Json), updated_at
- [ ] เขียน Prisma schema สำหรับตาราง `page_views`
  - id, path, referrer, user_agent, created_at
- [ ] Run `npx prisma migrate dev --name init` → สร้าง migration
- [ ] ตรวจสอบ tables ใน Supabase Dashboard

### 1.5 Seed ข้อมูล
- [ ] สร้าง `prisma/seed.ts`
- [ ] Seed projects: ย้ายข้อมูลจาก `data.ts` (5 projects รวม Hidden Sunken Hub)
- [ ] Seed articles: ย้ายข้อมูลจาก `data.ts` (7 articles)
- [ ] Seed site_settings: ข้อมูลบริษัท, social links, SEO defaults
- [ ] Seed users: สร้าง admin user เริ่มต้น
- [ ] ตั้งค่า `package.json` → `"prisma": { "seed": "ts-node prisma/seed.ts" }`
- [ ] Run `npx prisma db seed`

### 1.6 Supabase Auth Setup
- [ ] เปิด Email/Password auth ใน Supabase Dashboard → Authentication → Providers
- [ ] ปิด Email confirmation (สำหรับ dev — เปิดทีหลังใน production)
- [ ] `npm install @supabase/supabase-js @supabase/ssr`
- [ ] สร้าง `src/lib/supabase/client.ts` (browser client)
- [ ] สร้าง `src/lib/supabase/server.ts` (server client)
- [ ] สร้าง middleware สำหรับ refresh session
- [ ] สร้าง admin user แรกผ่าน Supabase Dashboard → Authentication → Users

### 1.7 Prisma Client Utility
- [ ] สร้าง `src/lib/prisma.ts` — singleton pattern
- [ ] ทดสอบ query: `prisma.project.findMany()` ใน API route

---

## Phase 2: Admin Panel — Core UI

### 2.1 ติดตั้ง shadcn/ui
- [ ] `npx shadcn@latest init`
- [ ] เลือก style: Default, color: Neutral
- [ ] ติดตั้ง components พื้นฐาน:
  ```
  npx shadcn@latest add button input label textarea select
  npx shadcn@latest add table card badge separator
  npx shadcn@latest add dialog sheet dropdown-menu
  npx shadcn@latest add tabs form toast
  npx shadcn@latest add avatar command sidebar
  ```
- [ ] ปรับ theme ให้ตรง Twodesk DS (ขาว-ดำ-เทา, Helvetica)
- [ ] ทดสอบ: render Button + Card ดูว่า style ถูก

### 2.2 Admin Layout
- [ ] สร้าง `src/app/admin/layout.tsx`
  - ใช้ layout แยกจากหน้าเว็บ (ไม่มี nav/footer ของเว็บหลัก)
  - Sidebar component (ตาม design ใน Paper)
  - Top bar (date, notification, user)
  - Main content area
- [ ] สร้าง `src/components/admin/Sidebar.tsx`
  - Logo TWO DESK
  - Search bar (⌘K)
  - Section groups: General, Content, Communication, Settings
  - Active state highlight
  - Badge counts (projects, blog, unread messages)
  - User profile ด้านล่าง
- [ ] สร้าง `src/components/admin/TopBar.tsx`
  - Breadcrumb
  - Date
  - Notification icon
- [ ] ทดสอบ: เปิด `/admin` ดูว่า layout แสดงถูก

### 2.3 Auth — Login Page
- [ ] สร้าง `src/app/admin/login/page.tsx`
  - Layout split: brand ซ้าย (dark) + form ขวา (light) ตาม Paper design
  - Email + Password fields
  - Sign In button → call Supabase Auth `signInWithPassword`
  - Error handling (wrong email/password)
  - Redirect ไป `/admin` หลัง login สำเร็จ
- [ ] สร้าง `src/app/admin/login/layout.tsx` — layout ไม่มี sidebar
- [ ] สร้าง middleware: ถ้าไม่ได้ login → redirect ไป `/admin/login`
- [ ] สร้าง logout function → redirect กลับ `/admin/login`
- [ ] ทดสอบ: login/logout flow ทำงานถูก

### 2.4 Dashboard
- [ ] สร้าง `src/app/admin/page.tsx` (dashboard)
- [ ] Stat cards (4 ใบ): Total Projects, Blog Articles, New Messages, Page Views
  - Query จาก Prisma: `prisma.project.count()`, `prisma.article.count()`, `prisma.message.count({ where: { is_read: false } })`
- [ ] Recent Projects table (5 อันล่าสุด)
- [ ] Recent Messages list (4 อันล่าสุด)
- [ ] Page Views chart placeholder (เชื่อม GA4 ทีหลัง)
- [ ] Quick action buttons: + New Project, + New Article
- [ ] ทดสอบ: data แสดงถูก, links ทำงาน

---

## Phase 3: Admin Panel — CRUD Pages

### 3.1 Projects List
- [ ] สร้าง `src/app/admin/projects/page.tsx`
- [ ] สร้าง API route `src/app/api/admin/projects/route.ts`
  - GET: ดึง projects ทั้งหมด (filter, search, pagination)
  - POST: สร้าง project ใหม่
- [ ] สร้าง API route `src/app/api/admin/projects/[id]/route.ts`
  - GET: ดึง project เดียว
  - PUT: อัปเดต project
  - DELETE: ลบ project
- [ ] Table component: columns (checkbox, thumbnail, title, category, location, area, year, status, views, actions)
- [ ] Category filter pills (All, Commercial, Cafe, Residential, Others) — ใช้ category colors
- [ ] Search bar — filter by title
- [ ] Status filter dropdown (All, Published, Draft)
- [ ] Sort dropdown (Newest, Oldest, Name A-Z)
- [ ] Pagination component
- [ ] Delete confirmation dialog
- [ ] ทดสอบ: CRUD ทำงานครบ, filter/search ถูก

### 3.2 Project Editor
- [ ] สร้าง `src/app/admin/projects/new/page.tsx` (สร้างใหม่)
- [ ] สร้าง `src/app/admin/projects/[id]/page.tsx` (แก้ไข)
- [ ] สร้าง `src/components/admin/ProjectForm.tsx` (shared form)
- [ ] EN/TH language tabs — สลับภาษาได้
- [ ] Fields:
  - Title (TH/EN)
  - Slug (auto-generate จาก title, editable)
  - Description (TH/EN) — textarea
  - Content (TH/EN) — Tiptap rich text editor
  - Category — select dropdown
  - Location (TH/EN)
  - Area (sq.m.) — number input
  - Year — text input
- [ ] Sidebar (ขวา):
  - Status toggle (Published/Draft)
  - Category selector
  - Cover image upload (Cloudinary)
  - Gallery images upload (multiple, sortable)
- [ ] SEO section:
  - SEO Title
  - Meta Description
  - Keywords (tag input — เพิ่ม/ลบ)
  - URL Slug preview
- [ ] Save Draft / Publish buttons
- [ ] Form validation (required fields: title, slug, category)
- [ ] Success/Error toast notifications
- [ ] ทดสอบ: สร้าง/แก้ไข project ครบทุก field, รูปอัปโหลดได้

### 3.3 Tiptap Rich Text Editor
- [ ] `npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder`
- [ ] สร้าง `src/components/admin/RichTextEditor.tsx`
- [ ] Toolbar: Bold, Italic, Underline | H1, H2 | List, Quote | Image, Link
- [ ] Image insertion — เปิด Media Library modal เลือกรูป
- [ ] Output format: Tiptap JSON (เก็บใน DB เป็น jsonb)
- [ ] ทดสอบ: พิมพ์ข้อความ, format, แทรกรูป, บันทึก/โหลดกลับ

### 3.4 Blog List
- [ ] สร้าง `src/app/admin/blog/page.tsx`
- [ ] สร้าง API route `src/app/api/admin/articles/route.ts` (GET, POST)
- [ ] สร้าง API route `src/app/api/admin/articles/[id]/route.ts` (GET, PUT, DELETE)
- [ ] Table: thumbnail, title, category, date, status, views, actions
- [ ] Category filter: All, Design Trends, Behind the Scenes, Tips, Studio Life
- [ ] Search, sort, pagination (เหมือน Projects List)
- [ ] ทดสอบ: CRUD ทำงานครบ

### 3.5 Blog Editor
- [ ] สร้าง `src/app/admin/blog/new/page.tsx`
- [ ] สร้าง `src/app/admin/blog/[id]/page.tsx`
- [ ] สร้าง `src/components/admin/ArticleForm.tsx`
- [ ] Fields: Title TH/EN, Slug, Excerpt TH/EN, Content TH/EN (Tiptap), Category, Cover Image
- [ ] SEO section (เหมือน Project Editor)
- [ ] Sidebar: Status, Category, Published Date, Cover Image
- [ ] ทดสอบ: สร้าง/แก้ไข article ครบ

### 3.6 Messages Inbox
- [ ] สร้าง `src/app/admin/messages/page.tsx`
- [ ] สร้าง API routes `src/app/api/admin/messages/...`
  - GET: ดึง messages (filter: all/unread/archived)
  - PUT `[id]`: mark read, archive
  - DELETE `[id]`: ลบ
- [ ] Split layout: Message list (ซ้าย) + Message detail (ขวา)
- [ ] Filter tabs: All, Unread, Archived
- [ ] Message list items: ชื่อ, preview, เวลา, unread indicator (เส้นแดง)
- [ ] Message detail: ข้อมูลครบ (email, phone, project type, message)
- [ ] Actions: Mark as Read, Archive, Delete (confirmation)
- [ ] Quick Reply — ส่ง email กลับผ่าน Resend
- [ ] Export CSV
- [ ] ทดสอบ: อ่าน/archive/ลบ/reply ทำงาน

### 3.7 Media Library
- [ ] สร้าง `src/app/admin/media/page.tsx`
- [ ] ตั้งค่า Cloudinary:
  - `npm install cloudinary`
  - เพิ่ม env: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- [ ] สร้าง API routes:
  - POST `/api/admin/media/upload` — upload ไป Cloudinary + บันทึก DB
  - GET `/api/admin/media` — ดึง media list
  - DELETE `/api/admin/media/[id]` — ลบจาก Cloudinary + DB
- [ ] Grid view: thumbnail cards พร้อมชื่อ, ขนาด, dimensions
- [ ] List view: table format
- [ ] Upload zone: drag & drop + click
- [ ] Folder filter: All, Projects, Blog, General
- [ ] Search by filename
- [ ] Select mode: เลือกหลายไฟล์ → delete batch
- [ ] Modal version: เปิดจาก editor เพื่อเลือกรูปแทรก
- [ ] ทดสอบ: upload/delete/select ทำงาน

---

## Phase 4: Admin Panel — Website Pages

### 4.1 Pages Editor — Home
- [ ] สร้าง `src/app/admin/pages/home/page.tsx`
- [ ] สร้าง API route `/api/admin/pages/home` (GET, PUT)
- [ ] Sections (ดึง/บันทึกจาก `site_settings`):
  - Hero: title TH/EN, subtitle TH/EN
  - Services: 4 items (title + description TH/EN each)
  - Statistics: 4 items (number + label TH/EN each)
  - Process: 4 steps (title + description TH/EN each)
  - CTA: heading TH/EN, description TH/EN, button text TH/EN
- [ ] EN/TH tabs
- [ ] Preview button → เปิดหน้า Home ใน tab ใหม่
- [ ] Save Changes button
- [ ] ทดสอบ: แก้ไข + บันทึก + ดูบนหน้าเว็บ

### 4.2 Pages Editor — About
- [ ] สร้าง `src/app/admin/pages/about/page.tsx`
- [ ] Sections:
  - Hero: label, heading, description TH/EN, story paragraphs TH/EN
  - Team: members list (name, nickname, role, photo — sortable, add/remove)
  - Philosophy: heading, paragraphs TH/EN
  - Services: reuse จาก Home หรือ edit แยก
- [ ] ทดสอบ: แก้ไขทีม + เนื้อหา + ดูบนหน้าเว็บ

### 4.3 Pages Editor — Contact
- [ ] สร้าง `src/app/admin/pages/contact/page.tsx`
- [ ] Fields:
  - Email, Phone, Address TH/EN, Hours TH/EN
  - Social links: Instagram handle, Facebook page
  - Google Maps embed URL / coordinates
- [ ] ทดสอบ: แก้ไข + ดูบนหน้าเว็บ

---

## Phase 5: เชื่อม Frontend กับ Database

### 5.1 Projects — Frontend
- [ ] แก้ `src/app/[locale]/projects/page.tsx` → ดึงจาก Prisma แทน data.ts
- [ ] แก้ `src/app/[locale]/projects/[id]/page.tsx` → ดึงจาก Prisma
- [ ] ใช้ ISR (Incremental Static Regeneration) หรือ dynamic rendering
- [ ] ดึง locale-specific fields (title_th/title_en ตาม locale)
- [ ] ทดสอบ: หน้า projects แสดงข้อมูลจาก DB

### 5.2 Blog — Frontend
- [ ] แก้ `src/app/[locale]/blog/page.tsx` → ดึงจาก Prisma
- [ ] แก้ `src/app/[locale]/blog/[id]/page.tsx` → ดึงจาก Prisma
- [ ] Render Tiptap JSON → HTML สำหรับแสดงบทความ
  - `npm install @tiptap/html`
- [ ] ทดสอบ: หน้า blog แสดงข้อมูลจาก DB

### 5.3 Contact Form → Database
- [ ] สร้าง API route `src/app/api/contact/route.ts`
  - POST: validate → บันทึกลง messages table → ส่ง email notification
- [ ] ตั้งค่า Resend:
  - `npm install resend`
  - เพิ่ม env: `RESEND_API_KEY`
  - สร้าง email template สำหรับ notification
- [ ] แก้ `ContactForm.tsx` → call API แทน console.log
- [ ] Success/Error feedback ใน form
- [ ] ทดสอบ: กรอก form → เห็นใน Messages inbox + ได้ email

### 5.4 Page Content → Database
- [ ] แก้ Home page → ดึง text จาก `site_settings` แทน translations (เฉพาะ dynamic content)
- [ ] แก้ About page → ดึง team members + philosophy จาก DB
- [ ] แก้ Contact page → ดึงข้อมูลติดต่อจาก DB
- [ ] Fallback: ถ้า DB ไม่ตอบ ใช้ translation files เดิม
- [ ] ทดสอบ: แก้ไขจาก admin → เห็นเปลี่ยนบนเว็บ

---

## Phase 6: Analytics + Settings

### 6.1 Google Analytics 4 Setup
- [ ] สร้าง GA4 Property ใน Google Analytics
- [ ] ติดตั้ง GA4 tag ผ่าน Google Tag Manager
- [ ] สร้าง Service Account ใน Google Cloud Console
- [ ] เปิด GA4 Data API
- [ ] เพิ่ม Service Account email เป็น Viewer ใน GA4 Admin
- [ ] เพิ่ม env: `GA4_PROPERTY_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY` (JSON)
- [ ] `npm install @google-analytics/data`
- [ ] สร้าง API routes:
  - GET `/api/admin/analytics/overview` — total views, visitors
  - GET `/api/admin/analytics/pages` — popular pages
  - GET `/api/admin/analytics/sources` — traffic sources
  - GET `/api/admin/analytics/trend` — monthly chart data

### 6.2 Supabase Page View Counter
- [ ] สร้าง middleware หรือ API route บันทึก page view ลง `page_views`
- [ ] สร้าง cron job (Supabase pg_cron) aggregate รายวัน
- [ ] แสดง view count บนหน้า project detail / blog detail
- [ ] Dashboard stat card ดึงจาก aggregated data

### 6.3 Analytics Dashboard Page
- [ ] สร้าง `src/app/admin/analytics/page.tsx`
- [ ] ติดตั้ง chart library: `npm install recharts`
- [ ] Charts: Monthly page views (bar), Traffic sources (pie), Popular pages (table)
- [ ] Date range selector
- [ ] ทดสอบ: data แสดงถูกต้อง

### 6.4 Settings Pages
- [ ] สร้าง `src/app/admin/settings/page.tsx` — General Settings
  - Company info, social links, SEO defaults, GA ID, logo/favicon upload
- [ ] สร้าง `src/app/admin/settings/team/page.tsx` — Team Management
  - List users, add/remove, change role, reset password
  - Super Admin only
- [ ] สร้าง `src/app/admin/settings/navigation/page.tsx` — Nav Editor
  - Drag-sort menu items, show/hide
- [ ] สร้าง `src/app/admin/settings/languages/page.tsx` — Translation Editor
  - List all translation keys, edit values inline
  - Search/filter by key or value

---

## Phase 7: Testing + Deploy

### 7.1 Testing
- [ ] ทดสอบ Auth flow: login, logout, protected routes, role-based access
- [ ] ทดสอบ Projects CRUD: สร้าง, แก้ไข, ลบ, draft/publish, image upload
- [ ] ทดสอบ Blog CRUD: สร้าง, แก้ไข, ลบ, rich text, image insert
- [ ] ทดสอบ Messages: รับ form, อ่าน, reply, archive, delete
- [ ] ทดสอบ Media: upload, delete, select from editor
- [ ] ทดสอบ Pages: แก้ไข content, ดูบนเว็บ
- [ ] ทดสอบ Settings: แก้ไข company info, SEO
- [ ] ทดสอบ Responsive: admin panel บน tablet (768px)
- [ ] ทดสอบ 2 ภาษา: TH/EN content แสดงถูกต้องบนเว็บ

### 7.2 Deploy to Vercel
- [ ] เพิ่ม environment variables ใน Vercel Dashboard:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - DATABASE_URL
  - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
  - RESEND_API_KEY
  - GA4_PROPERTY_ID
  - GOOGLE_SERVICE_ACCOUNT_KEY
- [ ] Push to main → auto deploy
- [ ] ทดสอบ production: login, CRUD, form submission
- [ ] ตั้งค่า custom domain (ถ้ามี)
- [ ] เปิด Email confirmation ใน Supabase Auth (production)

### 7.3 Handover
- [ ] สร้าง admin user สำหรับทีม Twodesk (4 คน)
- [ ] เขียนคู่มือใช้งานเบื้องต้น (วิธี login, เพิ่ม project, เขียน blog, ดู messages)
- [ ] ส่งมอบ credentials ให้ลูกค้า

---

## สรุปจำนวน Tasks

| Phase | จำนวน Tasks | ประมาณเวลา |
|-------|------------|-----------|
| Phase 1: Infrastructure | ~25 tasks | 1-2 วัน |
| Phase 2: Core UI | ~20 tasks | 2-3 วัน |
| Phase 3: CRUD Pages | ~45 tasks | 3-5 วัน |
| Phase 4: Website Pages | ~15 tasks | 1-2 วัน |
| Phase 5: Connect Frontend | ~15 tasks | 1-2 วัน |
| Phase 6: Analytics + Settings | ~20 tasks | 2-3 วัน |
| Phase 7: Testing + Deploy | ~15 tasks | 1-2 วัน |
| **รวม** | **~155 tasks** | **~11-19 วัน** |
