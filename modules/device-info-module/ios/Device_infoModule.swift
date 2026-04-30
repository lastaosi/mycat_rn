import ExpoModulesCore
import UIKit

public class Device_infoModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Device_info")

    AsyncFunction("getDeviceInfo") { () -> [String: Any] in
      let device = UIDevice.current

      #if targetEnvironment(simulator)
      let isSimulator = true
      #else
      let isSimulator = false
      #endif

      return [
        "deviceName": device.name,
        "systemName": device.systemName,
        "systemVersion": device.systemVersion,
        "appVersion": self.getAppVersion(),
        "buildNumber": self.getBuildNumber(),
        "isSimulator": isSimulator
      ]
    }
  }

  private func getAppVersion() -> String {
    return Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "unknown"
  }

  private func getBuildNumber() -> String {
    return Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "unknown"
  }
}