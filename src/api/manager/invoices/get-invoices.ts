import type { InvoiceStatus } from '@/dtos/invoices/invoice-status'
import type { PaginationResponse } from '@/dtos/pagination/pagination-response'
import { api } from '@/lib/axios'

export interface Invoice {
  id: string
  cardBrand: string | null
  cardLast4: string | null
  amountPaidInCents: number
  status: InvoiceStatus
  hostedInvoiceUrl: string | null
  invoicePdf: string | null
  failedAt: string | null
  failureMessage: string | null
  failureCode: string | null
  createdAt: string
}

export interface GetInvoicesRequest {
  page?: number
  limit?: number
  status?: InvoiceStatus
}

export interface GetInvoicesResponse {
  invoices: Invoice[]
  meta: PaginationResponse
}

export async function getInvoices(params?: GetInvoicesRequest) {
  const response = await api.manager.get<GetInvoicesResponse>('/invoices', {
    params,
  })

  return response.data
}
