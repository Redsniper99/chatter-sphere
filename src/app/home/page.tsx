"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import { useAuth } from "@/context/AuthContext"; // Import the AuthContext

export default function ChatHome() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { user } = useAuth(); // Get the current user from the context

  // Log user.id when the user is loaded
  useEffect(() => {
    if (user) {
      console.log("User ID:", user._id);
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>; // Handle the case when the user isn't loaded yet
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar onSelectChat={setSelectedChat} userId={user._id} /> {/* Pass userId */}
      <ChatWindow chatId={selectedChat} />
    </Box>
  );
}
