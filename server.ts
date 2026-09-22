import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { vehicleSchema, inquirySchema, testDriveSchema } from './src/lib/validations';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const AUTH_TOKEN = 'pm_admin_session_token_secure_9841';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', dealership: 'Prestige Motors', time: new Date().toISOString() });
  });

  // Admin Auth
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      return res.json({ success: true, token: AUTH_TOKEN, user: { name: 'Dealership Manager', role: 'admin' } });
    }
    return res.status(401).json({ success: false, message: 'Invalid administrative password' });
  });

  app.get('/api/admin/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader === `Bearer ${AUTH_TOKEN}`) {
      return res.json({ valid: true });
    }
    return res.status(401).json({ valid: false });
  });

  // Admin Stats
  app.get('/api/admin/stats', (req, res) => {
    const stats = db.getStats();
    res.json(stats);
  });

  // Vehicles API
  app.get('/api/vehicles', (req, res) => {
    let vehicles = db.getVehicles();

    const {
      search,
      make,
      bodyType,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      maxMileage,
      status,
      featured,
      sortBy
    } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      vehicles = vehicles.filter(v =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.engine.toLowerCase().includes(q) ||
        v.vin.toLowerCase().includes(q) ||
        v.exteriorColor.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q)
      );
    }

    if (make && typeof make === 'string' && make !== 'all') {
      vehicles = vehicles.filter(v => v.make.toLowerCase() === make.toLowerCase());
    }

    if (bodyType && typeof bodyType === 'string' && bodyType !== 'all') {
      vehicles = vehicles.filter(v => v.bodyType.toLowerCase() === bodyType.toLowerCase());
    }

    if (fuelType && typeof fuelType === 'string' && fuelType !== 'all') {
      vehicles = vehicles.filter(v => v.fuelType.toLowerCase() === fuelType.toLowerCase());
    }

    if (transmission && typeof transmission === 'string' && transmission !== 'all') {
      vehicles = vehicles.filter(v => v.transmission.toLowerCase() === transmission.toLowerCase());
    }

    if (status && typeof status === 'string' && status !== 'all') {
      vehicles = vehicles.filter(v => v.status === status);
    }

    if (featured === 'true') {
      vehicles = vehicles.filter(v => v.featured);
    }

    if (minPrice) {
      vehicles = vehicles.filter(v => v.price >= Number(minPrice));
    }

    if (maxPrice) {
      vehicles = vehicles.filter(v => v.price <= Number(maxPrice));
    }

    if (minYear) {
      vehicles = vehicles.filter(v => v.year >= Number(minYear));
    }

    if (maxYear) {
      vehicles = vehicles.filter(v => v.year <= Number(maxYear));
    }

    if (maxMileage) {
      vehicles = vehicles.filter(v => v.mileage <= Number(maxMileage));
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        vehicles.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        vehicles.sort((a, b) => b.price - a.price);
        break;
      case 'year-desc':
        vehicles.sort((a, b) => b.year - a.year);
        break;
      case 'year-asc':
        vehicles.sort((a, b) => a.year - b.year);
        break;
      case 'mileage-asc':
        vehicles.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'featured':
      default:
        vehicles.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    res.json(vehicles);
  });

  app.get('/api/vehicles/:id', (req, res) => {
    const vehicle = db.getVehicleById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  });

  app.post('/api/vehicles', (req, res) => {
    try {
      const parsed = vehicleSchema.parse(req.body);
      const created = db.createVehicle(parsed);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message || 'Validation failed' });
    }
  });

  app.put('/api/vehicles/:id', (req, res) => {
    try {
      const updated = db.updateVehicle(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Update failed' });
    }
  });

  app.delete('/api/vehicles/:id', (req, res) => {
    const success = db.deleteVehicle(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ success: true, message: 'Vehicle removed from inventory' });
  });

  // Inquiries API
  app.get('/api/inquiries', (req, res) => {
    const inquiries = db.getInquiries();
    res.json(inquiries);
  });

  app.post('/api/inquiries', (req, res) => {
    try {
      const parsed = inquirySchema.parse(req.body);
      const created = db.createInquiry(parsed);
      res.status(201).json({ success: true, inquiry: created });
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message || 'Validation failed' });
    }
  });

  app.patch('/api/inquiries/:id', (req, res) => {
    const { status } = req.body;
    if (!status || !['NEW', 'CONTACTED', 'CLOSED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const updated = db.updateInquiryStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.json(updated);
  });

  app.delete('/api/inquiries/:id', (req, res) => {
    const success = db.deleteInquiry(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.json({ success: true });
  });

  // Test Drives API
  app.get('/api/test-drives', (req, res) => {
    const testDrives = db.getTestDrives();
    res.json(testDrives);
  });

  app.post('/api/test-drives', (req, res) => {
    try {
      const parsed = testDriveSchema.parse(req.body);
      const created = db.createTestDrive(parsed);
      res.status(201).json({ success: true, testDrive: created });
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message || 'Validation failed' });
    }
  });

  app.patch('/api/test-drives/:id', (req, res) => {
    const { status } = req.body;
    if (!status || !['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const updated = db.updateTestDriveStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Test drive request not found' });
    }
    res.json(updated);
  });

  app.delete('/api/test-drives/:id', (req, res) => {
    const success = db.deleteTestDrive(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Test drive request not found' });
    }
    res.json({ success: true });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Prestige Motors server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
