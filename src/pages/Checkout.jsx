import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { customerApi, orderApi, paymentApi } from '../services/api';

const initialForm = { fullName: '', email: '', phone: '', address: '', province: '', area: '', ward: '', city: '', postalCode: '', country: 'Nepal', deliveryInstructions: '', paymentMethod: 'esewa' };

function CheckoutForm() {
  const navigate = useNavigate();
  const { cart, totalPrice } = useCart();
  const [form, setForm] = useState(initialForm);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    Promise.all([customerApi.getProfile(), customerApi.getAddresses()]).then(([profileResponse, addressResponse]) => {
      const profile = profileResponse.data.user;
      const saved = addressResponse.data.addresses || [];
      const selected = saved.find((item) => item.isDefault) || saved[0] || {};
      setAddresses(saved);
      setForm((current) => ({
        ...current,
        ...selected,
        fullName: profile.name || current.fullName,
        email: profile.email || current.email,
        phone: profile.phone || current.phone,
        address: selected.address || selected.street || '',
        province: selected.province || selected.state || '',
        postalCode: selected.postalCode || selected.zipCode || '',
        country: selected.country || 'Nepal',
      }));
    }).catch(() => toast.error('Failed to load delivery information.'));
  }, []);
  useEffect(() => { if (!cart.items?.length) navigate('/cart'); }, [cart, navigate]);
  const onChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const chooseAddress = (event) => {
    const selected = addresses.find((item) => item._id === event.target.value);
    if (!selected) return;
    setForm((current) => ({
      ...current,
      ...selected,
      address: selected.address || selected.street || '',
      province: selected.province || selected.state || '',
      postalCode: selected.postalCode || selected.zipCode || '',
      country: selected.country || 'Nepal',
    }));
  };
  const submitEsewaForm = ({ gatewayUrl, fields }) => {
    const gatewayForm = document.createElement('form');
    gatewayForm.method = 'POST';
    gatewayForm.action = gatewayUrl;
    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      gatewayForm.appendChild(input);
    });
    document.body.appendChild(gatewayForm);
    gatewayForm.submit();
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await orderApi.createOrder({
        shippingAddress: {
          fullName: form.fullName, email: form.email, phone: form.phone, address: form.address, street: form.address,
          area: form.area, ward: form.ward, city: form.city, province: form.province, state: form.province,
          postalCode: form.postalCode, zipCode: form.postalCode, country: form.country, deliveryInstructions: form.deliveryInstructions,
        },
        paymentMethod: form.paymentMethod,
      });
      const orderId = data.order._id;
      const { data: payment } = await paymentApi.initiateEsewa(orderId);
      submitEsewaForm(payment);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };
  const subtotal = totalPrice;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const shipping = subtotal > 100 ? 0 : 15;
  const total = Number((subtotal + tax + shipping).toFixed(2));
  const fields = [
    ['fullName', 'Full name', 'text', true],
    ['email', 'Email address', 'email', true],
    ['phone', 'Phone number', 'text', true],
    ['address', 'Complete delivery address', 'text', true],
    ['city', 'City', 'text', true],
    ['province', 'Province / State', 'text', true],
    ['area', 'Area / Tole', 'text', true],
    ['ward', 'Ward number', 'text', true],
    ['postalCode', 'Postal code (optional)', 'text', false],
  ];
  const methods = [
    ['esewa', 'eSewa Sandbox', 'Complete a secure sandbox payment on eSewa.'],
  ];
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">1. Customer information</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {fields.slice(0, 3).map(([name, label, type, required]) => (
            <label key={name} className="text-sm font-medium">
              {label}
              <input required={required} name={name} type={type} value={form[name]} onChange={onChange} className="admin-input" />
            </label>
          ))}
        </div>
      </section>
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">2. Shipping address</p>
        {addresses.length > 0 && (
          <select onChange={chooseAddress} className="admin-input mt-4" defaultValue="">
            <option value="">Select saved address</option>
            {addresses.map((item) => <option value={item._id} key={item._id}>{item.label || 'Saved Address'} - {item.city || ''}</option>)}
          </select>
        )}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {fields.slice(3).map(([name, label, type, required]) => (
            <label key={name} className="text-sm font-medium">
              {label}
              <input required={required} name={name} type={type} value={form[name]} onChange={onChange} className="admin-input" />
            </label>
          ))}
          <label className="text-sm font-medium md:col-span-2">
            Delivery instructions
            <textarea name="deliveryInstructions" value={form.deliveryInstructions} onChange={onChange} className="admin-input min-h-24" />
          </label>
        </div>
      </section>
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">4. Payment method</p>
        <div className="mt-4 space-y-3">
          {methods.map(([value, title, note]) => (
            <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-[14px] border p-4 ${form.paymentMethod === value ? 'border-accent bg-ivory' : 'border-[var(--color-border)] bg-surface'}`}>
              <input type="radio" name="paymentMethod" value={value} checked={form.paymentMethod === value} onChange={onChange} />
              <div>
                <p className="font-semibold text-espresso">{title}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{note}</p>
              </div>
            </label>
          ))}
          <p className="rounded-[12px] border border-[var(--color-border)] bg-ivory p-3 text-xs text-[var(--color-text-secondary)]">Online options use sandbox gateways only. Payment is marked paid only after backend verification.</p>
        </div>
      </section>
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">5. Place order</p>
        <div className="mt-4 rounded-[14px] bg-ivory p-5 text-sm text-mocha">
          <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal.toFixed(2)}</span></div>
          <div className="mt-2 flex justify-between"><span>Tax (8%)</span><span>Rs. {tax.toFixed(2)}</span></div>
          <div className="mt-2 flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `Rs. ${shipping.toFixed(2)}`}</span></div>
          <div className="mt-3 flex justify-between border-t border-[var(--color-border)] pt-3 text-lg font-semibold text-espresso"><span>Total</span><span>Rs. {total.toFixed(2)}</span></div>
        </div>
        <button disabled={loading} className="btn-primary mt-4 w-full py-3 disabled:cursor-not-allowed disabled:opacity-60" type="submit">
          {loading ? 'Processing payment...' : `Pay & place order — Rs. ${total.toFixed(2)}`}
        </button>
      </section>
    </form>
  );
}

export default function Checkout() {
  const { cart, totalPrice } = useCart();
  const subtotal = totalPrice;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const shipping = subtotal > 100 ? 0 : 15;
  const total = Number((subtotal + tax + shipping).toFixed(2));
  return (
    <div className="container-custom py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Checkout</p>
        <h1 className="font-display mt-2 text-4xl">Complete your order</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="card p-6 md:p-8"><CheckoutForm /></div>
        <aside className="card h-fit p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">3. Order summary</p>
          <h2 className="font-display mt-2 text-2xl">Summary</h2>
          <div className="mt-5 space-y-3 text-sm text-mocha">
            {(cart.items || []).map((item) => (
              <div key={item.product?._id || item.product} className="flex justify-between gap-4">
                <span>{item.product?.name} × {item.quantity}</span>
                <span>Rs. {((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-[var(--color-border)] pt-3"><span>Subtotal</span><span>Rs. {subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>Rs. {tax.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `Rs. ${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-3 text-base font-semibold text-espresso"><span>Total</span><span>Rs. {total.toFixed(2)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
