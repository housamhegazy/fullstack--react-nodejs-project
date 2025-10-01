import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

// شاشة تحميل كاملة تظهر أثناء انتظار الـ loader
const fetchingdataLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default", 
        color: "text.primary",
      }}
    >
      <CircularProgress sx={{ mb: 2 }} color="primary" />
      <Typography variant="h6"> Fetching Data ........... </Typography>
      <Typography variant="body2"> please wait </Typography>
    </Box>
  );
};

export default fetchingdataLoader;
