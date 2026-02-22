import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Plus, Edit, Trash, Package, ShoppingBag, Users, LayoutDashboard } from 'lucide-react';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Handwood Curtains', material: 'Oak', image_url: '' });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        if (activeTab === 'Products' || activeTab === 'Overview') {
            const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
            setProducts(data || []);
        }
        if (activeTab === 'Orders' || activeTab === 'Overview') {
            const { data } = await supabase.from('orders').select('*, profiles(full_name)').order('created_at', { ascending: false });
            setOrders(data || []);
        }
        setLoading(false);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) alert(error.message);
        else {
            setShowModal(false);
            fetchData();
            setNewProduct({ name: '', price: '', category: 'Handwood Curtains', material: 'Oak', image_url: '' });
        }
    };

    const tabs = [
        { name: 'Overview', icon: <LayoutDashboard size={18} /> },
        { name: 'Products', icon: <Package size={18} /> },
        { name: 'Orders', icon: <ShoppingBag size={18} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5', paddingTop: '80px' }}>
            {/* Sidebar */}
            <div style={{ width: '260px', background: 'white', borderRight: '1px solid #eee', padding: '30px 0' }}>
                <h3 style={{ padding: '0 30px', marginBottom: '40px', color: 'var(--primary)' }}>Admin Portal</h3>
                {tabs.map(tab => (
                    <div
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '15px 30px',
                            cursor: 'pointer',
                            color: activeTab === tab.name ? 'var(--primary)' : '#757575',
                            background: activeTab === tab.name ? '#f9f8f4' : 'transparent',
                            borderLeft: activeTab === tab.name ? '4px solid var(--primary)' : '4px solid transparent',
                            fontWeight: activeTab === tab.name ? '600' : '400'
                        }}
                    >
                        {tab.icon} {tab.name}
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2rem' }}>{activeTab}</h2>
                    {activeTab === 'Products' && (
                        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Plus size={18} /> ADD PRODUCT
                        </button>
                    )}
                </div>

                {loading ? <p>Loading data...</p> : (
                    <>
                        {activeTab === 'Overview' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                                <div style={{ background: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #eee' }}>
                                    <p style={{ color: '#757575', fontSize: '14px' }}>Total Sales</p>
                                    <h3 style={{ fontSize: '2rem', marginTop: '10px' }}>₹{orders.reduce((sum, o) => sum + (o.status === 'paid' ? o.total_amount : 0), 0)}</h3>
                                </div>
                                <div style={{ background: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #eee' }}>
                                    <p style={{ color: '#757575', fontSize: '14px' }}>Total Orders</p>
                                    <h3 style={{ fontSize: '2rem', marginTop: '10px' }}>{orders.length}</h3>
                                </div>
                                <div style={{ background: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #eee' }}>
                                    <p style={{ color: '#757575', fontSize: '14px' }}>Active Inventory</p>
                                    <h3 style={{ fontSize: '2rem', marginTop: '10px' }}>{products.length}</h3>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Products' && (
                            <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: '#f9f9f9', textAlign: 'left' }}>
                                        <tr>
                                            <th style={{ padding: '15px 20px' }}>Product</th>
                                            <th style={{ padding: '15px 20px' }}>Category</th>
                                            <th style={{ padding: '15px 20px' }}>Price</th>
                                            <th style={{ padding: '15px 20px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.length === 0 ? <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>No products found. Add your first piece!</td></tr> : products.map(p => (
                                            <tr key={p.id} style={{ borderTop: '1px solid #eee' }}>
                                                <td style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <img src={p.image_url} style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                                    {p.name}
                                                </td>
                                                <td style={{ padding: '15px 20px' }}>{p.category}</td>
                                                <td style={{ padding: '15px 20px' }}>₹{p.price}</td>
                                                <td style={{ padding: '15px 20px' }}>
                                                    <div style={{ display: 'flex', gap: '15px' }}>
                                                        <Edit size={16} cursor="pointer" color="#757575" />
                                                        <Trash onClick={async () => { if (confirm('Delete?')) await supabase.from('products').delete().eq('id', p.id); fetchData(); }} size={16} cursor="pointer" color="#D32F2F" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'Orders' && (
                            <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: '#f9f9f9', textAlign: 'left' }}>
                                        <tr>
                                            <th style={{ padding: '15px 20px' }}>Order ID</th>
                                            <th style={{ padding: '15px 20px' }}>Customer</th>
                                            <th style={{ padding: '15px 20px' }}>Amount</th>
                                            <th style={{ padding: '15px 20px' }}>Status</th>
                                            <th style={{ padding: '15px 20px' }}>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length === 0 ? <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center' }}>No orders placed yet.</td></tr> : orders.map(o => (
                                            <tr key={o.id} style={{ borderTop: '1px solid #eee' }}>
                                                <td style={{ padding: '15px 20px', fontSize: '13px' }}>#{o.id.slice(0, 8)}</td>
                                                <td style={{ padding: '15px 20px' }}>{o.profiles?.full_name || 'Guest'}</td>
                                                <td style={{ padding: '15px 20px' }}>₹{o.total_amount}</td>
                                                <td style={{ padding: '15px 20px' }}>
                                                    <span style={{
                                                        padding: '4px 10px',
                                                        fontSize: '12px',
                                                        borderRadius: '12px',
                                                        background: o.status === 'paid' ? '#E8F5E9' : '#FFF3E0',
                                                        color: o.status === 'paid' ? '#2E7D32' : '#EF6C00',
                                                        textTransform: 'uppercase'
                                                    }}>{o.status}</span>
                                                </td>
                                                <td style={{ padding: '15px 20px', fontSize: '13px', color: '#757575' }}>
                                                    {new Date(o.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* Add Product Modal */}
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
                        <div style={{ background: 'white', padding: '40px', borderRadius: '8px', width: '450px' }}>
                            <h3 style={{ marginBottom: '30px' }}>Add New Piece</h3>
                            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <input placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd' }} required />
                                <input placeholder="Price (INR)" type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd' }} required />
                                <input placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd' }} />
                                <input placeholder="Image URL" value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd' }} required />
                                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                    <button type="button" onClick={() => setShowModal(false)} className="btn-outline" style={{ flex: 1 }}>CANCEL</button>
                                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>SAVE PIECE</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
