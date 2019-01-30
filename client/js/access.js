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
            if (wrongData) {
                alert('Las contraseña y la confirmación no coinciden!! Deben ser iguales!!');
            } else {
                alert('La dirección de correo electrónico no es válido!!');
            }
        } else {
            let newuser = {
                user_names: $('#usrfnames').val() + ' ' + $('#usrlnames').val(),
                user_dbirt: $('#usrdbirth').val(),
                user_email: $('#usremaila').val(),
                user_pword: $('#usrpasswd').val()
            }
            $.post("/schedule/newuser", newuser, (response) => {
                alert(response.msg);
                console.log(response.id);
            });
        }
        $('#signupuser').dialog('close');
    }

    initSignUp() {
        let lowdate = new Date(new Date().getFullYear() - 90, 0, 1),
            highdate = new Date(new Date().getFullYear() - 10, 11, 31);
        $('#usrdbirth').datepicker({
            firstDay: 1,
            minDate: lowdate,
            maxDate: highdate,
            defaultDate: highdate,
            dateFormat: 'yy-mm-dd',
            altFormat: 'yy-mm-dd',
            autoSize: true,
            showOtherMonths: true,
            nextText: 'Siguiente',
            prevText: 'Anterior',
            closeText: 'Cerrar',
            dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            changeYear: true,
            changeMonth: true,
            yearRange: lowdate.getFullYear().toString() + ":" + highdate.getFullYear().toString(),
            gotoCurrent: true
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
        if (nombreUsuario != "" && passwd != "") {
            $.post('/schedule/login', { user: nombreUsuario, pass: passwd }, function(response) {
                if (response.access == "ok") {
                    $('#user, #pass').val('');
                    window.location.href = "http://localhost:3000/main.html";
                } else {
                    alert(response.msg);
                    $('#user, #pass').val('');
                }
            });
        } else {
            alert("Debe completar las credenciales!!");
        }
    });
    const newUser = new SignupUser();
});