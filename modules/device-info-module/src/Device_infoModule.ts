import { NativeModule, requireNativeModule } from 'expo';
import { DeviceInfo } from './Device_info.types';

declare class Device_infoModule extends NativeModule {
  getDeviceInfo(): Promise<DeviceInfo>;
}

export default requireNativeModule<Device_infoModule>('Device_info');