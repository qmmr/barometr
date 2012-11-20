require.config({
  shim: {
  },

  paths: {
    jquery: 'vendor/jquery.min'
  }
});

require(['barometr'], function(barometr) {
    'use strict';

    $(function() {
        var options = {
          ajaxOptions: {
            url: '../app/poll.php'
            // ,headers: {
            //     'X-REQUESTED-BY': 'barometr'
            // }
          }
        };
        $('.barometr').barometr(options);
    });
});
