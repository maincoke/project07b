class EventManager {
    constructor() {
        this.urlBase = "/schedule";
        this.inicializarFormulario();
        this.obtenerDataInicial();
        this.guardarEvento();
    }

    obtenerDataInicial() {
        let url = this.urlBase + "/all";
        $.get(url, (response) => {
            this.inicializarCalendario(response);
        });
    }

    eliminarEvento(evento) {
        let eventId = evento.id;
        $.post(this.urlBase + '/delete/' + eventId, { id: eventId }, (response) => {
            alert(response);
        });
    }

    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            ev.preventDefault();
            let title = $('#titulo').val(),
                start = $('#start_date').val(),
                end = '',
                start_hour = '',
                end_hour = '';

            if (!$('#allDay').prop('checked')) {
                end = $('#end_date').val();
                start_hour = $('#start_hour').val();
                end_hour = $('#end_hour').val();
                start = start + 'T' + start_hour;
                end = end + 'T' + end_hour;
            }
            if (title != "" && start != "") {
                let ev = {
                    title: title,
                    start: start,
                    end: end
                };
                $.post(this.urlBase + "/new", ev, (response) => {
                    alert(response);
                });
                $('.calendario').fullCalendar('renderEvent', ev);
            } else {
                alert("Complete los campos obligatorios para el evento");
            }
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
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function() {
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled");
            } else {
                $('.timepicker, #end_date').removeAttr("disabled");
            }
        });
        $('#logout').click(function() {
            $('#delete-icon').attr('src', '../img/trash-open.png');
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
            fixedWeekCount: false,
            defaultDate: now.substr(0, 10),
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            events: eventos,
            eventDrop: (event) => {
                this.actualizarEvento(event);
            },
            eventDragStart: (event, jsEvent) => {
                $('.delete').find('img').attr('src', "img/trash-open.png");
                $('.delete').css('background-color', '#a70f19');
            },
            eventDragStop: (event, jsEvent) => {
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