import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ThumbsUp, Calendar, User, ArrowLeft, Tag, PlusCircle } from 'lucide-react';
import './css/community.css';

const topics = [
    "Piante da interno",
    "Orto",
    "Giardinaggio urbano",
    "Piante grasse",
    "Fiori",
    "Alberi e arbusti",
    "Compostaggio",
    "Controllo parassiti",
    "Attrezzi e tecniche"
];

const PostCard = ({ post, onPostClick }) => (
    <div className="community-card" onClick={() => onPostClick(post)}>
        <div className="community-card-header">
            <h3 className="community-card-title">{post.title}</h3>
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
        <div className="community-card-content">
            <p>{post.content.substring(0, 150)}...</p>
        </div>
        <div className="community-card-footer">
            <div className="community-card-stats">
                <ThumbsUp className="icon" size={16} />
                <span>{post.likes}</span>
            </div>
            <div className="community-card-stats">
                <MessageSquare className="icon" size={16} />
                <span>{post.comments}</span>
            </div>
        </div>
    </div>
);

const NewPostForm = ({ onPostSubmit }) => {
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
                >
                    <option value="">Seleziona un topic</option>
                    {topics.map((t) => (
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
                ></textarea>
            </div>
            <button type="submit" className="community-btn community-btn-primary">Pubblica</button>
        </form>
    );
};

const PostDetail = ({ post, onClose }) => (
    <div className="community-post-detail-overlay">
        <div className="community-post-detail-content">
            <button className="community-close-button" onClick={onClose}>&times;</button>
            <h2>{post.title}</h2>
            <div className="community-post-meta">
                <User className="icon" size={16} />
                <span>{post.author.name}</span>
                <span className="separator">•</span>
                <Calendar className="icon" size={16} />
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span className="separator">•</span>
                <Tag className="icon" size={16} />
                <span>{post.topic}</span>
            </div>
            <p>{post.content}</p>
            <div className="community-post-stats">
                <div className="community-stat">
                    <ThumbsUp className="icon" size={16} />
                    <span>{post.likes} Mi piace</span>
                </div>
                <div className="community-stat">
                    <MessageSquare className="icon" size={16} />
                    <span>{post.comments} Commenti</span>
                </div>
            </div>
        </div>
    </div>
);

function Community() {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [activeTab, setActiveTab] = useState("posts");
    const [activeTopic, setActiveTopic] = useState("all");

    useEffect(() => {
        // Simula il caricamento dei post da un'API
        const fetchPosts = async () => {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const data = await response.json();
            const formattedPosts = data.slice(0, 10).map(post => ({
                ...post,
                author: {
                    name: 'Utente ' + post.userId,
                    avatar: `https://i.pravatar.cc/150?u=${post.userId}`,
                },
                date: new Date().toISOString(),
                likes: Math.floor(Math.random() * 100),
                comments: Math.floor(Math.random() * 20),
                content: post.body || 'No content available',
                topic: topics[Math.floor(Math.random() * topics.length)],
            }));
            setPosts(formattedPosts);
        };

        fetchPosts();
    }, []);

    const handlePostSubmit = (newPost) => {
        const post = {
            id: posts.length + 1,
            ...newPost,
            author: {
                name: 'Utente Corrente',
                avatar: 'https://i.pravatar.cc/150?u=current',
            },
            date: new Date().toISOString(),
            likes: 0,
            comments: 0,
        };
        setPosts([post, ...posts]);
        setActiveTab("posts");
    };

    const filteredPosts = activeTopic === "all"
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
                        <MessageSquare className="icon" size={20} />
                        Post
                    </button>
                    <button
                        className={`community-tab-button ${activeTab === "new" ? "active" : ""}`}
                        onClick={() => setActiveTab("new")}
                    >
                        <PlusCircle className="icon" size={20} />
                        Nuovo Post
                    </button>
                </div>

                {activeTab === "posts" && (
                    <>
                        <div className="community-topic-filter">
                            <button
                                className={`community-topic-button ${activeTopic === "all" ? "active" : ""}`}
                                onClick={() => setActiveTopic("all")}
                            >
                                Tutti
                            </button>
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
                        <div className="community-posts">
                            {filteredPosts.map((post) => (
                                <PostCard key={post.id} post={post} onPostClick={setSelectedPost} />
                            ))}
                        </div>
                    </>
                )}

                {activeTab === "new" && (
                    <div className="community-new-post-container">
                        <h2>Crea un nuovo post</h2>
                        <NewPostForm onPostSubmit={handlePostSubmit} />
                    </div>
                )}

                {selectedPost && (
                    <PostDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
                )}
            </div>
        </div>
    );
}

export default Community;

