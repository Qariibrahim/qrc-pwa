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
/* =========================================================
   CODE NO. PWA-TRACK-4006 — PART 1A
   PWA VERSION CHECK API
   ========================================================= */

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
/* =========================================================
   CODE NO. PWA-TRACK-4004 — PART 3A
   SECURE MANUAL INACTIVE CHECK API
   ========================================================= */

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

/* =========================================================
   CODE NO. PWA-TRACK-4006 — PART 2C-1
   PWA UPDATE CLIENT SCRIPT ROUTE
   ========================================================= */

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

/* =========================================================
   CODE NO. PWA-TRACK-4006 — PART 2C-1 END
   ========================================================= */
       
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
        return serveIcon(192);
      }

      if (path === "/pwa-icon-512.png") {
        return serveIcon(512);
      }

      /* Unknown API */
      if (path.startsWith("/api/")) {
        return jsonResponse(
          {
            success: false,
            error: "API endpoint not found."
          },
          404
        );
      }

      /* Other Worker URLs return to Blog */
      return Response.redirect(SITE_ORIGIN, 302);

    } catch (error) {
      return jsonResponse(
        {
          success: false,
          error: "Worker request failed.",
          message: String(
            error && error.message
              ? error.message
              : error
          )
        },
        500
      );

    }
  },

  /* =========================================================
     CODE NO. PWA-TRACK-4004 — PART 1
     DAILY INACTIVE USER CHECK
     ========================================================= */
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(runDailyInactiveCheck(env));
  }
};
/* =========================================================
   EMAILJS DIRECT TEST
   GET /api/pwa/email-test
   ========================================================= */

async function handleEmailTest(request, env) {
  if (request.method !== "GET") {
    return methodNotAllowed("GET");
  }

  if (!env.DB) {
    return databaseMissingResponse();
  }

  const counts = await getPwaCounts(env);

  const emailResult = await sendInstallEmail(
    env,
    {
      device_id: "manual_email_test_001",
      app_version: DEFAULT_APP_VERSION,
      platform: "Manual Browser Test",
      browser: "Google Chrome",
      event_type: "EmailJS Manual Test"
    },
    counts
  );

  return jsonResponse({
    success: Boolean(emailResult.success),
    test: "EmailJS Manual Test",
    email_notification: emailResult,
    checked_at: new Date().toISOString()
  });
}
/* =========================================================
   CODE NO. PWA-TRACK-4004 — PART 3A
   SECURE MANUAL INACTIVE CHECK FUNCTION
   ========================================================= */

async function handleManualInactiveCheck(request, env) {
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
        error: "PWA_ADMIN_KEY secret is missing."
      },
      500
    );
  }

  const url = new URL(request.url);

  const suppliedKey =
    String(
      url.searchParams.get("key") || ""
    ).trim();

  if (
    !suppliedKey ||
    suppliedKey !== String(env.PWA_ADMIN_KEY)
  ) {
    return jsonResponse(
      {
        success: false,
        error: "Unauthorized manual check."
      },
      401
    );
  }

  try {
    console.log(
      "PWA INACTIVE CHECK: Manual check started"
    );

    const counts = await getPwaCounts(env);

    const emailResult = await sendInstallEmail(
      env,
      {
        device_id: "manual_inactive_check",
        app_version: counts.latest_version,
        platform: "Cloudflare Worker",
        browser: "Admin Manual Button",
        event_type: "Manual Inactive Users Check"
      },
      counts
    );

    console.log(
      "PWA INACTIVE CHECK: Manual check completed",
      {
        counts: counts,
        emailResult: emailResult
      }
    );

    return jsonResponse({
      success: true,
      test: "Manual Inactive Users Check",

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
    console.log(
      "PWA INACTIVE CHECK: Manual check failed",
      String(
        error && error.message
          ? error.message
          : error
      )
    );

    return jsonResponse(
      {
        success: false,
        error: "Manual inactive check failed.",
        message: String(
          error && error.message
            ? error.message
            : error
        )
      },
      500
    );
  }
}
/* =========================================================
   API: NEW INSTALLATION
   POST /api/pwa/install
   ========================================================= */

async function handleInstall(request, env) {
   console.log("PWA INSTALL: handleInstall function started");
  if (request.method !== "POST") {
    return methodNotAllowed("POST");
  }

  if (!env.DB) {
    return databaseMissingResponse();
  }

  const body = await readJsonBody(request);

  if (!body) {
    return jsonResponse(
      {
        success: false,
        error: "Valid JSON data is required."
      },
      400
    );
  }

  const deviceId = cleanDeviceId(body.device_id);

  if (!deviceId) {
    return jsonResponse(
      {
        success: false,
        error: "A valid device_id is required."
      },
      400
    );
  }

  const appVersion =
    cleanShortText(body.app_version, 50) ||
    DEFAULT_APP_VERSION;

  const platform =
    cleanShortText(body.platform, 100) ||
    "unknown";

  const browser =
    cleanShortText(body.browser, 100) ||
    "unknown";

  const now = new Date().toISOString();

  const existingUser = await env.DB
    .prepare(
      `
      SELECT
        id,
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

  let isNewInstallation = false;

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
        VALUES (?, ?, ?, ?, 'active', 1, 0, ?, ?, ?, ?)
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

    isNewInstallation = true;

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
            COALESCE(install_count, 1) + 1,
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

  const counts = await getPwaCounts(env);

   console.log("PWA INSTALL: Database saved successfully", {
  deviceId: deviceId,
  isNewInstallation: isNewInstallation,
  counts: counts
});
  /* =====================================================
     CODE NO. PWA-TRACK-4003 — PART 2
     SEND EMAIL AFTER NEW INSTALLATION START
     ===================================================== */

   console.log("PWA INSTALL: Sending EmailJS notification now");
  let emailResult = await sendInstallEmail(
  env,
  {
    device_id: deviceId,
    app_version: appVersion,
    platform: platform,
    browser: browser,
    event_type:
      isNewInstallation
        ? "New PWA Installation"
        : "PWA Reinstallation"
  },
  counts
);
console.log("PWA INSTALL: EmailJS result", emailResult);
  /* =====================================================
     CODE NO. PWA-TRACK-4003 — PART 2
     SEND EMAIL AFTER NEW INSTALLATION END
     ===================================================== */
  return jsonResponse({
    success: true,

    event:
      isNewInstallation
        ? "new_installation"
        : "existing_device_reinstalled",

    is_new_installation: isNewInstallation,

    device_id: deviceId,

    app_version: appVersion,

    total_installations:
      counts.total_installations,

    active_users:
      counts.active_users,

    inactive_users:
      counts.inactive_users,

    latest_version:
      counts.latest_version,

    inactive_days:
      counts.inactive_days,

    recorded_at: now,

email_notification: emailResult
  });
}

/* =========================================================
   API: APP ACTIVITY / LAST ACTIVE
   POST /api/pwa/activity
   ========================================================= */

async function handleActivity(request, env) {
  if (request.method !== "POST") {
    return methodNotAllowed("POST");
  }

  if (!env.DB) {
    return databaseMissingResponse();
  }

  const body = await readJsonBody(request);

  if (!body) {
    return jsonResponse(
      {
        success: false,
        error: "Valid JSON data is required."
      },
      400
    );
  }

  const deviceId = cleanDeviceId(body.device_id);

  if (!deviceId) {
    return jsonResponse(
      {
        success: false,
        error: "A valid device_id is required."
      },
      400
    );
  }

  const appVersion =
    cleanShortText(body.app_version, 50) ||
    DEFAULT_APP_VERSION;

  const platform =
    cleanShortText(body.platform, 100) ||
    "unknown";

  const browser =
    cleanShortText(body.browser, 100) ||
    "unknown";

  const now = new Date().toISOString();

  const existingUser = await env.DB
    .prepare(
      `
      SELECT
        id,
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

  let createdFromActivity = false;
  let wasInactive = false;

  if (!existingUser) {
    /*
      اگر کسی Browser میں appinstalled event محفوظ نہ ہوسکا
      لیکن Installed PWA کھولی گئی تو Activity سے Record بن جائے۔
    */

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
        VALUES (?, ?, ?, ?, 'active', 1, 0, ?, ?, ?, ?)
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

    createdFromActivity = true;

  } else {
    wasInactive =
      String(existingUser.status || "") ===
      "inactive";

    const versionChanged =
      String(existingUser.app_version || "") !==
      appVersion;

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
              THEN COALESCE(update_count, 0) + 1
              ELSE COALESCE(update_count, 0)
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

    /*
      یہ Variable اگلے Gmail Part میں استعمال ہوگا۔
    */
    void versionChanged;
  }

  const counts = await getPwaCounts(env);

  return jsonResponse({
    success: true,
    event: "activity_updated",

    device_id: deviceId,

    created_from_activity:
      createdFromActivity,

    reactivated:
      wasInactive,

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

    force_update:
      counts.force_update,

    inactive_days:
      counts.inactive_days,

    last_active:
      now
  });
}

/* =========================================================
   API: TOTAL STATUS
   GET /api/pwa/status
   Optional:
   ?device_id=DEVICE-ID
   ========================================================= */

async function handleStatus(request, env) {
  if (request.method !== "GET") {
    return methodNotAllowed("GET");
  }

  if (!env.DB) {
    return databaseMissingResponse();
  }

  const url = new URL(request.url);

  const requestedDeviceId =
    cleanDeviceId(
      url.searchParams.get("device_id")
    );

  const counts = await getPwaCounts(env);

  let device = null;

  if (requestedDeviceId) {
    device = await env.DB
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
      .bind(requestedDeviceId)
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

    device,

    checked_at:
      new Date().toISOString()
  });
}

/* =========================================================
   CODE NO. PWA-TRACK-4006 — PART 1B
   PWA VERSION CHECK FUNCTION
   ========================================================= */

async function handleVersionCheck(request, env) {
  if (request.method !== "GET") {
    return methodNotAllowed("GET");
  }

  if (!env.DB) {
    return databaseMissingResponse();
  }

  try {
    const url = new URL(request.url);

    const currentVersion =
      cleanShortText(
        url.searchParams.get("current_version") || "",
        50
      );

    const settings = await env.DB
      .prepare(
        `
          SELECT
            latest_version,
            force_update
          FROM pwa_settings
          WHERE id = 1
          LIMIT 1
        `
      )
      .first();

    const latestVersion =
      String(
        settings &&
        settings.latest_version
          ? settings.latest_version
          : DEFAULT_APP_VERSION
      );

    const forceUpdate =
      Number(
        settings &&
        settings.force_update
          ? settings.force_update
          : 0
      ) === 1;

    const versionProvided =
      Boolean(currentVersion);

    const updateAvailable =
      versionProvided &&
      currentVersion !== latestVersion;

    const updateRequired =
      updateAvailable &&
      forceUpdate;

/* =========================================================
   CODE NO. PWA-TRACK-4006 — PART 2A
   UPDATE POPUP INFORMATION
   ========================================================= */

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
  encodeURIComponent(latestVersion);

/* =========================================================
   CODE NO. PWA-TRACK-4006 — PART 2A INFORMATION END
   ========================================================= */
     
    return jsonResponse({
      success: true,

      current_version:
        currentVersion || null,

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
          String(
            error && error.message
              ? error.message
              : error
          )
      },
      500
    );
  }
}

/* =========================================================
   CODE NO. PWA-TRACK-4006 — PART 1B END
   ========================================================= */

/* =========================================================
   CODE NO. PWA-TRACK-4004 — PART 1
   DAILY INACTIVE USER CHECK FUNCTION
   ========================================================= */


async function runDailyInactiveCheck(env) {
  if (!env || !env.DB) {
    console.log(
      "PWA INACTIVE CHECK: D1 database binding DB is missing"
    );
    return;
  }

  try {
    const counts =
      await getPwaCounts(env);

    const inactiveUsers =
      await getInactiveUsersList(env);

    const inactiveUsersList =
      formatInactiveUsersList(
        inactiveUsers
      );

    let emailResult = {
      success: false,
      skipped: true,
      reason:
        "No inactive users found."
    };

    if (inactiveUsers.length > 0) {
      emailResult =
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
    }

    await env.DB
      .prepare(
        `
          UPDATE pwa_settings
          SET last_report_at = ?
          WHERE id = 1
        `
      )
      .bind(
        new Date().toISOString()
      )
      .run();

    console.log(
      "PWA INACTIVE CHECK: Daily check completed successfully",
      {
        total_installations:
          counts.total_installations,

        active_users:
          counts.active_users,

        inactive_users:
          counts.inactive_users,

        inactive_days:
          counts.inactive_days,

        inactive_list_count:
          inactiveUsers.length,

        email_notification:
          emailResult,

        checked_at:
          new Date().toISOString()
      }
    );

  } catch (error) {
    console.log(
      "PWA INACTIVE CHECK: Failed",
      String(
        error && error.message
          ? error.message
          : error
      )
    );

    throw error;
  }
}
/* =========================================================
   DATABASE COUNTS
   ========================================================= */

async function getPwaCounts(env) {
  const settings = await env.DB
    .prepare(
      `
      SELECT
        latest_version,
        force_update,
        inactive_days,
        last_report_at
      FROM pwa_settings
      WHERE id = 1
      LIMIT 1
      `
    )
    .first();

  const inactiveDays =
    safePositiveInteger(
      settings &&
      settings.inactive_days,
      15
    );

  const cutoffDate = new Date(
    Date.now() -
    inactiveDays *
    24 *
    60 *
    60 *
    1000
  ).toISOString();

  /*
    15 دن پرانے Records کو inactive بنائیں۔
  */

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
        updated_at =
          CASE
            WHEN status <>
              CASE
                WHEN last_active < ?
                THEN 'inactive'
                ELSE 'active'
              END
            THEN ?
            ELSE updated_at
          END
      `
    )
    .bind(
      cutoffDate,
      cutoffDate,
      new Date().toISOString()
    )
    .run();

  const result = await env.DB
    .prepare(
      `
      SELECT
        COUNT(*) AS total_installations,

        COALESCE(
          SUM(
            CASE
              WHEN last_active >= ?
              THEN 1
              ELSE 0
            END
          ),
          0
        ) AS active_users,

        COALESCE(
          SUM(
            CASE
              WHEN last_active < ?
              THEN 1
              ELSE 0
            END
          ),
          0
        ) AS inactive_users

      FROM pwa_users
      `
    )
    .bind(
      cutoffDate,
      cutoffDate
    )
    .first();

  return {
    total_installations:
      Number(
        result &&
        result.total_installations
          ? result.total_installations
          : 0
      ),

    active_users:
      Number(
        result &&
        result.active_users
          ? result.active_users
          : 0
      ),

    inactive_users:
      Number(
        result &&
        result.inactive_users
          ? result.inactive_users
          : 0
      ),

    latest_version:
      String(
        settings &&
        settings.latest_version
          ? settings.latest_version
          : DEFAULT_APP_VERSION
      ),

    force_update:
      Number(
        settings &&
        settings.force_update
          ? settings.force_update
          : 0
      ) === 1,

    inactive_days:
      inactiveDays,

    last_report_at:
      settings
        ? settings.last_report_at
        : null
  };
}

/* =========================================================
   PWA ICON
   ========================================================= */

async function serveIcon(size) {
  const resized = LOGO_URL.replace(
    "/s500/",
    `/s${size}-c/`
  );

  const response = await fetch(resized, {
    cf: {
      cacheEverything: true,
      cacheTtl: 86400
    }
  });

  if (!response.ok) {
    return new Response(
      "PWA icon could not be loaded.",
      {
        status: 500
      }
    );
  }

  const headers =
    new Headers(response.headers);

  headers.set(
    "Content-Type",
    "image/png"
  );

  headers.set(
    "Cache-Control",
    "public, max-age=86400"
  );

  headers.set(
    "Access-Control-Allow-Origin",
    "*"
  );

  headers.set(
    "X-Content-Type-Options",
    "nosniff"
  );

  return new Response(response.body, {
    status: 200,
    headers
  });
}

/* =========================================================
   SERVICE WORKER CODE
   ========================================================= */

function serviceWorkerCode() {
  return `
const VERSION = "imdaderohani-pwa-v2";

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

/* =========================================================
   CODE NO. PWA-TRACK-4006 — PART 2B-1
   ALWAYS FETCH PWA API FROM NETWORK
   ========================================================= */

if (
  requestUrl.pathname.startsWith("/api/")
) {
  event.respondWith(
    fetch(request)
  );

  return;
}

/* =========================================================
   CODE NO. PWA-TRACK-4006 — PART 2B-1 END
   ========================================================= */

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

/* =========================================================
   CODE NO. PWA-TRACK-4006 — PART 2B-2
   PWA UPDATE VERSION MESSAGE HANDLER
   ========================================================= */

self.addEventListener(
  "message",
  event => {

    if (
      !event.data ||
      event.data.type !== "PWA_UPDATE_VERSION"
    ) {
      return;
    }

    const newVersion =
      String(
        event.data.version || ""
      ).trim();

    if (!newVersion) {
      return;
    }

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
  }
);

/* =========================================================
   CODE NO. PWA-TRACK-4006 — PART 2B-2 END
   ========================================================= */

self.addEventListener(
  "message",
  event => {
    if (
      event.data &&
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
   CODE NO. PWA-TRACK-4006 — PART 2C-2
   PWA UPDATE CLIENT POPUP FUNCTION
   ========================================================= */

function pwaUpdateClientCode() {
  return `
(function () {

  const testParams =
  new URLSearchParams(window.location.search);

const savedVersion =
  localStorage.getItem("imdaderohani_pwa_version") || "1";

const CURRENT_VERSION =
  testParams.get("pwa_test_update") === "1"
    ? "0"
    : savedVersion;

  async function checkPwaUpdate() {
    try {
      const response = await fetch(
        "/api/pwa/version?current_version=" +
        encodeURIComponent(CURRENT_VERSION),
        {
          cache: "no-store"
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

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


  function showPwaUpdatePopup(data) {

    if (
      document.getElementById(
        "imdaderohani-pwa-update-overlay"
      )
    ) {
      return;
    }

    const overlay =
      document.createElement("div");

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
      document.createElement("div");

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
      document.createElement("div");

    icon.textContent = "🔄";

    icon.style.cssText = [
      "font-size:48px",
      "margin-bottom:10px"
    ].join(";");


    const title =
      document.createElement("h2");

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
      document.createElement("p");

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
      document.createElement("button");

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

        button.disabled = true;
        button.textContent =
          "اپڈیٹ ہو رہی ہے...";

        try {

          if (
            "serviceWorker" in navigator
          ) {

            const registration =
              await navigator
                .serviceWorker
                .getRegistration();

            if (
              registration &&
              registration.waiting
            ) {
              registration.waiting
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
              registration.active
                .postMessage({
                  type:
                    "PWA_UPDATE_VERSION",
                  version:
                    data.latest_version
                });
            }

            registration?.update().catch(function(error){
  console.log(
    "Service Worker background update failed",
    error
  );
});
          }

        } catch (error) {
          console.log(
            "PWA update action failed",
            error
          );
        }

localStorage.setItem(
  "imdaderohani_pwa_version",
  String(data.latest_version)
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
        document.createElement("button");

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
    document.body.appendChild(overlay);
  }


  if (
    document.readyState === "loading"
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
   CODE NO. PWA-TRACK-4006 — PART 2C-2 END
   ========================================================= */

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
<title>انٹرنیٹ دستیاب نہیں</title>

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
   GENERAL HELPERS
   ========================================================= */

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",

    "Access-Control-Allow-Methods":
      "GET, POST, OPTIONS",

    "Access-Control-Allow-Headers":
      "Content-Type",

    "Access-Control-Max-Age":
      "86400"
  };
}

function jsonResponse(data, status = 200) {
  return new Response(
    JSON.stringify(data, null, 2),
    {
      status,

      headers: {
        ...corsHeaders(),

        "Content-Type":
          "application/json; charset=UTF-8",

        "Cache-Control":
          "no-store, no-cache, must-revalidate",

        "X-Content-Type-Options":
          "nosniff"
      }
    }
  );
}

function methodNotAllowed(allowedMethod) {
  return jsonResponse(
    {
      success: false,

      error:
        "Method not allowed.",

      allowed_method:
        allowedMethod
    },
    405
  );
}

function databaseMissingResponse() {
  return jsonResponse(
    {
      success: false,

      error:
        "D1 database binding is missing.",

      required_binding:
        "DB"
    },
    500
  );
}

async function readJsonBody(request) {
  try {
    const contentType =
      request.headers.get(
        "Content-Type"
      ) || "";

    if (
      !contentType
        .toLowerCase()
        .includes(
          "application/json"
        )
    ) {
      return null;
    }

    return await request.json();

  } catch (error) {
    return null;
  }
}

function cleanDeviceId(value) {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  const cleaned =
    value
      .trim()
      .replace(
        /[^a-zA-Z0-9_-]/g,
        ""
      )
      .slice(0, 150);

  if (
    cleaned.length < 8
  ) {
    return "";
  }

  return cleaned;
}

function cleanShortText(
  value,
  maximumLength
) {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value
    .trim()
    .slice(
      0,
      maximumLength
    );
}

function safePositiveInteger(
  value,
  fallback
) {
  const number =
    Number(value);

  if (
    !Number.isFinite(number) ||
    number < 1
  ) {
    return fallback;
  }

  return Math.floor(number);
}
/* =========================================================
   CODE NO. PWA-TRACK-4003 — PART 1
   EMAILJS INSTALL NOTIFICATION FUNCTION START
   ========================================================= */

async function sendInstallEmail(
  env,
  installation,
  counts
) {
  /*
    چاروں EmailJS Secrets موجود نہ ہوں تو
    Database Tracking جاری رہے گی، Email نہیں بھیجی جائے گی۔
  */

  if (
    !env.EMAILJS_SERVICE_ID ||
    !env.EMAILJS_TEMPLATE_ID ||
    !env.EMAILJS_PUBLIC_KEY ||
    !env.EMAILJS_PRIVATE_KEY
  ) {
    return {
      success: false,
      skipped: true,
      reason: "EmailJS secrets are missing."
    };
  }

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
  installation.event_type ||
  "New PWA Installation",

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
        String(
          installation.inactive_users_list ||
          "Koi inactive user mojood nahi hai."
        ),
      device_id:
        String(
          installation.device_id ||
          "unknown"
        ),

      app_version:
        String(
          installation.app_version ||
          DEFAULT_APP_VERSION
        ),

      platform:
        String(
          installation.platform ||
          "unknown"
        ),

      browser:
        String(
          installation.browser ||
          "unknown"
        ),

      date_time:
        dateTime,

      message:
        [
          "Imdade Rohani App ki nayi installation hui hai.",
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
          "Inactive Users List:",
          String(
            installation.inactive_users_list ||
            "Koi inactive user mojood nahi hai."
          ),
          "Device ID: " +
            String(
              installation.device_id ||
              "unknown"
            ),
          "App version: " +
            String(
              installation.app_version ||
              DEFAULT_APP_VERSION
            ),
          "Platform: " +
            String(
              installation.platform ||
              "unknown"
            ),
          "Browser: " +
            String(
              installation.browser ||
              "unknown"
            ),
          "Date/Time: " + dateTime
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
          JSON.stringify(emailPayload)
      }
    );

    const responseText =
      await response.text();

    if (!response.ok) {
      return {
        success: false,
        skipped: false,
        status: response.status,
        error:
          responseText ||
          "EmailJS request failed."
      };
    }

    return {
      success: true,
      skipped: false,
      status: response.status,
      response:
        responseText || "OK"
    };

  } catch (error) {
    return {
      success: false,
      skipped: false,
      error:
        String(
          error && error.message
            ? error.message
            : error
        )
    };
  }
}

/* =========================================================
   CODE NO. PWA-TRACK-4003 — PART 1
   EMAILJS INSTALL NOTIFICATION FUNCTION END
   ========================================================= */
/* =========================================================
   CODE NO. PWA-TRACK-4005 — PART 1A
   INACTIVE USER DAYS HELPER FUNCTION
   ========================================================= */

function calculateInactiveDays(lastActiveValue) {
  if (!lastActiveValue) {
    return 0;
  }

  const lastActiveDate = new Date(lastActiveValue);

  if (isNaN(lastActiveDate.getTime())) {
    return 0;
  }

  const currentTime = Date.now();
  const lastActiveTime = lastActiveDate.getTime();

  const differenceMilliseconds =
    currentTime - lastActiveTime;

  if (differenceMilliseconds <= 0) {
    return 0;
  }

  return Math.floor(
    differenceMilliseconds /
    (1000 * 60 * 60 * 24)
  );
}

/* =========================================================
   CODE NO. PWA-TRACK-4005 — PART 1A END
   ========================================================= */

/* =========================================================
   CODE NO. PWA-TRACK-4005 — PART 1B
   GET REAL INACTIVE USERS LIST
   ========================================================= */

async function getInactiveUsersList(env) {
  if (!env || !env.DB) {
    return [];
  }

  const settings = await env.DB
    .prepare(
      `
        SELECT inactive_days
        FROM pwa_settings
        WHERE id = 1
        LIMIT 1
      `
    )
    .first();

  const inactiveDaysLimit =
    safePositiveInteger(
      settings && settings.inactive_days,
      15
    );

  const cutoffDate = new Date(
    Date.now() -
    inactiveDaysLimit *
    24 *
    60 *
    60 *
    1000
  ).toISOString();

  const result = await env.DB
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
    .bind(cutoffDate)
    .all();

  const rows =
    result &&
    Array.isArray(result.results)
      ? result.results
      : [];

  return rows.map(user => ({
    device_id:
      String(user.device_id || "unknown"),

    installed_at:
      user.installed_at || null,

    last_active:
      user.last_active || null,

    inactive_days:
      calculateInactiveDays(
        user.last_active
      ),

    app_version:
      String(
        user.app_version ||
        DEFAULT_APP_VERSION
      ),

    status:
      String(user.status || "inactive"),

    install_count:
      Number(user.install_count || 0),

    update_count:
      Number(user.update_count || 0),

    platform:
      String(user.platform || "unknown"),

    browser:
      String(user.browser || "unknown"),

    created_at:
      user.created_at || null,

    updated_at:
      user.updated_at || null
  }));
}

/* =========================================================
   CODE NO. PWA-TRACK-4005 — PART 1B END
   ========================================================= */

/* =========================================================
   CODE NO. PWA-TRACK-4005 — PART 2A
   FORMAT INACTIVE USERS EMAIL LIST
   ========================================================= */

function formatInactiveUsersList(inactiveUsers) {
  if (
    !Array.isArray(inactiveUsers) ||
    inactiveUsers.length === 0
  ) {
    return "Koi inactive user mojood nahi hai.";
  }

  return inactiveUsers
    .map((user, index) => {
      const lastActiveText =
        user && user.last_active
          ? new Date(
              user.last_active
            ).toLocaleString(
              "en-IN",
              {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
              }
            )
          : "Unknown";

      return [
        "━━━━━━━━━━━━━━━━━━",
        "Inactive User No. " +
          String(index + 1),
        "",
        "Device ID: " +
          String(
            user.device_id || "unknown"
          ),
        "Last Active: " +
          lastActiveText,
        "Inactive Days: " +
          String(
            user.inactive_days || 0
          ),
        "App Version: " +
          String(
            user.app_version ||
            DEFAULT_APP_VERSION
          ),
        "Platform: " +
          String(
            user.platform || "unknown"
          ),
        "Browser: " +
          String(
            user.browser || "unknown"
          )
      ].join("\n");
    })
    .join("\n\n");
}

/* =========================================================
   CODE NO. PWA-TRACK-4005 — PART 2A END
   ========================================================= */

/* =========================================================
   CODE NO. PWA-TRACK-4001 — PART 1 END
   ========================================================= */
