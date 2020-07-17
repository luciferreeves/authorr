$(document).ready(function () {
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
    })
    function showError(heading, message) {
        const { remote } = window.require('electron')
        const dialog = remote.dialog
        dialog.showErrorBox(heading, message);
    }
    function start(id) {
        alert('This would start the ' + id + ' template');
    }
})