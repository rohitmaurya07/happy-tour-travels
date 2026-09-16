// Frontend API Client for Happy Tour & Travels

export const API_BASE = import.meta.env.VITE_API_BASE || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('happy_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 1. Public Site Data
export const fetchPublicSiteData = async () => {
  const res = await fetch(`${API_BASE}/api/site-data`);
  if (!res.ok) throw new Error('Failed to fetch site data');
  const data = await res.json();
  return data.data;
};

// 2. Authoritative Fare Calculation APIs
export const calculateFareApi = async (payload) => {
  const res = await fetch(`${API_BASE}/api/fare/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to calculate fare');
  }
  return data.fare;
};

export const calculateAllFaresApi = async (payload) => {
  const res = await fetch(`${API_BASE}/api/fare/calculate-all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to calculate fares');
  }
  return data;
};

// 3. Bookings APIs
export const createBookingApi = async (payload) => {
  const res = await fetch(`${API_BASE}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to create booking');
  }
  return data.booking;
};

export const getBookingApi = async (id) => {
  const res = await fetch(`${API_BASE}/api/bookings/${encodeURIComponent(id)}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to retrieve booking');
  }
  return data.booking;
};

// 4. Admin Authentication
export const adminLogin = async (username, password) => {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};

export const adminVerify = async () => {
  const res = await fetch(`${API_BASE}/api/admin/me`, {
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) throw new Error('Unauthorized');
  const data = await res.json();
  return data.user;
};

export const adminChangePassword = async ({ currentPassword, newUsername, newPassword }) => {
  const res = await fetch(`${API_BASE}/api/admin/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ currentPassword, newUsername, newPassword })
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to update password');
  }
  return data;
};

// 5. File Uploads
export const uploadMediaFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/api/admin/upload`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders()
    },
    body: formData
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Upload failed');
  }
  return data.url;
};

// 6. Site Config & Settings
export const updateSiteConfig = async (config) => {
  const res = await fetch(`${API_BASE}/api/admin/site-config`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(config)
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update site config');
  return data.data;
};

export const updatePricingSettings = async (settings) => {
  const res = await fetch(`${API_BASE}/api/admin/pricing-settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(settings)
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update pricing');
  return data.data;
};

export const updateMediaSettings = async (settings) => {
  const res = await fetch(`${API_BASE}/api/admin/media-settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(settings)
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update media settings');
  return data.data;
};

// 7. Fleet Operations
export const addFleetVehicle = async (vehicle) => {
  const res = await fetch(`${API_BASE}/api/admin/fleet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(vehicle)
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to add vehicle');
  return data.data;
};

export const updateFleetVehicle = async (id, vehicle) => {
  const res = await fetch(`${API_BASE}/api/admin/fleet/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(vehicle)
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update vehicle');
  return data.data;
};

export const deleteFleetVehicle = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/fleet/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete vehicle');
  return true;
};

// 8. Pricing Routes Management (Fixed Fares & Classifications)
export const fetchPricingRoutes = async () => {
  const res = await fetch(`${API_BASE}/api/admin/pricing-routes`, {
    headers: { ...getAuthHeaders() }
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch pricing routes');
  return data.data;
};

export const addPricingRoute = async (route) => {
  const res = await fetch(`${API_BASE}/api/admin/pricing-routes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(route)
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to add pricing route');
  return data.data;
};

export const updatePricingRoute = async (id, route) => {
  const res = await fetch(`${API_BASE}/api/admin/pricing-routes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(route)
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update pricing route');
  return data.data;
};

export const deletePricingRoute = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/pricing-routes/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete pricing route');
  return true;
};

// 9. Admin Bookings Inspection
export const fetchAdminBookings = async () => {
  const res = await fetch(`${API_BASE}/api/admin/bookings`, {
    headers: { ...getAuthHeaders() }
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch bookings');
  return data.data;
};

export const updateBookingStatus = async (id, status) => {
  const res = await fetch(`${API_BASE}/api/admin/bookings/${encodeURIComponent(id)}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update booking status');
  return data.data;
};

// 10. Packages Operations
export const addPackage = async (pkg) => {
  const res = await fetch(`${API_BASE}/api/admin/packages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(pkg)
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to add package');
  return data.data;
};

export const updatePackage = async (id, pkg) => {
  const res = await fetch(`${API_BASE}/api/admin/packages/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(pkg)
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update package');
  return data.data;
};

export const deletePackage = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/packages/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete package');
  return true;
};

// 11. Services Operations
export const addService = async (service) => {
  const res = await fetch(`${API_BASE}/api/admin/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(service)
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to add service');
  return data.data;
};

export const updateService = async (id, service) => {
  const res = await fetch(`${API_BASE}/api/admin/services/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(service)
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update service');
  return data.data;
};

export const deleteService = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/services/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete service');
  return true;
};

// 12. Routes & Locations Operations
export const updatePopularRoutes = async (popularRoutes) => {
  const res = await fetch(`${API_BASE}/api/admin/routes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ popularRoutes })
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update routes');
  return data.data;
};

export const updatePopularLocations = async (popularLocations) => {
  const res = await fetch(`${API_BASE}/api/admin/locations`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ popularLocations })
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update locations');
  return data.data;
};
