const translations = {
    en: {
        products: "Products",
        cart: "Cart",
        contact: "Contact Us",
        latest_products: "Latest Products",
        shopping_cart: "Shopping Cart",
        total: "Total",
        clear_cart: "Clear Cart",
        checkout_whatsapp: "Checkout via WhatsApp",
        discover: "Discover Now",
        shop_offers: "Shop Offers",
        start_shopping: "Start Shopping",
        order_summary: "Order Summary",
        slide1_title: "Exclusive Fall Collection",
        slide1_text: "Discover 2024's latest fashion trends",
        slide2_title: "Up to 50% Off",
        slide2_text: "Best offers on premium products",
        slide3_title: "Free Shipping",
        slide3_text: "For all orders over 500 SAR",
        addToCart: "Add to Cart",
        cart_cleared: "Your cart has been cleared.",
        cart_empty: "Your cart is empty. Add some products first!",
        confirm_order: "Please confirm your order.",
        quantity: "Quantity",
        remove: "Remove"
    },
    ar: {
        products: "المجموعات",
        cart: "السلة",
        contact: "اتصل بنا",
        latest_products: "أحدث المنتجات",
        shopping_cart: "سلة التسوق",
        total: "المجموع",
        clear_cart: "إفراغ السلة",
        checkout_whatsapp: "إتمام الشراء عبر واتساب",
        discover: "اكتشف الآن",
        shop_offers: "تسوق العروض",
        start_shopping: "إبدأ التسوق",
        order_summary: "ملخص الطلب",
        slide1_title: "مجموعة الخريف الحصرية",
        slide1_text: "اكتشف أحدث صيحات الموضة لعام 2024",
        slide2_title: "خصومات تصل إلى 50%",
        slide2_text: "أفضل العروض على المنتجات المميزة",
        slide3_title: "شحن مجاني",
        slide3_text: "لجميع الطلبات فوق 500 ريال",
        addToCart: "أضف إلى السلة",
        cart_cleared: "تم إفراغ السلة بنجاح.",
        cart_empty: "السلة فارغة. أضف بعض المنتجات أولاً!",
        confirm_order: "يرجى تأكيد طلبك.",
        quantity: "الكمية",
        remove: "إزالة"
    }
};

const products = [
    {
        id: 1,
        name: { en: "Ramadan Moon", ar: "قمر رمضان" },
        description: { 
            en: "Beautiful Ramadan decoration", 
            ar: "زينة رمضانية جميلة" 
        },
        price: 80,
        image: "https://imgur.com/trxMBnJ.png"
    },
    {
        id: 2,
        name: { en: "Home Perfume", ar: "عطر منزل" },
        description: { 
            en: "Premium home fragrance", 
            ar: "عطر مميز لتعطير المنزل" 
        },
        price: 120,
        image: "https://imgur.com/IKSoHfC.png"
    },
    {
        id: 3,
        name: { en: "Elegant Basket", ar: "سلة أنيقة" },
        description: { 
            en: "Stylish shopping basket", 
            ar: "سلة أنيقة لحمل المشتريات" 
        },
        price: 200,
        image: "https://imgur.com/ODv06MH.png"
    }
];