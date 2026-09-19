const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const VALID_STATUSES = ['UNREAD', 'READ', 'RESOLVED'];

const INITIAL_MESSAGES = [
  {
    id: 'MSG-401',
    senderName: 'Rohit Verma',
    email: 'rohit.v@innovatetech.com',
    phone: '+91 98200 45678',
    subject: 'Corporate CSR Partnership for Dharavi STEM Lab',
    category: 'Donors',
    status: 'UNREAD',
    createdAt: '2025-02-28T14:30:00.000Z',
    content: 'Dear Impact Bridge Team, Our company InnovateTech is planning our 2025-26 CSR grant allocation. We are thoroughly impressed with the GyanSetu program in Dharavi and would like to sponsor 5 new digital classrooms (~₹25 Lakhs). Could we schedule a virtual call next Tuesday?',
    replyHistory: []
  },
  {
    id: 'MSG-402',
    senderName: 'Megha Sundaram',
    email: 'megha.sundaram@iitb.ac.in',
    phone: '+91 98333 44556',
    subject: 'Volunteer Application: Solar Micro-Grids Expertise',
    category: 'Volunteers',
    status: 'UNREAD',
    createdAt: '2025-02-27T09:15:00.000Z',
    content: 'Hello! I am a final-year M.Tech Energy Systems student at IIT Bombay. I have 3 years of hands-on experience designing decentralized solar power supplies. I would love to volunteer for the Melghat tribal clinic vans or school solar electrification.',
    replyHistory: []
  },
  {
    id: 'MSG-403',
    senderName: 'Suresh Chandra Sharma',
    email: 'scsharma.adv@delhibar.org',
    phone: '+91 98111 22334',
    subject: 'Request for 80G Tax Exemption Certificate Revision',
    category: 'Donors',
    status: 'RESOLVED',
    createdAt: '2025-02-26T18:45:00.000Z',
    content: 'Respected Sir/Madam, I made an online donation of ₹50,000 on 15th Feb. My PAN card was entered as ABCPS1234F. Kindly issue the official Form 10BE certificate for my Income Tax filing.',
    replyHistory: [
      {
        date: '2025-02-27T10:00:00.000Z',
        author: 'Executive Administrator (admin@impactbridge.org)',
        text: 'Dear Mr. Sharma, We have generated and emailed your verified 80G certificate (Ref #IB-80G-2025-0870) to your registered email.'
      }
    ]
  },
  {
    id: 'MSG-404',
    senderName: 'Gram Pradhan Jagdish Yadav',
    email: 'yadav.pradhan.barmer@nic.in',
    phone: '+91 94140 88990',
    subject: 'Community Thanks: Taanka Construction in Chohtan',
    category: 'Contact Form',
    status: 'READ',
    createdAt: '2025-02-25T11:20:00.000Z',
    content: 'Pranaam. On behalf of all 85 families of Chohtan hamlet, we express our heartfelt gratitude to Impact Bridge and Er. Rajesh Rathore for completing the 50,000L clean water reservoir before the harsh summer begins.',
    replyHistory: []
  },
  {
    id: 'MSG-405',
    senderName: 'Kavita Chawla',
    email: 'kavita.c@gmail.com',
    phone: '+91 99100 77665',
    subject: 'Inquiry: Organizing a Community Food Drive in Noida',
    category: 'Volunteers',
    status: 'READ',
    createdAt: '2025-02-24T16:00:00.000Z',
    content: 'Hi Team, Our resident welfare society in Noida Sector 62 wants to organize a dry ration collection drive for the Annapurna Seva project. Can you provide collection cartons and volunteer coordinator support?',
    replyHistory: []
  }
];

class MessageModel {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    try {
      if (!fs.existsSync(MESSAGES_FILE)) {
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(INITIAL_MESSAGES, null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('[MessageModel] Error initializing messages.json:', err.message);
    }
  }

  loadMessages() {
    try {
      if (!fs.existsSync(MESSAGES_FILE)) {
        return [];
      }
      const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('[MessageModel] Error loading messages.json:', err.message);
      return [];
    }
  }

  saveMessages(messages) {
    try {
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('[MessageModel] Error saving messages.json:', err.message);
      return false;
    }
  }

  findAll(filters = {}) {
    let messages = this.loadMessages();
    const { status, category, search, page = 1, limit = 50 } = filters;

    if (status && status !== 'ALL') {
      messages = messages.filter((m) => m.status.toUpperCase() === status.toUpperCase());
    }

    if (category && category !== 'ALL') {
      messages = messages.filter((m) => m.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      messages = messages.filter(
        (m) =>
          m.senderName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.content.toLowerCase().includes(q)
      );
    }

    messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = messages.length;
    const startIndex = (page - 1) * limit;
    const paginated = messages.slice(startIndex, startIndex + Number(limit));

    return {
      messages: paginated,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    };
  }

  findById(id) {
    if (!id) return null;
    const messages = this.loadMessages();
    return messages.find((m) => m.id === id) || null;
  }

  create(messageData) {
    const messages = this.loadMessages();
    const timestamp = Date.now();
    const newId = `MSG-${timestamp.toString().slice(-4)}`;

    const newMessage = {
      id: newId,
      senderName: String(messageData.senderName || messageData.name || '').trim(),
      email: String(messageData.email || '').trim().toLowerCase(),
      phone: String(messageData.phone || '').trim(),
      subject: String(messageData.subject || 'Public Inquiry').trim(),
      category: messageData.category || 'General',
      status: 'UNREAD',
      content: String(messageData.content || messageData.message || '').trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replyHistory: []
    };

    messages.unshift(newMessage);
    this.saveMessages(messages);
    return newMessage;
  }

  updateStatus(id, newStatus, adminUser, note = '') {
    const upperStatus = String(newStatus).toUpperCase();
    if (!VALID_STATUSES.includes(upperStatus)) {
      throw new Error(`INVALID_STATUS: Allowed statuses are ${VALID_STATUSES.join(', ')}`);
    }

    const messages = this.loadMessages();
    const msg = messages.find((m) => m.id === id);
    if (!msg) return null;

    msg.status = upperStatus;
    msg.updatedAt = new Date().toISOString();

    if (note && note.trim()) {
      if (!Array.isArray(msg.replyHistory)) msg.replyHistory = [];
      msg.replyHistory.push({
        date: new Date().toISOString(),
        author: adminUser?.name ? `${adminUser.name} (${adminUser.email})` : 'System Administrator',
        text: note.trim()
      });
    }

    this.saveMessages(messages);
    return msg;
  }

  getStats() {
    const messages = this.loadMessages();
    return {
      total: messages.length,
      unread: messages.filter((m) => m.status === 'UNREAD').length,
      read: messages.filter((m) => m.status === 'READ').length,
      resolved: messages.filter((m) => m.status === 'RESOLVED').length
    };
  }
}

module.exports = new MessageModel();
