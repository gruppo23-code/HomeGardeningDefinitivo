import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ThumbsUp, Calendar, User, ArrowLeft, Tag, PlusCircle, Loader, Send, X, Clock, Trash2 } from 'lucide-react';
import './css/community.css';
import axios, {post} from "axios";
import Cookies from "js-cookie";

// Define topics
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

// API functions (to be replaced with actual API calls)
const api = {
    fetchPosts: async () => {
        try {
            const response = await axios.get("http://localhost:8081/visualizzapost");
            console.log(response.data);
            return response.data; // Restituisci i dati ottenuti dalla query
        } catch (error) {
            console.error("Errore durante il recupero dei post:", error);
            throw error; // Rilancia l'errore per gestirlo nel componente
        }
    },
    createPost: async (post) => {
        try {
            const response = await axios.post("http://localhost:8081/aggiungipost", post);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    },

    addLike: async (postId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 500);
        });
    },

    addComment: async (postId, comment) => {
        const data = {
            postId: postId,
            comment: comment
        };
        try {
            const response = await axios.post("http://localhost:8081/aggiungicommento", data);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    },
    deleteComment: async (postId, commentId) => {
        try {
            const response = await axios.post("http://localhost:8081/cancellacommento", { commentId: commentId });
            console.log(response);
            return response.data;
        } catch (error) {
            console.error("Errore durante l'eliminazione del commento:", error);
            throw error;
        }
    }
};

const PostCard = ({ post, onPostClick, onLike }) => (
    <div className="community-card">
        <div className="community-card-header">
            <h3 className="community-card-title" onClick={() => onPostClick(post)}>{post.title}</h3>
            <div className="community-card-meta">
                <div className="community-card-author">
                    <User className="icon" size={16} />
                    <span>{post.author.name}</span>
                </div>
                <div className="community-card-date">
                    <Calendar className="icon" size={16} />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="community-card-topic">
                    <Tag className="icon" size={16} />
                    <span>{post.topic}</span>
                </div>
            </div>
        </div>
        <div className="community-card-content" onClick={() => onPostClick(post)}>
            <p>{post.content.substring(0, 150)}...</p>
        </div>
        <div className="community-card-footer">
            <button
                className={`like-button ${post.liked ? 'liked' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onLike(post.id);
                }}
            >
                <ThumbsUp className="icon" />
                <span className="like-count">{post.likes}</span>
            </button>
            <button
                className="community-card-stats"
                onClick={(e) => {
                    e.stopPropagation();
                    onPostClick(post);
                }}
            >
                <MessageSquare className="icon" />
                <span>{post.comments.length}</span>
            </button>
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

const PostDetail = ({ post, onClose, onLike, onComment, onDeleteComment }) => {
    const [newComment, setNewComment] = useState("");
    const [localComments, setLocalComments] = useState(post.comments);

    useEffect(() => {
        setLocalComments(post.comments);
    }, [post.comments]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            const tempComment = {
                id: Date.now(), // Temporary ID
                content: newComment,
                author: "You", // Or the current user's name
                date: new Date().toISOString()
            };
            setLocalComments(prevComments => [...prevComments, tempComment]);
            onComment(post.id, newComment);
            setNewComment("");
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleLocalDeleteComment = (commentId) => {
        setLocalComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        onDeleteComment(post.id, commentId);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('it-IT', options);
    };
    const isLoggedIn = () => {
        const token = Cookies.get('token');
        return !!token; // Returns true if the token exists, false otherwise
    };

    return (
        <div className="community-post-detail-overlay" onClick={handleOverlayClick}>
            <div className="community-post-detail-content">
                <button className="community-close-button" onClick={onClose}>
                    <X size={24} />
                </button>
                <h2 className="community-post-detail-title">{post.title}</h2>
                <div className="community-post-meta">
                    <div className="community-post-author-info">
                        <User className="icon" size={16} />
                        <span className="community-post-author">{post.author.name}</span>
                    </div>
                    <div className="community-post-date-info">
                        <Calendar className="icon" size={16} />
                        <span className="community-post-date">{formatDate(post.date).split(' alle ')[0]}</span>
                    </div>
                    <div className="community-post-time-info">
                        <Clock className="icon" size={16} />
                        <span className="community-post-time">{formatDate(post.date).split(' alle ')[1]}</span>
                    </div>
                    <div className="community-post-topic-info">
                        <Tag className="icon" size={16} />
                        <span className="community-post-topic">{post.topic}</span>
                    </div>
                </div>
                <p className="community-post-content">{post.content}</p>
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
                        <span>{localComments.length} Commenti</span>
                    </div>
                </div>
                <div className="community-comments">
                    <h3 className="community-comments-title">Commenti</h3>
                    {localComments.map((comment) => (
                        <div key={comment.id} className="community-comment">
                            <div className="community-comment-header">
                                <div>
                                    <strong className="community-comment-author">{comment.author}</strong>
                                    <span className="community-comment-date">{formatDate(comment.date)}</span>
                                </div>
                                {isLoggedIn() && (
                                    <button
                                        className="community-comment-delete"
                                        onClick={() => handleLocalDeleteComment(comment.id)}
                                        aria-label="Elimina commento"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                )}
                            </div>
                            <p className="community-comment-content">{comment.content}</p>
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

const Community = () => {
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

    useEffect(() => {
        const intervalId = setInterval(() => {
            loadPosts();
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(intervalId);
    }, []);

    const loadPosts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedPosts = await api.fetchPosts();
            setPosts(prevPosts => fetchedPosts.map(newPost => {
                const existingPost = prevPosts.find(p => p.id === newPost.id);
                return {
                    ...newPost,
                    liked: existingPost ? existingPost.liked : false,
                    comments: existingPost ? existingPost.comments : newPost.comments
                };
            }));

            // Aggiorna il post selezionato se presente
            if (selectedPost) {
                const updatedSelectedPost = fetchedPosts.find(p => p.id === selectedPost.id);
                if (updatedSelectedPost) {
                    setSelectedPost(prevPost => ({
                        ...updatedSelectedPost,
                        liked: prevPost.liked,
                        comments: prevPost.comments
                    }));
                }
            }
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
            const createdPost = await api.createPost(newPost);
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
            await api.addLike(postId);
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
            const newComment = await api.addComment(postId, comment);

            // Aggiorna immediatamente lo stato locale
            const updatedPosts = posts.map(post =>
                post.id === postId
                    ? { ...post, comments: [...post.comments, newComment] }
                    : post
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

    const handleDeleteComment = async (postId, commentId) => {
        try {
            await api.deleteComment(postId, commentId);
            const updatedPosts = posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        comments: post.comments.filter(comment => comment.id !== commentId)
                    };
                }
                return post;
            });
            setPosts(updatedPosts);
            if (selectedPost && selectedPost.id === postId) {
                setSelectedPost(prevPost => ({
                    ...prevPost,
                    comments: prevPost.comments.filter(comment => comment.id !== commentId)
                }));
            }
        } catch (err) {
            setError("Si è verificato un errore durante l'eliminazione del commento. Riprova più tardi.");
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

                {error && (
                    <div className="community-error">
                        <p>{error}</p>
                        <button onClick={() => setError(null)}>Chiudi</button>
                    </div>
                )}

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
                        onDeleteComment={handleDeleteComment}
                    />
                )}
            </div>
        </div>
    );
};

export default Community;

