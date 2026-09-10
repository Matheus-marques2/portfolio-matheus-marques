function enviarWhats(event){
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const mensagem = document.getElementById("mensagem").value;
  const telefone = '5581987538386';

  const texto = `Ola, me chamo ${nome}, ${mensagem}`;
  const msgFormatada = encodeURIComponent(texto);

  const url = `https://wa.me/${telefone}/?text=${msgFormatada}`;

  window.open(url, '_blank');
}










