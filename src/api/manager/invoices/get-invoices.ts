import { api } from '@/lib/axios'

export interface GetInvoicesRequest {
  page?: number
  limit?: number
  status?: 'paid' | 'open' | 'void' | 'draft'
}

export interface Invoice {
  id: string
  stripeInvoiceId: string
  stripePaymentMethodId: string | null
  cardBrand: string | null
  cardLast4: string | null
  cardExpMonth: number | null
  cardExpYear: number | null
  amountPaidInCents: number
  amountDueInCents: number
  status: string
  billingReason: string | null
  hostedInvoiceUrl: string | null
  invoicePdf: string | null
  paidAt: string | null
  failedAt: string | null
  failureMessage: string | null
  failureCode: string | null
  failureDeclineCode: string | null
  failureReason: string | null
  periodStart: string
  periodEnd: string
  createdAt: string
}

export interface GetInvoicesResponse {
  invoices: Invoice[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function getInvoices(params?: GetInvoicesRequest) {
  const response = await api.manager.get<GetInvoicesResponse>('/invoices', {
    params,
  })

  return response.data
}
