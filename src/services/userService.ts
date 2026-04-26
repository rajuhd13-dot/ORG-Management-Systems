const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7FLsOGJDUluBeLYm85VU-HyOM8yZ2pjcpzzX4Oz7N80IPFVAgL6uv788SZM4LfuilgA/exec';

export const fetchUsers = async () => {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ action: 'getUsers' })
    });
    const data = await response.json();
    if (data.ok) {
        return data.users;
    }
    throw new Error(data.error);
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const saveUsers = async (users: any[]) => {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ action: 'saveUsers', users })
    });
    const data = await response.json();
    if (data.ok) {
        return true;
    }
    throw new Error(data.error);
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
};
