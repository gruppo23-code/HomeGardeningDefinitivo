import React, {useEffect} from "react";

//import Stepper from 'bs-stepper';

function Stepper(props) {
    return (
        <div className="bs-stepper">
            <div className="bs-stepper-header" role="tablist">
                <div className="step" data-target="#logins-part">
                    <button type="button" className="step-trigger" role="tab" aria-controls="logins-part"
                            id="logins-part-trigger">
                        <span className="bs-stepper-circle">1</span>
                        <span className="bs-stepper-label">Logins</span>
                    </button>
                </div>
                <div className="line"></div>
                <div className="step" data-target="#information-part">
                    <button type="button" className="step-trigger" role="tab" aria-controls="information-part"
                            id="information-part-trigger">
                        <span className="bs-stepper-circle">2</span>
                        <span className="bs-stepper-label">Various information</span>
                    </button>
                </div>
            </div>
            <div className="bs-stepper-content">
                <div id="logins-part" className="content" role="tabpanel" aria-labelledby="logins-part-trigger"></div>
                <div id="information-part" className="content" role="tabpanel"
                     aria-labelledby="information-part-trigger"></div>
            </div>
        </div>
    )
}

export default Stepper;