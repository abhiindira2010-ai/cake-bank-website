export type BusinessConfig = {
  name: string; tagline: string; city: string; state: string; country: string;
  postalCode: string; addressLines: string[]; whatsappNumber: string;
  phone?: string; email?: string; openingHours?: string; social?: Partial<Record<'instagram' | 'facebook', string>>;
  showPriceOnEnquiry: boolean;
}

export const BUSINESS: BusinessConfig = {
  name: 'Cake Bank',
  tagline: 'Every celebration deserves a beautiful cake.',
  city: 'Guntur',
  state: 'Andhra Pradesh',
  country: 'India',
  postalCode: '522001',
  addressLines: ['Kothapet Main Road', 'Guntur, Andhra Pradesh â€“ 522001', 'India'],
  // Client must provide a verified WhatsApp-enabled business number (country code + digits only).
  whatsappNumber: '919959986708',
  phone: '',
  email: '',
  openingHours: '',
  social: {},
  showPriceOnEnquiry: false,
}

export const businessAddress = BUSINESS.addressLines.join(', ')
export const mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Cake Bank, ' + businessAddress)


