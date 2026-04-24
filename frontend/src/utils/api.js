import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || "https://full-stack-project-4-olmj.onrender.com/api";

export const runTool = async (tool, category, args, file = null) => {
  const formData = new FormData();
  formData.append('tool', tool);
  formData.append('category', category);
  formData.append('args', args);
  if (file) {
    formData.append('file', file);
  }

  try {
    const response = await axios.post(`${API_BASE}/run`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      output: ''
    };
  }
};

export const getWebInfo = async (url, type) => {
  try {
    const response = await axios.post(`${API_BASE}/web/info`, { url, type });
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
