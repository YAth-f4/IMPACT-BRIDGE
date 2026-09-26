import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { SkeletonTableRow } from '../../components/common/Skeleton';
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  RefreshCw,
  Edit2,
  X,
  Check
} from 'lucide-react';

export default function AdminUsers() {
  const { fetchAdminUsers, updateAdminUserRole, addToast } = useApp();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Edit role modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('volunteer');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const data = await fetchAdminUsers();
    setUsers(data || []);
    setLoading(false);
  }, [fetchAdminUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleOpenRoleModal = (u) => {
    setSelectedUser(u);
    setNewRole(u.role);
    setRoleModalOpen(true);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsUpdating(true);
    const res = await updateAdminUserRole(selectedUser.id, newRole);
    setIsUpdating(false);

    if (res.success) {
      setRoleModalOpen(false);
      loadUsers();
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role.toLowerCase() === roleFilter.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Badge variant="red" size="sm">ADMIN</Badge>;
      case 'volunteer':
        return <Badge variant="green" size="sm">VOLUNTEER</Badge>;
      case 'donor':
        return <Badge variant="yellow" size="sm">DONOR</Badge>;
      case 'beneficiary':
        return <Badge variant="lightgreen" size="sm">BENEFICIARY</Badge>;
      default:
        return <Badge variant="gray" size="sm">GUEST</Badge>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>👥</span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: 900, margin: 0 }}>
              User Accounts & Role Management
            </h1>
          </div>
          <p style={{ color: '#5A6F64', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
            Inspect registered accounts, roles, authentication providers, and access privileges.
          </p>
        </div>

        <Button variant="white" size="sm" icon={RefreshCw} onClick={loadUsers}>
          Refresh
        </Button>
      </div>

      {/* Filter Card */}
      <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Search by name, email, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '0.55rem', border: '2px solid #000', borderRadius: '4px' }}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '0.55rem', border: '2px solid #000', borderRadius: '4px', backgroundColor: '#FFFFFF', fontWeight: 700 }}
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="admin">Administrators</option>
            <option value="volunteer">Volunteers</option>
            <option value="donor">Donors</option>
            <option value="beneficiary">Beneficiaries</option>
            <option value="guest">Public / Guests</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000', padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#EDF4F0', borderBottom: '2.5px solid #000' }}>
                <th style={{ padding: '0.75rem 1rem' }}>User ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                <th style={{ padding: '0.75rem 1rem' }}>Auth Method</th>
                <th style={{ padding: '0.75rem 1rem' }}>Registered</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: '#6B7280' }}>
                    No users found matching query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>{u.id}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>
                      {u.name}
                      {u.isPrimaryAdmin && (
                        <span style={{ marginLeft: '0.4rem', fontSize: '0.72rem', backgroundColor: '#FFEAEA', border: '1px solid #000', padding: '1px 5px', borderRadius: '3px' }}>
                          Owner
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#4B5563' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{getRoleBadge(u.role)}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#5A6F64' }}>
                      {u.authProvider || 'Local Password'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#5A6F64', fontSize: '0.8rem' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      {!u.isPrimaryAdmin ? (
                        <Button
                          variant="white"
                          size="sm"
                          icon={Edit2}
                          onClick={() => handleOpenRoleModal(u)}
                        >
                          Role
                        </Button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontStyle: 'italic' }}>Protected</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Change Modal */}
      {roleModalOpen && selectedUser && (
        <Modal
          isOpen={roleModalOpen}
          onClose={() => setRoleModalOpen(false)}
          title={`Update Role: ${selectedUser.name}`}
          maxWidth="440px"
        >
          <form onSubmit={handleUpdateRole} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.88rem' }}>
              Assign a new system role for <strong>{selectedUser.name}</strong> ({selectedUser.email}).
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Select Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', border: '2px solid #000', borderRadius: '4px', backgroundColor: '#FFFFFF', fontWeight: 700 }}
              >
                <option value="volunteer">Volunteer (Tasks, Applications, Programs)</option>
                <option value="donor">Donor (Donations, Campaigns, 80G)</option>
                <option value="beneficiary">Beneficiary (Help Requests, Aid)</option>
                <option value="guest">Guest / Public User</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Button variant="white" size="sm" type="button" icon={X} onClick={() => setRoleModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="yellow" size="sm" type="submit" icon={Check} disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Confirm Role Change'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
