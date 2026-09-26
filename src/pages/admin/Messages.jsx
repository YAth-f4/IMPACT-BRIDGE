import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
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
  MessageSquare,
  CheckCircle,
  RefreshCw,
  X
} from 'lucide-react';

export default function Messages() {
  const {
    messages: fallbackMessages,
    replyMessage,
    toggleStarMessage,
    markMessageRead,
    deleteMessage,
    fetchAdminMessages,
    updateAdminMessageStatus,
    deleteAdminMessage
  } = useApp();

  const [liveMessages, setLiveMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminMessages();
      if (res && res.messages && res.messages.length > 0) {
        setLiveMessages(res.messages);
        setSelectedMessage((prev) => {
          if (prev) {
            const found = res.messages.find((m) => m.id === prev.id);
            return found || res.messages[0];
          }
          return res.messages[0];
        });
      } else if (fallbackMessages && fallbackMessages.length > 0) {
        setLiveMessages(fallbackMessages);
        if (!selectedMessage) setSelectedMessage(fallbackMessages[0]);
      } else {
        setLiveMessages([]);
        setSelectedMessage(null);
      }
    } catch {
      setLiveMessages(fallbackMessages || []);
      if (!selectedMessage && fallbackMessages?.length > 0) {
        setSelectedMessage(fallbackMessages[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const effectiveMessages = liveMessages.length > 0 ? liveMessages : (fallbackMessages || []);

  const folders = [
    { id: 'All', label: 'All Inquiries', icon: Inbox, count: effectiveMessages.length },
    { id: 'UNREAD', label: 'Unread', icon: Mail, count: effectiveMessages.filter((m) => m.status === 'UNREAD' || (!m.read && m.status !== 'READ' && m.status !== 'RESOLVED')).length },
    { id: 'Volunteers', label: 'Volunteers', icon: Users, count: effectiveMessages.filter((m) => m.category === 'Volunteers').length },
    { id: 'Donors', label: 'Donors & CSR', icon: Heart, count: effectiveMessages.filter((m) => m.category === 'Donors').length },
    { id: 'Contact Form', label: 'Contact Submissions', icon: MessageSquare, count: effectiveMessages.filter((m) => m.category === 'Contact Form').length },
    { id: 'RESOLVED', label: 'Resolved', icon: CheckCircle, count: effectiveMessages.filter((m) => m.status === 'RESOLVED').length },
    { id: 'Starred', label: 'Starred Items', icon: Star, count: effectiveMessages.filter((m) => m.starred).length }
  ];

  const filteredMessages = effectiveMessages.filter((m) => {
    const sender = m.senderName || m.name || '';
    const subject = m.subject || '';
    const content = m.content || m.message || '';

    const matchesSearch =
      sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.toLowerCase().includes(searchQuery.toLowerCase());

    const isUnread = m.status === 'UNREAD' || (!m.read && m.status !== 'READ' && m.status !== 'RESOLVED');

    const matchesFolder =
      activeFolder === 'All'
        ? true
        : activeFolder === 'UNREAD'
        ? isUnread
        : activeFolder === 'RESOLVED'
        ? m.status === 'RESOLVED'
        : activeFolder === 'Starred'
        ? m.starred
        : m.category === activeFolder;

    return matchesSearch && matchesFolder;
  });

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    const isUnread = msg.status === 'UNREAD' || (!msg.read && msg.status !== 'READ' && msg.status !== 'RESOLVED');
    if (isUnread) {
      try {
        await updateAdminMessageStatus(msg.id, 'READ');
        setLiveMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'READ', read: true } : m))
        );
      } catch {
        markMessageRead(msg.id, true);
      }
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText || !selectedMessage) return;

    setSubmittingReply(true);
    try {
      await updateAdminMessageStatus(selectedMessage.id, 'RESOLVED', replyText);
      const newReply = {
        date: new Date().toISOString(),
        author: 'Impact Bridge Administrator',
        text: replyText
      };
      setLiveMessages((prev) =>
        prev.map((m) =>
          m.id === selectedMessage.id
            ? {
                ...m,
                status: 'RESOLVED',
                read: true,
                replyHistory: [...(m.replyHistory || []), newReply]
              }
            : m
        )
      );
      setSelectedMessage((prev) =>
        prev
          ? {
              ...prev,
              status: 'RESOLVED',
              read: true,
              replyHistory: [...(prev.replyHistory || []), newReply]
            }
          : null
      );
      setReplyText('');
      setReplyModalOpen(false);
    } catch {
      replyMessage(selectedMessage.id, replyText);
      setReplyText('');
      setReplyModalOpen(false);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleResolveDirectly = async (msgId) => {
    try {
      await updateAdminMessageStatus(msgId, 'RESOLVED');
      setLiveMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, status: 'RESOLVED', read: true } : m))
      );
      if (selectedMessage?.id === msgId) {
        setSelectedMessage((prev) => (prev ? { ...prev, status: 'RESOLVED', read: true } : null));
      }
    } catch {
      // handled
    }
  };

  const handleDelete = async (msgId) => {
    try {
      await deleteAdminMessage(msgId);
      setLiveMessages((prev) => prev.filter((m) => m.id !== msgId));
      if (selectedMessage?.id === msgId) {
        setSelectedMessage(null);
      }
    } catch {
      deleteMessage(msgId);
      if (selectedMessage?.id === msgId) {
        setSelectedMessage(null);
      }
    }
  };

  const unreadCount = effectiveMessages.filter(
    (m) => m.status === 'UNREAD' || (!m.read && m.status !== 'READ' && m.status !== 'RESOLVED')
  ).length;

  return (
    <div className="admin-messages" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Inquiries & Communication Hub ({unreadCount} Unread)
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Unified real-time inbox for donor inquiries, volunteer questions, and public submissions.
          </p>
        </div>

        <Button variant="white" size="sm" icon={RefreshCw} onClick={loadMessages}>
          Refresh
        </Button>
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
            .inbox-folders {
              flex-direction: row !important;
              flex-wrap: wrap !important;
            }
            .inbox-folders button {
              flex: 1 1 auto !important;
              min-width: 130px !important;
            }
          }
        `}</style>

        {/* Column 1: Folder Navigation */}
        <Card className="inbox-folders" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', backgroundColor: 'var(--white)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#5A6F64', textTransform: 'uppercase', marginBottom: '0.35rem', width: '100%' }}>
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
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ padding: '0.75rem', border: '1.5px solid #000', borderRadius: '4px', background: '#FFF' }}>
                  <Skeleton width="60%" height="14px" style={{ marginBottom: '6px' }} />
                  <Skeleton width="85%" height="12px" style={{ marginBottom: '6px' }} />
                  <Skeleton width="40%" height="10px" />
                </div>
                <div style={{ padding: '0.75rem', border: '1.5px solid #000', borderRadius: '4px', background: '#FFF' }}>
                  <Skeleton width="50%" height="14px" style={{ marginBottom: '6px' }} />
                  <Skeleton width="75%" height="12px" style={{ marginBottom: '6px' }} />
                  <Skeleton width="30%" height="10px" />
                </div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', fontSize: '0.85rem', color: '#5A6F64' }}>
                No messages in this folder.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                const isUnread = msg.status === 'UNREAD' || (!msg.read && msg.status !== 'READ' && msg.status !== 'RESOLVED');
                const isResolved = msg.status === 'RESOLVED';
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    style={{
                      padding: '0.75rem',
                      border: '1.5px solid #000',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? 'var(--brand-light-green)' : isUnread ? '#FFF9DB' : '#FFFFFF',
                      boxShadow: isSelected ? '3px 3px 0 #000' : '1px 1px 0 #000',
                      cursor: 'pointer',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontWeight: isUnread ? 900 : 700, fontSize: '0.85rem' }}>
                        {msg.senderName || msg.name}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#5A6F64', fontWeight: 600 }}>
                        {formatRelativeTime(msg.createdAt || msg.date)}
                      </span>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--brand-dark-green)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {msg.subject}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: '0.75rem', color: '#5A6F64', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, maxWidth: '200px' }}>
                        {msg.content || msg.message}
                      </p>
                      {isResolved && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--brand-dark-green)', backgroundColor: '#E2ECE6', padding: '1px 4px', borderRadius: '3px' }}>
                          ✓ Done
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Column 3: Message Detail View */}
        <Card style={{ padding: 'clamp(1rem, 2vw, 1.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--white)' }}>
          {selectedMessage ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <Badge variant="yellow" size="sm">{selectedMessage.category || 'General'}</Badge>
                    <Badge variant={selectedMessage.status === 'RESOLVED' ? 'green' : selectedMessage.status === 'UNREAD' ? 'yellow' : 'white'} size="sm">
                      {selectedMessage.status || 'READ'}
                    </Badge>
                    <span style={{ fontSize: '0.75rem', color: '#5A6F64', fontWeight: 600 }}>
                      Received: {formatDate(selectedMessage.createdAt || selectedMessage.date)}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem' }}>
                    {selectedMessage.subject}
                  </h3>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>
                    From: {selectedMessage.senderName || selectedMessage.name} ({selectedMessage.email})
                    {selectedMessage.phone && <span> • 📞 {selectedMessage.phone}</span>}
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
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="nb-btn nb-btn-danger nb-btn-sm"
                    style={{ padding: '6px' }}
                    title="Delete Message"
                  >
                    <Trash2 size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#26332D', marginBottom: '1.5rem', whiteSpace: 'pre-wrap', backgroundColor: '#F7FAF8', border: '1.5px solid #000', borderRadius: '4px', padding: '1rem' }}>
                {selectedMessage.content || selectedMessage.message}
              </div>

              {/* Reply History */}
              {selectedMessage.replyHistory?.length > 0 && (
                <div style={{ borderTop: '2px solid #E2ECE6', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#5A6F64', marginBottom: '0.5rem', fontWeight: 800 }}>
                    Official Dispatch History
                  </h4>
                  {selectedMessage.replyHistory.map((rep, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', backgroundColor: '#F0F7F2', border: '1.5px solid #000', borderRadius: '4px', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-dark-green)', marginBottom: '4px' }}>
                        <span>{rep.author}</span>
                        <span>{formatRelativeTime(rep.date)}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#26332D', margin: 0 }}>{rep.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Button variant="yellow" icon={Reply} onClick={() => setReplyModalOpen(true)}>
                  Compose Official Reply
                </Button>
                {selectedMessage.status !== 'RESOLVED' && (
                  <Button variant="white" icon={CheckCircle} onClick={() => handleResolveDirectly(selectedMessage.id)}>
                    Mark Resolved
                  </Button>
                )}
              </div>
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
          title={`Reply to: ${selectedMessage.senderName || selectedMessage.name}`}
          maxWidth="580px"
          footer={
            <>
              <Button variant="white" icon={X} onClick={() => setReplyModalOpen(false)}>Cancel</Button>
              <Button variant="yellow" icon={Send} disabled={submittingReply} onClick={handleSendReply}>
                {submittingReply ? 'Dispatching...' : 'Dispatch Official Reply'}
              </Button>
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
