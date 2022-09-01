let user = '';

const box = document.querySelector('#chatBox');

const history = document.querySelector('#chatHistory');

const socket = io({
    autoConnect: false
});

Swal.fire({
    title: "Identificate, por favor",
    text: "Ingresa el usuario con el que te vas a identificar en el chat",
    input: "text",
    inputValidator: val => !val && "Debes identificarte para poder continuar",
    allowOutsideClick: false,
    allowEscapeKey: false
}).then(res => {
    user = res.value;
    socket.connect();
});

box.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
        if (box.value.trim().length > 0) {
            socket.emit('message', {
                user,
                msg: box.value
            })
            box.value = '';
        }
        else console.log('Debes ingresar un mensaje')
    }
});

socket.on('ingreso', data => {
    if (user) {
        Swal.fire({
            text: "Hay un nuevo participante",
            toast: true,
            position: "top-right",
            timer: 2000
        })
    }
})

socket.on('log', data => {
    history.innerHTML = "";
    data.forEach (el => {
        let message = `<p><b>${el.user}</b> dice: ${el.msg}</p>`;
        history.innerHTML += `\n${message}`;
    });
});