import axios from "axios";
import { config } from "../../config/env"
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = config.apiUrl;

const AuthApi = {
    Login: async (email:string, password:string) => {
        try {
            const response = await axios.post(`${API_URL}/api/laundry_partner/app/login`, {email: email, password: password})
            const {accessToken, refreshToken} = response.data.data;

            await AsyncStorage.setItem("accessToken", accessToken);
            await AsyncStorage.setItem("refreshToken", refreshToken);

            return response.data.data;
        } catch (error) {
            throw error;
        }
    }, 
    Logout: async (refreshToken:string) => {
        try {
            const response = await axios.post(`${API_URL}/api/laundry_partner/app/logout`, {refresh_token : refreshToken})

            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("refreshToken");

            return response.data.data;
        } catch (error) {
            throw error;
        }
    },
    TokenRefresh: async (refreshTokenOld:string) => {
        try {
            const response = await axios.put(`${API_URL}/api/auth`, {refresh_token : refreshTokenOld} )
            const {accessTokenNew, refreshTokenNew} = response.data.data;

            await AsyncStorage.setItem("accessToken", accessTokenNew);
            await AsyncStorage.setItem("refreshToken", refreshTokenNew);

            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
}

export default AuthApi;
