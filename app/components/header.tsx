"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Menu, X, Phone, MapPin } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartItems] = useState(3)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">NR</span>
            </div>
            <div>
              <h1 className="font-bold text-xl warm-text-gradient">Nonna Rosa</h1>
              <p className="text-xs text-muted-foreground">Auténtica Pizza Italiana</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#menu" className="text-foreground hover:text-primary transition-colors">
              Menú
            </a>
            <a href="#promociones" className="text-foreground hover:text-primary transition-colors">
              Promociones
            </a>
            <a href="#nosotros" className="text-foreground hover:text-primary transition-colors">
              Nosotros
            </a>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>(555) 123-4567</span>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="relative bg-transparent">
              <ShoppingCart className="w-4 h-4" />
              {cartItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {cartItems}
                </Badge>
              )}
            </Button>

            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#menu" className="text-foreground hover:text-primary transition-colors">
                Menú
              </a>
              <a href="#promociones" className="text-foreground hover:text-primary transition-colors">
                Promociones
              </a>
              <a href="#nosotros" className="text-foreground hover:text-primary transition-colors">
                Nosotros
              </a>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground pt-2 border-t border-gray-200">
                <Phone className="w-4 h-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Av. Principal 123, Centro</span>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
