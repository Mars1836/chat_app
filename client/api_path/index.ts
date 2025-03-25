import axios from "axios";
export const origin = process.env.NEXT_PUBLIC_BACKEND_URL_API;
const instance = axios.create({
  withCredentials: true,
});
class ApiPath {
  origin: string;
  constructor(origin: string | "localhost:3000") {
    this.origin = origin;
  }
  getOrigin() {
    return this.origin;
  }
  async login(username: string, password: string) {
    return await instance.post(`${this.origin}/api/auth/sign-in`, {
      username,
      password,
    });
  }
  async register(
    username: string,
    password: string,
    name: string,
    gender: string,
    dateOfBirth: string,
    address: string,
    phoneNumber: string,
    citizenIdentificationCard: string
  ) {
    return await instance.post(`${this.origin}/api/auth/sign-up`, {
      citizenIdentificationCard,
      username,
      password,
      name,
      gender,
      dateOfBirth,
      address,
      phoneNumber,
    });
  }
  async logout() {
    return await instance.post(`${this.origin}/api/auth/logout`);
  }
  async getUser() {
    return await instance.get(`${this.origin}/api/me`);
  }
  async getOtherUsers() {
    return await instance.get(`${this.origin}/api/users/others`);
  }
  async getUserById(id: string) {
    return await instance.get(`${this.origin}/api/users/${id}`);
  }
  async getMessages(senderId: string, receiverId: string) {
    return await instance.get(
      `${this.origin}/api/messages/${senderId}/${receiverId}`
    );
  }
  async getUserByUsername(username: string) {
    return await instance.get(`${this.origin}/api/users/username/${username}`);
  }
}
const apiPath = new ApiPath(origin || "http://localhost:3000");
export default apiPath;
