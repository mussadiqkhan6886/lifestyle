 import {
  Truck,
  Headset,
  BadgeCheck,
} from "lucide-react";

export const collections = [
  {
    image: "/men-watches.webp",
    title: "Men's Watches",
    description:
      "Explore premium men's watches featuring timeless designs, elegant finishes, and versatile styles for every occasion.",
    link: "/collections/men-watches",
  },
  {
    image: "/women-watches.webp",
    title: "Women's Watches",
    description:
      "Discover elegant women's watches with sophisticated designs that complement everyday outfits and special occasions.",
    link: "/collections/women-watches",
  },
  {
    image: "/clothing.webp",
    title: "Men's Clothing",
    description:
      "Explore contemporary men's clothing featuring versatile styles, quality fabrics, and effortless everyday essentials.",
    link: "/collections/men-clothing",
  },
  {
    image: "/clothing.webp",
    title: "Women's Clothing",
    description:
      "Discover stylish women's clothing with elegant designs, quality fabrics, and versatile pieces for every occasion.",
    link: "/collections/women-clothing",
  },
  {
    image: "/bags-2.webp",
    title: "Bags",
    description:
      "Discover stylish handbags and everyday bags that combine practical functionality with timeless fashion and elegance.",
    link: "/collections/bags",
  },
  {
    image: "/men-accessories.webp",
    title: "Men's Accessories",
    description:
      "Explore premium men's wallets and belts featuring refined details, practical designs, and timeless everyday appeal.",
    link: "/collections/men-accessories",
  },
  {
    image: "/women-wallets.webp",
    title: "Women's Wallets",
    description:
      "Discover elegant women's wallets combining sophisticated designs, practical storage, and everyday functionality.",
    link: "/collections/women-wallets",
  },
  {
    image: "/footwear.webp",
    title: "Women's Footwear",
    description:
      "Step into stylish women's footwear featuring versatile designs, everyday comfort, and elegant finishing touches.",
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
  { title: "3-4 days delivery for Instock products" },
  { title: "Out-of-stock items delivered in 1 week" },
  { title: "UK, USA & UAE import products",  },
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
