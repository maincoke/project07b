class SignupUser {
    constructor() {
        this.initSignUp();
    }

    validDataUser() {
        let siblings = $('.modal-row input');
        if ($(siblings[0]).val() != '' && $(siblings[1]).val() != '' && $(siblings[2]).val() != '' &&
            $(siblings[3]).val() != '' && $(siblings[4]).val() != '' && $(siblings[5]).val() != '' && $(siblings[6]).prop('checked')) {
            $('.modal-row button').removeAttr('disabled');
        } else {
            $('.modal-row button').attr('disabled', 'disabled');
        }
    }

    sendUserData(evt) {
        evt.preventDefault();
        if ($('#usrpasswd').val() !== $('#useragain').val() ||
            (!$('#usremaila').val().includes('@') || !$('#usremaila').val().includes('.'))) {
            let wrongData = $('#usrpasswd').val() !== $('#useragain').val() ? true : false;
            $('#signupuser').dialog('close');
            if (wrongData) {
                alert('Las contraseña y la confirmación no coinciden!! Deben ser iguales!!');
            } else {
                alert('La dirección de correo electrónico no es válido!!');
            }
        } else {
            $.post("/schedule/newuser", (response) => {
                alert(responde);
            });
        }
    }

    initSignUp() {
        $('#usrdbirth').datepicker({
            firstDay: 1,
            minDate: new Date(1940, 0, 1),
            dateFormat: 'dd/mm/yy',
            altFormat: 'yy-mm-dd',
            autoSize: true,
            showOtherMonths: true,
            selectOtherMonths: true,
            nextText: 'Siguiente',
            prevText: 'Anterior',
            closeText: 'Cerrar'
        });
        $('#signupuser').dialog({
            title: 'Registro - Datos de Usuario',
            modal: true,
            autoOpen: false,
            draggable: false,
            closeText: 'Cerrar',
            width: 800,
            close: function(evt, ui) {
                $('.modal-row').find('input').val('').removeAttr('checked');
            }
        });
        $('#signuplink').click(function(evt) {
            evt.preventDefault();
            $('#signupuser').dialog('open');
        });
        $('#termsconds').change(this.validDataUser);
        $('.modal-row input').focus(this.validDataUser);
        $('#signupuser form').submit(this.sendUserData);
    }

}

$(function() {
    $('.loginButton').click(function(event) {
        event.preventDefault();
        let nombreUsuario = $('#user').val();
        let passwd = $('#pass').val();
        console.log(nombreUsuario + ' ' + passwd);
        if (nombreUsuario != "" && passwd != "") {
            $.post('/schedule/login', { user: nombreUsuario, pass: passwd }, function(response) {
                if (response == "Validado") {
                    window.location.href = "http://localhost:3000/main.html";
                }
            });
        } else {
            alert("Debe completar las credenciales!!");
        }
    });
    const newUser = new SignupUser();
});