export function formatCEP(value: string) {
  // Remove não digitos do valor
  let cep = value.replace(/\D/g, '')

  // Adicionar o (-) na sexta posição do vlaor
  if (cep.length > 5) {
    cep = value.replace(/(\d{5})(\d{1,3})/, '$1-$2')
  }

  return cep
}
