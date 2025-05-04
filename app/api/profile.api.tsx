import axios from "axios"
import { config } from "@/config/env";

const API_URL = config.apiUrl

const profileApi = {
    getProfile : async (accessToken:string) => {
        try {
            const response = await axios.get(`${API_URL}/api/laundry_partner/app/profile`, {
                headers : {Authorization: `Bearer ${accessToken}`}
            })

            return response.data.data;
        } catch (error) {
            throw error
        }
    }
}

export default profileApi