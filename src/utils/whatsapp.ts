import type { Product } from '../data/products'
import { BUSINESS } from '../config/business'

export function buildWhatsAppUrl(configuredNumber: string, message: string): string | null {
 const number = configuredNumber.replace(/[\s+()-]/g, '')
 return /^\d{10,15}$/.test(number) ? 'https://wa.me/' + number + '?text=' + encodeURIComponent(message) : null
}
export function whatsappUrl(message: string) { return buildWhatsAppUrl(BUSINESS.whatsappNumber, message) }
export type CustomEnquiry = { name: string; phone: string; flavour: string; size: string; design: string; inscription: string; quantity: number; date: string; preference: 'Pickup' | 'Delivery'; deliveryArea: string; requirements: string }
const clean = (value: string | number | undefined) => String(value ?? '').trim()
export function generalEnquiryMessage() { return ['Hello Cake Bank! I would like to enquire about an order.','','Please confirm availability and pricing.','','Thank you!'].join('\n') }
export function productEnquiryMessage(product: Product, quantity: number) { return ['Hello Cake Bank! I would like to enquire about an order.','', 'Cake: ' + product.name, 'Quantity: ' + quantity, '', 'Please confirm availability and pricing.', '', 'Thank you!'].join('\n') }
export function customEnquiryMessage(form: CustomEnquiry) {
 const lines = ['Hello Cake Bank! I would like to enquire about an order.','']
 const fields: [string,string | number | undefined][] = [['Customer name',form.name],['Contact number',form.phone],['Flavour',form.flavour],['Cake size / weight',form.size],['Preferred design',form.design],['Cake message or customization',form.inscription],['Quantity',form.quantity],['Requested date',form.date],['Pickup / delivery',form.preference],['Requested delivery area',form.preference === 'Delivery' ? form.deliveryArea : ''],['Additional requirements',form.requirements]]
 for (const [label,value] of fields) if (clean(value)) lines.push(label + ': ' + clean(value))
 lines.push('', 'Please confirm availability and pricing.', '', 'Thank you!')
 return lines.join('\n')
}
