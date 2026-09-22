import { Vehicle, Inquiry, TestDriveRequest, AdminStats, FilterState } from '../types';

export const api = {
  async getVehicles(filters?: Partial<FilterState>): Promise<Vehicle[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.make && filters.make !== 'all') params.append('make', filters.make);
      if (filters.bodyType && filters.bodyType !== 'all') params.append('bodyType', filters.bodyType);
      if (filters.fuelType && filters.fuelType !== 'all') params.append('fuelType', filters.fuelType);
      if (filters.transmission && filters.transmission !== 'all') params.append('transmission', filters.transmission);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.minYear) params.append('minYear', filters.minYear.toString());
      if (filters.maxYear) params.append('maxYear', filters.maxYear.toString());
      if (filters.maxMileage) params.append('maxMileage', filters.maxMileage.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
    }

    const res = await fetch(`/api/vehicles?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to fetch inventory vehicles');
    }
    return res.json();
  },

  async getVehicle(id: string): Promise<Vehicle> {
    const res = await fetch(`/api/vehicles/${id}`);
    if (!res.ok) {
      throw new Error(`Vehicle ${id} not found`);
    }
    return res.json();
  },

  async createVehicle(data: Partial<Vehicle>, token: string): Promise<Vehicle> {
    const res = await fetch('/api/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create vehicle');
    }
    return res.json();
  },

  async updateVehicle(id: string, data: Partial<Vehicle>, token: string): Promise<Vehicle> {
    const res = await fetch(`/api/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update vehicle');
    }
    return res.json();
  },

  async deleteVehicle(id: string, token: string): Promise<boolean> {
    const res = await fetch(`/api/vehicles/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.ok;
  },

  async submitInquiry(data: Partial<Inquiry>): Promise<{ success: boolean; inquiry: Inquiry }> {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit inquiry');
    }
    return res.json();
  },

  async getInquiries(token: string): Promise<Inquiry[]> {
    const res = await fetch('/api/inquiries', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch inquiries');
    return res.json();
  },

  async updateInquiryStatus(id: string, status: Inquiry['status'], token: string): Promise<Inquiry> {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update inquiry status');
    return res.json();
  },

  async deleteInquiry(id: string, token: string): Promise<boolean> {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  },

  async submitTestDrive(data: Partial<TestDriveRequest>): Promise<{ success: boolean; testDrive: TestDriveRequest }> {
    const res = await fetch('/api/test-drives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to schedule test drive');
    }
    return res.json();
  },

  async getTestDrives(token: string): Promise<TestDriveRequest[]> {
    const res = await fetch('/api/test-drives', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch test drives');
    return res.json();
  },

  async updateTestDriveStatus(id: string, status: TestDriveRequest['status'], token: string): Promise<TestDriveRequest> {
    const res = await fetch(`/api/test-drives/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update test drive status');
    return res.json();
  },

  async deleteTestDrive(id: string, token: string): Promise<boolean> {
    const res = await fetch(`/api/test-drives/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  },

  async getAdminStats(token: string): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load stats');
    return res.json();
  },

  async adminLogin(password: string): Promise<{ success: boolean; token?: string; message?: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return res.json();
  }
};
