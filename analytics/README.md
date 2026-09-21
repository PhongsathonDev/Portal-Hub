# 📊 Web Analytics & Presence Tracking System (Local Machine Control Room)

ระบบติดตามสถิติผู้เข้าชมเว็บไซต์แบบแยกส่วนความเป็นส่วนตัวสูง:
- **ส่งสถิติจากหน้าเว็บจริง (Silent Tracker):** ทำงานเงียบๆ บันทึกยอดวิวและคนออนไลน์ส่งขึ้น Firebase Realtime Database
- **ดูผลสถิติเฉพาะในเครื่องเรา (Local Dashboard):** หน้า Dashboard และรหัส PIN จะอยู่ในเครื่องเราเท่านั้น ไม่ต้องอัปโหลดขึ้น GitHub ทำให้บุคคลภายนอกไม่สามารถเปิดดูสถิติของคุณได้

---

## 💡 สถิติยังคงดูประวัติได้อยู่ไหมถ้าเปิดดูแค่จากเครื่องเรา?

**ดูได้แน่นอน 100%!** 
เพราะข้อมูลสถิติทั้งหมดถูกส่งไปเก็บบน **Firebase Realtime Database (Cloud)** ดังนั้น:
1. เมื่อมีผู้เข้าชมเปิดเว็บของคุณบน GitHub Pages ตัวสคริปต์ `tracker.js` จะส่งยอดวิว, คนออนไลน์สด, และประวัติรายชั่วโมงขึ้นไปยัง Firebase Cloud
2. เมื่อคุณเปิดไฟล์ `tracker/index.html` บนเครื่องคอมพิวเตอร์ของคุณ ตัว Dashboard จะดึงข้อมูลประวัติย้อนหลังและสถิติสดๆ จาก Firebase Cloud มาแสดงผลให้คุณดูได้ครบถ้วนสมบูรณ์

---

## 🖥️ วิธีเปิดดูสถิติ (เปิดดูจากเครื่องเรา)

เพียงเปิดไฟล์ **`tracker/index.html`** ด้วยเบราว์เซอร์ของคุณ:
1. ดับเบิลคลิกไฟล์ `tracker/index.html` ในโฟลเดอร์โปรเจกต์
2. หรือคลิกขวาเลือก **Open with Chrome / Edge** (หรือใช้ Live Server)
3. ป้อนรหัส PIN ปลดล็อก: **`1234`** (ระบบจะจำสถานะไว้ให้ ไม่ต้องพิมพ์ซ้ำทุกครั้ง)
4. เลือกดูสถิติของเว็บที่ต้องการผ่าน Dropdown มุมขวาบน (เช่น `portal-hub`, `chapter6-alu`)

---

## 🔒 การป้องกันไม่ให้ Dashboard ขึ้น GitHub

ไฟล์ `.gitignore` ได้รับการตั้งค่าไว้เรียบร้อยแล้ว:
```gitignore
tracker/
analytics/dashboard.html
analytics/dashboard.js
analytics/dashboard.css
analytics/config.js
Firebase SDK
```
ดังนั้นเมื่อคุณสั่ง `git push` จะมีเพียงไฟล์ `analytics/tracker.js` และโค้ดเว็บหลักเท่านั้นที่ขึ้น GitHub ปลอดภัยจากสายตาคนภายนอกแน่นอน!

---

## 🚀 วิธีนำ Tracker ไปแปะในเว็บอื่นๆ

เพียงใส่แท็ก `<script>` นี้ไว้ก่อนปิด `</body>` ในหน้าเว็บที่คุณต้องการเก็บสถิติ:

```html
<script src="https://phongsathondev.github.io/Portal-Hub/analytics/tracker.js" data-site="รหัสเว็บของคุณ" data-title="ชื่อเว็บของคุณ"></script>
```
*ระบบจะเริ่มส่งสถิติขึ้น Firebase และคุณจะสามารถเปิดดูสถิติของเว็บนั้นผ่านหน้า `tracker/index.html` บนเครื่องคุณได้ทันที!*
