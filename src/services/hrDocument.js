import defaultInstance from "plugins/axios";

export const createHrDocument = async (data) => {
    return defaultInstance.post('/api/hr-documents', data);
}

export const updateHrDocumentStatus = async (hrDocumentId, status) => {
    return defaultInstance.patch(`/api/hr-documents/${hrDocumentId}/status`, { status });
}

export const getHrDocuments = async () => {
    return defaultInstance.get('/api/hr-documents');
}

export const getCurrentUserHrDocuments = async () => {
    return defaultInstance.get('/api/hr-documents/user');
}
