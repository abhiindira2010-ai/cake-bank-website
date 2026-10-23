export type CakeCategory = 'Chocolate Cakes' | 'Birthday Cakes' | 'Designer Cakes' | 'Fruit Cakes' | 'Pastries' | 'Cupcakes'
export type Product = { id: string; name: string; category: CakeCategory; description: string; image: string; alt: string; featured?: boolean }
/** Demonstration concepts only; not a verified Cake Bank product catalogue. Images are illustrative stock photography. */
export const products: Product[] = [
 {id:'velvet-truffle',name:'Velvet Truffle',category:'Chocolate Cakes',description:'A rich, dark chocolate-inspired celebration cake concept.',image:'/images/hero.jpg',alt:'Chocolate cake with strawberries, illustrative stock photography',featured:true},
 {id:'midnight-chocolate',name:'Midnight Chocolate',category:'Chocolate Cakes',description:'A deep cocoa look with a smooth, elegant finish.',image:'/images/chocolate.jpg',alt:'Chocolate celebration cake, illustrative stock photography',featured:true},
 {id:'birthday-confetti',name:'Birthday Confetti',category:'Birthday Cakes',description:'A cheerful layered cake concept for a birthday table.',image:'/images/birthday.jpg',alt:'Colourful birthday cake, illustrative stock photography',featured:true},
 {id:'garden-tier',name:'The Garden Tier',category:'Designer Cakes',description:'A floral, tiered centrepiece concept for a special occasion.',image:'/images/designer.jpg',alt:'White tiered cake decorated with flowers, illustrative stock photography',featured:true},
 {id:'strawberry-daydream',name:'Strawberry Daydream',category:'Fruit Cakes',description:'A soft fruit-and-cream inspired cake concept.',image:'/images/fruit.jpg',alt:'Strawberry cake with fruit, illustrative stock photography'},
 {id:'berry-celebration',name:'Berry Celebration',category:'Fruit Cakes',description:'A bright berry-topped cake idea for a gathering.',image:'/images/berries.jpg',alt:'Fruit-topped celebration cake, illustrative stock photography'},
 {id:'petit-pastries',name:'Petit Pastries',category:'Pastries',description:'A small assortment of pastry ideas for sharing.',image:'/images/pastries.jpg',alt:'Dessert pastries, illustrative stock photography'},
 {id:'little-joys',name:'Little Joys',category:'Cupcakes',description:'Decorated mini cakes for a sweet table.',image:'/images/cupcakes.jpg',alt:'Decorated cupcakes, illustrative stock photography'},
]
export const categories: {label:'All Cakes' | CakeCategory;image:string;alt:string}[] = [
 {label:'All Cakes',image:'/images/chocolate.jpg',alt:'Celebration cake, illustrative stock photography'},
 {label:'Chocolate Cakes',image:'/images/hero.jpg',alt:'Chocolate cake, illustrative stock photography'},
 {label:'Birthday Cakes',image:'/images/birthday.jpg',alt:'Birthday cake, illustrative stock photography'},
 {label:'Designer Cakes',image:'/images/designer.jpg',alt:'Designer tiered cake, illustrative stock photography'},
 {label:'Fruit Cakes',image:'/images/fruit.jpg',alt:'Fruit cake, illustrative stock photography'},
 {label:'Pastries',image:'/images/pastries.jpg',alt:'Pastries, illustrative stock photography'},
 {label:'Cupcakes',image:'/images/cupcakes.jpg',alt:'Cupcakes, illustrative stock photography'},
]
