/**
 * Clase controladora de construccion y funcionalidad del Calendario *
 */
class EventManager {
    constructor() {
        this.urlBase = "/schedule";
        this.inicializarFormulario();
        this.obtenerDataInicial();
        this.guardarEvento();
    }

    /** Funcion/Evento para la conversión de fechas Moment */
    crearFechaMomento(fecha) {
        let moment = $.fullCalendar.moment.parseZone(fecha).local().format();
        return moment;
    }

    /** Funcion/Evento para la obtención de los eventos agendados previamente */
    obtenerDataInicial() {
        let urlall = this.urlBase + "/all";
        $.get(urlall, (response) => {
                $(`<div id="useraccount">${response.username}</div>`).appendTo('.headerCalendar').filter(':first');
                this.inicializarCalendario(response.eventos);
            })
            .fail(() => {
                alert('No existe una sessión inicializada ó expiró la sessión!!');
                window.location.href = '../index.html';
            });
    }

    /** Funcion/Evento para el envio y registro de nuevos eventos para agregar al calendario */
    guardarEvento() {
        let urlnew = this.urlBase + "/new";
        $('.addButton').click((evt) => {
            evt.preventDefault();
            let title = $('#titulo').val(),
                start = $('#start_date').val(),
                allday = $('#allDay').prop('checked'),
                end = '',
                start_hour = '',
                end_hour = '',
                ev = {};

            if (title != "" && start != "") {
                if (!allday) {
                    end = $('#end_date').val();
                    start_hour = $('#start_hour').val();
                    end_hour = $('#end_hour').val();
                    start = start + 'T' + start_hour;
                    end = end + 'T' + end_hour;
                    start = this.crearFechaMomento(start);
                    end = this.crearFechaMomento(end);
                    ev = { id: null, title: title, start: start, end: end, allDay: allday };
                } else {
                    start = this.crearFechaMomento(start);
                    ev = { id: null, title: title, start: start, allDay: allday };
                }
                $.post(urlnew, ev, (response) => {
                    ev.id = response.id;
                    $('.calendario').fullCalendar('renderEvent', ev, true);
                }).done((response) => {
                    alert(response.msg);
                }).fail(() => {
                    alert('No existe una sessión inicializada ó expiró la sessión!!');
                    window.location.href = '../index.html';
                });
            } else {
                alert("Complete los campos obligatorios para el evento");
            }
            this.inicializarFormulario();
        });
    }

    /** Funcion/Evento para el borrado de los eventos agregados al calendario */
    eliminarEvento(evento) {
        let eventId = evento.id,
            urldel = this.urlBase + "/delete/";
        $.post(urldel + eventId, (response) => {
            alert(response);
        }).fail(() => {
            alert("No existe una sessión inicializada ó expiró la sessión!!");
            window.location.href = '../index.html';
        });
        $('.calendario').fullCalendar('rerenderEvents');
    }

    /** Funcion/Evento para la actualización y cambios de eventos agregados al calendario */
    actualizarEvento(evento) {
        let start = this.crearFechaMomento(evento.start),
            end = this.crearFechaMomento(evento.end),
            allday = evento.allDay,
            event = {};
        if (!allday) {
            event = { id: evento.id, start: start, end: end };
        } else {
            event = { id: evento.id, start: start };
        }
        console.log(event);
        $.post(this.urlBase + '/update', event, (response) => {
            alert(response);
        }).fail(() => {
            alert("No existe una sessión inicializada ó expiró la sessión!!");
            window.location.href = '../index.html';
        });
    }

    /** Funcion/Evento para la inicialización del Formulario y sus elementos para el registro de eventos al calendario */
    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '7',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#start_date').on('change', function() {
            $('#end_date').val($(this).val());
        });
        $('.timepicker, #end_date').attr("disabled", "disabled");
        $('#allDay').prop('checked', 'checked').on('change', function() {
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled");
            } else {
                $('.timepicker, #end_date').removeAttr("disabled");
            }
        });
        let urlLogout = this.urlBase + '/logout';
        $('#logout').click(function() {
            $.get(urlLogout, function() {
                window.location.href = '../index.html';
            });
        });
    }

    /** Funcion/Evento para la inicialización de la API Fullcalendar y sus eventos de funcionalidad */
    inicializarCalendario(eventos) {
        let now = this.crearFechaMomento(new Date());
        $('.calendario').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,basicDay'
            },
            locale: 'es',
            timezone: 'local',
            nowIndicator: true,
            fixedWeekCount: false,
            aspectRatio: 1.70,
            defaultDate: now,
            navLinks: true,
            eventStartEditable: true,
            eventDurationEditable: false,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            events: eventos,
            eventDrop: (event) => {
                this.actualizarEvento(event);
            },
            eventDragStart: (event, jsEvent) => {
                $('.delete').find('img').attr('src', "../img/trash-open.png");
                $('.delete').css('background-color', '#a70f19');
            },
            eventDragStop: (event, jsEvent) => {
                $('#delete-icon').attr('src', '../img/trash.png');
                $('.delete').css('background-color', '#8B0913');
                var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX <= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                    this.eliminarEvento(event);
                    $('.calendario').fullCalendar('removeEvents', event.id);
                }
            }
        });
    }
}

/**
 * Funcion Ready Document *
 */
$(function() {
    /** Inicialización de Instancia de Objeto para el Calendario */
    const Manager = new EventManager();
});