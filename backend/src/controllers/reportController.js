const pool = require('../db');

// Get Customer Report Data
exports.getCustomerReport = async (req, res) => {
  try {
    console.log('[GET CUSTOMER REPORT] Starting...');

    const query = `
      SELECT 
        c.id as customer_id,
        c.name,
        u.email,
        c.phone,
        c.is_active as status,
        c.created_at as registration_date,
        COUNT(DISTINCT a.id) as total_appointments,
        COALESCE(SUM(a.price), 0) as total_spent,
        MAX(a.appointment_date) as last_appointment_date,
        COUNT(DISTINCT v.id) as vehicle_count
      FROM customer c
      LEFT JOIN user u ON c.user_id = u.id
      LEFT JOIN vehicle v ON c.id = v.customer_id
      LEFT JOIN appointment a ON c.id = a.customer_id
      GROUP BY c.id, c.name, u.email, c.phone, c.is_active, c.created_at
      ORDER BY c.created_at DESC
    `;

    const [customers] = await pool.query(query);

    // Format the data
    const formattedCustomers = customers.map(customer => ({
      customer_id: customer.customer_id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || 'N/A',
      total_appointments: customer.total_appointments,
      total_spent: parseFloat(customer.total_spent) || 0,
      last_appointment_date: customer.last_appointment_date 
        ? new Date(customer.last_appointment_date).toISOString().split('T')[0] 
        : 'Never',
      vehicle_count: customer.vehicle_count,
      registration_date: new Date(customer.registration_date).toISOString().split('T')[0],
      status: customer.status ? 'ACTIVE' : 'INACTIVE'
    }));

    console.log(`Customer report generated: ${formattedCustomers.length} customers`);

    res.json({ 
      success: true, 
      customers: formattedCustomers,
      total: formattedCustomers.length
    });

  } catch (err) {
    console.error('[GET CUSTOMER REPORT ERROR]', err.stack || err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting customer report.', 
      error: err.message 
    });
  }
};

// Get Mechanic Report Data
exports.getMechanicReport = async (req, res) => {
  try {
    console.log('[GET MECHANIC REPORT] Starting...');

    const query = `
      SELECT 
        m.id as mechanic_id,
        m.name,
        u.email,
        m.phone,
        m.experience,
        m.is_active as status,
        m.created_at as join_date
      FROM mechanic m
      LEFT JOIN user u ON m.user_id = u.id
      ORDER BY m.created_at DESC
    `;

    const [mechanics] = await pool.query(query);

    // Get specializations and certifications for each mechanic
    const mechanicsWithDetails = await Promise.all(mechanics.map(async (mechanic) => {
      // Get specializations
      const [specializations] = await pool.query(
        'SELECT specialization FROM mechanic_specialization WHERE mechanic_id = ?',
        [mechanic.mechanic_id]
      );

      // Get certifications
      const [certifications] = await pool.query(
        'SELECT certification FROM mechanic_certification WHERE mechanic_id = ?',
        [mechanic.mechanic_id]
      );

      return {
        name: mechanic.name,
        email: mechanic.email,
        phone: mechanic.phone || 'N/A',
        experience: mechanic.experience || 0,
        specializations: specializations.map(s => s.specialization).join(', ') || 'None',
        certifications: certifications.map(c => c.certification).join(', ') || 'None',
        join_date: new Date(mechanic.join_date).toISOString().split('T')[0],
        status: mechanic.status ? 'ACTIVE' : 'INACTIVE'
      };
    }));

    console.log(`Mechanic report generated: ${mechanicsWithDetails.length} mechanics`);

    res.json({ 
      success: true, 
      mechanics: mechanicsWithDetails,
      total: mechanicsWithDetails.length
    });

  } catch (err) {
    console.error('[GET MECHANIC REPORT ERROR]', err.stack || err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting mechanic report.', 
      error: err.message 
    });
  }
};

// Export Customer Report to Excel (placeholder for future implementation)
exports.exportCustomerReport = async (req, res) => {
  try {
    // This would generate Excel file - for now return CSV format
    res.json({ success: true, message: 'Export functionality to be implemented' });
  } catch (err) {
    console.error('[EXPORT CUSTOMER REPORT ERROR]', err.stack || err);
    res.status(500).json({ success: false, message: 'Export failed' });
  }
};

// Export Mechanic Report to Excel (placeholder for future implementation)
exports.exportMechanicReport = async (req, res) => {
  try {
    // This would generate Excel file - for now return CSV format
    res.json({ success: true, message: 'Export functionality to be implemented' });
  } catch (err) {
    console.error('[EXPORT MECHANIC REPORT ERROR]', err.stack || err);
    res.status(500).json({ success: false, message: 'Export failed' });
  }
};
