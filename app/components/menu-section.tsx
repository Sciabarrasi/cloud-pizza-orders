"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, Heart } from "lucide-react"

const pizzas = [
  {
    id: 1,
    name: "Margherita Clásica",
    description: "Salsa de tomate, mozzarella fresca, albahaca, aceite de oliva extra virgen",
    price: 18.99,
    image: "/img/pizza-margarita.jpg",
    category: "clásicas",
  },
  {
    id: 2,
    name: "Pepperoni Suprema",
    description: "Salsa de tomate, mozzarella, pepperoni premium, orégano",
    price: 22.99,
    image: "/img/pizza-pepperoni-suprema.jpg",
    category: "clásicas",
  },
  {
    id: 3,
    name: "Quattro Stagioni",
    description: "Tomate, mozzarella, jamón, champiñones, alcachofas, aceitunas",
    price: 26.99,
    image: "/img/pizza-quattro-stagioni.jpg",
    category: "gourmet",
  },
  {
    id: 4,
    name: "Prosciutto e Rúcula",
    description: "Mozzarella, prosciutto di Parma, rúcula fresca, parmesano",
    price: 28.99,
    image: "/img/pizza-prosciutto-rucula.jpg",
    category: "gourmet",
  },
  {
    id: 5,
    name: "Vegana Mediterránea",
    description: "Salsa de tomate, queso vegano, verduras asadas, aceitunas, hierbas",
    price: 24.99,
    image: "/img/pizza-vegana-mediterranea.jpg",
    category: "veganas",
  },
  {
    id: 6,
    name: "BBQ Pulled Pork",
    description: "Salsa BBQ, mozzarella, cerdo desmenuzado, cebolla caramelizada",
    price: 25.99,
    image: "/img/pulled-pork-pizza.webp",
    category: "especiales",
  },
]

export function MenuSection() {
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const updateQuantity = (id: number, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + change),
    }))
  }

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }

  const filterPizzas = (category: string) => {
    if (category === "todas") return pizzas
    return pizzas.filter((pizza) => pizza.category === category)
  }

  return (
    <section id="menu" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Nuestro Menú
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-balance">
            Pizzas hechas con
            <span className="warm-text-gradient block">amor y tradición</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Cada pizza es preparada al momento con ingredientes frescos y recetas que han pasado de generación en
            generación.
          </p>
        </div>

        <Tabs defaultValue="todas" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-12">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="clásicas">Clásicas</TabsTrigger>
            <TabsTrigger value="gourmet">Gourmet</TabsTrigger>
            <TabsTrigger value="veganas">Veganas</TabsTrigger>
            <TabsTrigger value="especiales">Especiales</TabsTrigger>
          </TabsList>

          {["todas", "clásicas", "gourmet", "veganas", "especiales"].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filterPizzas(category).map((pizza) => (
                  <Card key={pizza.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0 relative">
                      <Image
                        src={pizza.image || "/placeholder.svg"}
                        alt={pizza.name}
                        width={400}
                        height={192}
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
                        onClick={() => toggleFavorite(pizza.id)}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favorites.has(pizza.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardTitle className="mb-2">{pizza.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-4 text-pretty">{pizza.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${pizza.price}</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(pizza.id, -1)}
                            disabled={!quantities[pizza.id]}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{quantities[pizza.id] || 0}</span>
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(pizza.id, 1)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button
                        className="w-full"
                        disabled={!quantities[pizza.id]}
                        onClick={() => {
                          console.log(`Added ${quantities[pizza.id]} ${pizza.name} to cart`)
                        }}
                      >
                        Agregar al Carrito
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
