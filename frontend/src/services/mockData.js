// Mock Users
export const users = [
  {
    id: 1,
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'USER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    balance: 1000
  },
  {
    id: 2,
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'ADMIN',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    balance: 5000
  }
];

// Mock Datasets
export const datasets = [
  {
    id: 1,
    title: 'E-commerce Customer Behavior',
    description: 'Comprehensive dataset containing customer shopping patterns and behaviors',
    price: 299.99,
    seller: {
      id: 2,
      name: 'Admin User',
      rating: 4.8
    },
    category: 'E-commerce',
    size: '2.5 GB',
    format: 'CSV',
    lastUpdated: '2025-09-15',
    rating: 4.5,
    reviews: 128,
    purchases: 350
  },
  {
    id: 2,
    title: 'Social Media Trends 2025',
    description: 'Analysis of social media engagement and trending topics',
    price: 199.99,
    seller: {
      id: 1,
      name: 'John Doe',
      rating: 4.6
    },
    category: 'Social Media',
    size: '1.8 GB',
    format: 'JSON',
    lastUpdated: '2025-09-10',
    rating: 4.7,
    reviews: 89,
    purchases: 245
  },
  {
    id: 3,
    title: 'Healthcare Patient Records',
    description: 'Anonymized patient data for healthcare analysis',
    price: 499.99,
    seller: {
      id: 2,
      name: 'Admin User',
      rating: 4.8
    },
    category: 'Healthcare',
    size: '5.2 GB',
    format: 'CSV, JSON',
    lastUpdated: '2025-09-18',
    rating: 4.9,
    reviews: 67,
    purchases: 120
  }
];

// Mock Categories
export const categories = [
  {
    id: 1,
    name: 'E-commerce',
    icon: '🛍️',
    count: 156
  },
  {
    id: 2,
    name: 'Healthcare',
    icon: '🏥',
    count: 89
  },
  {
    id: 3,
    name: 'Social Media',
    icon: '📱',
    count: 234
  },
  {
    id: 4,
    name: 'Finance',
    icon: '💰',
    count: 167
  }
];

// Mock Reviews
export const reviews = [
  {
    id: 1,
    userId: 1,
    datasetId: 1,
    rating: 5,
    comment: 'Excellent dataset, very comprehensive!',
    date: '2025-09-15'
  },
  {
    id: 2,
    userId: 2,
    datasetId: 1,
    rating: 4,
    comment: 'Good quality data, helped with our analysis',
    date: '2025-09-14'
  }
];

// Mock Transactions
export const transactions = [
  {
    id: 1,
    buyerId: 1,
    sellerId: 2,
    datasetId: 1,
    price: 299.99,
    date: '2025-09-15',
    status: 'COMPLETED'
  },
  {
    id: 2,
    buyerId: 2,
    sellerId: 1,
    datasetId: 2,
    price: 199.99,
    date: '2025-09-14',
    status: 'COMPLETED'
  }
];

// Mock Authentication Service
export const mockAuthService = {
  login: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.password !== credentials.password) {
      throw new Error('Invalid password');
    }
    
    // Create a session token (in real app, this would be a JWT)
    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      balance: user.balance,
      token: 'mock-jwt-token-' + user.id
    };
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(sessionUser));
    
    return sessionUser;
  },
  
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};