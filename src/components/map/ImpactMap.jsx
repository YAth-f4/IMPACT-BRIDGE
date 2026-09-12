import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Input, Select } from '../common/Input';
import StatCard from '../common/StatCard';
import {
  MapPin,
  Search,
  Layers,
  ZoomIn,
  ZoomOut,
  Users,
  HeartHandshake,
  Building2,
  Calendar,
  X,
  ArrowRight,
  Heart,
  Navigation,
  RefreshCw,
  AlertCircle,
  Globe,
  Radio,
  Compass
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

// Popular Indian Metro Presets for Instant Testing/Selection
const CITY_PRESETS = [
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 }
];

const RADIUS_OPTIONS = [
  { label: '1 km', value: 1000, desc: 'Walking Ward' },
  { label: '3 km', value: 3000, desc: 'Local Vicinity' },
  { label: '5 km', value: 5000, desc: 'City Core (Default)' },
  { label: '10 km', value: 10000, desc: 'Metro Zone' },
  { label: '25 km', value: 25000, desc: 'Greater Region' }
];

export default function ImpactMap({ isStandalone = true }) {
  const { locations = [], programs = [], addToast } = useApp();

  // Active View Mode: 'nearby-osm' | 'internal-hubs'
  const [activeTab, setActiveTab] = useState('nearby-osm');

  // ==========================================
  // 1. NEARBY NGO DISCOVERY (OSM / OVERPASS)
  // ==========================================
  const [userCoords, setUserCoords] = useState({ lat: 28.6139, lng: 77.2090 });
  const [locationName, setLocationName] = useState('New Delhi (Preset)');
  const [radius, setRadius] = useState(5000);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoadingNgos, setIsLoadingNgos] = useState(false);
  const [nearbyNgos, setNearbyNgos] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedNgo, setSelectedNgo] = useState(null);

  // Leaflet Map Refs
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const radiusCircleRef = useRef(null);

  // ==========================================
  // 2. PAN-INDIA VERIFIED HUBS (APPLICATION DATABASE)
  // ==========================================
  const [verifiedHubs, setVerifiedHubs] = useState([]);
  const [totalVerifiedCount, setTotalVerifiedCount] = useState(0);
  const [isLoadingVerifiedHubs, setIsLoadingVerifiedHubs] = useState(false);
  const [verifiedHubsError, setVerifiedHubsError] = useState(null);
  const [dynamicCities, setDynamicCities] = useState(['All']);
  const [dynamicStatuses, setDynamicStatuses] = useState(['All', 'Active Hub', 'Completed Site', 'High Alert / Active']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeInternalLocation, setActiveInternalLocation] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Fetch Verified Hubs from our backend database API
  const fetchVerifiedHubs = async () => {
    setIsLoadingVerifiedHubs(true);
    setVerifiedHubsError(null);
    try {
      const response = await fetch('/api/map/verified-hubs');
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load verified hubs.');
      }
      setVerifiedHubs(data.results || []);
      setTotalVerifiedCount(data.totalVerified !== undefined ? data.totalVerified : (data.results ? data.results.length : 0));
      if (data.filterOptions) {
        if (data.filterOptions.cities) setDynamicCities(data.filterOptions.cities);
        if (data.filterOptions.statuses) setDynamicStatuses(data.filterOptions.statuses);
      }
    } catch (err) {
      console.error('[Map] Error fetching verified hubs:', err);
      setVerifiedHubsError(err.message || 'Could not load verified hubs from application database.');
      // Fallback to locations if API is unreachable
      if (locations && locations.length > 0) {
        setVerifiedHubs(locations);
        setTotalVerifiedCount(locations.length);
      }
    } finally {
      setIsLoadingVerifiedHubs(false);
    }
  };

  const filteredInternalLocations = verifiedHubs.filter((loc) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      loc.name.toLowerCase().includes(q) ||
      loc.city.toLowerCase().includes(q) ||
      loc.state.toLowerCase().includes(q) ||
      loc.address.toLowerCase().includes(q) ||
      (loc.programName && loc.programName.toLowerCase().includes(q)) ||
      loc.category.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'All' || loc.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesCity = selectedCity === 'All' || loc.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Active' && loc.status.includes('Active')) ||
      (selectedStatus === 'Completed' && loc.status.includes('Completed')) ||
      loc.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesCategory && matchesCity && matchesStatus;
  });

  // Fetch Nearby NGOs from our Express backend
  const fetchNearbyNgos = async (lat, lng, rad) => {
    setIsLoadingNgos(true);
    setFetchError(null);

    try {
      const response = await fetch(`/api/map/nearby-ngos?lat=${lat}&lng=${lng}&radius=${rad}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to query nearby organizations.');
      }

      setNearbyNgos(data.results || []);
      if (addToast) {
        addToast(`Found ${data.count} organizations near ${locationName}!`, 'success');
      }
    } catch (err) {
      console.error('[Map] Error fetching nearby NGOs:', err);
      setFetchError(err.message || 'Unable to retrieve nearby NGOs. Please try another location.');
      if (addToast) {
        addToast(err.message || 'Error fetching nearby NGOs', 'error');
      }
    } finally {
      setIsLoadingNgos(false);
    }
  };

  // Detect User Location via Browser Geolocation
  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      if (addToast) addToast('Geolocation is not supported by your browser.', 'warning');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = { lat: latitude, lng: longitude };
        setUserCoords(newCoords);
        setLocationName('My GPS Location');
        setIsLocating(false);
        fetchNearbyNgos(latitude, longitude, radius);
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        let msg = 'Could not retrieve your location. Please select a city preset.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access was denied. Switched to preset city.';
        }
        if (addToast) addToast(msg, 'warning');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Initial Fetch on component mount
  useEffect(() => {
    fetchNearbyNgos(userCoords.lat, userCoords.lng, radius);
    fetchVerifiedHubs();
  }, []);

  // Initialize or update Leaflet Map
  useEffect(() => {
    if (activeTab !== 'nearby-osm' || !mapContainerRef.current) return;

    // Initialize map if not yet initialized
    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userCoords.lat, userCoords.lng],
        zoom: 13,
        zoomControl: false
      });

      // OpenStreetMap Tile Layer with standard attribution
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Layer group for NGO markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;
    if (!map) return;

    // Invalidate size in case container size changed
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    // Update or create User Marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background-color: rgba(46, 125, 91, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #F4B942; border: 3px solid #000000; box-shadow: 2px 2px 0px #000; display: flex; align-items: center; justify-content: center; z-index: 10;">
            <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #000000;"></div>
          </div>
          <div style="position: absolute; bottom: -20px; background: #000000; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 1px 6px; border-radius: 4px; white-space: nowrap; box-shadow: 1px 1px 0px rgba(0,0,0,0.5);">YOU ARE HERE</div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup(`
        <div style="padding: 10px; font-family: var(--font-body, sans-serif);">
          <div style="font-weight: 800; font-size: 14px; margin-bottom: 4px;">📍 Your Location</div>
          <div style="font-size: 12px; color: #555;">${locationName}</div>
          <div style="font-size: 11px; color: #888; margin-top: 4px;">Search Radius: ${radius / 1000} km</div>
        </div>
      `);

    // Update or create Radius Circle
    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
    }
    radiusCircleRef.current = L.circle([userCoords.lat, userCoords.lng], {
      radius: radius,
      color: '#2E7D5B',
      weight: 2,
      opacity: 0.8,
      dashArray: '6, 6',
      fillColor: '#A8D5BA',
      fillOpacity: 0.15
    }).addTo(map);

    // Pan map to user location
    map.setView([userCoords.lat, userCoords.lng], radius > 15000 ? 10 : radius > 6000 ? 12 : 13);
  }, [userCoords, radius, activeTab, locationName]);

  // Update NGO Markers when nearbyNgos change
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;

    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    nearbyNgos.forEach((ngo) => {
      // Category color determination
      let pinColor = '#2E7D5B'; // Green for NGO
      if (ngo.category === 'Charity & Relief') pinColor = '#E63946'; // Red
      if (ngo.category === 'Social Support Facility') pinColor = '#3A86FF'; // Blue
      if (ngo.category === 'Community Center') pinColor = '#F4B942'; // Yellow

      const ngoIcon = L.divIcon({
        className: 'custom-ngo-marker',
        html: `
          <div style="position: relative; cursor: pointer; transition: transform 0.15s ease;">
            <div style="
              background-color: ${pinColor};
              color: #FFFFFF;
              border: 2.5px solid #000000;
              box-shadow: 2.5px 2.5px 0px #000000;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              width: 34px;
              height: 34px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="transform: rotate(45deg); font-size: 14px; font-weight: 900;">
                ★
              </div>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34]
      });

      const popupContent = `
        <div style="padding: 14px; font-family: var(--font-body, sans-serif); min-width: 220px; max-width: 280px;">
          <div style="display: inline-block; background-color: #F4B942; color: #000; border: 1.5px solid #000; border-radius: 4px; padding: 2px 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 6px;">
            ${ngo.category}
          </div>
          <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 800; line-height: 1.25; color: #111;">
            ${ngo.name}
          </h4>
          <div style="display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; color: #2E7D5B; margin-bottom: 8px;">
            📍 ${ngo.distanceKm} km away
          </div>
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #555; line-height: 1.4;">
            ${ngo.address}
          </p>
          ${ngo.phone ? `<div style="font-size: 12px; font-weight: 700; margin-bottom: 4px;"><a href="tel:${ngo.phone}" style="color: #2E7D5B; text-decoration: none;">📞 ${ngo.phone}</a></div>` : ''}
          ${ngo.website ? `<div style="font-size: 12px; font-weight: 700; margin-bottom: 8px;"><a href="${ngo.website}" target="_blank" rel="noreferrer" style="color: #3A86FF; text-decoration: underline;">🌐 Website</a></div>` : ''}
          <div style="display: flex; gap: 6px; margin-top: 10px; border-top: 1.5px solid #eee; padding-top: 8px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${ngo.latitude},${ngo.longitude}" target="_blank" rel="noreferrer" style="flex: 1; text-align: center; background: #2E7D5B; color: #fff; border: 1.5px solid #000; border-radius: 4px; padding: 4px 8px; font-size: 11px; font-weight: 800; text-decoration: none; box-shadow: 1.5px 1.5px 0px #000;">
              Get Route
            </a>
            <a href="${ngo.osmUrl}" target="_blank" rel="noreferrer" style="text-align: center; background: #fff; color: #000; border: 1.5px solid #000; border-radius: 4px; padding: 4px 8px; font-size: 11px; font-weight: 800; text-decoration: none; box-shadow: 1.5px 1.5px 0px #000;">
              OSM
            </a>
          </div>
        </div>
      `;

      const marker = L.marker([ngo.latitude, ngo.longitude], { icon: ngoIcon })
        .addTo(markersLayer)
        .bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedNgo(ngo);
      });
    });
  }, [nearbyNgos]);

  // Center map on specific NGO
  const handleFocusNgo = (ngo) => {
    setSelectedNgo(ngo);
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([ngo.latitude, ngo.longitude], 15, { animate: true });
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  // Filtered Nearby NGOs for display list
  const filteredNearbyNgos = nearbyNgos.filter((ngo) => {
    const matchesSearch =
      ngo.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ngo.address.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCat = categoryFilter === 'All' || ngo.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Dynamic distinct categories for filter
  const nearbyCategories = ['All', ...Array.from(new Set(nearbyNgos.map((n) => n.category)))];

  // Helper for internal hub SVGs
  const getCategoryMeta = (category) => {
    switch (category) {
      case 'NGO Center':
        return { color: '#2E7D5B', bg: '#A8D5BA', icon: Building2, label: 'NGO Center' };
      case 'Program':
        return { color: '#F4B942', bg: '#FFF3BF', icon: HeartHandshake, label: 'Active Program' };
      case 'Beneficiary Area':
        return { color: '#3A86FF', bg: '#CBE4FF', icon: Users, label: 'Beneficiary Area' };
      case 'Event':
        return { color: '#E63946', bg: '#FFCCD5', icon: Calendar, label: 'Community Event' };
      default:
        return { color: '#2E7D5B', bg: '#A8D5BA', icon: MapPin, label: 'Location' };
    }
  };

  const getCanvasCoords = (coordinates) => {
    const [lat, lng] = coordinates || [20, 78];
    const minLat = 7.5;
    const maxLat = 35.5;
    const minLng = 68.0;
    const maxLng = 97.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return { x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) };
  };

  return (
    <div className="impact-map-container" style={{ width: '100%' }}>
      {/* Top Mode Toggle Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('nearby-osm')}
            className={`nb-btn ${activeTab === 'nearby-osm' ? 'nb-btn-green' : 'nb-btn-white'}`}
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Radio size={18} strokeWidth={2.5} className={activeTab === 'nearby-osm' ? 'spin-subtle' : ''} />
            <span>🗺️ Nearby NGOs (OpenStreetMap Live)</span>
            <Badge variant="yellow" size="sm">LIVE API</Badge>
          </button>

          <button
            onClick={() => setActiveTab('internal-hubs')}
            className={`nb-btn ${activeTab === 'internal-hubs' ? 'nb-btn-green' : 'nb-btn-white'}`}
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Layers size={18} strokeWidth={2.5} />
            <span>🏢 PAN-INDIA VERIFIED HUBS ({totalVerifiedCount})</span>
            <Badge variant="green" size="sm">DATABASE</Badge>
          </button>
        </div>

        {/* Live Status indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #000',
            padding: '6px 14px',
            borderRadius: '6px',
            boxShadow: '2px 2px 0px #000',
            fontSize: '0.82rem',
            fontWeight: 800
          }}
        >
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2E7D5B', display: 'inline-block' }} />
          <span>{activeTab === 'nearby-osm' ? 'OSM OVERPASS: ONLINE' : `APPLICATION DB: ${totalVerifiedCount} VERIFIED`}</span>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MODE 1: NEARBY NGO DISCOVERY (OPENSTREETMAP LIVE)     */}
      {/* ==================================================== */}
      {activeTab === 'nearby-osm' && (
        <div>
          {/* Quick Location & Radius Control Panel */}
          <Card
            style={{
              padding: '1.25rem',
              marginBottom: '1.5rem',
              backgroundColor: 'var(--white)',
              border: 'var(--border-thick)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Row 1: Geolocation trigger + City Presets */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Button
                    variant="green"
                    size="md"
                    onClick={detectUserLocation}
                    disabled={isLocating}
                    icon={Navigation}
                  >
                    {isLocating ? 'Detecting GPS...' : '🎯 Detect My Location'}
                  </Button>

                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#5A6F64' }}>
                    Or Pick Metro:
                  </span>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {CITY_PRESETS.map((city) => {
                      const isSelected = locationName.includes(city.name);
                      return (
                        <button
                          key={city.name}
                          onClick={() => {
                            setUserCoords({ lat: city.lat, lng: city.lng });
                            setLocationName(`${city.name} (Preset)`);
                            fetchNearbyNgos(city.lat, city.lng, radius);
                          }}
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            border: '2px solid #000',
                            borderRadius: '4px',
                            backgroundColor: isSelected ? 'var(--brand-dark-green)' : '#FFFFFF',
                            color: isSelected ? '#FFFFFF' : '#000000',
                            boxShadow: isSelected ? '2.5px 2.5px 0px #000' : '1.5px 1.5px 0px #000',
                            cursor: 'pointer',
                            transition: 'all 0.1s ease'
                          }}
                        >
                          {city.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  variant="white"
                  size="sm"
                  onClick={() => fetchNearbyNgos(userCoords.lat, userCoords.lng, radius)}
                  disabled={isLoadingNgos}
                  icon={RefreshCw}
                >
                  {isLoadingNgos ? 'Searching...' : 'Refresh'}
                </Button>
              </div>

              {/* Row 2: Search Radius Pill Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  borderTop: '2px solid #E2ECE6',
                  paddingTop: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64' }}>
                    Search Radius:
                  </span>
                  {RADIUS_OPTIONS.map((opt) => {
                    const isSelected = radius === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setRadius(opt.value);
                          fetchNearbyNgos(userCoords.lat, userCoords.lng, opt.value);
                        }}
                        style={{
                          padding: '0.35rem 0.85rem',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          border: '2px solid #000',
                          borderRadius: '4px',
                          backgroundColor: isSelected ? 'var(--accent-yellow)' : '#FFFFFF',
                          color: '#000000',
                          boxShadow: isSelected ? '2.5px 2.5px 0px #000' : '1.5px 1.5px 0px #000',
                          cursor: 'pointer',
                          transition: 'all 0.1s ease'
                        }}
                        title={opt.desc}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Current Location Badge */}
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--brand-dark-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Compass size={16} strokeWidth={2.5} />
                  <span>
                    Focus: <strong>{locationName}</strong> ({userCoords.lat.toFixed(4)}°N, {userCoords.lng.toFixed(4)}°E)
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Map & Live Stats Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: isStandalone ? '600px' : '480px',
              border: 'var(--border-thick)',
              boxShadow: 'var(--shadow-xl)',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '2rem'
            }}
          >
            {/* The Real Leaflet Map Container */}
            <div
              ref={mapContainerRef}
              style={{
                width: '100%',
                height: '100%',
                zIndex: 1
              }}
            />

            {/* Top Legend Overlay on Leaflet */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: 'var(--white)',
                border: '2px solid #000',
                boxShadow: '3px 3px 0px #000',
                borderRadius: '6px',
                padding: '8px 14px',
                zIndex: 500,
                fontSize: '0.8rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                pointerEvents: 'auto'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-dark-green)' }}>
                <Globe size={16} strokeWidth={2.5} />
                <span>OPENSTREETMAP LIVE NGO DISCOVERY</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#5A6F64', marginTop: '2px' }}>
                {isLoadingNgos
                  ? 'Querying Overpass API...'
                  : `Showing ${nearbyNgos.length} NGOs within ${radius / 1000} km of ${locationName}`}
              </div>
            </div>

            {/* Bottom Category Legend on Map */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                backgroundColor: 'var(--white)',
                border: '2px solid #000',
                boxShadow: '3px 3px 0px #000',
                borderRadius: '6px',
                padding: '8px 12px',
                zIndex: 500,
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                pointerEvents: 'auto'
              }}
            >
              {[
                { label: 'Non-Gov Org', color: '#2E7D5B' },
                { label: 'Charity & Relief', color: '#E63946' },
                { label: 'Social Facility', color: '#3A86FF' },
                { label: 'Community Center', color: '#F4B942' }
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 800 }}>
                  <span style={{ width: '10px', height: '10px', backgroundColor: item.color, border: '1.5px solid #000', borderRadius: '50%' }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Loading Indicator Overlay */}
            {isLoadingNgos && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.75)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  zIndex: 1000,
                  backdropFilter: 'blur(2px)'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: 'var(--border-thick)',
                    padding: '1.5rem 2rem',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-xl)',
                    textAlign: 'center'
                  }}
                >
                  <RefreshCw size={36} className="spin-subtle" style={{ color: 'var(--brand-dark-green)', margin: '0 auto 12px auto' }} />
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>
                    Scanning OpenStreetMap
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#5A6F64', margin: '6px 0 0 0' }}>
                    Fetching verified charitable nodes & facilities within {radius / 1000} km...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Filter Bar for Nearby NGOs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem' }}>
                Nearby Organizations ({filteredNearbyNgos.length} found)
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#5A6F64', margin: '2px 0 0 0' }}>
                Sorted by proximity (nearest first). Click any card to inspect and get directions.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ width: '220px' }}>
                <Input
                  placeholder="Filter organizations..."
                  icon={Search}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{ marginBottom: 0 }}
                />
              </div>

              <div style={{ width: '180px' }}>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  options={nearbyCategories.map((c) => ({ value: c, label: c === 'All' ? 'All Categories' : c }))}
                  style={{ marginBottom: 0 }}
                />
              </div>
            </div>
          </div>

          {/* Error Banner if any */}
          {fetchError && (
            <div
              style={{
                backgroundColor: '#FFEBEB',
                border: '2px solid #E63946',
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '2px 2px 0px #000'
              }}
            >
              <AlertCircle size={24} style={{ color: '#E63946', flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600 }}>
                {fetchError}
              </div>
              <Button
                variant="white"
                size="sm"
                onClick={() => fetchNearbyNgos(userCoords.lat, userCoords.lng, radius)}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Results Grid of Nearby NGOs */}
          {filteredNearbyNgos.length > 0 ? (
            <div className="grid-3">
              {filteredNearbyNgos.map((ngo) => (
                <Card
                  key={ngo.id}
                  hover={true}
                  onClick={() => handleFocusNgo(ngo)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    border: selectedNgo?.id === ngo.id ? '3px solid var(--brand-dark-green)' : 'var(--border-thick)',
                    backgroundColor: selectedNgo?.id === ngo.id ? '#F0F7F2' : '#FFFFFF'
                  }}
                >
                  <div>
                    {/* Badge & Distance Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <Badge
                        variant={
                          ngo.category === 'Charity & Relief'
                            ? 'red'
                            : ngo.category === 'Social Support Facility'
                            ? 'blue'
                            : ngo.category === 'Community Center'
                            ? 'yellow'
                            : 'green'
                        }
                        size="sm"
                      >
                        {ngo.category}
                      </Badge>
                      <div
                        style={{
                          backgroundColor: '#000000',
                          color: '#FFFFFF',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        📍 {ngo.distanceKm} km
                      </div>
                    </div>

                    <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                      {ngo.name}
                    </h4>

                    <p style={{ fontSize: '0.82rem', color: '#5A6F64', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                      📍 {ngo.address}
                    </p>

                    {/* Contact details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '0.85rem', fontSize: '0.78rem' }}>
                      {ngo.phone && (
                        <div style={{ color: 'var(--brand-dark-green)', fontWeight: 700 }}>
                          📞 {ngo.phone}
                        </div>
                      )}
                      {ngo.website && (
                        <div>
                          <a
                            href={ngo.website}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{ color: '#3A86FF', textDecoration: 'underline', fontWeight: 700 }}
                          >
                            🌐 Official Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1.5px solid #E2ECE6',
                      paddingTop: '0.75rem',
                      gap: '0.5rem'
                    }}
                  >
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${ngo.latitude},${ngo.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: '0.35rem 0.65rem',
                        backgroundColor: 'var(--brand-dark-green)',
                        color: '#FFFFFF',
                        border: '1.5px solid #000',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                        boxShadow: '1.5px 1.5px 0px #000'
                      }}
                    >
                      Get Directions
                    </a>

                    <span style={{ color: 'var(--brand-dark-green)', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      Focus Pin <ArrowRight size={14} strokeWidth={2.5} />
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                backgroundColor: 'var(--white)',
                border: 'var(--border-thick)'
              }}
            >
              <AlertCircle size={40} style={{ color: '#F4B942', margin: '0 auto 12px auto' }} />
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                No organizations found in {radius / 1000} km radius
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#5A6F64', maxWidth: '460px', margin: '0 auto 1.5rem auto' }}>
                Try expanding your search radius to 10 km or 25 km, or switch to one of the major metro city presets above.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <Button
                  variant="green"
                  size="md"
                  onClick={() => {
                    setRadius(10000);
                    fetchNearbyNgos(userCoords.lat, userCoords.lng, 10000);
                  }}
                >
                  Expand to 10 km
                </Button>
                <Button
                  variant="yellow"
                  size="md"
                  onClick={() => {
                    setRadius(25000);
                    fetchNearbyNgos(userCoords.lat, userCoords.lng, 25000);
                  }}
                >
                  Expand to 25 km
                </Button>
              </div>
            </Card>
          )}

          {/* OpenStreetMap Legal Attribution Notice */}
          <div
            style={{
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: '#F7FAF8',
              border: '1.5px solid #000',
              borderRadius: '6px',
              fontSize: '0.78rem',
              color: '#5A6F64',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div>
              <strong>Map Data Source:</strong> OpenStreetMap contributors via Overpass API. Licensed under{' '}
              <a href="https://opendatacommons.org/licenses/odbl/" target="_blank" rel="noreferrer" style={{ color: 'var(--brand-dark-green)', fontWeight: 700 }}>
                ODbL 1.0
              </a>.
            </div>
            <div>
              <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" style={{ color: 'var(--brand-dark-green)', fontWeight: 700 }}>
                © OpenStreetMap contributors
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODE 2: PAN-INDIA VERIFIED HUBS (APPLICATION DB)    */}
      {/* ==================================================== */}
      {activeTab === 'internal-hubs' && (
        <div>
          {/* Top Summary KPI Cards */}
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            <StatCard
              title="Total Verified Hubs"
              value={formatNumber(totalVerifiedCount)}
              subtitle="Admin-Approved Centers"
              icon={MapPin}
              variant="lightgreen"
            />
            <StatCard
              title="Active Programs"
              value={formatNumber(verifiedHubs.filter((p) => p.status && p.status.includes('Active')).length)}
              subtitle="Monitored in Real-Time"
              icon={Building2}
              variant="yellow"
            />
            <StatCard
              title="Communities Reached"
              value="45,200+"
              subtitle="Across 8 Indian States"
              icon={Users}
              variant="default"
              badgeText="Verified"
            />
            <StatCard
              title="Volunteers Deployed"
              value={formatNumber(verifiedHubs.reduce((acc, l) => acc + (l.volunteers || 0), 0))}
              subtitle="Active on the Ground"
              icon={HeartHandshake}
              variant="green"
            />
          </div>

          {/* Error Banner if any */}
          {verifiedHubsError && (
            <div
              style={{
                backgroundColor: '#FFEBEB',
                border: '2px solid #E63946',
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '2px 2px 0px #000'
              }}
            >
              <AlertCircle size={24} style={{ color: '#E63946', flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600 }}>
                {verifiedHubsError}
              </div>
              <Button variant="white" size="sm" onClick={fetchVerifiedHubs}>
                Retry
              </Button>
            </div>
          )}

          {/* Control Filter Bar */}
          <Card
            style={{
              padding: '1.25rem',
              marginBottom: '1.5rem',
              backgroundColor: 'var(--white)',
              border: 'var(--border-thick)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                {/* Search Input */}
                <div style={{ position: 'relative', width: '100%' }}>
                  <Input
                    placeholder="Search center, program, or city..."
                    icon={Search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: 0 }}
                  />
                </div>

                {/* City Filter (Dynamic from DB) */}
                <Select
                  label=""
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  options={dynamicCities.map((c) => ({ value: c, label: c === 'All' ? 'City: All' : `City: ${c}` }))}
                  style={{ marginBottom: 0 }}
                />

                {/* Status Filter (Dynamic from DB) */}
                <Select
                  label=""
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  options={[
                    { value: 'All', label: 'All Statuses' },
                    ...dynamicStatuses.filter((s) => s !== 'All').map((s) => ({ value: s, label: s }))
                  ]}
                  style={{ marginBottom: 0 }}
                />
              </div>

              {/* Category Filter Badges */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  borderTop: '2px solid #E2ECE6',
                  paddingTop: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64' }}>
                    Filter Category:
                  </span>
                  {['All', 'NGO Center', 'Program', 'Beneficiary Area', 'Event'].map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          padding: '0.35rem 0.85rem',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          textTransform: 'uppercase',
                          border: '2px solid #000000',
                          borderRadius: '4px',
                          backgroundColor: isSelected ? 'var(--brand-dark-green)' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#26332D',
                          boxShadow: isSelected ? '2.5px 2.5px 0px #000' : '1.5px 1.5px 0px #000',
                          cursor: 'pointer',
                          transition: 'all 0.1s ease'
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                    className="nb-btn nb-btn-white nb-btn-sm"
                    title="Zoom in map"
                  >
                    <ZoomIn size={16} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                    className="nb-btn nb-btn-white nb-btn-sm"
                    title="Zoom out map"
                  >
                    <ZoomOut size={16} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => {
                      setZoomLevel(1);
                      setSelectedCategory('All');
                      setSelectedCity('All');
                      setSelectedStatus('All');
                      setSearchQuery('');
                    }}
                    className="nb-btn nb-btn-lightgreen nb-btn-sm"
                  >
                    Reset Map
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Interactive Tactical SVG Map Canvas */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: isStandalone ? '620px' : '480px',
              backgroundColor: '#D6E9DE',
              border: 'var(--border-thick)',
              boxShadow: 'var(--shadow-xl)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            {/* Background Grid Pattern */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  radial-gradient(#2E7D5B 1px, transparent 1px),
                  linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px, 60px 60px, 60px 60px',
                opacity: 0.6
              }}
            />

            {/* Top Legend Badge */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: 'var(--white)',
                border: '2px solid #000',
                boxShadow: '3px 3px 0px #000',
                borderRadius: '6px',
                padding: '8px 12px',
                zIndex: 10,
                fontSize: '0.78rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-dark-green)' }}>
                <Layers size={16} strokeWidth={2.5} />
                <span>APPLICATION DATABASE • VERIFIED HUBS</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#5A6F64', marginTop: '2px' }}>
                Showing {filteredInternalLocations.length} of {totalVerifiedCount} verified hubs across India
              </div>
            </div>

            {/* Bottom Category Legend Pill on Map */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                backgroundColor: 'var(--white)',
                border: '2px solid #000',
                boxShadow: '3px 3px 0px #000',
                borderRadius: '6px',
                padding: '8px 12px',
                zIndex: 10,
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}
            >
              {[
                { label: 'NGO Center', color: '#2E7D5B' },
                { label: 'Program', color: '#F4B942' },
                { label: 'Beneficiary Area', color: '#3A86FF' },
                { label: 'Event', color: '#E63946' }
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 800 }}>
                  <span style={{ width: '10px', height: '10px', backgroundColor: item.color, border: '1.5px solid #000', borderRadius: '50%' }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Zoomable Canvas */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <svg
                viewBox="0 0 1000 1000"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: 0.25,
                  pointerEvents: 'none'
                }}
              >
                <polygon
                  points="300,100 450,140 600,200 650,280 850,300 950,380 880,480 750,450 650,550 580,720 500,880 420,750 350,600 220,480 180,320 280,220"
                  fill="#2E7D5B"
                  stroke="#000000"
                  strokeWidth="6"
                  strokeDasharray="12 6"
                />
              </svg>

              {filteredInternalLocations.map((loc) => {
                const coords = getCanvasCoords(loc.coordinates);
                const meta = getCategoryMeta(loc.category);
                const isSelected = activeInternalLocation?.id === loc.id;
                const Icon = meta.icon;

                return (
                  <div
                    key={loc.id}
                    onClick={() => setActiveInternalLocation(loc)}
                    style={{
                      position: 'absolute',
                      left: `${coords.x}%`,
                      top: `${coords.y}%`,
                      transform: 'translate(-50%, -100%)',
                      cursor: 'pointer',
                      zIndex: isSelected ? 80 : 20,
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: isSelected ? 'var(--accent-yellow)' : meta.color,
                        color: isSelected ? '#000000' : '#FFFFFF',
                        border: '2.5px solid #000000',
                        boxShadow: isSelected ? '4px 4px 0px #000' : '2.5px 2.5px 0px #000',
                        borderRadius: '50% 50% 50% 0',
                        transform: 'rotate(-45deg)',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                      title={`${loc.name} (${loc.city})`}
                    >
                      <div style={{ transform: 'rotate(45deg)' }}>
                        <Icon size={18} strokeWidth={2.8} />
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        border: '1.5px solid #000',
                        borderRadius: '3px',
                        padding: '1px 5px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        marginTop: '4px',
                        boxShadow: '1.5px 1.5px 0px #000',
                        textAlign: 'center'
                      }}
                    >
                      {loc.city}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Marker Modal */}
            {activeInternalLocation && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  right: '12px',
                  maxWidth: '380px',
                  margin: '0 auto',
                  maxHeight: 'calc(100% - 24px)',
                  overflowY: 'auto',
                  backgroundColor: 'var(--white)',
                  border: 'var(--border-thick)',
                  boxShadow: 'var(--shadow-xl)',
                  borderRadius: '8px',
                  zIndex: 90,
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Badge variant="green" size="sm">
                        Verified Hub
                      </Badge>
                      <Badge variant="yellow" size="sm">
                        {activeInternalLocation.category}
                      </Badge>
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', marginTop: '0.35rem' }}>
                      {activeInternalLocation.name}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#5A6F64', fontWeight: 600 }}>
                      📍 {activeInternalLocation.address}
                    </p>
                    <div style={{ fontSize: '0.72rem', color: 'var(--brand-dark-green)', fontWeight: 700, marginTop: '2px' }}>
                      Source: Impact Bridge Database
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveInternalLocation(null)}
                    style={{
                      background: '#FFFFFF',
                      border: '2px solid #000',
                      borderRadius: '4px',
                      padding: '4px',
                      cursor: 'pointer',
                      boxShadow: '2px 2px 0px #000'
                    }}
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--brand-light-green)',
                    border: '1.5px solid #000',
                    borderRadius: '4px',
                    padding: '0.65rem 0.85rem',
                    marginBottom: '0.85rem',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ fontWeight: 800, color: 'var(--brand-dark-green)' }}>
                    PROJECT: {activeInternalLocation.programName}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#26332D', marginTop: '2px' }}>
                    Lead: {activeInternalLocation.lead} • {activeInternalLocation.phone}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: '#F0F7F2', border: '1.5px solid #000', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#5A6F64', textTransform: 'uppercase' }}>Beneficiaries</span>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 900 }}>
                      {formatNumber(activeInternalLocation.beneficiaries)}
                    </p>
                  </div>
                  <div style={{ padding: '0.5rem', backgroundColor: '#FFF3BF', border: '1.5px solid #000', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#5A6F64', textTransform: 'uppercase' }}>Volunteers</span>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 900 }}>
                      {formatNumber(activeInternalLocation.volunteers)}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to="/donation" style={{ flex: 1, textDecoration: 'none' }}>
                    <Button variant="yellow" size="sm" fullWidth icon={Heart}>
                      Sponsor Hub
                    </Button>
                  </Link>
                  <Link to="/volunteer" style={{ flex: 1, textDecoration: 'none' }}>
                    <Button variant="green" size="sm" fullWidth icon={Users}>
                      Volunteer
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Hub Explorer Grid */}
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
                All Verified Ground Centers & Service Areas ({filteredInternalLocations.length})
              </h3>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5A6F64' }}>
                Total Verified: <strong>{totalVerifiedCount}</strong> • Source: <strong>Impact Bridge Database</strong>
              </div>
            </div>

            {/* Empty State */}
            {!isLoadingVerifiedHubs && filteredInternalLocations.length === 0 && (
              <Card
                style={{
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--white)',
                  border: 'var(--border-thick)'
                }}
              >
                <AlertCircle size={40} style={{ color: '#F4B942', margin: '0 auto 12px auto' }} />
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  No verified hubs are currently available.
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#5A6F64', maxWidth: '460px', margin: '0 auto 1.5rem auto' }}>
                  No verified locations match your selected city, category, or search filters.
                </p>
                <Button
                  variant="green"
                  size="sm"
                  onClick={() => {
                    setSelectedCity('All');
                    setSelectedStatus('All');
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </Button>
              </Card>
            )}

            {/* Grid of Verified Hubs */}
            {filteredInternalLocations.length > 0 && (
              <div className="grid-3">
                {filteredInternalLocations.map((loc) => (
                  <Card
                    key={loc.id}
                    hover={true}
                    onClick={() => {
                      setActiveInternalLocation(loc);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '1.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <Badge variant="green" size="sm">
                            Verified
                          </Badge>
                          <Badge
                            variant={loc.category === 'NGO Center' ? 'green' : loc.category === 'Program' ? 'yellow' : 'blue'}
                            size="sm"
                          >
                            {loc.category}
                          </Badge>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5A6F64' }}>
                          {loc.state}
                        </span>
                      </div>

                      <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                        {loc.name}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: '#5A6F64', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                        📍 {loc.address}
                      </p>

                      <div
                        style={{
                          padding: '0.45rem 0.65rem',
                          backgroundColor: '#F0F7F2',
                          border: '1.5px solid #000',
                          borderRadius: '4px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--brand-dark-green)',
                          marginBottom: '0.75rem'
                        }}
                      >
                        {loc.programName}
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1.5px solid #E2ECE6',
                        paddingTop: '0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}
                    >
                      <span>👥 {formatNumber(loc.beneficiaries)} Supported</span>
                      <span style={{ color: 'var(--brand-dark-green)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        Inspect <ArrowRight size={14} strokeWidth={2.5} />
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
