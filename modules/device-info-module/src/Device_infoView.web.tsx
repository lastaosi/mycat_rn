import * as React from 'react';

import { Device_infoViewProps } from './Device_info.types';

export default function Device_infoView(props: Device_infoViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
