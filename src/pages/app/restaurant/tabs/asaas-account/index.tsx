// src/pages/app/restaurant/tabs/asaas-account/index.tsx (atualizado)
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { getProfile } from '@/api/manager/profile/get-profile'
import { getAddress } from '@/api/manager/restaurants/address/get-address'
import { getAsaasAccount } from '@/api/manager/restaurants/asaas/get-asaas-account'
import { getManagedRestaurant } from '@/api/manager/restaurants/get-managed-restaurant'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { AsaasAccount } from './asaas-account'
import { AsaasAlert } from './asaas-alert'
import { AsaasCreateForm, type CreateAccountSchema } from './asaas-create-form'
import { AsaasLinkForm, type LinkAccountSchema } from './asaas-link-form'
import { AsaasAccountSkeleton } from './asaas-skeleton'

export function UpdateAsaasAccount() {
  const [mode, setMode] = useState<'link' | 'create' | null>(null)

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ['managed-restaurant'],
    queryFn: getManagedRestaurant,
  })

  const { data: address, isLoading: isLoadingAddress } = useQuery({
    queryKey: ['address'],
    queryFn: getAddress,
  })

  const { data: asaasAccount, isLoading: isLoadingAsaasAccount } = useQuery({
    queryKey: ['asaas-account'],
    queryFn: getAsaasAccount,
  })

  const linkDefaultValues: LinkAccountSchema = {
    cpfCnpj: restaurant?.cpfCnpj || '',
  }

  const createDefaultValues: CreateAccountSchema = {
    name: restaurant?.name || '',
    email: profile?.email || '',
    loginEmail: profile?.email || '',
    cpfCnpj: restaurant?.cpfCnpj || '',
    mobilePhone: profile?.phone || '',
    incomeValue: 1000000,
    address: address?.street || '',
    addressNumber: address?.number || '',
    province: address?.state || '',
    postalCode: address?.zipCode || '',
    complement: address?.complement || '',
  }

  if (
    isLoadingAsaasAccount ||
    isLoadingRestaurant ||
    isLoadingProfile ||
    isLoadingAddress
  ) {
    return <AsaasAccountSkeleton />
  }

  if (asaasAccount?.hasAsaasAccount) {
    return <AsaasAccount account={asaasAccount} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar pagamentos online</CardTitle>
        <CardDescription>
          Crie sua conta Asaas para receber pagamentos via PIX e Cartão de
          Crédito
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AsaasAlert
          onLinkAccount={() => setMode('link')}
          onCreateAccount={() => setMode('create')}
        />

        {mode === 'link' && (
          <AsaasLinkForm
            defaultValues={linkDefaultValues}
            onCancel={() => setMode(null)}
            onSuccess={() => setMode(null)}
          />
        )}

        {mode === 'create' && (
          <AsaasCreateForm
            defaultValues={createDefaultValues}
            onCancel={() => setMode(null)}
            onSuccess={() => setMode(null)}
          />
        )}
      </CardContent>
    </Card>
  )
}
