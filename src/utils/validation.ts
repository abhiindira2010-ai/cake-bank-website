import type { CustomEnquiry } from './whatsapp'
export type EnquiryErrors = Partial<Record<keyof CustomEnquiry, string>>
export function validateEnquiry(value: CustomEnquiry, today: string): EnquiryErrors {
 const errors: EnquiryErrors = {}
 if (!value.name.trim()) errors.name = 'Enter your name.'
 if (!value.phone.trim()) errors.phone = 'Enter a contact number.'
 else if (!/^(?:\+91[ -]?)?[6-9]\d{9}$/.test(value.phone.trim().replace(/[()-]/g,''))) errors.phone = 'Enter a valid 10-digit Indian mobile number, optionally with +91.'
 if (!value.flavour.trim()) errors.flavour = 'Enter a preferred cake flavour.'
 if (!value.size.trim()) errors.size = 'Enter a cake size or weight.'
 if (!value.design.trim()) errors.design = 'Describe the preferred design.'
 if (!Number.isInteger(value.quantity) || value.quantity < 1 || value.quantity > 20) errors.quantity = 'Choose a quantity from 1 to 20.'
 if (!value.date) errors.date = 'Choose a requested date.'
 else if (value.date < today) errors.date = 'Choose today or a future date.'
 if (!value.preference) errors.preference = 'Choose pickup or delivery.'
 if (value.preference === 'Delivery' && !value.deliveryArea.trim()) errors.deliveryArea = 'Enter the requested delivery area.'
 return errors
}
