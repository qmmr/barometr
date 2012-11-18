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
        $('.barometr').barometr();
    });
});
