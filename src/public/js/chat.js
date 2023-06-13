const socket = io()
socket.emit('message', 'Hola, me estoy comunicando con un websocket!')

const input = document.getElementById('textoEntrada')
const log = document.getElementById('log')

const getSession = async () => {
  const resp = await fetch(`http://localhost:9090/api/sessions/current`, {
    method: 'GET',
  })

  const jsonData = await resp.json()
  console.log(jsonData)
  window.currentuser = jsonData.user.email
}
window.onload = getSession()
//Parte dos: Guardar mensajes por socketid.
input.addEventListener('keyup', (evt) => {
  if (evt.key === 'Enter') {
    socket.emit('message2', input.value)
    input.value = ''
  }
})
socket.on('log', (data) => {
  let logs = ''
  data.logs.forEach((log) => {
    logs += `${window.currentuser} dice: ${log.message}<br/>`
  })
  log.innerHTML = logs
})
