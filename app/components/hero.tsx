import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, Truck } from "lucide-react"

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-background to-muted py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                🍕 Ahora con delivery gratis
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                La mejor pizza
                <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent block">
                  artesanal de la ciudad
                </span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-md">
                Ingredientes frescos, recetas tradicionales italianas y la pasión de tres generaciones en cada pizza que
                preparamos para ti.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="text-lg px-8">
                Ver Menú Completo
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Llamar Ahora
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Entrega en</p>
                <p className="text-lg font-bold text-primary">30 min</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Calificación</p>
                <p className="text-lg font-bold text-primary">4.9/5</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Delivery</p>
                <p className="text-lg font-bold text-primary">Gratis</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="shadow-2xl rounded-full overflow-hidden">
              <Image
                src="/img/pizza-margarita.jpg"
                alt="Pizza Margherita artesanal"
                width={600}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-bold shadow-lg">
              ¡Recién horneada!
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}