import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Input, Textarea } from '../../components/common/Input';
import { formatRelativeTime, formatDate } from '../../utils/formatters';
import {
  Mail,
  Search,
  Star,
  Trash2,
  Reply,
  Inbox,
  Send,
  Users,
  Heart,
  MessageSquare
} from 'lucide-react';

export default function Messages() {
  const {
    messages,
    replyMessage,
    toggleStarMessage,
    markMessageRead,
    deleteMessage
  } = useApp();

  const [activeFolder, setActiveFolder] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(messages[0] || null);

  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const folders = [
    { id: 'All', label: 'All Inquiries', icon: Inbox, count: messages.length },
    { id: 'Volunteers', label: 'Volunteers', icon: Users, count: messages.filter((m) => m.category === 'Volunteers').length },
    { id: 'Donors', label: 'Donors & CSR', icon: Heart, count: messages.filter((m) => m.category === 'Donors').length },
    { id: 'Contact Form', label: 'Contact Submissions', icon: MessageSquare, count: messages.filter((m) => m.category === 'Contact Form').length },
    { id: 'Starred', label: 'Starred Items', icon: Star, count: messages.filter((m) => m.starred).length }
  ];

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFolder =
      activeFolder === 'All'
        ? true
        : activeFolder === 'Starred'
        ? m.starred
        : m.category === activeFolder;

    return matchesSearch && matchesFolder;
  });

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      markMessageRead(msg.id, true);
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText || !selectedMessage) return;

    replyMessage(selectedMessage.id, replyText);
    setReplyText('');
    setReplyModalOpen(false);
  };

  return (
    <div className="admin-messages" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Inquiries & Communication Hub ({messages.filter((m) => !m.read).length} Unread)
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Unified inbox for volunteer applications, donor inquiries, and public support requests.
          </p>
        </div>
      </div>

      {/* 2. INBOX MAIN LAYOUT */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '240px 340px 1fr',
          gap: '1rem',
          minHeight: '600px',
          alignItems: 'stretch'
        }}
        className="inbox-grid"
      >
        <style>{`
          @media (max-width: 1024px) {
            .inbox-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* Column 1: Folder Navigation */}
        <Card style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', backgroundColor: 'var(--white)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#5A6F64', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            FOLDERS
          </span>
          {folders.map((f) => {
            const isActive = activeFolder === f.id;
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFolder(f.id)}
                style={{
                  padding: '0.65rem 0.85rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.85rem',
                  border: isActive ? '2px solid #000' : '2px solid transparent',
                  borderRadius: '4px',
                  backgroundColor: isActive ? 'var(--accent-yellow)' : 'transparent',
                  color: '#000000',
                  boxShadow: isActive ? '2.5px 2.5px 0 #000' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon size={16} strokeWidth={2.5} />
                  <span>{f.label}</span>
                </div>
                {f.count > 0 && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#E2ECE6', padding: '1px 6px', borderRadius: '3px', border: '1px solid #000' }}>
                    {f.count}
                  </span>
                )}
              </button>
            );
          })}
        </Card>

        {/* Column 2: Message Stream List */}
        <Card style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'var(--white)' }}>
          <Input
            placeholder="Search inquiries..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: '520px' }}>
            {filteredMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', fontSize: '0.85rem', color: '#5A6F64' }}>
                No messages in this folder.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    style={{
                      padding: '0.75rem',
                      border: '1.5px solid #000',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? 'var(--brand-light-green)' : msg.read ? '#FFFFFF' : '#FFF9DB',
                      boxShadow: isSelected ? '3px 3px 0 #000' : '1px 1px 0 #000',
                      cursor: 'pointer',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontWeight: msg.read ? 700 : 900, fontSize: '0.85rem' }}>
                        {msg.senderName}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#5A6F64', fontWeight: 600 }}>
                        {formatRelativeTime(msg.date)}
                      </span>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--brand-dark-green)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {msg.subject}
                    </div>

                    <p style={{ fontSize: '0.75rem', color: '#5A6F64', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {msg.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Column 3: Message Detail View */}
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--white)' }}>
          {selectedMessage ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                    <Badge variant="yellow" size="sm">{selectedMessage.category}</Badge>
                    <span style={{ fontSize: '0.75rem', color: '#5A6F64', fontWeight: 600 }}>
                      Received: {formatDate(selectedMessage.date)}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem' }}>
                    {selectedMessage.subject}
                  </h3>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>
                    From: {selectedMessage.senderName} ({selectedMessage.email})
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => toggleStarMessage(selectedMessage.id)}
                    className={`nb-btn ${selectedMessage.starred ? 'nb-btn-yellow' : 'nb-btn-white'} nb-btn-sm`}
                    style={{ padding: '6px' }}
                    title="Star Message"
                  >
                    <Star size={16} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => {
                      deleteMessage(selectedMessage.id);
                      setSelectedMessage(null);
                    }}
                    className="nb-btn nb-btn-danger nb-btn-sm"
                    style={{ padding: '6px' }}
                    title="Delete Message"
                  >
                    <Trash2 size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#26332D', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                {selectedMessage.content}
              </div>

              {/* Reply History */}
              {selectedMessage.replyHistory?.length > 0 && (
                <div style={{ borderTop: '2px solid #E2ECE6', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#5A6F64', marginBottom: '0.5rem' }}>
                    Sent Replies
                  </h4>
                  {selectedMessage.replyHistory.map((rep, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', backgroundColor: '#F0F7F2', border: '1.5px solid #000', borderRadius: '4px', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-dark-green)', marginBottom: '4px' }}>
                        <span>{rep.author}</span>
                        <span>{formatRelativeTime(rep.date)}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#26332D' }}>{rep.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <Button variant="yellow" icon={Reply} onClick={() => setReplyModalOpen(true)}>
                Compose Official Reply
              </Button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#5A6F64' }}>
              Select a message from the list to view full communication details.
            </div>
          )}
        </Card>
      </div>

      {/* REPLY MODAL */}
      {selectedMessage && (
        <Modal
          isOpen={replyModalOpen}
          onClose={() => setReplyModalOpen(false)}
          title={`Reply to: ${selectedMessage.senderName}`}
          maxWidth="580px"
          footer={
            <>
              <Button variant="white" onClick={() => setReplyModalOpen(false)}>Cancel</Button>
              <Button variant="yellow" icon={Send} onClick={handleSendReply}>Dispatch Email Reply</Button>
            </>
          }
        >
          <form onSubmit={handleSendReply}>
            <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#5A6F64' }}>
              Sending to: <strong>{selectedMessage.email}</strong> • Re: {selectedMessage.subject}
            </div>

            <Textarea
              label="Official Response"
              rows={6}
              required
              placeholder="Type your official NGO communication here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </form>
        </Modal>
      )}
    </div>
  );
}
