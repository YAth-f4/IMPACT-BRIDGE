import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ImpactMapModule from '../../components/map/ImpactMap';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { MapPin, Plus, ShieldCheck, Layers, Building2, Radio } from 'lucide-react';

export default function ImpactMapAdmin() {
  const { locations, addLocation, programs } = useApp();

  const [addPinModalOpen, setAddPinModalOpen] = useState(false);
  const [pinForm, setPinForm] = useState({
    name: '',
    type: 'NGO Center',
    city: 'Pune',
    state: 'Maharashtra',
    programName: 'GyanSetu Digital Classrooms',
    beneficiaries: 1200,
    volunteers: 30,
    status: 'Active Hub',
    address: 'FC Road Innovation Center, Pune 411005',
    coordinates: [18.5204, 73.8567],
    lead: 'Vikramjit Singh',
    contact: '+91 20 2553 1122'
  });

  const handleSavePin = (e) => {
    e.preventDefault();
    if (!pinForm.name) return;

    addLocation({
      ...pinForm,
      beneficiaries: Number(pinForm.beneficiaries),
      volunteers: Number(pinForm.volunteers)
    });
    setAddPinModalOpen(false);
  };

  return (
    <div className="admin-impact-map" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Geographic Impact Radar ({locations.length} Field Locations)
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Real-time telemetry of regional headquarters, mobile medical routes, community kitchens, and disaster staging posts.
          </p>
        </div>

        <Button variant="yellow" size="sm" icon={Plus} onClick={() => setAddPinModalOpen(true)}>
          Deploy New Field Pin
        </Button>
      </div>

      {/* 2. LIVE RADAR CANVAS */}
      <ImpactMapModule isStandalone={true} />

      {/* ADD LOCATION PIN MODAL */}
      <Modal
        isOpen={addPinModalOpen}
        onClose={() => setAddPinModalOpen(false)}
        title="Deploy Field Location / GPS Pin"
        maxWidth="600px"
        footer={
          <>
            <Button variant="white" onClick={() => setAddPinModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" icon={MapPin} onClick={handleSavePin}>Add Location Pin</Button>
          </>
        }
      >
        <form onSubmit={handleSavePin}>
          <Input
            label="Location / Center Name"
            required
            placeholder="e.g. Pune Smart Classroom Outpost"
            value={pinForm.name}
            onChange={(e) => setPinForm({ ...pinForm, name: e.target.value })}
          />

          <div className="grid-2">
            <Select
              label="Location Type"
              value={pinForm.type}
              onChange={(e) => setPinForm({ ...pinForm, type: e.target.value })}
              options={[
                { value: 'NGO Center', label: 'NGO Center / Regional HQ' },
                { value: 'Program', label: 'Active Program Hub' },
                { value: 'Beneficiary Area', label: 'Beneficiary Focus Area' },
                { value: 'Event', label: 'Field Event / Staging' }
              ]}
            />
            <Select
              label="Associated Program"
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
              label="Beneficiaries Covered"
              type="number"
              value={pinForm.beneficiaries}
              onChange={(e) => setPinForm({ ...pinForm, beneficiaries: Number(e.target.value) })}
            />
            <Input
              label="Volunteers Deployed"
              type="number"
              value={pinForm.volunteers}
              onChange={(e) => setPinForm({ ...pinForm, volunteers: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Street Address"
            value={pinForm.address}
            onChange={(e) => setPinForm({ ...pinForm, address: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
}
