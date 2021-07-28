  export const formatCPF = (cpf: string) => {
    cpf = cpf?.replace(/\D/g, "")
    cpf = cpf?.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf?.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf?.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    if (cpf.length > 14) {
      cpf = cpf.substring(0, cpf.length - 1)
    }
    return(cpf)
  }

  
  export const formatCEP = (val: string) => {
    val = val?.replace(/\D/g, "")
    val = val?.replace(/^(\d{5})(\d)/, "$1-$2")
    if (val.length > 9) {
      val = val.substring(0, val.length - 1)
    }
    return val
  }
  
  
  export const formatNumero = (val: string) => {
    val = val?.replace(/\D/g, "")
    if (val.length > 5) {
      val = val.substring(0, val.length - 1)
    }
    return val
  }