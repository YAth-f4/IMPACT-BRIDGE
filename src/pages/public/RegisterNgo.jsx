import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Input, TextArea, Select } from '../../components/common/Input';
import {
  Building2,
  FileCheck,
  Upload,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

const NGO_TYPES = ['Trust', 'Society', 'Section 8 Non-Profit', 'Autonomous Foundation', 'Cooperative'];

const CAUSE_OPTIONS = [
  'Education & Literacy',
  'Healthcare & Medical Relief',
  'Food Security & Zero Hunger',
  'Disaster Response & Relief',
  'Women Empowerment & Safety',
  'Child Welfare & Rights',
  'Rural Development & Infrastructure',
  'Livelihood & Skills Training',
  'Environmental Conservation',
  'Water, Sanitation & Hygiene (WASH)'
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh'
];

export default function RegisterNgo() {
  const { isAuthenticated, currentUser, submitNgoRegistration, addToast } = useApp();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    organizationName: '',
    description: '',
    ngoType: 'Trust',
    founder: '',
    authorizedRepresentative: currentUser?.name || '',
    contactEmail: currentUser?.email || '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    registrationNumber: '',
    yearsOfOperation: '5',
    causes: ['Education & Literacy'],
    areasOfWorkText: 'Classroom Infrastructure, Remedial Tutoring, Digital Literacy',
    programsText: 'Mobile Science Lab, Evening Study Centers'
  });

  // Upload states
  const [certificateData, setCertificateData] = useState('');
  const [certificateName, setCertificateName] = useState('');
  const [logoData, setLogoData] = useState('');
  const [photosData, setPhotosData] = useState([]);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // Status & validation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedNgo, setSubmittedNgo] = useState(null);

  // Sync currentUser once auth resolves
  React.useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        authorizedRepresentative: prev.authorizedRepresentative || currentUser.name || '',
        contactEmail: prev.contactEmail || currentUser.email || ''
      }));
    }
  }, [currentUser]);

  // Helper to convert File to Base64 Data URL
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCertificateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('Document size exceeds 5MB limit.', 'error');
      return;
    }
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      addToast('Please upload a PDF or image document (PDF, PNG, JPG, WebP).', 'error');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setCertificateData(base64);
      setCertificateName(file.name);
      addToast(`Certificate "${file.name}" uploaded.`, 'success');
    } catch {
      addToast('Failed to process file upload.', 'error');
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      addToast('Logo image must be under 3MB.', 'error');
      return;
    }
    if (!file.type.startsWith('image/')) {
      addToast('Please upload a valid image file for logo.', 'error');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setLogoData(base64);
      addToast('Logo uploaded.', 'success');
    } catch {
      addToast('Failed to process logo upload.', 'error');
    }
  };

  const handlePhotosUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    try {
      const b64List = await Promise.all(files.map((f) => fileToBase64(f)));
      setPhotosData(b64List);
      addToast(`${files.length} project photos uploaded.`, 'success');
    } catch {
      addToast('Failed to process photos.', 'error');
    }
  };

  const handleCauseToggle = (cause) => {
    setFormData((prev) => {
      const exists = prev.causes.includes(cause);
      const updated = exists ? prev.causes.filter((c) => c !== cause) : [...prev.causes, cause];
      return { ...prev, causes: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg('');

    if (!certificateData) {
      setErrorMsg('Statutory Registration Certificate document upload is required.');
      addToast('Please upload your registration certificate.', 'error');
      return;
    }

    if (!declarationAccepted) {
      setErrorMsg('Please confirm that the submitted information is accurate and authorized.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      registrationCertificate: certificateData,
      logo: logoData,
      photos: photosData,
      areasOfWork: formData.areasOfWorkText.split(',').map((s) => s.trim()).filter(Boolean),
      programs: formData.programsText.split(',').map((s) => s.trim()).filter(Boolean)
    };

    const res = await submitNgoRegistration(payload);
    setIsSubmitting(false);

    if (res.success) {
      setSubmittedNgo(res.ngo);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrorMsg(res.message || 'Submission failed. Please check form details.');
    }
  };

  // If visitor is GUEST, prompt authentication
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', backgroundColor: '#EBF4EF' }}>
        <Card style={{ maxWidth: '540px', width: '100%', padding: '2.5rem', textAlign: 'center', border: 'var(--border-thick)', boxShadow: '8px 8px 0px #000', backgroundColor: '#FFFFFF' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: '#FFEAEA', border: '2.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '3px 3px 0px #000' }}>
            <Building2 size={34} strokeWidth={2.5} color="#26332D" />
          </div>
          <Badge variant="yellow" size="sm">AUTHENTICATION REQUIRED</Badge>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            Sign In to Register Your NGO
          </h2>
          <p style={{ color: '#5A6F64', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '1.75rem' }}>
            To safeguard the credibility of the Impact Bridge platform and manage your official organization profile, please sign in or register an account before submitting your NGO.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <Link to="/login" state={{ from: '/register-ngo' }} style={{ textDecoration: 'none' }}>
              <Button variant="yellow" size="md" icon={Lock} style={{ width: '100%' }}>
                Sign In to Continue
              </Button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button variant="lightgreen" size="md" icon={ArrowRight} style={{ width: '100%' }}>
                Create Free Account
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Submission Confirmation View
  if (submittedNgo) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', backgroundColor: '#EBF4EF' }}>
        <Card style={{ maxWidth: '620px', width: '100%', padding: '3rem 2rem', textAlign: 'center', border: 'var(--border-thick)', boxShadow: '8px 8px 0px #000', backgroundColor: '#FFFFFF' }}>
          <div style={{ width: '76px', height: '76px', borderRadius: '50%', backgroundColor: 'var(--brand-light-green)', border: '3px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '4px 4px 0px #000' }}>
            <CheckCircle2 size={42} color="var(--brand-dark-green)" strokeWidth={2.5} />
          </div>
          <Badge variant="green" size="md">APPLICATION SUBMITTED</Badge>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 900, marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            {submittedNgo.organizationName}
          </h2>
          <div style={{ display: 'inline-block', backgroundColor: '#F0F7F2', border: '1.5px solid #000', borderRadius: '4px', padding: '0.35rem 0.85rem', fontFamily: 'monospace', fontWeight: 800, fontSize: '0.95rem', margin: '0.5rem 0 1.25rem' }}>
            Reference ID: {submittedNgo.id}
          </div>
          <p style={{ color: '#4B5563', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            NGO registration submitted successfully. Your application is currently under review by our administrative verification team.
            Once verified against statutory trust & society registers, your NGO will receive the official <strong>Verified by Impact Bridge</strong> badge and be published to the public NGO directory.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Link to="/my-ngos" style={{ textDecoration: 'none' }}>
              <Button variant="yellow" size="md" icon={ShieldCheck} style={{ width: '100%' }}>
                View My Submissions
              </Button>
            </Link>
            <Link to="/ngos" style={{ textDecoration: 'none' }}>
              <Button variant="white" size="md" icon={Globe} style={{ width: '100%' }}>
                Browse Directory
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F7FAF8', minHeight: '90vh', padding: 'clamp(1.5rem, 4vw, 3rem) 1rem' }}>
      <div className="nb-container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* Header Title Section */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
            <Badge variant="yellow" size="md">OFFICIAL NGO ONBOARDING</Badge>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, color: '#000000', marginBottom: '0.75rem' }}>
            Register Your NGO on Impact Bridge
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#5A6F64', maxWidth: '680px', margin: '0 auto', lineHeight: 1.55 }}>
            Join India’s transparent civil society bridge. Connect with verified donors, corporate CSR foundations, and dedicated skilled volunteers across every district.
          </p>
        </div>

        {/* Verification Pipeline Notice Banner */}
        <div style={{ backgroundColor: '#FFFBEB', border: '2px solid #000', borderRadius: '6px', padding: '1rem 1.25rem', boxShadow: '4px 4px 0px #000', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ backgroundColor: 'var(--accent-yellow)', border: '1.5px solid #000', borderRadius: '4px', padding: '0.35rem', display: 'flex', flexShrink: 0 }}>
            <Info size={22} strokeWidth={2.5} color="#000" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#000', marginBottom: '0.2rem' }}>
              Verification & Public Listing Policy
            </div>
            <p style={{ fontSize: '0.86rem', color: '#4B5563', lineHeight: 1.5, margin: 0 }}>
              “Your NGO will be published on Impact Bridge only after verification and approval by our admin team.”
              Submissions are checked against statutory trust registers, 80G/12A documentation, and field coordinator networks to maintain zero-compromise platform integrity.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#FFEAEA', border: '2px solid #000', borderRadius: '6px', padding: '0.85rem 1rem', boxShadow: '3px 3px 0px #000', marginBottom: '1.5rem', color: '#991B1B', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} strokeWidth={2.5} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* SECTION 1: ORGANIZATION ESSENTIALS */}
          <Card style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', border: 'var(--border-thick)', boxShadow: '6px 6px 0px #000', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '2px solid #E2ECE6', paddingBottom: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--brand-light-green)', border: '1.5px solid #000', padding: '0.3rem', borderRadius: '4px' }}>
                <Building2 size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>
                  1. Organization Profile
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#5A6F64', fontWeight: 600 }}>Legal identity and core focus</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <Input
                label="Full NGO / Organization Name"
                placeholder="e.g. Navjeevan Rural Health & Education Trust"
                required
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <Select
                  label="Legal Entity Type"
                  options={NGO_TYPES.map((t) => ({ value: t, label: t }))}
                  value={formData.ngoType}
                  onChange={(e) => setFormData({ ...formData, ngoType: e.target.value })}
                />
                <Input
                  label="Years in Active Operation"
                  type="number"
                  min="0"
                  max="150"
                  placeholder="e.g. 8"
                  required
                  value={formData.yearsOfOperation}
                  onChange={(e) => setFormData({ ...formData, yearsOfOperation: e.target.value })}
                />
              </div>

              <TextArea
                label="Organization Mission & Description"
                rows={4}
                placeholder="Provide a concise description of your mission, target communities, and overall impact..."
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </Card>

          {/* SECTION 2: STATUTORY & LEGAL VERIFICATION */}
          <Card style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', border: 'var(--border-thick)', boxShadow: '6px 6px 0px #000', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '2px solid #E2ECE6', paddingBottom: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--accent-yellow)', border: '1.5px solid #000', padding: '0.3rem', borderRadius: '4px' }}>
                <FileCheck size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>
                  2. Statutory Verification & Certificate
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#5A6F64', fontWeight: 600 }}>Government registration & authenticity documents</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Input
                label="Statutory Registration Number (Trust / Society / Section 8 / Darpan ID)"
                placeholder="e.g. MH/2018/0192842 or 12A/80G Order Number"
                required
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              />

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                  Upload Registration Certificate (PDF or Image, max 5MB) <span style={{ color: '#E63946' }}>*</span>
                </label>
                <div style={{ border: '2px dashed #000', borderRadius: '6px', padding: '1.5rem', textAlign: 'center', backgroundColor: certificateData ? '#F0F7F2' : '#F9FBF9', cursor: 'pointer', transition: 'all 0.15s ease' }}>
                  <input
                    type="file"
                    id="cert-upload"
                    accept=".pdf,image/png,image/jpeg,image/webp"
                    onChange={handleCertificateUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="cert-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Upload size={28} strokeWidth={2.5} color="#246348" />
                    <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>
                      {certificateName ? `Selected: ${certificateName}` : 'Click to Browse & Upload Certificate Document'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#5A6F64' }}>Supported formats: PDF, JPG, PNG, WebP (Under 5 MB)</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* SECTION 3: LEADERSHIP & CONTACT DETAILS */}
          <Card style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', border: 'var(--border-thick)', boxShadow: '6px 6px 0px #000', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '2px solid #E2ECE6', paddingBottom: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--brand-light-green)', border: '1.5px solid #000', padding: '0.3rem', borderRadius: '4px' }}>
                <MapPin size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>
                  3. Leadership & Headquarters Location
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#5A6F64', fontWeight: 600 }}>Official representatives and registered office</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <Input
                  label="Founder / President Name"
                  placeholder="e.g. Dr. Ramesh Joshi"
                  value={formData.founder}
                  onChange={(e) => setFormData({ ...formData, founder: e.target.value })}
                />
                <Input
                  label="Authorized Representative Submitting Form"
                  placeholder="e.g. Sunita Deshmukh (Secretary)"
                  required
                  value={formData.authorizedRepresentative}
                  onChange={(e) => setFormData({ ...formData, authorizedRepresentative: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <Input
                  label="Official Contact Email"
                  type="email"
                  placeholder="contact@yourngo.org"
                  required
                  icon={Mail}
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
                <Input
                  label="Direct Helpline Phone Number"
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  icon={Phone}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <Input
                label="Official Website (Optional)"
                placeholder="https://yourngo.org"
                icon={Globe}
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />

              <Input
                label="Registered Physical Address"
                placeholder="Plot / Street / Landmark / Office Suite"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <Input
                  label="City / District"
                  placeholder="e.g. Pune"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <Select
                  label="State"
                  options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
                <Input
                  label="PIN Code"
                  placeholder="e.g. 411001"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* SECTION 4: IMPACT SCOPE & ASSETS */}
          <Card style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', border: 'var(--border-thick)', boxShadow: '6px 6px 0px #000', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '2px solid #E2ECE6', paddingBottom: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--accent-yellow)', border: '1.5px solid #000', padding: '0.3rem', borderRadius: '4px' }}>
                <Sparkles size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>
                  4. Causes, Programs & Visual Assets
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#5A6F64', fontWeight: 600 }}>Categorization for public discovery and verified radar</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                  Primary Causes (Select all that apply)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                  {CAUSE_OPTIONS.map((cause) => {
                    const isSelected = formData.causes.includes(cause);
                    return (
                      <div
                        key={cause}
                        onClick={() => handleCauseToggle(cause)}
                        style={{
                          padding: '0.55rem 0.75rem',
                          border: isSelected ? '2px solid #000' : '1.5px solid #D1D5DB',
                          borderRadius: '4px',
                          backgroundColor: isSelected ? 'var(--brand-light-green)' : '#FFFFFF',
                          boxShadow: isSelected ? '2px 2px 0px #000' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 800 : 600,
                          transition: 'all 0.1s ease'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          style={{ pointerEvents: 'none' }}
                        />
                        <span>{cause}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Input
                label="Key Areas of Work (Comma separated)"
                placeholder="e.g. Solar Labs, Malnutrition Interventions, Skill Training"
                value={formData.areasOfWorkText}
                onChange={(e) => setFormData({ ...formData, areasOfWorkText: e.target.value })}
              />

              <Input
                label="Flagship Programs / Active Services (Comma separated)"
                placeholder="e.g. Free Mid-Day Kitchens, Mobile Dispensaries"
                value={formData.programsText}
                onChange={(e) => setFormData({ ...formData, programsText: e.target.value })}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                    Organization Logo (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ fontSize: '0.82rem' }}
                  />
                  {logoData && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <img src={logoData} alt="Logo Preview" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '4px', border: '1.5px solid #000' }} />
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                    Project Photos (Up to 4)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotosUpload}
                    style={{ fontSize: '0.82rem' }}
                  />
                  {photosData.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem' }}>
                      {photosData.map((p, i) => (
                        <img key={i} src={p} alt="Project Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #000' }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* DECLARATION & SUBMIT */}
          <Card style={{ padding: '1.5rem', border: 'var(--border-thick)', boxShadow: '6px 6px 0px #000', backgroundColor: '#FFFFFF' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', marginBottom: '1.25rem' }}>
              <input
                type="checkbox"
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                style={{ width: '18px', height: '18px', marginTop: '2px' }}
              />
              <span style={{ fontSize: '0.88rem', color: '#26332D', lineHeight: 1.5, fontWeight: 600 }}>
                I declare on behalf of this Organization that all submitted statutory documents, leadership contacts, and operational disclosures are authentic. I understand this NGO will be listed publicly on Impact Bridge only upon formal review and verification approval by administrators.
              </span>
            </label>

            <Button
              type="submit"
              variant="yellow"
              size="lg"
              icon={Building2}
              style={{ width: '100%' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Validating & Submitting Application...' : 'Submit Official NGO Registration for Verification'}
            </Button>
          </Card>
        </form>
      </div>
    </div>
  );
}
