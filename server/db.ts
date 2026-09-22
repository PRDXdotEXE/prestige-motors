import fs from 'fs';
import path from 'path';
import { Vehicle, Inquiry, TestDriveRequest, AdminStats } from '../src/types';
import { initialVehicles, initialInquiries, initialTestDrives } from '../src/data/seedVehicles';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface StoreData {
  vehicles: Vehicle[];
  inquiries: Inquiry[];
  testDrives: TestDriveRequest[];
}

function ensureStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.vehicles)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading store file, falling back to seed data:', err);
  }

  const initialData: StoreData = {
    vehicles: [...initialVehicles],
    inquiries: [...initialInquiries],
    testDrives: [...initialTestDrives]
  };

  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing initial store:', err);
  }

  return initialData;
}

function saveStore(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store:', err);
  }
}

export const db = {
  getVehicles: (): Vehicle[] => {
    const store = ensureStore();
    return store.vehicles;
  },

  getVehicleById: (id: string): Vehicle | undefined => {
    const store = ensureStore();
    return store.vehicles.find(v => v.id === id);
  },

  createVehicle: (data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Vehicle => {
    const store = ensureStore();
    const newVehicle: Vehicle = {
      ...data,
      id: `veh-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.vehicles.unshift(newVehicle);
    saveStore(store);
    return newVehicle;
  },

  updateVehicle: (id: string, data: Partial<Vehicle>): Vehicle | null => {
    const store = ensureStore();
    const index = store.vehicles.findIndex(v => v.id === id);
    if (index === -1) return null;

    const updated = {
      ...store.vehicles[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    store.vehicles[index] = updated;
    saveStore(store);
    return updated;
  },

  deleteVehicle: (id: string): boolean => {
    const store = ensureStore();
    const prevLen = store.vehicles.length;
    store.vehicles = store.vehicles.filter(v => v.id !== id);
    if (store.vehicles.length !== prevLen) {
      saveStore(store);
      return true;
    }
    return false;
  },

  getInquiries: (): Inquiry[] => {
    const store = ensureStore();
    return store.inquiries;
  },

  createInquiry: (data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry => {
    const store = ensureStore();
    const newInquiry: Inquiry = {
      ...data,
      id: `inq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    store.inquiries.unshift(newInquiry);
    saveStore(store);
    return newInquiry;
  },

  updateInquiryStatus: (id: string, status: Inquiry['status']): Inquiry | null => {
    const store = ensureStore();
    const inq = store.inquiries.find(i => i.id === id);
    if (!inq) return null;
    inq.status = status;
    saveStore(store);
    return inq;
  },

  deleteInquiry: (id: string): boolean => {
    const store = ensureStore();
    const prevLen = store.inquiries.length;
    store.inquiries = store.inquiries.filter(i => i.id !== id);
    if (store.inquiries.length !== prevLen) {
      saveStore(store);
      return true;
    }
    return false;
  },

  getTestDrives: (): TestDriveRequest[] => {
    const store = ensureStore();
    return store.testDrives;
  },

  createTestDrive: (data: Omit<TestDriveRequest, 'id' | 'createdAt' | 'status'>): TestDriveRequest => {
    const store = ensureStore();
    const newTd: TestDriveRequest = {
      ...data,
      id: `td-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    store.testDrives.unshift(newTd);
    saveStore(store);
    return newTd;
  },

  updateTestDriveStatus: (id: string, status: TestDriveRequest['status']): TestDriveRequest | null => {
    const store = ensureStore();
    const td = store.testDrives.find(t => t.id === id);
    if (!td) return null;
    td.status = status;
    saveStore(store);
    return td;
  },

  deleteTestDrive: (id: string): boolean => {
    const store = ensureStore();
    const prevLen = store.testDrives.length;
    store.testDrives = store.testDrives.filter(t => t.id !== id);
    if (store.testDrives.length !== prevLen) {
      saveStore(store);
      return true;
    }
    return false;
  },

  getStats: (): AdminStats => {
    const store = ensureStore();
    const totalVehicles = store.vehicles.length;
    const availableVehicles = store.vehicles.filter(v => v.status === 'AVAILABLE').length;
    const soldVehicles = store.vehicles.filter(v => v.status === 'SOLD').length;
    const totalInquiries = store.inquiries.length;
    const pendingTestDrives = store.testDrives.filter(t => t.status === 'PENDING').length;
    const totalInventoryValue = store.vehicles.reduce((sum, v) => sum + (v.status !== 'SOLD' ? v.price : 0), 0);

    return {
      totalVehicles,
      availableVehicles,
      soldVehicles,
      totalInquiries,
      pendingTestDrives,
      totalInventoryValue
    };
  }
};
