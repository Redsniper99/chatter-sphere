import { Box, Avatar, IconButton, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import ChatList from "./ChatList";
import { useState, useEffect } from "react";

// Function to call the backend to create or get a chat
const createOrGetChatAPI = async (userId1: string, userId2: string) => {

  
  const response = await fetch('http://localhost:5001/api/chats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    
    body: JSON.stringify({ userId1, userId2 }),
  });
  return response.json();
};

// Function to get all chats for a user
const getAllChatsAPI = async (userId: string) => {
  const response = await fetch(`http://localhost:5001/api/chats/${userId}`);
  return response.json();
};

export default function Sidebar({ onSelectChat, userId }: { onSelectChat: (id: string) => void, userId: string }) {
  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
  const [newChatUsername, setNewChatUsername] = useState('');
  const [error, setError] = useState('');
  const [chats, setChats] = useState<any[]>([]);  // For storing chat data

  // Fetch all chats when component mounts
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const result = await getAllChatsAPI(userId);
        setChats(result.chats);
        console.log(result);
      } catch (err) {
        console.error("Error fetching chats", err);
      }
    };
    fetchChats();
  }, [userId]);

  // Open the new chat dialog
  const handleOpenNewChat = () => {
    setOpenNewChatDialog(true);
  };

  // Close the new chat dialog
  const handleCloseNewChat = () => {
    setOpenNewChatDialog(false);
  };

  // Handle the creation of a new chat
  const handleCreateNewChat = async () => {
    try {
      // Find or create a new chat by calling the backend API
      const result = await createOrGetChatAPI(userId, newChatUsername);
      console.log(userId);
      console.log(newChatUsername);
      if (result.chat) {
        // Optionally, you can automatically select the new chat
        onSelectChat(result.chat._id);
        setChats([result.chat, ...chats]);  // Add the new chat to the chat list
        handleCloseNewChat();  // Close the dialog
      } else {
        setError('Could not create or find the chat.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <Box sx={{ width: 300, display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", p: 2, borderBottom: "1px solid #ddd" }}>
        {/* <Avatar src="/user-avatar.png" /> */}
        <Typography sx={{ ml: 2 }}>User Name</Typography>
        <IconButton sx={{ ml: "auto" }}>⚙️</IconButton>
      </Box>

      {/* Button to start a new chat */}
      <Button 
        variant="contained" 
        sx={{ m: 2 }} 
        onClick={handleOpenNewChat}
      >
        New Chat
      </Button>

      {/* Chat List Component */}
      <ChatList userId={userId} onSelectChat={onSelectChat} /> {/* Fixed here */}

      {/* New Chat Dialog */}
      <Dialog open={openNewChatDialog} onClose={handleCloseNewChat}>
        <DialogTitle>Start a New Chat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Enter Username"
            type="text"
            fullWidth
            variant="standard"
            value={newChatUsername}
            onChange={(e) => setNewChatUsername(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewChat} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateNewChat} color="primary">
            Start Chat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
