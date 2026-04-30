import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './Device_info.types';

type Device_infoModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class Device_infoModule extends NativeModule<Device_infoModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(Device_infoModule, 'Device_infoModule');
