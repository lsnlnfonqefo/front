const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class AuthService {
  /**
   * 로그인
   * POST /api/auth/login
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "로그인에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.user;
      }
      throw new Error("로그인에 실패했습니다.");
    } catch (error) {
      console.error("Login error:", error);
      // Fallback to mock for development
      return this.mockLogin(email, password);
    }
  }

  /**
   * 로그아웃
   * POST /api/auth/logout
   */
  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("로그아웃에 실패했습니다.");
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Logout error:", error);
      return this.mockLogout();
    }
  }

  /**
   * 현재 사용자 정보 조회
   * GET /api/auth/me
   */
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });

      // 401이면 로그인 안 된 상태
      if (response.status === 401) {
        return null;
      }

      if (!response.ok) {
        throw new Error("사용자 정보를 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.user;
      }
      return null;
    } catch (error) {
      console.error("Get current user error:", error);
      return this.mockGetCurrentUser();
    }
  }

  // Mock methods (개발용)
  mockLogin(email, password) {
    const users = [
      {
        id: 1,
        email: "customer@test.com",
        password: "1234",
        name: "고객",
        role: "USER",
      },
      {
        id: 2,
        email: "admin@test.com",
        password: "admin",
        name: "관리자",
        role: "ADMIN",
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
