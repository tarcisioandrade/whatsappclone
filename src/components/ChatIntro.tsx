import "./ChatIntro.css";

const ChatIntro = () => {
  return (
    <div className="chatIntro">
      <img
        className="chatIntro--img"
        src="https://imagensemoldes.com.br/wp-content/uploads/2020/04/Pokebola-Pok%C3%A9mon-PNG-1024x1022.png"
        alt=""
      />
      <h1>Mantenha seu celular conectado</h1>
      <h2>
        O whatsapp conecta ao seu telefone para sicronizar suas mensagens.
        <br />
        Para reduzir o uso de dados, conecte seu telefone a um Wi-Fi
      </h2>
    </div>
  );
};

export default ChatIntro;
