/**
 * ==============================================================================
 * ไฟล์ข้อมูลสรุปใบความรู้ (Study Notes & Knowledge Sheets Database)
 * ==============================================================================
 * ฐานข้อมูลรวมลิงก์สรุปบทเรียน สื่อการสอนแบบมีปฏิสัมพันธ์ และคลังข้อสอบ
 * ==============================================================================
 */

const categoriesData = [
  { id: 'all', name: 'ทั้งหมด', icon: 'fa-layer-group', count: 0 },
  { id: 'computer', name: 'โครงสร้างระบบคอมพิวเตอร์ (CS 3106)', icon: 'fa-microchip', count: 0 },
  { id: 'language', name: 'ภาษาเพื่อการสื่อสารสำหรับครู (020033401)', icon: 'fa-chalkboard-user', count: 0 }
];

const knowledgeSheetsData = [
  {
    id: "cs3106-ch1-system-organization",
    title: "บทที่ 1: โครงสร้างระบบคอมพิวเตอร์",
    category: "computer",
    categoryName: "CS 3106 โครงสร้างระบบคอมพิวเตอร์",
    year: 1,
    semester: 1,
    description: "สัญญาณนาฬิกา, วงรอบ Instruction Cycle, System Bus, DMA, ลำดับชั้นหน่วยความจำ และ Cache Mapping",
    url: "https://phongsathondev.github.io/Chapter1-Computer-System-Organization/",
    tags: ["CS3106", "Instruction Cycle", "System Bus", "DMA", "Cache"],
    icon: "fa-server",
    themeColor: "blue",
    updatedAt: "2026-08-26",
    isFeatured: true,
    sheetCount: "12 โมดูล (30 หน้า)"
  },
  {
    id: "cs3106-ch2-data-number-systems",
    title: "บทที่ 2: ข้อมูลและระบบตัวเลข",
    category: "computer",
    categoryName: "CS 3106 โครงสร้างระบบคอมพิวเตอร์",
    year: 1,
    semester: 1,
    description: "สัญญาณดิจิทัล 0/1, การแปลงเลขฐาน 2/8/10/16, การคำนวณ 1's และ 2's Complement และรหัส ASCII",
    url: "https://phongsathondev.github.io/Chapter2-Data-and-Number-Systems/",
    tags: ["CS3106", "เลขฐาน", "2's Complement", "ASCII", "Data Flow"],
    icon: "fa-calculator",
    themeColor: "purple",
    updatedAt: "2026-08-26",
    isFeatured: true,
    sheetCount: "8 โมดูล (52 หน้า)"
  },
  {
    id: "cs3106-ch3-cpu-instruction-set",
    title: "บทที่ 3: ชุดคำสั่งและการทำงานของ CPU",
    category: "computer",
    categoryName: "CS 3106 โครงสร้างระบบคอมพิวเตอร์",
    year: 1,
    semester: 1,
    description: "OpCode & Operand, วงรอบคำสั่ง 8 สถานะ, ISA Design, Procedure Call และ 7 Addressing Modes",
    url: "https://phongsathondev.github.io/Chapter3-Cpu-Instruction-Set/",
    tags: ["CS3106", "ชุดคำสั่ง CPU", "Addressing Modes", "8-State Cycle"],
    icon: "fa-gears",
    themeColor: "emerald",
    updatedAt: "2026-08-26",
    isFeatured: true,
    sheetCount: "12 โมดูล (40 หน้า)"
  },
  {
    id: "cs3106-ch4-microprocessor-process",
    title: "บทที่ 4: ไมโครโปรเซสเซอร์และการประมวลผล",
    category: "computer",
    categoryName: "CS 3106 โครงสร้างระบบคอมพิวเตอร์",
    year: 1,
    semester: 1,
    description: "สถาปัตยกรรม CISC vs RISC, โครงสร้าง CU/ALU, Registers, Flags และวงรอบ Interrupt Cycle",
    url: "https://phongsathondev.github.io/Chapter4-Microprocessor-and-Process/",
    tags: ["CS3106", "Microprocessor", "CISC vs RISC", "Registers", "Interrupt"],
    icon: "fa-microchip",
    themeColor: "amber",
    updatedAt: "2026-08-26",
    isFeatured: true,
    sheetCount: "12 โมดูล (32 หน้า)"
  },
  {
    id: "cs3106-ch4-1-microprocessor-enhanced",
    title: "บทที่ 4.1: ไมโครโปรเซสเซอร์ (ฉบับขยายความ)",
    category: "computer",
    categoryName: "CS 3106 โครงสร้างระบบคอมพิวเตอร์",
    year: 1,
    semester: 1,
    description: "เจาะลึก Flags Register, Memory Segmentation, Stack LIFO และ Interactive Simulators",
    url: "https://phongsathondev.github.io/Chapter4.1-Microprocessor-and-Process/",
    tags: ["CS3106", "Microprocessor", "Segmentation", "CPU Simulator"],
    icon: "fa-bolt",
    themeColor: "cyan",
    updatedAt: "2026-08-26",
    isFeatured: false,
    sheetCount: "35 หน้า (คลังข้อสอบ)"
  },
  {
    id: "edu-020033401-language-for-teachers",
    title: "ภาษาเพื่อการสื่อสารสำหรับครู",
    category: "language",
    categoryName: "020033401 ภาษาเพื่อการสื่อสารสำหรับครู",
    year: 1,
    semester: 1,
    description: "วัจนภาษา/อวัจนภาษา, ทักษะ ฟัง พูด อ่าน เขียน, การอ่านจับใจความ และการเขียนสรุปความ",
    url: "https://phongsathondev.github.io/Language-for-Communication-for-Teachers/",
    tags: ["020033401", "ภาษาเพื่อการสื่อสาร", "วิชาชีพครู", "จับใจความ"],
    icon: "fa-chalkboard-user",
    themeColor: "rose",
    updatedAt: "2026-08-26",
    isFeatured: true,
    sheetCount: "8 หน่วยการเรียนรู้"
  }
];
