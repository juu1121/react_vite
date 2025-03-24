import React from 'react';
import { Button, Modal } from 'react-bootstrap';

/*
    show : Modal을 띄울지 여부 (boolean타입)
    message : Modal의 메세지 (String타입)
    onYes : Modal의 확인 버튼을 눌렀을때 호출될 함수 (function타입)
*/
function AlertModal({show, message, onYes}) {

    return (
        <Modal show={show}>
            <Modal.Header>알림</Modal.Header>
            <Modal.Body>
                {message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='success' onClick={onYes}>확인인</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AlertModal;