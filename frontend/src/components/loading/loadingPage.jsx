import { Box, CircularProgress, Typography } from "@mui/material";

// شاشة تحميل كاملة تظهر أثناء انتظار الـ loader
const CustomLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#001E3C", 
        color: "white",
      }}
    >
      <CircularProgress sx={{ mb: 2 }} color="primary" />
      <Typography variant="h6"> Loading ........... </Typography>
      <Typography variant="body2"> please wait </Typography>
    </Box>
  );
};

export default CustomLoader;
