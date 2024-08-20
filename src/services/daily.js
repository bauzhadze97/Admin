import defaultInstance from '../plugins/axios';

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
}
