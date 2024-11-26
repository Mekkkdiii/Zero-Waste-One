// Admin Users
export const DUMMY_USERS = [
    {
      id: 1,
      name: 'Admin 1',
      email: 'admin1@admin.com',
      password: 'Default123',
      phone: '+1234567890',
      community: 'Greenwood Apartments',
      dateCreated: '2024-01-10',
      role: 'admin',
    },
    {
      id: 2,
      name: 'Admin 2',
      email: 'admin2@admin.com',
      password: 'Default123',
      phone: '+0987654321',
      community: 'Lakeside Villas',
      dateCreated: '2024-02-15',
      role: 'admin',
    },
    {
      id: 101,
      fullName: 'User 1',
      email: 'user1@community.com',
      password: 'Password123',
      phone: '+1111111111',
      residentialAddress: '123 Elm Street',
      postalCode: '54321',
      community: 'Greenwood Apartments',
      role: 'community-user',
    },
    {
      id: 102,
      fullName: 'User 2',
      email: 'user2@community.com',
      password: 'Password123',
      phone: '+2222222222',
      residentialAddress: '456 Pine Street',
      postalCode: '67890',
      community: 'Lakeside Villas',
      role: 'community-user',
    }
  ];
  
  // Communities
  export const DUMMY_COMMUNITIES = [
    {
      id: 1,
      name: 'Greenwood Apartments',
      address: '789 Oak Street, Cityville',
      dateCreated: '2024-01-10',
    },
    {
      id: 2,
      name: 'Lakeside Villas',
      address: '101 Lake Road, Townsville',
      dateCreated: '2024-02-15',
    }
  ];
  
  // Issues
  export const DUMMY_ISSUES = [
    {
      id: 1,
      reportedBy: 101,
      community: 'Greenwood Apartments',
      description: 'Overflowing bins near the entrance',
      status: 'New',
      dateReported: '2024-10-01',
    },
    {
      id: 2,
      reportedBy: 102,
      community: 'Lakeside Villas',
      description: 'Missed pickup for recyclables',
      status: 'In Progress',
      dateReported: '2024-10-10',
    }
  ];
  
  // Pickups
  export const DUMMY_PICKUPS = [
    {
      id: 1,
      community: 'Greenwood Apartments',
      pickupDate: '2024-10-22',
      type: 'General Waste',
      status: 'Completed',
    },
    {
      id: 2,
      community: 'Lakeside Villas',
      pickupDate: '2024-10-23',
      type: 'Recyclables',
      status: 'Scheduled',
    }
  ];
  
  // Reports
  export const DUMMY_REPORTS = [
    {
      id: 1,
      community: 'Greenwood Apartments',
      reportType: 'Pickup Statistics',
      dateRange: '2024-10-01 to 2024-10-22',
      generatedBy: 1,
    },
    {
      id: 2,
      community: 'Lakeside Villas',
      reportType: 'Reported Issues',
      dateRange: '2024-10-01 to 2024-10-15',
      generatedBy: 2,
    }
  ];
  
  // Schedules
  export const DUMMY_SCHEDULES = [
    {
      id: 1,
      community: 'Greenwood Apartments',
      scheduleDate: '2024-10-24',
      type: 'General Waste',
    },
    {
      id: 2,
      community: 'Lakeside Villas',
      scheduleDate: '2024-10-25',
      type: 'Recyclables',
    }
  ];
  