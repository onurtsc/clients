interface Client {
    id: number
    nome: string
    cpf: string
    email: string
    endereco: Endereco
}

interface Endereco {
    cep: string
    rua: string
    numero: string
    bairro: string
    cidade: string
}

export default Client