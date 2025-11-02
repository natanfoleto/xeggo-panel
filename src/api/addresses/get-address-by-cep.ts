export interface GetAddressByCepResponse {
  cep: string
  street: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
}

export async function getAddressByCep(cep: string) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

    if (!response.ok) return null

    const data = await response.json()

    if (data.erro) return null

    return {
      cep: data.cep,
      street: data.logradouro,
      complement: data.complemento || null,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    }
  } catch {
    return null
  }
}
