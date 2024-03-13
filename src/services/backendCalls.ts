import api from "@/lib/axios";
import {CreateLocalFormData, CreateUserFormData, LoginFormData, clientData, equipmentData, rentsData} from "@/types/types";
import dotenv from 'dotenv';

dotenv.config();

const loginApi = process.env.NEXT_PUBLIC_API_LOGIN
const senhaApi = process.env.NEXT_PUBLIC_API_PASS

export async function handleEmailLogin(data: LoginFormData){
    return data.email == 'admin@locatudo.com' && data.password === '123456' ? {status: 200, message: 'Login efetuado com sucesso'} : {status: 500, message: "Erro ao realizar Login"};
}

export async function getAllClients() {
    try{
        const response = await api.get(`app_hotel/ibeacon_locals`);
        const data: clientData[] = response.data;
        return { status: 200, data: data};
    } catch(err){
        return{ status: 500, data: []};
    }
}
export async function getAllEquipments() {
    try{
        const response = await api.get(`app_hotel/ibeacon_locals`);
        const data: equipmentData[] = response.data;
        return { status: 200, data: data};
    } catch(err){
        return{ status: 500, data: []};
    }
}
export async function getAllRents() {
    try{
        const response = await api.get(`app_hotel/ibeacon_locals`);
        const data: rentsData[] = response.data;
        return { status: 200, data: data};
    } catch(err){
        return{ status: 500, data: []};
    }
}
export async function createClient(data: clientData) {
    const objectString = JSON.stringify(data);
    try{
        const response = await api.post(`clientes/${objectString}`);
        const data: rentsData[] = response.data;
        return { status: 200, data: data};
    } catch(err){
        return{ status: 500, data: []};
    }
}

