import Link from 'next/link';

export default function AdminTable({ data, type, onAction }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center py-10">
        <i className="fas fa-box-open text-4xl text-gray-500 mb-2"></i>
        <p>No {type === 'users' ? 'users' : 'items'} found</p>
      </div>
    );
  }

  if (type === 'users') {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="p-2 border-b text-left">Name</th>
              <th className="p-2 border-b text-left">Email</th>
              <th className="p-2 border-b text-left">Phone</th>
              <th className="p-2 border-b text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user._id}>
                <td className="p-2 border-b">{user.name || 'N/A'}</td>
                <td className="p-2 border-b">{user.email || 'N/A'}</td>
                <td className="p-2 border-b">{user.phone || 'N/A'}</td>
                <td className="p-2 border-b">{user.role || 'user'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr>
            <th className="p-2 border-b text-left">Item</th>
            <th className="p-2 border-b text-left">Category</th>
            <th className="p-2 border-b text-left">Status</th>
            <th className="p-2 border-b text-left">Date</th>
            <th className="p-2 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td className="p-2 border-b">{item.title || 'N/A'}</td>
              <td className="p-2 border-b">{item.category || 'N/A'}</td>
              <td className="p-2 border-b">
                <span
                  className={`px-2 py-1 rounded ${
                    item.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : item.status === 'claimed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.status || 'N/A'}
                </span>
              </td>
              <td className="p-2 border-b">
                {item.date ? new Date(item.date).toLocaleString() : 'N/A'}
              </td>
              <td className="p-2 border-b">
                <Link
                  href={`/item/${item._id}`}
                  className="text-blue-600 hover:underline mr-2"
                >
                  View
                </Link>
                {type === 'pending' && (
                  <>
                    <button
                      onClick={() => onAction(item._id, 'approve')}
                      className="text-green-600 hover:underline mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onAction(item._id, 'reject')}
                      className="text-red-600 hover:underline mr-2"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => onAction(item._id, 'delete')}
                  disabled={item.status === 'claimed'}
                  className={`text-red-600 hover:underline ${
                    item.status === 'claimed' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}