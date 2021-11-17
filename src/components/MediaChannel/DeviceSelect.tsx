import React, { ChangeEvent } from 'react'

type Props = {
  value?: MediaDeviceInfo
  devices: MediaDeviceInfo[]
  onChange: (device: MediaDeviceInfo) => void
}

export const DeviceSelect = ({ value, devices, onChange }: Props) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedDevice = devices.find((device) => device.deviceId === event.target.value)

    if (selectedDevice) {
      onChange(selectedDevice)
    }
  }

  return (
    <select onChange={handleChange}>
      {devices.map((device) => (
        <option
          key={device.deviceId}
          value={device.deviceId}
          selected={value?.deviceId === device.deviceId}
        >
          {device.label}
        </option>
      ))}
    </select>
  )
}
