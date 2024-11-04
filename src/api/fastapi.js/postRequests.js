import API_ENDPOINTS from "./apiEndpoints";
import axios from "axios";

const postRequest = async (
    data,
    url, 
    header = {}, 
    responseType = 'json'
) => {
    try {
        return await axios.post(url, data, {
            headers: header,
            responseType: responseType
        });
    } catch (e) {
        throw e;
    }
}

const postMethod = async () => { 
    const header = {
        'Accept': 'application/json'
    }

    return await postRequest(
        null,
        API_ENDPOINTS.generateData,
        header
    );
}


export {postMethod};