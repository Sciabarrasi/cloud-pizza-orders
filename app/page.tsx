import { Header } from "./components/header"
import { Hero } from "./components/hero"
import { MenuSection } from "./components/menu-section"
import { OrderSummary } from "./components/order-summary"
import { Footer } from "./components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <MenuSection />
        <OrderSummary />
      </main>
      <Footer />
    </div>
  )
}
