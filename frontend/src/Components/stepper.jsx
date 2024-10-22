import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Stepper from 'bs-stepper';

const StepperComponent = () => {
    const stepperRef = useRef(null);
    const stepperInstance = useRef(null);

    useEffect(() => {
        stepperInstance.current = new Stepper(stepperRef.current);
    }, []);

    return (
        <div className="bs-stepper" ref={stepperRef}>
            <div className="bs-stepper-header" role="tablist">
                <div className="step" data-target="#email-part">
                    <button type="button" className="step-trigger" role="tab" aria-controls="email-part" id="email-part-trigger">
                        <span className="bs-stepper-circle">1</span>
                        <span className="bs-stepper-label">Email</span>
                    </button>
                </div>
                <div className="line"></div>
                <div className="step" data-target="#name-part">
                    <button type="button" className="step-trigger" role="tab" aria-controls="name-part" id="name-part-trigger">
                        <span className="bs-stepper-circle">2</span>
                        <span className="bs-stepper-label">Nome</span>
                    </button>
                </div>
                <div className="line"></div>
                <div className="step" data-target="#surname-part">
                    <button type="button" className="step-trigger" role="tab" aria-controls="surname-part" id="surname-part-trigger">
                        <span className="bs-stepper-circle">3</span>
                        <span className="bs-stepper-label">Cognome</span>
                    </button>
                </div>
                <div className="line"></div>
                <div className="step" data-target="#password-part">
                    <button type="button" className="step-trigger" role="tab" aria-controls="password-part" id="password-part-trigger">
                        <span className="bs-stepper-circle">4</span>
                        <span className="bs-stepper-label">Password</span>
                    </button>
                </div>
            </div>
            <div className="bs-stepper-content">
                <div id="email-part" className="content" role="tabpanel" aria-labelledby="email-part-trigger">
                    <h3>Inserisci Email</h3>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" id="email" required />
                        </div>
                        <button className="btn btn-primary" type="button" onClick={() => stepperInstance.current.next()}>
                            Avanti
                        </button>
                    </form>
                </div>
                <div id="name-part" className="content" role="tabpanel" aria-labelledby="name-part-trigger">
                    <h3>Inserisci Nome</h3>
                    <form>
                        <div className="form-group">
                            <label htmlFor="name">Nome</label>
                            <input type="text" className="form-control" id="name" required />
                        </div>
                        <button className="btn btn-primary" type="button" onClick={() => stepperInstance.current.previous()}>
                            Indietro
                        </button>
                        <button className="btn btn-primary" type="button" onClick={() => stepperInstance.current.next()}>
                            Avanti
                        </button>
                    </form>
                </div>
                <div id="surname-part" className="content" role="tabpanel" aria-labelledby="surname-part-trigger">
                    <h3>Inserisci Cognome</h3>
                    <form>
                        <div className="form-group">
                            <label htmlFor="surname">Cognome</label>
                            <input type="text" className="form-control" id="surname" required />
                        </div>
                        <button className="btn btn-primary" type="button" onClick={() => stepperInstance.current.previous()}>
                            Indietro
                        </button>
                        <button className="btn btn-primary" type="button" onClick={() => stepperInstance.current.next()}>
                            Avanti
                        </button>
                    </form>
                </div>
                <div id="password-part" className="content" role="tabpanel" aria-labelledby="password-part-trigger">
                    <h3>Inserisci Password</h3>
                    <form>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" required />
                        </div>
                        <button className="btn btn-primary" type="button" onClick={() => stepperInstance.current.previous()}>
                            Indietro
                        </button>
                        <button className="btn btn-success" type="submit">
                            Registrati
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StepperComponent;
