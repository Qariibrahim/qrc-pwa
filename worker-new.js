/* ========================================================= 
   CODE NO. PWA-TRACK-4001 — PART 1
   IMDADE ROHANI PWA + D1 INSTALL TRACKING WORKER
   ========================================================= */

const SITE_ORIGIN = "https://qrc.imdaderohani.in";

const LOGO_URL =
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhswMSCDL7cBASmV4gtFdF0w9bsk4vP5VtIRxJZYdqwzKCbCP35-cy9oYYCBTjhdhVQjQwS7P-Vdf5Z8PZLIaj-LtPsx6TvGOxdOTmMM-Y_oHvpEWd4JuVdCw9wyn2w-6p0Vdt4QLQXF80Qz-pWfpdX6DaIjlIXgiODrDffCsPdS6-AOIRCmkR0oZXGAuD9/s500/38030.png";

const DEFAULT_APP_VERSION = "2";

/* =========================================================
   MAIN WORKER
   ========================================================= */

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;

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
    ctx.waitUntil(runDailyInactiveCheck(env));
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
            Urgency: "high"
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
      SITE_ORIGIN
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
                        "imdade-rohani-broadcast",

                      url:
                        targetUrl

                    },

                    webpush: {

                      headers: {
                        Urgency: "high"
                      },

                      fcm_options: {
                        link:
                          targetUrl
                      }

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
        SITE_ORIGIN
      );

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
      targetUrl
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

      <div
        class="counter"
        id="counter"
      >
        0 / 500
      </div>

    </div>


    <div class="field">

      <label>
        🔗 Notification Click Link
      </label>

      <input
        id="pushUrl"
        type="url"
        value="${SITE_ORIGIN}"
        placeholder="https://qrc.imdaderohani.in"
      />

    </div>

<div class="field">

  <label>
    🔘 Link Text
  </label>

  <input
    id="pushLinkText"
    maxlength="40"
    value="Abhi Dekhein"
    placeholder="Misal: Abhi Dekhein"
  />

</div>

    <button
      class="send-btn"
      id="sendButton"
      type="button"
    >
      📢 SAB USERS KO NOTIFICATION BHEJEIN
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

  var pushUrl =
    document.getElementById(
      "pushUrl"
    );

var pushLinkText =
  document.getElementById(
    "pushLinkText"
  );

  var sendButton =
    document.getElementById(
      "sendButton"
    );

  var resultBox =
    document.getElementById(
      "result"
    );

  var counter =
    document.getElementById(
      "counter"
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


  function showResult(
    type,
    text
  ) {

    resultBox.className =
      "result " + type;

    resultBox.textContent =
      text;

  }


  sendButton.addEventListener(
    "click",
    async function(){

      var key =
        adminKey.value.trim();

      var title =
        pushTitle.value.trim();

      var message =
        pushMessage.value.trim();

      var url =
        pushUrl.value.trim();


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


      if (!url) {
        url =
          "${SITE_ORIGIN}";
      }


      var confirmed =
        window.confirm(
          "Kya aap ye notification sab active users ko bhejna chahte hain?"
        );


      if (!confirmed) {
        return;
      }


      sendButton.disabled =
        true;

      sendButton.textContent =
        "Notification bheji ja rahi hai...";

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
                    url
                })
            }
          );


        var data =
          await response.json();


        if (
          response.ok &&
          data.success
        ) {

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

        sendButton.disabled =
          false;

        sendButton.textContent =
          "📢 SAB USERS KO NOTIFICATION BHEJEIN";

      }

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
const VERSION = "imdaderohani-pwa-v3";

const PAGE_CACHE =
  VERSION + "-pages";

const STATIC_CACHE =
  VERSION + "-static";

const OFFLINE_URL =
  "/offline.html";


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
          .catch(
            async () =>
              (
                await caches.match(
                  request
                )
              ) ||
              (
                await caches.match(
                  OFFLINE_URL
                )
              )
          )
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
   CODE NO. PUSH-NOTIFICATION-5001 — PART 2
   PUSH RECEIVE + NOTIFICATION CLICK
   ========================================================= */

self.addEventListener(
  "push",
  event => {

    let data = {};

    try {
      data = event.data
        ? event.data.json()
        : {};
    } catch (error) {

      data = {
        title: "Imdade Rohani",
        body: event.data
          ? event.data.text()
          : "Nayi notification mojood hai."
      };

    }

    const title =
      data.title ||
      "Imdade Rohani";

    const options = {

      body:
        data.body ||
        "Imdade Rohani se nayi maloomat mojood hai.",

      icon:
        data.icon ||
        "/pwa-icon-192.png",

      badge:
        data.badge ||
        "/pwa-icon-192.png",

      image:
        data.image || undefined,

      tag:
        data.tag ||
        "imdaderohani-notification",

      renotify: true,

      data: {
        url:
          data.url ||
          "/"
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


/* Notification par click */
self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();

    const targetUrl =
      (
        event.notification.data &&
        event.notification.data.url
      )
        ? event.notification.data.url
        : "/";

    event.waitUntil(

      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true
        })
        .then(windowClients => {

          for (
            const client of windowClients
          ) {

            if (
              client.url === targetUrl &&
              "focus" in client
            ) {
              return client.focus();
            }

          }

          if (
            clients.openWindow
          ) {
            return clients.openWindow(
              targetUrl
            );
          }

        })

    );

  }
);

/* =========================================================
   CODE NO. PUSH-NOTIFICATION-5001 — PART 2 END
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

if (
  completedUpdateVersion &&
  String(completedUpdateVersion) ===
    String(data.latest_version)
) {
  return;
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

        window.location.href =
          data.update_url ||
          "/?pwa_update=1";
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

async function proxyBlogger(
  request
) {
  const incomingUrl =
    new URL(request.url);

  const bloggerUrl =
    new URL(
      incomingUrl.pathname +
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

return response;

  } catch (error) {
    return Response.redirect(
      SITE_ORIGIN,
      302
    );
  }
}

/* =========================================================
   CODE NO. PWA-TRACK-4006 — PART 5 END
   ========================================================= */
// BUILD TEST 1
