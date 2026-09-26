import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import ImpactMapModule from '../../components/map/ImpactMap';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { SkeletonTableRow } from '../../components/common/Skeleton';
import { Input, Select } from '../../components/common/Input';
import {
  MapPin,
  Plus,
  ShieldCheck,
  Edit2,
  Trash2,
  Search,
  Building2,
  RefreshCw,
  Phone,
  UserCheck,
  X
} from 'lucide-react';

export default function ImpactMapAdmin() {
  const {
    locations: fallbackLocations,
    addLocation,
    programs,
    fetchAdminVerifiedHubs,
    createAdminVerifiedHub,
    updateAdminVerifiedHub,
    deleteAdminVerifiedHub
  } = useApp();

  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [addPinModalOpen, setAddPinModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedHub, setSelectedHub] = useState(null);

  const [pinForm, setPinForm] = useState({
    name: '',
    category: 'NGO Center',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'FC Road Innovation Center, Pune 411005',
    latitude: 18.5204,
    longitude: 73.8567,
    programName: 'GyanSetu: Digital Classrooms',
    beneficiaries: 1200,
    volunteers: 30,
    status: 'Active Hub',
    phone: '+91 20 2553 1122',
    lead: 'Vikramjit Singh'
  });

  const loadHubs = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminVerifiedHubs();
      if (res && res.hubs && res.hubs.length > 0) {
        setHubs(res.hubs);
      } else if (fallbackLocations && fallbackLocations.length > 0) {
        setHubs(fallbackLocations);
      } else {
        setHubs([]);
      }
    } catch {
      setHubs(fallbackLocations || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHubs();
  }, []);

  const effectiveHubs = hubs.length > 0 ? hubs : (fallbackLocations || []);

  const filteredHubs = effectiveHubs.filter((h) => {
    const name = h.name || '';
    const city = h.city || '';
    const lead = h.lead || '';
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || h.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setPinForm({
      name: '',
      category: 'NGO Center',
      city: 'Pune',
      state: 'Maharashtra',
      address: 'FC Road Innovation Center, Pune 411005',
      latitude: 18.5204,
      longitude: 73.8567,
      programName: programs[0]?.title || 'GyanSetu: Digital Classrooms',
      beneficiaries: 1200,
      volunteers: 30,
      status: 'Active Hub',
      phone: '+91 20 2553 1122',
      lead: 'Vikramjit Singh'
    });
    setAddPinModalOpen(true);
  };

  const handleOpenEdit = (hub) => {
    setSelectedHub(hub);
    setPinForm({
      name: hub.name,
      category: hub.category || 'NGO Center',
      city: hub.city || '',
      state: hub.state || '',
      address: hub.address || '',
      latitude: hub.latitude || (hub.coordinates ? hub.coordinates[0] : 18.5204),
      longitude: hub.longitude || (hub.coordinates ? hub.coordinates[1] : 73.8567),
      programName: hub.programName || '',
      beneficiaries: hub.beneficiaries || 0,
      volunteers: hub.volunteers || 0,
      status: hub.status || 'Active Hub',
      phone: hub.phone || '',
      lead: hub.lead || ''
    });
    setEditModalOpen(true);
  };

  const handleOpenDelete = (hub) => {
    setSelectedHub(hub);
    setDeleteModalOpen(true);
  };

  const handleSavePin = async (e) => {
    e.preventDefault();
    if (!pinForm.name) return;

    const payload = {
      ...pinForm,
      beneficiaries: Number(pinForm.beneficiaries),
      volunteers: Number(pinForm.volunteers),
      latitude: Number(pinForm.latitude),
      longitude: Number(pinForm.longitude),
      coordinates: [Number(pinForm.latitude), Number(pinForm.longitude)],
      isVerified: true,
      verificationStatus: 'Verified',
      source: 'Impact Bridge'
    };

    try {
      const res = await createAdminVerifiedHub(payload);
      if (res && res.success && res.data) {
        setHubs((prev) => [res.data, ...prev]);
      } else {
        addLocation(payload);
        setHubs((prev) => [payload, ...prev]);
      }
    } catch {
      addLocation(payload);
    }
    setAddPinModalOpen(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!pinForm.name || !selectedHub) return;

    const updates = {
      ...pinForm,
      beneficiaries: Number(pinForm.beneficiaries),
      volunteers: Number(pinForm.volunteers),
      latitude: Number(pinForm.latitude),
      longitude: Number(pinForm.longitude),
      coordinates: [Number(pinForm.latitude), Number(pinForm.longitude)]
    };

    try {
      await updateAdminVerifiedHub(selectedHub.id, updates);
      setHubs((prev) => prev.map((h) => (h.id === selectedHub.id ? { ...h, ...updates } : h)));
    } catch {
      // handled in context
    }
    setEditModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedHub) {
      try {
        await deleteAdminVerifiedHub(selectedHub.id);
        setHubs((prev) => prev.filter((h) => h.id !== selectedHub.id));
      } catch {
        // handled in context
      }
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="admin-impact-map" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Geographic Impact Radar & Verified Hubs ({effectiveHubs.length} Official Hubs)
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Real-time telemetry and management of verified regional headquarters, medical centers, and field staging posts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="white" size="sm" icon={RefreshCw} onClick={loadHubs}>
            Refresh
          </Button>
          <Button variant="yellow" size="sm" icon={Plus} onClick={handleOpenAdd}>
            Deploy New Verified Hub
          </Button>
        </div>
      </div>

      {/* 2. LIVE RADAR CANVAS */}
      <ImpactMapModule isStandalone={true} />

      {/* 3. VERIFIED HUBS MANAGEMENT TABLE */}
      <Card style={{ padding: '1rem', backgroundColor: 'var(--white)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={20} strokeWidth={2.5} />
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>
              Verified Impact Bridge Hubs Registry
            </h4>
            <Badge variant="green" size="sm">Impact Bridge</Badge>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Input
              placeholder="Search hubs, cities, leads..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: 0, minWidth: '220px' }}
            />
            <Select
              label=""
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: 'All', label: 'All Categories' },
                { value: 'NGO Center', label: 'NGO Center' },
                { value: 'Program', label: 'Program Outpost' },
                { value: 'Medical Hub', label: 'Medical Hub' },
                { value: 'Kitchen Hub', label: 'Kitchen Hub' }
              ]}
              style={{ marginBottom: 0 }}
            />
          </div>
        </div>

        <div className="nb-table-container">
          <table className="nb-table">
            <thead>
              <tr>
                <th>Hub Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>GPS Coordinates</th>
                <th>Program / Lead</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <SkeletonTableRow columns={7} />
                  <SkeletonTableRow columns={7} />
                  <SkeletonTableRow columns={7} />
                  <SkeletonTableRow columns={7} />
                </>
              ) : filteredHubs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#5A6F64' }}>
                    No verified hubs found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredHubs.map((hub) => (
                  <tr key={hub.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} color="var(--brand-dark-green)" />
                          {hub.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#5A6F64', fontWeight: 600 }}>
                          {hub.address || `${hub.city}, ${hub.state}`}
                        </div>
                      </div>
                    </td>

                    <td>
                      <Badge variant="yellow" size="sm">{hub.category || 'Hub'}</Badge>
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{hub.city}, {hub.state}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, backgroundColor: '#E2ECE6', padding: '2px 6px', borderRadius: '3px' }}>
                        {hub.latitude || hub.coordinates?.[0]?.toFixed?.(4) || '—'}, {hub.longitude || hub.coordinates?.[1]?.toFixed?.(4) || '—'}
                      </span>
                    </td>

                    <td>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{hub.programName || 'General Outreach'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#5A6F64' }}>Lead: {hub.lead || 'Unassigned'}</div>
                      </div>
                    </td>

                    <td>
                      <Badge variant={hub.status === 'Active Hub' ? 'green' : 'white'} size="sm">
                        {hub.status || 'Active Hub'}
                      </Badge>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenEdit(hub)}
                          className="nb-btn nb-btn-white nb-btn-sm"
                          style={{ padding: '5px' }}
                          title="Edit Hub Details"
                          aria-label={`Edit hub ${hub.name}`}
                        >
                          <Edit2 size={14} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(hub)}
                          className="nb-btn nb-btn-danger nb-btn-sm"
                          style={{ padding: '5px' }}
                          title="Delete Verified Hub"
                          aria-label={`Delete hub ${hub.name}`}
                        >
                          <Trash2 size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ADD LOCATION PIN MODAL */}
      <Modal
        isOpen={addPinModalOpen}
        onClose={() => setAddPinModalOpen(false)}
        title="Deploy Verified Impact Hub"
        maxWidth="680px"
        footer={
          <>
            <Button variant="white" icon={X} onClick={() => setAddPinModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" icon={MapPin} onClick={handleSavePin}>Deploy Hub</Button>
          </>
        }
      >
        <form onSubmit={handleSavePin}>
          <Input
            label="Hub / Center Name"
            required
            placeholder="e.g. Pune Smart Classroom Outpost"
            value={pinForm.name}
            onChange={(e) => setPinForm({ ...pinForm, name: e.target.value })}
          />

          <div className="grid-2">
            <Select
              label="Location Type"
              value={pinForm.category}
              onChange={(e) => setPinForm({ ...pinForm, category: e.target.value })}
              options={[
                { value: 'NGO Center', label: 'NGO Center / Regional HQ' },
                { value: 'Program', label: 'Active Program Hub' },
                { value: 'Medical Hub', label: 'Medical Clinic / Mobile Route' },
                { value: 'Kitchen Hub', label: 'Community Kitchen / Nutrition' }
              ]}
            />
            <Select
              label="Associated Initiative"
              value={pinForm.programName}
              onChange={(e) => setPinForm({ ...pinForm, programName: e.target.value })}
              options={programs.map((p) => ({ value: p.title, label: p.title }))}
            />
          </div>

          <div className="grid-2">
            <Input
              label="City"
              value={pinForm.city}
              onChange={(e) => setPinForm({ ...pinForm, city: e.target.value })}
            />
            <Input
              label="State"
              value={pinForm.state}
              onChange={(e) => setPinForm({ ...pinForm, state: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Latitude (GPS)"
              type="number"
              step="0.0001"
              value={pinForm.latitude}
              onChange={(e) => setPinForm({ ...pinForm, latitude: Number(e.target.value) })}
            />
            <Input
              label="Longitude (GPS)"
              type="number"
              step="0.0001"
              value={pinForm.longitude}
              onChange={(e) => setPinForm({ ...pinForm, longitude: Number(e.target.value) })}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Lead In-Charge"
              value={pinForm.lead}
              onChange={(e) => setPinForm({ ...pinForm, lead: e.target.value })}
            />
            <Input
              label="Contact Phone"
              value={pinForm.phone}
              onChange={(e) => setPinForm({ ...pinForm, phone: e.target.value })}
            />
          </div>

          <Input
            label="Street Address"
            value={pinForm.address}
            onChange={(e) => setPinForm({ ...pinForm, address: e.target.value })}
          />
        </form>
      </Modal>

      {/* EDIT LOCATION PIN MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Hub: ${selectedHub?.name}`}
        maxWidth="680px"
        footer={
          <>
            <Button variant="white" icon={X} onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" icon={ShieldCheck} onClick={handleSaveEdit}>Save Updates</Button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit}>
          <Input
            label="Hub / Center Name"
            required
            value={pinForm.name}
            onChange={(e) => setPinForm({ ...pinForm, name: e.target.value })}
          />

          <div className="grid-2">
            <Input
              label="City"
              value={pinForm.city}
              onChange={(e) => setPinForm({ ...pinForm, city: e.target.value })}
            />
            <Input
              label="State"
              value={pinForm.state}
              onChange={(e) => setPinForm({ ...pinForm, state: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Latitude (GPS)"
              type="number"
              step="0.0001"
              value={pinForm.latitude}
              onChange={(e) => setPinForm({ ...pinForm, latitude: Number(e.target.value) })}
            />
            <Input
              label="Longitude (GPS)"
              type="number"
              step="0.0001"
              value={pinForm.longitude}
              onChange={(e) => setPinForm({ ...pinForm, longitude: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Street Address"
            value={pinForm.address}
            onChange={(e) => setPinForm({ ...pinForm, address: e.target.value })}
          />
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Verified Hub"
        message={`Are you sure you want to remove the verified hub "${selectedHub?.name}"? It will no longer appear on the public Impact Map.`}
      />
    </div>
  );
}
