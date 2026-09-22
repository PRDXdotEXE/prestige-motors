export type FuelType = 'Gasoline' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid' | 'Diesel';
export type TransmissionType = 'Automatic' | 'Manual' | 'Dual-Clutch';
export type DrivetrainType = 'AWD' | 'RWD' | 'FWD' | '4WD';
export type BodyType = 'Coupe' | 'Sedan' | 'SUV' | 'Convertible' | 'Truck' | 'Wagon';
export type VehicleStatus = 'AVAILABLE' | 'PENDING' | 'SOLD';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  engine: string;
  drivetrain: DrivetrainType;
  bodyType: BodyType;
  exteriorColor: string;
  interiorColor: string;
  vin: string;
  description: string;
  features: string[];
  images: string[];
  featured: boolean;
  status: VehicleStatus;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'CLOSED';

export interface Inquiry {
  id: string;
  vehicleId?: string;
  vehicleTitle?: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export type TestDriveStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface TestDriveRequest {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: TestDriveStatus;
  createdAt: string;
}

export interface AdminStats {
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  totalInquiries: number;
  pendingTestDrives: number;
  totalInventoryValue: number;
}

export interface FilterState {
  search: string;
  make: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  maxMileage: number;
  status: string;
  sortBy: 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'mileage-asc' | 'featured';
}
