import { useState } from 'react';
import { mockAllUsers } from '../../store/mockData';

export default function UserManagementPage() {
  const [users, setUsers] = useState(mockAllUsers);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    roles: ['passenger'],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.displayName) {
      alert('Please fill all fields');
      return;
    }

    const newUser = {
      _id: String(users.length + 1),
      ...formData,
      status: 'active',
    };

    setUsers([...users, newUser]);
    setFormData({ email: '', displayName: '', roles: ['passenger'] });
    setShowForm(false);
    alert('User created successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="glass p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? '✕ Cancel' : '+ New User'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Display Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Roles</label>
              <select
                multiple
                className="input-field"
                value={formData.roles}
                onChange={(e) => setFormData({
                  ...formData,
                  roles: Array.from(e.target.selectedOptions, opt => opt.value)
                })}
              >
                <option value="passenger">Passenger</option>
                <option value="driver">Driver</option>
                <option value="conductor">Conductor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full">
              Create User
            </button>
          </form>
        )}
      </div>

      {/* Users Table */}
      <div className="glass p-6 rounded-xl overflow-x-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">All Users</h3>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Roles</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-b hover:bg-gray-50 transition-smooth">
                <td className="px-4 py-3">{user.displayName}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.roles?.map(role => (
                      <span key={role} className="badge badge-info text-xs">
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
