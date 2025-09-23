import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDashboardStore = defineStore("dashboard", () => {
  // State
  const stats = ref({
    totalUsers: 0,
    verifiedUsers: 0,
    newUsersThisMonth: 0,
    totalEvents: 0,
    activeEvents: 0,
    publishedEvents: 0,
    totalCoupons: 0,
    activeCoupons: 0,
    totalPreferences: 0,
    totalUserEvents: 0,
    totalEventImages: 0,
  });

  const chartData = ref({
    usersGrowth: [],
    eventsPerMonth: [],
    userRegistrations: [],
    eventAttendance: [],
  });

  const isLoading = ref(false);
  const error = ref(null);
  const lastUpdated = ref(null);

  // Computed
  const verificationRate = computed(() => {
    if (stats.value.totalUsers === 0) return 0;
    return Math.round(
      (stats.value.verifiedUsers / stats.value.totalUsers) * 100
    );
  });

  const activeEventsRate = computed(() => {
    if (stats.value.totalEvents === 0) return 0;
    return Math.round(
      (stats.value.activeEvents / stats.value.totalEvents) * 100
    );
  });

  const activeCouponsRate = computed(() => {
    if (stats.value.totalCoupons === 0) return 0;
    return Math.round(
      (stats.value.activeCoupons / stats.value.totalCoupons) * 100
    );
  });

  const totalSystemEntities = computed(() => {
    return (
      stats.value.totalUsers +
      stats.value.totalEvents +
      stats.value.totalCoupons +
      stats.value.totalPreferences
    );
  });

  const averageEventsPerUser = computed(() => {
    if (stats.value.totalUsers === 0) return 0;
    return (
      Math.round((stats.value.totalUserEvents / stats.value.totalUsers) * 100) /
      100
    );
  });

  const dashboardCards = computed(() => [
    {
      title: "Total Usuarios",
      value: stats.value.totalUsers,
      change: "+12%",
      icon: "UsersIcon",
      color: "blue",
      progress: verificationRate.value,
      actionText: "Ver usuarios",
      actionTo: "/users",
    },
    {
      title: "Usuarios Verificados",
      value: stats.value.verifiedUsers,
      change: "+8%",
      icon: "CheckCircleIcon",
      color: "green",
      progress: verificationRate.value,
      actionText: "Gestionar verificaciones",
      actionTo: "/users?filter=verified",
    },
    {
      title: "Total Eventos",
      value: stats.value.totalEvents,
      change: "+15%",
      icon: "CalendarIcon",
      color: "purple",
      progress: activeEventsRate.value,
      actionText: "Ver eventos",
      actionTo: "/events",
    },
    {
      title: "Eventos Activos",
      value: stats.value.activeEvents,
      change: "+22%",
      icon: "CalendarIcon",
      color: "indigo",
      progress: activeEventsRate.value,
      actionText: "Gestionar eventos",
      actionTo: "/events?filter=active",
    },
    {
      title: "Cupones Activos",
      value: stats.value.activeCoupons,
      change: "+5%",
      icon: "GiftIcon",
      color: "oxford",
      progress: activeCouponsRate.value,
      actionText: "Ver cupones",
      actionTo: "/coupons",
    },
    {
      title: "Preferencias",
      value: stats.value.totalPreferences,
      change: "+3%",
      icon: "CogIcon",
      color: "yellow",
      actionText: "Gestionar preferencias",
      actionTo: "/preferences",
    },
  ]);

  // Actions
  const fetchStats = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // TODO: Implementar llamadas reales a la API
      // Por ahora, datos simulados para desarrollo
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular carga

      // Datos mock para desarrollo
      stats.value = {
        totalUsers: 1247,
        verifiedUsers: 956,
        newUsersThisMonth: 84,
        totalEvents: 156,
        activeEvents: 23,
        publishedEvents: 145,
        totalCoupons: 45,
        activeCoupons: 32,
        totalPreferences: 18,
        totalUserEvents: 2891,
        totalEventImages: 487,
      };

      lastUpdated.value = new Date();

      return { success: true };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  };

  const fetchChartData = async () => {
    try {
      // TODO: Implementar llamadas reales a la API

      // Datos mock para gráficos
      chartData.value = {
        usersGrowth: [
          { month: "Ene 2024", users: 45, verified: 35 },
          { month: "Feb 2024", users: 67, verified: 52 },
          { month: "Mar 2024", users: 89, verified: 71 },
          { month: "Abr 2024", users: 102, verified: 84 },
          { month: "May 2024", users: 134, verified: 108 },
          { month: "Jun 2024", users: 156, verified: 127 },
        ],

        eventsPerMonth: [
          { month: "Ene", events: 12, attendance: 156 },
          { month: "Feb", events: 18, attendance: 234 },
          { month: "Mar", events: 15, attendance: 198 },
          { month: "Abr", events: 21, attendance: 287 },
          { month: "May", events: 25, attendance: 341 },
          { month: "Jun", events: 19, attendance: 267 },
        ],

        userRegistrations: generateTimeSeriesData("registrations", 30),
        eventAttendance: generateTimeSeriesData("attendance", 30),
      };

      return { success: true };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    }
  };

  const refreshDashboard = async () => {
    const [statsResult, chartResult] = await Promise.all([
      fetchStats(),
      fetchChartData(),
    ]);

    return {
      success: statsResult.success && chartResult.success,
      error: statsResult.error || chartResult.error,
    };
  };

  const updateStat = (key, value) => {
    if (key in stats.value) {
      stats.value[key] = value;
    }
  };

  const incrementStat = (key, amount = 1) => {
    if (key in stats.value) {
      stats.value[key] += amount;
    }
  };

  const decrementStat = (key, amount = 1) => {
    if (key in stats.value) {
      stats.value[key] = Math.max(0, stats.value[key] - amount);
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const resetStats = () => {
    stats.value = {
      totalUsers: 0,
      verifiedUsers: 0,
      newUsersThisMonth: 0,
      totalEvents: 0,
      activeEvents: 0,
      publishedEvents: 0,
      totalCoupons: 0,
      activeCoupons: 0,
      totalPreferences: 0,
      totalUserEvents: 0,
      totalEventImages: 0,
    };
    chartData.value = {
      usersGrowth: [],
      eventsPerMonth: [],
      userRegistrations: [],
      eventAttendance: [],
    };
    lastUpdated.value = null;
  };

  return {
    // State
    stats,
    chartData,
    isLoading,
    error,
    lastUpdated,

    // Computed
    verificationRate,
    activeEventsRate,
    activeCouponsRate,
    totalSystemEntities,
    averageEventsPerUser,
    dashboardCards,

    // Actions
    fetchStats,
    fetchChartData,
    refreshDashboard,
    updateStat,
    incrementStat,
    decrementStat,
    clearError,
    resetStats,
  };
});

// Helper function para generar datos de series temporales
function generateTimeSeriesData(type, days = 30) {
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generar valores aleatorios basados en el tipo
    let value;
    switch (type) {
      case "registrations":
        value = Math.floor(Math.random() * 15) + 5; // 5-20 registros por día
        break;
      case "attendance":
        value = Math.floor(Math.random() * 50) + 20; // 20-70 asistencias por día
        break;
      default:
        value = Math.floor(Math.random() * 100);
    }

    data.push({
      date: date.toISOString().split("T")[0],
      value,
      label: date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      }),
    });
  }

  return data;
}
