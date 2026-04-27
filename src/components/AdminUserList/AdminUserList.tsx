import React, { useEffect, useState } from "react";

interface User {
  _id: string;
  email: string;
  username: string;
  role: string;
}

interface AdminUserListProps {
  adminToken: string;
}

const AdminUserList: React.FC<AdminUserListProps> = ({ adminToken }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (!res.ok) throw new Error("Kunde inte hämta användare");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Något gick fel");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  
  const handleDelete = async (id: string) => {
    if (!window.confirm("Är du säker på att du vill ta bort denna användare?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (!res.ok) throw new Error("Kunde inte ta bort användare");
      setUsers(users.filter(user => user._id !== id));
    } catch (err: any) {
      alert(err.message || "Något gick fel vid borttagning");
    }
  };

  if (loading) return <div>Laddar användare...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;
  const grouped = users.reduce<{ [role: string]: User[] }>((acc, user) => {
    acc[user.role] = acc[user.role] || [];
    acc[user.role].push(user);
    return acc;
  }, {});

  return (
    <div>
      <h2>Användare & Organisationer</h2>
      {Object.entries(grouped).map(([role, users]) => (
        <div key={role} style={{marginBottom: 24}}>
          <h3 style={{textTransform: 'capitalize'}}>{role === 'organization' ? 'Organisationer' : role.charAt(0).toUpperCase() + role.slice(1)}</h3>
          <ul>
            {users.map(user => (
              <li
                key={user._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '12px 16px',
                  marginBottom: 12,
                  background: '#f3f3f3',
                  borderRadius: 10,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <span>
                  {role === 'organization' ? (
                    <>
                      <strong>{user.username}</strong> <span style={{color:'#888'}}>(org)</span> – {user.email}
                    </>
                  ) : (
                    <>
                      {user.username} – {user.email}
                    </>
                  )}
                  <span style={{marginLeft:8, color:'#aaa'}}>({role})</span>
                </span>
                <button onClick={() => handleDelete(user._id)}>Ta bort</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminUserList;
