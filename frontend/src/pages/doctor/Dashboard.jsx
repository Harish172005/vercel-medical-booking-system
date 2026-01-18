import React, { useEffect, useState } from "react";
import API from "../../utils/axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  StackedLineChart,
  EventAvailable,
  PendingActions,
  CheckCircle,
} from "@mui/icons-material";
import { format } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";
import { getDoctorProfile } from "../../api/doctor.js";

const COLORS = ["#1976d2", "#4caf50", "#f44336", "#ff9800"];

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);
  const [stats, setStats] = useState({});
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const profileRes = await getDoctorProfile();
        const id = profileRes.data._id;
        setDoctorId(id);

        const [statsRes, recentRes] = await Promise.all([
          API.get(`/appointments/doctor/${id}/stats`),
          API.get(`/appointments/doctor/${id}/recent`),
        ]);

        setStats(statsRes.data);
        setRecent(recentRes.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );

  if (!doctorId)
    return (
      <Typography align="center" mt={8}>
        No doctor logged in.
      </Typography>
    );

  // ===== Reusable Stat Component =====
  const StatCard = ({ title, value, icon, color }) => (
    <Card
      sx={{
        borderRadius: 3,
        height: "140px",
        background: `linear-gradient(135deg, ${color}22, ${color}55)`,
        boxShadow: "0px 6px 14px rgba(0,0,0,0.1)",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#555" }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: color, width: 50, height: 50 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700 }}>
        Doctor Dashboard
      </Typography>
      {/* ===================== STATS ===================== */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Appointments"
            value={stats.total}
            color="#1976d2"
            icon={<StackedLineChart />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Today's Appointments"
            value={stats.today}
            color="#4caf50"
            icon={<EventAvailable />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Pending"
            value={stats.pending}
            color="#ff9800"
            icon={<PendingActions />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Confirmed"
            value={stats.confirmed}
            color="#009688"
            icon={<CheckCircle />}
          />
        </Grid>
      </Grid>

      {/* ===================== CHARTS ===================== */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Trend Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointment Trend
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ height: 300 }}>
                {stats.trend?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.trend}>
                      <XAxis
                        dataKey="date"
                        tickFormatter={(d) => format(new Date(d), "dd MMM")}
                      />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#1976d2"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography>No trend data.</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Pie */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status Distribution
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ height: 250 }}>
                {stats.statusBreakdown?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.statusBreakdown}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label
                      >
                        {stats.statusBreakdown.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={COLORS[i % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography>No status data.</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ===================== RECENT APPOINTMENTS ===================== */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Recent Appointments</Typography>

                <Link to="/doctor/view-appointments" style={{ textDecoration: "none" }}>
                  <Button variant="contained" size="small">
                    Manage
                  </Button>
                </Link>
              </Box>

              <Divider sx={{ my: 2 }} />

              {recent.length === 0 ? (
                <Typography>No recent appointments.</Typography>
              ) : (
                <List>
                  {recent.map((a) => (
                    <ListItem
                      key={a._id}
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        bgcolor: "#f5f5f5",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                      secondaryAction={
                        <Chip
                          label={a.status}
                          color={
                            a.status === "confirmed"
                              ? "success"
                              : a.status === "pending"
                              ? "warning"
                              : "error"
                          }
                        />
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#1976d2" }}>
                          {a.patientName[0]}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={a.patientName}
                        secondary={
                          <>
                            {a.patientEmail}
                            <br />
                            {format(new Date(a.date), "dd MMM yyyy")} •{" "}
                            {a.timeSlot}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
