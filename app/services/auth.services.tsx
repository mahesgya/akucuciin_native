import axios from "axios";
import { config } from "../../config/env"
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = config.apiUrl;

const AuthServices = {
    Login: async (email:string, password:string) => {
        try {
            const response = await axios.post(`${API_URL}/api/laundry_partner/app/login`, {email: email, password: password})
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }, 
    
}

export default AuthServices;
