import { test, expect } from '@playwright/test'
import { buildWhatsAppUrl, customEnquiryMessage } from '../src/utils/whatsapp.ts'
import AxeBuilder from '@axe-core/playwright'

test('configured WhatsApp URLs encode spaces, newlines, symbols and Unicode', async () => {
 const message = ['Hello Cake Bank!','Cake: Chocolate & vanilla?','Design: ' + String.fromCharCode(8377,32,3108,3142,3122,3137,3095,3137)].join(String.fromCharCode(10))
 const url = buildWhatsAppUrl('+91 99999-99999', message)
 expect(url).toBe('https://wa.me/919999999999?text=' + encodeURIComponent(message))
 expect(new URL(url!).searchParams.get('text')).toBe(message)
 expect(url).toContain('%0A')
 expect(url).toContain('%26')
 expect(url).toContain('%E2%82%B9')
 expect(buildWhatsAppUrl('', message)).toBeNull()
 expect(buildWhatsAppUrl('not-a-number', message)).toBeNull()
})

test('custom enquiry message omits empty optional fields', async () => {
 const message = customEnquiryMessage({name:'',phone:'',flavour:'Chocolate',size:'',design:'',inscription:'',quantity:1,date:'',preference:'Pickup',deliveryArea:'',requirements:''})
 expect(message).toContain('Flavour: Chocolate')
 expect(message).toContain('Quantity: 1')
 expect(message).not.toContain('Customer name:')
 expect(message).not.toContain('Contact number:')
 expect(message).not.toContain('Requested delivery area:')
 expect(message).not.toContain('Additional requirements:')
})

test('homepage content and navigation render', async ({ page }) => {
 await page.goto('/')
 await expect(page.getByRole('heading',{level:1})).toContainText('Every celebration deserves a')
 for (const id of ['featured','categories','catalogue','custom','media','about','contact']) await expect(page.locator('#'+id)).toBeAttached()
 await page.getByRole('link',{name:/See the catalogue/i}).click()
 await expect(page).toHaveURL(/#catalogue/)
})

test('category filters and quantity controls work', async ({ page }) => {
 await page.goto('/')
 await page.getByRole('button',{name:'Chocolate Cakes', exact:true}).last().click()
 await expect(page.locator('#catalogue .product-card')).toHaveCount(2)
 await expect(page.getByRole('button',{name:'Chocolate Cakes', exact:true}).first()).toHaveAttribute('aria-pressed','true')
 const card=page.locator('#catalogue .product-card').first()
 await card.getByRole('button',{name:/Increase .* quantity/}).click()
 await expect(card.locator('output').first()).toHaveText('2')
 await page.getByRole('button',{name:'All Cakes',exact:true}).click()
 await expect(page.locator('#catalogue .product-card')).toHaveCount(8)
})

test('mobile menu opens, Escape closes it and restores focus', async ({ page }) => {
 await page.setViewportSize({width:390,height:844})
 await page.goto('/')
 const toggle=page.getByRole('button',{name:'Open menu'})
 await toggle.click()
 await expect(page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Home'})).toBeFocused()
 await page.keyboard.press('Escape')
 await expect(page.getByRole('navigation',{name:'Main navigation'})).not.toBeVisible()
 await expect(page.getByRole('button',{name:'Open menu'})).toBeFocused()
 await page.getByRole('button',{name:'Open menu'}).click()
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Our cakes'}).click()
 await expect(page.getByRole('navigation',{name:'Main navigation'})).not.toBeVisible()
})

test('custom form validation and configured WhatsApp ordering are honest', async ({ page }) => {
 await page.goto('/')
 await expect(page.locator('a[href^="https://wa.me/919959986708"]')).toHaveCount(7)
 await page.getByRole('button',{name:'Prepare my enquiry'}).click()
 await expect(page.locator('.error-summary')).toBeVisible()
 await page.getByLabel('Your name *').fill('Test Person')
 await page.getByLabel('Contact number *').fill('123')
 await page.getByLabel('Cake flavour *').fill('Chocolate')
 await page.getByLabel('Cake weight / size *').fill('1 kg')
 await page.getByLabel('Preferred design *').fill('Floral')
 await page.getByLabel('Requested date *').fill('2020-01-01')
 await page.getByRole('button',{name:'Prepare my enquiry'}).click()
 await expect(page.locator('#error-phone')).toContainText('valid 10-digit Indian mobile number')
 await expect(page.locator('#error-date')).toContainText('Choose today or a future date')
 await page.getByLabel('Contact number *').fill('9876543210')
 await page.getByLabel('Requested date *').fill('2030-01-01')
 const popupPromise = page.waitForEvent('popup')
 await page.getByRole('button',{name:'Prepare my enquiry'}).click()
 const popup = await popupPromise
 await expect.poll(() => new URL(popup.url()).searchParams.get('phone')).toBe('919959986708')
 expect(new URL(popup.url()).searchParams.get('text')).toContain('Flavour: Chocolate')
 await popup.close()
 await expect(page.locator('.error-summary')).toBeHidden()
})

test('all stock images load and layout has no horizontal overflow at target widths', async ({ page }) => {
 await page.goto('/')
 await page.evaluate(async () => {
  const images=Array.from(document.images)
  images.forEach(img=>{img.loading='eager'})
  await Promise.all(images.map(img=>img.decode().catch(()=>undefined)))
 })
 const imageResults=await page.locator('img').evaluateAll(imgs=>imgs.map((img:HTMLImageElement)=>({src:img.currentSrc,complete:img.complete,width:img.naturalWidth})))
 expect(imageResults.length).toBeGreaterThan(0)
 expect(imageResults.filter(img=>img.complete&&img.width>0),JSON.stringify(imageResults.filter(img=>!img.complete||img.width===0))).toHaveLength(imageResults.length)
 for (const width of [360,390,768,1024,1280,1440]) {
  await page.setViewportSize({width,height:900})
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth)
  expect(overflow, 'horizontal overflow at '+width+'px').toBe(false)
 }
})

test('mobile sticky order action hides while the enquiry form is visible', async ({ page }) => {
 await page.setViewportSize({width:390,height:844})
 await page.goto('/')
 await page.locator('.enquiry-form').scrollIntoViewIfNeeded()
 await expect(page.locator('.mobile-order')).toHaveClass(/is-hidden/)
 await page.locator('#contact').scrollIntoViewIfNeeded()
 await expect(page.locator('.mobile-order')).not.toHaveClass(/is-hidden/)
})

test('homepage has no browser console or page errors', async ({ page }) => {
 const errors: string[] = []
 page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
 page.on('pageerror', error => errors.push(error.message))
 await page.goto('/')
 await page.locator('#contact').scrollIntoViewIfNeeded()
 await page.locator('#catalogue').scrollIntoViewIfNeeded()
 expect(errors).toEqual([])
})

test('axe accessibility scan reports WCAG 2.1 A/AA results', async ({ page }) => {
 await page.goto('/')
 await page.evaluate(() => { document.documentElement.classList.remove('js-reveal'); document.querySelectorAll('.reveal').forEach(node=>node.classList.add('is-visible')) })
 const results = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()
 const contrastNodes = results.violations.find(v=>v.id==='color-contrast')?.nodes ?? []
 const contrastSummary = [...new Map(contrastNodes.map(n=>{const d=n.any.find(x=>x.id==='color-contrast')?.data as {fgColor?:string;bgColor?:string;contrastRatio?:number};return [String(d?.fgColor)+'|'+String(d?.bgColor),{fg:d?.fgColor,bg:d?.bgColor,ratio:d?.contrastRatio,target:n.target[0]}]})).values()]
 const labelNodes = results.violations.find(v=>v.id==='label-content-name-mismatch')?.nodes.map(n=>({target:n.target[0],html:n.html.slice(0,160)})) ?? []
 console.log('AXE_CONTRAST_SUMMARY=' + JSON.stringify(contrastSummary))
 console.log('AXE_LABEL_MISMATCHES=' + JSON.stringify(labelNodes))
 expect(results.violations).toEqual([])
})

test('capture final desktop and mobile screenshots', async ({ page }) => {
 for (const viewport of [{width:1440,height:1000,name:'desktop'},{width:390,height:844,name:'mobile'}]) {
  await page.setViewportSize({width:viewport.width,height:viewport.height})
  await page.goto('/')
  await page.evaluate(async () => {
   document.documentElement.classList.remove('js-reveal')
   document.querySelectorAll('.reveal').forEach(node=>node.classList.add('is-visible'))
   const images=Array.from(document.images)
   images.forEach(img=>{img.loading='eager'})
   await Promise.all(images.map(img=>img.decode().catch(()=>undefined)))
  })
  await page.screenshot({path:'test-results/cake-bank-'+viewport.name+'.png',fullPage:true})
 }
})

test('reduced motion keeps all page content visible', async ({ page }) => {
 await page.emulateMedia({reducedMotion:'reduce'})
 await page.goto('/')
 await expect(page.getByRole('heading',{level:1})).toBeVisible()
 await expect(page.locator('#contact')).toBeVisible()
})
