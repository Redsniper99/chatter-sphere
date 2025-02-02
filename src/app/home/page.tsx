"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";

export default function ChatHome() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar onSelectChat={setSelectedChat} />
      <ChatWindow chatId={selectedChat} />
    </Box>
  );
}
