import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let lastDeviceId = 0;
const deviceData = new Map();
const deviceOwners = new Map();

// Simulated contract functions
function mintDevice(name: string, description: string, efficiency: number, creator: string) {
  const deviceId = ++lastDeviceId;
  deviceData.set(deviceId, {
    creator,
    name,
    description,
    efficiency,
    creationDate: Date.now()
  });
  deviceOwners.set(deviceId, creator);
  return deviceId;
}

function transferDevice(deviceId: number, sender: string, recipient: string) {
  if (deviceOwners.get(deviceId) !== sender) throw new Error('Not authorized');
  deviceOwners.set(deviceId, recipient);
  return true;
}

describe('Vacuum Energy Device NFT Contract', () => {
  beforeEach(() => {
    lastDeviceId = 0;
    deviceData.clear();
    deviceOwners.clear();
  });
  
  it('should mint a new device NFT', () => {
    const id = mintDevice('Quantum Vacuum Extractor', 'A device to extract energy from quantum vacuum fluctuations', 85, 'creator1');
    expect(id).toBe(1);
    const device = deviceData.get(id);
    expect(device.name).toBe('Quantum Vacuum Extractor');
    expect(device.efficiency).toBe(85);
    expect(deviceOwners.get(id)).toBe('creator1');
  });
  
  it('should transfer device ownership', () => {
    const id = mintDevice('Quantum Vacuum Extractor', 'A device to extract energy from quantum vacuum fluctuations', 85, 'creator1');
    expect(transferDevice(id, 'creator1', 'newowner1')).toBe(true);
    expect(deviceOwners.get(id)).toBe('newowner1');
  });
  
  it('should not allow unauthorized transfers', () => {
    const id = mintDevice('Quantum Vacuum Extractor', 'A device to extract energy from quantum vacuum fluctuations', 85, 'creator1');
    expect(() => transferDevice(id, 'unauthorized_user', 'newowner1')).toThrow('Not authorized');
  });
});

