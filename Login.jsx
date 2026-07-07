import { Component } from "react";

// กันไม่ให้ error ของ component ใดชิ้นหนึ่งทำหน้าเว็บทั้งหน้าค้าง/ขาว (white screen)
// ถ้า section ไหน error จะซ่อนแค่ section นั้น ส่วนที่เหลือของหน้ายังใช้งานได้ปกติ
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Section error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return null; // ซ่อน section ที่พังไปเงียบๆ ไม่ให้กระทบส่วนอื่น
    }
    return this.props.children;
  }
}
