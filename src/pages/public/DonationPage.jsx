import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  Download,
  CreditCard,
  Building2,
  Sparkles,
  ArrowRight,
  FileText,
  User,
  Phone,
  Mail,
  Lock,
  Printer
} from 'lucide-react';

export default function DonationPage() {
  const { addDonation, donations, ngoProfile, addToast } = useApp();

  // Preset Amounts
  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  const [amount, setAmount] = useState(2500);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('one-time'); // 'one-time' | 'monthly'
  const [purpose, setPurpose] = useState('Education Kit & STEM Lab');
  const [donorName, setDonorName] = useState('Aditya Singhania');
  const [email, setEmail] = useState('aditya.singhania@corp.in');
  const [phone, setPhone] = useState('+91 98200 12345');
  const [panNumber, setPanNumber] = useState('ABCPS1234F');
  const [paymentMethod, setPaymentMethod] = useState('UPI (GPay, PhonePe, Paytm)');

  // Modal State for Payment & Receipt
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [completedDonation, setCompletedDonation] = useState(null);

  // Derive active donation value
  const finalAmount = customAmount ? Number(customAmount) : amount;

  // Impact description mapping based on amount
  const getImpactDescription = (amt) => {
    if (amt >= 10000) return '💻 Sponsors a refurbished laptop + 3-month fullstack coding bootcamp for an institutionalized youth.';
    if (amt >= 5000) return '🍼 Provides 1-month high-protein Poshan nutrition kits + essential medicines for 5 lactating mothers.';
    if (amt >= 2500) return '🩺 Funds full mobile telemedicine diagnostics + 2 months free generic chronic medications for 5 tribal elders.';
    if (amt >= 1000) return '🍲 Feeds 25 hot, hygienic, protein-rich meals to daily-wage construction laborers and children.';
    return '📚 Provides a complete STEM textbook, notebook, and digital learning tablet kit for a slum student.';
  };

  const handleOpenPayment = (e) => {
    e.preventDefault();
    if (!finalAmount || finalAmount < 100) {
      addToast('Minimum donation amount is ₹100', 'error');
      return;
    }
    if (!donorName || !email) {
      addToast('Please enter your name and email', 'error');
      return;
    }
    setPaymentModalOpen(true);
  };

  const handleCompletePayment = () => {
    const donationRecord = addDonation({
      donorName,
      email,
      phone,
      panNumber: panNumber.toUpperCase(),
      amount: finalAmount,
      purpose,
      paymentMethod,
      donorType: 'Individual Philanthropist'
    });

    setPaymentModalOpen(false);
    setCompletedDonation(donationRecord);
    setReceiptModalOpen(true);

    // Confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch (err) {}
  };

  return (
    <div className="donation-page" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* 1. HERO HEADER */}
      <section
        style={{
          padding: '3rem 0',
          backgroundColor: '#EBF4EF',
          borderBottom: 'var(--border-thick)'
        }}
      >
        <div className="nb-container">
          <Badge variant="yellow" size="md">100% TAX EXEMPT UNDER SECTION 80G</Badge>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              marginTop: '0.75rem',
              marginBottom: '1rem',
              lineHeight: 1.1
            }}
          >
            Invest in Transparent, Life-Changing Impact
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#3A4E44',
              maxWidth: '820px',
              lineHeight: 1.6
            }}
          >
            Every single rupee directly empowers child education, mobile medical outreach, and community flood resilience. Instant Form 10BE 80G tax receipt generated with every contribution.
          </p>
        </div>
      </section>

      {/* 2. MAIN DONATION PORTAL GRID */}
      <section className="nb-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '2.5rem' }} className="hero-grid">
          <style>{`
            @media (max-width: 960px) {
              .hero-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>

          {/* Left: Donation Form */}
          <Card style={{ padding: '2rem', border: 'var(--border-thick)' }}>
            <form onSubmit={handleOpenPayment}>
              {/* Frequency Toggle */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label className="nb-label">Select Contribution Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setFrequency('one-time')}
                    style={{
                      padding: '0.75rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      border: '2px solid #000',
                      borderRadius: '6px',
                      backgroundColor: frequency === 'one-time' ? 'var(--brand-dark-green)' : '#FFFFFF',
                      color: frequency === 'one-time' ? '#FFFFFF' : '#000000',
                      boxShadow: frequency === 'one-time' ? '3px 3px 0 #000' : '1.5px 1.5px 0 #000',
                      cursor: 'pointer'
                    }}
                  >
                    ⚡ One-Time Donation
                  </button>

                  <button
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    style={{
                      padding: '0.75rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      border: '2px solid #000',
                      borderRadius: '6px',
                      backgroundColor: frequency === 'monthly' ? 'var(--accent-yellow)' : '#FFFFFF',
                      color: '#000000',
                      boxShadow: frequency === 'monthly' ? '3px 3px 0 #000' : '1.5px 1.5px 0 #000',
                      cursor: 'pointer'
                    }}
                  >
                    🔁 Monthly Giving Partner
                  </button>
                </div>
              </div>

              {/* Amount Presets */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label className="nb-label">Choose Amount (INR ₹)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                  {presetAmounts.map((amt) => {
                    const isSelected = !customAmount && amount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setAmount(amt);
                          setCustomAmount('');
                        }}
                        style={{
                          padding: '0.75rem 0.5rem',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 900,
                          fontSize: '1.1rem',
                          border: '2px solid #000',
                          borderRadius: '6px',
                          backgroundColor: isSelected ? 'var(--accent-yellow)' : '#FFFFFF',
                          color: '#000000',
                          boxShadow: isSelected ? '3px 3px 0 #000' : '1.5px 1.5px 0 #000',
                          transform: isSelected ? 'translate(-2px, -2px)' : 'none',
                          cursor: 'pointer'
                        }}
                      >
                        ₹{formatCurrency(amt).replace('₹', '')}
                      </button>
                    );
                  })}
                </div>

                <Input
                  label="Or Enter Custom Amount (₹)"
                  type="number"
                  placeholder="e.g. 15000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  style={{ marginBottom: 0 }}
                />
              </div>

              {/* Real-Time Impact Highlight Box */}
              <div
                style={{
                  backgroundColor: '#FFF3BF',
                  border: '2px solid #000',
                  boxShadow: '3px 3px 0 #000',
                  borderRadius: '6px',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}
              >
                <Sparkles size={28} color="var(--brand-dark-green)" style={{ flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: '#5A6F64' }}>
                    YOUR IMPACT WITH {formatCurrency(finalAmount)}
                  </span>
                  <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#26332D', marginTop: '2px' }}>
                    {getImpactDescription(finalAmount)}
                  </p>
                </div>
              </div>

              {/* Purpose Selector */}
              <Select
                label="Direct Donation Purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                options={[
                  { value: 'Education Kit & STEM Lab', label: '🎓 Child Digital Classrooms & STEM Labs (PRG-101)' },
                  { value: 'Poshan Community Meals', label: '🍲 Poshan Daily Nutritious Meals for Laborers (PRG-102)' },
                  { value: 'Mobile Primary Healthcare Van', label: '🩺 Tribal Telemedicine & Mobile Diagnostic Clinic (PRG-103)' },
                  { value: 'Women Handloom Artisans Grant', label: '🧵 Varanasi Women Weavers Micro-Enterprise (PRG-104)' },
                  { value: 'Emergency Flood Relief Preps', label: '🚨 Assam Flood Preparedness & Rapid Speedboats (PRG-106)' },
                  { value: 'Where Needed Most (General Fund)', label: '✨ Where Needed Most (General Impact Fund)' }
                ]}
              />

              {/* Donor Contact Details */}
              <div style={{ borderTop: '2px solid #E2ECE6', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '1rem' }}>
                  Donor Information (For 80G Tax Exemption)
                </h4>

                <div className="grid-2">
                  <Input
                    label="Full Name / Company Name"
                    required
                    icon={User}
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid-2">
                  <Input
                    label="Phone Number"
                    required
                    icon={Phone}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input
                    label="PAN Card Number (Required for 80G)"
                    placeholder="e.g. ABCPS1234F"
                    required
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    helperText="Form 10BE submitted directly to Income Tax Dept"
                  />
                </div>
              </div>

              <Button type="submit" variant="yellow" size="lg" fullWidth icon={Heart}>
                Proceed to Secure Donation • {formatCurrency(finalAmount)}
              </Button>
            </form>
          </Card>

          {/* Right: Trust & Transparency Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 80G Tax Benefits Card */}
            <Card variant="lightgreen" hover={true} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={26} color="var(--brand-dark-green)" />
                <h3 style={{ fontSize: '1.25rem' }}>80G Tax Exemption</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#26332D', fontWeight: 600, lineHeight: 1.5, marginBottom: '1rem' }}>
                All donations to Impact Bridge Foundation are eligible for 50% deduction under Section 80G of the Indian Income Tax Act.
              </p>
              <div style={{ padding: '0.65rem', backgroundColor: '#FFFFFF', border: '1.5px solid #000', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
                Unique 80G Reg: {ngoProfile.tax80GNumber}
              </div>
            </Card>

            {/* Financial Transparency */}
            <Card style={{ padding: '1.5rem' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                Where Does Your Money Go?
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', fontWeight: 700 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Direct Community Programs</span>
                  <span style={{ color: 'var(--brand-dark-green)' }}>89.2%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#E2ECE6', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '89.2%', backgroundColor: 'var(--brand-dark-green)' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                  <span>Logistics & Solar Hardware</span>
                  <span>7.4%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#E2ECE6', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '7.4%', backgroundColor: 'var(--accent-yellow)' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                  <span>Audit, Governance & Legal</span>
                  <span>3.4%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#E2ECE6', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '3.4%', backgroundColor: '#000000' }} />
                </div>
              </div>
            </Card>

            {/* Recent Donor Ledger Stream */}
            <Card style={{ padding: '1.25rem' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', marginBottom: '0.75rem' }}>
                Recent Public Contributions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {donations.slice(0, 4).map((d) => (
                  <div
                    key={d.id}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#F0F7F2',
                      border: '1.5px solid #000',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800 }}>{d.donorName}</div>
                      <div style={{ fontSize: '0.7rem', color: '#5A6F64' }}>{d.purpose}</div>
                    </div>
                    <span style={{ fontWeight: 900, color: 'var(--brand-dark-green)', fontSize: '0.9rem' }}>
                      {formatCurrency(d.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. MOCK PAYMENT MODAL */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Complete Demo Payment"
        maxWidth="520px"
        footer={
          <>
            <Button variant="white" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="yellow" icon={Lock} onClick={handleCompletePayment}>
              Simulate Instant Success ({formatCurrency(finalAmount)})
            </Button>
          </>
        }
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ padding: '0.85rem', backgroundColor: '#FFF3BF', border: '2px solid #000', borderRadius: '4px', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5A6F64' }}>PAYING TO: IMPACT BRIDGE TRUST</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.5rem', marginTop: '2px' }}>
              {formatCurrency(finalAmount)}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Purpose: {purpose}</div>
          </div>

          <label className="nb-label">Select Payment Channel</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              'UPI (Google Pay, PhonePe, Paytm, BHIM)',
              'Credit / Debit Card (Visa, Mastercard, RuPay)',
              'Net Banking (All Indian Banks)',
              'Corporate CSR Direct NEFT Wire'
            ].map((method) => {
              const isSelected = paymentMethod === method;
              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    border: '2px solid #000',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? 'var(--brand-light-green)' : '#FFFFFF',
                    fontWeight: isSelected ? 800 : 600,
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{method}</span>
                  {isSelected && <span style={{ color: 'var(--brand-dark-green)', fontWeight: 900 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </Modal>

      {/* 4. 80G TAX RECEIPT MODAL */}
      {completedDonation && (
        <Modal
          isOpen={receiptModalOpen}
          onClose={() => setReceiptModalOpen(false)}
          title="Official 80G Tax Exemption Receipt"
          maxWidth="640px"
          footer={
            <>
              <Button
                variant="white"
                icon={Printer}
                onClick={() => {
                  window.print();
                }}
              >
                Print Receipt
              </Button>
              <Button
                variant="yellow"
                icon={Download}
                onClick={() => {
                  addToast('80G Certificate PDF downloaded to your device!', 'success');
                  setReceiptModalOpen(false);
                }}
              >
                Download Receipt PDF
              </Button>
            </>
          }
        >
          {/* Printable 80G Certificate Document */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: '#FAFCFA',
              border: '2px solid #000',
              borderRadius: '6px',
              fontFamily: 'var(--font-body)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.25rem' }}>
                  {ngoProfile.name}
                </h3>
                <p style={{ fontSize: '0.72rem', color: '#5A6F64', fontWeight: 600 }}>
                  Registered Public Charitable Trust • PAN: {ngoProfile.panNumber}
                </p>
                <p style={{ fontSize: '0.72rem', color: '#5A6F64' }}>
                  80G Order: {ngoProfile.tax80GNumber}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Badge variant="green" size="sm">RECEIPT ISSUED</Badge>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, marginTop: '4px' }}>
                  {completedDonation.taxExempt80G}
                </div>
              </div>
            </div>

            {/* Receipt Table Details */}
            <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2ECE6' }}>
                  <td style={{ padding: '6px 0', fontWeight: 700, color: '#5A6F64' }}>Donor Name:</td>
                  <td style={{ padding: '6px 0', fontWeight: 800, textAlign: 'right' }}>{completedDonation.donorName}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2ECE6' }}>
                  <td style={{ padding: '6px 0', fontWeight: 700, color: '#5A6F64' }}>Donor PAN Number:</td>
                  <td style={{ padding: '6px 0', fontWeight: 800, textAlign: 'right' }}>{completedDonation.panNumber || 'ABCPS1234F'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2ECE6' }}>
                  <td style={{ padding: '6px 0', fontWeight: 700, color: '#5A6F64' }}>Date of Donation:</td>
                  <td style={{ padding: '6px 0', fontWeight: 800, textAlign: 'right' }}>{formatDate(completedDonation.date)}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2ECE6' }}>
                  <td style={{ padding: '6px 0', fontWeight: 700, color: '#5A6F64' }}>Purpose / Program:</td>
                  <td style={{ padding: '6px 0', fontWeight: 800, textAlign: 'right' }}>{completedDonation.purpose}</td>
                </tr>
                <tr style={{ borderBottom: '2px solid #000' }}>
                  <td style={{ padding: '10px 0', fontWeight: 900, fontSize: '1rem' }}>TOTAL AMOUNT DONATED:</td>
                  <td style={{ padding: '10px 0', fontWeight: 900, fontSize: '1.25rem', textAlign: 'right', color: 'var(--brand-dark-green)' }}>
                    {formatCurrency(completedDonation.amount)}
                  </td>
                </tr>
              </tbody>
            </table>

            <p style={{ fontSize: '0.72rem', color: '#5A6F64', lineHeight: 1.4 }}>
              *This document certifies that the above donation is eligible for tax deduction under Section 80G(5)(vi) of the Income Tax Act, 1961. Form 10BE filed with the Director of Income Tax (Exemption).
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
