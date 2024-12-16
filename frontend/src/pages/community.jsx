import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ThumbsUp, Calendar, User, ArrowLeft, Tag, PlusCircle, Loader, Send } from 'lucide-react';
import './css/community.css';

const topics = [
    "Tutti",
    "Orto",
    "Giardinaggio urbano",
    "Piante da interno",
    "Piante da esterno",
    "Alberi e arbusti",
    "Piante grasse",
    "Erbe aromatiche",
    "Compostaggio",
    "Irrigazione",
    "Controllo parassiti",
    "Attrezzi e tecniche",
    "Progettazione del giardino",
    "Giardinaggio biologico",
    "Giardinaggio stagionale",
    "Piante rare e esotiche"
];

// Simula una chiamata API per ottenere i post
const fetchPosts = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: "Consigli per coltivare pomodori in vaso",
                    content: "Ciao a tutti! Quest'anno ho deciso di coltivare pomodori sul mio balcone. Qualcuno ha esperienza con la coltivazione in vaso? Quali varietà consigliate e quali sono i trucchi per ottenere un buon raccolto? Grazie in anticipo per i vostri consigli!",
                    author: {
                        name: "MariaGreen",
                        avatar: "https://i.pravatar.cc/150?u=MariaGreen",
                    },
                    date: "2023-05-15T10:30:00Z",
                    likes: 24,
                    comments: [
                        { id: 1, author: "GreenThumb", content: "Prova con i pomodori ciliegini, sono perfetti per i vasi!", date: "2023-05-15T11:00:00Z" },
                        { id: 2, author: "TomatoLover", content: "Assicurati di usare un terreno ben drenato e di annaffiare regolarmente.", date: "2023-05-15T11:30:00Z" }
                    ],
                    topic: "Orto"
                },
                {
                    id: 2,
                    title: "La mia collezione di succulente sta crescendo!",
                    content: "Volevo condividere con voi la gioia per la mia collezione di succulente in continua crescita. Ho iniziato con tre piantine l'anno scorso e ora ne ho più di 20! Allego una foto della mia ultima aggiunta: una bellissima Echeveria 'Perle von Nürnberg'. Qualcun altro è appassionato di succulente qui?",
                    author: {
                        name: "LucaSuculent",
                        avatar: "https://i.pravatar.cc/150?u=LucaSuculent",
                    },
                    date: "2023-05-14T16:45:00Z",
                    likes: 42,
                    comments: [
                        { id: 3, author: "CactusQueen", content: "Che meraviglia! Anch'io adoro le succulente. Hai qualche consiglio per la cura invernale?", date: "2023-05-14T17:00:00Z" }
                    ],
                    topic: "Piante grasse"
                },
                {
                    id: 3,
                    title: "Aiuto! Afidi sulle mie rose",
                    content: "Ho notato che le mie rose sono infestate da afidi. Ho provato a spruzzarle con acqua e sapone, ma sembra non funzionare. Qualcuno ha suggerimenti per trattamenti naturali efficaci? Vorrei evitare l'uso di pesticidi chimici se possibile. Grazie per l'aiuto!",
                    author: {
                        name: "RosaAmante",
                        avatar: "https://i.pravatar.cc/150?u=RosaAmante",
                    },
                    date: "2023-05-13T09:15:00Z",
                    likes: 18,
                    comments: [
                        { id: 4, author: "BugBuster", content: "Prova con una soluzione di acqua e olio di neem. È naturale ed efficace contro gli afidi.", date: "2023-05-13T10:00:00Z" }
                    ],
                    topic: "Controllo parassiti"
                },
                {
                    id: 4,
                    title: "Il mio primo orto urbano: cosa piantare?",
                    content: "Ciao a tutti! Ho finalmente ottenuto un piccolo spazio in un orto urbano condiviso. Sono super emozionato ma anche un po' sopraffatto. Cosa mi consigliate di piantare come principiante? Ho circa 10 m² a disposizione. Cerco piante che siano relativamente facili da coltivare e che diano una buona resa. Grazie per i vostri suggerimenti!",
                    author: {
                        name: "NeoOrtolano",
                        avatar: "https://i.pravatar.cc/150?u=NeoOrtolano",
                    },
                    date: "2023-05-12T14:20:00Z",
                    likes: 31,
                    comments: [
                        { id: 5, author: "UrbanFarmer", content: "Inizia con pomodori, zucchine e insalata. Sono facili da coltivare e danno buoni risultati!", date: "2023-05-12T15:00:00Z" }
                    ],
                    topic: "Giardinaggio urbano"
                },
                {
                    id: 5,
                    title: "Consigli per un giardino a bassa manutenzione",
                    content: "Salve community! Sto progettando di rinnovare il mio giardino e cerco idee per renderlo bello ma a bassa manutenzione. Ho poco tempo libero durante la settimana, quindi cerco piante resistenti e che richiedano poche cure. Qualcuno ha esperienza con giardini 'lazy'? Quali piante e tecniche consigliate? Grazie mille!",
                    author: {
                        name: "GiardinierePigro",
                        avatar: "https://i.pravatar.cc/150?u=GiardinierePigro",
                    },
                    date: "2023-05-11T11:05:00Z",
                    likes: 56,
                    comments: [
                        { id: 6, author: "LowMaintenancePro", content: "Prova con piante perenni autoctone. Richiedono poca manutenzione e sono adatte al clima locale.", date: "2023-05-11T12:00:00Z" }
                    ],
                    topic: "Progettazione del giardino"
                }
            ]);
        }, 1000); // Simula un ritardo di 1 secondo
    });
};

// Simula una chiamata API per creare un nuovo post
const createPost = (newPost) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: Date.now(),
                ...newPost,
                author: {
                    name: 'Utente Corrente',
                    avatar: 'https://i.pravatar.cc/150?u=current',
                },
                date: new Date().toISOString(),
                likes: 0,
                comments: [],
            });
        }, 1000); // Simula un ritardo di 1 secondo
    });
};

// Simula una chiamata API per aggiungere un "Mi piace" a un post
const addLike = (postId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 500);
    });
};

// Simula una chiamata API per aggiungere un commento a un post
const addComment = (postId, comment) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: Date.now(),
                author: 'Utente Corrente',
                content: comment,
                date: new Date().toISOString(),
            });
        }, 500);
    });
};

const PostCard = ({ post, onPostClick, onLike }) => (
    <div className="community-card">
        <div className="community-card-header">
            <h3 className="community-card-title" onClick={() => onPostClick(post)}>{post.title}</h3>
            <div className="community-card-meta">
                <User className="icon" size={16} />
                <span>{post.author.name}</span>
                <span className="separator">•</span>
                <Calendar className="icon" size={16} />
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span className="separator">•</span>
                <Tag className="icon" size={16} />
                <span>{post.topic}</span>
            </div>
        </div>
        <div className="community-card-content" onClick={() => onPostClick(post)}>
            <p>{post.content.substring(0, 150)}...</p>
        </div>
        <div className="community-card-footer">
            <div className="community-card-stats">
                <button
                    className={`like-button ${post.liked ? 'liked' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onLike(post.id);
                    }}
                >
                    <ThumbsUp className="icon" size={16} />
                    <span className="like-count">{post.likes}</span>
                </button>
            </div>
            <div className="community-card-stats">
                <MessageSquare className="icon" size={16} />
                <span>{post.comments.length}</span>
            </div>
        </div>
    </div>
);

const NewPostForm = ({ onPostSubmit, isSubmitting }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [topic, setTopic] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onPostSubmit({ title, content, topic });
        setTitle("");
        setContent("");
        setTopic("");
    };

    return (
        <form onSubmit={handleSubmit} className="community-new-post-form">
            <div className="community-form-group">
                <label htmlFor="title">Titolo</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="community-form-control"
                    disabled={isSubmitting}
                />
            </div>
            <div className="community-form-group">
                <label htmlFor="topic">Topic</label>
                <select
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                    className="community-form-control"
                    disabled={isSubmitting}
                >
                    <option value="">Seleziona un topic</option>
                    {topics.slice(1).map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>
            <div className="community-form-group">
                <label htmlFor="content">Contenuto</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="community-form-control"
                    rows="5"
                    disabled={isSubmitting}
                ></textarea>
            </div>
            <button type="submit" className="community-btn community-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader className="icon spinner" size={16} />
                        Pubblicazione in corso...
                    </>
                ) : (
                    'Pubblica'
                )}
            </button>
        </form>
    );
};

const PostDetail = ({ post, onClose, onLike, onComment }) => {
    const [newComment, setNewComment] = useState("");

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            onComment(post.id, newComment);
            setNewComment("");
        }
    };

    return (
        <div className="community-post-detail-overlay">
            <div className="community-post-detail-content">
                <button className="community-close-button" onClick={onClose}>&times;</button>
                <h2>{post.title}</h2>
                <div className="community-post-meta">
                    <span>{post.author.name}</span>
                    <span className="separator">•</span>
                    <Calendar className="icon" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span className="separator">•</span>
                    <Tag className="icon" />
                    <span>{post.topic}</span>
                </div>
                <p>{post.content}</p>
                <div className="community-post-stats">
                    <div className="community-stat">
                        <button
                            className={`like-button ${post.liked ? 'liked' : ''}`}
                            onClick={() => onLike(post.id)}
                        >
                            <ThumbsUp className="icon" />
                            <span className="like-count">{post.likes}</span>
                        </button>
                    </div>
                    <div className="community-stat">
                        <MessageSquare className="icon" />
                        <span>{post.comments.length} Commenti</span>
                    </div>
                </div>
                <div className="community-comments">
                    <h3>Commenti</h3>
                    {post.comments.map((comment) => (
                        <div key={comment.id} className="community-comment">
                            <div className="community-comment-header">
                                <strong>{comment.author}</strong>
                                <span>{new Date(comment.date).toLocaleString()}</span>
                            </div>
                            <p>{comment.content}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleCommentSubmit} className="community-comment-form">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Scrivi un commento..."
                        className="community-comment-input"
                    />
                    <button type="submit" className="community-comment-submit">
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
};

function Community() {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [activeTab, setActiveTab] = useState("posts");
    const [activeTopic, setActiveTopic] = useState("Tutti");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedPosts = await fetchPosts();
            setPosts(fetchedPosts.map(post => ({ ...post, liked: false })));
        } catch (err) {
            setError("Si è verificato un errore durante il caricamento dei post. Riprova più tardi.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostSubmit = async (newPost) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const createdPost = await createPost(newPost);
            setPosts([{ ...createdPost, liked: false }, ...posts]);
            setActiveTab("posts");
        } catch (err) {
            setError("Si è verificato un errore durante la pubblicazione del post. Riprova più tardi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            await addLike(postId);
            setPosts(posts.map(post =>
                post.id === postId
                    ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
                    : post
            ));
            if (selectedPost && selectedPost.id === postId) {
                setSelectedPost(prevPost => ({
                    ...prevPost,
                    likes: prevPost.liked ? prevPost.likes - 1 : prevPost.likes + 1,
                    liked: !prevPost.liked
                }));
            }
        } catch (err) {
            setError("Si è verificato un errore durante l'aggiunta del Mi piace. Riprova più tardi.");
        }
    };

    const handleComment = async (postId, comment) => {
        try {
            const newComment = await addComment(postId, comment);
            const updatedPosts = posts.map(post =>
                post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
            );
            setPosts(updatedPosts);
            if (selectedPost && selectedPost.id === postId) {
                setSelectedPost(prevPost => ({
                    ...prevPost,
                    comments: [...prevPost.comments, newComment]
                }));
            }
        } catch (err) {
            setError("Si è verificato un errore durante l'aggiunta del commento. Riprova più tardi.");
        }
    };

    const filteredPosts = activeTopic === "Tutti"
        ? posts
        : posts.filter(post => post.topic === activeTopic);

    return (
        <div className="community-page">
            <div className="community-container">
                <header className="community-header">
                    <h1 className="community-title">Community Home Gardening</h1>
                    <p className="community-subtitle">Condividi la tua passione per il giardinaggio!</p>
                </header>

                <div className="community-tabs">
                    <button
                        className={`community-tab-button ${activeTab === "posts" ? "active" : ""}`}
                        onClick={() => setActiveTab("posts")}
                    >
                        <MessageSquare className="icon" />
                        Post
                    </button>
                    <button
                        className={`community-tab-button ${activeTab === "new" ? "active" : ""}`}
                        onClick={() => setActiveTab("new")}
                    >
                        <PlusCircle className="icon" />
                        Nuovo Post
                    </button>
                </div>

                {error && <div className="community-error">{error}</div>}

                {activeTab === "posts" && (
                    <>
                        <div className="community-topic-filter">
                            {topics.map(topic => (
                                <button
                                    key={topic}
                                    className={`community-topic-button ${activeTopic === topic ? "active" : ""}`}
                                    onClick={() => setActiveTopic(topic)}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                        {isLoading ? (
                            <div className="community-loading">
                                <Loader className="icon spinner" size={32} />
                                <span>Caricamento post in corso...</span>
                            </div>
                        ) : (
                            <div className="community-posts">
                                {filteredPosts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onPostClick={setSelectedPost}
                                        onLike={handleLike}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === "new" && (
                    <div className="community-new-post-container">
                        <h2>Crea un nuovo post</h2>
                        <NewPostForm onPostSubmit={handlePostSubmit} isSubmitting={isSubmitting} />
                    </div>
                )}

                {selectedPost && (
                    <PostDetail
                        post={selectedPost}
                        onClose={() => setSelectedPost(null)}
                        onLike={handleLike}
                        onComment={handleComment}
                    />
                )}
            </div>
        </div>
    );
}

export default Community;

