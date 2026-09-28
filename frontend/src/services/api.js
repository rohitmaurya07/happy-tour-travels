// Frontend API Client for Happy Tour & Travels

export const API_BASE = import.meta.env.VITE_API_BASE || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('happy_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Robust JSON fetch helper that safely handles non-JSON responses,
 * network errors, and returns user-friendly error messages.
 */
async function requestJson(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  
  let res;
  try {
    res = await fetch(url, options);
  } catch (netErr) {
    console.error(`Network fetch failure for ${url}:`, netErr);
    throw new Error('Unable to connect to backend server. Please verify the backend API server is running on port 5000.');
  }

  const rawText = await res.text();
  let data = null;

  if (rawText && rawText.trim().length > 0) {
    try {
      data = JSON.parse(rawText);
    } catch {
      // Non-JSON response (e.g. HTML 404 or proxy error)
      if (res.status === 401) {
        throw new Error('Unauthorized: Invalid credentials or session expired.');
      }
      if (res.status === 404) {
        throw new Error(`Endpoint not found: ${endpoint}`);
      }
      if (res.status >= 500) {
        throw new Error(`Backend server error (${res.status} ${res.statusText || 'Server Error'}). Please check server logs.`);
      }
      throw new Error(`Invalid server response (${res.status}). Expected JSON.`);
    }
  }

  if (!res.ok || (data && data.success === false)) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${res.status} (${res.statusText || 'Error'})`;
    throw new Error(errorMsg);
  }

  return data;
}

// 1. Public Site Data
export const fetchPublicSiteData = async () => {
  const data = await requestJson('/api/site-data');
  return data?.data;
};

// 2. Authoritative Fare Calculation APIs
export const calculateFareApi = async (payload) => {
  const data = await requestJson('/api/fare/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.fare;
};

export const calculateAllFaresApi = async (payload) => {
  const data = await requestJson('/api/fare/calculate-all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data;
};

// 3. Bookings APIs
export const createBookingApi = async (payload) => {
  const data = await requestJson('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.booking;
};

export const getBookingApi = async (id) => {
  const data = await requestJson(`/api/bookings/${encodeURIComponent(id)}`);
  return data.booking;
};

// 4. Admin Authentication
export const adminLogin = async (username, password) => {
  const data = await requestJson('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return data;
};

export const adminVerify = async () => {
  const data = await requestJson('/api/admin/me', {
    headers: { ...getAuthHeaders() }
  });
  return data?.user;
};

export const adminChangePassword = async ({ currentPassword, newUsername, newPassword }) => {
  const data = await requestJson('/api/admin/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ currentPassword, newUsername, newPassword })
  });
  return data;
};

// 5. File Uploads
export const uploadMediaFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const data = await requestJson('/api/admin/upload', {
    method: 'POST',
    headers: {
      ...getAuthHeaders()
    },
    body: formData
  });
  return data.url;
};

// 6. Site Config & Settings
export const updateSiteConfig = async (config) => {
  const data = await requestJson('/api/admin/site-config', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(config)
  });
  return data.data;
};

export const updatePricingSettings = async (settings) => {
  const data = await requestJson('/api/admin/pricing-settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(settings)
  });
  return data.data;
};

export const updateMediaSettings = async (settings) => {
  const data = await requestJson('/api/admin/media-settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(settings)
  });
  return data.data;
};

// 7. Fleet Operations
export const addFleetVehicle = async (vehicle) => {
  const data = await requestJson('/api/admin/fleet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(vehicle)
  });
  return data.data;
};

export const updateFleetVehicle = async (id, vehicle) => {
  const data = await requestJson(`/api/admin/fleet/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(vehicle)
  });
  return data.data;
};

export const deleteFleetVehicle = async (id) => {
  await requestJson(`/api/admin/fleet/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
  return true;
};

export const updateAllVehiclePricing = async (fleetList) => {
  const data = await requestJson('/api/admin/vehicle-pricing-all', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ fleetList })
  });
  return data.data;
};

export const previewFareAdminApi = async (payload) => {
  const data = await requestJson('/api/admin/preview-fare', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(payload)
  });
  return data.fare;
};

// 8. Pricing Routes Management (Fixed Fares & Classifications)
export const fetchPricingRoutes = async () => {
  const data = await requestJson('/api/admin/pricing-routes', {
    headers: { ...getAuthHeaders() }
  });
  return data.data;
};

export const addPricingRoute = async (route) => {
  const data = await requestJson('/api/admin/pricing-routes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(route)
  });
  return data.data;
};

export const updatePricingRoute = async (id, route) => {
  const data = await requestJson(`/api/admin/pricing-routes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(route)
  });
  return data.data;
};

export const deletePricingRoute = async (id) => {
  await requestJson(`/api/admin/pricing-routes/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
  return true;
};

// 9. Admin Bookings Inspection
export const fetchAdminBookings = async () => {
  const data = await requestJson('/api/admin/bookings', {
    headers: { ...getAuthHeaders() }
  });
  return data.data;
};

export const updateBookingStatus = async (id, status) => {
  const data = await requestJson(`/api/admin/bookings/${encodeURIComponent(id)}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ status })
  });
  return data.data;
};

// 10. Packages Operations
export const addPackage = async (pkg) => {
  const data = await requestJson('/api/admin/packages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(pkg)
  });
  return data.data;
};

export const updatePackage = async (id, pkg) => {
  const data = await requestJson(`/api/admin/packages/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(pkg)
  });
  return data.data;
};

export const deletePackage = async (id) => {
  await requestJson(`/api/admin/packages/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
  return true;
};

// 11. Services Operations
export const addService = async (service) => {
  const data = await requestJson('/api/admin/services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(service)
  });
  return data.data;
};

export const updateService = async (id, service) => {
  const data = await requestJson(`/api/admin/services/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(service)
  });
  return data.data;
};

export const deleteService = async (id) => {
  await requestJson(`/api/admin/services/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
  return true;
};

// 12. Routes & Locations Operations
export const updatePopularRoutes = async (popularRoutes) => {
  const data = await requestJson('/api/admin/routes', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ popularRoutes })
  });
  return data.data;
};

export const updatePopularLocations = async (popularLocations) => {
  const data = await requestJson('/api/admin/locations', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ popularLocations })
  });
  return data.data;
};

export const updateHourlyRentalPricing = async (hourlyPricing) => {
  const data = await requestJson('/api/admin/hourly-rental-pricing', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(hourlyPricing)
  });
  return data.data;
};
