class EventManager {
    constructor() {
        this.urlBase = "/schedule";
        this.inicializarFormulario();
        this.obtenerDataInicial();
        this.guardarEvento();
    }

    obtenerDataInicial() {
        let urlall = this.urlBase + "/all";
        $.get(urlall, (response) => {
                console.log(response);
                $(`<div id="useraccount">${response.username}</div>`).appendTo('.headerCalendar').filter(':first');
                this.inicializarCalendario(response.eventos);
            })
            .fail(() => {
                alert('No existe una sessión inicializada!!');
                window.location.href = '../index.html';
            });
    }

    eliminarEvento(evento) {
        let eventId = evento.id,
            urldel = this.urlBase + "/delete/";
        $.post(urldel + eventId, { id: eventId }, (response) => {
            alert(response);
        });
    }

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
                    ev = { id: null, title: title, start: start, end: end, allDay: allday };
                } else {
                    ev = { id: null, title: title, start: start, allDay: allday };
                }
                $.post(urlnew, ev, (response) => {
                    ev.id = response.id;
                    $('.calendario').fullCalendar('renderEvent', ev);
                }).done((response) => {
                    alert(response.msg);
                }).fail(() => {
                    alert('No existe una sessión inicializada!!');
                    window.location.href = '../index.html';
                });
            } else {
                alert("Complete los campos obligatorios para el evento");
            }
            this.inicializarFormulario();
        });
    }

    actualizarEvento(evento) {
        let start = moment(evento.start).format('YYYY-MM-DD HH:mm:ss'),
            end = moment(evento.end).format('YYYY-MM-DD HH:mm:ss'),
            allday = evento.allDay,
            start_date,
            end_date,
            start_hour,
            end_hour,
            event = {};
        start_date = start.substr(0, 10);
        if (!allday) {
            end_date = end.substr(0, 10);
            start_hour = start.substr(11, 8);
            end_hour = end.substr(11, 8);
            event = { identievt: evento.id, dbeginevt: start_date, datendevt: end_date, tbeginevt: start_hour, timendevt: end_hour };
        } else {
            event = { identievt: evento.id, dbeginevt: start_date };
        }
        $.post(this.urlBase + '/update' + evento.id, event, (response) => {
            alert(data.msg);
        });
    }

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

    inicializarCalendario(eventos) {
        let now = new Date().toISOString();
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
            defaultDate: now.substr(0, 10),
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

$(function() {
    const Manager = new EventManager();
});