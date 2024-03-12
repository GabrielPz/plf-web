import api from "@/lib/axios";
import { CardsInfo, CreateLocalFinalData, CreateLocalFormData, CreateUserFormData, LoginFormData, RegisterForm, Signatures, UpdateLocalData, categories, formDataInfo, localData } from "@/types/types";
import dotenv from 'dotenv';

dotenv.config();

const loginApi = process.env.NEXT_PUBLIC_API_LOGIN
const senhaApi = process.env.NEXT_PUBLIC_API_PASS

export async function handleEmailLogin(data: LoginFormData){
    return data.email == 'admin@locatudo.com' && data.password === '123456' ? {status: 200, message: 'Login efetuado com sucesso'} : {status: 500, message: "Erro ao realizar Login"};
}

export async function getAllCategories() {
    try{
        const response = await api.get('app_hotel/ibeacon_category');
        const data: categories[] = response.data;
        return data;
    } catch(err){
        return [];
    }
}

export async function getAllLocals() {
    try{
        const idClientfromSession = sessionStorage.getItem('id_client');
        const response = await api.get(`app_hotel/ibeacon_locals/${idClientfromSession}`);
        const data: localData[] = response.data;
        return data;
    } catch(err){
        return[];
    }
}

export async function handleCreateCard(formInfo: formDataInfo, files: File[]) {

    console.log(formInfo);
    let formData = new FormData();
    formData.append('brute_value', formInfo.brute_value.toString());
    formData.append('desc_cupom', formInfo.desc_cupom);
    formData.append('discount_value', formInfo.discount_value.toString());
    formData.append('expiration_data', formInfo.expiration_data);
    formData.append('has_price', formInfo.has_price.toString());
    formData.append('ibeacon_uuid', formInfo.ibeacon_uuid);
    formData.append('id_category', formInfo.id_category.toString());
    formData.append('id_client', formInfo.id_client.toString());
    formData.append('id_local', formInfo.id_local.toString());
    formData.append('lat_cupom', formInfo.lat_cupom);
    formData.append('link_cupom', formInfo.link_cupom);
    formData.append('lon_cupom', formInfo.lon_cupom);
    formData.append('name_cupom', formInfo.name_cupom);
    formData.append('value_with_discount', formInfo.value_with_discount.toString());
    formData.append('file', files[0]);

    try{
        const response = await api.post("app_hotel/create_card", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
                }
        })

        return true;
    } catch(e){
        console.log(e);
        return false;

    }
}
export async function handleUpdateCard(formInfo: formDataInfo, files: File[], img_url: string, id_card: number) {

    console.log(formInfo);
    let formData = new FormData();
    formData.append('brute_value', formInfo.brute_value.toString());
    formData.append('desc_cupom', formInfo.desc_cupom);
    formData.append('discount_value', formInfo.discount_value.toString());
    formData.append('expiration_data', formInfo.expiration_data);
    formData.append('has_price', formInfo.has_price.toString());
    formData.append('ibeacon_uuid', formInfo.ibeacon_uuid);
    formData.append('id_category', formInfo.id_category.toString());
    formData.append('id_client', formInfo.id_client.toString());
    formData.append('id_local', formInfo.id_local.toString());
    formData.append('lat_cupom', formInfo.lat_cupom);
    formData.append('link_cupom', formInfo.link_cupom);
    formData.append('lon_cupom', formInfo.lon_cupom);
    formData.append('name_cupom', formInfo.name_cupom);
    formData.append('value_with_discount', formInfo.value_with_discount.toString());
    formData.append('id_cupom', id_card.toString());
    formData.append('img_url',img_url);
    if(files[0]){
        formData.append('file', files[0]);
    } 

    try{
        const response = await api.post("app_hotel/update_card", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
                }
        })

        return true;
    } catch(e){
        console.log(e);
        return false;

    }
}

export async function getCards(){
    try{
        const idClientfromSession = sessionStorage.getItem('id_client');
        const response = await api.get(`app_hotel/ibeacon_cards_by_client/${idClientfromSession}`);
        console.log(response.data);
        const data: CardsInfo[] = response.data;
        return data;
    } catch(err){
        return[];
    }
}

export async function deleteCard(id: number){
    try{
        const response = await api.delete(`app_hotel/delete_card/${id}`);
        return true;
    } catch(err){
        return false;
    }
}

export async function getCardById(id: number){
    try{
        const response = await api.get(`app_hotel/ibeacon_card_by_id/${id}`);
        const data: CardsInfo[] = response.data;
        return data;
    } catch(err){
        return[];
    }
}

export async function getSignatures(){
    try{
        const authLoginResponse = await api.post('login',{
            login: loginApi,
            senha: senhaApi
        })
        if(authLoginResponse.data.token){
            sessionStorage.setItem('token', authLoginResponse.data.token);
        } else {
            return [];
        }
        const response = await api.get(`app_hotel/ibeacon_signatures`);
        const data: Signatures[] = response.data;
        return data;
    } catch(err){
        return[];
    }
}

export const registerClient = async (data: RegisterForm) => {
    try{
        const authLoginResponse = await api.post('login',{
            login: loginApi,
            senha: senhaApi
        })
        if(authLoginResponse.data.token){
            sessionStorage.setItem('token', authLoginResponse.data.token);
        } else {
            return {status: 401, message: 'Credênciais de aplicação inválidas'};
        }
        const response = await api.post(`app_hotel/create_client`,data);
        sessionStorage.setItem('id_client', response.data.userId);
        return {status: response.status, message: 'Cadastro realizado com sucesso!'};
    } catch(err: any){
        if(err.response.status == 400){
            return {status: 400, message: 'Email já cadastrado, insira um email diferente'};
        } else {
            return {status: 500, message: 'Erro ao realizar cadastro, entre em contato com o suporte'};
        }
    }
}

export const createLocal = async (data: CreateLocalFinalData) => {
    try{
        const response = await api.post('app_hotel/create_local', data);
        if(response.status == 200){
            return {status: 200, message: 'Local criado com sucesso'}
        }
        if(response.status == 500){
            return {status: 500, message: 'Erro ao criar local'}
        }
    } catch(err) {
        return {status: 500, message: 'Erro ao criar local'}
    }
}

export const getLocalsByClient = async (id_client: string) => {
    try{
        const response = await api.get(`app_hotel/locals_by_client/${id_client}`);
        const data: localData[] = response.data;
        if(response.status == 200){
            return {status: 200, message: 'Local criado com sucesso', data: data}
        }
        if(response.status == 404){
            return {status: 404, message: 'Sem locais cadastrados para o usuário', data: []}
        }
        return {status: 404, message: 'Sem locais cadastrados para o usuário', data: []}
    } catch(err) {
        return {status: 500, message: 'Erro ao consultar locais', data: []}
    }
}
export const deleteLocals = async (id_locals: number) => {
    try{
        const response = await api.delete(`app_hotel/delete_locals/${id_locals}`);
        return{status: 200, message: 'Card deletado com sucesso!'}
    } catch(err) {
        return {status: 500, message: 'Erro ao deletar local'}
    }
}

export const updateLocalById = async (data: UpdateLocalData) => {
    try{
        const response = await api.put(`app_hotel/update_local`,data);
        return{status: 200, message: 'Local Atualizado com sucesso!'}
    } catch(err) {
        return {status: 500, message: 'Erro ao atualizar local'}
    }
}

export const getLocalById = async (id_locals: number) => {
    const dummyData: localData = {
        ibeacon_local: 'Erro',
        ibeacons_id_locals: 999,
        id_client: 999,
        local_lat: 0,
        local_lng: 0
    }
    try{
        const response = await api.get(`app_hotel/local_by_id/${id_locals}`);
        const data: localData = response.data[0];
        console.log(data);
        return{status: 200, message: 'Local consultado com sucesso!', data: data}
    } catch(err) {
        return {status: 500, message: 'Erro ao consultar local', data: dummyData}
    }
}

export const getCEP = async (cep: string) => {
    try{
        const response = await api.post('app_hotel/getCEP', {
            cep: cep
        })
        return response.data;
    } catch(err: any){
        console.log(err.message)
    }
}

export const getCepForCard = async (cep: string) => {
    try{
        const response = await api.get(`https://cep.awesomeapi.com.br/json/${cep}`);
        return {status: 200, data: response.data};
    } catch(err: any){
        return {status: 404, data: {}};
    }
}