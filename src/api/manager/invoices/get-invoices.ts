import { api } from '@/lib/axios'

export interface Invoice {
  id: string
  stripeInvoiceId: string
  amountPaidInCents: number
  amountDueInCents: number
  status: string
  billingReason: string | null
  hostedInvoiceUrl: string | null
  invoicePdf: string | null
  paidAt: Date | null
  periodStart: Date
  periodEnd: Date
  createdAt: Date
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

export interface GetInvoicesParams {
  page?: number
  limit?: number
  status?: 'paid' | 'open' | 'void' | 'draft'
}

export async function getInvoices(params?: GetInvoicesParams) {
  const response = await api.manager.get<GetInvoicesResponse>('/invoices', {
    params,
  })

  return response.data
}
