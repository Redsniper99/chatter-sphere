import { Box, Avatar, IconButton, Typography } from "@mui/material";
import ChatList from "./ChatList";
import { useState } from "react";

export default function Sidebar({ onSelectChat }: { onSelectChat: (id: string) => void }) {
  return (
    <Box sx={{ width: 300, display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", p: 2, borderBottom: "1px solid #ddd" }}>
        <Avatar src="/user-avatar.png" />
        <Typography sx={{ ml: 2 }}>User Name</Typography>
        <IconButton sx={{ ml: "auto" }}>⚙️</IconButton>
      </Box>
      <ChatList onSelectChat={onSelectChat} userId={""} />
    </Box>
  );
}
