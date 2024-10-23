import React from 'react';
import { OverlayTrigger, Popover as BootstrapPopover } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Popover({ title, content, contentLink, placement, show }) {
    const popover = (
        <BootstrapPopover id="popover-basic" d-flex={false}>
            <BootstrapPopover.Header as="h3">{title}</BootstrapPopover.Header>
            <BootstrapPopover.Body>
                {content}
                <Link to="/?showModal=true">{contentLink}</Link>
            </BootstrapPopover.Body>
        </BootstrapPopover>
    );

    return (
        <OverlayTrigger
            trigger="manual"
            placement={placement}
            overlay={popover}
            show={show} // Gestisci la visibilità qui
        >
            {/* Elemento visibile per attivare il popover */}
            <span style={{ display: 'inline-block', width: '0px', height: '0px', visibility: 'visible' }} />
        </OverlayTrigger>
    );
}

export default Popover;
