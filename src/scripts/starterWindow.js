const remote = require('electron').remote;

$(document).ready(function () {
    var monitorWidth = screen.width;
    var monitorHeight = screen.height;

    $('.nav-group').on('click', 'span', function () {
        $('.nav-group span.active').removeClass('active');
        $(this).addClass('active');
    });
    $('.templateIcon').click(function (e) {
        $('.template .templateIcon').removeClass('clicked');
        $('.template .templateName span').removeClass('clickedText');
        $(this).addClass('clicked');
        var parentId = ($(this).parent().attr('id'));
        $('#' + parentId + ' .templateName span').addClass('clickedText')
        e.stopPropagation()
    })
    $(document).on("click", function (e) {
        if ($(e.target).is(".templateIcon, .templateName span") === false) {
            $('.template .templateIcon').removeClass('clicked');
            $('.template .templateName span').removeClass('clickedText');
        }
    });
    $('#startSelected').click(function () {
        if ($('.template .templateIcon').hasClass('clicked')) {
            var parentId = ($('.clicked').parent().attr('id'));
            start(parentId);
        }
        else {
            showError('No Template Selected!', 'No template was selected. Please Select a template to get started!')
        }
    });
    $('#cancelSelected').click(function () {
        var window = remote.getCurrentWindow();
        window.close();
    });
    function showError(heading, message) {
        const { remote } = window.require('electron')
        const dialog = remote.dialog
        dialog.showErrorBox(heading, message);
    }
    function start(id) {
        var templateURL = 'file://' + __dirname + `/templates/${id}/template.html`;
        var window = remote.getCurrentWindow();

        window.setSize(monitorWidth * 0.75, monitorHeight * 0.75, false);
        window.center();
        window.loadURL(templateURL);
    }
})