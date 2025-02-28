import { useState } from "react";
import Script from "next/script";

const PaymentForm = () => {
    const [status, setStatus] = useState("");
    
    const handlePayment = () => {
        const kushki = new Kushki({
            merchantId: "9b13dce397014457b7eda369b813052e",
            inTestEnvironment: true,
        });

        kushki.requestToken({
            amount: 10,
            currency: "USD",
            card: {
                name: "John Doe",
                number: "4111111111111111",
                cvv: "123",
                expiryMonth: "12",
                expiryYear: "25",
            },
        }, async (response) => {
            if (response.token) {
                const res = await fetch("http://localhost:4000/charge", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: response.token, amount: 10 }),
                });
                const data = await res.json();
                setStatus(data.approved ? "Pago aprobado" : "Pago rechazado");
            } else {
                setStatus("Error obteniendo el token");
            }
        });
    };

    return (
        <div>
            <Script src="https://cdn.kushkipagos.com/kushki.js" strategy="beforeInteractive" />
            <button onClick={handlePayment}>Pagar</button>
            <p>{status}</p>
        </div>
    );
};

export default PaymentForm;
