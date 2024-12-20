import React, {useEffect, useState} from 'react';
import { Eye, EyeOff, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '../Components/Alert2';
import './css/register.css';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        username: '',
        location: '',
        bio: ''
    });

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    });

    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [comuni, setComuni] = useState([]);

    useEffect(() => {
        const fetchComuni = async () => {
            try {
                const res = await axios.get("http://localhost:8081/getcomuni");
                setComuni(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchComuni();
    }, []);
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = 'auto';
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'location') {
            setFormData(prev => ({
                ...prev,
                locationName: value,
                location: '' // Resetta l'ISTAT quando l'utente digita
            }));
            searchLocations(value);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const searchLocations = (query) => {
        const filteredLocations = comuni
            .filter(loc => loc.comune.toLowerCase().includes(query.toLowerCase()));
        setLocationSuggestions(query ? filteredLocations : []);
    };

    const selectLocation = (location) => {
        setFormData(prev => ({
            ...prev,
            location: location.istat.toString(), // Salva l'ISTAT
            locationName: location.comune // Mostra il nome del comune
        }));
        setLocationSuggestions([]);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Il nome è obbligatorio';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Il cognome è obbligatorio';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email è obbligatoria';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Inserisci un\'email valida';
        }

        if (!formData.password) {
            newErrors.password = 'La password è obbligatoria';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La password deve essere di almeno 8 caratteri';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Conferma la password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Le password non coincidono';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Lo username è obbligatorio';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'La località è obbligatoria';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await axios.post('http://localhost:8081/registrazione', {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    username: formData.username,
                    location: formData.location,
                    bio: formData.bio
                });

                setAlert({
                    type: 'success',
                    message: 'Registrazione avvenuta con successo!'
                });

                setTimeout(() => {
                    setIsLoading(false);
                    navigate('/');
                }, 2000);

            } catch (error) {
                setAlert({
                    type: 'danger',
                    message: error.response?.data?.message || 'Errore durante la registrazione'
                });
                setIsLoading(false);
            }
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className="register-container font-secondary">
            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}
            <div className="register-card">
                <div className="text-center mb-5">
                    <h2 className="font-primary mb-3">Registrazione</h2>
                    <p className="text-muted lead">
                        Unisciti alla nostra community di appassionati del verde!
                        Registrati ora per accedere a consigli personalizzati,
                        monitorare le tue piante e condividere la tua passione per il giardinaggio.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="firstName" className="form-label">Nome *</label>
                            <input
                                type="text"
                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="lastName" className="form-label">Cognome *</label>
                            <input
                                type="text"
                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email *</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password *</label>
                        <div className="input-group">
                            <input
                                type={showPassword.password ? "text" : "password"}
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => togglePasswordVisibility('password')}
                            >
                                {showPassword.password ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </button>
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Conferma Password *</label>
                        <div className="input-group">
                            <input
                                type={showPassword.confirmPassword ? "text" : "password"}
                                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => togglePasswordVisibility('confirmPassword')}
                            >
                                {showPassword.confirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </button>
                            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Telefono</label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username *</label>
                        <input
                            type="text"
                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="location" className="form-label">Località *</label>
                        <div className="location-search-container">
                            <div className="input-group">
                    <span className="input-group-text">
                        <Search size={20}/>
                    </span>
                                <input
                                    type="text"
                                    className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                                    id="location"
                                    name="location"
                                    value={formData.locationName} // Usa locationName invece di location
                                    onChange={handleInputChange}
                                    placeholder="Cerca la tua città..."
                                    required
                                />
                                {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                            </div>
                            {locationSuggestions.length > 0 && (
                                <ul className="location-suggestions">
                                    {locationSuggestions.map((location) => (
                                        <li
                                            key={location.istat}
                                            onClick={() => selectLocation(location)}
                                            className="location-suggestion-item"
                                        >
                                            {location.comune}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="bio" className="form-label">Bio</label>
                        <textarea
                            className="form-control"
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Raccontaci qualcosa di te..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success w-100"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"
                                      aria-hidden="true"></span>
                                Registrazione in corso...
                            </>
                        ) : (
                            'Registrati'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;

