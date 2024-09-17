import defaultInstance from '../plugins/axios'; // Adjust the path if your axios instance is located elsewhere

// Fetch list of leads
export const getLeads = async (page = 1, limit = 10) => {
  try {
    const response = await defaultInstance.get('/api/leads', {
      params: {
        page: page,
        limit: limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};

// Create new lead entry
export const createLead = async (data) => {
  try {
    const response = await defaultInstance.post('/api/leads', data);
    return response.data;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

// Update lead entry
export const updateLead = async (id, data) => {
  try {
    const response = await defaultInstance.put(`/api/leads/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
};

// Delete lead entry
export const deleteLead = async (id) => {
  try {
    const response = await defaultInstance.delete(`/api/leads/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }
};
