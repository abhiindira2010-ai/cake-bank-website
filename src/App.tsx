import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, CakeSlice, Check, Heart, Menu, Minus, Plus, Sparkles, X } from 'lucide-react'
import { BUSINESS, businessAddress, mapUrl } from './config/business'
import { categories, products, type CakeCategory, type Product } from './data/products'
import { occasions } from './data/occasions'
import { testimonials } from './data/testimonials'
import { customEnquiryMessage, generalEnquiryMessage, productEnquiryMessage, type CustomEnquiry, whatsappUrl } from './utils/whatsapp'
import { validateEnquiry } from './utils/validation'
import './App.css'

const categoryNames: ('All Cakes' | CakeCategory)[] = ['All Cakes','Chocolate Cakes','Birthday Cakes','Designer Cakes','Fruit Cakes','Pastries','Cupcakes']
const emptyForm: CustomEnquiry = { name:'', phone:'', flavour:'', size:'', design:'', inscription:'', quantity:1, date:'', preference:'Pickup', deliveryArea:'', requirements:'' }
const currentYear = new Date().getFullYear()
const today = () => { const d = new Date(); return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-') }

function App() {
 const [activeCategory,setActiveCategory] = useState<'All Cakes' | CakeCategory>('All Cakes')
 const [menuOpen,setMenuOpen] = useState(false)
 const [mobileOrderHidden,setMobileOrderHidden] = useState(false)
 const [selectedProduct,setSelectedProduct] = useState<Product | null>(null)
 const [quantities,setQuantities] = useState<Record<string,number>>({})
 const [form,setForm] = useState<CustomEnquiry>(emptyForm)
 const [errors,setErrors] = useState<Partial<Record<keyof CustomEnquiry,string>>>({})
 const [formStatus,setFormStatus] = useState('')
 const [copyText,setCopyText] = useState('')
 const errorSummary = useRef<HTMLDivElement>(null)
 const dialogRef = useRef<HTMLDialogElement>(null)
 const menuButtonRef = useRef<HTMLButtonElement>(null)
 const whatsappHref = whatsappUrl(generalEnquiryMessage())
 const visibleProducts = useMemo(() => activeCategory === 'All Cakes' ? products : products.filter(p => p.category === activeCategory),[activeCategory])
 const featured = products.filter(p => p.featured).slice(0,4)

 useEffect(() => {
  const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { if (menuOpen) { setMenuOpen(false); menuButtonRef.current?.focus() } if (dialogRef.current?.open) dialogRef.current.close() } }
  document.addEventListener('keydown',onKey)
  return () => document.removeEventListener('keydown',onKey)
 },[menuOpen])
 useEffect(() => { if (menuOpen) document.querySelector<HTMLAnchorElement>('#primary-nav a')?.focus() },[menuOpen])
 useEffect(() => { document.body.classList.toggle('menu-open',menuOpen); return () => document.body.classList.remove('menu-open') },[menuOpen])
 useEffect(() => {
  const formNode = document.querySelector('.enquiry-form')
  if (!formNode || !('IntersectionObserver' in window)) return
  const observer = new IntersectionObserver(([entry]) => setMobileOrderHidden(entry.isIntersecting), {threshold:0.02})
  observer.observe(formNode)
  return () => observer.disconnect()
 },[])
 useEffect(() => {
  const nodes = document.querySelectorAll<HTMLElement>('.reveal')
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { nodes.forEach(n=>n.classList.add('is-visible')); return }
  document.documentElement.classList.add('js-reveal')
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) } }),{threshold:.08})
  nodes.forEach(n=>observer.observe(n))
  const fallback = window.setTimeout(() => nodes.forEach(n=>n.classList.add('is-visible')), 1800)
  return () => { observer.disconnect(); window.clearTimeout(fallback); document.documentElement.classList.remove('js-reveal') }
 },[])

 const pickCategory = (category: 'All Cakes' | CakeCategory) => {
  setActiveCategory(category); setMenuOpen(false)
  document.getElementById('catalogue')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})
 }
 const quantity = (id:string) => quantities[id] ?? 1
 const updateQuantity = (id:string,delta:number) => setQuantities(old=>({...old,[id]:Math.max(1,Math.min(20,(old[id]??1)+delta))}))
 const openProduct = (product:Product) => { setSelectedProduct(product); dialogRef.current?.showModal() }
 const setField = <K extends keyof CustomEnquiry>(key:K,value:CustomEnquiry[K]) => { setForm(old=>({...old,[key]:value})); setErrors(old=>({...old,[key]:undefined})); setFormStatus('') }
 const submitEnquiry = (event:FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const nextErrors = validateEnquiry(form,today())
  setErrors(nextErrors)
  if (Object.keys(nextErrors).length) { setFormStatus('Please review the highlighted fields.'); window.setTimeout(()=>errorSummary.current?.focus(),0); return }
  const message = customEnquiryMessage(form)
  const url = whatsappUrl(message)
  if (url) { window.open(url,'_blank','noopener,noreferrer'); setFormStatus('WhatsApp has been opened with your enquiry. Please send the message there; Cake Bank will confirm availability and pricing.') }
  else { setCopyText(message); setFormStatus('Online WhatsApp submission is not set up yet. Your enquiry has not been sent or saved. Copy the enquiry text below and contact Cake Bank directly once a verified contact channel is available.') }
 }
 const copyEnquiry = async () => { try { await navigator.clipboard.writeText(copyText); setFormStatus('Enquiry text copied. It has not been sent to Cake Bank.') } catch { setFormStatus('Copy is not available in this browser. Select and copy the enquiry text below.') } }

 const whatsappAction = (message:string, label:string, className='button button--dark') => {
  const url = whatsappUrl(message)
  return url ? <a className={className} href={url} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRight size={16}/></a> :
   <button className={className+' is-disabled'} type="button" aria-disabled="true" disabled title="WhatsApp ordering setup pending">{label}<ArrowUpRight size={16}/></button>
 }

 return <>
  <a className="skip-link" href="#main-content">Skip to content</a>
  <div className="topline"><span>CAKE BANK <i>·</i> GUNTUR, ANDHRA PRADESH</span><span>Sweet moments start here <Sparkles size={12}/></span></div>
  <header className="site-header">
   <div className="header-inner">
    <a className="brand" href="#home" onClick={()=>setMenuOpen(false)}><span className="brand-mark"><CakeSlice size={22}/></span><span className="brand-name">cake bank<small>CAKES & CELEBRATIONS</small></span></a>
    <button ref={menuButtonRef} className="menu-toggle" type="button" aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen} aria-controls="primary-nav" onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?<X size={22}/>:<Menu size={22}/>}</button>
    <nav id="primary-nav" className={menuOpen?'primary-nav is-open':'primary-nav'} aria-label="Main navigation">
     <a href="#home" onClick={()=>setMenuOpen(false)}>Home</a><a href="#catalogue" onClick={()=>setMenuOpen(false)}>Our cakes</a><a href="#categories" onClick={()=>setMenuOpen(false)}>Categories</a><a href="#custom" onClick={()=>setMenuOpen(false)}>Custom cakes</a><a href="#contact" onClick={()=>setMenuOpen(false)}>Contact</a>
     {whatsappHref ? <a className="nav-order" href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={()=>setMenuOpen(false)}>Order on WhatsApp <ArrowUpRight size={15}/></a> : <button className="nav-order is-disabled" type="button" disabled aria-disabled="true" title="WhatsApp ordering setup pending">WhatsApp setup pending</button>}
    </nav>
   </div>
  </header>
  <main id="main-content">
   <section className="hero section-shell" id="home">
    <div className="hero-copy reveal">
     <span className="eyebrow"><span className="eyebrow-line"/> A LITTLE JOY, BEAUTIFULLY MADE</span>
     <h1>Every celebration deserves a <em>beautiful cake.</em></h1>
     <p>Discover delightful cakes and sweet treats for birthdays, celebrations, and special moments in Guntur.</p>
     <div className="hero-actions"><a className="button button--dark" href="#catalogue">Explore our cakes <ArrowDownRight size={17}/></a>{whatsappAction(generalEnquiryMessage(),'Order on WhatsApp','button button--whatsapp')}{!whatsappHref&&<span className="pending-note"><span className="status-dot"/> WhatsApp ordering setup pending</span>}</div>
     <div className="hero-foot"><span>01 / A SWEET START</span><span>Find us on Kothapet Main Road</span></div>
    </div>
    <div className="hero-image-wrap reveal"><img className="hero-image" src="/images/hero.jpg" alt="Chocolate cake with strawberries, illustrative stock photography" width="1500" height="1700" fetchPriority="high" decoding="async"/><div className="hero-image-note"><span>CAKE INSPIRATION</span><span>Made for your moment <ArrowUpRight size={14}/></span></div><div className="hero-seal" aria-hidden="true"><span>CELEBRATE</span><Heart size={21}/><span>THE SWEET THINGS</span></div></div>
   </section>
   <div className="ticker" aria-label="Cake Bank inspiration"><span>Birthday cakes</span><i>✳</i><span>Thoughtful designs</span><i>✳</i><span>Sweet little treats</span><i>✳</i><span>Made for celebrations</span><i>✳</i><span>Birthday cakes</span></div>

   <section className="section-shell featured-section" id="featured">
    <div className="section-head reveal"><div><span className="eyebrow">A FEW LOVELY IDEAS</span><h2>Meet your next <em>centre­piece.</em></h2><p>Browse cake concepts to help imagine something for your celebration.</p></div><a className="inline-link" href="#catalogue">See the catalogue <ArrowUpRight size={15}/></a></div>
    <p className="stock-note"><span>DEMO CONTENT</span> These are sample concepts with illustrative stock photography, not a confirmed Cake Bank product list.</p>
    <div className="product-grid featured-grid">{featured.map((product,index)=><ProductCard key={product.id} product={product} index={index} qty={quantity(product.id)} onQuantity={updateQuantity} onDetails={openProduct} onOrder={(p,q)=>{const u=whatsappUrl(productEnquiryMessage(p,q));if(u)window.open(u,'_blank','noopener,noreferrer')}} whatsappConfigured={Boolean(whatsappUrl('enquiry'))}/>)}</div>
   </section>

   <section className="categories-section" id="categories"><div className="section-shell"><div className="section-head reveal"><div><span className="eyebrow">FOLLOW YOUR CRAVING</span><h2>Find your kind of <em>sweet.</em></h2><p>Choose a category to filter the sample catalogue.</p></div></div><div className="category-grid">{categories.slice(1).map((category,index)=><button type="button" className="category-tile reveal" key={category.label} onClick={()=>pickCategory(category.label)}><img src={category.image} alt={category.alt} width="720" height="600" loading="lazy" decoding="async"/><span className="category-tile-shade"/><span className="category-tile-text"><small>0{index+1} / CATEGORY</small><strong>{category.label}</strong><ArrowUpRight size={18}/></span></button>)}</div></div></section>

   <section className="section-shell catalogue-section" id="catalogue"><div className="section-head reveal"><div><span className="eyebrow">THE CAKE CATALOGUE</span><h2>A little inspiration for <em>every occasion.</em></h2><p>Sample concepts only. Confirm final products and availability directly with Cake Bank.</p></div><span className="catalogue-count">{visibleProducts.length.toString().padStart(2,'0')} CONCEPTS</span></div>
    <div className="filter-row" aria-label="Filter cakes">{categoryNames.map(category=><button type="button" key={category} className={activeCategory===category?'filter-chip is-active':'filter-chip'} aria-pressed={activeCategory===category} onClick={()=>setActiveCategory(category)}>{category}</button>)}</div>
    <p className="stock-note"><span>ILLUSTRATIVE IMAGES</span> Stock photography shown for inspiration; it does not depict verified Cake Bank products.</p>
    {visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product,index)=><ProductCard key={product.id} product={product} index={index} qty={quantity(product.id)} onQuantity={updateQuantity} onDetails={openProduct} onOrder={(p,q)=>{const u=whatsappUrl(productEnquiryMessage(p,q));if(u)window.open(u,'_blank','noopener,noreferrer')}} whatsappConfigured={Boolean(whatsappUrl('enquiry'))}/>)}</div> : <div className="empty-state"><CakeSlice size={30}/><h3>No sample concepts in this category yet</h3><p>Choose another category or return to all cakes.</p><button className="button button--dark" type="button" onClick={()=>setActiveCategory('All Cakes')}>Show all cakes <ArrowRight size={16}/></button></div>}
   </section>

   <section className="whatsapp-banner"><div className="section-shell whatsapp-banner-inner"><div><span className="eyebrow eyebrow--light">LET'S TALK CAKE</span><h2>Order your favourite cake <em>on WhatsApp.</em></h2><p>Looking for a cake for your next celebration? Explore our selection and send your order enquiry directly to Cake Bank in Guntur, Andhra Pradesh.</p></div><div className="whatsapp-banner-action">{whatsappAction(generalEnquiryMessage(),'Start an enquiry','button button--whatsapp button--light')}{!whatsappHref&&<small>Online WhatsApp submission has not been set up yet. No enquiry has been sent.</small>}</div><span className="banner-ornament" aria-hidden="true">CB</span></div></section>

   <section className="section-shell occasions-section" id="occasions"><div className="section-head reveal"><div><span className="eyebrow">LIFE'S LITTLE MILESTONES</span><h2>Made for the moments <em>that matter.</em></h2></div></div><div className="occasion-grid">{occasions.map((occasion,index)=><article className="occasion-card reveal" key={occasion.title}><span className="occasion-number">0{index+1}</span><span className="occasion-icon">{occasion.icon==='heart'?<Heart/>:occasion.icon==='cake'?<CakeSlice/>:<Sparkles/>}</span><h3>{occasion.title}</h3><p>{occasion.text}</p><a href="#custom" aria-label={'Explore the idea: '+occasion.title.toLowerCase()}>Explore the idea <ArrowUpRight size={15}/></a></article>)}</div></section>

   <section className="custom-section" id="custom"><div className="section-shell custom-layout"><div className="custom-copy reveal"><span className="eyebrow eyebrow--light">YOUR IDEA, YOUR WAY</span><h2>Dream it. Sketch it. <em>Let's talk cake.</em></h2><p>Share the flavour, size, and design you have in mind. This form prepares an enquiry for you; Cake Bank will need to confirm availability and pricing.</p><div className="custom-note"><Check size={16}/> No payment or order confirmation happens on this website.</div><div className="custom-direct-action">{whatsappAction(generalEnquiryMessage(),'Enquire on WhatsApp','button button--whatsapp')}{!whatsappHref&&<small>WhatsApp setup pending — no message has been sent.</small>}</div><div className="custom-side-address"><span>VISIT CAKE BANK</span><strong>Kothapet Main Road, Guntur</strong></div></div>
    <form className="enquiry-form" onSubmit={submitEnquiry} noValidate>
     <div className="form-heading"><span>01 / CUSTOM CAKE ENQUIRY</span><h3>Tell us a little more.</h3><p>Fields marked with * are required.</p></div>
     {Object.values(errors).some(Boolean)&&<div className="error-summary" tabIndex={-1} ref={errorSummary} role="alert"><strong>Please check these fields:</strong><ul>{Object.entries(errors).filter(([,v])=>v).map(([k,v])=><li key={k}><a href={'#field-'+k}>{v}</a></li>)}</ul></div>}
     <div className="form-grid">
      <Field id="name" label="Your name *" error={errors.name}><input id="field-name" value={form.name} autoComplete="name" onChange={e=>setField('name',e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name?'error-name':undefined} required/></Field>
      <Field id="phone" label="Contact number *" hint="10-digit Indian mobile number, optionally +91." error={errors.phone}><input id="field-phone" type="tel" autoComplete="tel" value={form.phone} onChange={e=>setField('phone',e.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone?'error-phone':'hint-phone'} required/></Field>
      <Field id="flavour" label="Cake flavour *" error={errors.flavour}><input id="field-flavour" value={form.flavour} placeholder="e.g. chocolate, vanilla" onChange={e=>setField('flavour',e.target.value)} aria-invalid={Boolean(errors.flavour)} aria-describedby={errors.flavour?'error-flavour':undefined} required/></Field>
      <Field id="size" label="Cake weight / size *" error={errors.size}><input id="field-size" value={form.size} placeholder="e.g. 1 kg, 2-tier" onChange={e=>setField('size',e.target.value)} aria-invalid={Boolean(errors.size)} aria-describedby={errors.size?'error-size':undefined} required/></Field>
      <Field id="design" label="Preferred design *" error={errors.design}><input id="field-design" value={form.design} placeholder="Colours, theme, style" onChange={e=>setField('design',e.target.value)} aria-invalid={Boolean(errors.design)} aria-describedby={errors.design?'error-design':undefined} required/></Field>
      <Field id="inscription" label="Cake message / inscription"><input id="field-inscription" value={form.inscription} placeholder="Words to write on the cake" onChange={e=>setField('inscription',e.target.value)}/></Field>
      <Field id="quantity" label="Quantity *" error={errors.quantity}><div className="form-quantity"><button type="button" aria-label="Decrease quantity" onClick={()=>setField('quantity',Math.max(1,form.quantity-1))}><Minus size={15}/></button><input id="field-quantity" aria-label="Cake quantity" type="number" min="1" max="20" value={form.quantity} onChange={e=>setField('quantity',Number(e.target.value))} aria-invalid={Boolean(errors.quantity)} aria-describedby={errors.quantity?'error-quantity':undefined} required/><button type="button" aria-label="Increase quantity" onClick={()=>setField('quantity',Math.min(20,form.quantity+1))}><Plus size={15}/></button></div></Field>
      <Field id="date" label="Requested date *" error={errors.date}><input id="field-date" type="date" min={today()} value={form.date} onChange={e=>setField('date',e.target.value)} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date?'error-date':undefined} required/></Field>
      <fieldset className="field field--full" aria-describedby={errors.preference?'error-preference':undefined}><legend>Pickup or delivery? *</legend><div className="radio-row"><label><input type="radio" name="preference" value="Pickup" checked={form.preference==='Pickup'} onChange={()=>setField('preference','Pickup')}/> Pickup</label><label><input type="radio" name="preference" value="Delivery" checked={form.preference==='Delivery'} onChange={()=>setField('preference','Delivery')}/> Delivery requested</label></div>{errors.preference&&<small id="error-preference" className="field-error">{errors.preference}</small>}</fieldset>
      {form.preference==='Delivery'&&<Field id="deliveryArea" label="Requested delivery area *" hint="Availability will be confirmed by the bakery." error={errors.deliveryArea} full><input id="field-deliveryArea" value={form.deliveryArea} onChange={e=>setField('deliveryArea',e.target.value)} aria-invalid={Boolean(errors.deliveryArea)} aria-describedby={errors.deliveryArea?'error-deliveryArea':'hint-deliveryArea'} required/></Field>}
      <Field id="requirements" label="Additional requirements" full><textarea id="field-requirements" rows={3} value={form.requirements} onChange={e=>setField('requirements',e.target.value)} placeholder="Allergies, timing, or other details (optional)"/></Field>
     </div>
     <button className="button button--dark form-submit" type="submit">Prepare my enquiry <ArrowUpRight size={16}/></button>
     <p className="form-privacy">Your details are not stored on this site or sent to a server. Submitting only opens WhatsApp when a verified number is configured.</p>
     {formStatus&&<div className="form-status" role="status" aria-live="polite">{formStatus}{copyText&&!whatsappUrl('test')&&<div className="copy-panel"><button className="button button--outline" type="button" onClick={copyEnquiry}>Copy enquiry text <Check size={15}/></button><textarea aria-label="Copyable enquiry text" readOnly rows={8} value={copyText}/></div>}</div>}
    </form>
   </div></section>

   {testimonials.length>0&&<section className="testimonials-section"><div className="section-shell"><div className="section-head"><div><span className="eyebrow">KIND WORDS</span><h2>Stories worth <em>sharing.</em></h2></div></div><div className="testimonial-grid">{testimonials.map(t=><blockquote key={t.name}><p>“{t.quote}”</p><cite>{t.name}</cite></blockquote>)}</div></div></section>}

   <section className="contact-section" id="contact"><div className="section-shell contact-layout"><div className="contact-copy reveal"><span className="eyebrow">COME SAY HELLO</span><h2>Let's make a little <em>celebration.</em></h2><p>Visit Cake Bank on Kothapet Main Road, Guntur, Andhra Pradesh.</p>{whatsappAction(generalEnquiryMessage(),'Enquire on WhatsApp','button button--whatsapp')}{!whatsappHref&&<p className="contact-pending">WhatsApp ordering setup is pending. Please visit the bakery to discuss your enquiry.</p>}</div><div className="address-card reveal"><span className="address-card-label"><span className="status-dot"/> FIND CAKE BANK</span><h3>{BUSINESS.name}</h3><address>{businessAddress}</address><a className="inline-link" href={mapUrl} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={15}/></a><div className="address-card-mark" aria-hidden="true">CB</div></div></div></section>
  </main>
  <footer className="site-footer"><div className="footer-main section-shell"><a className="brand brand--footer" href="#home"><span className="brand-mark"><CakeSlice size={21}/></span><span className="brand-name">cake bank<small>CAKES & CELEBRATIONS</small></span></a><p>Every celebration deserves a beautiful cake.</p><div className="footer-order">{whatsappAction(generalEnquiryMessage(),'Enquire on WhatsApp','button button--whatsapp')}{!whatsappHref&&<small>WhatsApp ordering setup pending.</small>}</div><a className="back-top" href="#home">Back to top <ArrowUpRight size={15}/></a></div><div className="footer-bottom section-shell"><span>© {currentYear} Cake Bank</span><span>Sample concepts and illustrative stock photography are shown until replaced with approved content.</span><span>Kothapet Main Road · Guntur</span></div></footer>
  <div className={mobileOrderHidden?'mobile-order is-hidden':'mobile-order'}>{whatsappHref?<a href={whatsappHref} target="_blank" rel="noopener noreferrer">Order on WhatsApp <ArrowUpRight size={16}/></a>:<span aria-disabled="true">WhatsApp ordering setup pending</span>}</div>

  <dialog className="product-dialog" ref={dialogRef} onClick={e=>{if(e.target===dialogRef.current)dialogRef.current?.close()}} onClose={()=>setSelectedProduct(null)} aria-labelledby="product-dialog-title">
   {selectedProduct&&<div className="dialog-layout"><img src={selectedProduct.image} alt={selectedProduct.alt} width="900" height="1000"/><div className="dialog-copy"><button className="dialog-close" type="button" aria-label="Close product details" onClick={()=>dialogRef.current?.close()}><X size={20}/></button><span className="eyebrow">SAMPLE CONCEPT · {selectedProduct.category.toUpperCase()}</span><h2 id="product-dialog-title">{selectedProduct.name}</h2><p>{selectedProduct.description}</p><p className="stock-note"><span>ILLUSTRATIVE IMAGE</span> This is a sample concept, not a confirmed product listing.</p><div className="quantity-control"><span>Quantity</span><div><button type="button" aria-label="Decrease quantity" onClick={()=>updateQuantity(selectedProduct.id,-1)} disabled={quantity(selectedProduct.id)<=1}><Minus size={15}/></button><output aria-live="polite">{quantity(selectedProduct.id)}</output><button type="button" aria-label="Increase quantity" onClick={()=>updateQuantity(selectedProduct.id,1)} disabled={quantity(selectedProduct.id)>=20}><Plus size={15}/></button></div></div>{whatsappAction(productEnquiryMessage(selectedProduct,quantity(selectedProduct.id)),'Enquire about this cake','button button--whatsapp')}{!whatsappUrl('test')&&<small className="contact-pending">WhatsApp ordering setup pending. No message has been sent.</small>}</div></div>}
  </dialog>
 </>
}

function ProductCard({product,index,qty,onQuantity,onDetails,onOrder,whatsappConfigured}:{product:Product;index:number;qty:number;onQuantity:(id:string,delta:number)=>void;onDetails:(p:Product)=>void;onOrder:(p:Product,q:number)=>void;whatsappConfigured:boolean}) {
 return <article className="product-card reveal"><button className="product-image-button" type="button" onClick={()=>onDetails(product)} aria-label={'View details for sample concept '+product.name}><img src={product.image} alt={product.alt} width="900" height="1050" loading="lazy" decoding="async"/><span className="sample-badge">SAMPLE</span><span className="product-image-arrow"><ArrowUpRight size={17}/></span></button><div className="product-card-body"><div className="product-meta"><span>{product.category}</span><span>0{index+1}</span></div><h3>{product.name}</h3><p>{product.description}</p><div className="product-actions"><div className="quantity-control" aria-label={'Quantity for '+product.name}><button type="button" aria-label={'Decrease '+product.name+' quantity'} onClick={()=>onQuantity(product.id,-1)} disabled={qty<=1}><Minus size={13}/></button><output aria-live="polite">{qty}</output><button type="button" aria-label={'Increase '+product.name+' quantity'} onClick={()=>onQuantity(product.id,1)} disabled={qty>=20}><Plus size={13}/></button></div><button className="details-button" type="button" onClick={()=>onDetails(product)}>Details <ArrowUpRight size={14}/></button></div><button className={whatsappConfigured?'product-order':'product-order is-disabled'} type="button" disabled={!whatsappConfigured} aria-disabled={!whatsappConfigured} title={!whatsappConfigured?'WhatsApp ordering setup pending':undefined} onClick={()=>onOrder(product,qty)}>{whatsappConfigured?'Enquire on WhatsApp':'WhatsApp setup pending'} <ArrowUpRight size={15}/></button></div></article>
}
function Field({id,label,hint,error,full=false,children}:{id:string;label:string;hint?:string;error?:string;full?:boolean;children:React.ReactNode}) {
 return <div className={'field'+(full?' field--full':'')}><label htmlFor={'field-'+id}>{label}</label>{hint&&<small id={'hint-'+id} className="field-hint">{hint}</small>}{children}{error&&<small id={'error-'+id} className="field-error">{error}</small>}</div>
}
export default App
