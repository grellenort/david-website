import React, {useState} from "react";
import {Accordion, Button, Col, Form, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {GenericFetchClient} from "../common/GenericFetchClient";
import {ROUTES} from "../../App.tsx";
import {Order, PaymentType} from "./model/Order.ts";
import {useBasket} from "../basket/BasketContext.tsx";
import BasketListComponent from "../basket/BasketList.tsx";

let baseUrl = "https://waldashop.herokuapp.com/api";
const orderClient = new GenericFetchClient(baseUrl);

const CheckoutComponent = () => {
    const {state} = useBasket();
    const [orderData, setOrderData] = useState<Order>({
        email: "",
        paymentType: PaymentType.CREDIT_CARD,
        items: state.items.map(item => ({
            productUrl: item.product.url,
            count: item.quantity,
        })),
        billingAddress: {
            firstName: "",
            lastName: "",
            phone: "",
            street: "",
            streetNumber: "TODO",
            city: "",
            zipCode: "",
            country: "",
            note: "",
        },
        shippingAddress: {
            firstName: "",
            lastName: "",
            phone: "",
            street: "",
            streetNumber: "TODO",
            city: "",
            zipCode: "",
            country: "",
            note: "",
        },
        billingAsShipping: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeKey, setActiveKey] = useState<string | null>("0"); // Track active accordion item
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const {name, value} = event.target;
        const [section, field] = name.split('.'); // For nested keys like 'billingAddress.firstName'

        setOrderData((prevData) => {
            if (field) {
                // Nested key
                return {
                    ...prevData,
                    [section]: {
                        ...prevData[section],
                        [field]: value,
                    },
                };
            } else {
                // Top-level key
                return {
                    ...prevData,
                    [name]: value,
                };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await orderClient.post("/orders", {data: orderData});
            console.log("Order created successfully", response);
            navigate(ROUTES.ORDER_CONFIRMATION);
        } catch (error) {
            setError("Failed to create the order.");
        } finally {
            setLoading(false);
        }
    };

    const handleNextAccordion = (section: string) => {
        if (section === "shipping") {
            setActiveKey("1"); // Move to the next section (billing)
        } else if (section === "billing") {
            setActiveKey("2"); // Move to the next section (payment)
        } else if (section === "payment") {
            setActiveKey("3"); // Final section
        }
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
                <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
                    {/* Basket Section Accordion */}
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Your Basket</Accordion.Header>
                        <Accordion.Body>
                            <BasketListComponent/>
                            <Button onClick={() => handleNextAccordion("shipping")} variant="primary"
                                    disabled={loading || Object.keys(formErrors).length > 0}>
                                Next
                            </Button>
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* Shipping and Billing Address */}
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Shipping Address</Accordion.Header>
                        <Accordion.Body>
                            <Row className="mb-3 align-items-center">
                                <Col md={3}><label htmlFor="email">Email</label></Col>
                                <Col md={9}>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        placeholder="Email"
                                        value={orderData.email}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["email"] && <div className="text-danger">{formErrors["email"]}</div>}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={3}><label htmlFor="firstName">First Name</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstName"
                                        name="shippingAddress.firstName"
                                        value={orderData.shippingAddress.firstName}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["firstName"] &&
                                        <div className="text-danger">{formErrors["firstName"]}</div>}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={3}><label htmlFor="lastName">Last Name</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        name="shippingAddress.lastName"
                                        value={orderData.shippingAddress.lastName}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["lastName"] &&
                                        <div className="text-danger">{formErrors["lastName"]}</div>}
                                </Col>
                            </Row>
                            {/* Additional Fields for Shipping Address */}
                            <Row className="mb-3">
                                <Col md={3}><label htmlFor="phone">Phone</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phone"
                                        name="shippingAddress.phone"
                                        value={orderData.shippingAddress.phone}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["phone"] && <div className="text-danger">{formErrors["phone"]}</div>}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={3}><label htmlFor="street">Street</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="street"
                                        name="shippingAddress.street"
                                        value={orderData.shippingAddress.street}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["street"] && <div className="text-danger">{formErrors["street"]}</div>}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={3}><label htmlFor="city">City</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="city"
                                        name="shippingAddress.city"
                                        value={orderData.shippingAddress.city}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["city"] && <div className="text-danger">{formErrors["city"]}</div>}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={3}><label htmlFor="zipCode">Zip Code</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="zipCode"
                                        name="shippingAddress.zipCode"
                                        value={orderData.shippingAddress.zipCode}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["zipCode"] &&
                                        <div className="text-danger">{formErrors["zipCode"]}</div>}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={3}><label htmlFor="country">Country</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="country"
                                        name="shippingAddress.country"
                                        value={orderData.shippingAddress.country}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["country"] &&
                                        <div className="text-danger">{formErrors["country"]}</div>}
                                </Col>
                            </Row>
                            <Button onClick={() => handleNextAccordion("billing")} variant="primary"
                                    disabled={loading || Object.keys(formErrors).length > 0}>
                                Next
                            </Button>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Billing Address</Accordion.Header>
                        <Accordion.Body>
                            <Row className="mb-3 align-items-center">
                                <Col md={3}><label htmlFor="billingFirstName">First Name</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="billingFirstName"
                                        name="billingAddress.firstName"
                                        value={orderData.billingAddress.firstName}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["billingFirstName"] && (
                                        <div className="text-danger">{formErrors["billingFirstName"]}</div>
                                    )}
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={3}><label htmlFor="billingLastName">Last Name</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="billingLastName"
                                        name="billingAddress.lastName"
                                        value={orderData.billingAddress.lastName}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["billingLastName"] && (
                                        <div className="text-danger">{formErrors["billingLastName"]}</div>
                                    )}
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={3}><label htmlFor="billingPhone">Phone</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="billingPhone"
                                        name="billingAddress.phone"
                                        value={orderData.billingAddress.phone}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["billingPhone"] && (
                                        <div className="text-danger">{formErrors["billingPhone"]}</div>
                                    )}
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={3}><label htmlFor="billingStreet">Street</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="billingStreet"
                                        name="billingAddress.street"
                                        value={orderData.billingAddress.street}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["billingStreet"] && (
                                        <div className="text-danger">{formErrors["billingStreet"]}</div>
                                    )}
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={3}><label htmlFor="billingCity">City</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="billingCity"
                                        name="billingAddress.city"
                                        value={orderData.billingAddress.city}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["billingCity"] && (
                                        <div className="text-danger">{formErrors["billingCity"]}</div>
                                    )}
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={3}><label htmlFor="billingZipCode">Zip Code</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="billingZipCode"
                                        name="billingAddress.zipCode"
                                        value={orderData.billingAddress.zipCode}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["billingZipCode"] && (
                                        <div className="text-danger">{formErrors["billingZipCode"]}</div>
                                    )}
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={3}><label htmlFor="billingCountry">Country</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="billingCountry"
                                        name="billingAddress.country"
                                        value={orderData.billingAddress.country}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors["billingCountry"] && (
                                        <div className="text-danger">{formErrors["billingCountry"]}</div>
                                    )}
                                </Col>
                            </Row>

                            <Button onClick={() => handleNextAccordion("payment")} variant="primary"
                                    disabled={loading || Object.keys(formErrors).length > 0}>
                                Next
                            </Button>
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* Payment Section */}
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>Payment</Accordion.Header>
                        <Accordion.Body>
                            <Row className="mb-3">
                                <Col md={3}><label htmlFor="paymentType">Payment Type</label></Col>
                                <Col md={9}>
                                    <select
                                        id="paymentType"
                                        className="form-select"
                                        name="paymentType"
                                        value={orderData.paymentType}
                                        onChange={handleInputChange}
                                    >
                                        <option value="CREDIT_CARD">Credit Card</option>
                                        <option value="BANK_TRANSFER">Bank Transfer</option>
                                    </select>
                                    {formErrors["paymentType"] &&
                                        <div className="text-danger">{formErrors["paymentType"]}</div>}
                                </Col>
                            </Row>
                            <Button type="submit" variant="success"
                                    disabled={loading || Object.keys(formErrors).length > 0}>
                                {loading ? "Processing..." : "Submit Order"}
                            </Button>

                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Form>
        </div>
    );
};

export default CheckoutComponent;