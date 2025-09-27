"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, CreditCard, Truck } from "lucide-react"

export function OrderSummary() {
  const [deliveryMethod, setDeliveryMethod] = useState("delivery")
  const [paymentMethod, setPaymentMethod] = useState("card")

  // data mockeada hasta crear la api y la db
  const cartItems = [
    { id: 1, name: "Margherita Clásica", quantity: 2, price: 18.99 },
    { id: 2, name: "Pepperoni Suprema", quantity: 1, price: 22.99 },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee: number = deliveryMethod === "delivery" ? 0 : 0 // Free delivery
  const tax = subtotal * 0.1
  const total = subtotal + deliveryFee + tax

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Finaliza tu pedido</h2>
            <p className="text-lg text-muted-foreground">Revisa tu orden y completa la información de entrega</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Método de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Delivery a domicilio</p>
                            <p className="text-sm text-muted-foreground">30-45 minutos</p>
                          </div>
                          <Badge variant="secondary">Gratis</Badge>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Recoger en tienda</p>
                          <p className="text-sm text-muted-foreground">15-20 minutos</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {deliveryMethod === "delivery" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Dirección de Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input id="firstName" placeholder="Tu nombre" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input id="lastName" placeholder="Tu apellido" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" placeholder="(555) 123-4567" />
                    </div>
                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input id="address" placeholder="Calle, número, colonia" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Ciudad</Label>
                        <Input id="city" placeholder="Tu ciudad" />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">Código Postal</Label>
                        <Input id="zipCode" placeholder="12345" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="instructions">Instrucciones especiales</Label>
                      <Textarea id="instructions" placeholder="Ej: Tocar el timbre, casa azul, etc." rows={3} />
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Método de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <p className="font-medium">Tarjeta de crédito/débito</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <p className="font-medium">Efectivo</p>
                        <p className="text-sm text-muted-foreground">Pago contra entrega</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p>Subtotal</p>
                      <p>${subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Delivery</p>
                      <p className="text-green-600">{deliveryFee === 0 ? "Gratis" : `$${deliveryFee.toFixed(2)}`}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Impuestos</p>
                      <p>${tax.toFixed(2)}</p>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <p>Total</p>
                      <p className="text-primary">${total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <p className="font-medium">Tiempo estimado</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {deliveryMethod === "delivery" ? "30-45 minutos" : "15-20 minutos"}
                    </p>
                  </div>

                  <Button className="w-full text-lg py-6">Confirmar Pedido - ${total.toFixed(2)}</Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Al confirmar tu pedido aceptas nuestros términos y condiciones
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}