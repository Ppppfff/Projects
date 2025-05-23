"use client"

import { Minus, Plus, ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import type { CartItem } from "./MainContent"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  increaseQuantity: (itemId: number) => void
  decreaseQuantity: (itemId: number) => void
  removeItem: (itemId: number) => void
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
}: CartDrawerProps) {
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Your Cart
            </DrawerTitle>
            <DrawerDescription>
              {cartItems.length === 0
                ? "Your cart is empty"
                : `You have ${cartItems.length} item${cartItems.length !== 1 ? "s" : ""} in your cart`}
            </DrawerDescription>
          </DrawerHeader>

          {cartItems.length > 0 ? (
            <div className="px-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.itemId} className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-md border">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => decreaseQuantity(item.itemId)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease quantity</span>
                      </Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => increaseQuantity(item.itemId)}
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase quantity</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => removeItem(item.itemId)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-1.5 pb-6">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-green-800">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full">Proceed to Checkout</Button>
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-2 px-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              <p className="text-center text-muted-foreground">Your cart is empty.</p>
            </div>
          )}

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Continue Shopping</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
