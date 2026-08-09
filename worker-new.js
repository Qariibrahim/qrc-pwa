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
      "Daily Inactive Users Report";

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

  const appVersion =
    normalizeVersion(
      body.app_version
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

    createdFromActivity =
      true;

  } else {
    wasInactive =
      cleanText(
        existingUser.status
      ) === "inactive";

    versionChanged =
      normalizeVersion(
        existingUser.app_version
      ) !== appVersion;

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
        appVersion,
        appVersion,
        platform,
        browser,
        now,
        deviceId
      )
      .run();

    if (versionChanged) {
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

    const currentVersion =
      normalizeVersion(
        url.searchParams.get(
          "current_version"
        ) || ""
      );

    const settings =
      await getPwaSettings(env);

    const latestVersion =
      normalizeVersion(
        settings.latest_version
      );

    const forceUpdate =
      Number(
        settings.force_update
      ) === 1;

    const versionProvided =
      Boolean(
        url.searchParams.get(
          "current_version"
        )
      );

    const updateAvailable =
      versionProvided &&
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

    const showUpdatePopup =
      updateAvailable;

    const allowDismiss =
      !updateRequired;

    const updateUrl =
      SITE_ORIGIN +
      "/?pwa_update=1&version=" +
      encodeURIComponent(
        latestVersion
      );

    return jsonResponse({
      success: true,

      current_version:
        versionProvided
          ? currentVersion
          : null,

      latest_version:
        latestVersion,

      version_provided:
        versionProvided,

      update_available:
        updateAvailable,

      force_update:
        forceUpdate,

      update_required:
        updateRequired,

      show_update_popup:
        showUpdatePopup,

      allow_dismiss:
        allowDismiss,

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
   AUTOMATIC DAILY INACTIVE CHECK
   ========================================================= */

async function runDailyInactiveCheck(
  env
) {
  if (!env || !env.DB) {
    return;
  }

  try {
    await markInactiveUsers(env);

    const counts =
      await getPwaCounts(env);

    const inactiveUsers =
      await getInactiveUsersList(env);

    if (
      inactiveUsers.length === 0
    ) {
      return;
    }

    const inactiveUsersList =
      formatInactiveUsersList(
        inactiveUsers
      );

    await sendInstallEmail(
      env,
      {
        device_id:
          "daily_inactive_check",

        app_version:
          counts.latest_version,

        platform:
          "Cloudflare Worker",

        browser:
          "Automatic Daily Cron",

        event_type:
          "Daily Inactive Users Report",

        inactive_users_list:
          inactiveUsersList
      },
      counts
    );

  } catch (error) {
    console.log(
      "Daily inactive check failed:",
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
  ) || "1";

const currentDeviceId =
  localStorage.getItem(
    "irPwaDeviceId"
  ) || "";

const TEST_DEVICE_ID =
  "ir_ea8318d816f54237a4fcfad94ef85e85";

const singleDeviceTestDone =
  localStorage.getItem(
    "irPwaSingleUpdateTestDone"
  ) === "1";

const currentVersion =
  currentDeviceId === TEST_DEVICE_ID &&
  !singleDeviceTestDone
    ? "0"
    : savedVersion;

  async function checkPwaUpdate() {
    try {
      const response =
        await fetch(
          "/api/pwa/version?current_version=" +
          encodeURIComponent(
            currentVersion
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

if (currentDeviceId === TEST_DEVICE_ID) {
  localStorage.setItem(
    "irPwaSingleUpdateTestDone",
    "1"
  );
}

try {
  await fetch(
    "/api/pwa/activity",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        device_id: currentDeviceId,
        app_version: String(
          data.latest_version
        ),
        platform: "Android PWA",
        browser: "Google Chrome"
      })
    }
  );
} catch (error) {
  console.log(
    "PWA update activity failed",
    error
  );
}

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
