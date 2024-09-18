import defaultInstance from '../plugins/axios'; // Adjust the path if your axios instance is located elsewhere

// Fetch list of VIP leads
export const getVipLeads = async (page = 1, limit = 10) => {
  try {
    const response = await defaultInstance.get('/api/vip-leads', {
      params: {
        page,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching VIP leads:', error);
    throw error;
  }
};

// Create new VIP lead entry
export const createVipLead = async (data) => {
  try {
    const response = await defaultInstance.post('/api/vip-leads', data);
    return response.data;
  } catch (error) {
    console.error('Error creating VIP lead:', error);
    throw error;
  }
};

// Update VIP lead entry
export const updateVipLead = async (id, data) => {
  try {
    const response = await defaultInstance.put(`/api/vip-leads/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating VIP lead:', error);
    throw error;
  }
};

// Delete VIP lead entry
export const deleteVipLead = async (id) => {
  try {
    const response = await defaultInstance.delete(`/api/vip-leads/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting VIP lead:', error);
    throw error;
  }
};
