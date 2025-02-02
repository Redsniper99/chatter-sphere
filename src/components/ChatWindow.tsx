"use client";

import { useState, useEffect } from "react";
import { Box, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';  // Install uuid for unique id generation

interface Message {
  id: string;
  sender: string;
  text: string;
}

export default function ChatWindow({ chatId }: { chatId: string | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (chatId) {
      fetch(`http://localhost:5001/api/messages/${chatId}`)
        .then(res => res.json())
        .then(setMessages)
        .catch(console.error);
    }
  }, [chatId]);

  

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
  
    const message = { id: uuidv4(), sender: "You", text: newMessage };
  
    setMessages(prev => [...prev, message]);  // Append the new message to the state
    setNewMessage("");
  
    // Send the new message to the backend
    await fetch(`http://localhost:5001/api/messages/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
  };
  

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2 }}>
      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <ListItem key={idx} sx={{ textAlign: msg.sender === "You" ? "right" : "left" }}>
            <ListItemText primary={msg.text} secondary={msg.sender} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField fullWidth value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
        <Button variant="contained" onClick={sendMessage}>Send</Button>
      </Box>
    </Box>
  );
}
