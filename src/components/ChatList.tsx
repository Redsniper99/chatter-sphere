import { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Box, CircularProgress, Typography } from '@mui/material';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
}

interface ChatListProps {
  userId: string;  // Explicitly define the type for userId
  onSelectChat: (id: string) => void;
}

export default function ChatList({ userId, onSelectChat }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/messages/all/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setChats(data.chats); // Assuming API returns `{ chats: [...] }`
        } else {
          console.error('Failed to fetch chats');
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchChats();
    }
  }, [userId]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  }

  if (chats.length === 0) {
    return <Typography variant="body1" align="center">No chats available</Typography>;
  }

  return (
    <List>
      {chats.map((chat) => (
        <ListItem key={chat.id} component="li" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box
            component="div"
            sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
            onClick={() => onSelectChat(chat.id)}
          >
            <ListItemAvatar>
              <Avatar src={chat.avatar} />
            </ListItemAvatar>
            <ListItemText primary={chat.name} secondary={chat.lastMessage} />
          </Box>
          <IconButton edge="end">⋮</IconButton> {/* Your action button */}
        </ListItem>
      ))}
    </List>
  );
}
