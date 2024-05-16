import { useEffect, useState } from "react";
import io from "socket.io-client";

//me conecto al backend donde debo habilitar CORS
const PORT = 4000;
const socket = io(`http://localhost:${PORT}`);

//si utilizo proxy en vite.config
//const socket = io("/")

const App = () => {
  const [message, setMessage] = useState(""); //para mensajes recibidos
  const [messages, setMessages] = useState([]); //historico de mensajes

  const handleSubmit = (event) => {
    event.preventDefault();
    const newMessage = {
      body: message,
      from: "Me",
    };
    //envío el mensaje al backend
    setMessages([...messages, newMessage]);
    socket.emit("message", message);
  };

  //escucho los mensajes que me envían
  //el useEffect se mantiene escuchando por eventos de socket
  //a partir del momento en que se carga la aplicación
  useEffect(() => {
    socket.on(
      "message",

      //setMessages([...messages, message]);
      //con esta opción los mensajes se resetean cada vez que
      //recibe un socket -> hay que actualizar el estado anterior
      //en la funcion recivedMessage
      recivedMessage
    );
    //recordar que el return se ejecuta cuando se desmonta el componente
    return () => {
      socket.off("message", recivedMessage);
    };
  }, []);

  const recivedMessage = (message) => {
    //de esta forma preservo el estado anterior
    //y agrego un nuevo mensaje
    setMessages((state) => [...state, message]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {" "}
        <input
          type="text"
          placeholder="Write your message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button>Send</button>
      </form>
      {/*muestro los mensajes*/}
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message.from} : {message.body}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
