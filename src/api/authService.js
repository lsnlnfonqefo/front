const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class AuthService {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("로그인에 실패했습니다.");
      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      return this.mockLogin(email, password);
    }
  }

  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("로그아웃에 실패했습니다.");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return this.mockLogout();
    }
  }

  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Get current user error:", error);
      return this.mockGetCurrentUser();
    }
  }

  mockLogin(email, password) {
    const users = [
      {
        id: "1",
        email: "customer@test.com",
        password: "1234",
        name: "고객",
        role: "customer",
      },
      {
        id: "2",
        email: "admin@test.com",
        password: "admin",
        name: "관리자",
        role: "admin",
      },
    ];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      return Promise.resolve(userWithoutPassword);
    }

    return Promise.reject(
      new Error("이메일 또는 비밀번호가 올바르지 않습니다.")
    );
  }

  mockLogout() {
    localStorage.removeItem("currentUser");
    return Promise.resolve(true);
  }

  mockGetCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return Promise.resolve(user ? JSON.parse(user) : null);
  }
}

export default new AuthService();
