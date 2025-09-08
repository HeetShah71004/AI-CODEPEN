// Local storage based user operations (No MongoDB required)

// Simple hash function for passwords (in production, use bcrypt)
const hashPassword = async (password) => {
  // For demo purposes, using a simple hash. In production, use bcrypt
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

// Simulate API calls to MongoDB (in a real app, these would be server-side API endpoints)
export const authService = {
  async signup(userData) {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { name, email, password } = userData;

      // Check if user already exists (simulate)
      const existingUsers = JSON.parse(
        localStorage.getItem("ai-codepen-users") || "[]"
      );
      const userExists = existingUsers.some((user) => user.email === email);

      if (userExists) {
        throw new Error("User with this email already exists");
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const newUser = {
        _id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage (simulating MongoDB)
      existingUsers.push(newUser);
      localStorage.setItem("ai-codepen-users", JSON.stringify(existingUsers));

      // Return user data without password
      const { password: _, ...userWithoutPassword } = newUser;
      return {
        success: true,
        user: userWithoutPassword,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  async login(credentials) {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { email, password } = credentials;

      // Get users from localStorage (simulating MongoDB query)
      const existingUsers = JSON.parse(
        localStorage.getItem("ai-codepen-users") || "[]"
      );
      const user = existingUsers.find((user) => user.email === email);

      if (!user) {
        throw new Error("User not found");
      }

      // Verify password
      const hashedPassword = await hashPassword(password);
      if (user.password !== hashedPassword) {
        throw new Error("Invalid password");
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      const userIndex = existingUsers.findIndex((u) => u._id === user._id);
      existingUsers[userIndex] = user;
      localStorage.setItem("ai-codepen-users", JSON.stringify(existingUsers));

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        user: userWithoutPassword,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  async getCurrentUser(userId) {
    try {
      const existingUsers = JSON.parse(
        localStorage.getItem("ai-codepen-users") || "[]"
      );
      const user = existingUsers.find((user) => user._id === userId);

      if (!user) {
        return { success: false, error: "User not found" };
      }

      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        user: userWithoutPassword,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

// In a real application, you would have server-side API endpoints
// This demo uses localStorage for simplicity

/*
// Example server-side implementation (not used in this demo)

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user in database
    const user = { name, email, password: hashedPassword };
    
    res.status(201).json({ user: { name, email, _id: user._id } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user and verify password
    const user = await findUserByEmail(email);
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    res.json({ user: { name: user.name, email: user.email, _id: user._id } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/
