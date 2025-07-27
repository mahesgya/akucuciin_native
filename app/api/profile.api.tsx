import axios from "axios"
import { config } from "@/config/env";

const API_URL = config.apiUrl

const ProfileApi = {
    getProfile : async (accessToken:string) => {
        try {
            const response = await axios.get(`${API_URL}/api/laundry_partner/app/profile`, {
                headers : {Authorization: `Bearer ${accessToken}`}
            })
            console.log(response)
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },
    updateProfile : async (formData:any, accessToken:string) => {
        try {
            const response = await axios.put(`${API_URL}/api/laundry_partner/app/profile`, formData, {
                headers : {Authorization: `Bearer ${accessToken}`}
            })

            return response.data.data;
        } catch (error) {
            throw error;
        }
    },
    openCloseToggle : async (accessToken:string) => {
        try {
            const response = await axios.put(`${API_URL}/api/laundry_partner/app/toggle-open-close`, {}, {
                headers : {Authorization: `Bearer ${accessToken}`}
            })
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

}

export default ProfileApi