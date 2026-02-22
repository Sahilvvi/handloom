import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Heart, Ruler, Check, ChevronRight, LogOut } from 'lucide-react';
import { products, collections } from './data/products';
import { supabase } from './utils/supabaseClient';
import Auth from './pages/Auth';
import Admin from './pages/Admin';

// Context for global state
const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Global Components
const Navbar = () => {
  const { cartCount, setIsCartOpen, user } = useCart();
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo-text">HARDWOOD</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Search size={20} cursor="pointer" />
          <Link to={user ? "/account" : "/auth"}><User size={20} /></Link>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#D4AF37', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="container footer-content">
      <div className="footer-column">
        <h4>HARDWOOD</h4>
        <p style={{ fontSize: '14px', opacity: 0.8 }}>Premium handcrafted hardwood curtains for modern living.</p>
      </div>
      <div className="footer-column">
        <h4>Shop</h4>
        <Link to="/collections">Wooden Curtains</Link>
        <Link to="/collections">Premium Series</Link>
        <Link to="/collections">Custom Designs</Link>
      </div>
      <div className="footer-column">
        <h4>Company</h4>
        <Link to="/about">Our Story</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/shipping">Shipping & Returns</Link>
      </div>
      <div className="footer-column">
        <h4>Newsletter</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="email" placeholder="Email Address" style={{ padding: '8px', border: '1px solid #757575', background: 'transparent', color: 'white' }} />
          <button style={{ background: '#D4AF37', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer' }}>JOIN</button>
        </div>
      </div>
    </div>
  </footer>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ProductCard = ({ product }) => (
  <div className="product-card fade-in" style={{ background: 'white', overflow: 'hidden', transition: 'all 0.3s ease', border: '1px solid #f0f0f0' }}>
    <Link to={`/product/${product.id}`}>
      <div style={{ height: '300px', overflow: 'hidden' }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'} />
      </div>
    </Link>
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>{product.category}</p>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{product.name}</h3>
      <p style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>₹{product.price}</p>
      <Link to={`/product/${product.id}`} style={{ display: 'inline-block', marginTop: '15px', fontSize: '12px', fontWeight: '700', borderBottom: '2px solid var(--accent)', paddingBottom: '2px' }}>VIEW PIECE</Link>
    </div>
  </div>
);

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('products').select('*').limit(4).then(({ data }) => {
      setFeatured(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ paddingTop: '80px' }}>
      <section style={{ height: '90vh', background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', color: 'white' }}>
        <div className="container fade-in">
          <h1 style={{ color: 'white', fontSize: '5rem', maxWidth: '800px', lineHeight: '1', marginBottom: '30px' }}>Sculpted By Nature, <br />Refined By Hand.</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '550px', marginBottom: '40px', opacity: 0.9 }}>Transform your living spaces with the organic warmth of sustainable hardwood curtains.</p>
          <Link to="/collections" className="btn-primary" style={{ padding: '15px 40px' }}>EXPLORE CRAFTSMANSHIP</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {collections.map(c => (
              <div key={c.slug} style={{ position: 'relative', height: '450px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={c.img} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }}></div>
                <div style={{ position: 'relative', textAlign: 'center', color: 'white' }}>
                  <h3 style={{ color: 'white', fontSize: '2rem', marginBottom: '15px' }}>{c.name}</h3>
                  <Link to="/collections" className="btn-outline" style={{ color: 'white', borderColor: 'white' }}>BROWSE</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#f9f8f4' }}>
        <div className="container">
          <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '60px' }}>Signature Series</h2>
          {loading ? <p style={{ textAlign: 'center' }}>Loading signature pieces...</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
              {featured.map(p => <ProductCard key={p.id} product={{ ...p, image: p.image_url }} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const Collection = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('products').select('*').then(({ data }) => {
      setAllProducts(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ paddingTop: '150px' }}>
      <div className="container">
        <h2 style={{ fontSize: '3rem', marginBottom: '60px', textAlign: 'center' }}>Our Gallery</h2>
        {loading ? <p style={{ textAlign: 'center' }}>Unveiling our pieces...</p> : allProducts.length === 0 ? <p style={{ textAlign: 'center' }}>Collection is being prepared. Check back soon!</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            {allProducts.map(p => <ProductCard key={p.id} product={{ ...p, image: p.image_url }} />)}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [width, setWidth] = useState(48);
  const [height, setHeight] = useState(72);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div style={{ paddingTop: '200px', textAlign: 'center' }}>Studying the wood grain...</div>;
  if (!product) return <div style={{ paddingTop: '200px', textAlign: 'center' }}>Product Not Found</div>;

  const handleAddToCart = () => {
    addToCart({ ...product, customSize: `${width}" x ${height}"`, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ paddingTop: '150px' }}>
      <div className="container" style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1.2', minWidth: '350px' }}>
          <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '700px', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <p style={{ textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '10px' }}>{product.category}</p>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>{product.name}</h1>
          <p style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '30px' }}>₹{product.price}</p>
          <p style={{ marginBottom: '40px', color: 'var(--text-muted)', fontSize: '1.1rem' }}>{product.description || "A masterfully crafted piece for your sanctuary."}</p>

          <div style={{ padding: '30px', background: '#f5f5f5', marginBottom: '40px' }}>
            <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Ruler size={20} /> Custom Measurement (Inches)</h4>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>WIDTH</label>
                <input type="number" value={width} onChange={e => setWidth(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>HEIGHT</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }} />
              </div>
            </div>
          </div>

          <button onClick={handleAddToCart} className="btn-primary" style={{ width: '100%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            {added ? <><Check size={20} /> ADDED TO CART</> : 'ADD TO PIECE COLLECTION'}
          </button>

          <div style={{ marginTop: '40px' }}>
            <h4 style={{ marginBottom: '15px' }}>Specifications</h4>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)' }}>
              <li>Premium {product.material || "Hardwood"} construction</li>
              <li>Hand-finished detailing</li>
              <li>Sustainable sourcing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (!isCartOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000 }}>
      <div onClick={() => setIsCartOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}></div>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '100%', background: 'white', padding: '40px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Your Collection</h2>
          <X onClick={() => setIsCartOpen(false)} cursor="pointer" />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {cart.length === 0 ? <p>Your cart is empty.</p> : cart.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
              <img src={item.image} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', margin: 0 }}>{item.name}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Size: {item.customSize}</p>
                <p style={{ fontWeight: 'bold', marginTop: '5px' }}>₹{item.price}</p>
              </div>
              <X size={16} cursor="pointer" onClick={() => removeFromCart(idx)} />
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{ borderTop: '1px solid #eee', paddingTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <Link to="/checkout" onClick={() => setIsCartOpen(false)} className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>PROCEED TO CHECKOUT</Link>
          </div>
        )}
      </div>
    </div>
  );
};

const Checkout = () => {
  const { cart, user, setCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) return alert("Please login to place an order.");
    if (cart.length === 0) return alert("Your cart is empty.");

    setLoading(true);
    try {
      // 1. Create Order in Supabase
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert([{ user_id: user.id, total_amount: total, status: 'pending' }])
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 2. Create Order Items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        custom_size: item.customSize,
        unit_price: item.price
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
      if (itemsErr) throw itemsErr;

      // 3. Trigger Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID",
        amount: total * 100,
        currency: "INR",
        name: "HARDWOOD",
        description: "Custom Curtain Order",
        order_id: "", // In production, generate this via backend
        handler: async (response) => {
          // 4. Update order status on success
          const { error: updateErr } = await supabase
            .from('orders')
            .update({
              status: 'paid',
              razorpay_order_id: response.razorpay_payment_id
            })
            .eq('id', order.id);

          if (updateErr) alert("Payment saved but status update failed. Please contact support.");

          setCart([]);
          alert("Order Placed Successfully!");
          navigate('/account');
        },
        prefill: {
          name: user.user_metadata?.full_name || "Customer",
          email: user.email,
        },
        theme: { color: "#4E342E" },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Failed to initiate order. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '150px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>Checkout</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Shipping Information</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Full Name" style={{ padding: '12px', border: '1px solid #ddd' }} />
              <input type="text" placeholder="Mobile Number" style={{ padding: '12px', border: '1px solid #ddd' }} />
              <textarea placeholder="Complete Address" style={{ padding: '12px', border: '1px solid #ddd', height: '100px' }}></textarea>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="text" placeholder="Pincode" style={{ flex: 1, padding: '12px', border: '1px solid #ddd' }} />
                <input type="text" placeholder="City" style={{ flex: 1, padding: '12px', border: '1px solid #ddd' }} />
              </div>
            </div>
          </div>
          <div style={{ background: '#f9f8f4', padding: '30px' }}>
            <h4 style={{ marginBottom: '20px' }}>Order Summary</h4>
            {cart.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
                <span>{item.name} ({item.customSize})</span>
                <span>₹{item.price}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #ddd', marginTop: '20px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <button
              onClick={handlePayment}
              className="btn-primary"
              style={{ width: '100%', marginTop: '30px', opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "PROCESSING..." : "PAY & PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Account = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useCart();
  const navigate = useNavigate();
  const tabs = ['Profile', 'Order History', 'Address Section', 'Logout'];

  useEffect(() => {
    if (!user) navigate('/auth');
    else if (activeTab === 'Order History') fetchOrders();
  }, [user, navigate, activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div style={{ paddingTop: '150px' }}>
      <div className="container" style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
        <div style={{ width: '250px', borderRight: '1px solid #eee' }}>
          {tabs.map(tab => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '15px',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                background: activeTab === tab ? '#f9f8f4' : 'transparent'
              }}
            >
              {tab}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{ marginBottom: '30px' }}>{activeTab}</h2>
          {activeTab === 'Profile' && (
            <div style={{ maxWidth: '500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={40} color="#999" />
                </div>
                <div>
                  <h3>{user.email.split('@')[0]}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Curtain Enthusiast</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div><label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>EMAIL ID</label><p>{user.email}</p></div>
                <div><label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PHONE</label><p>Add phone number</p></div>
                <button className="btn-outline" style={{ width: 'fit-content' }}>CHANGE PASSWORD</button>
              </div>
            </div>
          )}
          {activeTab === 'Order History' && (
            <div>
              {loading ? <p>Loading orders...</p> : orders.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '40px', color: '#999' }}>No past orders found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.map(order => (
                    <div key={order.id} style={{ border: '1px solid #eee', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold' }}>Order #{order.id.slice(0, 8)}</span>
                        <span style={{
                          color: order.status === 'paid' ? 'green' : 'orange',
                          textTransform: 'uppercase',
                          fontSize: '12px'
                        }}>{order.status}</span>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                      <p style={{ marginTop: '10px', fontWeight: '500' }}>Total: ₹{order.total_amount}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'Address Section' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ border: '2px dashed #eee', height: '150px', display: 'flex', items: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <span style={{ color: '#999' }}>+ Add New Address</span>
              </div>
            </div>
          )}
          {activeTab === 'Logout' && (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <p style={{ marginBottom: '20px' }}>Ready to exit?</p>
              <button onClick={handleLogout} className="btn-primary">LOGOUT NOW</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Contact = () => (
  <div style={{ paddingTop: '150px' }}>
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>Get In Touch</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Whether you have a question about our collections or need help with a custom order, we're here to help.</p>
      </div>
      <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h3 style={{ marginBottom: '30px' }}>Send us a message</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="text" placeholder="Full Name" style={{ padding: '15px', border: '1px solid #eee' }} />
            <input type="email" placeholder="Email Address" style={{ padding: '15px', border: '1px solid #eee' }} />
            <textarea placeholder="How can we help?" style={{ padding: '15px', border: '1px solid #eee', height: '150px' }}></textarea>
            <button className="btn-primary">SEND MESSAGE</button>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h4>Visit Our Atelier</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>45 Craftmans Row, Varanasi, UP - 221001</p>
          </div>
          <div style={{ marginBottom: '40px' }}>
            <h4>Call Us</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>+91 9988776655</p>
          </div>
          <div style={{ marginBottom: '40px' }}>
            <h4>Email</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>concierge@hardwood.com</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const cartCount = cart.length;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));

  return (
    <CartContext.Provider value={{ cart, setCart, cartCount, isCartOpen, setIsCartOpen, addToCart, removeFromCart, user }}>
      <Router>
        <ScrollToTop />
        <Navbar />
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<Account />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </Router>
    </CartContext.Provider>
  );
};

export default App;
