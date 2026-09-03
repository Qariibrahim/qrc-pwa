/* ========================================================= 
   CODE NO. PWA-TRACK-4001 — PART 1
   IMDADE ROHANI PWA + D1 INSTALL TRACKING WORKER
   ========================================================= */

const SITE_ORIGIN = "https://qrc.imdaderohani.in";

const LOGO_URL =
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhswMSCDL7cBASmV4gtFdF0w9bsk4vP5VtIRxJZYdqwzKCbCP35-cy9oYYCBTjhdhVQjQwS7P-Vdf5Z8PZLIaj-LtPsx6TvGOxdOTmMM-Y_oHvpEWd4JuVdCw9wyn2w-6p0Vdt4QLQXF80Qz-pWfpdX6DaIjlIXgiODrDffCsPdS6-AOIRCmkR0oZXGAuD9/s500/38030.png";

const DEFAULT_APP_VERSION = "2";

const LIVE_CHAT_ADMIN_UID = "7ybBWGwZipX3sM9iLrdGIgOo3l92";
const FIREBASE_WEB_API_KEY = "AIzaSyC6bhgW8pXu_LFlJ9SvTrveXj-nKLsdQws";
const LIVE_CHAT_ADMIN_ORIGIN = "https://live-chat-admin.imdaderohani.in";

/* =========================================================
   CLEAN CUSTOM BLOGGER URLS
   Left side  = URL visible in the browser
   Right side = original Blogger page
   Add future pages to this same list.
   ========================================================= */

const CLEAN_BLOGGER_ROUTES = {
  "/home": "/",
  "/form-kaarguzari": "/p/blog-page_22.html",
  "/quran-shreef": "/p/quran-shreef.html",
  "/naqsh-download": "/p/blog-page_13.html",
  "/form-2": "/p/page-one.html",
  "/janch-rupay": "/p/blog-page_8.html",
  "/ittilaat": "/p/blog-page_1.html",
  "/name-janch": "/p/blog-page_51.html",
  "/qawaneen": "/p/blog-page_52.html",
  "/contact": "/p/blog-page_14.html",
  "/tashkheese-dawa": "/p/fawaidtashkheesedawa.html"
};

const OLD_BLOGGER_ROUTES = Object.fromEntries(
  Object.entries(CLEAN_BLOGGER_ROUTES).map(
    ([cleanPath, bloggerPath]) => [bloggerPath, cleanPath]
  )
);

/* =========================================================
   MAIN WORKER
   ========================================================= */

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;

      /* Dedicated Admin domain ka root kabhi main blog na khole. */
      if (
        url.hostname === "live-chat-admin.imdaderohani.in" &&
        path === "/"
      ) {
        return Response.redirect(
          LIVE_CHAT_ADMIN_ORIGIN +
            "/p/live-chat-admin-panel.html?source=admin-pwa",
          302
        );
      }

        /* ==========================================
           PROFESSIONAL CUSTOM 404 PAGE ROUTE
           ========================================== */

        if (path === "/404" || path === "/404/") {
          return new Response(custom404Html(), {
            status: 404,
            headers: {
              "Content-Type": "text/html; charset=UTF-8",
              "Cache-Control": "no-store, no-cache, must-revalidate",
              "X-Content-Type-Options": "nosniff"
            }
          });
        }
       
      /* CORS Preflight */
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders()
        });
      }

      /* =============================================
         PWA TRACKING API
         ============================================= */

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 3B ROUTE
   FCM TOKEN REGISTER API
   ========================================================= */

if (path === "/api/push/register") {
  return handlePushRegister(request, env);
}

/* Android Admin PWA: private token registration + new-chat push */
if (path === "/api/live-chat/admin-push/register") {
  return handleLiveChatAdminPushRegister(request, env);
}

if (path === "/api/live-chat/admin-push/notify") {
  return handleLiveChatAdminPushNotify(request, env);
}

/* Visitor device registration + Admin se usi visitor ko private push */
if (path === "/api/live-chat/visitor-push/register") {
  return handleLiveChatVisitorPushRegister(request, env);
}

if (path === "/api/live-chat/visitor-push/notify") {
  return handleLiveChatVisitorPushNotify(request, env);
}

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 4 TEST SEND ROUTE
   ========================================================= */

if (path === "/api/push/test-send") {
  return handlePushTestSend(request, env);
}

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 4 ROUTE END
   ========================================================= */

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 5 BROADCAST ROUTE
   ========================================================= */

if (path === "/api/push/broadcast") {
  return handlePushBroadcast(request, env);
}

/* Public seven-day Notification Box feed */
if (path === "/api/notifications/inbox") {
  return handleNotificationInbox(request, env);
}

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 5 ROUTE END
   ========================================================= */

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 6 ADMIN PAGE ROUTE
   ========================================================= */

if (path === "/api/push/admin") {
  return handlePushAdminPage(request, env);
}

/* =========================================================
   PUSH NOTIFICATION MULTI LINK CHOICE PAGE
   ========================================================= */

/* =========================================================
   UNIQUE NOTIFICATION OPTION PAGE
   /option-phone-channel
   /option-phone-channel-1
   ========================================================= */

if (path.startsWith("/option-")) {
  return handleNotificationOptionPage(
    request,
    env
  );
}
       
if (path === "/notification-links") {
  return handleNotificationLinksPage(
    request
  );
}
/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 6 ROUTE END
   ========================================================= */
       
/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 3B ROUTE END
   ========================================================= */
       
      if (path === "/api/pwa/install") {
        return handleInstall(request, env);
      }

      if (path === "/api/pwa/activity") {
        return handleActivity(request, env);
      }

      if (path === "/api/pwa/status") {
        return handleStatus(request, env);
      }

      /* PWA VERSION CHECK API */
      if (path === "/api/pwa/version") {
        return handleVersionCheck(request, env);
      }

      if (path === "/api/pwa/health") {
        return jsonResponse({
          success: true,
          service: "Imdade Rohani PWA Tracker",
          database_binding: env.DB ? "connected" : "missing",
          time: new Date().toISOString()
        });
      }

      /* EmailJS direct testing endpoint */
      if (path === "/api/pwa/email-test") {
        return handleEmailTest(request, env);
      }

      /* SECURE MANUAL INACTIVE CHECK API */
      if (path === "/api/pwa/inactive-check") {
        return handleManualInactiveCheck(request, env);
      }

/* SECURE GLOBAL UPDATE ADMIN */
if (path === "/api/pwa/global-update") {
  return handleGlobalUpdateAdmin(request, env);
}

/* =============================================
   DIRECT PWA INSTALL PAGE
   ============================================= */

if (path === "/install") {
  return new Response(installPageHtml(), {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

/* =============================================
   LIVE CHAT ADMIN — SEPARATE PWA
   This is intentionally separate from the main
   Imdade Rohani manifest and does not alter it.
   ============================================= */

if (
  path === "/install-live-chat-admin" ||
  path === "/p/live-chat-admin-install.html"
) {
  return new Response(liveChatAdminInstallPageHtml(), {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

if (
  path === "/live-chat-admin-manifest.webmanifest" ||
  path === "/live-chat-admin-v2.webmanifest"
) {
  const adminManifest = {
    id: "/p/live-chat-admin-app",
    name: "Imdade Rohani Live Chat Admin",
    short_name: "Live Chat Admin",
    description: "Imdade Rohani Live Chat ka mehfooz admin panel.",
    start_url: "/p/live-chat-admin-panel.html?source=admin-pwa",
    scope: "/p/",
    lang: "hi",
    dir: "ltr",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#eef5ff",
    theme_color: "#1746a2",
    icons: [
      { src: "/pwa-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/pwa-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };

  return new Response(JSON.stringify(adminManifest, null, 2), {
    headers: {
      "Content-Type": "application/manifest+json; charset=UTF-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
       
      /* =============================================
         PWA MANIFEST
         ============================================= */

      if (
        path === "/manifest.webmanifest" ||
        path === "/manifest.json"
      ) {
        const manifest = {
          id: "/",
          name: "Imdade Rohani",
          short_name: "Imdade Rohani",

          description:
            "Imdade Rohani ki roohani janch, maloomat aur online services.",

          start_url: "/?source=pwa",
          scope: "/",

          lang: "ur",
          dir: "rtl",

          display: "standalone",
          orientation: "portrait-primary",

          background_color: "#f3f8ff",
          theme_color: "#002087",

          icons: [
            {
              src: "/pwa-icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/pwa-icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable"
            },
            {
              src: "/pwa-icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/pwa-icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            }
          ]
        };

        return new Response(
          JSON.stringify(manifest, null, 2),
          {
            headers: {
              "Content-Type":
                "application/manifest+json; charset=UTF-8",

              "Cache-Control":
                "public, max-age=3600",

              "Access-Control-Allow-Origin": "*",

              "X-Content-Type-Options": "nosniff"
            }
          }
        );
      }

      /* =============================================
         SERVICE WORKER
         ============================================= */

      if (path === "/service-worker.js") {
        return new Response(serviceWorkerCode(), {
          headers: {
            "Content-Type":
              "application/javascript; charset=UTF-8",

            "Service-Worker-Allowed": "/",

            "Cache-Control":
              "no-cache, no-store, must-revalidate",

            "X-Content-Type-Options": "nosniff"
          }
        });
      }

      /* PWA UPDATE CLIENT SCRIPT ROUTE */
      if (path === "/pwa-update-client.js") {
        return new Response(
          pwaUpdateClientCode(),
          {
            headers: {
              "Content-Type":
                "application/javascript; charset=UTF-8",

              "Cache-Control":
                "no-store, no-cache, must-revalidate",

              "Access-Control-Allow-Origin":
                "*",

              "X-Content-Type-Options":
                "nosniff"
            }
          }
        );
      }

      /* =============================================
         OFFLINE PAGE
         ============================================= */

      if (path === "/offline.html") {
        return new Response(offlineHtml(), {
          headers: {
            "Content-Type":
              "text/html; charset=UTF-8",

            "Cache-Control":
              "public, max-age=3600",

            "X-Content-Type-Options": "nosniff"
          }
        });
      }

      /* =============================================
         PWA ICONS
         ============================================= */

/* =============================================
   NOTIFICATION BELL ICON
   ============================================= */

if (path === "/notification-bell.svg") {

  const bellSvg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="192"
     height="192"
     viewBox="0 0 192 192">

  <circle
    cx="96"
    cy="96"
    r="88"
    fill="#002087"
  />

  <path
    fill="#ffffff"
    d="M96 32c-25 0-45 20-45 45v26l-13 20c-4 7 1 15 9 15h98c8 0 13-8 9-15l-13-20V77c0-25-20-45-45-45zm0 128c12 0 22-8 25-19H71c3 11 13 19 25 19z"
  />

</svg>`;

  return new Response(
    bellSvg,
    {
      status: 200,
      headers: {
        "Content-Type":
          "image/svg+xml; charset=UTF-8",

        "Cache-Control":
          "public, max-age=86400"
      }
    }
  );
}

/* =============================================
   NOTIFICATION BELL PNG ICON
   ============================================= */

if (path === "/notification-bell.png") {

  const bellPngBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAABaUlEQVR42u3dWw7CMAwFUeL977ksAAlBH0lsn/lEQjh3aietELxeAAAAALoxshZ+HMfxsZgx0q0nqoT/7XUCJoSfVUJUCj+jhKgWfjYJKfeAShDgGPr8KNn5eDqqhp5FxugS/K4iomP4O52SomP4O0kYHYPfaSSF8NfWE8JfW1cIf2197oQ7nYKyPCCbWWcIf229Ify1ddsDqu8BWa/+WfXrgE6nIEwWkH38zFiHDjCCCDB+Fq5HBxhBBIAAAkAAASCAABBAAAggAAQQAAIIAAEEgAACQAABIIAAEEAACKjD5d9HqPYl3FMhXvidiVj54d3DN4Kq7AFdu+COdcdOxXQL3wiqdgzt0gV3rjN2Lq56+EZQ1Tvhql3wxLoiU7HVwjeCqo6gal3w5DpSBHTlgd/uF0FUDv+O97cXYA8AAQSgr4CrpxinIOQXcPYqznAjmKYD/g0zy114qhH0a6iZHoH4P2EAAACgH29qh6B7Yic17QAAAABJRU5ErkJggg==";

  const binary =
    atob(bellPngBase64);

  const bytes =
    new Uint8Array(binary.length);

  for (
    let i = 0;
    i < binary.length;
    i++
  ) {
    bytes[i] =
      binary.charCodeAt(i);
  }

  return new Response(
    bytes,
    {
      status: 200,
      headers: {
        "Content-Type":
          "image/png",

        "Cache-Control":
          "public, max-age=86400",

        "X-Content-Type-Options":
          "nosniff"
      }
    }
  );
}
       
      if (path === "/pwa-icon-192.png") {
                return fetch(LOGO_URL, {
          cf: {
            cacheEverything: true,
            cacheTtl: 86400
          }
        });
      }

      if (path === "/pwa-icon-512.png") {
        return fetch(LOGO_URL, {
          cf: {
            cacheEverything: true,
            cacheTtl: 86400
          }
        });
      }

      /* =============================================
         BLOGGER PAGE PROXY
         ============================================= */

      const cleanRouteResponse =
        handleCleanBloggerRoute(request);

      if (cleanRouteResponse) {
        return cleanRouteResponse;
      }

      return proxyBlogger(request);

    } catch (error) {
      return jsonResponse(
        {
          success: false,
          error: "Worker request failed.",
          message:
            error && error.message
              ? error.message
              : String(error)
        },
        500
      );
    }
  },

  /* =============================================
     DAILY SCHEDULED CHECK
     ============================================= */

  async scheduled(controller, env, ctx) {
    if (
      controller &&
      controller.cron === "* * * * *"
    ) {
      ctx.waitUntil(
        runDueScheduledPushes(env)
      );
      return;
    }

    ctx.waitUntil(
      Promise.all([
        runDueScheduledPushes(env),
        runDailyInactiveCheck(env)
      ])
    );
  }
};


/* =========================================================
   COMMON RESPONSE FUNCTIONS
   ========================================================= */

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods":
      "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  };
}


function jsonResponse(data, status = 200) {
  return new Response(
    JSON.stringify(data, null, 2),
    {
      status: status,
      headers: {
        "Content-Type":
          "application/json; charset=UTF-8",

        "Cache-Control":
          "no-store, no-cache, must-revalidate",

        ...corsHeaders()
      }
    }
  );
}


function methodNotAllowed(allowedMethod) {
  return jsonResponse(
    {
      success: false,
      error: "Method not allowed.",
      allowed_method: allowedMethod
    },
    405
  );
}


function databaseMissingResponse() {
  return jsonResponse(
    {
      success: false,
      error: "D1 database binding DB is missing."
    },
    500
  );
}


/* =========================================================
   SAFE TEXT HELPERS
   ========================================================= */

function cleanText(value, fallback = "") {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return String(value).trim();
}


function cleanDeviceId(value) {
  const id = cleanText(value);

  if (!id) {
    return "";
  }

  return id
    .replace(/[^a-zA-Z0-9_\-:.]/g, "")
    .slice(0, 180);
}


function normalizeVersion(value) {
  const version = cleanText(
    value,
    DEFAULT_APP_VERSION
  );

  return version.slice(0, 40);
}


function safeInteger(value, fallback = 0) {
  const number = Number.parseInt(
    value,
    10
  );

  return Number.isFinite(number)
    ? number
    : fallback;
}


/* =========================================================
   REQUEST BODY HELPER
   ========================================================= */

async function readJsonBody(request) {
  try {
    const contentType =
      request.headers.get("content-type") || "";

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      return await request.json();
    }

    const text = await request.text();

    if (!text) {
      return {};
    }

    return JSON.parse(text);

  } catch (error) {
    return {};
  }
}


/* =========================================================
   DEVICE INFORMATION
   ========================================================= */

function getDeviceInfo(request, body = {}) {
  const userAgent =
    request.headers.get("user-agent") || "";

  const platform =
    cleanText(body.platform) ||
    detectPlatform(userAgent);

  const browser =
    cleanText(body.browser) ||
    detectBrowser(userAgent);

  return {
    platform: platform,
    browser: browser
  };
}


function detectPlatform(userAgent) {
  const ua =
    String(userAgent).toLowerCase();

  if (ua.includes("android")) {
    return "Android";
  }

  if (
    ua.includes("iphone") ||
    ua.includes("ipad") ||
    ua.includes("ipod")
  ) {
    return "iOS";
  }

  if (ua.includes("windows")) {
    return "Windows";
  }

  if (ua.includes("mac os")) {
    return "macOS";
  }

  if (ua.includes("linux")) {
    return "Linux";
  }

  return "Unknown";
}


function detectBrowser(userAgent) {
  const ua =
    String(userAgent).toLowerCase();

  if (ua.includes("edg/")) {
    return "Microsoft Edge";
  }

  if (
    ua.includes("opr/") ||
    ua.includes("opera")
  ) {
    return "Opera";
  }

  if (
    ua.includes("chrome/") &&
    !ua.includes("edg/")
  ) {
    return "Google Chrome";
  }

  if (
    ua.includes("safari/") &&
    !ua.includes("chrome/")
  ) {
    return "Safari";
  }

  if (ua.includes("firefox/")) {
    return "Firefox";
  }

  return "Unknown";
}


/* =========================================================
   CURRENT PWA SETTINGS
   ========================================================= */

async function getPwaSettings(env) {
  if (!env.DB) {
    throw new Error(
      "D1 database binding DB is missing."
    );
  }

  const row = await env.DB
    .prepare(
      `
      SELECT
        latest_version,
        force_update,
        inactive_days
      FROM pwa_settings
      WHERE id = 1
      `
    )
    .first();

  if (!row) {
    return {
      latest_version:
        DEFAULT_APP_VERSION,

      force_update: 0,

      inactive_days: 15
    };
  }

  return {
    latest_version:
      normalizeVersion(
        row.latest_version
      ),

    force_update:
      safeInteger(
        row.force_update,
        0
      ),

    inactive_days:
      Math.max(
        1,
        safeInteger(
          row.inactive_days,
          15
        )
      )
  };
}


/* =========================================================
   PWA COUNTS
   ========================================================= */

async function getPwaCounts(env) {
  if (!env.DB) {
    throw new Error(
      "D1 database binding DB is missing."
    );
  }

  const settings =
    await getPwaSettings(env);

  const totalRow =
    await env.DB
      .prepare(
        `
        SELECT COUNT(*) AS total
        FROM pwa_users
        `
      )
      .first();

  const activeRow =
    await env.DB
      .prepare(
        `
        SELECT COUNT(*) AS total
        FROM pwa_users
        WHERE status = 'active'
        `
      )
      .first();

  const inactiveRow =
    await env.DB
      .prepare(
        `
        SELECT COUNT(*) AS total
        FROM pwa_users
        WHERE status = 'inactive'
        `
      )
      .first();

  return {
    total_installations:
      safeInteger(
        totalRow && totalRow.total,
        0
      ),

    active_users:
      safeInteger(
        activeRow && activeRow.total,
        0
      ),

    inactive_users:
      safeInteger(
        inactiveRow && inactiveRow.total,
        0
      ),

    latest_version:
      settings.latest_version,

    force_update:
      settings.force_update,

    inactive_days:
      settings.inactive_days
  };
}


/* =========================================================
   CODE NO. PWA-TRACK-4001 — PART 2 END
   ========================================================= */

/* =========================================================
   CODE NO. PWA-TRACK-4003 — EMAILJS NOTIFICATION
   ========================================================= */

async function sendInstallEmail(
  env,
  installation,
  counts
) {
  if (
    !env.EMAILJS_SERVICE_ID ||
    !env.EMAILJS_TEMPLATE_ID ||
    !env.EMAILJS_PUBLIC_KEY ||
    !env.EMAILJS_PRIVATE_KEY
  ) {
    return {
      success: false,
      skipped: true,
      reason:
        "EmailJS secrets are missing."
    };
  }

  const eventType =
    cleanText(
      installation.event_type,
      "New PWA Installation"
    );

  const isInactiveReport =
  eventType ===
    "Manual Inactive Users Check" ||
  eventType ===
    "Daily Inactive Users Report" ||
  eventType ===
    "Fortnightly PWA Summary";

  const emailHeading =
    isInactiveReport
      ? "PWA Inactive Users Report"
      : eventType === "PWA App Updated"
        ? "Imdade Rohani App Updated"
        : eventType === "PWA Reinstallation"
          ? "PWA Reinstallation"
          : "Nayi PWA Installation";

  const emailIntro =
    isInactiveReport
      ? "Imdade Rohani App ki inactive users report tayyar hui hai."
      : eventType === "PWA App Updated"
        ? "Imdade Rohani App successfully update hui hai."
        : eventType === "PWA Reinstallation"
          ? "Imdade Rohani App dobara install hui hai."
          : "Imdade Rohani App ki nayi installation hui hai.";

  const dateTime =
    new Date().toLocaleString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );

  const emailPayload = {
    service_id:
      env.EMAILJS_SERVICE_ID,

    template_id:
      env.EMAILJS_TEMPLATE_ID,

    user_id:
      env.EMAILJS_PUBLIC_KEY,

    accessToken:
      env.EMAILJS_PRIVATE_KEY,

    template_params: {
      event_type:
        eventType,

      email_heading:
        emailHeading,

      email_intro:
        emailIntro,

      app_name:
        "Imdade Rohani App",

      total_installations:
        String(
          counts.total_installations || 0
        ),

      active_users:
        String(
          counts.active_users || 0
        ),

      inactive_users:
        String(
          counts.inactive_users || 0
        ),

      inactive_users_list:
        cleanText(
          installation.inactive_users_list,
          "Koi inactive user mojood nahi hai."
        ),

      device_id:
        cleanText(
          installation.device_id,
          "unknown"
        ),

      app_version:
        cleanText(
          installation.app_version,
          DEFAULT_APP_VERSION
        ),

      platform:
        cleanText(
          installation.platform,
          "unknown"
        ),

      browser:
        cleanText(
          installation.browser,
          "unknown"
        ),

      date_time:
        dateTime,

      message: [
        emailIntro,
        "",
        "Kul installations: " +
          String(
            counts.total_installations || 0
          ),

        "Active users: " +
          String(
            counts.active_users || 0
          ),

        "Inactive users: " +
          String(
            counts.inactive_users || 0
          ),

        "",
        "Device ID: " +
          cleanText(
            installation.device_id,
            "unknown"
          ),

        "App version: " +
          cleanText(
            installation.app_version,
            DEFAULT_APP_VERSION
          ),

        "Platform: " +
          cleanText(
            installation.platform,
            "unknown"
          ),

        "Browser: " +
          cleanText(
            installation.browser,
            "unknown"
          ),

        "Date/Time: " +
          dateTime
      ].join("\n")
    }
  };

  try {
    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(
            emailPayload
          )
      }
    );

    const responseText =
      await response.text();

    if (!response.ok) {
      return {
        success: false,
        skipped: false,
        status:
          response.status,
        error:
          responseText ||
          "EmailJS request failed."
      };
    }

    return {
      success: true,
      skipped: false,
      status:
        response.status,
      response:
        responseText || "OK"
    };

  } catch (error) {
    return {
      success: false,
      skipped: false,
      error:
        error && error.message
          ? error.message
          : String(error)
    };
  }
}


/* =========================================================
   EMAILJS DIRECT UPDATE TEST
   GET /api/pwa/email-test
   ========================================================= */

async function handleEmailTest(
  request,
  env
) {
  if (request.method !== "GET") {
    return methodNotAllowed("GET");
  }

  if (!env.DB) {
    return databaseMissingResponse();
  }

  const counts =
    await getPwaCounts(env);

  const emailResult =
    await sendInstallEmail(
      env,
      {
        device_id:
          "manual_update_test_001",

        app_version:
          "6",

        platform:
          "Android PWA",

        browser:
          "Google Chrome",

        event_type:
          "PWA App Updated"
      },
      counts
    );

  return jsonResponse({
    success:
      Boolean(emailResult.success),

    test:
      "PWA App Updated",

    email_notification:
      emailResult,

    checked_at:
      new Date().toISOString()
  });
}

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 3B
   SAVE FCM TOKEN IN D1
   ========================================================= */

function bearerToken(request) {
  const value = request.headers.get("Authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : "";
}

async function verifyLiveChatFirebaseUser(request) {
  const idToken = bearerToken(request);
  if (!idToken || idToken.length < 100) return null;

  const response = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" +
      encodeURIComponent(FIREBASE_WEB_API_KEY),
    {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({idToken})
    }
  );

  if (!response.ok) return null;
  const data = await response.json();
  const user = data && Array.isArray(data.users) ? data.users[0] : null;
  return user && user.localId ? String(user.localId) : null;
}

async function ensureLiveChatAdminPushTables(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS live_chat_admin_push_tokens (
      token TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS live_chat_push_events (
      event_id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS live_chat_visitor_push_tokens (
      token TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_live_chat_visitor_tokens_chat
    ON live_chat_visitor_push_tokens (chat_id, status, updated_at)
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS live_chat_visitor_push_events (
      event_id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `).run();
}

async function handleLiveChatAdminPushRegister(request, env) {
  if (request.method !== "POST") return methodNotAllowed("POST");
  if (!env.DB) return databaseMissingResponse();

  const uid = await verifyLiveChatFirebaseUser(request);
  if (uid !== LIVE_CHAT_ADMIN_UID) {
    return jsonResponse({success:false,error:"Admin authorization required."}, 401);
  }

  const body = await readJsonBody(request);
  const token = cleanText(body.token);
  if (!token || token.length < 50 || token.length > 4096) {
    return jsonResponse({success:false,error:"Valid admin FCM token required."}, 400);
  }

  await ensureLiveChatAdminPushTables(env);
  const now = new Date().toISOString();
  await env.DB.prepare(`
    INSERT INTO live_chat_admin_push_tokens
      (token, status, created_at, updated_at)
    VALUES (?, 'active', ?, ?)
    ON CONFLICT(token) DO UPDATE SET
      status='active', updated_at=excluded.updated_at
  `).bind(token, now, now).run();

  return jsonResponse({success:true,event:"live_chat_admin_push_registered"});
}

async function sendLiveChatAdminPush(env, token, details) {
  const accessToken = await getFirebaseAccessToken(env);
  const typeLabels = {
    text: "naya message",
    image: "nayi image",
    video: "nayi video",
    audio: "naya audio",
    pdf: "nayi PDF",
    document: "nayi file"
  };
  const name = String(details.name || "User").slice(0, 45);
  const kind = typeLabels[details.content_type] || typeLabels.text;
  const title = "Live Chat: " + name;
  const body = name + " ne " + kind + " bheja hai.";
  const target = LIVE_CHAT_ADMIN_ORIGIN +
    "/p/live-chat-admin-panel.html?source=admin-pwa";
  const payload = {
    message: {
      token: String(token),
      data: {
        title,
        body,
        tag: "live-chat-" + String(details.event_id),
        url: target,
        chat_id: String(details.chat_id),
        event_id: String(details.event_id),
        notification_type: "live_chat_admin"
      },
      webpush: {
        headers: {Urgency:"high", TTL:"86400"},
        fcm_options: {link:target}
      }
    }
  };

  return fetch(
    "https://fcm.googleapis.com/v1/projects/" +
      encodeURIComponent(String(env.FIREBASE_PROJECT_ID)) +
      "/messages:send",
    {
      method:"POST",
      headers:{Authorization:"Bearer " + accessToken,"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    }
  );
}

async function handleLiveChatAdminPushNotify(request, env) {
  if (request.method !== "POST") return methodNotAllowed("POST");
  if (!env.DB) return databaseMissingResponse();

  const uid = await verifyLiveChatFirebaseUser(request);
  const body = await readJsonBody(request);
  const chatId = cleanText(body.chat_id);
  const eventId = cleanText(body.event_id);
  const contentType = cleanText(body.content_type).toLowerCase();
  const name = cleanText(body.name);

  if (!uid || uid !== chatId) {
    return jsonResponse({success:false,error:"Chat authorization failed."}, 401);
  }
  if (!/^[A-Za-z0-9_-]{8,160}$/.test(eventId)) {
    return jsonResponse({success:false,error:"Valid event id required."}, 400);
  }

  await ensureLiveChatAdminPushTables(env);
  const now = new Date().toISOString();
  const insert = await env.DB.prepare(`
    INSERT OR IGNORE INTO live_chat_push_events
      (event_id, chat_id, created_at)
    VALUES (?, ?, ?)
  `).bind(eventId, chatId, now).run();

  if (!insert.meta || Number(insert.meta.changes || 0) === 0) {
    return jsonResponse({success:true,event:"duplicate_ignored"});
  }

  const tokenRows = await env.DB.prepare(`
    SELECT token FROM live_chat_admin_push_tokens
    WHERE status='active' ORDER BY updated_at DESC LIMIT 5
  `).all();
  const tokens = tokenRows && tokenRows.results ? tokenRows.results : [];
  if (!tokens.length) {
    return jsonResponse({success:true,event:"no_admin_device_registered"});
  }

  const details = {
    chat_id:chatId,
    event_id:eventId,
    content_type:/^(text|image|video|audio|pdf|document)$/.test(contentType) ? contentType : "text",
    name:name || "User"
  };
  const results = await Promise.allSettled(tokens.map(function(row) {
    return sendLiveChatAdminPush(env, row.token, details);
  }));
  const sent = results.filter(function(result) {
    return result.status === "fulfilled" && result.value && result.value.ok;
  }).length;

  /* Deduplication rows ko chhota rakhein. */
  await env.DB.prepare(`
    DELETE FROM live_chat_push_events
    WHERE created_at < datetime('now','-7 days')
  `).run().catch(function(){});

  return jsonResponse({success:true,event:"live_chat_admin_push_sent",sent});
}

async function handleLiveChatVisitorPushRegister(request, env) {
  if (request.method !== "POST") return methodNotAllowed("POST");
  if (!env.DB) return databaseMissingResponse();

  const uid = await verifyLiveChatFirebaseUser(request);
  const body = await readJsonBody(request);
  const chatId = cleanText(body.chat_id);
  const token = cleanText(body.token);
  if (!uid || uid !== chatId) {
    return jsonResponse({success:false,error:"Chat authorization failed."}, 401);
  }
  if (!token || token.length < 50 || token.length > 4096) {
    return jsonResponse({success:false,error:"Valid visitor FCM token required."}, 400);
  }

  await ensureLiveChatAdminPushTables(env);
  const now = new Date().toISOString();
  await env.DB.prepare(`
    INSERT INTO live_chat_visitor_push_tokens
      (token, chat_id, status, created_at, updated_at)
    VALUES (?, ?, 'active', ?, ?)
    ON CONFLICT(token) DO UPDATE SET
      chat_id=excluded.chat_id, status='active', updated_at=excluded.updated_at
  `).bind(token, chatId, now, now).run();

  return jsonResponse({success:true,event:"live_chat_visitor_push_registered"});
}

async function sendLiveChatVisitorPush(env, token, details) {
  const accessToken = await getFirebaseAccessToken(env);
  const typeLabels = {text:"naya jawab",image:"nayi image",video:"nayi video",audio:"naya audio",pdf:"nayi PDF",document:"nayi file"};
  const kind = typeLabels[details.content_type] || typeLabels.text;
  const preview = String(details.preview || "").replace(/\s+/g," ").trim().slice(0,90);
  const title = "Imdade Rohani Live Chat";
  const body = preview || ("Admin ne " + kind + " bheja hai.");
  const target = SITE_ORIGIN + "/?openLiveChat=1";
  return fetch(
    "https://fcm.googleapis.com/v1/projects/" + encodeURIComponent(String(env.FIREBASE_PROJECT_ID)) + "/messages:send",
    {
      method:"POST",
      headers:{Authorization:"Bearer " + accessToken,"Content-Type":"application/json"},
      body:JSON.stringify({message:{token:String(token),data:{title,body,tag:"live-chat-user-"+String(details.chat_id),url:target,chat_id:String(details.chat_id),event_id:String(details.event_id),notification_type:"live_chat_visitor"},webpush:{headers:{Urgency:"high",TTL:"86400"},fcm_options:{link:target}}}})
    }
  );
}

async function handleLiveChatVisitorPushNotify(request, env) {
  if (request.method !== "POST") return methodNotAllowed("POST");
  if (!env.DB) return databaseMissingResponse();

  const uid = await verifyLiveChatFirebaseUser(request);
  if (uid !== LIVE_CHAT_ADMIN_UID) {
    return jsonResponse({success:false,error:"Admin authorization required."}, 401);
  }
  const body = await readJsonBody(request);
  const chatId = cleanText(body.chat_id);
  const eventId = cleanText(body.event_id);
  const contentType = cleanText(body.content_type).toLowerCase();
  const preview = cleanText(body.preview);
  if (!chatId || chatId.length > 160 || !/^[A-Za-z0-9_-]{8,160}$/.test(eventId)) {
    return jsonResponse({success:false,error:"Valid chat and event ids required."}, 400);
  }

  await ensureLiveChatAdminPushTables(env);
  const now = new Date().toISOString();
  const insert = await env.DB.prepare(`
    INSERT OR IGNORE INTO live_chat_visitor_push_events
      (event_id, chat_id, created_at)
    VALUES (?, ?, ?)
  `).bind(eventId, chatId, now).run();
  if (!insert.meta || Number(insert.meta.changes || 0) === 0) {
    return jsonResponse({success:true,event:"duplicate_ignored"});
  }

  const tokenRows = await env.DB.prepare(`
    SELECT token FROM live_chat_visitor_push_tokens
    WHERE chat_id=? AND status='active'
    ORDER BY updated_at DESC LIMIT 5
  `).bind(chatId).all();
  const tokens = tokenRows && tokenRows.results ? tokenRows.results : [];
  if (!tokens.length) return jsonResponse({success:true,event:"visitor_notification_permission_not_registered",sent:0});

  const details = {chat_id:chatId,event_id:eventId,content_type:/^(text|image|video|audio|pdf|document)$/.test(contentType)?contentType:"text",preview};
  const results = await Promise.allSettled(tokens.map(row => sendLiveChatVisitorPush(env,row.token,details)));
  const sent = results.filter(result => result.status === "fulfilled" && result.value && result.value.ok).length;
  await env.DB.prepare(`DELETE FROM live_chat_visitor_push_events WHERE created_at < datetime('now','-7 days')`).run().catch(function(){});
  return jsonResponse({success:true,event:"live_chat_visitor_push_sent",sent});
}

async function handlePushRegister(
  request,
  env
) {

  if (request.method !== "POST") {
    return methodNotAllowed("POST");
  }

  if (!env.DB) {
    return databaseMissingResponse();
  }

  const body =
    await readJsonBody(request);

  const token =
    cleanText(body.token);

  const deviceId =
    cleanDeviceId(
      body.device_id
    );

  if (
    !token ||
    token.length < 50
  ) {
    return jsonResponse(
      {
        success: false,
        error:
          "Valid FCM token required."
      },
      400
    );
  }


  /*
    Table pehli baar automatic ban jayegi.
    Cloudflare D1 mein manually table
    banane ki zarurat nahi.
  */
  await env.DB.prepare(
    `
      CREATE TABLE IF NOT EXISTS
      push_tokens (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        token TEXT NOT NULL UNIQUE,

        device_id TEXT,

        platform TEXT,

        browser TEXT,

        status TEXT NOT NULL
          DEFAULT 'active',

        created_at TEXT NOT NULL,

        updated_at TEXT NOT NULL

      )
    `
  ).run();


  const deviceInfo =
    getDeviceInfo(
      request,
      body
    );

  const now =
    new Date().toISOString();


  /*
    Same token dobara aaye to duplicate
    row nahi banegi. Purani row update hogi.
  */
  await env.DB.prepare(
    `
      INSERT INTO push_tokens (

        token,
        device_id,
        platform,
        browser,
        status,
        created_at,
        updated_at

      )

      VALUES (
        ?, ?, ?, ?, 'active', ?, ?
      )

      ON CONFLICT(token)
      DO UPDATE SET

        device_id =
          excluded.device_id,

        platform =
          excluded.platform,

        browser =
          excluded.browser,

        status =
          'active',

        updated_at =
          excluded.updated_at
    `
  )
  .bind(
    token,
    deviceId || null,
    deviceInfo.platform,
    deviceInfo.browser,
    now,
    now
  )
  .run();


  const countRow =
    await env.DB.prepare(
      `
        SELECT COUNT(*) AS total
        FROM push_tokens
        WHERE status = 'active'
      `
    ).first();


  return jsonResponse({
    success: true,

    event:
      "push_token_registered",

    active_push_users:
      safeInteger(
        countRow &&
        countRow.total,
        0
      ),

    registered_at:
      now
  });

}

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 3B END
   ========================================================= */

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 4
   FIREBASE FCM TEST PUSH SENDER
   ========================================================= */

function irBase64Url(input) {

  const bytes =
    input instanceof Uint8Array
      ? input
      : new TextEncoder().encode(
          String(input)
        );

  let binary = "";

  for (
    let i = 0;
    i < bytes.length;
    i++
  ) {
    binary +=
      String.fromCharCode(
        bytes[i]
      );
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}


function irPemToArrayBuffer(pem) {

  const normalized =
    String(pem || "")
      .replace(/\\n/g, "\n")
      .trim();

  const base64 =
    normalized
      .replace(
        /-----BEGIN PRIVATE KEY-----/g,
        ""
      )
      .replace(
        /-----END PRIVATE KEY-----/g,
        ""
      )
      .replace(/\s+/g, "");

  const binary =
    atob(base64);

  const bytes =
    new Uint8Array(
      binary.length
    );

  for (
    let i = 0;
    i < binary.length;
    i++
  ) {
    bytes[i] =
      binary.charCodeAt(i);
  }

  return bytes.buffer;
}


async function getFirebaseAccessToken(
  env
) {

  if (
    !env.FIREBASE_PROJECT_ID ||
    !env.FIREBASE_CLIENT_EMAIL ||
    !env.FIREBASE_PRIVATE_KEY
  ) {
    throw new Error(
      "Firebase secrets missing."
    );
  }


  const now =
    Math.floor(
      Date.now() / 1000
    );


  const header = {
    alg: "RS256",
    typ: "JWT"
  };


  const claims = {

    iss:
      String(
        env.FIREBASE_CLIENT_EMAIL
      ),

    scope:
      "https://www.googleapis.com/auth/firebase.messaging",

    aud:
      "https://oauth2.googleapis.com/token",

    iat:
      now,

    exp:
      now + 3600

  };


  const encodedHeader =
    irBase64Url(
      JSON.stringify(header)
    );

  const encodedClaims =
    irBase64Url(
      JSON.stringify(claims)
    );


  const signingInput =
    encodedHeader +
    "." +
    encodedClaims;


  const privateKey =
    await crypto.subtle.importKey(

      "pkcs8",

      irPemToArrayBuffer(
        env.FIREBASE_PRIVATE_KEY
      ),

      {
        name:
          "RSASSA-PKCS1-v1_5",

        hash:
          "SHA-256"
      },

      false,

      ["sign"]

    );


  const signature =
    await crypto.subtle.sign(

      {
        name:
          "RSASSA-PKCS1-v1_5"
      },

      privateKey,

      new TextEncoder().encode(
        signingInput
      )

    );


  const assertion =
    signingInput +
    "." +
    irBase64Url(
      new Uint8Array(signature)
    );


  const form =
    new URLSearchParams();

  form.set(
    "grant_type",
    "urn:ietf:params:oauth:grant-type:jwt-bearer"
  );

  form.set(
    "assertion",
    assertion
  );


  const response =
    await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },

        body:
          form.toString()
      }
    );


  const text =
    await response.text();


  if (!response.ok) {
    throw new Error(
      "Google OAuth failed: " +
      response.status +
      " " +
      text
    );
  }


  const data =
    JSON.parse(text);


  if (!data.access_token) {
    throw new Error(
      "Google access token missing."
    );
  }


  return data.access_token;
}


/* =========================================================
   SEND TEST PUSH TO LATEST ACTIVE TOKEN
   ========================================================= */

async function handlePushTestSend(
  request,
  env
) {

  if (request.method !== "GET") {
    return methodNotAllowed("GET");
  }


  if (!env.DB) {
    return databaseMissingResponse();
  }


  if (!env.PWA_ADMIN_KEY) {

    return jsonResponse(
      {
        success: false,
        error:
          "PWA_ADMIN_KEY secret is missing."
      },
      500
    );

  }


  const url =
    new URL(request.url);


  const suppliedKey =
    cleanText(
      url.searchParams.get("key")
    );


  if (
    !suppliedKey ||
    suppliedKey !==
      String(env.PWA_ADMIN_KEY)
  ) {

    return jsonResponse(
      {
        success: false,
        error:
          "Unauthorized push test."
      },
      401
    );

  }


  if (
    !env.FIREBASE_PROJECT_ID ||
    !env.FIREBASE_CLIENT_EMAIL ||
    !env.FIREBASE_PRIVATE_KEY
  ) {

    return jsonResponse(
      {
        success: false,
        error:
          "Firebase secrets are missing."
      },
      500
    );

  }


  const pushUser =
    await env.DB.prepare(
      `
        SELECT
          token,
          device_id,
          platform,
          browser
        FROM push_tokens
        WHERE status = 'active'
        ORDER BY updated_at DESC
        LIMIT 1
      `
    ).first();


  if (
    !pushUser ||
    !pushUser.token
  ) {

    return jsonResponse(
      {
        success: false,
        error:
          "No active push token found."
      },
      404
    );

  }


  try {

    const accessToken =
      await getFirebaseAccessToken(
        env
      );


    const title =
      "Imdade Rohani";


    const message =
      "Alhamdulillah! Test Push Notification successfully bheji gayi hai.";


    const fcmPayload = {

      message: {

        token:
          String(
            pushUser.token
          ),

        notification: {

          title:
            title,

          body:
            message

        },

        data: {

          title:
            title,

          body:
            message,

          icon:
            SITE_ORIGIN +
            "/pwa-icon-192.png",

          badge:
            SITE_ORIGIN +
            "/pwa-icon-192.png",

          tag:
            "imdade-rohani-test",

          url:
            SITE_ORIGIN

        },

        webpush: {

          headers: {
            Urgency: "normal",
            TTL: "21600"
          },

          fcm_options: {
            link:
              SITE_ORIGIN
          }

        }

      }

    };


    const fcmResponse =
      await fetch(

        "https://fcm.googleapis.com/v1/projects/" +
        encodeURIComponent(
          String(
            env.FIREBASE_PROJECT_ID
          )
        ) +
        "/messages:send",

        {
          method: "POST",

          headers: {

            "Authorization":
              "Bearer " +
              accessToken,

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify(
              fcmPayload
            )

        }

      );


    const fcmText =
      await fcmResponse.text();


    let fcmResult = null;

    try {
      fcmResult =
        JSON.parse(fcmText);
    } catch (error) {
      fcmResult =
        fcmText;
    }


    if (!fcmResponse.ok) {

      return jsonResponse(
        {
          success: false,

          error:
            "FCM send failed.",

          status:
            fcmResponse.status,

          firebase:
            fcmResult
        },
        fcmResponse.status
      );

    }


    return jsonResponse({

      success: true,

      event:
        "test_push_sent",

      device_id:
        pushUser.device_id ||
        null,

      platform:
        pushUser.platform ||
        null,

      browser:
        pushUser.browser ||
        null,

      firebase:
        fcmResult,

      sent_at:
        new Date().toISOString()

    });


  } catch (error) {

    return jsonResponse(
      {
        success: false,

        error:
          "Push test failed.",

        message:
          error &&
          error.message
            ? error.message
            : String(error)
      },
      500
    );

  }

}

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 4 END
   ========================================================= */

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 5
   BROADCAST PUSH TO ALL ACTIVE USERS
   ========================================================= */

async function ensureNotificationInboxTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS notification_inbox (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      target_url TEXT,
      link_text TEXT,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_notification_inbox_expiry
    ON notification_inbox (expires_at, id)
  `).run();
}

async function saveNotificationToInbox(env, data) {
  await ensureNotificationInboxTable(env);

  const createdAt = new Date().toISOString();
  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const result = await env.DB.prepare(`
    INSERT INTO notification_inbox
      (title, message, target_url, link_text, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  .bind(
    data.title,
    data.message,
    data.url || "",
    data.link_text || "",
    createdAt,
    expiresAt
  )
  .run();

  return {
    id: result && result.meta ? result.meta.last_row_id : null,
    created_at: createdAt,
    expires_at: expiresAt
  };
}

async function handleNotificationInbox(request, env) {
  if (request.method !== "GET") {
    return methodNotAllowed("GET");
  }

  if (!env.DB) {
    return databaseMissingResponse();
  }

  await ensureNotificationInboxTable(env);

  const now = new Date().toISOString();

  await env.DB.prepare(`
    DELETE FROM notification_inbox
    WHERE expires_at <= ?
  `).bind(now).run();

  const result = await env.DB.prepare(`
    SELECT id, title, message, target_url, link_text, created_at, expires_at
    FROM notification_inbox
    WHERE expires_at > ?
    ORDER BY id DESC
    LIMIT 100
  `).bind(now).all();

  return jsonResponse({
    success: true,
    notifications:
      result && Array.isArray(result.results)
        ? result.results
        : [],
    server_time: now
  });
}

async function handlePushBroadcast(
  request,
  env
) {

  if (request.method !== "GET") {
    return methodNotAllowed("GET");
  }

  if (!env.DB) {
    return databaseMissingResponse();
  }

  if (!env.PWA_ADMIN_KEY) {
    return jsonResponse(
      {
        success: false,
        error:
          "PWA_ADMIN_KEY secret is missing."
      },
      500
    );
  }

  const url =
    new URL(request.url);

  const suppliedKey =
    cleanText(
      url.searchParams.get("key")
    );

  if (
    !suppliedKey ||
    suppliedKey !==
      String(env.PWA_ADMIN_KEY)
  ) {
    return jsonResponse(
      {
        success: false,
        error:
          "Unauthorized broadcast."
      },
      401
    );
  }

  if (
    !env.FIREBASE_PROJECT_ID ||
    !env.FIREBASE_CLIENT_EMAIL ||
    !env.FIREBASE_PRIVATE_KEY
  ) {
    return jsonResponse(
      {
        success: false,
        error:
          "Firebase secrets are missing."
      },
      500
    );
  }

  const title =
    cleanText(
      url.searchParams.get("title"),
      "Imdade Rohani"
    ).slice(0, 120);

  const message =
    cleanText(
      url.searchParams.get("body"),
      "Imdade Rohani se nayi maloomat mojood hai."
    ).slice(0, 500);

  const targetUrl =
  cleanText(
    url.searchParams.get("url"),
    ""
  );

const linkText =
  cleanText(
    url.searchParams.get("link_text"),
    ""
  ).slice(0, 40);

const targetUrl2 =
  cleanText(
    url.searchParams.get("url2"),
    ""
  );

const linkText2 =
  cleanText(
    url.searchParams.get("link_text2"),
    ""
  ).slice(0, 40);

const targetUrl3 =
  cleanText(
    url.searchParams.get("url3"),
    ""
  );

const linkText3 =
  cleanText(
    url.searchParams.get("link_text3"),
    ""
  ).slice(0, 40);

  /* Admin se bheja har real broadcast website/PWA inbox mein 7 din rahega. */
  const inboxRecord =
    await saveNotificationToInbox(
      env,
      {
        title: title,
        message: message,
        url: targetUrl,
        link_text: linkText
      }
    );
   
  const rows =
    await env.DB.prepare(
      `
        SELECT
          id,
          token,
          device_id,
          platform,
          browser
        FROM push_tokens
        WHERE status = 'active'
        ORDER BY updated_at DESC
      `
    ).all();

  const users =
    rows &&
    Array.isArray(rows.results)
      ? rows.results
      : [];

  if (!users.length) {
    return jsonResponse(
      {
        success: false,
        error:
          "No active push users found."
      },
      404
    );
  }

  try {

    /*
      Firebase OAuth token sirf ek baar
      liya jayega, phir sab users ke liye
      wahi token istemal hoga.
    */
    const accessToken =
      await getFirebaseAccessToken(
        env
      );

    let sent = 0;
    let failed = 0;
    let deactivated = 0;

    const failures = [];

    /*
      Users ko chhote batches mein bhejna
      Worker par zyada load se bachata hai.
    */
    const batchSize = 20;

    for (
      let start = 0;
      start < users.length;
      start += batchSize
    ) {

      const batch =
        users.slice(
          start,
          start + batchSize
        );

      const results =
        await Promise.all(
          batch.map(
            async pushUser => {

              try {

                const payload = {

                  message: {

                    token:
                      String(
                        pushUser.token
                      ),

                    data: {

                      title:
                        title,

                      body:
                        message,

                      icon:
                        SITE_ORIGIN +
                        "/pwa-icon-192.png",

                     tag:
  "imdade-rohani-broadcast",

url:
  targetUrl,

action_text:
  linkText,

url2:
  targetUrl2,

action_text2:
  linkText2,

url3:
  targetUrl3,

action_text3:
  linkText3

                    },

                    webpush: {

                      headers: {
                        Urgency: "normal",
                        TTL: "21600"
                      },
                       
                    }

                  }

                };

                const response =
                  await fetch(

                    "https://fcm.googleapis.com/v1/projects/" +
                    encodeURIComponent(
                      String(
                        env.FIREBASE_PROJECT_ID
                      )
                    ) +
                    "/messages:send",

                    {
                      method: "POST",

                      headers: {

                        "Authorization":
                          "Bearer " +
                          accessToken,

                        "Content-Type":
                          "application/json"

                      },

                      body:
                        JSON.stringify(
                          payload
                        )

                    }

                  );

                const responseText =
                  await response.text();

                let firebaseResult =
                  null;

                try {
                  firebaseResult =
                    JSON.parse(
                      responseText
                    );
                } catch (error) {
                  firebaseResult =
                    responseText;
                }

                if (response.ok) {
                  return {
                    ok: true,
                    user:
                      pushUser
                  };
                }

                /*
                  Sirf confirmed UNREGISTERED
                  token ko inactive kiya jayega.
                */
                let unregister =
                  false;

                const details =
                  firebaseResult &&
                  firebaseResult.error &&
                  Array.isArray(
                    firebaseResult
                      .error
                      .details
                  )
                    ? firebaseResult
                        .error
                        .details
                    : [];

                for (
                  const detail of details
                ) {
                  if (
                    detail &&
                    detail.errorCode ===
                      "UNREGISTERED"
                  ) {
                    unregister =
                      true;
                    break;
                  }
                }

                if (unregister) {

                  await env.DB.prepare(
                    `
                      UPDATE push_tokens
                      SET
                        status = 'inactive',
                        updated_at = ?
                      WHERE token = ?
                    `
                  )
                  .bind(
                    new Date()
                      .toISOString(),
                    String(
                      pushUser.token
                    )
                  )
                  .run();

                }

                return {
                  ok: false,
                  inactive:
                    unregister,
                  user:
                    pushUser,
                  status:
                    response.status,
                  firebase:
                    firebaseResult
                };

              } catch (error) {

                return {
                  ok: false,
                  inactive: false,
                  user:
                    pushUser,
                  status: 0,
                  firebase: {
                    message:
                      error &&
                      error.message
                        ? error.message
                        : String(error)
                  }
                };

              }

            }
          )
        );

      for (
        const result of results
      ) {

        if (result.ok) {

          sent += 1;

        } else {

          failed += 1;

          if (result.inactive) {
            deactivated += 1;
          }

          failures.push({
            device_id:
              result.user &&
              result.user.device_id
                ? result.user.device_id
                : null,

            status:
              result.status,

            token_deactivated:
              Boolean(
                result.inactive
              )
          });

        }

      }

    }

    return jsonResponse({

      success: true,

      event:
        "broadcast_completed",

      title:
        title,

      message:
        message,

      total_active_tokens:
        users.length,

      successfully_sent:
        sent,

      failed:
        failed,

      invalid_tokens_deactivated:
        deactivated,

      failures:
        failures.slice(0, 50),

      inbox_id:
        inboxRecord.id,

      inbox_expires_at:
        inboxRecord.expires_at,

      sent_at:
        new Date()
          .toISOString()

    });

  } catch (error) {

    return jsonResponse(
      {
        success: false,

        error:
          "Broadcast push failed.",

        message:
          error &&
          error.message
            ? error.message
            : String(error)
      },
      500
    );

  }

}

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 5 END
   ========================================================= */

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 6
   PROFESSIONAL PUSH NOTIFICATION ADMIN PAGE
   ========================================================= */

/* =========================================================
   NOTIFICATION OPTION PAGE
   UNIQUE SLUG + 3 MINUTE EXPIRY
   ========================================================= */

function makeNotificationOptionBaseSlug(textList) {

  const parts = textList
    .filter(Boolean)
    .map(function(text) {

      return String(text)
        .trim()
        .toLowerCase()
        .normalize("NFKC")
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "");

    })
    .filter(Boolean);

  const joined =
    parts.join("-") || "links";

  return "option-" + joined;
}


async function createNotificationOptionPage(
  env,
  links
) {

  if (!env || !env.DB) {
    throw new Error(
      "D1 DB notification option page ke liye available nahi hai."
    );
  }

  const validLinks =
    Array.isArray(links)
      ? links.filter(function(item) {
          return (
            item &&
            item.url &&
            item.text
          );
        }).slice(0, 3)
      : [];

  if (validLinks.length < 2) {
    throw new Error(
      "Option page ke liye kam az kam 2 links zaroori hain."
    );
  }

  const baseSlug =
    makeNotificationOptionBaseSlug(
      validLinks.map(function(item) {
        return item.text;
      })
    );

  /*
    Pehli baar:
    option-phone-channel

    Doosri baar:
    option-phone-channel-1

    Teesri baar:
    option-phone-channel-2
  */

  const lastRow =
    await env.DB.prepare(
      `
      SELECT MAX(sequence_no) AS max_sequence
      FROM notification_option_pages
      WHERE base_slug = ?
      `
    )
    .bind(baseSlug)
    .first();

  let sequenceNo = 0;

  if (
    lastRow &&
    lastRow.max_sequence !== null &&
    lastRow.max_sequence !== undefined
  ) {
    sequenceNo =
      Number(lastRow.max_sequence) + 1;
  }

  let slug =
    sequenceNo === 0
      ? baseSlug
      : baseSlug + "-" + sequenceNo;

  const createdAt =
    new Date().toISOString();

    /*
    DEVICE-WISE EXPIRY:
    Notification bhejne ke waqt timer start nahi hoga.
    Har device ka apna 3-minute timer
    pehli baar option page kholne par start hoga.
  */
  const expiresAt = "";

  const first =
    validLinks[0] || {};

  const second =
    validLinks[1] || {};

  const third =
    validLinks[2] || {};

  /*
    Agar ek hi waqt same slug create hone ki
    koshish ho to unique constraint se bachne
    ke liye retry.
  */

  for (let attempt = 0; attempt < 5; attempt++) {

    try {

      await env.DB.prepare(
        `
        INSERT INTO notification_option_pages
        (
          base_slug,
          slug,
          sequence_no,

          url1,
          text1,

          url2,
          text2,

          url3,
          text3,

          created_at,
          expires_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .bind(
        baseSlug,
        slug,
        sequenceNo,

        first.url || null,
        first.text || null,

        second.url || null,
        second.text || null,

        third.url || null,
        third.text || null,

        createdAt,
        expiresAt
      )
      .run();

      return {
        slug: slug,
        baseSlug: baseSlug,
        sequenceNo: sequenceNo,
        createdAt: createdAt,
        expiresAt: expiresAt
      };

    } catch (error) {

      /*
        Same naam ek hi waqt create hua ho
        to agla number try karein.
      */

      sequenceNo++;

      slug =
        baseSlug + "-" + sequenceNo;

      if (attempt === 4) {
        throw error;
      }
    }
  }

  throw new Error(
    "Notification option page create nahi ho saka."
  );
}

/* =========================================================
   NOTIFICATION OPTION PAGE HELPER END
   ========================================================= */

async function ensureScheduledPushTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS scheduled_push_notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      target_url TEXT,
      link_text TEXT,
      scheduled_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      attempts INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      created_at TEXT NOT NULL,
      processing_at TEXT,
      sent_at TEXT,
      repeat_type TEXT NOT NULL DEFAULT 'no_repeat',
      updated_at TEXT,
      timezone_offset_minutes INTEGER NOT NULL DEFAULT 0
      ,link_data TEXT,
      wait_repeat INTEGER NOT NULL DEFAULT 0
    )
  `).run();

  const tableInfo =
    await env.DB.prepare(`
      PRAGMA table_info(scheduled_push_notifications)
    `).all();

  const columnNames =
    new Set(
      (tableInfo.results || []).map(
        function(column){
          return String(column.name || "");
        }
      )
    );

  if (!columnNames.has("repeat_type")) {
    await env.DB.prepare(`
      ALTER TABLE scheduled_push_notifications
      ADD COLUMN repeat_type TEXT NOT NULL DEFAULT 'no_repeat'
    `).run();
  }

  if (!columnNames.has("updated_at")) {
    await env.DB.prepare(`
      ALTER TABLE scheduled_push_notifications
      ADD COLUMN updated_at TEXT
    `).run();
  }

  if (!columnNames.has("timezone_offset_minutes")) {
    await env.DB.prepare(`
      ALTER TABLE scheduled_push_notifications
      ADD COLUMN timezone_offset_minutes INTEGER NOT NULL DEFAULT 0
    `).run();
  }

  if (!columnNames.has("link_data")) {
    await env.DB.prepare(`
      ALTER TABLE scheduled_push_notifications
      ADD COLUMN link_data TEXT
    `).run();
  }


  if (!columnNames.has("wait_repeat")) {
    await env.DB.prepare(`
      ALTER TABLE scheduled_push_notifications
      ADD COLUMN wait_repeat INTEGER NOT NULL DEFAULT 0
    `).run();
  }

  await env.DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_scheduled_push_due
    ON scheduled_push_notifications
    (status, scheduled_at)
  `).run();
}

async function saveScheduledPush(env, data) {
  if (!env.DB) {
    throw new Error(
      "D1 DB scheduled notification ke liye available nahi hai."
    );
  }

  await ensureScheduledPushTable(env);

  const createdAt =
    new Date().toISOString();

  const result =
    await env.DB.prepare(`
      INSERT INTO scheduled_push_notifications (
        title,
        message,
        target_url,
        link_text,
        scheduled_at,
        status,
        attempts,
        created_at,
        repeat_type,
        updated_at,
        timezone_offset_minutes
        ,link_data,
        wait_repeat
      ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      data.title,
      data.message,
      data.url || "",
      data.link_text || "",
      data.scheduled_at,
      data.status === "draft"
        ? "draft"
        : "pending",
      createdAt,
      normalizeRepeatType(data.repeat_type),
      createdAt,
      Number(data.timezone_offset_minutes || 0)
      ,JSON.stringify(
        Array.isArray(data.links)
          ? data.links.slice(0, 3)
          : []
      ),
      normalizeWaitRepeat(data.wait_repeat)
    )
    .run();

  return {
    id:
      result && result.meta
        ? result.meta.last_row_id
        : null,
    scheduled_at:
      data.scheduled_at
  };
}

function normalizeRepeatType(value) {
  const allowed = [
    "no_repeat",
    "hourly",
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "weekdays",
    "weekend"
  ];

  const normalized =
    cleanText(value, "no_repeat")
      .toLowerCase();

  return allowed.includes(normalized)
    ? normalized
    : "no_repeat";
}

function normalizeWaitRepeat(value) {
  const numberValue =
    Math.floor(Number(value));

  if (
    !Number.isFinite(numberValue) ||
    numberValue < 0
  ) {
    return 0;
  }

  return Math.min(numberValue, 10000);
}

function getNextRecurringDate(
  currentIso,
  repeatType,
  timezoneOffsetMinutes = 0,
  waitRepeat = 0
) {
  const type =
    normalizeRepeatType(repeatType);

  if (type === "no_repeat") {
    return null;
  }

  const offsetMs =
    Number(timezoneOffsetMinutes || 0) *
    60000;

  const currentUtc =
    new Date(currentIso);

  if (!Number.isFinite(currentUtc.getTime())) {
    return null;
  }

  let localNext =
    new Date(
      currentUtc.getTime() - offsetMs
    );

  const repeatSteps =
    normalizeWaitRepeat(waitRepeat) + 1;

  function advanceOnce(date) {
    if (type === "hourly") {
      date.setUTCHours(date.getUTCHours() + 1);
    } else if (type === "daily") {
      date.setUTCDate(date.getUTCDate() + 1);
    } else if (type === "weekly") {
      date.setUTCDate(date.getUTCDate() + 7);
    } else if (type === "monthly") {
      const originalDay = date.getUTCDate();
      date.setUTCDate(1);
      date.setUTCMonth(date.getUTCMonth() + 1);
      const lastDay =
        new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth() + 1,
            0
          )
        ).getUTCDate();
      date.setUTCDate(
        Math.min(originalDay, lastDay)
      );
    } else if (type === "yearly") {
      const originalMonth = date.getUTCMonth();
      const originalDay = date.getUTCDate();
      date.setUTCDate(1);
      date.setUTCFullYear(date.getUTCFullYear() + 1);
      date.setUTCMonth(originalMonth);
      const lastDay =
        new Date(
          Date.UTC(
            date.getUTCFullYear(),
            originalMonth + 1,
            0
          )
        ).getUTCDate();
      date.setUTCDate(
        Math.min(originalDay, lastDay)
      );
    } else if (type === "weekdays") {
      do {
        date.setUTCDate(date.getUTCDate() + 1);
      } while (
        date.getUTCDay() === 0 ||
        date.getUTCDay() === 6
      );
    } else if (type === "weekend") {
      do {
        date.setUTCDate(date.getUTCDate() + 1);
      } while (
        date.getUTCDay() !== 0 &&
        date.getUTCDay() !== 6
      );
    }
  }

  function advanceGroup(date) {
    for (
      let step = 0;
      step < repeatSteps;
      step++
    ) {
      advanceOnce(date);
    }
  }

  do {
    advanceGroup(localNext);
  } while (
    localNext.getTime() + offsetMs <=
    Date.now()
  );

  const nextUtc =
    new Date(
      localNext.getTime() + offsetMs
    );

  if (!Number.isFinite(nextUtc.getTime())) {
    return null;
  }

  return nextUtc.toISOString();
}

async function runDueScheduledPushes(env) {
  if (
    !env ||
    !env.DB ||
    !env.PWA_ADMIN_KEY
  ) {
    return;
  }

  await ensureScheduledPushTable(env);

  const now =
    new Date().toISOString();

  const staleProcessing =
    new Date(
      Date.now() - 10 * 60 * 1000
    ).toISOString();

  await env.DB.prepare(`
    UPDATE scheduled_push_notifications
    SET status = 'pending', processing_at = NULL
    WHERE status = 'processing'
      AND processing_at < ?
      AND attempts < 3
  `)
  .bind(staleProcessing)
  .run();

  const dueResult =
    await env.DB.prepare(`
      SELECT
        id,
        title,
        message,
        target_url,
        link_text,
        scheduled_at,
        attempts,
        repeat_type,
        timezone_offset_minutes,
        wait_repeat
      FROM scheduled_push_notifications
      WHERE status = 'pending'
        AND scheduled_at <= ?
        AND attempts < 3
      ORDER BY scheduled_at ASC
      LIMIT 10
    `)
    .bind(now)
    .all();

  const dueRows =
    dueResult &&
    Array.isArray(dueResult.results)
      ? dueResult.results
      : [];

  for (const item of dueRows) {
    const claim =
      await env.DB.prepare(`
        UPDATE scheduled_push_notifications
        SET
          status = 'processing',
          processing_at = ?,
          attempts = attempts + 1
        WHERE id = ?
          AND status = 'pending'
      `)
      .bind(now, item.id)
      .run();

    if (
      !claim ||
      !claim.meta ||
      Number(claim.meta.changes || 0) !== 1
    ) {
      continue;
    }

    try {
      const internalUrl =
        new URL(
          SITE_ORIGIN +
          "/api/push/broadcast"
        );

      internalUrl.searchParams.set(
        "key",
        String(env.PWA_ADMIN_KEY)
      );
      internalUrl.searchParams.set(
        "title",
        String(item.title || "Imdade Rohani")
      );
      internalUrl.searchParams.set(
        "body",
        String(item.message || "")
      );
      internalUrl.searchParams.set(
        "url",
        String(item.target_url || "")
      );
      internalUrl.searchParams.set(
        "link_text",
        String(item.link_text || "")
      );

      const response =
        await handlePushBroadcast(
          new Request(
            internalUrl.toString(),
            { method: "GET" }
          ),
          env
        );

      let result = null;
      try {
        result =
          await response.clone().json();
      } catch (error) {
        result = null;
      }

      if (
        response.ok &&
        result &&
        result.success
      ) {
        const deliveredAt =
          new Date().toISOString();

        const nextRun =
          getNextRecurringDate(
            item.scheduled_at,
            item.repeat_type,
            item.timezone_offset_minutes,
            item.wait_repeat
          );

        if (nextRun) {
          await env.DB.prepare(`
            UPDATE scheduled_push_notifications
            SET
              status = 'pending',
              scheduled_at = ?,
              attempts = 0,
              processing_at = NULL,
              sent_at = ?,
              last_error = NULL,
              updated_at = ?
            WHERE id = ?
          `)
          .bind(
            nextRun,
            deliveredAt,
            deliveredAt,
            item.id
          )
          .run();
        } else {
          await env.DB.prepare(`
            UPDATE scheduled_push_notifications
            SET
              status = 'sent',
              sent_at = ?,
              processing_at = NULL,
              last_error = NULL,
              updated_at = ?
            WHERE id = ?
          `)
          .bind(
            deliveredAt,
            deliveredAt,
            item.id
          )
          .run();
        }
      } else {
        throw new Error(
          result &&
          (result.error || result.message)
            ? String(
                result.error || result.message
              )
            : "Scheduled broadcast failed."
        );
      }
    } catch (error) {
      const nextStatus =
        Number(item.attempts || 0) + 1 >= 3
          ? "failed"
          : "pending";

      await env.DB.prepare(`
        UPDATE scheduled_push_notifications
        SET
          status = ?,
          processing_at = NULL,
          last_error = ?
        WHERE id = ?
      `)
      .bind(
        nextStatus,
        error && error.message
          ? error.message.slice(0, 500)
          : String(error).slice(0, 500),
        item.id
      )
      .run();

      console.log(
        "Scheduled push failed:",
        item.id,
        error && error.message
          ? error.message
          : String(error)
      );
    }
  }
}

async function handlePushAdminPage(
  request,
  env
) {

  /*
   * ---------------------------------------------------------
   * POST = Admin page se notification bhejna
   * ---------------------------------------------------------
   */
  if (request.method === "POST") {

    if (!env.PWA_ADMIN_KEY) {
      return jsonResponse(
        {
          success: false,
          error:
            "PWA_ADMIN_KEY secret is missing."
        },
        500
      );
    }

    const body =
      await readJsonBody(request);

    const adminKey =
      cleanText(body.key);

    if (
      !adminKey ||
      adminKey !==
        String(env.PWA_ADMIN_KEY)
    ) {
      return jsonResponse(
        {
          success: false,
          error:
            "Admin Key ghalat hai."
        },
        401
      );
    }

    const adminAction =
      cleanText(
        body.action,
        "send_or_schedule"
      );

    if (
      adminAction === "list_schedules"
    ) {
      if (!env.DB) {
        return databaseMissingResponse();
      }

      await ensureScheduledPushTable(env);

      const scheduleRows =
        await env.DB.prepare(`
          SELECT
            id,
            title,
            message,
            target_url,
            link_text,
            link_data,
            scheduled_at,
            repeat_type,
            wait_repeat,
            timezone_offset_minutes,
            status,
            attempts,
            last_error,
            created_at,
            sent_at
          FROM scheduled_push_notifications
          WHERE status IN ('draft', 'pending', 'processing', 'failed', 'sent')
          ORDER BY scheduled_at ASC
          LIMIT 200
        `).all();

      return jsonResponse({
        success: true,
        event: "schedule_list",
        schedules:
          scheduleRows &&
          Array.isArray(scheduleRows.results)
            ? scheduleRows.results
            : []
      });
    }

    if (
      adminAction === "copy_schedule"
    ) {
      if (!env.DB) {
        return databaseMissingResponse();
      }

      await ensureScheduledPushTable(env);

      const sourceId =
        Number(body.schedule_id);

      if (
        !Number.isInteger(sourceId) ||
        sourceId <= 0
      ) {
        return jsonResponse(
          {
            success: false,
            error: "Copy ke liye Schedule ID durust nahi hai."
          },
          400
        );
      }

      const copiedAt =
        new Date().toISOString();

      const copied =
        await env.DB.prepare(`
          INSERT INTO scheduled_push_notifications (
            title,
            message,
            target_url,
            link_text,
            scheduled_at,
            status,
            attempts,
            last_error,
            created_at,
            processing_at,
            sent_at,
            repeat_type,
            updated_at,
            timezone_offset_minutes,
            link_data,
            wait_repeat
          )
          SELECT
            title,
            message,
            target_url,
            link_text,
            scheduled_at,
            'draft',
            0,
            NULL,
            ?,
            NULL,
            NULL,
            repeat_type,
            ?,
            timezone_offset_minutes,
            link_data,
            wait_repeat
          FROM scheduled_push_notifications
          WHERE id = ?
        `)
        .bind(
          copiedAt,
          copiedAt,
          sourceId
        )
        .run();

      const changes =
        Number(
          copied && copied.meta
            ? copied.meta.changes || 0
            : 0
        );

      if (changes !== 1) {
        return jsonResponse(
          {
            success: false,
            error: "Jis notification ko copy karna hai woh nahi mili."
          },
          404
        );
      }

      return jsonResponse(
        {
          success: true,
          event: "schedule_copied",
          source_schedule_id: sourceId,
          schedule_id:
            copied && copied.meta
              ? copied.meta.last_row_id
              : null,
          status: "draft"
        },
        201
      );
    }

    if (
      adminAction === "delete_schedule"
    ) {
      if (!env.DB) {
        return databaseMissingResponse();
      }

      await ensureScheduledPushTable(env);

      const scheduleId =
        Number(body.schedule_id);

      if (
        !Number.isInteger(scheduleId) ||
        scheduleId <= 0
      ) {
        return jsonResponse(
          {
            success: false,
            error: "Schedule ID durust nahi hai."
          },
          400
        );
      }

      const deleted =
        await env.DB.prepare(`
          DELETE FROM scheduled_push_notifications
          WHERE id = ?
        `)
        .bind(scheduleId)
        .run();

      return jsonResponse({
        success: true,
        event: "schedule_deleted",
        schedule_id: scheduleId,
        deleted:
          Number(
            deleted && deleted.meta
              ? deleted.meta.changes || 0
              : 0
          ) === 1
      });
    }

    if (
      adminAction === "update_schedule"
    ) {
      if (!env.DB) {
        return databaseMissingResponse();
      }

      await ensureScheduledPushTable(env);

      const scheduleId =
        Number(body.schedule_id);

      const updatedDate =
        new Date(
          cleanText(body.schedule_at)
        );

      const saveAsDraft =
        body.save_as_draft === true;

      if (
        !Number.isInteger(scheduleId) ||
        scheduleId <= 0 ||
        !Number.isFinite(updatedDate.getTime()) ||
        (
          !saveAsDraft &&
          updatedDate.getTime() <= Date.now() + 15000
        )
      ) {
        return jsonResponse(
          {
            success: false,
            error:
              "Schedule ID ya nayi date/time durust nahi hai."
          },
          400
        );
      }

      const updatedTitle =
        cleanText(body.title, "Imdade Rohani")
          .slice(0, 120);

      const updatedMessage =
        cleanText(body.message)
          .slice(0, 500);

      if (!updatedMessage) {
        return jsonResponse(
          {
            success: false,
            error: "Notification message khali nahi ho sakta."
          },
          400
        );
      }

      const updatedLinks =
        Array.isArray(body.links)
          ? body.links
              .slice(0, 3)
              .map(function(link){
                return {
                  url: cleanText(link && link.url, ""),
                  text: cleanText(link && link.text, "").slice(0, 40)
                };
              })
              .filter(function(link){
                return Boolean(link.url && link.text);
              })
          : [];

      let updatedTargetUrl = "";
      let updatedLinkText = "";

      if (updatedLinks.length === 1) {
        updatedTargetUrl = updatedLinks[0].url;
        updatedLinkText = updatedLinks[0].text;
      } else if (updatedLinks.length > 1) {
        const optionPage =
          await createNotificationOptionPage(
            env,
            updatedLinks
          );
        updatedTargetUrl =
          SITE_ORIGIN + "/" + optionPage.slug;
        updatedLinkText = "Options Dekhein";
      }

      const updateResult =
        await env.DB.prepare(`
          UPDATE scheduled_push_notifications
          SET
            title = ?,
            message = ?,
            target_url = ?,
            link_text = ?,
            link_data = ?,
            scheduled_at = ?,
            repeat_type = ?,
            wait_repeat = ?,
            timezone_offset_minutes = ?,
            status = ?,
            attempts = 0,
            processing_at = NULL,
            last_error = NULL,
            updated_at = ?
          WHERE id = ?
        `)
        .bind(
          updatedTitle,
          updatedMessage,
          updatedTargetUrl,
          updatedLinkText,
          JSON.stringify(updatedLinks),
          updatedDate.toISOString(),
          normalizeRepeatType(body.repeat_type),
          normalizeWaitRepeat(body.wait_repeat),
          Number(body.timezone_offset_minutes || 0),
          saveAsDraft ? "draft" : "pending",
          new Date().toISOString(),
          scheduleId
        )
        .run();

      return jsonResponse({
        success: true,
        event: "schedule_updated",
        schedule_id: scheduleId,
        updated:
          Number(
            updateResult && updateResult.meta
              ? updateResult.meta.changes || 0
              : 0
          ) === 1,
        scheduled_at:
          updatedDate.toISOString(),
        repeat_type:
          normalizeRepeatType(body.repeat_type),
        wait_repeat:
          normalizeWaitRepeat(body.wait_repeat),
        status:
          saveAsDraft ? "draft" : "pending"
      });
    }

    if (
      adminAction === "send_schedule_now"
    ) {
      if (!env.DB) {
        return databaseMissingResponse();
      }

      await ensureScheduledPushTable(env);

      const scheduleId =
        Number(body.schedule_id);

      if (
        !Number.isInteger(scheduleId) ||
        scheduleId <= 0
      ) {
        return jsonResponse(
          {
            success: false,
            error: "Schedule ID durust nahi hai."
          },
          400
        );
      }

      const storedSchedule =
        await env.DB.prepare(`
          SELECT
            id,
            title,
            message,
            target_url,
            link_text,
            link_data
          FROM scheduled_push_notifications
          WHERE id = ?
          LIMIT 1
        `)
        .bind(scheduleId)
        .first();

      if (!storedSchedule) {
        return jsonResponse(
          {
            success: false,
            error: "Notification record nahi mili."
          },
          404
        );
      }

      const sendTitle =
        cleanText(
          body.title,
          storedSchedule.title || "Imdade Rohani"
        ).slice(0, 120);

      const sendMessage =
        cleanText(
          body.message,
          storedSchedule.message || ""
        ).slice(0, 500);

      const sendLinks =
        Array.isArray(body.links)
          ? body.links
              .slice(0, 3)
              .map(function(link){
                return {
                  url: cleanText(link && link.url, ""),
                  text: cleanText(link && link.text, "").slice(0, 40)
                };
              })
              .filter(function(link){
                return Boolean(link.url && link.text);
              })
          : [];

      let sendTargetUrl =
        String(storedSchedule.target_url || "");
      let sendLinkText =
        String(storedSchedule.link_text || "");

      if (Array.isArray(body.links)) {
        sendTargetUrl = "";
        sendLinkText = "";

        if (sendLinks.length === 1) {
          sendTargetUrl = sendLinks[0].url;
          sendLinkText = sendLinks[0].text;
        } else if (sendLinks.length > 1) {
          const optionPage =
            await createNotificationOptionPage(
              env,
              sendLinks
            );
          sendTargetUrl =
            SITE_ORIGIN + "/" + optionPage.slug;
          sendLinkText = "Options Dekhein";
        }
      }

      const internalUrl =
        new URL(
          SITE_ORIGIN +
          "/api/push/broadcast"
        );

      internalUrl.searchParams.set(
        "key",
        adminKey
      );
      internalUrl.searchParams.set(
        "title",
        sendTitle
      );
      internalUrl.searchParams.set(
        "body",
        sendMessage
      );
      internalUrl.searchParams.set(
        "url",
        sendTargetUrl
      );
      internalUrl.searchParams.set(
        "link_text",
        sendLinkText
      );

      const sendResponse =
        await handlePushBroadcast(
          new Request(
            internalUrl.toString(),
            { method: "GET" }
          ),
          env
        );

      let sendResult = null;
      try {
        sendResult =
          await sendResponse.clone().json();
      } catch (error) {
        sendResult = null;
      }

      if (
        !sendResponse.ok ||
        !sendResult ||
        !sendResult.success
      ) {
        return jsonResponse(
          {
            success: false,
            error:
              sendResult &&
              (sendResult.error || sendResult.message)
                ? sendResult.error || sendResult.message
                : "Notification abhi send nahi ho saki."
          },
          sendResponse.status || 500
        );
      }

      const sentAt =
        new Date().toISOString();

      await env.DB.prepare(`
        UPDATE scheduled_push_notifications
        SET
          title = ?,
          message = ?,
          target_url = ?,
          link_text = ?,
          link_data = ?,
          status = 'sent',
          sent_at = ?,
          processing_at = NULL,
          attempts = 0,
          last_error = NULL,
          updated_at = ?
        WHERE id = ?
      `)
      .bind(
        sendTitle,
        sendMessage,
        sendTargetUrl,
        sendLinkText,
        JSON.stringify(sendLinks),
        sentAt,
        sentAt,
        scheduleId
      )
      .run();

      return jsonResponse({
        success: true,
        event: "schedule_sent_now",
        schedule_id: scheduleId,
        sent_at: sentAt,
        successfully_sent:
          sendResult.successfully_sent || 0,
        failed:
          sendResult.failed || 0
      });
    }

    const title =
      cleanText(
        body.title,
        "Imdade Rohani"
      ).slice(0, 120);

    const message =
      cleanText(
        body.message,
        "Imdade Rohani se nayi maloomat mojood hai."
      ).slice(0, 500);

    const targetUrl =
  cleanText(
    body.url,
    ""
  );

const linkText =
  cleanText(
    body.link_text,
    ""
  ).slice(0, 40);

const targetUrl2 =
  cleanText(
    body.url2,
    ""
  );

const linkText2 =
  cleanText(
    body.link_text2,
    ""
  ).slice(0, 40);

const targetUrl3 =
  cleanText(
    body.url3,
    ""
  );

const linkText3 =
  cleanText(
    body.link_text3,
    ""
  ).slice(0, 40);

const scheduleAt =
  cleanText(
    body.schedule_at,
    ""
  );

const repeatType =
  normalizeRepeatType(
    body.repeat_type
  );

const saveAsDraft =
  body.save_as_draft === true;

/* =========================================
   SINGLE LINK / MULTI LINK FINAL TARGET
   ========================================= */

let notificationTargetUrl =
  targetUrl;

let notificationButtonText =
  linkText;

const hasSecondLink =
  Boolean(
    targetUrl2 &&
    linkText2
  );

const hasThirdLink =
  Boolean(
    targetUrl3 &&
    linkText3
  );

const editableLinks = [];

if (targetUrl && linkText) {
  editableLinks.push({
    url: targetUrl,
    text: linkText
  });
}

if (hasSecondLink) {
  editableLinks.push({
    url: targetUrl2,
    text: linkText2
  });
}

if (hasThirdLink) {
  editableLinks.push({
    url: targetUrl3,
    text: linkText3
  });
}

if (
  hasSecondLink ||
  hasThirdLink
) {

  const optionPage =
    await createNotificationOptionPage(
      env,
      editableLinks
    );

  notificationTargetUrl =
    SITE_ORIGIN +
    "/" +
    optionPage.slug;

  notificationButtonText =
    "Options Dekhein";
}

    /* Calendar se future date/time diya gaya ho to
       notification abhi bhejne ke bajaye D1 mein save hogi. */
    if (scheduleAt || saveAsDraft) {
      const scheduledDate =
        scheduleAt
          ? new Date(scheduleAt)
          : new Date();

      if (
        !Number.isFinite(
          scheduledDate.getTime()
        )
      ) {
        return jsonResponse(
          {
            success: false,
            error:
              "Notification ki date ya time durust nahi hai."
          },
          400
        );
      }

      if (
        !saveAsDraft &&
        scheduledDate.getTime() <=
        Date.now() + 15000
      ) {
        return jsonResponse(
          {
            success: false,
            error:
              "Schedule ka waqt kam az kam 1 minute aage rakhein."
          },
          400
        );
      }

      const scheduled =
        await saveScheduledPush(
          env,
          {
            title: title,
            message: message,
            url: notificationTargetUrl,
            link_text: notificationButtonText,
            scheduled_at:
              scheduledDate.toISOString(),
            repeat_type:
              repeatType,
            wait_repeat:
              normalizeWaitRepeat(body.wait_repeat),
            timezone_offset_minutes:
              Number(body.timezone_offset_minutes || 0),
            status:
              saveAsDraft ? "draft" : "pending",
            links:
              editableLinks
          }
        );

      return jsonResponse(
        {
          success: true,
          event:
            saveAsDraft
              ? "notification_draft_saved"
              : "notification_scheduled",
          schedule_id:
            scheduled.id,
          scheduled_at:
            scheduled.scheduled_at,
          repeat_type:
            repeatType,
          wait_repeat:
            normalizeWaitRepeat(body.wait_repeat),
          status:
            saveAsDraft ? "draft" : "pending"
        },
        201
      );
    }
     
    /*
     * Existing Part 5 Broadcast function
     * ko andar hi andar istemal karenge.
     *
     * Admin key browser address bar mein
     * show nahi hogi.
     */

    const internalUrl =
      new URL(
        SITE_ORIGIN +
        "/api/push/broadcast"
      );

    internalUrl.searchParams.set(
      "key",
      adminKey
    );

    internalUrl.searchParams.set(
      "title",
      title
    );

    internalUrl.searchParams.set(
      "body",
      message
    );

    internalUrl.searchParams.set(
  "url",
  notificationTargetUrl
);

internalUrl.searchParams.set(
  "link_text",
  notificationButtonText
);
     
    const internalRequest =
      new Request(
        internalUrl.toString(),
        {
          method: "GET",
          headers:
            request.headers
        }
      );

    return handlePushBroadcast(
      internalRequest,
      env
    );
  }


  /*
   * ---------------------------------------------------------
   * Sirf GET se Admin Page khulega
   * ---------------------------------------------------------
   */
  if (request.method !== "GET") {
    return methodNotAllowed(
      "GET, POST"
    );
  }


  const html = `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1"
/>

<title>
Imdade Rohani Push Notification
</title>

<style>

*{
  box-sizing:border-box;
}

body{
  margin:0;
  padding:20px;
  min-height:100vh;
  background:
    linear-gradient(
      160deg,
      #001b4d,
      #003983,
      #061b44
    );
  font-family:
    Arial,
    sans-serif;
  color:#172033;
}

.admin-wrap{
  width:100%;
  max-width:650px;
  margin:auto;
}

.brand{
  text-align:center;
  color:#fff;
  margin-bottom:20px;
}

.logo{
  width:90px;
  height:90px;
  border-radius:50%;
  object-fit:cover;
  border:3px solid #dba62f;
  background:#fff;
  box-shadow:
    0 8px 25px
    rgba(0,0,0,.25);
}

.brand h1{
  margin:
    12px 0 5px;
  font-size:27px;
}

.brand p{
  margin:0;
  color:#dfeaff;
  font-size:14px;
}

.card{
  background:#fff;
  border-radius:24px;
  padding:22px;
  box-shadow:
    0 15px 45px
    rgba(0,0,0,.28);
}

.heading{
  text-align:center;
  color:#002087;
  font-size:23px;
  font-weight:800;
  margin-bottom:22px;
}

.field{
  margin-bottom:17px;
}

label{
  display:block;
  font-weight:700;
  margin-bottom:7px;
  color:#24324b;
}

input,
select,
textarea{
  width:100%;
  border:
    1px solid #ccd5e5;
  border-radius:12px;
  padding:13px 14px;
  font-size:15px;
  outline:none;
  background:#f9fbff;
}

input:focus,
select:focus,
textarea:focus{
  border-color:#002087;
  box-shadow:
    0 0 0 3px
    rgba(0,32,135,.10);
}

textarea{
  min-height:130px;
  resize:vertical;
}

.send-btn{
  width:100%;
  border:0;
  border-radius:14px;
  padding:15px;
  background:#002087;
  color:white;
  font-size:17px;
  font-weight:800;
  cursor:pointer;
  margin-top:5px;
}

.schedule-btn{
  width:100%;
  border:2px solid #d49a16;
  border-radius:14px;
  padding:15px;
  background:#fff8dc;
  color:#7a4b00;
  font-size:17px;
  font-weight:800;
  cursor:pointer;
  margin-top:12px;
}

.schedule-btn:disabled{
  opacity:.55;
  cursor:not-allowed;
}

.send-btn:disabled{
  opacity:.55;
  cursor:not-allowed;
}

.note{
  margin-top:15px;
  font-size:13px;
  color:#667085;
  text-align:center;
  line-height:1.7;
}

.result{
  display:none;
  margin-top:18px;
  padding:15px;
  border-radius:14px;
  font-size:14px;
  line-height:1.8;
  white-space:pre-wrap;
  word-break:break-word;
}

.result.success{
  display:block;
  background:#ecfdf3;
  border:
    1px solid #86efac;
  color:#166534;
}

.result.error{
  display:block;
  background:#fff1f2;
  border:
    1px solid #fda4af;
  color:#9f1239;
}

.counter{
  font-size:12px;
  color:#667085;
  margin-top:5px;
  text-align:left;
  direction:ltr;
}

.message-meta-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-top:5px;
}

.message-meta-row .counter{
  margin-top:0;
}

.draft-check-label{
  display:flex;
  align-items:center;
  gap:7px;
  margin:0;
  color:#0b318f;
  font-size:13px;
  font-weight:800;
  cursor:pointer;
}

.draft-check-label input{
  width:20px;
  height:20px;
  margin:0;
  accent-color:#0b5ed7;
}

.repeat-select{
  min-height:54px;
  font-weight:800;
  color:#153574;
  background:#f4f8ff;
  box-shadow:0 8px 20px rgba(0,32,135,.16);
}

.summary-btn{
  width:100%;
  border:2px solid #0b318f;
  border-radius:14px;
  padding:14px;
  margin-top:12px;
  background:#eef4ff;
  color:#0b318f;
  font-size:16px;
  font-weight:800;
  cursor:pointer;
}

.schedule-modal{
  display:none;
  position:fixed;
  inset:0;
  z-index:99999;
  padding:18px;
  background:rgba(0,15,45,.72);
  overflow:auto;
}

.schedule-modal.open{
  display:block;
}

.modal-card{
  width:100%;
  max-width:720px;
  margin:20px auto;
  padding:18px;
  border-radius:20px;
  background:#fff;
  box-shadow:0 20px 60px rgba(0,0,0,.35);
}

.modal-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-bottom:16px;
}

.modal-head h2{
  margin:0;
  color:#002087;
  font-size:21px;
}

.modal-close{
  border:0;
  border-radius:50%;
  width:40px;
  height:40px;
  background:#eef2f8;
  color:#172033;
  font-size:24px;
  cursor:pointer;
}

.schedule-item{
  margin:0 0 16px;
  padding:15px;
  border:1px solid #ccd5e5;
  border-radius:16px;
  background:#f9fbff;
}

.schedule-item-title{
  margin-bottom:12px;
  color:#002087;
  font-weight:800;
}

.item-actions{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:10px;
}

.item-update,
.item-delete,
.item-send,
.item-live{
  border:0;
  border-radius:12px;
  padding:12px;
  color:#fff;
  font-weight:800;
  cursor:pointer;
}

.edit-links-box{
  margin:12px 0;
  padding:12px;
  border:1px dashed #0b318f;
  border-radius:14px;
  background:#eef4ff;
}

.edit-link-row{
  margin-bottom:10px;
  padding:10px;
  border:1px solid #ccd5e5;
  border-radius:12px;
  background:#fff;
}

.edit-link-row input{
  margin-bottom:8px;
}

.edit-link-remove,
.edit-link-add{
  width:100%;
  border:0;
  border-radius:10px;
  padding:10px;
  font-weight:800;
  cursor:pointer;
}

.edit-link-remove{
  background:#b42318;
  color:#fff;
}

.edit-link-add{
  background:#0b318f;
  color:#fff;
}

.item-update{background:#166534;}
.item-delete{background:#b42318;}
.item-send{background:#0b318f;}
.item-live{
  width:100%;
  margin-top:10px;
  background:#15803d;
}

.empty-schedules{
  padding:25px 10px;
  text-align:center;
  color:#667085;
}

.schedule-summary-button{
  width:100%;
  min-height:64px;
  margin:0;
  padding:14px 18px;
  border:0;
  border-radius:14px;
  color:#fff;
  font-size:17px;
  font-weight:800;
  cursor:pointer;
  box-shadow:0 8px 20px rgba(0,0,0,.16);
}

.schedule-summary-row{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  gap:9px;
  margin:0 0 12px;
}

.schedule-copy-button{
  min-width:76px;
  border:2px solid #0b318f;
  border-radius:14px;
  padding:10px;
  background:#fff;
  color:#0b318f;
  font-size:14px;
  font-weight:900;
  cursor:pointer;
  box-shadow:0 8px 20px rgba(0,0,0,.12);
}

.schedule-copy-button:disabled{
  opacity:.55;
  cursor:not-allowed;
}

.schedule-summary-button.pending,
.schedule-summary-button.processing{
  background:#15803d;
}

.schedule-summary-button.failed{
  background:#c5221f;
}

.schedule-summary-button.sent{
  background:#7b8494;
}

.schedule-summary-button.draft{
  background:#0b5ed7;
}

</style>

</head>

<body>

<div class="admin-wrap">

  <div class="brand">

    <img
      class="logo"
      src="${LOGO_URL}"
      alt="Imdade Rohani"
    />

    <h1>
      Imdade Rohani
    </h1>

    <p>
      Push Notification Admin Panel
    </p>

  </div>


  <div class="card">

    <div class="heading">
      🔔 Notification Bhejein
    </div>


    <div class="field">

      <label>
        🔐 Admin Key
      </label>

      <input
        id="adminKey"
        type="password"
        autocomplete="off"
        placeholder="Apni PWA Admin Key likhein"
      />

    </div>


    <div class="field">

      <label>
        📝 Notification Title
      </label>

      <input
        id="pushTitle"
        maxlength="120"
        value="Imdade Rohani"
        placeholder="Notification ka title"
      />

    </div>


    <div class="field">

      <label>
        💬 Message
      </label>

      <textarea
        id="pushMessage"
        maxlength="500"
        placeholder="Yahan notification message likhein"
      ></textarea>

      <div class="message-meta-row">
        <div
          class="counter"
          id="counter"
        >
          0 / 500
        </div>

        <label class="draft-check-label">
          <input
            id="saveAsDraft"
            type="checkbox"
          />
          Save Draft
        </label>
      </div>

    </div>

<!-- =========================================
     DYNAMIC NOTIFICATION LINKS
     ========================================= -->

<div id="pushLinksContainer"></div>

<button
  type="button"
  id="addPushLinkButton"
  style="
    width:100%;
    padding:15px 18px;
    margin:8px 0 18px 0;
    border:2px dashed #0b318f;
    border-radius:16px;
    background:#eef4ff;
    color:#0b318f;
    font-size:18px;
    font-weight:800;
    cursor:pointer;
  "
>
  ➕ ADD LINK
</button>

    <button
      class="send-btn"
      id="sendButton"
      type="button"
    >
      📢 SAB USERS KO NOTIFICATION BHEJEIN
    </button>

    <div class="field" style="margin-top:20px;">
      <label for="scheduleDateTime">
        📅 Notification ki Date aur Time
      </label>

      <input
        id="scheduleDateTime"
        type="datetime-local"
      />
    </div>

    <div class="field">
      <label for="repeatType">
        🔁 Repeat
      </label>

      <select
        class="repeat-select"
        id="repeatType"
      >
        <option value="no_repeat">No Repeat</option>
        <option value="hourly">Hourly</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
        <option value="weekdays">Weekdays</option>
        <option value="weekend">Weekend</option>
      </select>
    </div>

    <div class="field">
      <label for="waitRepeat">
        ⏳ Wait Repeat
      </label>

      <select
        class="repeat-select"
        id="waitRepeat"
      >
        <option value="0">Normal — Koi Wait Nahi</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="custom">Custom</option>
      </select>

      <input
        id="waitRepeatCustom"
        type="number"
        min="0"
        max="10000"
        inputmode="numeric"
        placeholder="Apni marzi ka number likhein"
        style="display:none;margin-top:10px;"
      />
    </div>

    <button
      class="summary-btn"
      id="summaryButton"
      type="button"
    >
      📋 SUMMARY DEKHEIN
    </button>

    <button
      class="schedule-btn"
      id="scheduleButton"
      type="button"
    >
      📅 DATE AUR TIME PAR SET KAREIN
    </button>


    <div
      id="result"
      class="result"
    ></div>


    <div class="note">

      Notification sirf un users ko bheji jayegi
      jinhone notification Allow ki hui hai.

    </div>

  </div>

</div>

<div
  class="schedule-modal"
  id="scheduleModal"
>
  <div class="modal-card">
    <div class="modal-head">
      <h2 id="modalTitle">📋 Scheduled Notifications</h2>
      <button
        class="modal-close"
        id="modalClose"
        type="button"
        aria-label="Close"
      >×</button>
    </div>

    <div id="scheduleList">
      <div class="empty-schedules">
        Schedule list load ho rahi hai...
      </div>
    </div>
  </div>
</div>


<script>

(function(){

  var adminKey =
    document.getElementById(
      "adminKey"
    );

  var pushTitle =
    document.getElementById(
      "pushTitle"
    );

  var pushMessage =
    document.getElementById(
      "pushMessage"
    );

  var pushLinksContainer =
  document.getElementById(
    "pushLinksContainer"
  );

var addPushLinkButton =
  document.getElementById(
    "addPushLinkButton"
  );

var pushLinkCount = 0;

  var sendButton =
    document.getElementById(
      "sendButton"
    );

  var scheduleButton =
    document.getElementById(
      "scheduleButton"
    );

  var scheduleDateTime =
    document.getElementById(
      "scheduleDateTime"
    );

  var repeatType =
    document.getElementById(
      "repeatType"
    );

  var waitRepeat =
    document.getElementById(
      "waitRepeat"
    );

  var waitRepeatCustom =
    document.getElementById(
      "waitRepeatCustom"
    );

  var summaryButton =
    document.getElementById(
      "summaryButton"
    );

  var scheduleModal =
    document.getElementById(
      "scheduleModal"
    );

  var modalClose =
    document.getElementById(
      "modalClose"
    );

  var modalTitle =
    document.getElementById(
      "modalTitle"
    );

  var scheduleList =
    document.getElementById(
      "scheduleList"
    );

  var resultBox =
    document.getElementById(
      "result"
    );

  var counter =
    document.getElementById(
      "counter"
    );

  function syncMainWaitRepeat() {
    var disabled =
      repeatType.value === "no_repeat";

    waitRepeat.disabled = disabled;
    waitRepeatCustom.disabled = disabled;
    waitRepeatCustom.style.display =
      !disabled && waitRepeat.value === "custom"
        ? "block"
        : "none";
  }

  function getMainWaitRepeat() {
    if (repeatType.value === "no_repeat") {
      return 0;
    }

    if (waitRepeat.value === "custom") {
      return Math.max(
        0,
        Math.floor(
          Number(waitRepeatCustom.value || 0)
        )
      );
    }

    return Math.max(
      0,
      Math.floor(Number(waitRepeat.value || 0))
    );
  }

  repeatType.addEventListener(
    "change",
    syncMainWaitRepeat
  );

  waitRepeat.addEventListener(
    "change",
    syncMainWaitRepeat
  );

  syncMainWaitRepeat();

  var saveAsDraft =
    document.getElementById(
      "saveAsDraft"
    );

  var minimumScheduleDate =
    new Date(Date.now() + 60000);

  minimumScheduleDate.setSeconds(0, 0);

  var localScheduleMinimum =
    new Date(
      minimumScheduleDate.getTime() -
      minimumScheduleDate.getTimezoneOffset() *
      60000
    );

  scheduleDateTime.min =
    localScheduleMinimum
      .toISOString()
      .slice(0, 16);

  function toLocalInputValue(isoValue) {
    var date = new Date(isoValue);

    if (!Number.isFinite(date.getTime())) {
      return "";
    }

    var localDate =
      new Date(
        date.getTime() -
        date.getTimezoneOffset() * 60000
      );

    return localDate
      .toISOString()
      .slice(0, 16);
  }

  function makeField(
    labelText,
    element
  ) {
    var wrapper =
      document.createElement("div");
    wrapper.className = "field";

    var label =
      document.createElement("label");
    label.textContent = labelText;

    wrapper.appendChild(label);
    wrapper.appendChild(element);
    return wrapper;
  }

  function makeRepeatSelect(value) {
    var select =
      document.createElement("select");
    select.className = "item-repeat";

    var repeatOptions = [
      ["no_repeat", "No Repeat"],
      ["hourly", "Hourly"],
      ["daily", "Daily"],
      ["weekly", "Weekly"],
      ["monthly", "Monthly"],
      ["yearly", "Yearly"],
      ["weekdays", "Weekdays"],
      ["weekend", "Weekend"]
    ];

    repeatOptions.forEach(
      function(optionData){
        var option =
          document.createElement("option");
        option.value = optionData[0];
        option.textContent = optionData[1];
        select.appendChild(option);
      }
    );

    select.value = value || "no_repeat";
    return select;
  }

  function makeWaitRepeatControl(value) {
    var numericValue =
      Math.max(
        0,
        Math.floor(Number(value || 0))
      );

    var wrapper =
      document.createElement("div");

    var select =
      document.createElement("select");
    select.className = "repeat-select item-wait-repeat";

    var options = [
      ["0", "Normal — Koi Wait Nahi"],
      ["1", "1"], ["2", "2"],
      ["3", "3"], ["4", "4"],
      ["5", "5"], ["6", "6"],
      ["7", "7"], ["8", "8"],
      ["9", "9"], ["10", "10"],
      ["custom", "Custom"]
    ];

    options.forEach(function(optionData){
      var option =
        document.createElement("option");
      option.value = optionData[0];
      option.textContent = optionData[1];
      select.appendChild(option);
    });

    var customInput =
      document.createElement("input");
    customInput.type = "number";
    customInput.min = "0";
    customInput.max = "10000";
    customInput.inputMode = "numeric";
    customInput.placeholder =
      "Apni marzi ka number likhein";
    customInput.style.marginTop = "10px";

    if (numericValue >= 1 && numericValue <= 10) {
      select.value = String(numericValue);
      customInput.style.display = "none";
    } else if (numericValue > 10) {
      select.value = "custom";
      customInput.value = String(numericValue);
      customInput.style.display = "block";
    } else {
      select.value = "0";
      customInput.style.display = "none";
    }

    select.addEventListener("change", function(){
      customInput.style.display =
        select.value === "custom"
          ? "block"
          : "none";
    });

    wrapper.appendChild(select);
    wrapper.appendChild(customInput);

    return {
      wrapper: wrapper,
      select: select,
      input: customInput,
      getValue: function(){
        if (select.value === "custom") {
          return Math.max(
            0,
            Math.floor(Number(customInput.value || 0))
          );
        }
        return Math.max(
          0,
          Math.floor(Number(select.value || 0))
        );
      }
    };
  }

  async function adminScheduleRequest(payload) {
    var response =
      await fetch(
        "/api/push/admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

    var data =
      await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error ||
        data.message ||
        "Schedule request failed."
      );
    }

    return data;
  }

  function renderScheduleEditor(schedules) {
    scheduleList.innerHTML = "";

    if (!schedules.length) {
      var empty =
        document.createElement("div");
      empty.className = "empty-schedules";
      empty.textContent =
        "Koi scheduled notification mojood nahi hai.";
      scheduleList.appendChild(empty);
      return;
    }

    schedules.forEach(
      function(schedule){
        var item =
          document.createElement("div");
        item.className = "schedule-item";

        var heading =
          document.createElement("div");
        heading.className =
          "schedule-item-title";
        heading.textContent =
          "Schedule #" +
          String(schedule.id) +
          " — " +
          String(schedule.status || "pending");
        item.appendChild(heading);

        var titleInput =
          document.createElement("input");
        titleInput.className = "item-title";
        titleInput.maxLength = 120;
        titleInput.value = schedule.title || "";
        item.appendChild(
          makeField("📝 Title", titleInput)
        );

        var messageInput =
          document.createElement("textarea");
        messageInput.className = "item-message";
        messageInput.maxLength = 500;
        messageInput.value = schedule.message || "";
        item.appendChild(
          makeField("💬 Message", messageInput)
        );

        var linksBox =
          document.createElement("div");
        linksBox.className = "edit-links-box";

        var linksHeading =
          document.createElement("div");
        linksHeading.className = "schedule-item-title";
        linksHeading.textContent = "🔗 Notification Links";
        linksBox.appendChild(linksHeading);

        var editLinksContainer =
          document.createElement("div");
        linksBox.appendChild(editLinksContainer);

        var initialLinks = [];

        try {
          initialLinks = JSON.parse(
            schedule.link_data || "[]"
          );
        } catch(error) {
          initialLinks = [];
        }

        if (
          !Array.isArray(initialLinks) ||
          !initialLinks.length
        ) {
          initialLinks = [];
          if (
            schedule.target_url &&
            schedule.link_text
          ) {
            initialLinks.push({
              url: schedule.target_url,
              text: schedule.link_text
            });
          }
        }

        function addEditorLink(linkData) {
          if (
            editLinksContainer.children.length >= 3
          ) {
            window.alert("Maximum 3 links add kiye ja sakte hain.");
            return;
          }

          var row =
            document.createElement("div");
          row.className = "edit-link-row";

          var urlInput =
            document.createElement("input");
          urlInput.type = "url";
          urlInput.className = "edit-link-url";
          urlInput.placeholder = "Link URL yahan likhein";
          urlInput.value =
            linkData && linkData.url
              ? linkData.url
              : "";

          var textInput =
            document.createElement("input");
          textInput.type = "text";
          textInput.maxLength = 40;
          textInput.className = "edit-link-text";
          textInput.placeholder = "Button ka naam likhein";
          textInput.value =
            linkData && linkData.text
              ? linkData.text
              : "";

          var removeButton =
            document.createElement("button");
          removeButton.type = "button";
          removeButton.className = "edit-link-remove";
          removeButton.textContent = "🗑 LINK DELETE";
          removeButton.addEventListener(
            "click",
            function(){
              row.remove();
            }
          );

          row.appendChild(urlInput);
          row.appendChild(textInput);
          row.appendChild(removeButton);
          editLinksContainer.appendChild(row);
        }

        function collectEditorLinks() {
          var links = [];
          var rows =
            editLinksContainer.querySelectorAll(
              ".edit-link-row"
            );

          rows.forEach(function(row){
            var urlValue =
              row.querySelector(".edit-link-url").value.trim();
            var textValue =
              row.querySelector(".edit-link-text").value.trim();

            if (urlValue && textValue) {
              links.push({
                url: urlValue,
                text: textValue
              });
            }
          });

          return links;
        }

        initialLinks.slice(0, 3).forEach(
          function(link){
            addEditorLink(link);
          }
        );

        var addEditorLinkButton =
          document.createElement("button");
        addEditorLinkButton.type = "button";
        addEditorLinkButton.className = "edit-link-add";
        addEditorLinkButton.textContent = "➕ ADD LINK";
        addEditorLinkButton.addEventListener(
          "click",
          function(){
            addEditorLink({});
          }
        );
        linksBox.appendChild(addEditorLinkButton);
        item.appendChild(linksBox);

        var dateInput =
          document.createElement("input");
        dateInput.type = "datetime-local";
        dateInput.className = "item-date";
        dateInput.value =
          toLocalInputValue(
            schedule.scheduled_at
          );
        item.appendChild(
          makeField(
            "📅 Next Date aur Time",
            dateInput
          )
        );

        var itemRepeat =
          makeRepeatSelect(
            schedule.repeat_type
          );
        item.appendChild(
          makeField("🔁 Repeat", itemRepeat)
        );

        var itemWaitRepeat =
          makeWaitRepeatControl(
            schedule.wait_repeat
          );
        item.appendChild(
          makeField(
            "⏳ Wait Repeat",
            itemWaitRepeat.wrapper
          )
        );

        function syncItemWaitRepeat() {
          var disabled =
            itemRepeat.value === "no_repeat";
          itemWaitRepeat.select.disabled = disabled;
          itemWaitRepeat.input.disabled = disabled;
        }

        itemRepeat.addEventListener(
          "change",
          syncItemWaitRepeat
        );
        syncItemWaitRepeat();

        var actions =
          document.createElement("div");
        actions.className = "item-actions";

        var updateButton =
          document.createElement("button");
        updateButton.type = "button";
        updateButton.className = "item-update";
        updateButton.textContent = "✅ UPDATE";

        var deleteButton =
          document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "item-delete";
        deleteButton.textContent = "🗑 DELETE";

        var sendButtonNow =
          document.createElement("button");
        sendButtonNow.type = "button";
        sendButtonNow.className = "item-send";
        sendButtonNow.textContent = "📤 SEND";

        updateButton.addEventListener(
          "click",
          async function(){
            var selected =
              new Date(dateInput.value);

            if (
              !dateInput.value ||
              !Number.isFinite(selected.getTime()) ||
              (
                schedule.status !== "draft" &&
                selected.getTime() <= Date.now() + 15000
              )
            ) {
              window.alert(
                "Nayi date aur time future mein select karein."
              );
              return;
            }

            updateButton.disabled = true;
            updateButton.textContent =
              "Updating...";

            try {
              await adminScheduleRequest({
                action: "update_schedule",
                key: adminKey.value.trim(),
                schedule_id: schedule.id,
                title: titleInput.value.trim(),
                message: messageInput.value.trim(),
                schedule_at:
                  selected.toISOString(),
                repeat_type:
                  itemRepeat.value,
                wait_repeat:
                  itemWaitRepeat.getValue(),
                timezone_offset_minutes:
                  new Date().getTimezoneOffset(),
                save_as_draft:
                  schedule.status === "draft",
                links:
                  collectEditorLinks()
              });

              window.alert(
                "Schedule successfully update ho gaya."
              );
              await loadSchedules();
            } catch(error) {
              window.alert(
                error && error.message
                  ? error.message
                  : String(error)
              );
            } finally {
              updateButton.disabled = false;
              updateButton.textContent =
                "✅ UPDATE";
            }
          }
        );

        deleteButton.addEventListener(
          "click",
          async function(){
            if (
              !window.confirm(
                "Kya aap Schedule #" +
                String(schedule.id) +
                " delete karna chahte hain?"
              )
            ) {
              return;
            }

            deleteButton.disabled = true;

            try {
              await adminScheduleRequest({
                action: "delete_schedule",
                key: adminKey.value.trim(),
                schedule_id: schedule.id
              });
              await loadSchedules();
            } catch(error) {
              window.alert(
                error && error.message
                  ? error.message
                  : String(error)
              );
              deleteButton.disabled = false;
            }
          }
        );

        sendButtonNow.addEventListener(
          "click",
          async function(){
            if (!window.confirm("Kya aap ye notification abhi send karna chahte hain?")) {
              return;
            }

            sendButtonNow.disabled = true;
            sendButtonNow.textContent = "Sending...";

            try {
              await adminScheduleRequest({
                action: "send_schedule_now",
                key: adminKey.value.trim(),
                schedule_id: schedule.id,
                title: titleInput.value.trim(),
                message: messageInput.value.trim()
                ,links: collectEditorLinks()
              });
              window.alert("Notification abhi successfully send ho gayi.");
              await loadSchedules();
            } catch(error) {
              window.alert(
                error && error.message
                  ? error.message
                  : String(error)
              );
            } finally {
              sendButtonNow.disabled = false;
              sendButtonNow.textContent = "📤 SEND";
            }
          }
        );

        actions.appendChild(deleteButton);
        actions.appendChild(updateButton);
        actions.appendChild(sendButtonNow);
        item.appendChild(actions);

        if (schedule.status === "draft") {
          var liveButton =
            document.createElement("button");
          liveButton.type = "button";
          liveButton.className = "item-live";
          liveButton.textContent = "🔴 LIVE";

          liveButton.addEventListener(
            "click",
            async function(){
              var selected = new Date(dateInput.value);

              if (
                !dateInput.value ||
                !Number.isFinite(selected.getTime()) ||
                selected.getTime() <= Date.now() + 15000
              ) {
                window.alert("Live karne ke liye future date aur time select karein.");
                return;
              }

              liveButton.disabled = true;
              liveButton.textContent = "Going Live...";

              try {
                await adminScheduleRequest({
                  action: "update_schedule",
                  key: adminKey.value.trim(),
                  schedule_id: schedule.id,
                  title: titleInput.value.trim(),
                  message: messageInput.value.trim(),
                  schedule_at: selected.toISOString(),
                  repeat_type: itemRepeat.value,
                  wait_repeat:
                    itemWaitRepeat.getValue(),
                  timezone_offset_minutes:
                    new Date().getTimezoneOffset(),
                  save_as_draft: false
                  ,links: collectEditorLinks()
                });
                window.alert("Draft Live ho gaya; notification muqarrarah waqt par send hogi.");
                await loadSchedules();
              } catch(error) {
                window.alert(
                  error && error.message
                    ? error.message
                    : String(error)
                );
              } finally {
                liveButton.disabled = false;
                liveButton.textContent = "🔴 LIVE";
              }
            }
          );

          item.appendChild(liveButton);
        }
        scheduleList.appendChild(item);
      }
    );
  }

  function renderScheduleList(schedules) {
    scheduleList.innerHTML = "";

    modalTitle.textContent =
      "📋 Scheduled Notifications";

    if (!schedules.length) {
      var empty =
        document.createElement("div");
      empty.className = "empty-schedules";
      empty.textContent =
        "Koi scheduled notification mojood nahi hai.";
      scheduleList.appendChild(empty);
      return;
    }

    schedules.forEach(
      function(schedule){
        var summaryRow =
          document.createElement("div");
        summaryRow.className =
          "schedule-summary-row";

        var editButton =
          document.createElement("button");

        var copyButton =
          document.createElement("button");

        var status =
          String(schedule.status || "pending")
            .toLowerCase();

        if (
          status !== "pending" &&
          status !== "processing" &&
          status !== "failed" &&
          status !== "sent" &&
          status !== "draft"
        ) {
          status = "pending";
        }

        editButton.type = "button";
        editButton.className =
          "schedule-summary-button " +
          status;
        editButton.textContent =
          status === "draft"
            ? "📝 EDIT DRAFT"
            : "✏️ EDIT NOTIFICATION";
        editButton.setAttribute(
          "aria-label",
          "Edit Schedule " +
          String(schedule.id) +
          " " + status
        );

        editButton.addEventListener(
          "click",
          function(){
            modalTitle.textContent =
              status === "draft"
                ? "📝 Edit Draft"
                : "✏️ Edit Notification";
            renderScheduleEditor([schedule]);
          }
        );

        copyButton.type = "button";
        copyButton.className =
          "schedule-copy-button";
        copyButton.textContent = "COPY";
        copyButton.setAttribute(
          "aria-label",
          "Copy Schedule " +
          String(schedule.id)
        );

        copyButton.addEventListener(
          "click",
          async function(){
            if (
              !window.confirm(
                "Kya aap is notification ki mukammal copy Draft mein banana chahte hain?"
              )
            ) {
              return;
            }

            copyButton.disabled = true;
            copyButton.textContent = "...";

            try {
              var copied =
                await adminScheduleRequest({
                  action: "copy_schedule",
                  key: adminKey.value.trim(),
                  schedule_id: schedule.id
                });

              window.alert(
                "Notification ki copy EDIT DRAFT ke roop mein ban gayi. Draft ID: " +
                String(copied.schedule_id || "-")
              );
              await loadSchedules();
            } catch(error) {
              window.alert(
                error && error.message
                  ? error.message
                  : String(error)
              );
            } finally {
              copyButton.disabled = false;
              copyButton.textContent = "COPY";
            }
          }
        );

        summaryRow.appendChild(editButton);
        summaryRow.appendChild(copyButton);
        scheduleList.appendChild(summaryRow);
      }
    );
  }

  async function loadSchedules() {
    var key =
      adminKey.value.trim();

    if (!key) {
      scheduleModal.classList.remove("open");
      showResult(
        "error",
        "Summary dekhne ke liye pehle Admin Key likhein."
      );
      return;
    }

    scheduleList.innerHTML =
      '<div class="empty-schedules">Schedule list load ho rahi hai...</div>';

    try {
      var data =
        await adminScheduleRequest({
          action: "list_schedules",
          key: key
        });

      renderScheduleList(
        Array.isArray(data.schedules)
          ? data.schedules
          : []
      );
    } catch(error) {
      scheduleList.innerHTML = "";
      var failed =
        document.createElement("div");
      failed.className = "empty-schedules";
      failed.textContent =
        error && error.message
          ? error.message
          : String(error);
      scheduleList.appendChild(failed);
    }
  }

  summaryButton.addEventListener(
    "click",
    function(){
      scheduleModal.classList.add("open");
      loadSchedules();
    }
  );

  modalClose.addEventListener(
    "click",
    function(){
      scheduleModal.classList.remove("open");
    }
  );

  scheduleModal.addEventListener(
    "click",
    function(event){
      if (event.target === scheduleModal) {
        scheduleModal.classList.remove("open");
      }
    }
  );


  pushMessage.addEventListener(
    "input",
    function(){

      counter.textContent =
        String(
          pushMessage.value.length
        ) +
        " / 500";

    }
  );

/* =========================================
   DYNAMIC ADD LINK BUTTON
   Maximum 3 links
   ========================================= */

addPushLinkButton.addEventListener(
  "click",
  function(){

    if (pushLinkCount >= 3) {
      showResult(
        "error",
        "Maximum 3 links hi add kiye ja sakte hain."
      );
      return;
    }

    pushLinkCount++;

    var linkNumber =
      pushLinkCount;

    var linkBox =
      document.createElement("div");

    linkBox.className =
      "dynamic-link-box";

    linkBox.style.cssText =
      "margin:0 0 18px 0;" +
      "padding:16px;" +
      "border:1px solid #ccd5e5;" +
      "border-radius:16px;" +
      "background:#f9fbff;";

    linkBox.innerHTML =
      '<div class="field">' +
        '<label>🔗 Notification Click Link ' +
        linkNumber +
        '</label>' +

        '<input ' +
          'type="url" ' +
          'class="dynamic-push-url" ' +
          'placeholder="Link yahan likhein" ' +
        '/>' +
      '</div>' +

      '<div class="field">' +
        '<label>🔘 Link Text ' +
        linkNumber +
        '</label>' +

        '<input ' +
          'type="text" ' +
          'maxlength="40" ' +
          'class="dynamic-push-link-text" ' +
          'placeholder="Misal: Abhi Dekhein" ' +
        '/>' +
      '</div>';

    pushLinksContainer.appendChild(
      linkBox
    );

    if (pushLinkCount >= 3) {
      addPushLinkButton.disabled =
        true;

      addPushLinkButton.textContent =
        "Maximum 3 Links Add Ho Chuke";
    }

  }
);

  function showResult(
    type,
    text
  ) {

    resultBox.className =
      "result " + type;

    resultBox.textContent =
      text;

  }


  async function submitNotification(
    scheduleMode
  ) {

      var draftMode =
        Boolean(saveAsDraft.checked);

      var key =
        adminKey.value.trim();

      var title =
        pushTitle.value.trim();

      var message =
        pushMessage.value.trim();

      var url = "";
var linkText = "";

var url2 = "";
var linkText2 = "";

var url3 = "";
var linkText3 = "";

var urlFields =
  pushLinksContainer.querySelectorAll(
    ".dynamic-push-url"
  );

var textFields =
  pushLinksContainer.querySelectorAll(
    ".dynamic-push-link-text"
  );

if (urlFields.length >= 1) {
  url =
    urlFields[0].value.trim();

  linkText =
    textFields[0].value.trim();
}

if (urlFields.length >= 2) {
  url2 =
    urlFields[1].value.trim();

  linkText2 =
    textFields[1].value.trim();
}

if (urlFields.length >= 3) {
  url3 =
    urlFields[2].value.trim();

  linkText3 =
    textFields[2].value.trim();
}

      if (!key) {

        showResult(
          "error",
          "Admin Key likhna zaroori hai."
        );

        return;
      }

      if (!title) {

        showResult(
          "error",
          "Notification Title likhein."
        );

        return;
      }


      if (!message) {

        showResult(
          "error",
          "Notification Message likhein."
        );

        return;
      }

      var scheduleAt = "";

      if (scheduleMode && !draftMode) {
        if (!scheduleDateTime.value) {
          showResult(
            "error",
            "Calendar se notification ki date aur time select karein."
          );
          return;
        }

        var selectedDate =
          new Date(
            scheduleDateTime.value
          );

        if (
          !Number.isFinite(
            selectedDate.getTime()
          ) ||
          selectedDate.getTime() <=
            Date.now() + 15000
        ) {
          showResult(
            "error",
            "Date aur time kam az kam 1 minute aage select karein."
          );
          return;
        }

        scheduleAt =
          selectedDate.toISOString();
      }

      if (
        draftMode &&
        scheduleDateTime.value
      ) {
        var draftSelectedDate =
          new Date(scheduleDateTime.value);

        if (
          !Number.isFinite(
            draftSelectedDate.getTime()
          )
        ) {
          showResult(
            "error",
            "Draft ki date aur time durust select karein."
          );
          return;
        }

        scheduleAt =
          draftSelectedDate.toISOString();
      }

      var confirmed =
        window.confirm(
          draftMode
            ? "Kya aap ye notification sirf Draft mein save karna chahte hain? Ye abhi send nahi hogi."
            : scheduleMode
              ? "Kya aap ye notification chuni hui date aur time par set karna chahte hain?"
              : "Kya aap ye notification sab active users ko abhi bhejna chahte hain?"
        );


      if (!confirmed) {
        return;
      }


      var activeButton =
        scheduleMode
          ? scheduleButton
          : sendButton;

      activeButton.disabled =
        true;

      activeButton.textContent =
        draftMode
          ? "Draft save ho raha hai..."
          : scheduleMode
            ? "Notification set ho rahi hai..."
            : "Notification bheji ja rahi hai...";

      resultBox.className =
        "result";


      try {

        var response =
          await fetch(
            "/api/push/admin",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({
                  key:
                    key,

                  title:
                    title,

                  message:
                    message,
 url:
  url,

link_text:
  linkText,

url2:
  url2,

link_text2:
  linkText2,

url3:
  url3,

link_text3:
  linkText3,

schedule_at:
  scheduleAt,

repeat_type:
  repeatType.value,

wait_repeat:
  getMainWaitRepeat(),

timezone_offset_minutes:
  new Date().getTimezoneOffset(),

save_as_draft:
  draftMode
                })
            }
          );


        var data =
          await response.json();


        if (
          response.ok &&
          data.success
        ) {

          if (
            data.event ===
              "notification_draft_saved"
          ) {
            showResult(
              "success",
              "✅ Draft successfully save ho gaya. Ye notification kahin send nahi hui.\\n\\n" +
              "Draft ID: " +
              String(data.schedule_id || "-")
            );

            saveAsDraft.checked = false;
            scheduleDateTime.value = "";
          } else if (
            data.event ===
              "notification_scheduled"
          ) {
            showResult(
              "success",
              "✅ Notification calendar mein successfully set ho gayi.\\n\\n" +
              "Schedule ID: " +
              String(data.schedule_id || "-") +
              "\\nDate/Time: " +
              new Date(
                data.scheduled_at
              ).toLocaleString() +
              "\\nRepeat: " +
              String(data.repeat_type || "no_repeat") +
              "\\nWait Repeat: " +
              String(data.wait_repeat || 0)
            );

            scheduleDateTime.value = "";
          } else {
            showResult(
              "success",

              "✅ Notification successfully bhej di gayi.\\n\\n" +

              "Kul Active Tokens: " +
              String(
                data.total_active_tokens || 0
              ) +

              "\\nSuccessfully Sent: " +
              String(
                data.successfully_sent || 0
              ) +

              "\\nFailed: " +
              String(
                data.failed || 0
              ) +

              "\\nInvalid Tokens Band: " +
              String(
                data.invalid_tokens_deactivated || 0
              )
            );
          }


          pushMessage.value =
            "";

          counter.textContent =
            "0 / 500";


        } else {

          showResult(
            "error",

            "❌ Notification nahi bheji gayi.\\n\\n" +
            (
              data.error ||
              data.message ||
              "Unknown error"
            )
          );

        }


      } catch(error) {

        showResult(
          "error",

          "❌ Network/Error:\\n" +
          (
            error &&
            error.message
              ? error.message
              : String(error)
          )
        );

      } finally {

        activeButton.disabled =
          false;

        activeButton.textContent =
          scheduleMode
            ? "📅 DATE AUR TIME PAR SET KAREIN"
            : "📢 SAB USERS KO NOTIFICATION BHEJEIN";

      }

    }

  sendButton.addEventListener(
    "click",
    function(){
      submitNotification(false);
    }
  );

  scheduleButton.addEventListener(
    "click",
    function(){
      submitNotification(true);
    }
  );

})();

</script>

</body>
</html>`;


  return new Response(
    html,
    {
      status: 200,

      headers: {

        "Content-Type":
          "text/html; charset=UTF-8",

        "Cache-Control":
          "no-store, no-cache, must-revalidate",

        "X-Content-Type-Options":
          "nosniff",

        "X-Frame-Options":
          "DENY"

      }
    }
  );

}

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 6 END
   ========================================================= */

/* =========================================================
   PUSH NOTIFICATION MULTI LINK CHOICE PAGE
   ========================================================= */

/* =========================================================
   UNIQUE NOTIFICATION OPTION PAGE
   D1 LOAD + 3 MINUTE EXPIRY CHECK
   ========================================================= */

async function handleNotificationOptionPage(
  request,
  env
) {

  if (!env || !env.DB) {
    return databaseMissingResponse();
  }

  const pageUrl =
    new URL(request.url);

  const slug =
    cleanText(
      pageUrl.pathname.replace(/^\/+/, "")
    );

  if (
    !slug ||
    !slug.startsWith("option-")
  ) {
    return new Response(
      "Invalid notification option link.",
      {
        status: 404,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8",
          "Cache-Control":
            "no-store, no-cache, must-revalidate"
        }
      }
    );
  }

  const row =
    await env.DB.prepare(
      `
      SELECT
        slug,
        url1,
        text1,
        url2,
        text2,
        url3,
        text3,
        created_at,
        expires_at
      FROM notification_option_pages
      WHERE slug = ?
      LIMIT 1
      `
    )
    .bind(slug)
    .first();

    /*
    ========================================================
    DEVICE-WISE 3 MINUTE ACCESS
    Har browser/device ka apna alag timer.
    ========================================================
  */

  if (!row) {
    return new Response(
      "Notification option page nahi mili.",
      {
        status: 404,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8",

          "Cache-Control":
            "no-store, no-cache, must-revalidate"
        }
      }
    );
  }

  const cookieText =
    request.headers.get("Cookie") || "";

  const viewerMatch =
    cookieText.match(
      /(?:^|;\s*)ir_option_viewer=([A-Za-z0-9_-]{20,100})/
    );

  let viewerId =
    viewerMatch
      ? viewerMatch[1]
      : "";

  let viewerCookieToSet = "";

  /*
    Is browser/mobile ko pehli baar
    ek permanent viewer ID dena.
  */
  if (!viewerId) {

    viewerId =
      crypto.randomUUID()
        .replace(/-/g, "");

    viewerCookieToSet =
      "ir_option_viewer=" +
      viewerId +
      "; Path=/" +
      "; Max-Age=315360000" +
      "; SameSite=Lax" +
      "; Secure" +
      "; HttpOnly";
  }

  /*
    Dekhein is SLUG ko isi viewer ne
    pehle kab khola tha.
  */
  let accessRow =
    await env.DB.prepare(
      `
      SELECT
        first_opened_at,
        expires_at
      FROM notification_option_device_access
      WHERE slug = ?
        AND viewer_id = ?
      LIMIT 1
      `
    )
    .bind(
      slug,
      viewerId
    )
    .first();

  /*
    Pehli baar khola hai:
    ABHI se 3 minute shuru.
  */
  if (!accessRow) {

    const firstOpenedAt =
      new Date().toISOString();

    const deviceExpiresAt =
      new Date(
        Date.now() +
        3 * 60 * 1000
      ).toISOString();

    /*
      INSERT OR IGNORE:
      ek hi waqt double request aaye
      tab bhi duplicate timer nahi banega.
    */
    await env.DB.prepare(
      `
      INSERT OR IGNORE INTO
      notification_option_device_access
      (
        slug,
        viewer_id,
        first_opened_at,
        expires_at
      )
      VALUES (?, ?, ?, ?)
      `
    )
    .bind(
      slug,
      viewerId,
      firstOpenedAt,
      deviceExpiresAt
    )
    .run();

    accessRow =
      await env.DB.prepare(
        `
        SELECT
          first_opened_at,
          expires_at
        FROM notification_option_device_access
        WHERE slug = ?
          AND viewer_id = ?
        LIMIT 1
        `
      )
      .bind(
        slug,
        viewerId
      )
      .first();
  }

  const expired =
    !accessRow ||
    !accessRow.expires_at ||
    Date.now() >=
      Date.parse(
        accessRow.expires_at
      );

  if (expired) {

    const expiredHtml = `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
<meta charset="UTF-8">
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
/>
<title>Link Expired</title>

<style>
*{
  box-sizing:border-box;
}

body{
  margin:0;
  min-height:100vh;
  padding:20px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:
    linear-gradient(
      160deg,
      #001b4d,
      #003983,
      #061b44
    );
  font-family:Arial,sans-serif;
}

.card{
  width:100%;
  max-width:430px;
  background:#fff;
  border-radius:24px;
  padding:32px 22px;
  text-align:center;
  box-shadow:
    0 18px 50px rgba(0,0,0,.30);
}

.icon{
  font-size:55px;
  margin-bottom:10px;
}

h1{
  color:#9f1239;
  font-size:25px;
}

p{
  color:#667085;
  line-height:1.8;
  font-size:17px;
}

html,
body,
.card,
.card *{
  -webkit-user-select:none !important;
  user-select:none !important;
  -webkit-touch-callout:none !important;
}
</style>
</head>

<body>

<div class="card">

  <div class="icon">⏰</div>

  <h1>
    Notification Link Expire Ho Chuki Hai
  </h1>

  <p>
    Yeh notification link sirf
    3 minute ke liye valid thi.
  </p>

  <p>
    Barai maharbani nayi notification
    ka intezar karein.
  </p>

</div>

</body>
</html>`;

    return new Response(
      expiredHtml,
      {
        status: 410,
        headers: {
          "Content-Type":
            "text/html; charset=UTF-8",

          "Cache-Control":
            "no-store, no-cache, must-revalidate",

          "X-Content-Type-Options":
            "nosniff"
        }
      }
    );
  }

  const legacyUrl =
    new URL(
      SITE_ORIGIN +
      "/notification-links"
    );

  function addOption(
    urlName,
    textName,
    target,
    text
  ) {

    if (
      target &&
      text
    ) {
      legacyUrl.searchParams.set(
        urlName,
        String(target)
      );

      legacyUrl.searchParams.set(
        textName,
        String(text)
      );
    }
  }

  addOption(
    "url",
    "text",
    row.url1,
    row.text1
  );

  addOption(
    "url2",
    "text2",
    row.url2,
    row.text2
  );

  addOption(
    "url3",
    "text3",
    row.url3,
    row.text3
  );

  const internalRequest =
    new Request(
      legacyUrl.toString(),
      {
        method: "GET",
        headers: request.headers
      }
    );

    const pageResponse =
    handleNotificationLinksPage(
      internalRequest
    );

  /*
    Naya viewer ho to uske browser mein
    permanent viewer ID save karein.
  */
  if (!viewerCookieToSet) {
    return pageResponse;
  }

  const responseHeaders =
    new Headers(
      pageResponse.headers
    );

  responseHeaders.set(
    "Set-Cookie",
    viewerCookieToSet
  );

  return new Response(
    pageResponse.body,
    {
      status:
        pageResponse.status,

      statusText:
        pageResponse.statusText,

      headers:
        responseHeaders
    }
  );
}

/* =========================================================
   UNIQUE NOTIFICATION OPTION PAGE END
   ========================================================= */

function handleNotificationLinksPage(request) {

  const pageUrl =
    new URL(request.url);

  const links = [];

  function addLink(
    urlName,
    textName
  ) {

    const target =
      cleanText(
        pageUrl.searchParams.get(urlName)
      );

    const text =
      cleanText(
        pageUrl.searchParams.get(textName)
      );

    if (
      target &&
      text
    ) {
      links.push({
        url: target,
        text: text.slice(0, 40)
      });
    }
  }

  addLink("url", "text");
  addLink("url2", "text2");
  addLink("url3", "text3");


  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

const buttonsHtml =
  links.length
    ? links.map(
        item => `
          <button
            type="button"
            class="choice-btn"
            data-url="${escapeHtml(item.url)}"
            onclick="window.location.href=this.dataset.url"
          >
            ${escapeHtml(item.text)}
          </button>
        `
      ).join("")
    : `
        <div class="empty">
          Koi link mojood nahi hai.
        </div>
      `;

  const html = `<!DOCTYPE html>

<html lang="ur" dir="rtl">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1"
/>

<title>
  Imdade Rohani
</title>

<style>

*{
  box-sizing:border-box;
}

body{
  margin:0;
  min-height:100vh;
  padding:20px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:
    linear-gradient(
      160deg,
      #001b4d,
      #003983,
      #061b44
    );
  font-family:Arial,sans-serif;
}

.card{
  width:100%;
  max-width:430px;
  background:#fff;
  border-radius:24px;
  padding:26px 20px;
  text-align:center;
  box-shadow:
    0 18px 50px
    rgba(0,0,0,.30);
}

.logo{
  width:90px;
  height:90px;
  border-radius:50%;
  object-fit:cover;
  border:3px solid #dba62f;
}

h1{
  color:#002087;
  font-size:25px;
  margin:15px 0 8px;
}

p{
  color:#667085;
  line-height:1.7;
  margin:0 0 20px;
}

.choice-btn{
  display:block;
  width:100%;
  margin:12px 0;
  padding:15px 16px;
  background:#002087;
  color:#fff;
  text-decoration:none;
  border-radius:14px;
  font-size:17px;
  font-weight:700;
}

html,
body,
.card,
.card *,
.choice-btn,
.logo {
  -webkit-user-select: none !important;
  user-select: none !important;
  -webkit-touch-callout: none !important;
}

.logo {
  -webkit-user-drag: none !important;
  user-drag: none !important;
  pointer-events: none !important;
}

.choice-btn {
  -webkit-touch-callout: none !important;
}

.choice-btn:active{
  transform:scale(.98);
}

.empty{
  padding:15px;
  color:#9f1239;
  background:#fff1f2;
  border-radius:12px;
}

</style>

</head>

<body>

<div class="card">

  <img
    class="logo"
    src="${LOGO_URL}"
    alt="Imdade Rohani"
  />

  <h1>
    Imdade Rohani
  </h1>

  <p>
    Neeche apni pasand ka option chunein
  </p>

  ${buttonsHtml}

</div>

</body>

</html>`;


  return new Response(
    html,
    {
      status: 200,
      headers: {
        "Content-Type":
          "text/html; charset=UTF-8",

        "Cache-Control":
          "no-store, no-cache, must-revalidate",

        "X-Content-Type-Options":
          "nosniff"
      }
    }
  );

}

/* =========================================================
   API: NEW INSTALLATION
   POST /api/pwa/install
   ========================================================= */

async function handleInstall(
  request,
  env
) {
  if (request.method !== "POST") {
    return methodNotAllowed("POST");
  }

  if (!env.DB) {
    return databaseMissingResponse();
  }

  const body =
    await readJsonBody(request);

  const deviceId =
    cleanDeviceId(
      body.device_id
    );

  if (!deviceId) {
    return jsonResponse(
      {
        success: false,
        error:
          "A valid device_id is required."
      },
      400
    );
  }

  const settings =
  await getPwaSettings(env);

const appVersion =
  normalizeVersion(
    settings.latest_version
  );

  const deviceInfo =
    getDeviceInfo(
      request,
      body
    );

  const platform =
    deviceInfo.platform;

  const browser =
    deviceInfo.browser;

  const now =
    new Date().toISOString();

  const existingUser =
    await env.DB
      .prepare(
        `
        SELECT
          device_id,
          install_count,
          status
        FROM pwa_users
        WHERE device_id = ?
        LIMIT 1
        `
      )
      .bind(deviceId)
      .first();

  const isNewInstallation =
    !existingUser;

  if (isNewInstallation) {
    await env.DB
      .prepare(
        `
        INSERT INTO pwa_users (
          device_id,
          installed_at,
          last_active,
          app_version,
          status,
          install_count,
          update_count,
          platform,
          browser,
          created_at,
          updated_at
        )
        VALUES (
          ?, ?, ?, ?, 'active',
          1, 0, ?, ?, ?, ?
        )
        `
      )
      .bind(
        deviceId,
        now,
        now,
        appVersion,
        platform,
        browser,
        now,
        now
      )
      .run();

  } else {
    await env.DB
      .prepare(
        `
        UPDATE pwa_users
        SET
          last_active = ?,
          app_version = ?,
          status = 'active',
          install_count =
            COALESCE(
              install_count,
              1
            ) + 1,
          platform = ?,
          browser = ?,
          updated_at = ?
        WHERE device_id = ?
        `
      )
      .bind(
        now,
        appVersion,
        platform,
        browser,
        now,
        deviceId
      )
      .run();
  }

  const counts =
    await getPwaCounts(env);

  const emailResult =
    await sendInstallEmail(
      env,
      {
        device_id:
          deviceId,

        app_version:
          appVersion,

        platform:
          platform,

        browser:
          browser,

        event_type:
          isNewInstallation
            ? "New PWA Installation"
            : "PWA Reinstallation"
      },
      counts
    );

  return jsonResponse({
    success: true,

    event:
      isNewInstallation
        ? "new_installation"
        : "existing_device_reinstalled",

    is_new_installation:
      isNewInstallation,

    device_id:
      deviceId,

    app_version:
      appVersion,

    total_installations:
      counts.total_installations,

    active_users:
      counts.active_users,

    inactive_users:
      counts.inactive_users,

    latest_version:
      counts.latest_version,

    recorded_at:
      now,

    email_notification:
      emailResult
  });
}


/* =========================================================
   API: APP ACTIVITY / VERSION UPDATE
   POST /api/pwa/activity
   ========================================================= */

async function handleActivity(
  request,
  env
) {
  if (request.method !== "POST") {
    return methodNotAllowed("POST");
  }

  if (!env.DB) {
    return databaseMissingResponse();
  }

  const body =
    await readJsonBody(request);

  const deviceId =
    cleanDeviceId(
      body.device_id
    );

  if (!deviceId) {
    return jsonResponse(
      {
        success: false,
        error:
          "A valid device_id is required."
      },
      400
    );
  }

  const appVersion =
    normalizeVersion(
      body.app_version
    );

const updateConfirmed =
  body.update_confirmed === true;
   
  const deviceInfo =
    getDeviceInfo(
      request,
      body
    );

  const platform =
    deviceInfo.platform;

  const browser =
    deviceInfo.browser;

  const now =
    new Date().toISOString();

  const existingUser =
    await env.DB
      .prepare(
        `
        SELECT
          device_id,
          status,
          app_version
        FROM pwa_users
        WHERE device_id = ?
        LIMIT 1
        `
      )
      .bind(deviceId)
      .first();

  let createdFromActivity =
    false;

  let wasInactive =
    false;

  let versionChanged =
    false;

  let updateEmailResult =
    null;

  if (!existingUser) {

const latestSettings =
  await getPwaSettings(env);

const initialActivityVersion =
  normalizeVersion(
    latestSettings.latest_version
  );
     
    await env.DB
      .prepare(
        `
        INSERT INTO pwa_users (
          device_id,
          installed_at,
          last_active,
          app_version,
          status,
          install_count,
          update_count,
          platform,
          browser,
          created_at,
          updated_at
        )
        VALUES (
          ?, ?, ?, ?, 'active',
          1, 0, ?, ?, ?, ?
        )
        `
      )
      .bind(
        deviceId,
        now,
        now,
        initialActivityVersion,
        platform,
        browser,
        now,
        now
      )
      .run();

    createdFromActivity =
      true;

  } else {
    wasInactive =
      cleanText(
        existingUser.status
      ) === "inactive";

    const storedAppVersion =
  normalizeVersion(
    existingUser.app_version
  );

const effectiveAppVersion =
  updateConfirmed
    ? appVersion
    : storedAppVersion;

versionChanged =
  storedAppVersion !==
  effectiveAppVersion;

    await env.DB
      .prepare(
        `
        UPDATE pwa_users
        SET
          last_active = ?,
          app_version = ?,
          status = 'active',

          update_count =
            CASE
              WHEN app_version <> ?
              THEN
                COALESCE(
                  update_count,
                  0
                ) + 1
              ELSE
                COALESCE(
                  update_count,
                  0
                )
            END,

          platform = ?,
          browser = ?,
          updated_at = ?

        WHERE device_id = ?
        `
      )
      .bind(
        now,
        effectiveAppVersion,
effectiveAppVersion,
        platform,
        browser,
        now,
        deviceId
      )
      .run();

    if (
  versionChanged &&
  updateConfirmed
) {
      const countsAfterUpdate =
        await getPwaCounts(env);

      updateEmailResult =
        await sendInstallEmail(
          env,
          {
            device_id:
              deviceId,

            app_version:
              appVersion,

            platform:
              platform,

            browser:
              browser,

            event_type:
              "PWA App Updated"
          },
          countsAfterUpdate
        );
    }
  }

  const counts =
    await getPwaCounts(env);

  return jsonResponse({
    success: true,

    event:
      "activity_updated",

    device_id:
      deviceId,

    created_from_activity:
      createdFromActivity,

    reactivated:
      wasInactive,

    version_changed:
      versionChanged,

    app_version:
      appVersion,

    email_notification:
      updateEmailResult,

    total_installations:
      counts.total_installations,

    active_users:
      counts.active_users,

    inactive_users:
      counts.inactive_users,

    latest_version:
      counts.latest_version,

    force_update:
      counts.force_update,

    inactive_days:
      counts.inactive_days,

    last_active:
      now
  });
}


/* =========================================================
   CODE NO. PWA-TRACK-4003 — PART 3 END
   ========================================================= */

/* =========================================================
   API: TOTAL STATUS
   GET /api/pwa/status
   ========================================================= */

async function handleStatus(
  request,
  env
) {
  if (request.method !== "GET") {
    return methodNotAllowed("GET");
  }

  if (!env.DB) {
    return databaseMissingResponse();
  }

  const url =
    new URL(request.url);

  const requestedDeviceId =
    cleanDeviceId(
      url.searchParams.get(
        "device_id"
      )
    );

  const counts =
    await getPwaCounts(env);

  let device = null;

  if (requestedDeviceId) {
    device =
      await env.DB
        .prepare(
          `
          SELECT
            device_id,
            installed_at,
            last_active,
            app_version,
            status,
            install_count,
            update_count,
            platform,
            browser,
            created_at,
            updated_at
          FROM pwa_users
          WHERE device_id = ?
          LIMIT 1
          `
        )
        .bind(
          requestedDeviceId
        )
        .first();
  }

  return jsonResponse({
    success: true,

    total_installations:
      counts.total_installations,

    active_users:
      counts.active_users,

    inactive_users:
      counts.inactive_users,

    latest_version:
      counts.latest_version,

    force_update:
      counts.force_update,

    inactive_days:
      counts.inactive_days,

    device_found:
      Boolean(device),

    device:
      device,

    checked_at:
      new Date().toISOString()
  });
}


/* =========================================================
   PWA VERSION CHECK
   GET /api/pwa/version
   ========================================================= */

async function handleVersionCheck(
  request,
  env
) {
  if (request.method !== "GET") {
    return methodNotAllowed("GET");
  }

  if (!env.DB) {
    return databaseMissingResponse();
  }

  try {
    const url =
      new URL(request.url);

    const suppliedVersion =
      cleanText(
        url.searchParams.get("current_version")
      );

    const deviceId =
      cleanDeviceId(
        url.searchParams.get("device_id")
      );

    const settings =
      await getPwaSettings(env);

    const latestVersion =
      normalizeVersion(
        settings.latest_version
      );

    const forceUpdate =
      Number(settings.force_update) === 1;

    /*
      D1 DEVICE VERSION IS THE FINAL SOURCE OF TRUTH
    */

    let deviceFound = false;
    let databaseVersion = "";
    let currentVersion = "";

    if (deviceId) {
      const device =
        await env.DB
          .prepare(
            `
              SELECT app_version
              FROM pwa_users
              WHERE device_id = ?
              LIMIT 1
            `
          )
          .bind(deviceId)
          .first();

      if (
        device &&
        device.app_version
      ) {
        deviceFound = true;

        databaseVersion =
          normalizeVersion(
            device.app_version
          );

        currentVersion =
          databaseVersion;
      }
    }

    /*
      IMPORTANT:

      Existing device:
      D1 app_version wins.

      Fresh installation:
      It automatically belongs to latest version.
      Therefore NO update popup.
    */

    if (!deviceFound) {
      currentVersion =
        suppliedVersion
          ? normalizeVersion(
              suppliedVersion
            )
          : latestVersion;

      /*
        A device not yet registered in D1
        must never receive an update popup
        during fresh installation.
      */

      return jsonResponse({
        success: true,

        current_version:
          currentVersion,

        latest_version:
          latestVersion,

        device_found:
          false,

        database_version:
          null,

        fresh_installation:
          true,

        update_available:
          false,

        force_update:
          forceUpdate,

        update_required:
          false,

        show_update_popup:
          false,

        allow_dismiss:
          true,

        update_title:
          "آپ کی ایپ تازہ ترین ہے",

        update_message:
          "آپ Imdade Rohani App کا تازہ ترین ورژن استعمال کر رہے ہیں۔",

        update_button_text:
          "ٹھیک ہے",

        update_url:
          null,

        checked_at:
          new Date().toISOString()
      });
    }

    /*
      EXISTING DEVICE:
      Compare its REAL D1 version
      against latest_version.
    */

    const updateAvailable =
      currentVersion !==
      latestVersion;

    const updateRequired =
      updateAvailable &&
      forceUpdate;

    const updateTitle =
      updateRequired
        ? "ضروری اپڈیٹ دستیاب ہے"
        : updateAvailable
          ? "نئی اپڈیٹ دستیاب ہے"
          : "آپ کی ایپ تازہ ترین ہے";

    const updateMessage =
      updateRequired
        ? "Imdade Rohani App کا نیا ورژن دستیاب ہے۔ ایپ استعمال جاری رکھنے کے لیے ابھی اپڈیٹ کریں۔"
        : updateAvailable
          ? "Imdade Rohani App کا نیا ورژن دستیاب ہے۔ بہتر کارکردگی کے لیے ایپ اپڈیٹ کریں۔"
          : "آپ پہلے ہی Imdade Rohani App کا تازہ ترین ورژن استعمال کر رہے ہیں۔";

    const updateButtonText =
      updateAvailable
        ? "ابھی اپڈیٹ کریں"
        : "ٹھیک ہے";

    const updateUrl =
      updateAvailable
        ? SITE_ORIGIN +
          "/?pwa_update=1&version=" +
          encodeURIComponent(
            latestVersion
          )
        : null;

    return jsonResponse({
      success: true,

      current_version:
        currentVersion,

      latest_version:
        latestVersion,

      device_found:
        true,

      database_version:
        databaseVersion,

      fresh_installation:
        false,

      update_available:
        updateAvailable,

      force_update:
        forceUpdate,

      update_required:
        updateRequired,

      show_update_popup:
        updateAvailable,

      allow_dismiss:
        !updateRequired,

      update_title:
        updateTitle,

      update_message:
        updateMessage,

      update_button_text:
        updateButtonText,

      update_url:
        updateUrl,

      checked_at:
        new Date().toISOString()
    });

  } catch (error) {
    return jsonResponse(
      {
        success: false,

        error:
          "PWA version check failed.",

        message:
          error && error.message
            ? error.message
            : String(error)
      },
      500
    );
  }
}

/* =========================================================
   MANUAL INACTIVE USERS CHECK
   GET /api/pwa/inactive-check
   ========================================================= */

async function handleManualInactiveCheck(
  request,
  env
) {
  if (request.method !== "GET") {
    return methodNotAllowed("GET");
  }

  if (!env.DB) {
    return databaseMissingResponse();
  }

  if (!env.PWA_ADMIN_KEY) {
    return jsonResponse(
      {
        success: false,
        error:
          "PWA_ADMIN_KEY secret is missing."
      },
      500
    );
  }

  const url =
    new URL(request.url);

  const suppliedKey =
    cleanText(
      url.searchParams.get("key")
    );

  if (
    !suppliedKey ||
    suppliedKey !==
      String(env.PWA_ADMIN_KEY)
  ) {
    return jsonResponse(
      {
        success: false,
        error:
          "Unauthorized manual check."
      },
      401
    );
  }

  try {
    await markInactiveUsers(env);

    const counts =
      await getPwaCounts(env);

    const inactiveUsers =
      await getInactiveUsersList(env);

    const inactiveUsersList =
      formatInactiveUsersList(
        inactiveUsers
      );

    const emailResult =
      await sendInstallEmail(
        env,
        {
          device_id:
            "manual_inactive_check",

          app_version:
            counts.latest_version,

          platform:
            "Cloudflare Worker",

          browser:
            "Admin Manual Button",

          event_type:
            "Manual Inactive Users Check",

          inactive_users_list:
            inactiveUsersList
        },
        counts
      );

    return jsonResponse({
      success: true,

      test:
        "Manual Inactive Users Check",

      total_installations:
        counts.total_installations,

      active_users:
        counts.active_users,

      inactive_users:
        counts.inactive_users,

      inactive_days:
        counts.inactive_days,

      email_notification:
        emailResult,

      checked_at:
        new Date().toISOString()
    });

  } catch (error) {
    return jsonResponse(
      {
        success: false,

        error:
          "Manual inactive check failed.",

        message:
          error && error.message
            ? error.message
            : String(error)
      },
      500
    );
  }
}

/* =========================================================
   SECURE GLOBAL PWA UPDATE ADMIN
   GET  = show confirmation page
   POST = increase version and release update
   ========================================================= */

async function handleGlobalUpdateAdmin(
  request,
  env
) {
  if (!env.DB) {
    return databaseMissingResponse();
  }

  if (!env.PWA_ADMIN_KEY) {
    return jsonResponse(
      {
        success: false,
        error:
          "PWA_ADMIN_KEY secret is missing."
      },
      500
    );
  }

  const url =
    new URL(request.url);

  const suppliedKey =
    cleanText(
      url.searchParams.get("key")
    );

  if (
    !suppliedKey ||
    suppliedKey !==
      String(env.PWA_ADMIN_KEY)
  ) {
    return new Response(
      `
      <!doctype html>
      <html lang="ur" dir="rtl">
      <head>
        <meta charset="utf-8">
        <meta name="viewport"
              content="width=device-width,initial-scale=1">
        <title>Unauthorized</title>
      </head>
      <body style="
        font-family:Arial,sans-serif;
        text-align:center;
        padding:40px;
      ">
        <h2>غیر مجاز رسائی</h2>
        <p>Admin Key درست نہیں ہے۔</p>
      </body>
      </html>
      `,
      {
        status: 401,
        headers: {
          "Content-Type":
            "text/html; charset=UTF-8"
        }
      }
    );
  }

  const settings =
    await getPwaSettings(env);

  const currentVersion =
    normalizeVersion(
      settings.latest_version
    );

  /*
    GET request:
    Show safe confirmation page only.
    No update is released yet.
  */
  if (request.method === "GET") {

    const nextVersion =
      String(
        Math.max(
          0,
          parseInt(
            currentVersion,
            10
          ) || 0
        ) + 1
      );

    return new Response(
      `
      <!doctype html>
      <html lang="ur" dir="rtl">
      <head>
        <meta charset="utf-8">
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        >
        <title>Imdade Rohani PWA Update</title>

        <style>
          *{
            box-sizing:border-box;
          }

          body{
            margin:0;
            padding:20px;
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#eef4ff;
            font-family:Arial,sans-serif;
          }

          .card{
            width:100%;
            max-width:480px;
            background:#ffffff;
            border-radius:24px;
            padding:28px 22px;
            box-shadow:
              0 14px 40px rgba(0,0,0,.14);
            text-align:center;
          }

          .icon{
            font-size:54px;
            margin-bottom:10px;
          }

          h1{
            margin:0 0 16px;
            color:#08339b;
            font-size:25px;
          }

          .version-box{
            background:#f5f8ff;
            border:1px solid #d8e4ff;
            border-radius:18px;
            padding:18px;
            margin:20px 0;
            line-height:2;
            font-size:18px;
          }

          .current{
            color:#555;
          }

          .next{
            color:#087c3d;
            font-weight:700;
            font-size:22px;
          }

          .warning{
            color:#666;
            font-size:15px;
            line-height:1.9;
            margin-bottom:22px;
          }

          button{
            width:100%;
            border:0;
            border-radius:16px;
            padding:16px 18px;
            background:#08339b;
            color:white;
            font-size:19px;
            font-weight:700;
            cursor:pointer;
          }

          button:active{
            transform:scale(.99);
          }
        </style>
      </head>

      <body>

        <div class="card">

          <div class="icon">🔄</div>

          <h1>
            سبھی Apps کے لیے نئی Update
          </h1>

          <div class="version-box">

            <div class="current">
              موجودہ Version:
              <strong>
                V${currentVersion}
              </strong>
            </div>

            <div class="next">
              نیا Version:
              V${nextVersion}
            </div>

          </div>

          <div class="warning">
            نیچے موجود button دبانے کے بعد
            V${nextVersion}
            تمام پرانی installed applications
            کے لیے نئی update بن جائے گی۔
          </div>

          <form
            method="POST"
            action="/api/pwa/global-update?key=${encodeURIComponent(
              suppliedKey
            )}"
          >
            <button type="submit">
              ابھی سبھی Apps پر Update جاری کریں
            </button>
          </form>

        </div>

      </body>
      </html>
      `,
      {
        status: 200,
        headers: {
          "Content-Type":
            "text/html; charset=UTF-8",
          "Cache-Control":
            "no-store"
        }
      }
    );
  }

  /*
    Only POST is allowed to actually
    release a new version.
  */
  if (request.method !== "POST") {
    return methodNotAllowed("POST");
  }

  try {

    const oldVersion =
      Math.max(
        0,
        parseInt(
          currentVersion,
          10
        ) || 0
      );

    const newVersion =
      String(
        oldVersion + 1
      );

    await env.DB
      .prepare(
        `
        UPDATE pwa_settings
        SET
          latest_version = ?,
          force_update = 1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
        `
      )
      .bind(
        newVersion
      )
      .run();

    return new Response(
      `
      <!doctype html>
      <html lang="ur" dir="rtl">
      <head>
        <meta charset="utf-8">
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        >
        <title>Update Released</title>

        <style>
          *{
            box-sizing:border-box;
          }

          body{
            margin:0;
            padding:20px;
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#eefbf3;
            font-family:Arial,sans-serif;
          }

          .card{
            width:100%;
            max-width:480px;
            background:#fff;
            border-radius:24px;
            padding:30px 22px;
            text-align:center;
            box-shadow:
              0 14px 40px rgba(0,0,0,.13);
          }

          .ok{
            font-size:58px;
          }

          h1{
            color:#087c3d;
            font-size:25px;
          }

          p{
            font-size:18px;
            line-height:2;
            color:#444;
          }

          .version{
            display:inline-block;
            margin:8px 0;
            padding:10px 20px;
            border-radius:999px;
            background:#e7f8ee;
            color:#087c3d;
            font-size:25px;
            font-weight:700;
          }
        </style>
      </head>

      <body>

        <div class="card">

          <div class="ok">
            ✅
          </div>

          <h1>
            نئی Update جاری ہو گئی
          </h1>

          <div class="version">
            V${newVersion}
          </div>

          <p>
            اب V${oldVersion}
            اور اس سے پرانی installed applications
            کو نئی V${newVersion}
            update دکھائی جائے گی۔
          </p>

        </div>

      </body>
      </html>
      `,
      {
        status: 200,
        headers: {
          "Content-Type":
            "text/html; charset=UTF-8",
          "Cache-Control":
            "no-store"
        }
      }
    );

  } catch (error) {

    return jsonResponse(
      {
        success: false,
        error:
          "Global PWA update failed.",
        message:
          error && error.message
            ? error.message
            : String(error)
      },
      500
    );
  }
}

/* =========================================================
   AUTOMATIC DAILY INACTIVE CHECK
   ========================================================= */

async function runDailyInactiveCheck(env) {
  if (!env || !env.DB) {
    return;
  }

  try {

    /* Har Cron par active/inactive status update hota rahe */
    await markInactiveUsers(env);

    const counts =
      await getPwaCounts(env);

    const inactiveUsers =
      await getInactiveUsersList(env);

    const inactiveUsersList =
      inactiveUsers.length > 0
        ? formatInactiveUsersList(inactiveUsers)
        : "Koi inactive user mojood nahi hai.";

    /* 15-day report state table automatic create */
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS pwa_report_state (
        id INTEGER PRIMARY KEY,
        last_fortnightly_report_at TEXT
      )
    `).run();

    await env.DB.prepare(`
      INSERT OR IGNORE INTO pwa_report_state
      (id, last_fortnightly_report_at)
      VALUES (1, NULL)
    `).run();

    const reportState =
      await env.DB.prepare(`
        SELECT last_fortnightly_report_at
        FROM pwa_report_state
        WHERE id = 1
      `).first();

    const lastReport =
      reportState &&
      reportState.last_fortnightly_report_at
        ? new Date(
            reportState.last_fortnightly_report_at
          ).getTime()
        : 0;

    const fifteenDays =
      15 * 24 * 60 * 60 * 1000;

    const reportDue =
      !lastReport ||
      Date.now() - lastReport >= fifteenDays;

    /* Agar 15 din poore nahi hue to email nahi bhejni */
    if (!reportDue) {
      return;
    }

    const emailResult =
      await sendInstallEmail(
        env,
        {
          device_id:
            "fortnightly_pwa_summary",

          app_version:
            counts.latest_version,

          platform:
            "Cloudflare Worker",

          browser:
            "Automatic 15-Day Cron Report",

          event_type:
            "Fortnightly PWA Summary",

          inactive_users_list:
            inactiveUsersList
        },
        counts
      );

    /* Successful email ke baad hi 15-day clock reset */
    if (
      emailResult &&
      emailResult.success
    ) {
      await env.DB.prepare(`
        UPDATE pwa_report_state
        SET last_fortnightly_report_at = ?
        WHERE id = 1
      `)
      .bind(
        new Date().toISOString()
      )
      .run();
    }

  } catch (error) {
    console.log(
      "Fortnightly PWA summary failed:",
      error && error.message
        ? error.message
        : String(error)
    );
  }
}


/* =========================================================
   MARK OLD USERS INACTIVE
   ========================================================= */

async function markInactiveUsers(
  env
) {
  const settings =
    await getPwaSettings(env);

  const inactiveDays =
    Math.max(
      1,
      Number(
        settings.inactive_days || 15
      )
    );

  const cutoffDate =
    new Date(
      Date.now() -
      inactiveDays *
      24 *
      60 *
      60 *
      1000
    ).toISOString();

  await env.DB
    .prepare(
      `
      UPDATE pwa_users
      SET
        status =
          CASE
            WHEN last_active < ?
            THEN 'inactive'
            ELSE 'active'
          END,
        updated_at = ?
      `
    )
    .bind(
      cutoffDate,
      new Date().toISOString()
    )
    .run();
}


/* =========================================================
   GET INACTIVE USERS LIST
   ========================================================= */

async function getInactiveUsersList(
  env
) {
  const settings =
    await getPwaSettings(env);

  const inactiveDays =
    Math.max(
      1,
      Number(
        settings.inactive_days || 15
      )
    );

  const cutoffDate =
    new Date(
      Date.now() -
      inactiveDays *
      24 *
      60 *
      60 *
      1000
    ).toISOString();

  const result =
    await env.DB
      .prepare(
        `
        SELECT
          device_id,
          installed_at,
          last_active,
          app_version,
          status,
          install_count,
          update_count,
          platform,
          browser,
          created_at,
          updated_at
        FROM pwa_users
        WHERE last_active < ?
        ORDER BY last_active ASC
        `
      )
      .bind(
        cutoffDate
      )
      .all();

  const rows =
    result &&
    Array.isArray(
      result.results
    )
      ? result.results
      : [];

  return rows.map(
    user => ({
      device_id:
        cleanText(
          user.device_id,
          "unknown"
        ),

      installed_at:
        user.installed_at ||
        null,

      last_active:
        user.last_active ||
        null,

      app_version:
        normalizeVersion(
          user.app_version
        ),

      status:
        cleanText(
          user.status,
          "inactive"
        ),

      install_count:
        safeInteger(
          user.install_count,
          0
        ),

      update_count:
        safeInteger(
          user.update_count,
          0
        ),

      platform:
        cleanText(
          user.platform,
          "unknown"
        ),

      browser:
        cleanText(
          user.browser,
          "unknown"
        )
    })
  );
}


/* =========================================================
   FORMAT INACTIVE USERS FOR EMAIL
   ========================================================= */

function formatInactiveUsersList(
  inactiveUsers
) {
  if (
    !Array.isArray(
      inactiveUsers
    ) ||
    inactiveUsers.length === 0
  ) {
    return (
      "Koi inactive user mojood nahi hai."
    );
  }

  return inactiveUsers
    .map(
      (user, index) => {

        let lastActiveText =
          "Unknown";

        if (user.last_active) {
          try {
            lastActiveText =
              new Date(
                user.last_active
              ).toLocaleString(
                "en-IN",
                {
                  timeZone:
                    "Asia/Kolkata"
                }
              );
          } catch (error) {}
        }

        return [
          "------------------",

          "Inactive User No. " +
            String(index + 1),

          "Device ID: " +
            cleanText(
              user.device_id,
              "unknown"
            ),

          "Last Active: " +
            lastActiveText,

          "App Version: " +
            normalizeVersion(
              user.app_version
            ),

          "Platform: " +
            cleanText(
              user.platform,
              "unknown"
            ),

          "Browser: " +
            cleanText(
              user.browser,
              "unknown"
            )
        ].join("\n");
      }
    )
    .join("\n\n");
}


/* =========================================================
   CODE NO. PWA-TRACK-4004 — PART 4 END
   ========================================================= */

/* =========================================================
   SERVICE WORKER CODE
   ========================================================= */

function serviceWorkerCode() {
  return `
const VERSION = "imdaderohani-pwa-v8-offline-posts";

const PAGE_CACHE =
  VERSION + "-pages";

const STATIC_CACHE =
  VERSION + "-static";

const OFFLINE_URL =
  "/offline.html";

/*
  Ye tamam aham Blogger pages app install/update hote hi cache honge.
  Naya clean page CLEAN_BLOGGER_ROUTES me add karne ke baad uska path
  is list me bhi add kar dein.
*/
const OFFLINE_PAGE_URLS = [
  "/home",
  "/form-kaarguzari",
  "/quran-shreef",
  "/naqsh-download",
  "/form-2",
  "/janch-rupay",
  "/ittilaat",
  "/name-janch",
  "/qawaneen",
  "/contact",
  "/tashkheese-dawa"
];

/*
  Blogger ke purane URLs aur pehle istemal hue clean URLs ko
  unke naye offline-cache address tak pahunchata hai.
*/
const OFFLINE_ROUTE_ALIASES = {
  "/": "/home",
  "/Home": "/home",
  "/p/blog-page_22.html": "/form-kaarguzari",
  "/p/quran-shreef.html": "/quran-shreef",
  "/p/blog-page_13.html": "/naqsh-download",
  "/p/page-one.html": "/form-2",
  "/p/blog-page_8.html": "/janch-rupay",
  "/p/blog-page_1.html": "/ittilaat",
  "/p/blog-page_51.html": "/name-janch",
  "/p/blog-page_52.html": "/qawaneen",
  "/p/blog-page_14.html": "/contact",
  "/p/fawaidtashkheesedawa.html": "/tashkheese-dawa",
  "/quran-sharif": "/quran-shreef",
  "/form-karguzari": "/form-kaarguzari",
  "/naam-janch-online": "/name-janch",
  "/form-2-naam-janch": "/form-2",
  "/janch-rupaye-kahan-se-ayega": "/janch-rupay",
  "/fawaid-tashkhees-e-dawa": "/tashkheese-dawa",
  "/contacts": "/contact"
};

async function cacheOfflinePages() {
  const cache = await caches.open(PAGE_CACHE);

  const discoveredPosts = new Set();

  await Promise.allSettled(
    OFFLINE_PAGE_URLS.map(async pageUrl => {
      const request = new Request(pageUrl, {
        cache: "reload",
        credentials: "same-origin"
      });

      const response = await fetch(request);

      if (response && response.ok) {
        await cache.put(pageUrl, response.clone());

        const contentType =
          response.headers.get("content-type") || "";

        if (contentType.includes("text/html")) {
          const html = await response.clone().text();
          const hrefPattern =
            /href\\s*=\\s*["']([^"']+)["']/gi;

          let match;

          while ((match = hrefPattern.exec(html))) {
            try {
              const href = match[1].replace(/&amp;/g, "&");
              const linkedUrl =
                new URL(href, self.location.origin);

              if (
                linkedUrl.origin === self.location.origin &&
                /\\/\\d{4}\\/\\d{2}\\/[^/]+\\.html$/.test(
                  linkedUrl.pathname
                )
              ) {
                discoveredPosts.add(
                  linkedUrl.pathname + linkedUrl.search
                );
              }
            } catch (_) {
              /* Galat ya special link ko chhor dein. */
            }
          }
        }
      }
    })
  );

  await Promise.allSettled(
    Array.from(discoveredPosts)
      .slice(0, 100)
      .map(async postUrl => {
        const request = new Request(postUrl, {
          cache: "reload",
          credentials: "same-origin"
        });

        const response = await fetch(request);

        if (response && response.ok) {
          await cache.put(postUrl, response.clone());
        }
      })
  );
}

self.addEventListener(
  "install",
  event => {
    event.waitUntil(
      caches
        .open(STATIC_CACHE)
        .then(cache =>
          Promise.allSettled([
            cache.add(OFFLINE_URL),
            cache.add(
              "/manifest.webmanifest"
            ),
            cache.add(
              "/pwa-icon-192.png"
            ),
            cache.add(
              "/pwa-icon-512.png"
            )
          ])
        )
        .then(() =>
          cacheOfflinePages()
        )
        .then(() =>
          self.skipWaiting()
        )
    );
  }
);


self.addEventListener(
  "activate",
  event => {
    event.waitUntil(
      caches
        .keys()
        .then(keys =>
          Promise.all(
            keys
              .filter(
                key =>
                  ![
                    PAGE_CACHE,
                    STATIC_CACHE
                  ].includes(key)
              )
              .map(
                key =>
                  caches.delete(key)
              )
          )
        )
        .then(() =>
          self.clients.claim()
        )
    );
  }
);


self.addEventListener(
  "fetch",
  event => {
    const request =
      event.request;

    if (
      request.method !== "GET"
    ) {
      return;
    }

    const requestUrl =
      new URL(request.url);

    if (
      requestUrl.pathname
        .startsWith("/api/")
    ) {
      event.respondWith(
        fetch(request)
      );

      return;
    }

if (
  requestUrl.pathname === "/pwa-update-client.js"
) {
  event.respondWith(
    fetch(request, {
      cache: "no-store"
    })
  );

  return;
}

    if (
      request.mode === "navigate"
    ) {
      event.respondWith(
        fetch(request)
          .then(response => {
            if (
              response &&
              response.ok
            ) {
              const copy =
                response.clone();

              caches
                .open(PAGE_CACHE)
                .then(cache =>
                  cache.put(
                    request,
                    copy
                  )
                );
            }

            return response;
          })
          .catch(async () => {
            const directCached =
              await caches.match(
                request,
                { ignoreSearch: true }
              );

            if (directCached) {
              return directCached;
            }

            const offlinePath =
              new URL(request.url).pathname;

            const cachedAlias =
              OFFLINE_ROUTE_ALIASES[offlinePath];

            if (cachedAlias) {
              const aliasResponse =
                await caches.match(
                  cachedAlias,
                  { ignoreSearch: true }
                );

              if (aliasResponse) {
                return aliasResponse;
              }
            }

            return caches.match(OFFLINE_URL);
          })
      );

      return;
    }

    if (
      requestUrl.origin ===
      self.location.origin
    ) {
      event.respondWith(
        caches
          .match(request)
          .then(cached => {
            const network =
              fetch(request)
                .then(response => {
                  if (
                    response &&
                    response.ok
                  ) {
                    const copy =
                      response.clone();

                    caches
                      .open(
                        STATIC_CACHE
                      )
                      .then(cache =>
                        cache.put(
                          request,
                          copy
                        )
                      );
                  }

                  return response;
                })
                .catch(
                  () => cached
                );

            return (
              cached ||
              network
            );
          })
      );
    }
  }
);


self.addEventListener(
  "message",
  event => {
    if (
      !event.data
    ) {
      return;
    }

    if (
      event.data.type ===
      "PWA_UPDATE_VERSION"
    ) {
      event.waitUntil(
        caches
          .keys()
          .then(keys =>
            Promise.all(
              keys.map(
                key =>
                  caches.delete(key)
              )
            )
          )
          .then(() =>
            self.skipWaiting()
          )
      );

      return;
    }

    if (
      event.data.type ===
      "SKIP_WAITING"
    ) {
      self.skipWaiting();
    }
  }
);

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 7
   CUSTOM TITLE + MESSAGE + ACTION BUTTON
   ========================================================= */

self.addEventListener(
  "push",
  event => {

    let payload = {};

    try {
      payload = event.data
        ? event.data.json()
        : {};
    } catch (error) {
      payload = {};
    }

    const data =
      payload.data &&
      typeof payload.data === "object"
        ? payload.data
        : payload;

    const notificationData =
      payload.notification &&
      typeof payload.notification === "object"
        ? payload.notification
        : {};

    const title =
      data.title ||
      notificationData.title ||
      "Imdade Rohani";

    const body =
      data.body ||
      notificationData.body ||
      "Nayi notification mojood hai.";

    const targetUrl =
  data.url ||
  "";

const actionText =
  data.action_text ||
  "";

const targetUrl2 =
  data.url2 || "";

const actionText2 =
  data.action_text2 || "";

const targetUrl3 =
  data.url3 || "";

const actionText3 =
  data.action_text3 || "";

const notificationActions = [];

if (
  targetUrl &&
  actionText
) {
  notificationActions.push({
    action: "open_link_1",
    title: actionText
  });
}

if (
  targetUrl2 &&
  actionText2
) {
  notificationActions.push({
    action: "open_link_2",
    title: actionText2
  });
}

if (
  targetUrl3 &&
  actionText3
) {
  notificationActions.push({
    action: "open_link_3",
    title: actionText3
  });
}

    const options = {

      body:
        body,

icon:
  "/pwa-icon-192.png",

badge:
  "/notification-bell.png",

      image:
        data.image ||
        undefined,

      tag:
        data.tag ||
        "imdaderohani-notification",

      renotify:
        false,

      requireInteraction:
        false,

      timestamp:
        Date.now(),

    actions:
  notificationActions,

data: {
  url:
    targetUrl,

  url2:
    targetUrl2,

  url3:
    targetUrl3,

  chat_id:
    data.chat_id || "",

  event_id:
    data.event_id || "",

  notification_type:
    data.notification_type || ""
}

    };

    event.waitUntil(
      self.registration.showNotification(
        title,
        options
      )
    );

  }
);


/* Notification ya button par click */

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();

    const notificationData =
      event.notification.data || {};

    let targetUrl =
      notificationData.url || "";

    if (
      event.action === "open_link_2"
    ) {
      targetUrl =
        notificationData.url2 ||
        notificationData.url ||
        "";
    }

    if (
      event.action === "open_link_3"
    ) {
      targetUrl =
        notificationData.url3 ||
        notificationData.url ||
        "";
    }

    /*
      Link nahi hai to notification sirf close hogi.
      App ya website open nahi hogi.
    */
    if (!targetUrl) {
      return;
    }

    event.waitUntil(
      (async () => {

        const absoluteTarget =
          new URL(
            targetUrl,
            self.location.origin
          ).href;

        const windowClients =
          await clients.matchAll({
            type: "window",
            includeUncontrolled: true
          });

        /*
          Agar wahi exact page pehle se khula hai
          to sirf usi ko focus karein.
        */
        for (
          const client of windowClients
        ) {
          if (
            client.url === absoluteTarget &&
            "focus" in client
          ) {
            return client.focus();
          }
        }

        /*
          Agar Imdade Rohani PWA/site ka koi aur
          page pehle se khula hai to naya tab/window
          banane ke bajaye usi existing window ko
          target link par le jaakar focus karein.
        */
        for (
          const client of windowClients
        ) {
          try {
            const clientUrl =
              new URL(client.url);

            const target =
              new URL(absoluteTarget);

            if (
              clientUrl.origin ===
                target.origin &&
              "navigate" in client
            ) {
              await client.navigate(
                absoluteTarget
              );

              if ("focus" in client) {
                return client.focus();
              }

              return client;
            }
          } catch (error) {
            /* Invalid client URL ko ignore karein. */
          }
        }

        /*
          App/site pehle se open nahi hai to hi
          nayi window kholi jayegi.
        */
        if (clients.openWindow) {
          return clients.openWindow(
            absoluteTarget
          );
        }

      })()
    );

  }
);

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 7 END
   ========================================================= */

`;
}


/* =========================================================
   PWA UPDATE CLIENT POPUP
   ========================================================= */

function pwaUpdateClientCode() {
  return `
(function () {

const isStandalonePwa =
  window.matchMedia(
    "(display-mode: standalone)"
  ).matches ||
  window.navigator.standalone === true;

if (!isStandalonePwa) {
  return;
}
  const params =
    new URLSearchParams(
      window.location.search
    );

  const savedVersion =
  localStorage.getItem(
    "imdaderohani_pwa_version"
  );

const currentDeviceId =
  localStorage.getItem(
    "irPwaDeviceId"
  ) || "";

/* =============================================
   PWA ACTIVITY HEARTBEAT
   Keeps last_active updated automatically
   ============================================= */

async function sendPwaActivityHeartbeat() {

  if (!currentDeviceId) {
    return;
  }

  try {

    await fetch(
      "/api/pwa/activity",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        cache: "no-store",

        keepalive: true,

        body: JSON.stringify({
          device_id: currentDeviceId,

          app_version:
            localStorage.getItem(
              "imdaderohani_pwa_version"
            ) || "",

          platform: "Android PWA",

          browser: "Google Chrome"
        })
      }
    );

  } catch (error) {

    console.log(
      "PWA activity heartbeat failed",
      error
    );
  }
}


/* App open hote hi activity bheje */
sendPwaActivityHeartbeat();


/* App khula rahe to har 5 minute activity bheje */
setInterval(
  sendPwaActivityHeartbeat,
  5 * 60 * 1000
);


/* Background se app dobara saamne aaye */
document.addEventListener(
  "visibilitychange",
  function () {

    if (
      document.visibilityState ===
      "visible"
    ) {
      sendPwaActivityHeartbeat();
    }
  }
);

let currentVersion =
  savedVersion || "";


/* =============================================
   SAFE INITIAL VERSION RESOLVER
   New install = latest version
   Existing user = saved/database version
   ============================================= */

 async function resolveInitialVersion() {

  try {

    const statusResponse =
      await fetch(
        "/api/pwa/status?device_id=" +
        encodeURIComponent(
          currentDeviceId
        ),
        {
          cache: "no-store"
        }
      );

    if (!statusResponse.ok) {
      return savedVersion
        ? String(savedVersion)
        : "";
    }

    const statusData =
      await statusResponse.json();

    /*
      DATABASE IS THE FINAL SOURCE OF TRUTH

      If this device already exists in D1,
      always use its real app_version.
    */
    if (
      statusData &&
      statusData.success &&
      statusData.device_found &&
      statusData.device &&
      statusData.device.app_version
    ) {

      currentVersion =
        String(
          statusData.device.app_version
        );

      localStorage.setItem(
        "imdaderohani_pwa_version",
        currentVersion
      );

      return currentVersion;
    }

    /*
      Fresh installation:
      it belongs to the latest version.
    */
    if (
      statusData &&
      statusData.success &&
      statusData.latest_version
    ) {

      currentVersion =
        String(
          statusData.latest_version
        );

      localStorage.setItem(
        "imdaderohani_pwa_version",
        currentVersion
      );

      localStorage.setItem(
        "irPwaCompletedUpdateVersion",
        currentVersion
      );

      return currentVersion;
    }

    return savedVersion
      ? String(savedVersion)
      : "";

  } catch (error) {

    console.log(
      "Initial PWA version resolve failed",
      error
    );

    return savedVersion
      ? String(savedVersion)
      : "";
  }
}

async function checkPwaUpdate() {

  try {

    const versionToCheck =
      await resolveInitialVersion();

    if (!versionToCheck) {
      return;
    }

    const response =
  await fetch(
    "/api/pwa/version?current_version=" +
    encodeURIComponent(
      versionToCheck
    ) +
    "&device_id=" +
    encodeURIComponent(
      currentDeviceId
    ),
    {
      cache: "no-store"
    }
  );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      if (
        !data ||
        !data.success ||
        !data.show_update_popup
      ) {
        return;
      }

/* FINAL GUARD: already updated version must never popup again */
const installedVersion =
    localStorage.getItem("imdaderohani_pwa_version") || "";

if (
    installedVersion &&
    String(installedVersion) === String(data.latest_version)
) {
    localStorage.setItem(
        "irPwaCompletedUpdateVersion",
        String(data.latest_version)
    );
    return;
}

const completedUpdateVersion =
  localStorage.getItem(
    "irPwaCompletedUpdateVersion"
  );

/*
  D1 / installed version is the final source of truth.
  A stale completed-update marker must never hide a real update.
*/
if (
  completedUpdateVersion &&
  String(completedUpdateVersion) ===
    String(data.latest_version) &&
  installedVersion &&
  String(installedVersion) ===
    String(data.latest_version)
) {
  return;
}

if (
  completedUpdateVersion &&
  String(completedUpdateVersion) ===
    String(data.latest_version) &&
  String(installedVersion) !==
    String(data.latest_version)
) {
  localStorage.removeItem(
    "irPwaCompletedUpdateVersion"
  );
}

      showPwaUpdatePopup(data);

    } catch (error) {
      console.log(
        "PWA update check failed",
        error
      );
    }
  }


  function showPwaUpdatePopup(
    data
  ) {
    if (
      document.getElementById(
        "imdaderohani-pwa-update-overlay"
      )
    ) {
      return;
    }

    const overlay =
      document.createElement(
        "div"
      );

    overlay.id =
      "imdaderohani-pwa-update-overlay";

    overlay.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:2147483647",
      "background:rgba(0,0,0,.55)",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "padding:18px",
      "font-family:Arial,sans-serif"
    ].join(";");


    const box =
      document.createElement(
        "div"
      );

    box.style.cssText = [
      "width:100%",
      "max-width:390px",
      "background:#ffffff",
      "border-radius:22px",
      "padding:24px 20px",
      "box-shadow:0 20px 60px rgba(0,0,0,.30)",
      "text-align:center",
      "direction:rtl"
    ].join(";");


    const icon =
      document.createElement(
        "div"
      );

    icon.textContent =
      "🔄";

    icon.style.cssText = [
      "font-size:48px",
      "margin-bottom:10px"
    ].join(";");


    const title =
      document.createElement(
        "h2"
      );

    title.textContent =
      data.update_title ||
      "نئی اپڈیٹ دستیاب ہے";

    title.style.cssText = [
      "margin:0 0 12px",
      "color:#002087",
      "font-size:24px",
      "line-height:1.6"
    ].join(";");


    const message =
      document.createElement(
        "p"
      );

    message.textContent =
      data.update_message ||
      "Imdade Rohani App کا نیا ورژن دستیاب ہے۔";

    message.style.cssText = [
      "margin:0 0 20px",
      "color:#444",
      "font-size:16px",
      "line-height:2"
    ].join(";");


    const button =
      document.createElement(
        "button"
      );

    button.textContent =
      data.update_button_text ||
      "ابھی اپڈیٹ کریں";

    button.style.cssText = [
      "width:100%",
      "border:0",
      "border-radius:50px",
      "padding:14px 18px",
      "background:#002087",
      "color:#fff",
      "font-size:17px",
      "font-weight:bold",
      "cursor:pointer"
    ].join(";");


    button.addEventListener(
      "click",
      async function () {

        button.disabled =
          true;

        button.textContent =
          "اپڈیٹ ہو رہی ہے...";

localStorage.setItem(
  "irPwaCompletedUpdateVersion",
  String(
    data.latest_version
  )
);

        try {
          if (
            "serviceWorker"
            in navigator
          ) {
            const registration =
              await navigator
                .serviceWorker
                .getRegistration();

            if (
              registration &&
              registration.waiting
            ) {
              registration
                .waiting
                .postMessage({
                  type:
                    "PWA_UPDATE_VERSION",

                  version:
                    data.latest_version
                });
            }

            if (
              registration &&
              registration.active
            ) {
              registration
                .active
                .postMessage({
                  type:
                    "PWA_UPDATE_VERSION",

                  version:
                    data.latest_version
                });
            }

            if (registration) {
              registration
                .update()
                .catch(
                  error => {
                    console.log(
                      "Service Worker update failed",
                      error
                    );
                  }
                );
            }
          }

        } catch (error) {
          console.log(
            "PWA update action failed",
            error
          );
        }

fetch(
  "/api/pwa/activity",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    keepalive: true,
    body: JSON.stringify({
  device_id: currentDeviceId,
  app_version: String(
    data.latest_version
  ),
  update_confirmed: true,
  platform: "Android PWA",
  browser: "Google Chrome"
})
  }
).catch(error => {
  console.log(
    "PWA update activity failed",
    error
  );
});

        localStorage.setItem(
          "imdaderohani_pwa_version",
          String(
            data.latest_version
          )
        );

        /*
          Replace the current history entry instead of adding a new one.
          This prevents Back from restoring the old "update in progress"
          popup after a successful update.
        */
        window.location.replace(
          data.update_url ||
          "/?pwa_update=1"
        );
      }
    );


    box.appendChild(icon);
    box.appendChild(title);
    box.appendChild(message);
    box.appendChild(button);


    if (data.allow_dismiss) {
      const close =
        document.createElement(
          "button"
        );

      close.textContent =
        "بعد میں";

      close.style.cssText = [
        "margin-top:12px",
        "border:0",
        "background:transparent",
        "color:#666",
        "font-size:15px",
        "cursor:pointer"
      ].join(";");

      close.addEventListener(
        "click",
        function () {
          overlay.remove();
        }
      );

      box.appendChild(close);
    }

    overlay.appendChild(box);

    document.body
      .appendChild(overlay);
  }


  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      checkPwaUpdate
    );
  } else {
    checkPwaUpdate();
  }


  setInterval(
    checkPwaUpdate,
    30 * 60 * 1000
  );

})();
`;
}


/* =========================================================
   OFFLINE PAGE
   ========================================================= */

function offlineHtml() {
  return `<!doctype html>
<html lang="ur" dir="rtl">
<head>
<meta charset="utf-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<meta
  name="theme-color"
  content="#002087"
>

<title>
انٹرنیٹ دستیاب نہیں
</title>

<style>

*{
  box-sizing:border-box
}

body{
  min-height:100vh;
  margin:0;
  padding:20px;
  display:flex;
  align-items:center;
  justify-content:center;

  background:
    linear-gradient(
      145deg,
      #001449,
      #002087,
      #1769c2
    );

  color:#fff;
  font-family:Arial,sans-serif;
  text-align:center
}

main{
  width:100%;
  max-width:430px;
  padding:30px 20px;

  background:
    rgba(255,255,255,.12);

  border:
    1px solid
    rgba(255,255,255,.25);

  border-radius:24px
}

img{
  width:110px;
  height:110px;
  padding:7px;
  object-fit:contain;
  border-radius:50%;
  background:#fff
}

h1{
  color:#ffd76a
}

button{
  padding:12px 25px;
  border:0;
  border-radius:50px;
  background:#ffd76a;
  color:#002087;
  font-weight:bold
}

</style>
</head>

<body>

<main>

  <img
    src="/pwa-icon-192.png"
    alt="Imdade Rohani"
  >

  <h1>
    انٹرنیٹ دستیاب نہیں
  </h1>

  <p>
    براہِ کرم اپنے موبائل کا
    Internet یا Wi-Fi چیک کریں۔
  </p>

  <button
    onclick="location.reload()"
  >
    دوبارہ کوشش کریں
  </button>

</main>

</body>
</html>`;
}

/* =========================================================
   DIRECT PWA INSTALL PAGE
   ========================================================= */

function liveChatAdminInstallPageHtml() {
  return `<!doctype html>
<html lang="hi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#1746a2">
  <title>Imdade Rohani Live Chat Admin Install</title>
  <link rel="manifest" href="/live-chat-admin-v2.webmanifest">
  <link rel="icon" href="/pwa-icon-192.png">
  <style>
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:18px;background:linear-gradient(145deg,#e9f2ff,#f8fbff);font-family:Arial,sans-serif;color:#172033}
    .admin-install{width:min(430px,100%);padding:25px 20px;border:1px solid #d5dfed;border-radius:22px;background:#fff;box-shadow:0 18px 48px rgba(23,70,162,.18);text-align:center}
    .admin-logo{width:86px;height:86px;border-radius:24px;object-fit:cover;box-shadow:0 8px 22px rgba(23,70,162,.22)}
    h1{margin:15px 0 8px;font-size:24px;color:#1746a2}p{margin:8px 0 18px;line-height:1.65;color:#526071;font-size:15px}
    button,a{width:100%;min-height:50px;border:0;border-radius:13px;padding:13px 16px;font-size:16px;font-weight:700;text-decoration:none;display:grid;place-items:center;cursor:pointer}
    #adminInstallButton{background:#1746a2;color:#fff}#adminInstallButton:disabled{opacity:.58;cursor:default}.open-admin{margin-top:11px;background:#eaf1fb;color:#1746a2}
    #adminInstallStatus{min-height:44px;margin-top:14px;padding:10px;border-radius:10px;background:#f6f8fb;color:#485568;font-size:13px;line-height:1.55}
  </style>
</head>
<body>
  <main class="admin-install">
    <img class="admin-logo" src="/pwa-icon-192.png" alt="Imdade Rohani">
    <h1>Live Chat Admin App</h1>
    <p>Admin panel ko mobile mein alag application ki tarah install karein. App khulte hi seedha Live Chat Admin Panel khulega.</p>
    <button id="adminInstallButton" type="button" disabled>Install Admin App</button>
    <a class="open-admin" href="/p/live-chat-admin-panel.html">Admin Panel Kholain</a>
    <div id="adminInstallStatus">Install option tayyar ho raha hai…</div>
  </main>
  <script>
    (function(){
      var promptEvent=null;
      var button=document.getElementById("adminInstallButton");
      var status=document.getElementById("adminInstallStatus");
      if("serviceWorker" in navigator){navigator.serviceWorker.register("/service-worker.js",{scope:"/"}).catch(function(){});}
      window.addEventListener("beforeinstallprompt",function(event){event.preventDefault();promptEvent=event;button.disabled=false;status.textContent="Admin application install ke liye tayyar hai.";});
      button.addEventListener("click",function(){if(!promptEvent){status.textContent="Chrome menu ke three dots mein ‘Install app’ ya ‘Add to Home screen’ dabayen.";return;}button.disabled=true;promptEvent.prompt();promptEvent.userChoice.then(function(choice){status.textContent=choice.outcome==="accepted"?"Admin application install ho rahi hai.":"Installation filhal radd kar di gayi.";promptEvent=null;});});
      window.addEventListener("appinstalled",function(){button.disabled=true;status.textContent="Live Chat Admin application kamyabi se install ho gayi.";});
      window.setTimeout(function(){if(!promptEvent){button.disabled=false;status.textContent="Agar button se popup na aaye to Chrome menu (⋮) se ‘Install app’ dabayen.";}},3500);
    })();
  <\/script>
</body>
</html>`;
}

function installPageHtml() {
  return `<!doctype html>
<html lang="ur" dir="rtl">
<head>
<meta charset="utf-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<meta name="theme-color" content="#002087">

<link rel="manifest" href="/manifest.webmanifest">

<title>Imdade Rohani App Install</title>

<style>
*{
  box-sizing:border-box;
}

body{
  margin:0;
  min-height:100vh;
  padding:20px;

  display:flex;
  align-items:center;
  justify-content:center;

  background:
    linear-gradient(
      145deg,
      #001449,
      #002087,
      #1769c2
    );

  font-family:Arial,sans-serif;
  text-align:center;
}

.install-card{
  width:100%;
  max-width:420px;

  padding:32px 22px;

  background:#ffffff;
  border-radius:24px;

  box-shadow:
    0 18px 55px rgba(0,0,0,.30);
}

.app-icon{
  width:100px;
  height:100px;

  border-radius:22px;
  object-fit:cover;

  margin-bottom:15px;
}

h1{
  margin:5px 0 10px;

  color:#002087;
  font-size:25px;
}

p{
  margin:0 0 24px;

  color:#555;
  font-size:16px;
  line-height:1.9;
}

#installButton{
  width:100%;

  padding:15px 20px;

  border:0;
  border-radius:50px;

  background:#002087;
  color:#ffffff;

  font-size:18px;
  font-weight:bold;

  cursor:pointer;
}

#installButton:disabled{
  opacity:.65;
}

#installStatus{
  min-height:24px;
  margin-top:16px;

  color:#555;
  font-size:14px;
  line-height:1.7;
}
</style>
</head>

<body>

<div class="install-card">

  <img
    class="app-icon"
    src="/pwa-icon-192.png"
    alt="Imdade Rohani"
  >

  <h1>
    Imdade Rohani App
  </h1>

  <p>
    App ko apne mobile mein install karne ke liye
    neeche diye gaye button ko dabayen.
  </p>

  <button
    id="installButton"
    type="button"
  >
    INSTALL APP
  </button>

  <div id="installStatus">
    Install option tayyar ho raha hai...
  </div>

</div>

<script>
(function () {
  "use strict";

  var deferredPrompt = null;

  var button =
    document.getElementById("installButton");

  var status =
    document.getElementById("installStatus");

  function isStandalone() {
    return (
      window.matchMedia(
        "(display-mode: standalone)"
      ).matches ||
      window.navigator.standalone === true
    );
  }

  if (isStandalone()) {
    button.disabled = true;
    button.textContent = "APP INSTALLED";
    status.textContent =
      "Imdade Rohani App pehle se install hai.";
    return;
  }

  window.addEventListener(
    "beforeinstallprompt",
    function (event) {

      event.preventDefault();

      deferredPrompt = event;

      status.textContent =
        "App install karne ke liye button dabayen.";
    }
  );

  button.addEventListener(
    "click",
    async function () {

      if (!deferredPrompt) {
        status.textContent =
          "Install option abhi tayyar nahi hai. Chrome mein is page ko khol kar chand second intezar karein.";
        return;
      }

      button.disabled = true;

      try {

        deferredPrompt.prompt();

        var choice =
          await deferredPrompt.userChoice;

        deferredPrompt = null;

        if (choice.outcome === "accepted") {
          status.textContent =
            "Installation shuru ho gayi hai.";
        } else {
          status.textContent =
            "Installation cancel kar di gayi.";
          button.disabled = false;
        }

      } catch (error) {

        button.disabled = false;

        status.textContent =
          "Install nahi ho saka. Dobarah koshish karein.";
      }
    }
  );

  window.addEventListener(
    "appinstalled",
    function () {

      deferredPrompt = null;

      button.disabled = true;
      button.textContent = "APP INSTALLED";

      status.textContent =
        "Imdade Rohani App kamyabi se install ho gaya.";
    }
  );

})();
</script>

</body>
</html>`;
}

/* =========================================================
   IMDADE ROHANI PROFESSIONAL CUSTOM 404 PAGE
   ========================================================= */

function custom404Html() {
  return `<!doctype html>
<html lang="ur" dir="rtl">
<head>
<meta charset="utf-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<meta name="theme-color" content="#00143d">

<title>404 | صفحہ نہیں ملا | Imdade Rohani</title>

<style>

*{
  box-sizing:border-box;
}

html{
  scroll-behavior:smooth;
}

body{
  margin:0;
  min-height:100vh;

  background:
    radial-gradient(
      circle at 50% 25%,
      #0b3470 0,
      #031c4a 30%,
      #001431 65%,
      #000b1e 100%
    );

  color:#ffffff;
  font-family:
    Arial,
    "Noto Nastaliq Urdu",
    sans-serif;

  overflow-x:hidden;
}


/* =========================
   MAIN PAGE
   ========================= */

.page{
  width:100%;
  min-height:100vh;

  padding:
    18px
    16px
    34px;

  position:relative;
}


/* =========================
   STARS
   ========================= */

.page::before{
  content:"";

  position:fixed;
  inset:0;

  pointer-events:none;

  background-image:
    radial-gradient(#fff 1px,transparent 1px),
    radial-gradient(#f9c85e 1px,transparent 1px);

  background-size:
    85px 85px,
    145px 145px;

  background-position:
    0 0,
    35px 45px;

  opacity:.28;
}


/* =========================
   HEADER
   ========================= */

.header{
  width:100%;
  max-width:900px;

  margin:0 auto 30px;

  padding:13px 15px;

  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;

  direction:ltr;

  border:
    1px solid
    rgba(255,190,55,.28);

  border-radius:18px;

  background:
    rgba(0,20,55,.70);

  box-shadow:
    0 12px 35px
    rgba(0,0,0,.25);

  backdrop-filter:
    blur(10px);
}


.brand{
  display:flex;
  align-items:center;
  gap:12px;

  min-width:0;
}


.brand-logo{
  width:62px;
  height:62px;

  min-width:62px;

  border-radius:50%;

  padding:7px;

  object-fit:contain;

  background:
    linear-gradient(
      145deg,
      #ffe49a,
      #d99a18
    );

  border:
    2px solid
    #e7ae31;

  box-shadow:
    0 0 18px
    rgba(255,188,49,.28);
}


.brand-text{
  text-align:left;
}


.brand-name{
  display:block;

  color:#ffffff;

  font-family:Georgia,serif;

  font-size:24px;
  font-weight:700;

  line-height:1.1;
}


.brand-subtitle{
  display:block;

  margin-top:5px;

  color:#efb83d;

  font-size:12px;
}


.header-actions{
  display:flex;
  gap:8px;
}


.header-btn{
  width:65px;
  height:65px;

  border-radius:14px;

  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;

  gap:4px;

  text-decoration:none;

  border:
    1px solid
    rgba(255,190,55,.28);

  background:
    rgba(5,31,69,.88);

  color:#fff;

  font-size:11px;
}


.header-icon{
  font-size:25px;
  line-height:1;
}


/* =========================
   404 HERO
   ========================= */

.hero{
  width:100%;
  max-width:850px;

  margin:auto;

  text-align:center;

  position:relative;
}


.error-code{
  margin-top:10px;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size:
    clamp(
      125px,
      35vw,
      280px
    );

  line-height:.9;

  font-weight:700;

  color:#f4f7ff;

  text-shadow:
    0 0 12px
      rgba(255,255,255,.45),
    0 0 34px
      rgba(46,122,255,.45);
}


.error-title{
  margin:
    15px 0 5px;

  color:#f2ad35;

  font-size:
    clamp(
      28px,
      8vw,
      48px
    );

  font-weight:700;

  line-height:1.8;
}


.gold-divider{
  width:220px;
  max-width:70%;

  height:1px;

  margin:
    8px auto 22px;

  background:
    linear-gradient(
      90deg,
      transparent,
      #d9a42d,
      transparent
    );
}


.error-text{
  max-width:680px;

  margin:
    0 auto;

  color:#f5f7fb;

  font-size:
    clamp(
      17px,
      4.5vw,
      23px
    );

  line-height:2.2;
}


/* =========================
   SCENE
   ========================= */

.scene{
  width:100%;
  max-width:850px;

  height:380px;

  margin:
    15px auto 25px;

  position:relative;

  overflow:hidden;

  border-radius:
    0 0 40px 40px;
}


.moon-glow{
  position:absolute;

  left:50%;
  bottom:40px;

  width:180px;
  height:180px;

  transform:
    translateX(-50%);

  border-radius:
    50% 50% 12px 12px;

  background:
    radial-gradient(
      circle,
      rgba(255,216,99,.95) 0,
      rgba(255,178,20,.47) 30%,
      rgba(255,168,0,.10) 58%,
      transparent 72%
    );

  filter:
    blur(2px);

  box-shadow:
    0 0 80px
    rgba(255,175,29,.35);
}


.arch{
  position:absolute;

  left:50%;
  bottom:54px;

  width:115px;
  height:155px;

  transform:
    translateX(-50%);

  border:
    4px solid
    #e6ad36;

  border-radius:
    60px 60px 8px 8px;

  box-shadow:
    0 0 35px
    rgba(238,169,43,.35);

  background:
    linear-gradient(
      180deg,
      rgba(255,218,105,.15),
      rgba(255,181,35,.4)
    );
}


.arch::before{
  content:"";

  position:absolute;

  left:50%;
  top:28px;

  width:54px;
  height:94px;

  transform:
    translateX(-50%);

  border-radius:
    28px 28px 3px 3px;

  background:
    linear-gradient(
      #fff2b7,
      #ffc33b
    );

  box-shadow:
    0 0 35px
    #ffc84b;
}


.path{
  position:absolute;

  left:50%;
  bottom:-65px;

  width:260px;
  height:220px;

  transform:
    translateX(-50%)
    perspective(300px)
    rotateX(56deg);

  border-radius:50%;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,190,51,.14),
      #e8ab30,
      rgba(255,190,51,.14),
      transparent
    );

  opacity:.9;
}


.sign{
  position:absolute;

  left:7%;
  bottom:87px;

  width:128px;
  height:95px;
}


.sign::before,
.sign::after{
  content:"";

  position:absolute;

  left:0;

  width:128px;
  height:28px;

  border:
    1px solid
    rgba(239,174,47,.45);

  background:
    linear-gradient(
      #183255,
      #091d38
    );

  clip-path:
    polygon(
      0 0,
      90% 0,
      100% 50%,
      90% 100%,
      0 100%,
      8% 50%
    );
}


.sign::before{
  top:0;
}


.sign::after{
  top:38px;

  transform:
    scaleX(-1);
}


.lantern{
  position:absolute;

  left:22%;
  bottom:43px;

  font-size:42px;

  filter:
    drop-shadow(
      0 0 12px
      #ffc244
    );
}


/* =========================
   ACTION PANEL
   ========================= */

.action-panel{
  width:100%;
  max-width:850px;

  margin:
    0 auto 18px;

  padding:
    22px 16px;

  border:
    1px solid
    rgba(240,181,54,.30);

  border-radius:20px;

  background:
    rgba(4,31,69,.78);

  box-shadow:
    0 15px 38px
    rgba(0,0,0,.24);
}


.action-heading{
  margin:
    0 0 18px;

  text-align:center;

  color:#efb13a;

  font-size:
    clamp(
      24px,
      7vw,
      35px
    );

  line-height:1.8;
}


.actions{
  display:grid;

  grid-template-columns:
    repeat(2,1fr);

  gap:12px;
}


.action-card{
  min-height:150px;

  padding:
    18px 10px;

  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;

  text-align:center;

  text-decoration:none;

  color:#fff;

  border:
    1px solid
    rgba(82,142,219,.40);

  border-radius:15px;

  background:
    linear-gradient(
      145deg,
      rgba(21,62,111,.85),
      rgba(4,33,72,.90)
    );
}


.big-icon{
  width:64px;
  height:64px;

  display:flex;
  align-items:center;
  justify-content:center;

  margin-bottom:12px;

  border-radius:50%;

  font-size:34px;
}


.whatsapp-icon{
  background:
    linear-gradient(
      #29d366,
      #129447
    );

  box-shadow:
    0 5px 16px
    rgba(37,211,102,.25);
}


.home-icon{
  background:
    linear-gradient(
      #1763ac,
      #07336d
    );
}


.card-title{
  font-size:19px;
  line-height:1.8;
}


.card-sub{
  color:#d4deee;

  font-size:13px;
}


/* =========================
   OFFICIAL SITE NOTICE
   ========================= */

.notice{
  width:100%;
  max-width:850px;

  margin:
    0 auto 28px;

  padding:
    18px 18px;

  display:flex;
  align-items:center;
  gap:16px;

  direction:ltr;

  border:
    1px solid
    rgba(240,181,54,.28);

  border-radius:18px;

  background:
    rgba(4,27,61,.84);
}


.bulb{
  width:64px;
  height:64px;

  min-width:64px;

  display:flex;
  align-items:center;
  justify-content:center;

  border:
    2px solid
    #e5aa2b;

  border-radius:50%;

  font-size:32px;
}


.notice-text{
  flex:1;

  direction:rtl;

  text-align:center;

  color:#fff;

  font-size:
    clamp(
      15px,
      4vw,
      20px
    );

  line-height:2;
}


.notice-domain{
  display:block;

  direction:ltr;

  margin-top:7px;

  color:#e9ae35;

  font-size:22px;
  font-weight:700;
}


/* =========================
   FLAG DIVIDER
   ========================= */

.flag-divider{
  width:100%;
  max-width:760px;

  margin:
    10px auto 25px;

  display:flex;
  align-items:center;
  justify-content:center;
  gap:15px;
}


.flag-line{
  flex:1;

  height:1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      #dca52f
    );
}


.flag-line.right{
  transform:
    scaleX(-1);
}


.flag-mark{
  width:76px;
  height:76px;

  padding:8px;

  object-fit:contain;

  border-radius:50%;

  background:
    linear-gradient(
      #ffe29a,
      #d69a1f
    );

  border:
    1px solid
    #e8b13e;
}


/* =========================
   FOOTER
   ========================= */

.footer{
  width:100%;
  max-width:850px;

  margin:auto;

  padding:
    18px 10px 8px;

  text-align:center;

  border-top:
    1px solid
    rgba(227,169,47,.20);

  color:#cbd5e5;

  font-size:13px;
  line-height:1.9;
}


.footer-brand{
  color:#eab03a;
}


/* =========================
   MOBILE
   ========================= */

@media(max-width:600px){

  .page{
    padding:
      10px 10px 28px;
  }

  .header{
    padding:
      9px 9px;
  }

  .brand-logo{
    width:50px;
    height:50px;

    min-width:50px;
  }

  .brand-name{
    font-size:19px;
  }

  .brand-subtitle{
    font-size:9px;
  }

  .header-btn{
    width:53px;
    height:55px;

    font-size:9px;
  }

  .header-icon{
    font-size:21px;
  }

  .scene{
    height:330px;
  }

  .actions{
    gap:8px;
  }

  .action-card{
    min-height:140px;
  }

  .notice{
    gap:9px;

    padding:
      15px 10px;
  }

  .bulb{
    width:52px;
    height:52px;

    min-width:52px;

    font-size:26px;
  }

}

</style>
</head>

<body>

<div class="page">


<!-- HEADER -->

<header class="header">

  <div class="brand">

    <img
      class="brand-logo"
      src="/pwa-icon-192.png"
      alt="Imdade Rohani"
    >

    <div class="brand-text">

      <span class="brand-name">
        Imdade Rohani
      </span>

      <span class="brand-subtitle">
        Rohani Ilaj aur Online Rehnumai
      </span>

    </div>

  </div>

  <div class="header-actions">

    <a
      class="header-btn"
      href="mailto:Connect@imdaderohani.in"
      aria-label="Email"
    >
      <span class="header-icon">
        ✉
      </span>

      <span>
        Mail
      </span>
    </a>

    <a
      class="header-btn"
      href="https://wa.me/918207311073"
      aria-label="WhatsApp"
    >
      <span class="header-icon">
        ☎
      </span>

      <span>
        WhatsApp
      </span>
    </a>

  </div>

</header>

<!-- HERO -->

<main class="hero">

  <div class="error-code">
    404
  </div>

  <div class="error-title">
    صفحہ نہیں ملا
  </div>

  <div class="gold-divider"></div>

  <div class="error-text">
    آپ جس صفحے کو تلاش کر رہے ہیں
    وہ موجود نہیں ہے
    <br>
    یا اسے منتقل کر دیا گیا ہے۔
  </div>


  <div class="scene">

    <div class="sign"></div>

    <div class="lantern">
      🏮
    </div>

    <div class="moon-glow"></div>

    <div class="arch"></div>

    <div class="path"></div>

  </div>

</main>


<!-- ACTIONS -->

<section class="action-panel">

  <h2 class="action-heading">
    آپ کیا چاہتے ہیں؟
  </h2>

  <div class="actions">


    <a
      class="action-card"
      href="https://wa.me/919356236900"
    >

      <div class="big-icon whatsapp-icon">
        ☎
      </div>

      <div class="card-title">
        ہم سے رابطہ کریں
      </div>

      <div class="card-sub">
        WhatsApp پر بات کریں
      </div>

    </a>


    <a
      class="action-card"
      href="https://qrc.imdaderohani.in/"
    >

      <div class="big-icon home-icon">
        🏠
      </div>

      <div class="card-title">
        ہوم پیج پر جائیں
      </div>

      <div class="card-sub">
        ہوم پیج دیکھیں
      </div>

    </a>

  </div>

</section>


<!-- NOTICE -->

<section class="notice">

  <div class="bulb">
    💡
  </div>

  <div class="notice-text">

    ImdadeRohani کی مین آفیشل ویب سائٹ
    تکنیکی خرابی کے سبب
    ابھی بند چل رہی ہے۔

    <span class="notice-domain">
      imdaderohani.in
    </span>

  </div>

</section>


<!-- FLAG DIVIDER -->

<div class="flag-divider">

  <div class="flag-line"></div>

  <img
    class="flag-mark"
    src="/pwa-icon-192.png"
    alt="Imdade Rohani"
  >

  <div class="flag-line right"></div>

</div>


<!-- FOOTER -->

<footer class="footer">

  © 2026
  <span class="footer-brand">
    Imdade Rohani
  </span>

  — All Rights Reserved.

  <br>

  Rohani Ilaj aur Online Rehnumai

</footer>


</div>

</body>
</html>`;
}

/* =========================================================
   BLOGGER PROXY
   ========================================================= */

function handleCleanBloggerRoute(request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return null;
  }

  const url = new URL(request.url);
  let path = url.pathname;

  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  /* Old/default Blogger URL -> clean browser URL */
  const cleanPath = OLD_BLOGGER_ROUTES[path];

  if (cleanPath) {
    return Response.redirect(
      new URL(cleanPath, url.origin).toString(),
      301
    );
  }

  /* Root and old capital /Home -> preferred /home */
  if (path === "/" || path === "/Home") {
    return Response.redirect(
      new URL("/home", url.origin).toString(),
      301
    );
  }

  /* Clean browser URL -> original Blogger content internally */
  const bloggerPath = CLEAN_BLOGGER_ROUTES[path];

  if (bloggerPath) {
    return proxyBlogger(request, bloggerPath, path);
  }

  return null;
}

async function proxyBlogger(
  request,
  targetPath = null,
  cleanBrowserPath = null
) {
  const incomingUrl =
    new URL(request.url);

  const bloggerUrl =
    new URL(
      (targetPath || incomingUrl.pathname) +
      incomingUrl.search,
      SITE_ORIGIN
    );

  try {
    const response =
      await fetch(
        bloggerUrl.toString(),
        {
          method:
            request.method,

          headers:
            request.headers,

          redirect:
            "follow"
        }
      );

    if (response.status === 404) {
  return new Response(
    custom404Html(),
    {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Content-Type-Options": "nosniff"
      }
    }
  );
}

if (
  cleanBrowserPath &&
  (response.headers.get("Content-Type") || "")
    .toLowerCase()
    .includes("text/html")
) {
  return rewriteCleanBloggerHtml(
    response,
    cleanBrowserPath
  );
}

if (
  incomingUrl.pathname === "/p/live-chat-admin-panel.html" &&
  (response.headers.get("Content-Type") || "")
    .toLowerCase()
    .includes("text/html")
) {
  return rewriteLiveChatAdminPwaHtml(response);
}

return response;

  } catch (error) {
    return Response.redirect(
      SITE_ORIGIN,
      302
    );
  }
}

/* =========================================================
   GIVE THE ADMIN PAGE ITS OWN PWA IDENTITY
   Remove the main-site manifest on this page only, then add
   the dedicated Live Chat Admin manifest. All other pages and
   the main Imdade Rohani PWA remain unchanged.
   ========================================================= */

function rewriteLiveChatAdminPwaHtml(response) {
  return new HTMLRewriter()
    .on('link[rel="manifest"]', {
      element(element) {
        element.remove();
      }
    })
    .on("head", {
      element(element) {
        element.append(
          '<link rel="manifest" href="/live-chat-admin-v2.webmanifest">' +
          '<meta name="application-name" content="Imdade Rohani Live Chat Admin">' +
          '<meta name="apple-mobile-web-app-title" content="Live Chat Admin">',
          { html: true }
        );
      }
    })
    .transform(response);
}

/* =========================================================
   KEEP CLEAN URL IN THE BROWSER + REWRITE BLOGGER LINKS
   ========================================================= */

function rewriteCleanBloggerHtml(response, cleanPath) {
  const cleanUrlScript = `
<script>
(function () {
  var cleanPath = ${JSON.stringify(cleanPath)};
  var routeMap = ${JSON.stringify(OLD_BLOGGER_ROUTES)};

  function keepCleanUrl() {
    if (
      window.location.pathname !== cleanPath ||
      window.location.search ||
      window.location.hash
    ) {
      window.history.replaceState(
        window.history.state,
        "",
        cleanPath
      );
    }
  }

  function getCleanLink(href) {
    if (!href) return "";

    try {
      var linkUrl = new URL(href, window.location.origin);

      if (linkUrl.origin !== window.location.origin) return "";

      return routeMap[linkUrl.pathname] || "";
    } catch (_) {
      return "";
    }
  }

  function rewritePageLinks(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var links = scope.querySelectorAll("a[href]");

    for (var i = 0; i < links.length; i++) {
      var mapped = getCleanLink(links[i].getAttribute("href"));

      if (mapped) links[i].setAttribute("href", mapped);
    }
  }

  function showOfflineMessage() {
    window.alert(
      "Yah suvidha istemal karne ke liye internet zaroori hai. Aap offline halat mein sirf page padh sakte hain."
    );
  }

  function isNavigationControl(element) {
    if (!element || !element.closest) return false;

    if (
      element.closest(
        "nav, header, [role='navigation'], .menu, #menu, .navbar, .sidebar, .drawer"
      )
    ) {
      return true;
    }

    var identity = [
      element.id || "",
      element.className || "",
      element.getAttribute("aria-label") || "",
      element.getAttribute("title") || ""
    ].join(" ").toLowerCase();

    return /menu|nav|hamburger|drawer|sidebar/.test(identity);
  }

  function updateOfflineReadingMode() {
    var isOffline = !window.navigator.onLine;
    var banner = document.getElementById("imdaderohani-offline-banner");

    if (!banner) {
      banner = document.createElement("div");
      banner.id = "imdaderohani-offline-banner";
      banner.setAttribute("role", "status");
      banner.style.cssText =
        "position:fixed;left:10px;right:10px;bottom:12px;z-index:2147483647;" +
        "padding:10px 12px;border-radius:10px;background:#7f1d1d;color:#fff;" +
        "font:600 14px/1.5 system-ui;text-align:center;box-shadow:0 4px 18px rgba(0,0,0,.28)";
      banner.textContent =
        "Offline mode: page padh sakte hain, lekin form, download aur online suvidha band hai.";
      document.body.appendChild(banner);
    }

    banner.style.display = isOffline ? "block" : "none";

    var controls = document.querySelectorAll(
      "input, textarea, select, button"
    );

    for (var i = 0; i < controls.length; i++) {
      if (isNavigationControl(controls[i])) {
        continue;
      }

      if (isOffline) {
        if (!controls[i].disabled) {
          controls[i].setAttribute("data-offline-disabled", "1");
          controls[i].disabled = true;
        }
      } else if (controls[i].getAttribute("data-offline-disabled") === "1") {
        controls[i].disabled = false;
        controls[i].removeAttribute("data-offline-disabled");
      }
    }
  }

  keepCleanUrl();
  rewritePageLinks(document);

  document.addEventListener("DOMContentLoaded", function () {
    keepCleanUrl();
    rewritePageLinks(document);
    updateOfflineReadingMode();
  });

  document.addEventListener("submit", function (event) {
    if (!window.navigator.onLine) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showOfflineMessage();
    }
  }, true);

  document.addEventListener("click", function (event) {
    if (!window.navigator.onLine) {
      var actionControl = event.target && event.target.closest
        ? event.target.closest("input, textarea, select, button, [onclick]")
        : null;

      if (
        actionControl &&
        actionControl.tagName !== "A" &&
        !isNavigationControl(actionControl)
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showOfflineMessage();
        return;
      }
    }

    var link = event.target && event.target.closest
      ? event.target.closest("a[href]")
      : null;

    if (!link) return;

    if (!window.navigator.onLine) {
      var offlineUrl;

      try {
        offlineUrl = new URL(link.href, window.location.origin);
      } catch (_) {
        offlineUrl = null;
      }

      if (
        link.hasAttribute("download") ||
        !offlineUrl ||
        offlineUrl.origin !== window.location.origin
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showOfflineMessage();
        return;
      }
    }

    var mapped = getCleanLink(link.getAttribute("href"));

    if (mapped) {
      event.preventDefault();
      window.location.assign(mapped);
    }
  }, true);

  new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      for (var j = 0; j < mutations[i].addedNodes.length; j++) {
        var node = mutations[i].addedNodes[j];

        if (node && node.nodeType === 1) {
          if (node.matches && node.matches("a[href]")) {
            var mapped = getCleanLink(node.getAttribute("href"));
            if (mapped) node.setAttribute("href", mapped);
          }

          rewritePageLinks(node);
        }
      }
    }
  }).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener("pageshow", keepCleanUrl);
  window.addEventListener("online", updateOfflineReadingMode);
  window.addEventListener("offline", updateOfflineReadingMode);
  window.setTimeout(keepCleanUrl, 100);
  window.setTimeout(keepCleanUrl, 700);
  window.setTimeout(keepCleanUrl, 1600);
})();
</script>`;

  return new HTMLRewriter()
    .on("head", {
      element(element) {
        element.append(cleanUrlScript, {
          html: true
        });
      }
    })
    .on("a[href]", {
      element(element) {
        const href = element.getAttribute("href");

        if (!href) return;

        try {
          const linkUrl = new URL(href, SITE_ORIGIN);

          if (linkUrl.origin !== SITE_ORIGIN) return;

          const mappedPath =
            OLD_BLOGGER_ROUTES[linkUrl.pathname];

          if (mappedPath) {
            element.setAttribute("href", mappedPath);
          }
        } catch (_) {
          /* Leave malformed or special links unchanged. */
        }
      }
    })
    .transform(response);
}

/* =========================================================
   CODE NO. PWA-TRACK-4006 — PART 5 END
   ========================================================= */
// BUILD TEST 1
