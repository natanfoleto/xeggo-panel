import { api } from '@/lib/axios'

export interface GetInvoicesRequest {
  page?: number
  limit?: number
  status?: 'paid' | 'open' | 'void' | 'draft'
}

export interface Invoice {
  id: string
  stripeInvoiceId: string
  amountPaidInCents: number
  amountDueInCents: number
  status: string
  billingReason: string | null
  hostedInvoiceUrl: string | null
  invoicePdf: string | null
  paidAt: string | null
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
