import defaultInstance from '../plugins/axios';

<<<<<<< HEAD
=======
// Fetch a list of daily reports with pagination and sorting
>>>>>>> 9627d4e (added comments page)
export const getDailyList = async (page = 1, limit = 10, sortBy = 'created_at', order = 'desc') => {
    try {
        const response = await defaultInstance.get('/api/dailies', {
            params: {
                page: page,
                limit: limit,
                sortBy: sortBy,
                order: order
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching daily list:', error);
        throw error;
    }
};

<<<<<<< HEAD
export const createDaily = async (data) => {
    console.log(data)
    const formData = new FormData();
    formData.append('name', data.reportTitle);
    formData.append('date', data.selectDate);
    formData.append('description', data.description);
    formData.append('department_id', data.department); 
    if (data.attachment) {
        formData.append('attachment', data.attachment, data.attachment.name);
    }
    if (data.link) {
        formData.append('link', data.link);
    }
    return defaultInstance.post('/api/dailies', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const getDaily = async (id) => {
    return defaultInstance.get(`/api/dailies/${id}`);
}

export const updateDaily = async (id, data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('date', data.date);
    formData.append('description', data.description);
    formData.append('department_id', data.department_id); // Add department_id
    if (data.attachment) {
        formData.append('attachment', data.attachment, data.attachment.name);
    }
    if (data.link) {
        formData.append('link', data.link);
    }
    return defaultInstance.put(`/api/dailies/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const deleteDaily = async (id) => {
    return defaultInstance.delete(`/api/dailies/${id}`);
=======
// Create a new daily report
export const createDaily = async (data) => {
    try {
        const formData = new FormData();
        formData.append('name', data.reportTitle);
        formData.append('date', data.selectDate);
        formData.append('description', data.description);
        formData.append('department_id', data.department); 

        if (data.attachment) {
            formData.append('attachment', data.attachment, data.attachment.name);
        }

        if (data.link) {
            formData.append('link', data.link);
        }

        const response = await defaultInstance.post('/api/dailies', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        console.error('Error creating daily report:', error);
        throw error;
    }
}

// Fetch a single daily report by ID
export const getDaily = async (id) => {
    try {
        const response = await defaultInstance.get(`/api/dailies/${id}`);
        return response;
    } catch (error) {
        console.error('Error fetching daily report:', error);
        throw error;
    }
}

// Update an existing daily report by ID
export const updateDaily = async (id, data) => {
    try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('date', data.date);
        formData.append('description', data.description);
        formData.append('department_id', data.department_id); 

        if (data.attachment) {
            formData.append('attachment', data.attachment, data.attachment.name);
        }

        if (data.link) {
            formData.append('link', data.link);
        }

        const response = await defaultInstance.put(`/api/dailies/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        console.error('Error updating daily report:', error);
        throw error;
    }
}

// Delete a daily report by ID
export const deleteDaily = async (id) => {
    try {
        const response = await defaultInstance.delete(`/api/dailies/${id}`);
        return response;
    } catch (error) {
        console.error('Error deleting daily report:', error);
        throw error;
    }
}

// Fetch comments for a specific daily report
export const getComments = async (dailyId) => {
    try {
        const response = await defaultInstance.get(`/api/dailies/${dailyId}/comments`);
        return response;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
}

// Post a new comment for a specific daily report
export const postComment = async (dailyId, comment) => {
    try {
        const response = await defaultInstance.post(`/api/dailies/${dailyId}/comments`, comment);
        return response;
    } catch (error) {
        console.error('Error posting comment:', error);
        throw error;
    }
>>>>>>> 9627d4e (added comments page)
}
