import React, {useEffect, useRef, useState} from 'react';
import {Calendar, Edit2, Leaf, Mail, MapPin, Phone, ShoppingBag, User} from 'lucide-react';
import {Link} from 'react-router-dom';
import {Carousel} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import gardenImg from '../assets/img/Garden.jpg';
import axios from "axios";
import profileTemplate from '../assets/img/profile-circle.svg';

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
    const fileInputRef = useRef(null);
    const [img, setImg] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState("");
    const [editingBio, setEditingBio] = useState("");
    const [userInfo, setUserInfo] = useState({
        recentPurchases: [],
        personalizedTips: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Caricamento biografia
        const fetchBio = async () => {
            try {
                const response = await axios.get("http://localhost:8081/visualizzabio");
                setBio(response.data);
            } catch (error) {
                console.error("Errore nel caricamento della biografia:", error);
            }
        };

        // Caricamento informazioni profilo
        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://localhost:8081/visualizzaprofilo");
                setUserInfo(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Errore nel caricamento del profilo:", error);
                setLoading(false);
            }
        };

        const fetchImg = async () => {
            try {
                const response = await axios.get("http://localhost:8081/visualizzaimgprofilo");
                if (response.data.img) {
                    console.log(response.data.img);
                    const base64String = btoa(String.fromCharCode(...new Uint8Array(response.data.img.data)));
                    setImg(`data:image/jpg;base64,${base64String}`);
                }
                if (response.data.img == null) {
                    setImg(profileTemplate);
                }
            } catch (error) {
                console.error("Errore nel caricamento dell'immagine profilo: ", error);
            }
        }

        // Esecuzione dei caricamenti
        fetchBio();
        fetchProfile();
        fetchImg();
    }, []);
    console.log(img);
    // Gestore del cambio biografia in modalità modifica
    const handleBioChange = (e) => {
        setEditingBio(e.target.value);
    };

    // Attivazione/disattivazione modalità modifica
    const toggleEditing = () => {
        if (!isEditing) {
            // Quando si entra in modalità modifica, inizializza editingBio
            setEditingBio(bio);
        }
        setIsEditing(!isEditing);
    };

    // Invio della nuova biografia al server
    const invioBio = async () => {
        try {
            await axios.post('http://localhost:8081/cambiabio', { bio: editingBio });
            // Aggiorna lo stato della biografia
            setBio(editingBio);
            setIsEditing(false);
        } catch (error) {
            console.error('Errore durante l\'aggiornamento della biografia:', error);
            alert('Impossibile salvare la biografia. Riprova.');
        }
    };

    // Gestore del salvataggio
    const handleSave = () => {
        invioBio();
        window.location.reload();
    };

    // Schermata di caricamento
    if (loading) {
        return (
            <div className="flex justify-center items-center h-full w-full">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }



    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Estrai il file selezionato
        if (file) {
            const formData = new FormData();
            formData.append('img', file); // Usa il file selezionato
            //console.log(file);
            console.log(formData.get('img'));
            axios.post('http://localhost:8081/cambiaimmagineprofilo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    window.location.reload(); // Ricarica la pagina dopo il successo
                })
                .catch(error => {
                    console.log(error); // Gestisci eventuali errori
                });
        }
        window.location.reload();
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
                                <div>
                                    <img
                                        src={img}
                                        alt={userInfo.name}
                                        className="rounded-circle mb-3"
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            objectFit: 'cover',
                                            cursor: 'pointer'
                                        }}
                                        onClick={handleImageClick}
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{display: 'none'}}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                    {/* Div cliccabile per mostrare il cursore */}
                                    <div
                                        onClick={handleImageClick}
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            cursor: 'pointer',
                                            position: 'absolute',
                                            top: '0',
                                            left: '0'
                                        }}
                                    />
                                </div>
                                <h2 className="card-title" style={{fontWeight: 600}}>{userInfo.name}</h2>
                                <p className="text-muted mb-3">
                                    <MapPin className="me-1" size={18}/>
                                    {userInfo.location}
                                </p>
                                <div className="d-flex justify-content-center mb-3">
                                    <span className="badge" style={{backgroundColor: '#43a047', color: 'white'}}>
                                        <Calendar className="me-1" size={14}/>
                                        Iscritto da {userInfo.joinDate}
                                    </span>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><Mail className="me-2" size={18}/> {userInfo.email}
                                    </li>
                                    <li className="list-group-item"><Phone className="me-2" size={18}/> {userInfo.phone}
                                    </li>
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
                                <h3 className="mb-0 d-flex align-items-center" style={{fontWeight: 600}}>
                                    <User className="me-2" size={24}/>
                                    Chi sono
                                </h3>
                            </div>
                            <div className="card-body" style={{ padding: '20px' }}>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 style={{ fontWeight: 600, color: '#2e7d32' }}>Biografia</h4>
                                    <button
                                        className="btn btn-outline-success"
                                        style={{
                                            borderColor: '#2e7d32',
                                            color: '#2e7d32',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={isEditing ? handleSave : toggleEditing}
                                    >
                                        <Edit2 size={20} className="me-2" />
                                        {isEditing ? 'Salva' : 'Modifica'}
                                    </button>
                                </div>
                                {isEditing ? (
                                    <textarea
                                        className="form-control mb-4"
                                        value={editingBio}
                                        onChange={handleBioChange}
                                        rows="5"
                                        style={{
                                            borderColor: '#4caf50',
                                            color: '#333333',
                                            fontSize: '1.1rem',
                                            fontWeight: 500,
                                            fontFamily: fontFamily
                                        }}
                                    />
                                ) : (
                                    <p className="mb-4" style={{
                                        color: '#333333',
                                        fontSize: '1.1rem',
                                        lineHeight: '1.6',
                                        fontWeight: 500
                                    }}>
                                        {bio}
                                    </p>
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

