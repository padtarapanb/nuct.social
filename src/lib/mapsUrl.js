// แปลงลิงก์ Google Maps ที่แอดมินวางไว้ (ไม่ว่าจะเป็นลิงก์แชร์ปกติ, ลิงก์ค้นหา,
// หรือลิงก์แบบฝัง) ให้กลายเป็นลิงก์แบบฝัง (embed) ที่ใช้กับ <iframe src="..."> ได้จริง
// เดิมโค้ดรับเฉพาะลิงก์ที่ขึ้นต้นด้วย /maps/embed หรือ /maps?output=embed เป๊ะ ๆ เท่านั้น
// ทำให้ถ้าแอดมินกด "แชร์" จาก Google Maps ธรรมดา (เช่น .../maps/place/ชื่อสถานที่/@lat,lng,17z
// หรือ .../maps?q=...) แผนที่จะไม่ขึ้นเลยแบบเงียบ ๆ โดยไม่มีคำเตือนใด ๆ — ฟังก์ชันนี้พยายาม
// แปลงลิงก์รูปแบบทั่วไปเหล่านั้นให้กลายเป็นแบบฝังให้อัตโนมัติ

function buildEmbedFromQuery(query) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function toEmbeddableMapsUrl(input) {
  if (!input) return null;
  const trimmed = String(input).trim();
  if (!trimmed) return null;

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    // ไม่ใช่ URL แต่อาจเป็นชื่อสถานที่/ที่อยู่ล้วน ๆ ที่พิมพ์มาตรง ๆ ก็ยังฝังแผนที่ให้ได้
    return buildEmbedFromQuery(trimmed);
  }

  if (url.protocol !== "https:") return null;

  const host = url.hostname.replace(/^www\./, "");
  if (host !== "google.com" && host !== "google.co.th" && host !== "maps.google.com") {
    // โฮสต์อื่น (เช่น maps.app.goo.gl ลิงก์ย่อ) เปิดใน iframe ไม่ได้จริง เพราะ Google Maps
    // หน้าเต็มปิดกั้นการฝัง (X-Frame-Options) ไว้ ต้องให้แอดมินเปิดลิงก์แล้วกด "ฝังแผนที่" เอง
    return null;
  }

  // เป็นลิงก์แบบฝังอยู่แล้ว
  if (url.pathname.startsWith("/maps/embed")) return url.toString();
  if (url.pathname === "/maps" && url.searchParams.get("output") === "embed") return url.toString();

  // มีพารามิเตอร์ q= (ลิงก์ค้นหา) ใช้ตรง ๆ ได้เลย
  const q = url.searchParams.get("q");
  if (q) return buildEmbedFromQuery(q);

  // ลิงก์แชร์สถานที่ทั่วไป เช่น /maps/place/ชื่อสถานที่/@13.75,100.5,17z
  const placeMatch = url.pathname.match(/\/maps\/place\/([^/]+)/);
  const coordMatch = url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

  if (placeMatch) {
    const place = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    return buildEmbedFromQuery(place);
  }
  if (coordMatch) {
    return buildEmbedFromQuery(`${coordMatch[1]},${coordMatch[2]}`);
  }

  return null;
}
