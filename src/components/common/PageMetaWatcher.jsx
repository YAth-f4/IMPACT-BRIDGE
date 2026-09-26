import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Route-to-Meta configuration
 * Enforces strictly meaningful, professional page titles and meta descriptions
 * adhering to the "Impact Bridge | <Page>" standard.
 */
const ROUTE_META = {
  '/': {
    title: 'Impact Bridge | Home',
    description: 'Impact Bridge connects donors, skilled volunteers, and verified NGOs across India to foster transparency and accelerate community impact.'
  },
  '/home': {
    title: 'Impact Bridge | Home',
    description: 'Impact Bridge connects donors, skilled volunteers, and verified NGOs across India to foster transparency and accelerate community impact.'
  },
  '/about': {
    title: 'Impact Bridge | About',
    description: 'Learn about Impact Bridge’s mission, governing trustees, institutional credibility, and tech-driven approach to social development in India.'
  },
  '/programs': {
    title: 'Impact Bridge | Programs',
    description: 'Explore verified programs in child education, rural healthcare, women empowerment, zero hunger, and disaster relief across Indian districts.'
  },
  '/volunteer': {
    title: 'Impact Bridge | Volunteer',
    description: 'Join verified grassroots initiatives, contribute your specialized skills, and make a measurable difference in communities across India.'
  },
  '/donation': {
    title: 'Impact Bridge | Donations',
    description: 'Make 100% tax-deductible donations under Section 80G to verified NGOs with real-time fund tracking and instant digital receipts.'
  },
  '/impact-map': {
    title: 'Impact Bridge | Impact Map',
    description: 'Interactive geographic map visualizing verified NGO operations, relief centers, and localized social development projects across India.'
  },
  '/find-help': {
    title: 'Impact Bridge | Find Help',
    description: 'Request financial, educational, medical, or emergency relief assistance directly from verified NGOs and community hubs.'
  },
  '/beneficiary': {
    title: 'Impact Bridge | Find Help',
    description: 'Request financial, educational, medical, or emergency relief assistance directly from verified NGOs and community hubs.'
  },
  '/contact': {
    title: 'Impact Bridge | Contact',
    description: 'Contact Impact Bridge for institutional partnerships, NGO onboarding inquiries, emergency helpline details, or general support.'
  },
  '/login': {
    title: 'Impact Bridge | Login',
    description: 'Sign in to access your role-specific Impact Bridge portal, track contributions, and coordinate grassroots programs.'
  },
  '/register': {
    title: 'Impact Bridge | Register',
    description: 'Create an account on Impact Bridge to volunteer, donate, request community assistance, or manage NGO operations.'
  },
  '/ngos': {
    title: 'Impact Bridge | NGO Directory',
    description: 'Search and inspect verified non-profits, charitable trusts, and Section 8 societies accredited by Impact Bridge.'
  },
  '/register-ngo': {
    title: 'Impact Bridge | Register NGO',
    description: 'Apply to list your non-profit organization on India’s transparent civil society bridge and connect with verified donors.'
  },
  '/my-ngos': {
    title: 'Impact Bridge | My NGOs',
    description: 'Monitor your submitted NGO verification applications, respond to admin review notes, and update organization profiles.'
  },
  '/privacy': {
    title: 'Impact Bridge | Privacy Policy',
    description: 'Learn how Impact Bridge protects your personal data, donation records, and documents under Indian data governance standards.'
  },
  '/terms': {
    title: 'Impact Bridge | Terms of Service',
    description: 'Read the terms of service governing participation, donations, volunteering, and verification on the Impact Bridge platform.'
  },
  '/404': {
    title: 'Impact Bridge | Page Not Found',
    description: 'The requested page could not be found on Impact Bridge.'
  },
  '/volunteer/dashboard': {
    title: 'Impact Bridge | Volunteer Dashboard',
    description: 'Manage active volunteer assignments, log completed field hours, and collaborate with NGO task coordinators.'
  },
  '/donor/dashboard': {
    title: 'Impact Bridge | Donor Dashboard',
    description: 'Review your total donations, download Form 10BE and Section 80G tax certificates, and view audited utilization reports.'
  },
  '/beneficiary/dashboard': {
    title: 'Impact Bridge | Beneficiary Portal',
    description: 'Check the real-time review status of your assistance requests and communicate with assigned NGO coordinators.'
  },
  '/beneficiary/requests': {
    title: 'Impact Bridge | Beneficiary Portal',
    description: 'Review your active and completed support requests.'
  },
  '/admin': {
    title: 'Impact Bridge | Admin Dashboard',
    description: 'Central executive administration dashboard monitoring live verification queues, KPIs, users, and audit logs.'
  },
  '/admin/dashboard': {
    title: 'Impact Bridge | Admin Dashboard',
    description: 'Central executive administration dashboard monitoring live verification queues, KPIs, users, and audit logs.'
  },
  '/admin/requests/find-help': {
    title: 'Impact Bridge | Help Requests',
    description: 'Administrative verification and review queue for incoming assistance requests.'
  },
  '/admin/requests/fund-raise': {
    title: 'Impact Bridge | Fund Raise Requests',
    description: 'Administrative queue for reviewing and approving community fundraising drives.'
  },
  '/admin/requests/volunteers': {
    title: 'Impact Bridge | Volunteer Applications',
    description: 'Administrative review queue for volunteer onboarding and skill validation.'
  },
  '/admin/ngo-registrations': {
    title: 'Impact Bridge | NGO Registration Review',
    description: 'Review statutory NGO registration documents, verify 80G/12A certificates, and approve organizations.'
  },
  '/admin/users': {
    title: 'Impact Bridge | Users & Roles',
    description: 'Manage platform user accounts, assign role permissions, and review security audit logs.'
  },
  '/admin/users-and-roles': {
    title: 'Impact Bridge | Users & Roles',
    description: 'Manage platform user accounts, assign role permissions, and review security audit logs.'
  },
  '/admin/volunteers': {
    title: 'Impact Bridge | Volunteer Directory',
    description: 'Directory of registered volunteers, hours logged, and district allocations.'
  },
  '/admin/beneficiaries': {
    title: 'Impact Bridge | Beneficiaries',
    description: 'Record of verified aid recipients and localized relief disbursement logs.'
  },
  '/admin/donations': {
    title: 'Impact Bridge | Donations',
    description: 'Complete financial transaction ledger, tax receipts, and CSR contributions.'
  },
  '/admin/programs': {
    title: 'Impact Bridge | Programs',
    description: 'Operational control and milestone tracking for active field programs.'
  },
  '/admin/impact-map': {
    title: 'Impact Bridge | Admin Impact Map',
    description: 'Geographic management for verified NGO pins, relief hubs, and district telemetry.'
  },
  '/admin/reports': {
    title: 'Impact Bridge | Reports & Analytics',
    description: 'Audited impact reports, quarterly financial filings, and transparency disclosures.'
  },
  '/admin/messages': {
    title: 'Impact Bridge | Messages',
    description: 'Inquiries and messages received through the public contact portal.'
  },
  '/admin/settings': {
    title: 'Impact Bridge | Admin Settings',
    description: 'Platform configuration, tax registration data, and operational parameters.'
  }
};

export default function PageMetaWatcher() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let meta = ROUTE_META[path];

    // Dynamic route matching for /programs/:id, /ngos/:id, /about/changemakers/:slug
    if (!meta) {
      if (path.startsWith('/programs/')) {
        meta = {
          title: 'Impact Bridge | Program Details',
          description: 'Explore in-depth program milestones, budget allocation, and community impact.'
        };
      } else if (path.startsWith('/ngos/')) {
        meta = {
          title: 'Impact Bridge | NGO Profile',
          description: 'View statutory verification credentials, leadership contacts, and audited community programs.'
        };
      } else if (path.startsWith('/about/changemakers/')) {
        meta = {
          title: 'Impact Bridge | Changemaker Profile',
          description: 'Meet the grassroots changemakers driving community impact across India.'
        };
      } else {
        meta = {
          title: 'Impact Bridge | Page Not Found',
          description: 'The requested page could not be found on Impact Bridge.'
        };
      }
    }

    if (meta.title) {
      document.title = meta.title;
    }

    if (meta.description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', meta.description);
    }
  }, [location.pathname]);

  return null;
}
