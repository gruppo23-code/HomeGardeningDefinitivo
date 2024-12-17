import React, { useState } from 'react';
import { MapPin, Calendar, Mail, Phone, User, ShoppingBag, Edit2 } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profilo = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState("Appassionata di giardinaggio urbano. Amo coltivare erbe aromatiche e verdure sul mio balcone. Sempre alla ricerca di nuovi consigli per rendere il mio spazio più verde!");

    // Questi dati sarebbero normalmente recuperati da un'API
    const userInfo = {
        name: "Filippo Turetta",
        location: "Milano, Italia",
        joinDate: "Maggio 2022",
        email: "maria.rossi@example.com",
        phone: "+39 123 456 7890",
        recentPurchases: [
            { id: 1, name: "Set di attrezzi da giardinaggio", date: "15/05/2023", price: "€29.99" },
            { id: 2, name: "Semi di pomodoro biologici", date: "02/05/2023", price: "€4.50" },
            { id: 3, name: "Vaso in terracotta 20cm", date: "28/04/2023", price: "€12.00" },
        ],
        username: "filip_turets",
        registrationDate: "15/05/2022",
    };

    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="profile-page" style={{
            backgroundColor: '#e8f5e9',
            minHeight: '100vh',
            padding: '3rem 0',
            fontFamily: "'Poppins', 'Roboto', sans-serif"
        }}>
            <div className="container-fluid px-4">
                <div className="row g-4">
                    {/* Colonna sinistra - Informazioni profilo */}
                    <div className="col-lg-3">
                        <div className="card h-100 shadow">
                            <div className="card-body text-center">
                                <img src="https://citynews-veneziatoday.stgy.ovh/~media/horizontal-low/56294647864321/turetta.jpeg" alt={userInfo.name}
                                     className="rounded-circle mb-4 shadow"
                                     style={{width: '200px', height: '200px', objectFit: 'cover'}}/>

                                <h2 className="card-title mb-3" style={{ fontWeight: 600 }}>{userInfo.name}</h2>
                                <p className="card-text text-muted mb-4 fs-5">
                                    <MapPin className="me-2" size={24}/>
                                    {userInfo.location}
                                </p>
                                <ul className="list-group list-group-flush fs-6">
                                    <li className="list-group-item py-2">
                                        <Calendar className="me-2" size={20} />
                                        Iscritto da {userInfo.joinDate}
                                    </li>
                                    <li className="list-group-item py-2">
                                        <Mail className="me-2" size={20} />
                                        {userInfo.email}
                                    </li>
                                    <li className="list-group-item py-2">
                                        <Phone className="me-2" size={20} />
                                        {userInfo.phone}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Colonna centrale - Chi sono e Informazioni utente */}
                    <div className="col-lg-5">
                        <div className="card shadow h-100">
                            <div className="card-header bg-white">
                                <h3 className="mb-0" style={{ fontWeight: 600 }}>
                                    <User className="me-2" size={24} />
                                    Chi sono
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="card-title" style={{ fontWeight: 600 }}>Biografia</h4>
                                    <button className="btn btn-outline-success" onClick={toggleEditing}>
                                        <Edit2 size={20} className="me-2" />
                                        {isEditing ? 'Salva' : 'Modifica'}
                                    </button>
                                </div>
                                {isEditing ? (
                                    <textarea
                                        className="form-control mb-4 fs-5"
                                        value={bio}
                                        onChange={handleBioChange}
                                        rows="5"
                                        style={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}
                                    />
                                ) : (
                                    <p className="card-text mb-5 fs-5">{bio}</p>
                                )}
                                <div className="mt-5">
                                    <h4 className="mb-4" style={{ fontWeight: 600 }}>Informazioni utente</h4>
                                    <ul className="list-group fs-6">
                                        <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                            <span>Username</span>
                                            <strong>{userInfo.username}</strong>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                            <span>Membro da</span>
                                            <strong>{userInfo.registrationDate}</strong>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colonna destra - Acquisti recenti */}
                    <div className="col-lg-4">
                        <div className="card shadow h-100">
                            <div className="card-header bg-white">
                                <h3 className="mb-0" style={{ fontWeight: 600 }}>
                                    <ShoppingBag className="me-2" size={24} />
                                    Acquisti recenti
                                </h3>
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush fs-6">
                                    {userInfo.recentPurchases.map((purchase) => (
                                        <li key={purchase.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                                            <div>
                                                <h5 className="mb-1" style={{ fontWeight: 600 }}>{purchase.name}</h5>
                                                <small className="text-muted">{purchase.date}</small>
                                            </div>
                                            <span className="badge bg-success rounded-pill">{purchase.price}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className="btn btn-outline-success btn-lg w-100 mt-4" style={{ fontWeight: 500 }}>Vedi tutti gli acquisti</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profilo;

