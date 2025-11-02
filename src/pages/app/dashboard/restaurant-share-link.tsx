import { useQuery } from '@tanstack/react-query'
import { Download, MessageCircle, QrCode } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import { useState } from 'react'
import { toast } from 'sonner'

import { getManagedRestaurant } from '@/api/restaurants/get-managed-restaurant'
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

  const restaurantUrl = `${env.VITE_APP_MENU_URL}/${managedRestaurant.slug}`

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(restaurantUrl)

    toast.success('Link copiado!')
  }

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Confira o cardápio de ${managedRestaurant.name}: ${restaurantUrl}`,
    )

    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const handleDownloadQRCode = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement

    if (!canvas) return

    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')

    link.download = `qrcode-${managedRestaurant.slug}.png`
    link.href = url
    link.click()

    toast.success('QR Code baixado!')
  }

  return (
    <>
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
          <div className="flex gap-2">
            <Input
              readOnly
              value={restaurantUrl}
              className="cursor-pointer font-mono text-xs"
              onClick={(e) => {
                e.currentTarget.select()
                handleCopyLink()
              }}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleShareWhatsApp}
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowQRDialog(true)}
            >
              <QrCode className="size-4" />
              QR Code
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code do cardápio</DialogTitle>
            <DialogDescription>
              Clientes podem escanear este código para acessar o cardápio de{' '}
              <span className="font-medium">{managedRestaurant.name}</span>
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
