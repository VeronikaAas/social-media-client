import { remove } from "../../storage/index.js";

export function logout() {
	remove("token");
	remove("profile");
}

export const logout = () => {
    localStorage.removeItem('token');
};