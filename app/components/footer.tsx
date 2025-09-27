import { MapPin, Phone, Clock, Instagram, Facebook, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">NR</span>
              </div>
              <div>
                <h3 className="font-bold text-xl">Nonna Rosa</h3>
                <p className="text-sm opacity-80">Auténtica Pizza Italiana</p>
              </div>
            </div>
            <p className="text-sm opacity-80 text-pretty">
              Tres generaciones de tradición italiana en cada pizza. Ingredientes frescos, recetas auténticas y el amor
              por la buena comida.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-lg">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 opacity-80" />
                <span className="text-sm">Av. Principal 123, Centro</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 opacity-80" />
                <span className="text-sm">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 opacity-80" />
                <span className="text-sm">Lun-Dom: 11:00 - 23:00</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-lg">Enlaces</h4>
            <div className="space-y-2">
              <a href="#menu" className="block text-sm opacity-80 hover:opacity-100 transition-opacity">
                Nuestro Menú
              </a>
              <a href="#promociones" className="block text-sm opacity-80 hover:opacity-100 transition-opacity">
                Promociones
              </a>
              <a href="#nosotros" className="block text-sm opacity-80 hover:opacity-100 transition-opacity">
                Sobre Nosotros
              </a>
              <a href="#contacto" className="block text-sm opacity-80 hover:opacity-100 transition-opacity">
                Contacto
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-lg">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm opacity-80">¡Síguenos para ofertas exclusivas y novedades!</p>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="text-sm opacity-80">
            © 2025 Nonna Rosa. Todos los derechos reservados. Hecho con ❤️ para los amantes de la pizza.
          </p>
        </div>
      </div>
    </footer>
  )
}
