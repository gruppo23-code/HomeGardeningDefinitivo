import React, { useState } from 'react';
import { MapPin, Calendar, Mail, Phone, User, ShoppingBag, Edit2, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const fontFamily = "'Poppins', 'Roboto', sans-serif";

const carouselStyle = `
    .carousel-inner {
        border-radius: 10px;
    }
    .carousel-item {
        transition: transform 0.6s ease-in-out;
    }
`;

const Profilo = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState("Appassionata di giardinaggio urbano. Amo coltivare erbe aromatiche e verdure sul mio balcone. Sempre alla ricerca di nuovi consigli per rendere il mio spazio più verde!");

    const userInfo = {
        name: "Maria Rossi",
        location: "Milano, Italia",
        joinDate: "Maggio 2022",
        email: "maria.rossi@example.com",
        phone: "+39 123 456 7890",
        recentPurchases: [
            { id: 1, name: "Set di attrezzi da giardinaggio", date: "15/05/2023", price: "€29.99" },
            { id: 2, name: "Semi di pomodoro biologici", date: "02/05/2023", price: "€4.50" },
            { id: 3, name: "Vaso in terracotta 20cm", date: "28/04/2023", price: "€12.00" },
        ],
        username: "maria_rossi",
        registrationDate: "15/05/2022",
        plants: [
            { id: 1, name: "Basilico", health: "Ottima" },
            { id: 2, name: "Pomodori ciliegini", health: "Buona" },
            { id: 3, name: "Lavanda", health: "Discreta" },
        ],
        personalizedTips: [
            "Ricordati di annaffiare il basilico regolarmente, ma evita di bagnare le foglie.",
            "I pomodori amano il sole diretto. Assicurati che ricevano almeno 6 ore di luce al giorno.",
            "La lavanda preferisce terreni ben drenati. Aggiungi della sabbia al terreno per migliorare il drenaggio.",
            "Prova a potare le erbe aromatiche regolarmente per stimolare una crescita più folta.",
            "Ruota le tue piante di un quarto di giro ogni settimana per garantire una crescita uniforme.",
            "Le piante grasse richiedono pochissima acqua: annaffiale solo quando il terreno è completamente asciutto.",
            "Posiziona le piante d'appartamento lontano da correnti d'aria e fonti di calore per evitare stress termici.",
            "Usa il caffè avanzato come fertilizzante naturale: è ricco di azoto e benefico per le piante acidofile come le ortensie.",
            "I peperoncini crescono meglio in vasi piccoli con terriccio ben drenato. Non dimenticare di tenerli al sole.",
            "Aggiungi uno strato di pacciamatura al terreno dei tuoi vasi per trattenere l'umidità durante l'estate.",
            "Controlla le foglie delle piante una volta a settimana per identificare tempestivamente eventuali parassiti.",
            "Le piante aromatiche come il rosmarino preferiscono terreni poveri e ben drenati. Evita di fertilizzarle troppo.",
            "Rimuovi regolarmente i fiori appassiti dalle tue piante per incoraggiarne di nuovi e prolungare la fioritura.",
            "Durante i periodi caldi, annaffia le piante la mattina presto per ridurre l'evaporazione e migliorare l'assorbimento.",
            "Se hai poco spazio, prova a coltivare fragole in vasi sospesi o verticali: sono belle e facili da curare.",
            "Il timo è una pianta rustica che cresce bene anche in terreni sassosi. Annaffialo solo quando il terreno è asciutto.",
            "Ruota i vasi delle piante d'appartamento ogni due settimane per favorire una crescita omogenea e simmetrica.",
            "Le erbe aromatiche come la menta crescono rapidamente: tienile in un vaso separato per evitare che invadano altre piante.",
            "Usa l'acqua di cottura delle verdure, raffreddata, per annaffiare le piante: contiene nutrienti utili per la loro crescita.",
            "Se coltivi piante in balcone, considera di aggiungere dei supporti per proteggerle dal vento forte."
        ]
    };

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
                                    {userInfo.recentPurchases.map((purchase) => (
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
                                src="https://via.placeholder.com/400x200?text=Le+Mie+Piante"
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

