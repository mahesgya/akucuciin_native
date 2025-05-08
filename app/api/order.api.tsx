import axios from "axios"
import { config } from "@/config/env";

const API_URL = config.apiUrl

const OrderApi = {
    getOrderByLaundry: async (accessToken:string) => {
        try {
            const response = await axios.get(`${API_URL}/api/laundry_partner/app/orders`, {
                headers : {Authorization: `Bearer ${accessToken}`}
            })

            return response.data.data;
        } catch (error) {
            throw error; 
        }
    },
    getOrderById : async (idOrder:string, accessToken:string) => {
        try {
            const response = await axios.get(`${API_URL}/api/laundry_partner/app/order/${idOrder}`, {
                headers : {Authorization: `Bearer ${accessToken}`}
            })

            return response.data.data
        } catch (error) {
            throw error;
        }
    },
    updateStatusOrder : async (formData:any, idOrder:string, accessToken:string) => {
        try {
            const response = await axios.put(`${API_URL}/api/laundry_partner/app/order/${idOrder}`, formData, {
                headers : {Authorization: `Bearer ${accessToken}`}
            })

            return response.data.data
        } catch (error) {
            throw error
        }
    }
}

export default OrderApi