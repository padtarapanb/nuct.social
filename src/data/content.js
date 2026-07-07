// Central place to edit the landing page's text content.
// Replace the placeholder image paths (e.g. "/gallery/camp.jpg") with real
// photos by dropping files into /public with matching names.

export const activities = [
  {
    emoji: "🎵",
    title: "Worship Night",
    desc: "ค่ำคืนแห่งเสียงเพลงและการนมัสการร่วมกัน เปิดพื้นที่ให้ใจได้พักและเชื่อมสัมพันธ์กับพระเจ้า",
  },
  {
    emoji: "🏕",
    title: "Camp",
    desc: "ทริปค่ายประจำปีที่ทุกคนได้ผูกมิตร เรียนรู้ และเติบโตไปด้วยกันนอกรั้วมหาวิทยาลัย",
  },
  {
    emoji: "☕",
    title: "Cell Group",
    desc: "กลุ่มเล็กพูดคุยแบ่งปันชีวิตประจำสัปดาห์ พื้นที่ปลอดภัยสำหรับทุกคำถามและทุกช่วงชีวิต",
  },
  {
    emoji: "🎄",
    title: "Christmas",
    desc: "งานเฉลิมฉลองส่งท้ายปีที่เปิดต้อนรับทุกคน ไม่ว่าจะเป็นคริสเตียนหรือไม่ก็ตาม",
  },
  {
    emoji: "❤️",
    title: "Outreach",
    desc: "กิจกรรมออกไปแบ่งปันความรักและความช่วยเหลือสู่ชุมชนรอบมหาวิทยาลัย",
  },
  {
    emoji: "📖",
    title: "Bible Study",
    desc: "ศึกษาพระคัมภีร์ร่วมกันแบบสบาย ๆ เปิดกว้างสำหรับทุกคำถามและทุกระดับความเข้าใจ",
  },
];

export const upcomingEvents = [
  { day: "20", month: "JUL", title: "Welcome Freshmen", location: "ลานกิจกรรม คณะ..." },
  { day: "28", month: "JUL", title: "Prayer Night", location: "ห้องนมัสการ" },
  { day: "30", month: "JUL", title: "Camp", location: "ค่ายนอกสถานที่" },
];

export const socials = [
  {
    icon: "instagram",
    name: "Instagram",
    tagline: "Photos · Stories · Reels",
    cta: "Follow",
    href: "#",
    gradient: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF,#515BD4)",
  },
  {
    icon: "music2",
    name: "TikTok",
    tagline: "Funny · Worship · Camp",
    cta: "Watch",
    href: "#",
    gradient: "linear-gradient(135deg,#25F4EE,#111111,#FE2C55)",
  },
  {
    icon: "facebook",
    name: "Facebook",
    tagline: "Announcements · Events",
    cta: "Visit",
    href: "#",
    gradient: "linear-gradient(135deg,#1877F2,#3B5998)",
  },
  {
    icon: "x",
    name: "X",
    tagline: "Updates · Quotes",
    cta: "Follow",
    href: "#",
    gradient: "linear-gradient(135deg,#111111,#3A3A3A)",
  },
];

export const galleryCategories = [
  { key: "camp", title: "Camp", image: "/gallery/camp.jpg" },
  { key: "christmas", title: "Christmas", image: "/gallery/christmas.jpg" },
  { key: "sports", title: "Sports", image: "/gallery/sports.jpg" },
  { key: "cell", title: "Cell", image: "/gallery/cell.jpg" },
  { key: "baptism", title: "Baptism", image: "/gallery/baptism.jpg" },
  { key: "welcome", title: "Welcome Freshmen", image: "/gallery/welcome.jpg" },
];

export const team = [
  { role: "President", name: "ชื่อ นามสกุล", photo: "/team/president.jpg", ig: "#", fb: "#" },
  { role: "Vice President", name: "ชื่อ นามสกุล", photo: "/team/vp.jpg", ig: "#", fb: "#" },
  { role: "PR Team", name: "ชื่อ นามสกุล", photo: "/team/pr.jpg", ig: "#", fb: "#" },
  { role: "Media Team", name: "ชื่อ นามสกุล", photo: "/team/media.jpg", ig: "#", fb: "#" },
  { role: "Worship Team", name: "ชื่อ นามสกุล", photo: "/team/worship.jpg", ig: "#", fb: "#" },
];

export const testimonials = [
  {
    quote: "เข้าชมรมนี้แล้วรู้สึกเหมือนมีบ้านหลังที่สองในมหาวิทยาลัย มีคนคอยถามไถ่และรับฟังจริง ๆ",
    name: "รุ่นพี่ปี 3",
    faculty: "คณะวิทยาศาสตร์",
  },
  {
    quote: "ตอนแรกแค่ตามเพื่อนมา แต่กลายเป็นที่ที่ทำให้เห็นความเชื่อของตัวเองชัดขึ้นทุกสัปดาห์",
    name: "สมาชิกปี 2",
    faculty: "คณะบริหารธุรกิจฯ",
  },
  {
    quote: "บรรยากาศอบอุ่น ไม่กดดัน เปิดให้ถามได้ทุกอย่างแม้จะไม่ใช่คริสเตียน",
    name: "สมาชิกปี 1",
    faculty: "คณะมนุษยศาสตร์",
  },
];

export const faqs = [
  {
    q: "ไม่ใช่คริสเตียนเข้าร่วมได้ไหม?",
    a: "ได้แน่นอนครับ/ค่ะ ทุกกิจกรรมเปิดต้อนรับทุกคนโดยไม่มีเงื่อนไขเรื่องความเชื่อ มาลองสัมผัสบรรยากาศดูก่อนได้เลย",
  },
  {
    q: "ต้องเสียค่าใช้จ่ายในการเข้าร่วมไหม?",
    a: "กิจกรรมประจำสัปดาห์ส่วนใหญ่ไม่มีค่าใช้จ่าย ส่วนกิจกรรมพิเศษอย่างค่ายจะแจ้งค่าใช้จ่ายล่วงหน้าเสมอ",
  },
  {
    q: "ต้องเข้าร่วมทุกกิจกรรมหรือเปล่า?",
    a: "ไม่จำเป็นครับ/ค่ะ เลือกเข้าร่วมกิจกรรมที่สนใจหรือสะดวกได้ตามต้องการ",
  },
  {
    q: "จะติดตามข่าวสารกิจกรรมได้ทางไหน?",
    a: "ติดตามผ่านโซเชียลมีเดียของชมรมได้ทุกช่องทางในหัวข้อ Connect With Us ด้านบน หรือกดปุ่ม Join Club เพื่อรับข่าวสารทาง LINE",
  },
];

export const lineOAUrl = "#";
