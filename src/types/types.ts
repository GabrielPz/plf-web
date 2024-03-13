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

export interface clientData {
    id: number;
    nome_cliente: string;
    cpf: string;
    endereco: string;
    telefone: string;
    email: string;
}

export interface equipmentData {
    id: number;
    nome_equipamento: string;
    preco_aluguel_dia: number;
    preco_compra: number;
    disponibilidade: boolean;
    quantidade: number;
    vezes_alugado: string;
}

export interface rentsData {
    id: number;
    equipamento_id: number;
    cliente_id: number;
    data_inicio: string;
    data_termino: string;
    valor_total: number;
    status: number;
}