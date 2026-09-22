import { z } from 'zod';

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required').max(50),
  model: z.string().min(1, 'Model is required').max(100),
  year: z.number().int().min(1950, 'Year must be after 1950').max(2030, 'Year cannot exceed 2030'),
  price: z.number().positive('Price must be greater than 0'),
  mileage: z.number().nonnegative('Mileage cannot be negative'),
  fuelType: z.enum(['Gasoline', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'Diesel']),
  transmission: z.enum(['Automatic', 'Manual', 'Dual-Clutch']),
  engine: z.string().min(2, 'Engine description is required'),
  drivetrain: z.enum(['AWD', 'RWD', 'FWD', '4WD']),
  bodyType: z.enum(['Coupe', 'Sedan', 'SUV', 'Convertible', 'Truck', 'Wagon']),
  exteriorColor: z.string().min(1, 'Exterior color is required'),
  interiorColor: z.string().min(1, 'Interior color is required'),
  vin: z.string().length(17, 'VIN must be exactly 17 characters').regex(/^[A-HJ-NPR-Z0-9]{17}$/i, 'Invalid VIN format'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  images: z.array(z.string().url('Must be a valid image URL')).min(1, 'At least one image URL is required'),
  featured: z.boolean().default(false),
  status: z.enum(['AVAILABLE', 'PENDING', 'SOLD']).default('AVAILABLE'),
  location: z.string().min(1, 'Location is required')
});

export const inquirySchema = z.object({
  vehicleId: z.string().optional(),
  vehicleTitle: z.string().optional(),
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid telephone number'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters long')
});

export const testDriveSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle selection is required'),
  vehicleTitle: z.string().min(1, 'Vehicle title is required'),
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(7, 'Phone number is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  message: z.string().optional()
});

export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Password is required')
});
