import { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Box, CircularProgress, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Participant {
  _id: string;
  username: string;
  avatar: string;
}

interface LastMessage {
  content: string;
}

interface Chat {
  _id: string;
  participants: Participant[];
  lastMessage: LastMessage;
}

interface ChatListProps {
  userId: string;
  onSelectChat: (id: string) => void;
}

export default function ChatList({ userId, onSelectChat }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchChats();
  }, [userId]);

  const fetchChats = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/chats/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats);
      } else {
        console.error('Failed to fetch chats');
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async () => {
    if (!chatToDelete) return;

    try {
      const response = await fetch(`http://localhost:5001/api/chats/${chatToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setChats(prevChats => prevChats.filter(chat => chat._id !== chatToDelete));
        setDeleteDialogOpen(false);
        setChatToDelete(null);
      } else {
        console.error('Failed to delete chat');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  }

  if (chats.length === 0) {
    return <Typography variant="body1" align="center">No chats available</Typography>;
  }

  return (
    <List>
      {chats.map((chat) => {
        const otherParticipant = chat.participants.find(participant => participant._id !== userId);

        return (
          <ListItem key={chat._id} component="li" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box
              component="div"
              sx={{ display: 'flex', alignItems: 'center', width: '100%', cursor: 'pointer' }}
              onClick={() => onSelectChat(chat._id)}
            >
              <ListItemAvatar>
                <Avatar src={otherParticipant?.avatar || '/default-avatar.png'} />
              </ListItemAvatar>
              <ListItemText 
                primary={otherParticipant?.username || 'Unknown User'} 
                secondary={chat.lastMessage?.content || 'No messages yet'} 
              />
            </Box>

            {/* Delete button */}
            <IconButton edge="end" onClick={() => { setChatToDelete(chat._id); setDeleteDialogOpen(true); }}>
              <DeleteIcon color="error" />
            </IconButton>
          </ListItem>
        );
      })}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Chat</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this chat?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteChat} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </List>
  );
}
