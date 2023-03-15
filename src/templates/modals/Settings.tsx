import { useContext } from 'react';
import { DexContext, DexContextType } from '../../context';
import { Modal, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import Hints from '../dex/components/Hints';

export function SettingsModal() {
    const {
        slippage,
        updateSlippage,
    } = useContext(DexContext) as DexContextType;

    return (
        <div className="modal fade" id="SettingsModal" tabIndex={-1} aria-hidden="true">
                <Modal.Dialog centered className="mobile-modal-bottom">
                <Modal.Header data-bs-dismiss="modal" aria-label="Close" closeButton>
                    <Modal.Title>Settings</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="fw-500 fs-18 text-muted mb-4">
                            Slippage tolerance
                            <Hints
                                show="top"
                                text={(
                                    <>
                                        Your transaction will revert it the price changes unfavorably by more than this percentage.
                                    </>
                                )}
                                content={(<i className="fa-regular fa-circle-question fs-16 ms-2" />)}
                            />
                        </div>
                        <Row className="align-items-center">
                            <Col xs={4} lg={3} className="order-2 order-lg-1 mb-2 mb-lg-0">
                                <a
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => updateSlippage(0.1)}
                                    className={`btn w-100 px-3 ${slippage === 0.1 ? 'btn-primary' : 'btn-light'}`}
                                >
                                    0,1%
                                </a>
                            </Col>
                            <Col xs={4} lg={3} className="order-3 order-lg-2 mb-2 mb-lg-0">
                                <a
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => updateSlippage(0.5)}
                                    className={`btn w-100 px-3 ${slippage === 0.5 ? 'btn-primary' : 'btn-light'}`}
                                >
                                    0,5%
                                </a>
                            </Col>
                            <Col xs={4} lg={3} className="order-4 order-lg-3 mb-2 mb-lg-0">
                                <a
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => updateSlippage(1)}
                                    className={`btn w-100 px-3 ${slippage === 1 ? 'btn-primary' : 'btn-light'}`}
                                >
                                    1%
                                </a>
                            </Col>
                            <Col md={12} lg={3} className="order-1 order-lg-4 ">
                                <InputGroup className="mb-3 mb-sm-0">
                                    <Form.Control
                                        type="number"
                                        className="text-center fw-500"
                                        min={0.1}
                                        max={99.9}
                                        step={0.1}
                                        style={{ height: '50px' }}
                                        onChange={(event) => updateSlippage(parseFloat(event.target.value))}
                                        required={![0.1, 0.5, 1].includes(slippage)}
                                        placeholder={`${slippage}`}
                                    />
                                    <InputGroup.Text className="ps-1 pe-3">
                                        <i className="fa-solid fa-percent"></i>
                                    </InputGroup.Text>
                                </InputGroup>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal.Dialog>
        </div>
    );
}
