import axios from "axios";
import API_ENDPOINTS from "./apiEndpoints";

const getRequest = async (
    url, 
    header = {}, 
    responseType = 'json'
) => {
    try {
        return await axios.get(url, {
            headers: header,
            responseType: responseType
        });
    } catch (e) {
        return e;
    }
}

const getCirclesData = async () => {
    const getCirclesDataHeader = {
        'Accept': 'application/json',
    }
    return await getRequest(API_ENDPOINTS.getCirclesData, getCirclesDataHeader)
}

const getIpadData = async (swaidId) => {
    const getUserObjectsHeader = {
        'Accept': 'application/json',
    };
    const url = `https://alavenir.tech/api/sber500/get_data_for_ipad?swaid_id=${swaidId}`;
    const response = await getRequest(url, getUserObjectsHeader);
    
    return response
};


const checkUpdateScreen = async () => {
    const getCirclesDataHeader = {
        'Accept': 'application/json',
    }
    return await getRequest(API_ENDPOINTS.checkUpdateScreen, getCirclesDataHeader)
}

export {getCirclesData, getIpadData, checkUpdateScreen};