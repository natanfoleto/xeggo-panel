export function isValidCPF(cpf: string) {
  cpf = cpf.replace(/\D/g, '')

  if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

  let sum = 0
  let rest

  for (let i = 1; i <= 9; i++)
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)

  rest = (sum * 10) % 11

  if (rest === 10 || rest === 11) rest = 0
  if (rest !== parseInt(cpf.substring(9, 10))) return false

  sum = 0

  for (let i = 1; i <= 10; i++)
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)

  rest = (sum * 10) % 11

  if (rest === 10 || rest === 11) rest = 0

  return rest === parseInt(cpf.substring(10, 11))
}

export function isValidCNPJ(cnpj: string) {
  cnpj = cnpj.replace(/\D/g, '')

  if (!cnpj || cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false

  let length = cnpj.length - 2
  let numbers = cnpj.substring(0, length)
  let sum = 0
  let pos = length - 7

  const digits = cnpj.substring(length)

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers[length - i]) * pos--

    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  if (result !== parseInt(digits[0])) return false

  length++
  numbers = cnpj.substring(0, length)
  sum = 0
  pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers[length - i]) * pos--

    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  return result === parseInt(digits[1])
}
