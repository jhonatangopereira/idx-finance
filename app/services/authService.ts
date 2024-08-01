export interface User {
    access: string;
    refresh: string;
}

const login = async (username: string, password: string): Promise<User> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/token/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.access) {
        localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = (): User | null => {

    const userStr = localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    }
    console.log(userStr)
    return null;
};

export default {
    login,
    logout,
    getCurrentUser,
};
