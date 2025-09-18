// Mock user data
const mockUsers = [
  {
    id: 1,
    email: "admin@example.com",
    password: "admin123", // In a real app, passwords would be hashed
    name: "Admin User",
    role: "ADMIN",
  },
  {
    id: 2,
    email: "user@example.com",
    password: "user123",
    name: "Regular User",
    role: "USER",
  },
];

// Simulated delay to mimic API call
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock authentication service
export const mockAuthService = {
  // Login function
  login: async (credentials) => {
    await delay(1000); // Simulate network delay

    const user = mockUsers.find((u) => u.email === credentials.email);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.password !== credentials.password) {
      throw new Error("Invalid password");
    }

    // Create a user object without the password
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      token: "mock-jwt-token-" + user.id, // Simulate JWT token
    };

    // Store in localStorage to persist the session
    localStorage.setItem("user", JSON.stringify(userResponse));

    return userResponse;
  },

  // Register function
  register: async (payload) => {
    await delay(1000);

    const { fullName, email, password } = payload || {};

    if (!fullName || !email || !password) {
      throw new Error("Missing required fields");
    }

    const existing = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      throw new Error("Email is already registered");
    }

    const newUser = {
      id: mockUsers.length ? Math.max(...mockUsers.map((u) => u.id)) + 1 : 1,
      email,
      password,
      name: fullName,
      role: "USER",
    };

    mockUsers.push(newUser);

    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      token: "mock-jwt-token-" + newUser.id,
    };

    localStorage.setItem("user", JSON.stringify(userResponse));

    return userResponse;
  },

  // Logout function
  logout: async () => {
    await delay(500); // Simulate network delay
    localStorage.removeItem("user");
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};
