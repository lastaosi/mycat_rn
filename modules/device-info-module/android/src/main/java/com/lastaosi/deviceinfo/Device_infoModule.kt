package com.lastaosi.deviceinfo

import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise

class Device_infoModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Device_info")

    AsyncFunction("getDeviceInfo") {
      mapOf(
        "deviceName" to Build.MODEL,
        "systemName" to "Android",
        "systemVersion" to Build.VERSION.RELEASE,
        "appVersion" to getAppVersion(),
        "buildNumber" to getBuildNumber(),
        "isSimulator" to isEmulator()
      )
    }
  }

  private fun getAppVersion(): String {
    return try {
      val context = appContext.reactContext ?: return "unknown"
      val packageInfo = context.packageManager.getPackageInfo(context.packageName, 0)
      packageInfo.versionName ?: "unknown"
    } catch (e: Exception) {
      "unknown"
    }
  }

  private fun getBuildNumber(): String {
    return try {
      val context = appContext.reactContext ?: return "unknown"
      val packageInfo = context.packageManager.getPackageInfo(context.packageName, 0)
      packageInfo.versionCode.toString()
    } catch (e: Exception) {
      "unknown"
    }
  }

  private fun isEmulator(): Boolean {
    return (Build.FINGERPRINT.startsWith("generic")
      || Build.FINGERPRINT.startsWith("unknown")
      || Build.MODEL.contains("google_sdk")
      || Build.MODEL.contains("Emulator")
      || Build.MODEL.contains("Android SDK"))
  }
}