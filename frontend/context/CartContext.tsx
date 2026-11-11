
'use client'

import { CartItem } from '@/types'
import {
  createContext,
  useState,
  useMemo,
  useEffect,
  useRef
} from 'react'
import { toast } from 'sonner'

type CartContextType = {
  cart: CartItem[]
  totalPrice: number
  totalItems: number
  addToCart: (item: CartItem) => boolean
  removeFromCart: (productId: string, variantId: string) => void
  clearCart: () => void
  updateQuantity: (
    productId: string,
    variantId: string,
    action: 'increment' | 'decrement'
  ) => void
}

export const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const cartRef = useRef<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Keep React state and ref synchronized
  const updateCart = (newCart: CartItem[]) => {
    cartRef.current = newCart
    setCart(newCart)
  }

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('lifestyle-cart')

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartItem[]
        updateCart(parsedCart)
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('lifestyle-cart', JSON.stringify(cart))
    }
  }, [cart, isInitialized])

  // Calculate total price
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = item.variant.onSale
        ? item.variant.salePrice ?? item.variant.price
        : item.variant.price

      return total + price * item.quantity
    }, 0)
  }, [cart])

  // Calculate total quantity
  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  // Add item
  const addToCart = (item: CartItem) => {
    const currentCart = cartRef.current

    const existing = currentCart.find(
      p =>
        p.productId === item.productId &&
        p.variant.variantId === item.variant.variantId
    )

    const stockAvailable = item.variant.stock
    const newQuantity = (existing?.quantity ?? 0) + item.quantity

    if (item.quantity < 1 || newQuantity > stockAvailable) {
      toast.error(`Only ${stockAvailable} items available in stock!`)
      return false
    }

    if (existing) {
      const newCart = currentCart.map(p =>
        p.productId === item.productId &&
        p.variant.variantId === item.variant.variantId
          ? { ...p, quantity: newQuantity }
          : p
      )

      updateCart(newCart)
    } else {
      updateCart([...currentCart, item])
    }

    toast.success('Added to cart')
    return true
  }

  // Remove item
  const removeFromCart = (productId: string, variantId: string) => {
    const currentCart = cartRef.current

    const newCart = currentCart.filter(
      item =>
        !(
          item.productId === productId &&
          item.variant.variantId === variantId
        )
    )

    if (newCart.length === currentCart.length) return

    updateCart(newCart)
    toast.success('Removed from cart')
  }

  // Update quantity
  const updateQuantity = (
    productId: string,
    variantId: string,
    action: 'increment' | 'decrement'
  ) => {
    const currentCart = cartRef.current

    const newCart = currentCart.map(item => {
      if (
        item.productId !== productId ||
        item.variant.variantId !== variantId
      ) {
        return item
      }

      if (action === 'increment') {
        if (item.quantity + 1 > item.variant.stock) {
          toast.error(`Only ${item.variant.stock} items available in stock!`)
          return item
        }

        return { ...item, quantity: item.quantity + 1 }
      }

      return {
        ...item,
        quantity: Math.max(1, item.quantity - 1)
      }
    })

    updateCart(newCart)
  }

  const clearCart = () => {
    updateCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        totalPrice,
        totalItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
