import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusCircle, Search, MessageSquare } from 'lucide-react';
import Sidebar from './Sidebar';
import FooterNav from './FooterNav';
import { AppContent } from "../context/AppContent";

const sampleThreads = [
  {
    id: 1,
    title: 'How do you stay motivated on tough days?',
    author: 'Alex',
    replies: 12,
    excerpt: 'I usually try short breathing exercises then a five minute walk...',
  },
  {
    id: 2,
    title: 'Recommendations for dealing with anxiety',
    author: 'Sam',
    replies: 8,
    excerpt: 'Apps, podcasts or short exercises that help me ground myself...',
  },
  {
    id: 3,
    title: 'How journaling changed my mood',
    author: 'Priya',
    replies: 3,
    excerpt: 'I started writing a 3-line gratitude every night and the difference is real...',
  },
];

const CommunityForum = () => {
  const [query, setQuery] = useState('');
  const [threads, setThreads] = useState(sampleThreads);
  const [openNew, setOpenNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [page] = useState(1);
  const [selected, setSelected] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  const { userData, backendUrl, isLoggedin, fetchAdminData } = useContext(AppContent);
  const [isAdmin, setIsAdmin] = useState(false);
  const [flaggedThreads, setFlaggedThreads] = useState([]);

  const results = threads.filter(t => (
    t.title.toLowerCase().includes(query.toLowerCase()) || t.excerpt.toLowerCase().includes(query.toLowerCase())
  ));

  // Helper to safely render author/actor display names (handles strings or objects)
  const getDisplayName = (actor) => {
    if (!actor) return 'Anonymous';
    if (typeof actor === 'string') return actor;
    if (typeof actor === 'object') {
      if (actor.firstName || actor.lastName) return `${actor.firstName || ''} ${actor.lastName || ''}`.trim();
      if (actor.email) return actor.email;
      // fallback to a simple id/email representation
      if (actor._id) return actor.email || actor._id.toString();
      try { return JSON.stringify(actor); } catch { return 'Anonymous'; }
    }
    return String(actor);
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;

    // Create via API if backend configured
    if (backendUrl) {
      axios.post(`${backendUrl}/api/forum`, { title: newTitle.trim(), body: newBody.trim(), tags: [] }, { withCredentials: true })
        .then(res => {
          if (res.data?.success) {
            setThreads(prev => [res.data.data, ...prev]);
            setOpenNew(false);
            setNewTitle('');
            setNewBody('');
            toast.success('Thread created');
          } else {
            toast.error(res.data?.message || 'Failed to create thread');
          }
        })
        .catch(err => toast.error(err.response?.data?.message || 'Failed to create thread'));
      return;
    }

    const next = {
      id: Date.now(),
      title: newTitle.trim(),
      author: 'You',
      replies: 0,
      excerpt: newBody.trim().slice(0, 140),
    };
    setThreads([next, ...threads]);
    setOpenNew(false);
    setNewTitle('');
    setNewBody('');
  };

  // fetch threads from backend
  const fetchThreads = useCallback(async () => {
    if (!backendUrl) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/forum`, { params: { page, limit: 20 } });
      if (data?.success) {
        setThreads(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, page]);

  const openThread = async (thread) => {
    setSelected(thread);
    if (!backendUrl) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/forum/${thread._id || thread.id}`, { withCredentials: true });
      if (data?.success) {
        setPosts(data.data.posts || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load thread');
    }
  };

  const submitPost = async () => {
    if (!newPost.trim()) return;
    if (!selected) return;
    try {
      const { data } = await axios.post(`${backendUrl}/api/forum/${selected._id || selected.id}/posts`, { content: newPost.trim() }, { withCredentials: true });
      if (data?.success) {
        setPosts(prev => [...prev, data.data]);
        setNewPost('');
        toast.success('Reply posted');
      } else {
        toast.error(data?.message || 'Failed to post');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post');
    }
  };

  const flagThread = async (id) => {
    if (!backendUrl) return toast.error('Backend not configured');
    try {
      const { data } = await axios.post(`${backendUrl}/api/forum/${id}/flag`, {}, { withCredentials: true });
      if (data?.success) {
        toast.success('Thread flagged for review');
        fetchThreads();
      } else {
        toast.error(data?.message || 'Failed to flag');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to flag');
    }
  };

  const moderatePost = async (postId, action) => {
    if (!backendUrl) return;
    try {
      const { data } = await axios.post(`${backendUrl}/api/forum/moderation/post/${postId}`, { action }, { withCredentials: true });
      if (data?.success) {
        toast.success('Post updated');
        // refresh posts
        if (selected) openThread(selected);
      } else {
        toast.error(data?.message || 'Failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const moderateThread = async (id, action) => {
    if (!backendUrl) return;
    try {
      const { data } = await axios.post(`${backendUrl}/api/forum/moderation/thread/${id}`, { action }, { withCredentials: true });
      if (data?.success) {
        toast.success('Moderation updated');
        fetchThreads();
        if (isAdmin) fetchFlagged();
      } else {
        toast.error(data?.message || 'Moderation failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Moderation failed');
    }
  };

  // check admin status (providers)
  useEffect(() => {
    let mounted = true;
    if (!fetchAdminData) return;
    (async () => {
      try {
        const admin = await fetchAdminData(true);
        if (mounted && admin && admin.role === 'admin') setIsAdmin(true);
      } catch (err) { console.error(err); }
    })();
    return () => { mounted = false; };
  }, [fetchAdminData]);

  // fetch flagged threads for moderators
  const fetchFlagged = useCallback(async () => {
    if (!backendUrl || !isAdmin) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/forum/moderation/flagged`, { withCredentials: true });
      if (data?.success) setFlaggedThreads(data.data || []);
    } catch (err) {
      console.error('fetchFlagged', err?.response?.data || err.message);
    }
  }, [backendUrl, isAdmin]);

  useEffect(() => { if (isAdmin) fetchFlagged(); }, [isAdmin, fetchFlagged]);

  useEffect(() => { fetchThreads(); }, [fetchThreads]);

  return (
    <div className="flex min-h-screen font-nunito bg-gradient-to-b from-[#0a1f1f] to-[#062b2b] text-white">
        <Sidebar firstName={userData?.firstName || "Guest"} />
        <main className="flex flex-col flex-1 gap-10 px-6 md:px-10 py-8 overflow-y-auto no-scrollbar w-full max-w-7xl mx-auto">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col items-start justify-between mb-8 gap-6">
                    <div className="flex items-center gap-4 justify-between w-full ">
                        <div>
                            <div className="bg-gold/20 p-2 rounded-full">
                            <MessageSquare className="w-6 h-6 text-gold" />
                            </div>
                            <h1 className="text-2xl font-extrabold">Community Forum</h1>
                        </div>
                        <div className="flex items-end justify-end">
                            <button
                            onClick={() => setOpenNew(true)}
                            className="inline-flex gap-2 items-center bg-gold text-dark-teal px-3 py-2 rounded-full text-sm font-semibold hover:bg-gold/80 transition"
                            >
                            <PlusCircle className="w-4 h-4" />
                            <p className='text-sm'>Post</p>
                            </button>
                        </div>
                    </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by topic"
                        className="pl-10 pr-3 py-2 rounded-full bg-white/5 placeholder-gray-400 border border-white/5 focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <Search className="absolute left-3 top-2 w-5 h-5 text-gray-300" />
                    </div>
                    
                </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    {loading ? (
                      <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center text-gray-300">Loading...</div>
                    ) : results.length === 0 ? (
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center text-gray-300">No threads found — try creating one.</div>
                    ) : results.map(t => (
                    <article key={t._id || t.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-bold text-white">{t.title}</h3>
                            <p className="text-sm text-gray-300 mt-2 line-clamp-2">{t.excerpt}</p>
                            <div className="flex items-center gap-3 text-xs mt-3 text-gray-400">
                            <span>By {t.author}</span>
                            <span>•</span>
                            <span>{t.replies} replies</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-400 flex gap-2 items-center">
                          <span>Open</span>
                          {t.status === 'flagged' && <span className="text-amber-300">Flagged</span>}
                          {t.pinned && <span className="text-gold">Pinned</span>}
                        </div>
                        </div>
                      <div className="mt-3 flex justify-between items-center">
                        <div className="text-xs text-gray-400">{new Date(t.updatedAt || t.lastActivityAt || Date.now()).toLocaleString()}</div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openThread(t)} className="text-sm text-gold underline">Open</button>
                          {isLoggedin && !isAdmin && (
                            <button onClick={() => flagThread(t._id || t.id)} className="text-sm text-amber-300">Flag</button>
                          )}
                          {isAdmin && (
                            <button onClick={() => moderateThread(t._id || t.id, t.status === 'deleted' ? 'restore' : 'delete')} className="text-sm text-rose-500">{t.status === 'deleted' ? 'Restore' : 'Delete'}</button>
                          )}
                        </div>
                      </div>
                    </article>
                    ))}
                </div>

                <aside className="p-4 rounded-xl bg-white/5 border border-white/10">
                    {isAdmin && (
                      <div className="mb-4">
                        <h4 className="text-sm text-gray-300 flex items-center justify-between">Moderation queue <span className="text-xs text-amber-300">{flaggedThreads.length}</span></h4>
                        <div className="mt-3 space-y-2 text-xs text-gray-300">
                          {flaggedThreads.length === 0 ? <div className="text-sm text-gray-400">No flagged threads</div> : flaggedThreads.map(ft => (
                            <div key={ft._id} className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
                              <div className="truncate">{ft.title}</div>
                              <div className="flex gap-2">
                                <button onClick={() => moderateThread(ft._id, 'delete')} className="text-rose-400 text-xs">Delete</button>
                                <button onClick={() => moderateThread(ft._id, 'restore')} className="text-gold text-xs">Restore</button>
                                <button onClick={() => moderateThread(ft._id, 'pin')} className="text-xs text-gray-300">Pin</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <h4 className="text-sm text-gray-300">Community Rules</h4>
                    <ul className="text-xs text-gray-400 mt-3 space-y-2">
                    <li>Be kind and supportive.</li>
                    <li>No hate speech or personal attacks.</li>
                    <li>Protect your privacy — don't share personal info.</li>
                    </ul>

                    <div className="mt-6">
                    <h5 className="text-sm text-gray-300">Popular topics</h5>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="bg-white/5 px-3 py-1 rounded-full text-xs text-gray-300">Anxiety</span>
                        <span className="bg-white/5 px-3 py-1 rounded-full text-xs text-gray-300">Self-care</span>
                        <span className="bg-white/5 px-3 py-1 rounded-full text-xs text-gray-300">Journaling</span>
                        <span className="bg-white/5 px-3 py-1 rounded-full text-xs text-gray-300">Sleep</span>
                    </div>
                    </div>
                </aside>
                </div>

                {/* new thread modal */}
                {openNew && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60" onClick={() => setOpenNew(false)}>
                    <div className="w-full max-w-2xl bg-[#071515] rounded-2xl border border-[#27403f] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Create new thread</h3>
                        <button onClick={() => setOpenNew(false)} className="text-gray-400 hover:text-white">Close</button>
                    </div>
                    <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Thread title" className="w-full p-3 rounded-lg bg-white/5 border border-white/10 mb-3" />
                    <textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} rows={6} placeholder="Write your message..." className="w-full p-3 rounded-lg bg-white/5 border border-white/10" />
                    <div className="mt-4 text-right">
                        <button onClick={handleCreate} className="bg-gold text-dark-teal px-4 py-2 rounded-full font-semibold">Post thread</button>
                    </div>
                    </div>
                </div>
                )}
                {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60" onClick={() => { setSelected(null); setPosts([]); }}>
                    <div className="w-full max-w-3xl bg-[#071515] rounded-2xl border border-[#27403f] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold">{selected.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">By {getDisplayName(selected.author)}</p>
                        </div>
                        <div className="text-xs text-gray-400">{selected.postsCount || 0} posts</div>
                      </div>

                      <div className="mt-4 divide-y divide-white/5 max-h-[60vh] overflow-auto">
                        <div className="py-4">
                          <h4 className="text-sm text-gray-300">Discussion</h4>
                          {posts.length === 0 ? <div className="text-sm text-gray-400 mt-3">No replies yet.</div> : posts.map(p => (
                                  <div key={p._id} className="mt-3 p-3 rounded-lg bg-white/3 border border-white/5">
                                    <div className="flex items-center justify-between">
                                      <div className="text-sm font-semibold">{getDisplayName(p.author)}</div>
                                      <div className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div className="text-sm mt-2 text-gray-200">{p.content}</div>
                                    {isAdmin && (
                                      <div className="flex gap-3 mt-2">
                                        <button onClick={() => moderatePost(p._id, p.status === 'deleted' ? 'restore' : 'delete')} className="text-xs text-rose-400">{p.status === 'deleted' ? 'Restore' : 'Delete'}</button>
                                        <button onClick={() => moderatePost(p._id, 'flag')} className="text-xs text-amber-300">Flag</button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                        </div>

                        <div className="py-4">
                          {isLoggedin ? (
                            <div className="mt-2">
                              <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} rows={4} className="w-full p-3 rounded-lg bg-white/5 border border-white/10" placeholder="Write your reply..." />
                              <div className="mt-3 text-right">
                                <button onClick={submitPost} className="bg-gold text-dark-teal px-4 py-2 rounded-full font-semibold">Reply</button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">You need to be logged in to reply.</div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 text-right">
                        <button onClick={() => { setSelected(null); setPosts([]); }} className="text-gray-400 hover:text-white">Close</button>
                      </div>
                    </div>
                </div>
                )}
            </div>
            <div className="mb-10"></div>
      </main>

      <FooterNav />
    </div>
  );
};

export default CommunityForum;
