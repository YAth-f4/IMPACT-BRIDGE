import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ImpactMap from '../../components/map/ImpactMap';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import {
  MapPin,
  Plus,
  Layers,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Navigation
} from 'lucide-react';

export default function ImpactMapAdmin() {
  const { locations, addLocation, addToast } = useApp();

  const [addPinModalOpen, setAddPinModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'NGO Center',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Hitech City Innovation Park, Hyderabad 500081',
    programName: 'Digital Learning Lab & Tele-Clinic Hub',
    beneficiaries: 2500,
    volunteers: 45,
    status: 'Active Hub',
    phone: '+91 40 2311 0099',
    lead: 'Dr. Suresh Reddy'
  });

  const handleSavePin = (e) => {
    e.preventDefault();
    if (!formData.name) {
      addToast('Location Name is required', 'error');
      return;
    }

    addLocation({
      ...formData,
      coordinates: [17.3850, 78.4867] // Hyderabad coordinates
    });

    setAddPinModalOpen(false);
  };

  return (
    <div className="impact-map-admin" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Geographic Impact Radar Management
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Configure geographic pins, regional telemetry hubs, and ground service boundaries.
          </p>
        </div>

        <Button variant="yellow" size="sm" icon={Plus} onClick={() => setAddPinModalOpen(true)}>
          Deploy New Field Pin
        </Button>
      </div>

      {/* 2. EMBEDDED MAP CANVAS */}
      <ImpactMap isStandalone={false} />

      {/* 3. ADD LOCATION PIN MODAL */}
      <Modal
        isOpen={addPinModalOpen}
        onClose={() => setAddPinModalOpen(false)}
        title="Deploy New Geographic Pin / Center"
        maxWidth="600px"
        footer={
          <>
            <Button variant="white" onClick={() => setAddPinModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" onClick={handleSavePin}>Save & Pin to Radar</Button>
          </>
        }
      >
        <form onSubmit={handleSavePin}>
          <Input
            label="Location / Center Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid-2">
            <Select
              label="Pin Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'NGO Center', label: 'NGO Center / HQ' },
                { value: 'Program', label: 'Active Program Hub' },
                { value: 'Beneficiary Area', label: 'Beneficiary Settlement Area' },
                { value: 'Event', label: 'Community Relief Camp / Event' }
              ]}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Active Hub', label: 'Active Hub' },
                { value: 'Completed Site', label: 'Completed Site' }
              ]}
            />
          </div>

          <div className="grid-2">
            <Input
              label="City"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              label="State"
              required
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>

          <Input
            label="Full Address / Landmark"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <Input
            label="Linked Program Name"
            value={formData.programName}
            onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
          />

          <div className="grid-2">
            <Input
              label="Target Beneficiaries"
              type="number"
              value={formData.beneficiaries}
              onChange={(e) => setFormData({ ...formData, beneficiaries: Number(e.target.value) })}
            />
            <Input
              label="Volunteers Deployed"
              type="number"
              value={formData.volunteers}
              onChange={(e) => setFormData({ ...formData, volunteers: Number(e.target.value) })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
