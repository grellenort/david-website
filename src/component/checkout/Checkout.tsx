import React, {useState} from "react";
import {Accordion, Button, Col, Form, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {GenericFetchClient} from "../common/GenericFetchClient";
import {getBasket} from "../basket/BasketSingleton";
import {ROUTES} from "../../App.tsx";

// Create an instance of the GenericFetchClient
let baseUrl = "https://waldashop.herokuapp.com/api";
const orderClient = new GenericFetchClient(baseUrl);

const CheckoutComponent = () => {
    const [orderData, setOrderData] = useState({
        email: "",
        paymentType: "CREDIT_CARD", // Example, can be extended
        items: getBasket().map(item => ({
            productUrl: item.product.url,
            count: item.quantity,
        })),
        billingAddress: {
            firstName: "",
            lastName: "",
            phone: "",
            street: "",
            streetNumber: "",
            city: "",
            zipCode: "",
            country: "",
            note: "",
        },
        shippingAddress: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            street: "",
            streetNumber: "",
            city: "",
            zipCode: "",
            country: "",
            note: "",
        },
        billingAsShipping: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            // Handle response, navigate to a success page
            console.log("Order created successfully", response);
            navigate(ROUTES.ORDER_CONFIRMATION);
        } catch (error) {
            setError("Failed to create the order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
                <Accordion defaultActiveKey="0">
                    {/* Shipping and Billing Address */}
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Shipping & Billing Address</Accordion.Header>
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
                                </Col>
                            </Row>
                            {/* Shipping Address */}
                            <h5>Shipping Address</h5>
                            <Row className="mb-3 align-items-center">
                                <Col md={3}><label htmlFor="shippingFirstName">First Name</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="shippingFirstName"
                                        name="shippingAddress.firstName"
                                        placeholder="First Name"
                                        value={orderData.shippingAddress.firstName}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-3 align-items-center">
                                <Col md={3}><label htmlFor="shippingLastName">Last Name</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="shippingLastName"
                                        name="shippingAddress.lastName"
                                        placeholder="Last Name"
                                        value={orderData.shippingAddress.lastName}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-3 align-items-center">
                                <Col md={3}><label htmlFor="shippingPhone">Phone</label></Col>
                                <Col md={9}>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="shippingPhone"
                                        name="shippingAddress.phone"
                                        placeholder="Phone"
                                        value={orderData.shippingAddress.phone}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-3 align-items-center">
                                <Col md={3}><label htmlFor="shippingStreet">Street</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="shippingStreet"
                                        name="shippingAddress.street"
                                        placeholder="Street"
                                        value={orderData.shippingAddress.street}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-3 align-items-center">
                                <Col md={3}><label htmlFor="shippingStreetNumber">Street Number</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="shippingStreetNumber"
                                        name="shippingAddress.streetNumber"
                                        placeholder="Street Number"
                                        value={orderData.shippingAddress.streetNumber}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-3 align-items-center">
                                <Col md={3}><label htmlFor="shippingCity">City</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="shippingCity"
                                        name="shippingAddress.city"
                                        placeholder="City"
                                        value={orderData.shippingAddress.city}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-3 align-items-center">
                                <Col md={3}><label htmlFor="shippingZipCode">Zip Code</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="shippingZipCode"
                                        name="shippingAddress.zipCode"
                                        placeholder="Zip Code"
                                        value={orderData.shippingAddress.zipCode}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-3 align-items-center">
                                <Col md={3}><label htmlFor="shippingCountry">Country</label></Col>
                                <Col md={9}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="shippingCountry"
                                        name="shippingAddress.country"
                                        placeholder="Country"
                                        value={orderData.shippingAddress.country}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Row>

                            {/* Billing Address */}
                            <h5 className="mt-4">Billing Address</h5>
                            <Row className="mb-3 align-items-center">
                                <Col md={12}>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="billingAsShipping"
                                            name="billingAsShipping"
                                            checked={orderData.billingAsShipping}
                                            onChange={(e) =>
                                                setOrderData({...orderData, billingAsShipping: e.target.checked})
                                            }
                                        />
                                        <label className="form-check-label" htmlFor="billingAsShipping">
                                            Same as shipping address
                                        </label>
                                    </div>
                                </Col>
                            </Row>
                            {/* Repeat billing address fields */}
                            {!orderData.billingAsShipping && (
                                <>
                                    <h5 className="mt-4">Billing Address</h5>
                                    <Row className="mb-3 align-items-center">
                                        <Col md={3}><label htmlFor="billingFirstName">First Name</label></Col>
                                        <Col md={9}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="billingFirstName"
                                                name="billingAddress.firstName"
                                                placeholder="First Name"
                                                value={orderData.billingAddress.firstName}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 align-items-center">
                                        <Col md={3}><label htmlFor="billingLastName">Last Name</label></Col>
                                        <Col md={9}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="billingLastName"
                                                name="billingAddress.lastName"
                                                placeholder="Last Name"
                                                value={orderData.billingAddress.lastName}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 align-items-center">
                                        <Col md={3}><label htmlFor="billingPhone">Phone</label></Col>
                                        <Col md={9}>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="billingPhone"
                                                name="billingAddress.phone"
                                                placeholder="Phone"
                                                value={orderData.billingAddress.phone}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 align-items-center">
                                        <Col md={3}><label htmlFor="billingStreet">Street</label></Col>
                                        <Col md={9}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="billingStreet"
                                                name="billingAddress.street"
                                                placeholder="Street"
                                                value={orderData.billingAddress.street}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 align-items-center">
                                        <Col md={3}><label htmlFor="billingStreetNumber">Street Number</label></Col>
                                        <Col md={9}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="billingStreetNumber"
                                                name="billingAddress.streetNumber"
                                                placeholder="Street Number"
                                                value={orderData.billingAddress.streetNumber}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 align-items-center">
                                        <Col md={3}><label htmlFor="billingCity">City</label></Col>
                                        <Col md={9}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="billingCity"
                                                name="billingAddress.city"
                                                placeholder="City"
                                                value={orderData.billingAddress.city}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 align-items-center">
                                        <Col md={3}><label htmlFor="billingZipCode">Zip Code</label></Col>
                                        <Col md={9}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="billingZipCode"
                                                name="billingAddress.zipCode"
                                                placeholder="Zip Code"
                                                value={orderData.billingAddress.zipCode}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 align-items-center">
                                        <Col md={3}><label htmlFor="billingCountry">Country</label></Col>
                                        <Col md={9}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="billingCountry"
                                                name="billingAddress.country"
                                                placeholder="Country"
                                                value={orderData.billingAddress.country}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* Payment Section */}
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Payment</Accordion.Header>
                        <Accordion.Body>
                            <Row className="mb-3 align-items-center">
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
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <div className="d-flex justify-content-end mt-3">
                    <Button variant="secondary" type="reset">
                        Reset
                    </Button>
                    <Button variant="success" type="submit" disabled={loading} className="ml-3">
                        {loading ? "Processing..." : "Submit Order"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CheckoutComponent;