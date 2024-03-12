import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";


export const loginFormShceme = z.object({
    email: z.string().min(1, {message: 'Insira um User'}),
    password: z.string().min(4, {message: 'A senha  ter pelo menos 4 caracteres'}),
})

export const createUserFormShceme = z.object({
    name: z.string().min(5, {message: 'O nome precisa ter ao menos 5 letras'}),
    email: z.string().email({message: 'Formato de e-mail invalido'}),
    password: z.string().min(6, {message: 'A senha precisa ter ao menos 6 letras'}),
    identifier: z.string().min(1, {message: 'Preencha o Campo'}),
    address: z.string().min(1, {message: 'Preencha o Campo'}),
    nomePais: z.string().min(1, {message: 'Preencha o Campo'}),
})

export const registerFormScheme = z.object({
    name: z.string().min(5, {message: 'Preencha o campo'}),
    razao_s: z.string().min(5, {message: 'Preencha o campo'}),
    cnpj: z.string().min(6, {message: 'Preencha o campo'}),
    username: z.string().min(1, {message: 'Preencha o Campo'}),
    surname_username: z.string().min(1, {message: 'Preencha o Campo'}),
    cep: z.string().min(1, {message: 'Preencha o Campo'}),
    phone_pabx: z.string().min(1, {message: 'Preencha o Campo'}),
    phone_user: z.string().min(1, {message: 'Preencha o Campo'}),
    email: z.string().min(1, {message: 'Preencha o Campo'}),
    password: z.string().min(1, {message: 'Preencha o Campo'}),
    location: z.string().min(1, {message: 'Preencha o Campo'}),
    street: z.string().min(1, {message: 'Preencha o Campo'}),
    district: z.string().min(1, {message: 'Preencha o Campo'}),
    state: z.string().min(1, {message: 'Preencha o Campo'}),
})


export const createLocalFormScheme = z.object({
    name: z.string().min(1, {message: 'Preencha o campo'}),
    local_lat: z.string().min(1, {message: 'Preencha o campo'}),
    local_lon: z.string().min(1, {message: 'Preencha o campo'}),
})


export type CreateLocalFormData = z.infer<typeof createLocalFormScheme>;
export type LoginFormData = z.infer<typeof loginFormShceme>
export type RegisterClientForm = z.infer<typeof registerFormScheme>
export type CreateUserFormData = z.infer<typeof createUserFormShceme>

export interface LoggedUser {
    address: string;
    city: string;
    email: string;
    id: string;
    identidadeVerified: boolean;
    modocomprador: boolean;
    modoviajante: boolean;
    name: string;
    nomePais: string;
    state: any;
    telefoneVerified: boolean;
    token: string;
}

export interface drawerItemInterface {
    name: string,
    icon: any,
    component: any,
    key: string,
    visible: boolean
}

export interface categories {
    id_cat: number;
    desc_cat: string;
    name_cat: string;
}

export interface formDataInfo {
    ibeacon_uuid: string;
    id_client: number;
    id_category: number;
    id_local: number;
    name_cupom: string;
    desc_cupom: string;
    brute_value: number;
    discount_value: number;
    value_with_discount: number;
    expiration_data: string;
    link_cupom: string;
    lat_cupom: string;
    lon_cupom: string;
    has_price: number;
}

export interface localData {
    ibeacons_id_locals: number;
    id_client: number;
    ibeacon_local: string;
    local_lat: number;
    local_lng: number;
}

export interface CardsInfo {
    id_cupom: number;
    ibeacon_uuid: string;
    id_client: number;
    id_category: number;
    id_local: number;
    name_cupom: string;
    desc_cupom: string;
    brute_value: number;
    discount_value: number;
    value_with_discount: number;
    img_url: string;
    expiration_date: string;
    blured_img_string: string;
    link_cupom: string;
    lat_cupom: string;
    lon_cupom: string;
    has_price: number;
    local: string;
    category: string;
}

export interface RegisterForm {
    nome_fantasia: string; // Este campo pode ser o equivalente a "name" na sua interface original
    razao_social: string; // Este campo pode ser o equivalente a "razao_s" na sua interface original, mas ajustado para capturar a razão social ao invés de um e-mail
    cnpj: string; // Deve ter pelo menos 6 caracteres
    name_users: string; // Este campo pode ser o equivalente a "username" na sua interface original
    surname_users: string; // Este campo pode ser o equivalente a "surname_username" na sua interface original
    cep: string; // Deve ter pelo menos 1 caractere
    phone_pabx: string; // Deve ter pelo menos 1 caractere
    phone_user: string; // Deve ter pelo menos 1 caractere
    user_email: string; // Este campo pode ser o equivalente a "email" na sua interface original
    pass_userdash: string; // Este campo pode ser o equivalente a "password" na sua interface original
    sig_id: number; // Campo adicional conforme solicitado
    location: string; //CIdade
    street: string //Logradouro
    district: string; //Bairro
    state: string; //Estado
}

export interface Signatures {
    sig_id: number;
    desc_sig: string;
    value_sig: string;
    expire_date: string;
}

export interface CreateLocalFinalData {
    id_client: number;
    ibeacon_local: string;
    local_lat: string;
    local_lng: string;
}

export interface UpdateLocalData {
    id_locals: number;
    ibeacon_local: string;
    local_lat: string;
    local_lng: string;
}