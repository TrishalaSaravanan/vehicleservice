// Admin Dashboard Stats API
const pool = require('../db');

// Test endpoint to check database connection and data
exports.testDatabase = async (req, res) => {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const [connectionTest] = await pool.query('SELECT 1 as test');
    console.log('Database connection OK:', connectionTest);

    // Check mechanics table
    const [mechanics] = await pool.query('SELECT COUNT(*) as count FROM mechanic');
    console.log('Total mechanics in DB:', mechanics[0].count);

    // Check appointments table
    const [appointments] = await pool.query('SELECT COUNT(*) as count FROM mechanic_appointment');
    console.log('Total appointments in DB:', appointments[0].count);

    // Get some sample data
    const [mechanicsList] = await pool.query('SELECT id, name, is_active FROM mechanic LIMIT 5');
    console.log('Sample mechanics:', mechanicsList);

    res.json({ 
      success: true, 
      data: {
        mechanicsCount: mechanics[0].count,
        appointmentsCount: appointments[0].count,
        sampleMechanics: mechanicsList
      }
    });
  } catch (err) {
    console.error('[TEST DATABASE ERROR]', err.stack || err);
    res.status(500).json({ success: false, message: 'Database test failed', error: err.message });
  }
};

// Get admin dashboard statistics
exports.getAdminStats = async (req, res) => {
  try {
    console.log('Fetching admin stats...');
    
    // Get total mechanics count
    const [mechanicsCount] = await pool.query('SELECT COUNT(*) as count FROM mechanic WHERE is_active = TRUE');
    const totalMechanics = mechanicsCount[0].count;
    console.log('Total active mechanics:', totalMechanics);

    // Get today's appointments/bookings count
    const today = new Date().toISOString().split('T')[0];
    console.log('Today date:', today);
    
    const [todayBookings] = await pool.query(
      'SELECT COUNT(*) as count FROM appointment WHERE DATE(created_at) = ?', 
      [today]
    );
    const newBookings = todayBookings[0].count;
    console.log('New bookings today:', newBookings);

    // Get today's schedules count (appointments scheduled for today)
    const [todaySchedules] = await pool.query(
      'SELECT COUNT(*) as count FROM appointment WHERE DATE(appointment_date) = ?', 
      [today]
    );
    const todaySchedulesCount = todaySchedules[0].count;
    console.log('Today schedules:', todaySchedulesCount);

    // Get previous day data for trend calculation
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];
    console.log('Yesterday date:', yesterdayDate);

    // Get yesterday's bookings for trend
    const [yesterdayBookings] = await pool.query(
      'SELECT COUNT(*) as count FROM appointment WHERE DATE(created_at) = ?', 
      [yesterdayDate]
    );
    const yesterdayBookingsCount = yesterdayBookings[0].count;
    console.log('Yesterday bookings:', yesterdayBookingsCount);

    // Get yesterday's schedules for trend
    const [yesterdaySchedules] = await pool.query(
      'SELECT COUNT(*) as count FROM appointment WHERE DATE(appointment_date) = ?', 
      [yesterdayDate]
    );
    const yesterdaySchedulesCount = yesterdaySchedules[0].count;
    console.log('Yesterday schedules:', yesterdaySchedulesCount);

    // Calculate trends
    const bookingsTrend = yesterdayBookingsCount > 0 
      ? Math.round(((newBookings - yesterdayBookingsCount) / yesterdayBookingsCount) * 100)
      : (newBookings > 0 ? 100 : 0);

    const schedulesTrend = yesterdaySchedulesCount > 0 
      ? Math.round(((todaySchedulesCount - yesterdaySchedulesCount) / yesterdaySchedulesCount) * 100)
      : (todaySchedulesCount > 0 ? 100 : 0);

    // Get last month mechanics count for trend
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthDate = lastMonth.toISOString().split('T')[0];

    const [lastMonthMechanics] = await pool.query(
      'SELECT COUNT(*) as count FROM mechanic WHERE DATE(created_at) <= ? AND is_active = TRUE', 
      [lastMonthDate]
    );
    const lastMonthMechanicsCount = lastMonthMechanics[0].count;

    const mechanicsTrend = lastMonthMechanicsCount > 0 
      ? Math.round(((totalMechanics - lastMonthMechanicsCount) / lastMonthMechanicsCount) * 100)
      : (totalMechanics > 0 ? 100 : 0);

    const stats = {
      totalMechanics: {
        value: totalMechanics,
        trend: mechanicsTrend >= 0 ? 'up' : 'down',
        change: Math.abs(mechanicsTrend),
        period: 'last month'
      },
      newBookings: {
        value: newBookings,
        trend: bookingsTrend >= 0 ? 'up' : 'down',
        change: Math.abs(bookingsTrend),
        period: 'yesterday'
      },
      todaySchedules: {
        value: todaySchedulesCount,
        trend: schedulesTrend >= 0 ? 'up' : 'down',
        change: Math.abs(schedulesTrend),
        period: 'yesterday'
      }
    };

    console.log('Admin stats calculated:', stats);

    res.json({ success: true, stats });
  } catch (err) {
    console.error('[GET ADMIN STATS ERROR]', err.stack || err);
    res.status(500).json({ success: false, message: 'Server error getting stats.', error: err.message });
  }
};

// Get service distribution for charts
exports.getServiceDistribution = async (req, res) => {
  try {
    console.log('[GET SERVICE DISTRIBUTION] Starting...');

    // Query to get service distribution from appointments
    const [serviceRows] = await pool.query(`
      SELECT 
        COALESCE(s.name, 'Unknown Service') as service_name,
        COUNT(a.id) as count
      FROM appointment a
      LEFT JOIN service s ON a.service_id = s.id
      WHERE a.status IN ('Completed', 'Accepted', 'Assigned', 'Pending')
      GROUP BY s.name, s.id
      ORDER BY count DESC
      LIMIT 10
    `);

    console.log('Service distribution query result:', serviceRows);

    // Format data for Chart.js
    const labels = serviceRows.map(row => row.service_name);
    const data = serviceRows.map(row => row.count);
    const total = data.reduce((sum, value) => sum + value, 0);

    // Calculate percentages
    const percentages = data.map(value => total > 0 ? Math.round((value / total) * 100) : 0);

    const distribution = {
      labels,
      data,
      percentages,
      total,
      colors: [
        '#3B82F6', // Blue
        '#10B981', // Green
        '#F59E0B', // Yellow
        '#EF4444', // Red
        '#8B5CF6', // Purple
        '#06B6D4', // Cyan
        '#F97316', // Orange
        '#84CC16', // Lime
        '#EC4899', // Pink
        '#6B7280'  // Gray
      ]
    };

    console.log('Service distribution formatted:', distribution);

    res.json({ success: true, distribution });
  } catch (err) {
    console.error('[GET SERVICE DISTRIBUTION ERROR]', err.stack || err);
    res.status(500).json({ success: false, message: 'Server error getting service distribution.', error: err.message });
  }
};

// Get revenue by service for charts
exports.getRevenueByService = async (req, res) => {
  try {
    console.log('[GET REVENUE BY SERVICE] Starting...');

    // Query to get revenue by service from appointments
    const [revenueRows] = await pool.query(`
      SELECT 
        COALESCE(s.name, 'Unknown Service') as service_name,
        SUM(COALESCE(a.price, 0)) as total_revenue,
        COUNT(a.id) as appointment_count
      FROM appointment a
      LEFT JOIN service s ON a.service_id = s.id
      WHERE a.status IN ('Completed', 'Accepted', 'Assigned') 
        AND a.price IS NOT NULL 
        AND a.price > 0
      GROUP BY s.name, s.id
      ORDER BY total_revenue DESC
      LIMIT 10
    `);

    console.log('Revenue by service query result:', revenueRows);

    // Format data for Chart.js
    const labels = revenueRows.map(row => row.service_name);
    const data = revenueRows.map(row => parseFloat(row.total_revenue) || 0);
    const appointmentCounts = revenueRows.map(row => row.appointment_count);

    const revenue = {
      labels,
      data,
      appointmentCounts,
      total: data.reduce((sum, value) => sum + value, 0),
      colors: [
        '#3B82F6', // Blue
        '#10B981', // Green
        '#F59E0B', // Yellow
        '#EF4444', // Red
        '#8B5CF6', // Purple
        '#06B6D4', // Cyan
        '#F97316', // Orange
        '#84CC16', // Lime
        '#EC4899', // Pink
        '#6B7280'  // Gray
      ]
    };

    console.log('Revenue by service formatted:', revenue);

    res.json({ success: true, revenue });
  } catch (err) {
    console.error('[GET REVENUE BY SERVICE ERROR]', err.stack || err);
    res.status(500).json({ success: false, message: 'Server error getting revenue by service.', error: err.message });
  }
};

// Get weekly appointments data for charts
exports.getWeeklyAppointments = async (req, res) => {
  try {
    console.log('[GET WEEKLY APPOINTMENTS] Starting...');

    // Get the current week's date range (Monday to Sunday)
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Calculate days to Monday
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    // Generate array of dates for the week
    const weekDates = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }

    console.log('Week dates:', weekDates);

    // Query appointments for each day of the week
    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
      const [dayAppointments] = await pool.query(`
        SELECT COUNT(*) as count
        FROM appointment 
        WHERE DATE(appointment_date) = ?
      `, [weekDates[i]]);
      
      weeklyData.push(dayAppointments[0].count);
    }

    console.log('Weekly appointments data:', weeklyData);

    const appointments = {
      labels: dayNames,
      data: weeklyData,
      weekDates: weekDates,
      total: weeklyData.reduce((sum, count) => sum + count, 0)
    };

    console.log('Weekly appointments formatted:', appointments);

    res.json({ success: true, appointments });
  } catch (err) {
    console.error('[GET WEEKLY APPOINTMENTS ERROR]', err.stack || err);
    res.status(500).json({ success: false, message: 'Server error getting weekly appointments.', error: err.message });
  }
};
