// Initialize admin user in localStorage
const initializeAdmin = () => {
  const adminUser = {
    id: "admin-" + Date.now(),
    email: "AhmedHusseinElsayed@outlook.com",
    password: "Cas@135$", // In a real app, this should be hashed
    first_name: "Ahmed",
    last_name: "Hussein Elsayed",
    role: "admin",
    status: "Active",
    permissions: {
      viewCases: true,
      manageCases: true,
      viewReports: true,
      generateReports: true,
      viewUsers: true,
      manageUsers: true,
      viewMessages: true,
      manageSettings: true
    }
  };

  // Initialize users in localStorage if not exists
  const existingUsers = localStorage.getItem('users');
  if (!existingUsers) {
    localStorage.setItem('users', JSON.stringify([adminUser]));
    console.log('Admin user initialized successfully');
  } else {
    // Check if admin user already exists
    const users = JSON.parse(existingUsers);
    const adminExists = users.some((user: any) => user.email === adminUser.email);
    if (!adminExists) {
      users.push(adminUser);
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Admin user added successfully');
    } else {
      console.log('Admin user already exists');
    }
  }
};

export { initializeAdmin }; 