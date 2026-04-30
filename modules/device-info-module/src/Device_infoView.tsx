import { requireNativeView } from 'expo';
import * as React from 'react';

import { Device_infoViewProps } from './Device_info.types';

const NativeView: React.ComponentType<Device_infoViewProps> =
  requireNativeView('Device_info');

export default function Device_infoView(props: Device_infoViewProps) {
  return <NativeView {...props} />;
}
