import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
const balances = new Map();
let totalSupply = 0;
let energyPrice = 100; // 1 STX = 100 units of energy

// Simulated contract functions
function mintEnergy(amount: number, recipient: string) {
  if (recipient !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  const currentBalance = balances.get(recipient) || 0;
  balances.set(recipient, currentBalance + amount);
  totalSupply += amount;
  return true;
}

function buyEnergy(amount: number, buyer: string) {
  const cost = amount * energyPrice;
  if ((balances.get(buyer) || 0) < cost) throw new Error('Insufficient balance');
  balances.set(buyer, (balances.get(buyer) || 0) - cost);
  balances.set('CONTRACT_OWNER', (balances.get('CONTRACT_OWNER') || 0) + cost);
  balances.set(buyer, (balances.get(buyer) || 0) + amount);
  balances.set('CONTRACT_OWNER', (balances.get('CONTRACT_OWNER') || 0) - amount);
  return true;
}

function sellEnergy(amount: number, seller: string) {
  if ((balances.get(seller) || 0) < amount) throw new Error('Insufficient energy balance');
  const payment = amount * energyPrice;
  balances.set(seller, (balances.get(seller) || 0) - amount);
  balances.set('CONTRACT_OWNER', (balances.get('CONTRACT_OWNER') || 0) + amount);
  balances.set(seller, (balances.get(seller) || 0) + payment);
  balances.set('CONTRACT_OWNER', (balances.get('CONTRACT_OWNER') || 0) - payment);
  return true;
}

function setEnergyPrice(newPrice: number, sender: string) {
  if (sender !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  energyPrice = newPrice;
  return true;
}

describe('Vacuum Energy Marketplace Contract', () => {
  beforeEach(() => {
    balances.clear();
    totalSupply = 0;
    energyPrice = 100;
  });
  
  it('should mint energy tokens', () => {
    expect(mintEnergy(1000, 'CONTRACT_OWNER')).toBe(true);
    expect(balances.get('CONTRACT_OWNER')).toBe(1000);
    expect(totalSupply).toBe(1000);
  });
  
  it('should allow buying energy', () => {
    mintEnergy(1000, 'CONTRACT_OWNER');
    balances.set('buyer1', 10000); // 100 STX
    expect(buyEnergy(500, 'buyer1')).toBe(true);
    expect(balances.get('buyer1')).toBe(9500); // 95 STX worth of energy
    expect(balances.get('CONTRACT_OWNER')).toBe(500);
  });
  
  it('should allow selling energy', () => {
    mintEnergy(1000, 'CONTRACT_OWNER');
    balances.set('seller1', 500);
    expect(sellEnergy(500, 'seller1')).toBe(true);
    expect(balances.get('seller1')).toBe(5000); // 50 STX
    expect(balances.get('CONTRACT_OWNER')).toBe(1500);
  });
  
  it('should update energy price', () => {
    expect(setEnergyPrice(150, 'CONTRACT_OWNER')).toBe(true);
    expect(energyPrice).toBe(150);
  });
  
  it('should not allow unauthorized price updates', () => {
    expect(() => setEnergyPrice(150, 'unauthorized_user')).toThrow('Not authorized');
  });
});

