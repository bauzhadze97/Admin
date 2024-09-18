import defaultInstance from '../plugins/axios'; // Adjust the path if your axios instance is located elsewhere

/**
 * Fetch list of leads
 * @param {number} page - The current page of leads.
 * @param {number} limit - The number of leads per page.
 * @returns The list of leads from the server.
 */
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

/**
 * Create a new lead entry
 * @param {object} data - The data for creating a new lead.
 * @returns The newly created lead data.
 */
export const createLead = async (data) => {
  try {
    const response = await defaultInstance.post('/api/leads', data);
    return response.data;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

/**
 * Update an existing lead entry
 * @param {number} id - The ID of the lead to update.
 * @param {object} data - The new data for the lead.
 * @returns The updated lead data.
 */
export const updateLead = async (id, data) => {
  try {
    const response = await defaultInstance.put(`/api/leads/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
};

/**
 * Delete a lead entry
 * @param {number} id - The ID of the lead to delete.
 * @returns Confirmation of the deletion.
 */
export const deleteLead = async (id) => {
  try {
    const response = await defaultInstance.delete(`/api/leads/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }
};
