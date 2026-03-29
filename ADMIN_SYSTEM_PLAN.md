# ระบบหลังบ้าน Twodesk Studio — แผนงานทั้งหมด

## Tech Stack (แนะนำ)
| Layer | เทคโนโลยี |
|-------|-----------|
| Framework | Next.js 16 (App Router) — ใช้ร่วมกับเว็บหลัก |
| UI Components | shadcn/ui + Twodesk DS (ขาว-ดำ-เทา, Helvetica) |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| Auth | Supabase Auth (Email/Password) |
| Rich Text Editor | Tiptap (แบบ Medium — ลูกค้าใช้ง่าย) |
| Image CDN | Cloudinary |
| Email | Resend (รับ form + notification) |
| Hosting | Vercel |

---

## หน้าจอทั้งหมด — 18 หน้า

### GENERAL
| # | หน้า | Route | รายละเอียด | สถานะ |
|---|------|-------|-----------|--------|
| 1 | Dashboard | `/admin` | ภาพรวม — stats, recent activity, quick actions | ❌ ยังไม่ได้ทำ |
| 2 | Analytics | `/admin/analytics` | สถิติเว็บ — page views, popular projects, traffic sources, visitor chart | ❌ ยังไม่ได้ทำ |

### CONTENT
| # | หน้า | Route | รายละเอียด | สถานะ |
|---|------|-------|-----------|--------|
| 3 | Projects List | `/admin/projects` | ตาราง projects ทั้งหมด — filter, search, status, drag sort | ❌ ยังไม่ได้ทำ |
| 4 | Project Editor | `/admin/projects/new` `/admin/projects/[id]` | สร้าง/แก้ไข project — ชื่อ TH/EN, หมวดหมู่, ที่ตั้ง, พื้นที่ (ตร.ม.), ปี, คำอธิบาย TH/EN, รูปหลายรูป, SEO fields (title, meta, slug, keywords) | ❌ ยังไม่ได้ทำ |
| 5 | Blog List | `/admin/blog` | ตาราง articles — filter by category, status | ❌ ยังไม่ได้ทำ |
| 6 | Blog Editor | `/admin/blog/new` `/admin/blog/[id]` | สร้าง/แก้ไขบทความ — Rich Text (Tiptap), รูปปก, หมวดหมู่, เนื้อหา TH/EN, SEO | ❌ ยังไม่ได้ทำ |
| 7 | Media Library | `/admin/media` | จัดการรูปภาพ/ไฟล์ทั้งหมด — upload, ลบ, จัด folder, ดู usage, Cloudinary integration | ❌ ยังไม่ได้ทำ |

### WEBSITE PAGES (จัดการเนื้อหาแต่ละหน้าเว็บ)
| # | หน้า | Route | สิ่งที่แก้ไขได้ | สถานะ |
|---|------|-------|----------------|--------|
| 8 | Home Page | `/admin/pages/home` | Hero text TH/EN, subtitle, services (ชื่อ+คำอธิบาย 4 ตัว), statistics (ตัวเลข 4 ตัว), process steps (4 ขั้นตอน), about teaser text, CTA text | ❌ ยังไม่ได้ทำ |
| 9 | About Page | `/admin/pages/about` | Hero text TH/EN, story/philosophy TH/EN, team members (ชื่อ, role, รูป, ลำดับ), services list | ❌ ยังไม่ได้ทำ |
| 10 | Contact Page | `/admin/pages/contact` | ข้อมูลติดต่อ (email, เบอร์, ที่อยู่ TH/EN, เวลาทำการ, social links), Google Maps location | ❌ ยังไม่ได้ทำ |

### COMMUNICATION
| # | หน้า | Route | รายละเอียด | สถานะ |
|---|------|-------|-----------|--------|
| 11 | Messages (Inbox) | `/admin/messages` | ข้อความจาก Contact Form — อ่าน/ยังไม่อ่าน, ตอบกลับ, archive, export | ❌ ยังไม่ได้ทำ |
| 12 | Message Detail | `/admin/messages/[id]` | ดูรายละเอียด — ชื่อ, email, เบอร์, ประเภทโปรเจกต์, ข้อความ, วันที่ | ❌ ยังไม่ได้ทำ |

### SETTINGS
| # | หน้า | Route | รายละเอียด | สถานะ |
|---|------|-------|-----------|--------|
| 13 | General Settings | `/admin/settings` | ชื่อบริษัท, logo, favicon, brand colors, default SEO, Google Analytics ID, social links | ❌ ยังไม่ได้ทำ |
| 14 | Team Management | `/admin/settings/team` | จัดการ admin users — เพิ่ม/ลบ, กำหนด role (Super Admin / Admin), เปลี่ยนรหัสผ่าน | ❌ ยังไม่ได้ทำ |
| 15 | Navigation | `/admin/settings/navigation` | จัดการเมนู nav + footer links — เรียงลำดับ, ซ่อน/แสดง | ❌ ยังไม่ได้ทำ |
| 16 | Languages | `/admin/settings/languages` | จัดการ translation keys — ดู/แก้ไข text TH/EN ที่ใช้ทั่วเว็บ (nav, footer, CTA, labels) | ❌ ยังไม่ได้ทำ |

### AUTH
| # | หน้า | Route | รายละเอียด | สถานะ |
|---|------|-------|-----------|--------|
| 17 | Login | `/admin/login` | หน้า login | ❌ ยังไม่ได้ทำ |
| 18 | Forgot Password | `/admin/forgot-password` | reset password | ❌ ยังไม่ได้ทำ |

---

## Database Schema (Draft)

### projects
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| title_th | text | ชื่อภาษาไทย |
| title_en | text | ชื่อภาษาอังกฤษ |
| slug | varchar | URL-friendly, unique |
| category | enum | commercial, cafe, residential, others |
| location_th | text | |
| location_en | text | |
| area_sqm | integer | พื้นที่ (ตร.ม.) |
| year | varchar | |
| description_th | text | คำอธิบายภาษาไทย |
| description_en | text | คำอธิบายภาษาอังกฤษ |
| content_th | jsonb | Rich text content TH |
| content_en | jsonb | Rich text content EN |
| cover_image | text | URL |
| images | jsonb | Array of image URLs |
| seo_title | text | |
| seo_description | text | |
| seo_keywords | text[] | |
| status | enum | draft, published |
| sort_order | integer | ลำดับการแสดง |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### articles
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| title_th | text | |
| title_en | text | |
| slug | varchar | unique |
| category | varchar | Design Trends, Behind the Scenes, Tips, Studio Life |
| excerpt_th | text | |
| excerpt_en | text | |
| content_th | jsonb | Rich text (Tiptap JSON) |
| content_en | jsonb | Rich text (Tiptap JSON) |
| cover_image | text | URL |
| seo_title | text | |
| seo_description | text | |
| seo_keywords | text[] | |
| status | enum | draft, published |
| published_at | timestamptz | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### messages
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | varchar | |
| email | varchar | |
| phone | varchar | |
| project_type | varchar | commercial, cafe, residential, others |
| message | text | |
| is_read | boolean | default false |
| is_archived | boolean | default false |
| created_at | timestamptz | |

### media
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| filename | varchar | |
| url | text | Cloudinary URL |
| folder | varchar | |
| size_bytes | integer | |
| mime_type | varchar | |
| width | integer | |
| height | integer | |
| alt_text | text | |
| uploaded_by | uuid | FK → users |
| created_at | timestamptz | |

### users
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK (Supabase Auth) |
| email | varchar | |
| name | varchar | |
| nickname | varchar | |
| role | enum | super_admin, admin |
| avatar_url | text | |
| created_at | timestamptz | |

### site_settings
| Column | Type | Notes |
|--------|------|-------|
| key | varchar | PK (e.g. "company_name", "hero_title_th") |
| value | jsonb | Flexible value storage |
| updated_at | timestamptz | |

---

## User Roles
| Role | สิทธิ์ |
|------|--------|
| **Admin** (ทีม Twodesk) | จัดการ Projects, Blog, Messages, Media, Website Pages |
| **Super Admin** (Developer) | ทุกอย่างของ Admin + Team Management, General Settings, Navigation, Languages |

---

## Analytics Strategy

### แนะนำ: GA4 Data API + Supabase Counter (Hybrid) — ฟรีทั้งคู่

| วิธี | ใช้สำหรับ | ราคา | Implement |
|------|----------|------|-----------|
| **GA4 Data API** | Dashboard analytics — traffic sources, monthly trends, popular pages, demographics | ฟรี (25,000 req/วัน) | ~1 วัน |
| **Supabase Counter** | Real-time view count ต่อ project/article | ฟรี (ใช้ DB ที่มี) | ~ครึ่งวัน |

**GA4 setup:** ติดตั้ง GA4 tag → สร้าง Service Account → ใช้ `@google-analytics/data` SDK → API Route ใน Next.js
**Supabase:** เพิ่มตาราง `page_views` + `page_views_daily` → Middleware บันทึก views → แสดงบนหน้าเว็บ + CMS

### ทำไมไม่เลือกตัวอื่น
- Vercel Analytics: API ยัง beta, ฟรี tier แค่ 2,500 events
- Umami: ดีแต่เพิ่ม service ที่ต้อง maintain
- DIY อย่างเดียว: ต้องเขียน bot filtering, geo-location เอง ไม่คุ้ม

---

## Design Progress (Paper)
| หน้า | สถานะ |
|------|--------|
| Dashboard | ✅ เสร็จ |
| Projects List | ✅ เสร็จ |
| Project Editor | ✅ เสร็จ |
| Blog List | ✅ เสร็จ |
| Blog Editor | ✅ (ใช้ layout เดียวกับ Project Editor) |
| Messages | ✅ เสร็จ |
| Media Library | ✅ เสร็จ |
| Pages Editor (Home) | ✅ เสร็จ |
| Settings | ✅ เสร็จ |
| Login | ✅ เสร็จ |
