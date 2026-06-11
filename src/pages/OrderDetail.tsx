import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, User, Mail, Phone, Package, Truck, Printer } from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy order data based on ID (Normally fetched from API)
  const order = {
    id: id || '#390561',
    status: 'Completed',
    date: 'Jan 8, 2026, 13:52',
    total: 1620.00,
    subtotal: 1550.00,
    shippingCost: 20.00,
    tax: 50.00,
    customer: {
      name: 'James Miller',
      email: 'james@example.com',
      phone: '+1 (555) 123-4567',
    },
    shipping: {
      address: '123 Tech Avenue, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'United States',
      method: 'Express Shipping (2-3 days)'
    },
    payment: {
      method: 'Credit Card',
      cardLast4: '4242',
      transactionId: 'TRX-1092-A',
    },
    items: [
      { name: 'Ryobi ONE drill/driver', qty: 1, price: 409.00, image: 'https://via.placeholder.com/80/e5e7eb/6b7280?text=Tool' },
      { name: 'Socket Systeme Electric', qty: 2, price: 238.00, image: 'https://via.placeholder.com/80/e5e7eb/6b7280?text=Socket' },
      { name: 'Heavy Duty Workbench', qty: 1, price: 665.00, image: 'https://via.placeholder.com/80/e5e7eb/6b7280?text=Bench' },
    ]
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/data')}
            className="w-10 h-10 rounded-xl bg-white dark:bg-[#1a1a27] border border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-500 dark:text-[#8a8a9e] hover:text-[#11191f] dark:hover:text-white shadow-sm transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#11191f] dark:text-white">Order {order.id}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#cde8d2] text-[#005a18]">
                {order.status}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-[#8a8a9e] mt-1">{order.date}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-[#1a1a27] border border-gray-200 dark:border-white/5 rounded-lg text-sm font-semibold text-[#11191f] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2">
            <Printer size={16} /> Print Invoice
          </button>
          <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2">
            <Truck size={16} /> Fulfill Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Items & Pricing */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1a1a27] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
              <Package className="text-gray-400 dark:text-[#8a8a9e]" size={20} />
              <h3 className="text-lg font-bold text-[#11191f] dark:text-white">Order Items</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-[#242435] rounded-xl flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#11191f] dark:text-white text-lg">{item.name}</h4>
                      <p className="text-sm font-semibold text-gray-500 dark:text-[#8a8a9e]">Qty: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#11191f] dark:text-white text-lg">${item.price.toFixed(2)}</p>
                      <p className="text-sm font-semibold text-gray-500 dark:text-[#8a8a9e]">Total: ${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-white/5 mt-8 pt-6">
                <div className="w-full sm:w-1/2 ml-auto space-y-3">
                  <div className="flex justify-between text-sm font-semibold text-gray-500 dark:text-[#8a8a9e]">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-gray-500 dark:text-[#8a8a9e]">
                    <span>Shipping</span>
                    <span>${order.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-gray-500 dark:text-[#8a8a9e]">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-100 dark:border-white/5 pt-3 mt-3 flex justify-between">
                    <span className="text-lg font-bold text-[#11191f] dark:text-white">Total</span>
                    <span className="text-xl font-bold text-indigo-500">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer, Shipping, Payment Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1a1a27] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-lg font-bold text-[#11191f] dark:text-white mb-6 flex items-center gap-2">
              <User size={18} className="text-gray-400 dark:text-[#8a8a9e]"/> Customer Info
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-[#8a8a9e] mb-1">Name</p>
                <p className="font-bold text-[#11191f] dark:text-white">{order.customer.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-gray-500 dark:text-[#8a8a9e]">Email</p>
                  <p className="font-bold text-[#11191f] dark:text-white truncate">{order.customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 flex-shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-[#8a8a9e]">Phone</p>
                  <p className="font-bold text-[#11191f] dark:text-white">{order.customer.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1a27] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-lg font-bold text-[#11191f] dark:text-white mb-6 flex items-center gap-2">
              <MapPin size={18} className="text-gray-400 dark:text-[#8a8a9e]"/> Shipping Address
            </h3>
            <div className="space-y-2">
              <p className="font-bold text-[#11191f] dark:text-white">{order.shipping.address}</p>
              <p className="font-semibold text-gray-500 dark:text-[#8a8a9e]">{order.shipping.city}, {order.shipping.state} {order.shipping.zip}</p>
              <p className="font-semibold text-gray-500 dark:text-[#8a8a9e]">{order.shipping.country}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <p className="text-sm font-semibold text-gray-500 dark:text-[#8a8a9e] mb-1">Shipping Method</p>
                <p className="font-bold text-[#11191f] dark:text-white">{order.shipping.method}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1a27] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-lg font-bold text-[#11191f] dark:text-white mb-6 flex items-center gap-2">
              <CreditCard size={18} className="text-gray-400 dark:text-[#8a8a9e]"/> Payment Method
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-8 rounded border border-gray-200 dark:border-white/10 flex items-center justify-center bg-gray-50 dark:bg-white/5 font-bold text-xs text-gray-500 dark:text-[#8a8a9e]">
                   VISA
                 </div>
                 <div>
                   <p className="font-bold text-[#11191f] dark:text-white">Ending in {order.payment.cardLast4}</p>
                 </div>
              </div>
              <div className="pt-2">
                <p className="text-sm font-semibold text-gray-500 dark:text-[#8a8a9e] mb-1">Transaction ID</p>
                <p className="font-bold text-[#11191f] dark:text-white">{order.payment.transactionId}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
