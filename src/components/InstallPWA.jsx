import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    if (isIos()) {
      setShowBanner(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!showBanner) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowBanner(false);
    } else if (isIos()) {
      setShowIosHelp(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-20 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm">
        <div className="glass border border-line rounded-card shadow-lg px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)" }}>
            <Download size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-gray-900 truncate">ติดตั้ง The PR | NU Christian Club</p>
            <p className="text-[11.5px] text-gray-500 truncate">เพิ่มไอคอนหน้าจอ เปิดเร็ว ใช้งานเต็มจอ</p>
          </div>
          <button
            onClick={handleInstallClick}
            className="text-[12.5px] font-medium text-white rounded-full px-3.5 py-1.5 shrink-0"
            style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)" }}
          >
            ติดตั้ง
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 rounded-full hover:bg-pine-50 shrink-0"
            aria-label="ปิด"
          >
            <X size={15} className="text-ink/50" />
          </button>
        </div>
      </div>

      {showIosHelp && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center"
          onClick={() => setShowIosHelp(false)}
        >
          <div
            className="bg-panel w-full sm:max-w-sm sm:rounded-card rounded-t-card p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-display text-[17px] text-pine-900 mb-3">ติดตั้งบน iPhone</p>
            <ol className="text-[13.5px] text-ink/80 space-y-2.5 mb-4">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-pine-50 text-pine-800 text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span className="flex items-center gap-1.5">
                  แตะปุ่มแชร์ <Share size={14} className="inline text-pine-600" /> ที่แถบด้านล่างของ Safari
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-pine-50 text-pine-800 text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>เลือก "เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-pine-50 text-pine-800 text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>แตะ "เพิ่ม" มุมขวาบน เป็นอันเสร็จ</span>
              </li>
            </ol>
            <button
              onClick={() => setShowIosHelp(false)}
              className="w-full btn-primary text-center"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}
    </>
  );
}
