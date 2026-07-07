# คู่มือแก้ไขเนื้อหาเว็บไซต์ (สำหรับแอดมิน)

> **อัปเดต:** ตอนนี้มีหน้าแอดมินให้แก้ไขข้อมูลผ่านเว็บโดยตรงที่ `/admin` แล้ว ไม่ต้องแก้โค้ดไฟล์นี้อีกต่อไป
> ดูวิธีตั้งค่าครั้งแรกได้ที่ `SETUP_GUIDE.md`
>
> คู่มือด้านล่างนี้ยังมีประโยชน์สำหรับ**อ้างอิงโครงสร้างข้อมูล** และสำหรับกรณีที่ยังไม่ได้ตั้งค่าระบบแอดมิน (เว็บจะใช้ค่าจากไฟล์นี้เป็นค่าเริ่มต้น/ค่าสำรอง)

เนื้อหาเกือบทั้งหมดของเว็บถูกรวมไว้ที่ไฟล์เดียว:

```
src/data/content.js
```

**แก้ไฟล์นี้ไฟล์เดียว ไม่ต้องแตะโค้ดหน้าตาเว็บ** ยกเว้นบางเรื่องที่ระบุไว้ท้ายคู่มือ (สี/ฟอนต์/ลิงก์ปุ่ม Join Club)

---

## 1. กิจกรรมของชมรม (Activities)

ตัวแปร: `activities`

```js
{
  emoji: "🎵",
  title: "Worship Night",
  desc: "คำอธิบายสั้น ๆ ของกิจกรรม",
}
```

- เพิ่ม/ลบ/แก้ได้อิสระ ระบบจะจัดเรียงเป็นการ์ด 3 คอลัมน์อัตโนมัติ
- `emoji` ใส่เป็นอิโมจิเดียวก็พอ ไม่ต้องใช้รูปภาพ

**ไฟล์ที่แสดงผล:** `src/components/landing/Activities.jsx` (ไม่ต้องแก้)

---

## 2. อีเวนต์ที่กำลังจะมาถึง (Upcoming Events)

ตัวแปร: `upcomingEvents`

```js
{ day: "20", month: "JUL", title: "Welcome Freshmen", location: "ลานกิจกรรม คณะ..." }
```

- แสดงผลตามลำดับที่ใส่ในลิสต์ (ยังไม่มีการเรียงตามวันที่อัตโนมัติ) เรียงเองตามลำดับเวลาที่ต้องการ
- ปุ่ม "View All Activities" ด้านล่างยังไม่ได้ผูกลิงก์ ถ้าต้องการให้กดแล้วไปหน้าอื่น ต้องแจ้งเพิ่มเพื่อผูก URL

---

## 3. Connect With Us (โซเชียลมีเดีย 4 การ์ด)

ตัวแปร: `socials`

```js
{
  icon: "instagram",   // instagram | music2 (TikTok) | facebook | x
  name: "Instagram",
  tagline: "Photos · Stories · Reels",
  cta: "Follow",
  href: "#",            // ← ใส่ลิงก์จริงตรงนี้
  gradient: "...",      // สีพื้นหลังไอคอน ไม่ต้องแก้ก็ได้
}
```

- **สิ่งที่ต้องทำ:** แก้ `href: "#"` เป็นลิงก์เพจ/โปรไฟล์จริงของแต่ละแพลตฟอร์ม

---

## 4. แกลเลอรี (Gallery)

ตัวแปร: `galleryCategories`

```js
{ key: "camp", title: "Camp", image: "/gallery/camp.jpg" }
```

ตอนนี้ยังเป็น "การ์ดสีไล่เฉด + ไอคอนกล้อง" (placeholder) เพราะยังไม่มีรูปจริง วิธีใส่รูปจริง:

1. เตรียมรูป ตั้งชื่อไฟล์ตามที่ระบุใน `image` เช่น `camp.jpg`, `christmas.jpg`
2. นำไฟล์ไปวางไว้ในโฟลเดอร์ `public/gallery/` (สร้างโฟลเดอร์นี้เอง ถ้ายังไม่มี)
3. เปิดไฟล์ `src/components/landing/Gallery.jsx` แล้วแก้ในส่วนของ `Tile` component:

   จากเดิม (placeholder ไอคอนกล้อง):
   ```jsx
   <div className="absolute inset-0 flex items-center justify-center opacity-25 ...">
     <Camera size={40} className="text-white" strokeWidth={1.2} />
   </div>
   ```
   เป็นรูปจริง:
   ```jsx
   <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
   ```

> ทำแบบเดียวกันได้กับทุกหมวด เพิ่ม/ลบหมวดได้จากลิสต์ `galleryCategories` เลย

---

## 5. ทีมงาน (Team)

ตัวแปร: `team`

```js
{ role: "President", name: "ชื่อ นามสกุล", photo: "/team/president.jpg", ig: "#", fb: "#" }
```

- แก้ `name` เป็นชื่อจริงของแต่ละตำแหน่งได้เลย
- แก้ `ig` / `fb` เป็นลิงก์โซเชียลส่วนตัว (ใช้ตอน hover ที่รูป)
- ใส่รูปจริง: วางไฟล์ใน `public/team/` ตามชื่อใน `photo` แล้วไปแก้ `src/components/landing/Team.jsx` จาก avatar ตัวอักษรย่อ

  จากเดิม:
  ```jsx
  <div className="w-full h-full rounded-full flex items-center justify-center ...">
    {initials}
  </div>
  ```
  เป็นรูปจริง:
  ```jsx
  <img src={person.photo} alt={person.name} className="w-full h-full rounded-full object-cover" />
  ```

---

## 6. เสียงจากสมาชิก (Testimonials)

ตัวแปร: `testimonials`

```js
{ quote: "ข้อความรีวิว", name: "ชื่อ/นามแฝง", faculty: "คณะ" }
```

เพิ่ม/ลบ/แก้ข้อความได้อิสระ

---

## 7. คำถามที่พบบ่อย (FAQ)

ตัวแปร: `faqs`

```js
{ q: "คำถาม", a: "คำตอบ" }
```

เพิ่มคำถามใหม่ได้ตามต้องการ ระบบจะแสดงเป็น accordion กดขยาย/ยุบอัตโนมัติ

---

## 8. ลิงก์ปุ่ม "Join Club" (ปุ่มลอยมุมจอ + ปุ่มใน Footer)

ตัวแปร: `lineOAUrl` (บรรทัดสุดท้ายของไฟล์)

```js
export const lineOAUrl = "#";
```

แก้ `"#"` เป็นลิงก์ LINE OA หรือฟอร์มสมัครสมาชิกจริง จะมีผลกับ:
- ปุ่มลอยมุมขวาล่าง (`FloatingCTA.jsx`)
- ปุ่ม "Join Club" ใน Navbar และ Footer **ต้องแก้แยกต่างหาก** เพราะปัจจุบัน 2 จุดนี้ยังเป็น `href="#"` ตรง ๆ ในไฟล์ `Navbar.jsx` (ปุ่มจะ scroll ไปหา Footer) และ `Footer.jsx`

---

## เรื่องอื่นที่ไม่ได้อยู่ใน content.js (แก้เฉพาะกรณีจำเป็น)

| ต้องการแก้ | ไปที่ไฟล์ |
|---|---|
| อีเมล/ที่อยู่ใน Footer | `src/components/landing/Footer.jsx` |
| สีธีมเว็บทั้งหมด | `src/index.css` (ตัวแปร `--primary` `--secondary` `--accent`) และ `tailwind.config.js` |
| ฟอนต์ | `src/index.css` บรรทัด `@import` ด้านบนสุด + `tailwind.config.js` (`fontFamily`) |
| ข้อความ Hero (พาดหัว/3 บรรทัดเป้าหมาย) | `src/components/landing/Hero.jsx` |
| ข้อความ About | `src/components/landing/About.jsx` |

---

## รันดูผลก่อนเผยแพร่จริง

```bash
npm install
npm run dev
```

แล้วเปิด `http://localhost:5173` เพื่อดูผลลัพธ์ ก่อน build จริงด้วย `npm run build`
