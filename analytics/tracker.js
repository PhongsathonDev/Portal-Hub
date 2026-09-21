/**
 * Standalone Web Analytics & Intelligence Tracker (Silent Client-side Agent)
 * บันทึกสถิติเจาะลึก: Real-time Presence, อุปกรณ์, OS, เบราว์เซอร์, เวลาบนหน้า, และความลึกการเลื่อนอ่าน
 * (ทำงานเงียบๆ ในหน้าเว็บ ไม่แสดง UI และไม่เปิดเผยข้อมูลให้คนภายนอก)
 */
(function () {
  'use strict';

  // ค้นหาพารามิเตอร์ของ script tag ตัวเอง
  const currentScript = document.currentScript || (function () {
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.includes('tracker.js')) {
        return scripts[i];
      }
    }
    return scripts[scripts.length - 1];
  })();

  const customSiteId = currentScript ? currentScript.getAttribute('data-site') : null;
  const customSiteTitle = currentScript ? currentScript.getAttribute('data-title') : null;

  // Firebase Realtime Database Fallback Config (ฝังในตัว ไม่ต้องพึ่งพา config.js บน GitHub)
  const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "AIzaSyDXlcEZtNZ10qCImyGA9VseWevwXpulIaE",
    authDomain: "tct36-752e1.firebaseapp.com",
    databaseURL: "https://tct36-752e1-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tct36-752e1",
    storageBucket: "tct36-752e1.firebasestorage.app",
    messagingSenderId: "477608031840",
    appId: "1:477608031840:web:043cb5608deb1520d9b505",
    measurementId: "G-YX6TCVM5KG"
  };

  // Helper โหลด Script แบบ Promise
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.getAttribute('data-loaded') === 'true') return resolve();
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', (err) => reject(err));
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => {
        s.setAttribute('data-loaded', 'true');
        resolve();
      };
      s.onerror = (err) => reject(err);
      document.head.appendChild(s);
    });
  }

  function getSessionId() {
    let sid = sessionStorage.getItem('va_session_id');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
      sessionStorage.setItem('va_session_id', sid);
    }
    return sid;
  }

  function getVisitorId() {
    let vid = localStorage.getItem('va_visitor_id');
    if (!vid) {
      vid = 'vis_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
      localStorage.setItem('va_visitor_id', vid);
    }
    return vid;
  }

  function getDateKey(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // ==========================================
  // ตรวจจับระบบปฏิบัติการ, เบราว์เซอร์, และช่องทาง
  // ==========================================
  function detectClientTech() {
    const ua = navigator.userAgent || '';

    // Device
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    const device = isMobile ? 'mobile' : 'desktop';

    // OS
    let os = 'Unknown OS';
    if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Mac OS X/i.test(ua)) os = 'macOS';
    else if (/Linux/i.test(ua)) os = 'Linux';
    else if (/CrOS/i.test(ua)) os = 'ChromeOS';

    // Browser
    let browser = 'Unknown Browser';
    if (/Line/i.test(ua)) browser = 'Line App';
    else if (/FBAN|FBAV/i.test(ua)) browser = 'Facebook App';
    else if (/Edg/i.test(ua)) browser = 'Edge';
    else if (/Chrome/i.test(ua)) browser = 'Chrome';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Opera|OPR/i.test(ua)) browser = 'Opera';

    // Screen
    const screenRes = `${window.screen.width}x${window.screen.height}`;

    // Referrer Category
    let refCategory = 'Direct / บุ๊กมาร์กหรือพิมพ์เอง';
    const ref = document.referrer;
    if (ref) {
      try {
        const host = new URL(ref).hostname.toLowerCase();
        if (host.includes('google')) refCategory = 'Google Search';
        else if (host.includes('facebook') || host.includes('fb.me')) refCategory = 'Facebook';
        else if (host.includes('line.me') || host.includes('line-apps')) refCategory = 'Line';
        else if (host.includes('twitter') || host.includes('t.co') || host.includes('x.com')) refCategory = 'Twitter / X';
        else if (host.includes('github.io')) refCategory = 'GitHub Pages';
        else refCategory = host;
      } catch (e) {
        refCategory = ref;
      }
    }

    return { device, os, browser, screenRes, refCategory };
  }

  // ==========================================
  // ติดตามการเลื่อนอ่าน (Scroll Depth) และเวลา (Time on Page)
  // ==========================================
  let maxScrollDepth = 0;
  const startTime = Date.now();

  function trackScroll() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) {
      maxScrollDepth = 100;
      return;
    }
    const currentScroll = Math.min(100, Math.round((window.scrollY / docH) * 100));
    if (currentScroll > maxScrollDepth) {
      maxScrollDepth = currentScroll;
    }
  }

  window.addEventListener('scroll', trackScroll, { passive: true });

  // อนุญาตให้เรียกเปิด Dashboard เฉพาะตอนเทสต์ใน Local
  window.openAnalyticsDashboard = function () {
    const isLocal = window.location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isLocal) {
      window.location.href = './tracker/index.html';
    } else {
      console.info('[Analytics] การเข้าดูสถิติ (Dashboard) จำกัดให้เปิดจากไฟล์บนเครื่องของคุณเท่านั้น (Local Control Room)');
    }
  };

  // ==========================================
  // เริ่มต้น Firebase App และการบันทึกสถิติ
  // ==========================================
  function ensureFirebaseApp() {
    const cfg = (window.ANALYTICS_CONFIG && window.ANALYTICS_CONFIG.firebase) ? window.ANALYTICS_CONFIG.firebase : DEFAULT_FIREBASE_CONFIG;
    if (!window.firebase || !cfg) return null;

    let fbApp;
    const appName = 'WebAnalyticsTrackerApp';
    const existingApps = window.firebase.apps || [];
    fbApp = existingApps.find((a) => a.name === appName) || existingApps.find((a) => a.name === '[DEFAULT]');

    if (!fbApp) {
      fbApp = window.firebase.initializeApp(cfg, appName);
    }

    const db = fbApp.database();
    window.ANALYTICS_DB = db;
    return db;
  }

  async function initAnalytics() {
    try {
      const siteId = customSiteId || 'portal-hub';
      const siteTitle = customSiteTitle || document.title || 'ศูนย์รวมสรุปใบความรู้ (Study Notes Hub)';
      window.ANALYTICS_ACTIVE_SITE = siteId;

      // โหลด Firebase SDKs
      if (!window.firebase) {
        await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
      }
      if (!window.firebase?.database) {
        await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js');
      }

      const db = ensureFirebaseApp();
      if (!db) return;

      const tech = detectClientTech();

      // บันทึกข้อมูล Site
      db.ref(`analytics/sites/${siteId}`).update({
        id: siteId,
        title: siteTitle,
        lastSeen: Date.now(),
        origin: location.origin,
        path: location.pathname
      }).catch(() => {});

      // ตรวจจับ Real-time Presence
      setupPresence(db, siteId, siteTitle, tech);

      // บันทึกสถิติการเปิดหน้าเว็บ
      recordPageView(db, siteId, siteTitle, tech);

      // บันทึกพฤติกรรมการใช้งานเพื่อนำไปพัฒนาต่อ (Silent telemetry)
      setupProductTelemetry(db, siteId);

    } catch (err) {
      // Silent error handling
    }
  }

  function setupPresence(db, siteId, siteTitle, tech) {
    const sessionId = getSessionId();
    const visitorId = getVisitorId();
    const presenceRef = db.ref(`analytics/presence/${siteId}/${sessionId}`);
    const connectedRef = db.ref('.info/connected');

    connectedRef.on('value', (snap) => {
      if (snap.val() === true) {
        presenceRef.onDisconnect().remove();

        presenceRef.set({
          sessionId: sessionId,
          visitorId: visitorId,
          joinedAt: Date.now(),
          lastSeen: Date.now(),
          page: location.pathname,
          title: siteTitle,
          device: tech.device,
          os: tech.os,
          browser: tech.browser,
          screen: tech.screenRes,
          currentScroll: maxScrollDepth
        }).catch(() => {});
      }
    });

    // Heartbeat ทุก 45 วินาที พร้อมอัปเดต Scroll Depth
    const heartbeatTimer = setInterval(() => {
      trackScroll();
      presenceRef.update({
        lastSeen: Date.now(),
        currentScroll: maxScrollDepth
      }).catch(() => {});
    }, 45000);

    window.addEventListener('beforeunload', () => {
      clearInterval(heartbeatTimer);
      presenceRef.remove().catch(() => {});
    });
  }

  function recordPageView(db, siteId, siteTitle, tech) {
    const today = getDateKey();
    const hour = String(new Date().getHours()).padStart(2, '0');

    const dailyVisitorKey = `va_seen_${siteId}_${today}`;
    const isNewToday = !localStorage.getItem(dailyVisitorKey);
    if (isNewToday) {
      localStorage.setItem(dailyVisitorKey, '1');
    }

    const dayStatsRef = db.ref(`analytics/stats/${siteId}/${today}`);
    // ยอดวิวรวมและรายชั่วโมง
    dayStatsRef.child('views').transaction((c) => (c || 0) + 1).catch(() => {});
    dayStatsRef.child(`hourly/${hour}`).transaction((c) => (c || 0) + 1).catch(() => {});
    
    // ข้อมูลเชิงลึก: อุปกรณ์, OS, เบราว์เซอร์, แหล่งที่มา, ขนาดจอ
    dayStatsRef.child(`devices/${tech.device}`).transaction((c) => (c || 0) + 1).catch(() => {});
    dayStatsRef.child(`os/${tech.os}`).transaction((c) => (c || 0) + 1).catch(() => {});
    dayStatsRef.child(`browsers/${tech.browser}`).transaction((c) => (c || 0) + 1).catch(() => {});
    dayStatsRef.child(`screens/${tech.screenRes}`).transaction((c) => (c || 0) + 1).catch(() => {});
    
    const safeRefKey = tech.refCategory.replace(/[\.\#\$\[\]\/]/g, '_');
    dayStatsRef.child(`referrers/${safeRefKey}`).transaction((c) => (c || 0) + 1).catch(() => {});

    // นับ Unique คนไม่ซ้ำของวันนี้
    if (isNewToday) {
      dayStatsRef.child('uniques').transaction((c) => (c || 0) + 1).catch(() => {});
    }

    // สถิติสะสมตลอดกาล
    const totalRef = db.ref(`analytics/totals/${siteId}`);
    totalRef.child('views').transaction((c) => (c || 0) + 1).catch(() => {});
    if (isNewToday) {
      totalRef.child('uniques').transaction((c) => (c || 0) + 1).catch(() => {});
    }

    // บันทึกกิจกรรมการเข้าชมล่าสุด (Recent Detailed Activity Log)
    const logRef = db.ref(`analytics/recent_logs/${siteId}`).push();
    logRef.set({
      timestamp: Date.now(),
      page: location.pathname,
      title: siteTitle,
      referrer: tech.refCategory,
      device: tech.device,
      os: tech.os,
      browser: tech.browser,
      screen: tech.screenRes,
      duration: 1,
      scrollDepth: maxScrollDepth,
      sessionId: getSessionId()
    }).catch(() => {});

    // เมื่อผู้ใช้ออกจากหน้าเว็บ ให้อัปเดต Duration และ Scroll Depth สุดท้าย
    window.addEventListener('beforeunload', () => {
      const durationSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      trackScroll();
      logRef.update({
        duration: durationSeconds,
        scrollDepth: maxScrollDepth
      }).catch(() => {});
    });
  }

  // บันทึกพฤติกรรมการใช้งานเพื่อนำไปพัฒนาต่อ (Silent Product Improvement Telemetry)
  function setupProductTelemetry(db, siteId) {
    // 1. ตรวจจับการคลิกเปิดอ่านสรุปแต่ละบท (เพื่อดูว่าบทไหนเป็นที่นิยมและควรพัฒนาต่อ)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const card = link.closest('.note-card') || link.closest('[data-id]');
      const titleEl = card ? card.querySelector('.note-title, h3, h2') : null;
      const noteTitle = titleEl ? titleEl.textContent.trim() : (link.textContent.trim() || link.href);

      if (card || link.href.includes('github.io') || link.href.startsWith('http')) {
        db.ref(`analytics/events/${siteId}`).push({
          timestamp: Date.now(),
          type: 'click_sheet',
          target: noteTitle,
          url: link.href,
          page: location.pathname,
          sessionId: getSessionId()
        }).catch(() => {});
      }
    }, { capture: true, passive: true });

    // 2. ตรวจจับคำค้นหา (เพื่อทราบว่าผู้เรียนกำลังต้องการสรุปเรื่องใดเพิ่มเติม)
    let searchDebounce = null;
    const searchInput = document.getElementById('searchInput') || document.querySelector('input[type="search"]');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = (e.target.value || '').trim();
        if (query.length < 2) return;

        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
          db.ref(`analytics/searches/${siteId}`).push({
            timestamp: Date.now(),
            query: query,
            page: location.pathname,
            sessionId: getSessionId()
          }).catch(() => {});
        }, 2000);
      }, { passive: true });
    }
  }

  // เริ่มต้นทำงาน
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
  } else {
    initAnalytics();
  }
})();
