# 📚 StudyNotes.Hub - เว็บศูนย์รวมสรุปใบความรู้

เว็บไซต์ศูนย์กลาง (Portal Hub) สำหรับรวบรวมลิงก์ชีทสรุปใบความรู้แต่ละวิชาที่สร้างและโฮสต์ไว้บน GitHub Pages ให้อยู่ในที่เดียว เปิดดูง่าย ค้นหาสะดวก ดีไซน์สวยงามและทันสมัย

---

## ✨ ฟีเจอร์เด่น (Features)

- 🔍 **Live Search**: ค้นหาทันทีจากชื่อวิชา, บทเรียน, เนื้อหาย่อ, หรือคำสำคัญ
- 🎓 **ตัวกรองชั้นปีบน Navbar & ตัวเลือกเทอม**: เลือกดูชั้นปีได้สะดวกรวดเร็วบนแถบนำทาง และเลือกสลับดูเทอม 1 หรือเทอม 2 ได้โดยตรง
- 🏷️ **หมวดหมู่ & ป้ายกำกับ (Category Tabs & Tags)**: แยกหมวดหมู่รายวิชาชัดเจน และคลิกแท็กเพื่อกรองได้ทันที
- 🌓 **Dark / Light Mode**: สลับโหมดมืด-สว่างได้ตามใจชอบ พร้อมจดจำธีมที่เลือกไว้
- ⭐ **รายการโปรด (Bookmarks)**: บันทึกวิชาที่เปิดอ่านบ่อยลงใน LocalStorage
- 🔲 **สลับมุมมอง (Grid / List View)**: เลือกดูแบบการ์ดสวยงาม หรือแบบรายการกะทัดรัด
- 📋 **คัดลอกลิงก์ (Copy Link)**: มีปุ่มคัดลอก URL ของแต่ละวิชาพร้อมแชร์ต่อได้ทันที
- 📱 **Fully Responsive**: รองรับทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์

---

## 📑 รายการชีทสรุปในระบบ (Available Knowledge Sheets)

| รายวิชา / บทเรียน | สรุปเนื้อหาเด่น | ลิงก์เข้าชม (Live Demo) |
|---|---|---|
| **CS 3106 บทที่ 1: โครงสร้างระบบคอมพิวเตอร์** | สัญญาณนาฬิกา, Instruction Cycle, System Bus, DMA, Cache Mapping | [เข้าสู่บทเรียน](https://phongsathondev.github.io/Chapter1-Computer-System-Organization/) |
| **CS 3106 บทที่ 2: ข้อมูลและระบบตัวเลข** | สัญญาณดิจิทัล 0/1, แปลงเลขฐาน, 1's & 2's Complement, รหัส ASCII | [เข้าสู่บทเรียน](https://phongsathondev.github.io/Chapter2-Data-and-Number-Systems/) |
| **CS 3106 บทที่ 3: ชุดคำสั่งและการทำงานของ CPU** | OpCode/Operand, วงรอบ 8 สถานะ, ISA Design, 7 Addressing Modes | [เข้าสู่บทเรียน](https://phongsathondev.github.io/Chapter3-Cpu-Instruction-Set/) |
| **CS 3106 บทที่ 4: ไมโครโปรเซสเซอร์และการประมวลผล** | CISC vs RISC, โครงสร้าง CU/ALU, Registers & Flags, Interrupt, CPU Simulators | [เข้าสู่บทเรียน](https://phongsathondev.github.io/Chapter4-Microprocessor-and-Process/) |
| **CS 3106 บทที่ 5: ไมโครโปรเซสเซอร์และการเชื่อมต่อระบบบัส** | System Bus (Address/Data/Control), I/O Port Addressing, Interrupt Controller, DMA | [เข้าสู่บทเรียน](https://phongsathondev.github.io/Chapter5-Microprocessor-and-Bus-System/) |
| **CS 3106 บทที่ 6: หน่วยคำนวณทางคณิตศาสตร์และตรรกะ (ALU)** | วงจรบวก Adder, Booth's Multiplier, Restoring Division, มาตรฐาน IEEE 754 | [เข้าสู่บทเรียน](https://phongsathondev.github.io/Chapter6-Arithmetic-and-Logic-Unit/) |
| **CS 3106 บทที่ 7: หน่วยความจำ (Memory Unit)** | ลำดับขั้นหน่วยความจำ, SRAM/DRAM, Server DIMMs, แคช Mapping, Virtual Memory, Paging | [เข้าสู่บทเรียน](https://phongsathondev.github.io/Chapter7-Memory-Unit/) |
| **020033401 ภาษาเพื่อการสื่อสารสำหรับครู** | วัจน/อวัจนภาษา, ทักษะ ฟัง พูด อ่าน เขียน, การจับใจความ และการเขียนสรุปความ | [เข้าสู่บทเรียน](https://phongsathondev.github.io/Language-for-Communication-for-Teachers/) |

---

## 🚀 วิธีเพิ่มหรือแก้ไขเว็บไซต์สรุปของคุณ

เพียงเปิดไฟล์ [`data/notes.js`](data/notes.js) แล้วเพิ่มหรือแก้ไขข้อมูลใน Array `knowledgeSheetsData` ตามโครงสร้างนี้:

```javascript
{
  id: "cs3106-ch1-system-organization",             // รหัสเฉพาะ (ห้ามเว้นวรรค)
  title: "CS 3106 | บทที่ 1: โครงสร้างระบบคอมพิวเตอร์", // ชื่อบทเรียน/วิชา
  category: "computer",                             // หมวดหมู่วิชา: computer | language | etc.
  categoryName: "โครงสร้างระบบคอมพิวเตอร์ (CS 3106)",   // ชื่อหมวดหมู่ภาษาไทย
  year: 3,                                          // ชั้นปี: 1, 2, หรือ 3
  semester: 1,                                      // ภาคเรียน: 1 หรือ 2
  description: "สรุปเนื้อหาสำคัญและโมดูลการเรียนรู้...",  // คำอธิบายย่อ
  url: "https://phongsathondev.github.io/Chapter1-Computer-System-Organization/", // ลิงก์เว็บสรุปบน GitHub Pages
  tags: ["CS3106", "Instruction Cycle", "KMUTNB"],  // แท็กที่เกี่ยวข้อง
  icon: "fa-server",                                // ไอคอน FontAwesome
  themeColor: "blue",                               // โทนสี: blue | purple | emerald | amber | rose | cyan
  updatedAt: "2026-08-26",                          // วันที่อัปเดต (YYYY-MM-DD)
  isFeatured: true,                                 // แนะนำเป็นพิเศษ (true / false)
  sheetCount: "30 หน้า (12 โมดูล)"                   // จำนวนหน้า/ความยาว
}
```

---

## 🌐 วิธีนำขึ้นโฮสต์บน GitHub Pages

1. นำโฟลเดอร์นี้อัปโหลดขึ้น GitHub Repository ใหม่ของคุณ
2. ไปที่แท็บ **Settings** > **Pages**
3. ที่หัวข้อ **Build and deployment** > เลือก **Branch: `main`** และโฟลเดอร์ **`/ (root)`**
4. กด **Save** รอประมาณ 1-2 นาที คุณจะได้ URL เว็บไซต์รวมสรุปของคุณพร้อมใช้งานทันที!
