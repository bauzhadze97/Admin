import defaultInstance from "plugins/axios"

export const createAgreement = async (data) => {
    return defaultInstance.post('/api/agreements', data)
}