import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Send, Search, MessageSquare, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
    const [allMessages, setAllMessages] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [search, setSearch] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendLoading, setSendLoading] = useState(false);
    const { user } = useAuth();
    const scrollRef = useRef();

    useEffect(() => {
        fetchContacts();
    }, [user]);

    // Separate effect so fetching messages also re-runs when contact changes
    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [selectedContact]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [allMessages, selectedContact]);

    const fetchContacts = async () => {
        if (!user) return;
        try {
            const endpoint = user.role === 'parent' ? '/lookups/teachers' : '/lookups/parents';
            const { data } = await api.get(endpoint);
            setContacts(data);
        } catch (error) {
            console.error('Error fetching contacts', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const { data } = await api.get('/messages');
            setAllMessages(data.data || data);
        } catch (error) {
            console.error('Error fetching messages', error);
        } finally {
            setLoading(false);
        }
    };

    // Derive conversation messages from allMessages + selectedContact
    const conversation = selectedContact
        ? allMessages.filter(m =>
            (m.sender_id === user?.id && m.receiver_id === selectedContact.id) ||
            (m.sender_id === selectedContact.id && m.receiver_id === user?.id)
          )
        : [];

    // Get last message for each contact to show preview
    const getLastMessage = (contactId) => {
        const msgs = allMessages.filter(m =>
            (m.sender_id === user?.id && m.receiver_id === contactId) ||
            (m.sender_id === contactId && m.receiver_id === user?.id)
        );
        return msgs.length > 0 ? msgs[msgs.length - 1] : null;
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        setSendLoading(true);
        try {
            const { data } = await api.post('/messages', {
                receiver_id: selectedContact.id,
                message: newMessage
            });
            setAllMessages(prev => [...prev, data]);
            setNewMessage('');
        } catch (error) {
            alert('Failed to send message');
        } finally {
            setSendLoading(false);
        }
    };

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-140px)] flex bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            {/* Sidebar */}
            <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary-600" />
                        Chats
                    </h2>
                    <div className="mt-4 relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text" placeholder="Search contacts..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-2xl text-sm outline-none border border-transparent focus:border-primary-200 transition-all font-medium"
                            value={search} onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredContacts.length === 0 && !loading && (
                        <div className="p-6 text-center text-slate-400 text-sm font-medium">
                            No contacts available yet.
                        </div>
                    )}
                    {filteredContacts.map(contact => {
                        const last = getLastMessage(contact.id);
                        const unread = allMessages.filter(m => m.sender_id === contact.id && m.receiver_id === user?.id && !m.is_read).length;
                        return (
                            <button
                                key={contact.id}
                                onClick={() => setSelectedContact(contact)}
                                className={`w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0 ${selectedContact?.id === contact.id ? 'bg-primary-50' : ''}`}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0 relative">
                                    {contact.name.charAt(0)}
                                    {unread > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                            {unread}
                                        </span>
                                    )}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 text-sm truncate">{contact.name}</p>
                                    <p className="text-xs text-slate-400 truncate">
                                        {last ? last.message : (user?.role === 'parent' ? 'Teacher' : 'Parent')}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!selectedContact ? 'hidden md:flex' : 'flex'}`}>
                {selectedContact ? (
                    <>
                        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <button onClick={() => setSelectedContact(null)} className="md:hidden p-2 text-slate-400"><ArrowLeft /></button>
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                {selectedContact.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{selectedContact.name}</h3>
                                <p className="text-[10px] uppercase font-black text-emerald-500 tracking-widest">
                                    {user?.role === 'parent' ? 'Teacher' : 'Parent'}
                                </p>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                            {conversation.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-3">
                                    <MessageSquare className="w-12 h-12 opacity-20" />
                                    <p className="text-sm font-medium">No messages yet. Say hello!</p>
                                </div>
                            )}
                            {conversation.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-3xl shadow-sm ${
                                        msg.sender_id === user?.id
                                            ? 'bg-primary-600 text-white rounded-tr-none'
                                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                    }`}>
                                        <p className="text-sm leading-relaxed">{msg.message}</p>
                                    </div>
                                    <p className="text-[10px] mt-2 font-bold text-slate-300 px-1 uppercase tracking-tighter">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={sendMessage} className="p-6 bg-white border-t border-slate-100 flex gap-4">
                            <input
                                type="text"
                                placeholder="Write your message..."
                                className="flex-1 px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium border-transparent focus:border-transparent"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={sendLoading || !newMessage.trim()}
                                className="bg-primary-600 text-white p-4 rounded-2xl hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all disabled:opacity-50"
                            >
                                {sendLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-4">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[40px] flex items-center justify-center">
                            <MessageSquare className="w-10 h-10 opacity-20" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-slate-400 text-lg">Select a conversation</h3>
                            <p className="text-sm max-w-xs mx-auto">Choose a contact from the left to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
