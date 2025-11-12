import { useQuery } from '@tanstack/react-query'
import { Download, Link, MessageCircle, QrCode } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import { useState } from 'react'

import { getManagedRestaurant } from '@/api/manager/restaurants/get-managed-restaurant'
import { appalert } from '@/components/app-alert/app-alert-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { env } from '@/env'

export function RestaurantShareLink() {
  const [showQRDialog, setShowQRDialog] = useState(false)

  const { data: managedRestaurant, isLoading: isLoadingManagedRestaurant } =
    useQuery({
      queryKey: ['managed-restaurant'],
      queryFn: getManagedRestaurant,
      staleTime: Infinity,
    })

  if (isLoadingManagedRestaurant) {
    return (
      <Card>
        <CardHeader className="space-y-0 pb-3">
          <CardTitle className="text-base font-semibold">
            Link do cardápio
          </CardTitle>

          <p className="text-muted-foreground text-xs">
            Compartilhe este link com seus clientes
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          <Skeleton className="h-9 w-full" />

          <div className="flex gap-2">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!managedRestaurant) return null

  const restaurant = managedRestaurant.restaurant

  const restaurantUrl = `${env.VITE_APP_MENU_URL}/${restaurant.slug}`

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(restaurantUrl)

    appalert.success(
      'Link copiado',
      'Você pode compartilhar esse link com os seus clientes.',
    )
  }

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Confira o cardápio de ${restaurant.name}: ${restaurantUrl}`,
    )

    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const handleDownloadQRCode = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement

    if (!canvas) return

    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')

    link.download = `qrcode-${restaurant.slug}.png`
    link.href = url
    link.click()

    appalert.success('Excelente', 'O QR Code foi baixado.')
  }

  return (
    <>
      <Card>
        <CardHeader className="space-y-0 pb-3">
          <CardTitle className="flex items-center justify-between text-base font-semibold">
            Link do cardápio
            <Link className="text-muted-foreground size-4" />
          </CardTitle>

          <p className="text-muted-foreground text-xs">
            Compartilhe este link com seus clientes
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={handleShareWhatsApp}>
              <MessageCircle className="size-4" />
              WhatsApp
            </Button>

            <Button variant="outline" onClick={() => setShowQRDialog(true)}>
              <QrCode className="size-4" />
              QR Code
            </Button>

            <Input
              readOnly
              value={restaurantUrl}
              className="cursor-pointer text-center font-mono sm:text-left"
              onClick={(e) => {
                e.currentTarget.select()
                handleCopyLink()
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code do cardápio</DialogTitle>
            <DialogDescription>
              Clientes podem escanear este código para acessar o cardápio de{' '}
              <span className="font-medium">{restaurant.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-6 pt-2">
            <QRCodeCanvas
              value={restaurantUrl}
              size={200}
              level="H"
              marginSize={3}
              className="rounded-lg"
            />

            <Button
              onClick={handleDownloadQRCode}
              variant="link"
              className="flex flex-col items-center"
            >
              <Download className="size-4" />
              Baixar QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
