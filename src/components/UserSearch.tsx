import { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface UserSearchProps {
  userId: string;
  onSelectChat: (chatId: string) => void;
}

export default function UserSearch({ userId, onSelectChat }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/users/not-in-chat/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
          setFilteredUsers(data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [userId]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(users.filter((user) => user.name.toLowerCase().includes(query)));
  };

  const handleSelectUser = async (selectedUserId: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/chats/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: userId, recipientId: selectedUserId }),
      });

      if (response.ok) {
        const data = await response.json();
        onSelectChat(data.chatId); // Open chat window
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <TextField fullWidth label="Search users..." variant="outlined" value={searchQuery} onChange={handleSearch} />
      <List>
        {filteredUsers.map((user) => (
          <ListItem key={user.id} onClick={() => handleSelectUser(user.id)} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}>
            <ListItemAvatar>
              <Avatar src={user.avatar} />
            </ListItemAvatar>
            <ListItemText primary={user.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
