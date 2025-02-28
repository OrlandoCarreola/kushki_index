import { useState } from "react";

function App() {
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    try {
      const kushki = new window.Kushki({ merchantId: "9b13dce397014457b7eda369b813052e", inTestEnvironment: true });
      kushki.requestToken({
        card: {
          name: card.name,
          number: card.number,
          expiryMonth: card.expiry.split("/")[0],
          expiryYear: card.expiry.split("/")[1],
          cvc: card.cvv,
        },
      }, async (response) => {
        if (response.token) {
          const res = await fetch("https://kushki-server.onrender.com/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: response.token, amount: 10 }),
          });
          const data = await res.json();
          setMessage(data.approved ? "Pago exitoso" : "Pago rechazado");
        } else {
          setMessage("Error al obtener el token");
        }
      });
    } catch (error) {
      setMessage("Error en la transacción");
    }
  };

  return (
    <div>
      <h2>Formulario de Pago</h2>
      <input type="text" placeholder="Número de tarjeta" onChange={(e) => setCard({ ...card, number: e.target.value })} />
      <input type="text" placeholder="Nombre" onChange={(e) => setCard({ ...card, name: e.target.value })} />
      <input type="text" placeholder="MM/YY" onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
      <input type="text" placeholder="CVV" onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
      <button onClick={handlePayment}>Pagar</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
