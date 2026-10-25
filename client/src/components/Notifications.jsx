import { useState, useEffect } from 'react';
import { passengerAPI } from '../utils/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await passengerAPI.getNotifications();
      setNotifications(res.data.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await passengerAPI.markNotificationRead(id);
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="glass p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>

        {notifications.length === 0 ? (
          <p className="text-gray-600">No notifications</p>
        ) : (
          <div className="space-y-4">
            {notifications.map(notif => (
              <div
                key={notif._id}
                className={`p-4 rounded-lg border-l-4 transition-smooth ${
                  notif.readAt
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`font-medium ${notif.readAt ? 'text-gray-700' : 'text-blue-900'}`}>
                      {notif.title}
                    </p>
                    <p className={`text-sm ${notif.readAt ? 'text-gray-600' : 'text-blue-800'} mt-1`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notif.readAt && (
                    <button
                      onClick={() => handleMarkAsRead(notif._id)}
                      className="ml-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-smooth whitespace-nowrap"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
