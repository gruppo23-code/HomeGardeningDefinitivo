import React, {useEffect, useState} from 'react';
import { MapPin, Calendar, Mail, Phone, User, ShoppingBag, Edit2, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import gardenImg from '../assets/img/Garden.jpg';
import axios from "axios";

const fontFamily = "'Poppins', 'Roboto', sans-serif";

const carouselStyle = `
    .carousel-inner {
        border-radius: 10px;
    }
    .carousel-item {
        transition: transform 0.6s ease-in-out;
    }
`;

const Profilo  =  () => {
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState("Appassionata di giardinaggio urbano. Amo coltivare erbe aromatiche e verdure sul mio balcone. Sempre alla ricerca di nuovi consigli per rendere il mio spazio più verde!");

    const [userInfo, setUserInfo] = useState({ recentPurchases: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8081/visualizzaprofilo")
            .then((response) => {
                setUserInfo(response.data); // Assegna i dati a userInfo
                setLoading(false); // Imposta loading a false
            })
            .catch((error) => {
                console.log(error);
                setLoading(false); // Imposta loading a false anche in caso di errore
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Mostra un messaggio di caricamento
    }

    console.log(userInfo.recentPurchases);


    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    <style>{carouselStyle}</style>

    return (
        <div className="profile-page" style={{
            backgroundColor: '#f1f8e9',
            minHeight: '100vh',
            padding: '2rem 0',
            fontFamily: fontFamily
        }}>
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-4 mb-4">
                        <div className="card shadow-sm" style={{ borderColor: '#2e7d32', borderRadius: '15px', overflow: 'hidden', height: '100%', fontFamily: fontFamily }}>
                            <div className="card-body text-center">
                                <img src="https://via.placeholder.com/150" alt={userInfo.name}
                                     className="rounded-circle mb-3"
                                     style={{width: '150px', height: '150px', objectFit: 'cover'}}/>
                                <h2 className="card-title" style={{ fontWeight: 600 }}>{userInfo.name}</h2>
                                <p className="text-muted mb-3">
                                    <MapPin className="me-1" size={18}/>
                                    {userInfo.location}
                                </p>
                                <div className="d-flex justify-content-center mb-3">
                                    <span className="badge" style={{ backgroundColor: '#43a047', color: 'white' }}>
                                        <Calendar className="me-1" size={14} />
                                        Iscritto da {userInfo.joinDate}
                                    </span>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><Mail className="me-2" size={18} /> {userInfo.email}</li>
                                    <li className="list-group-item"><Phone className="me-2" size={18} /> {userInfo.phone}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8 mb-4">
                        <div className="card shadow-sm" style={{
                            borderColor: '#2e7d32',
                            borderRadius: '15px',
                            overflow: 'hidden',
                            height: '100%',
                            backgroundColor: '#ffffff',
                            fontFamily: fontFamily
                        }}>
                            <div className="card-header bg-success text-white" style={{
                                backgroundColor: '#2e7d32',
                                color: 'white',
                                borderBottom: '2px solid #1b5e20',
                                padding: '15px'
                            }}>
                                <h3 className="mb-0 d-flex align-items-center" style={{ fontWeight: 600 }}>
                                    <User className="me-2" size={24} />
                                    Chi sono
                                </h3>
                            </div>
                            <div className="card-body" style={{ padding: '20px' }}>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 style={{ fontWeight: 600, color: '#2e7d32' }}>Biografia</h4>
                                    <button className="btn btn-outline-success" style={{
                                        borderColor: '#2e7d32',
                                        color: '#2e7d32',
                                        transition: 'all 0.3s ease'
                                    }} onClick={toggleEditing}>
                                        <Edit2 size={20} className="me-2" />
                                        {isEditing ? 'Salva' : 'Modifica'}
                                    </button>
                                </div>
                                {isEditing ? (
                                    <textarea
                                        className="form-control mb-4"
                                        value={bio}
                                        onChange={handleBioChange}
                                        rows="5"
                                        style={{ borderColor: '#4caf50', color: '#333333', fontSize: '1.1rem', fontWeight: 500, fontFamily: fontFamily }}
                                    />
                                ) : (
                                    <p className="mb-4" style={{ color: '#333333', fontSize: '1.1rem', lineHeight: '1.6', fontWeight: 500 }}>{bio}</p>
                                )}
                                <h4 className="mb-3" style={{ fontWeight: 600, color: '#2e7d32' }}>Informazioni utente</h4>
                                <ul className="list-group mb-4">
                                    <li className="list-group-item d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f1f8e9', border: 'none', marginBottom: '5px', borderRadius: '5px' }}>
                                        <span style={{ color: '#333333', fontSize: '1rem', fontWeight: 500 }}>Username</span>
                                        <strong style={{ color: '#333333', fontSize: '1rem', fontWeight: 600 }}>{userInfo.username}</strong>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f1f8e9', border: 'none', borderRadius: '5px' }}>
                                        <span style={{ color: '#333333', fontSize: '1rem', fontWeight: 500 }}>Membro da</span>
                                        <strong style={{ color: '#333333', fontSize: '1rem', fontWeight: 600 }}>{userInfo.registrationDate}</strong>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-4">
                        <div className="card shadow-sm" style={{ borderColor: '#2e7d32', borderRadius: '15px', overflow: 'hidden', height: '100%', fontFamily: fontFamily }}>
                            <div className="card-header bg-success text-white" style={{ backgroundColor: '#2e7d32', color: 'white', borderBottom: '2px solid #1b5e20' }}>
                                <h3 className="mb-0" style={{ fontWeight: 600 }}>
                                    <ShoppingBag className="me-2" size={24} />
                                    Acquisti recenti
                                </h3>
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    {userInfo.recentPurchases.slice(0, 3).map((purchase) => (
                                        <li key={purchase.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-0" style={{ fontWeight: 600 }}>{purchase.name}</h6>
                                                <small className="text-muted">{purchase.date}</small>
                                            </div>
                                            <span className="badge bg-success rounded-pill">{purchase.price}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className="btn btn-outline-success w-100 mt-3" style={{ borderColor: '#2e7d32', color: '#2e7d32' }}>Vedi tutti gli acquisti</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-4">
                        <div className="card shadow-sm" style={{ borderColor: '#2e7d32', borderRadius: '15px', overflow: 'hidden', height: '100%', fontFamily: fontFamily }}>
                            <img
                                src={gardenImg}
                                className="card-img-top"
                                alt="Le Mie Piante"
                                style={{height: '200px', objectFit: 'cover'}}
                            />
                            <div className="card-body text-center">
                                <h3 className="card-title" style={{ fontWeight: 600 }}>
                                    <Leaf className="me-2" size={24}/>
                                    Le mie piante
                                </h3>
                                <Link to="/dashboard" className="btn btn-success mt-2" style={{ backgroundColor: '#43a047', borderColor: '#2e7d32' }}>
                                    Gestisci le tue piante
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-4">
                        <div className="card shadow-sm" style={{ borderColor: '#2e7d32', borderRadius: '15px', overflow: 'hidden', height: '100%', fontFamily: fontFamily }}>
                            <div className="card-header bg-success text-white" style={{ backgroundColor: '#2e7d32', color: 'white', borderBottom: '2px solid #1b5e20' }}>
                                <h3 className="mb-0" style={{ fontWeight: 600 }}>Consigli personalizzati</h3>
                            </div>
                            <div className="card-body d-flex flex-column justify-content-between" style={{ backgroundColor: '#e8f5e9', padding: '20px' }}>
                                <Carousel
                                    controls={false}
                                    indicators={false}
                                    interval={5000}
                                    pause={false}
                                >
                                    {userInfo.personalizedTips.map((tip, index) => (
                                        <Carousel.Item key={index}>
                                            <div className="d-flex align-items-center justify-content-center" style={{ height: '200px', overflow: 'hidden' }}>
                                                <p className="text-center mb-0" style={{ color: '#1b5e20', fontSize: '1.1rem', lineHeight: '1.5', fontWeight: 500 }}>{tip}</p>
                                            </div>
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profilo;

