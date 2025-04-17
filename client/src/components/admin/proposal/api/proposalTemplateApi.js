import axios from 'axios';

// const API_BASE_URL = '/api'; // Adjust based on your setup

export const getTemplates = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/proposal-templates`);
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

export const getTemplateById = async (id) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/proposal-templates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching template ${id}:`, error);
    throw error;
  }
};

export const seedTemplates = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/proposal-templates/seed`);
    return response.data;
  } catch (error) {
    console.error('Error seeding templates:', error);
    throw error;
  }
};
