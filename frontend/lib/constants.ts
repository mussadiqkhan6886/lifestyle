import { productType } from "@/types";
 import {
  Truck,
  Headset,
  BadgeCheck,
} from "lucide-react";

export const collections = [
  {
    image: "/men-watches.jpg",
    title: "Men Watches",
    description: "Explore premium men's watches featuring timeless designs, elegant finishes, and versatile styles for every occasion.",
    link: "/collections/men-watches",
  },
  {
    image: "/women-watches.jpg",
    title: "Women Watches",
    description: "Discover elegant women's watches with sophisticated designs that complement everyday outfits and special occasions.",
    link: "/collections/women-watches",
  },
  {
    image: "/clothing.jpg",
    title: "Clothing",
    description: "Shop stylish clothing with versatile designs, quality fabrics, and effortless everyday fashion for every wardrobe.",
    link: "/collections/clothing",
  },
  {
    image: "/bags.jpg",
    title: "Bags",
    description: "Discover stylish handbags and everyday bags that combine practical functionality with timeless fashion and elegance.",
    link: "/collections/bags",
  },
  {
    image: "/wallets-and-belts.jpg",
    title: "Wallets & Belts",
    description: "Explore premium wallets and belts with refined details, practical designs, and timeless everyday appeal.",
    link: "/collections/wallet-and-belts",
  },
  {
    image: "/women-footwear.jpg",
    title: "Women Footwear",
    description: "Step into stylish women's footwear featuring versatile designs, everyday comfort, and elegant finishing touches.",
    link: "/collections/women-footwear",
  },
];

export const navbarData = [
  {title: "Collections", link: null, children: collections},
  {title: "All Products", link: '/collections/all', children: null},
  {title: "About", link: "/about-us", children: null},
  {title: "Contact", link: "/contact-us", children: null},
]

export const loopData = [
  { title: "3-4 days delivery for instock products" },
  { title: "1 week for delivery of no stock products",  },
  { title: "uk import products",  },
];


export const trustBadges = [
   {
    id: 1,
    icon: BadgeCheck,
    heading: "Quality You Can Trust",
    description: "Carefully selected products chosen for their style and quality.",
  },
  {
    id: 2,
    icon: Truck,
    heading: "Reliable Delivery",
    description: "Enjoy fast and reliable delivery right to your doorstep.",
  },
  {
    id: 3,
    icon: Headset,
    heading: "Customer Support",
    description: "We're here to help with your questions and concerns.",
  },
];

export const reviewsData = [
  {
    id: 1,
    name: "Ayesha Malik",
    rating: 5,
    title: "Absolutely loved the quality!",
    comment:
      "Ordered a beautiful wristwatch and was impressed by the elegant design and premium feel. The packaging was lovely, and the overall experience was excellent.",
  },
  {
    id: 2,
    name: "Hamza Ahmed",
    rating: 5,
    title: "Great quality and stylish design.",
    comment:
      "Bought a men's watch and it looks even better in person. The finishing is impressive, and it feels like a product worth every penny.",
  },
  {
    id: 3,
    name: "Fatima Khan",
    rating: 5,
    title: "My new favourite handbag!",
    comment:
      "The handbag is beautiful, spacious, and exactly what I was looking for. The quality exceeded my expectations, and I loved the attention to detail.",
  },
  {
    id: 4,
    name: "Usman Tariq",
    rating: 5,
    title: "Excellent shopping experience.",
    comment:
      "Ordered a wallet and leather belt. Both products look elegant and feel well-made. Everything arrived in great condition. Highly recommended!",
  },
  {
    id: 5,
    name: "Sana Iqbal",
    rating: 5,
    title: "Beautiful collection and lovely quality.",
    comment:
      "I ordered a women's watch and absolutely love its design. It looks elegant, feels comfortable, and adds a lovely touch to my everyday outfits.",
  },
  {
    id: 6,
    name: "Ali Raza",
    rating: 5,
    title: "Definitely worth shopping for!",
    comment:
      "Purchased casual footwear and was really happy with the overall quality and design. The product looks just like the pictures, and the fit is comfortable.",
  },
];

export const helpLinks = [
  { label: 'Contact support', href: '/contact-us' },
  { label: 'Shipping & delivery', href: '/policies#shipping' },
  { label: 'Returns & exchanges', href: '/policies#returns' },
  { label: 'FAQs', href: '/policies#faq' },
]

export const companyLinks = [
  { label: 'Our story', href: '/about-us' },
  { label: 'All collections', href: '/collections' },
  { label: 'Privacy policy', href: '/policies#privacy-policy' },
  { label: 'Terms of service', href: '/policies#terms' },
]

export const socials = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
]
export const orders = [
  {
    id: 1,
    name: "Classic Chronograph Watch",
    image: "/watch.jpg",
    category: "Men Watches",
    variant: "Black",
    price: 8500,
  },
  {
    id: 2,
    name: "Premium Gold Watch",
    image: "/watch-2.jpg",
    category: "Men Watches",
    variant: "Gold",
    price: 12500,
  },
  {
    id: 3,
    name: "Elegant Women's Watch",
    image: "/watch-3.jpg",
    category: "Women Watches",
    variant: "Rose Gold",
    price: 7500,
  },
  {
    id: 4,
    name: "Classic Leather Shoulder Bag",
    image: "/bag.jpg",
    category: "Bags",
    variant: "Black",
    price: 6500,
  },
  {
    id: 5,
    name: "Minimalist Leather Wallet",
    image: "/wallets.jpg",
    category: "Wallets & Belts",
    variant: "Brown",
    price: 2500,
  },
  {
    id: 6,
    name: "Classic Casual Sneakers",
    image: "/sneakers.jpg",
    category: "Women Footwear",
    variant: "Size 38",
    price: 5500,
  },
];