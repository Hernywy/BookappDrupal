// Change data column password with asterisk
(function ($) {
    Drupal.behaviors.td_ui = {
        attach: function (context, settings) {
        $('td.hiddenPassword').each(function() {
            var password = $(this).text();
            $(this).text('********');
        });
        }
    };
    })(jQuery);

// Modify type text input to password for id="edit-field-contrasena-0-value"
(function ($) {
    Drupal.behaviors.td_ui = {
        attach: function (context, settings) {
        $('#edit-field-contrasena-0-value').attr('type', 'password');
        }
    };
    })(jQuery);