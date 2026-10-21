const WHATSAPP_NUMBER = '5492615412645'
const WHATSAPP_MESSAGE =
  'Hola Javier, vi la web de QuadroFilms y quiero contarte sobre un proyecto.'

export const site = {
  name: 'QuadroFilms',
  person: 'Javier Vrana',
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  whatsappDisplay: '+54 9 261 541-2645',
  email: 'javiervrana@gmail.com',
  instagram: 'https://www.instagram.com/quadrofilms/',
  facebook: 'https://www.facebook.com/javier.vrana',
} as const
