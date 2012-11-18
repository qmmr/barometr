/*
 * barometr
 * https://github.com/qmmr/barometr
 *
 * Copyright (c) 2012 Marcin Kumorek
 * Licensed under the MIT license.
 */

;(function($) {
  'use strict';
  var defaults = {
    question    : 'Coca-Cola or Pepsi?'
    ,formId     : 'barometrForm'
    ,formClass  : 'barometrForm'
    ,buttonText : 'Submit'
    ,ajaxOptions: {
      url          : 'server.php'
      ,type        : 'POST'
      ,dataType    : 'json'
      ,contentType : 'application/json; charset-utf-8'
    }
    ,beforeAjax: function (el) {
      console.log('beforeAjax', el);
    }
    ,created: function(el) {
      el.fadeIn(500);
    }
  };

  var Barometr = function (element, options) {
    // store 'this' in a variable
    var barometr = this;
    // extend defaults object (deep)
    barometr.config = $.extend(true, {}, defaults, options);
    // reference to jQuery object on which the plugin has been used
    barometr.element = element;

    // attach 'submit' event to the jQuery element
    barometr.element.on('submit', function (e) {
      e.preventDefault();

      console.log('submit');
      // store data in object so that we can extend ajaxOptions and pass it to $.ajax
      var dataContainer = {
        data: JSON.stringify({selected: barometr.element.find(':checked').val()})
      };
      var ajaxSettings = $.extend({}, barometr.config.ajaxOptions, dataContainer);
      // run the pre ajax function
      barometr.element.trigger('beforeAjax.barometr');
      // send AJAX
      var jqxhr = $.ajax(ajaxSettings);
      // success
      jqxhr.done(function(data) {
        // do something with data
        console.log(data);
      });

      barometr.element.width(barometr.element.width()).height(barometr.element.height()).find('form').remove();
    });

    // chcheck if any callback functions are in the config
    $.each(barometr.config, function(key, val) {
      if (typeof val === 'function') {
        barometr.element.on(key + '.barometr', function() {
          val(barometr.element);
        });
      }
    });
    barometr.init();
  };

  Barometr.prototype.init = function() {
    var h1       = $('<h1/>', {text: this.config.question}).appendTo(this.element);
    var form     = $('<form>', {method: 'POST', action: '/', id: this.config.formId, class: this.config.formClass}).appendTo(this.element);
    var yes      = $('<input>', {type: 'radio', name: 'radio', id: 'yesRadio'}).appendTo(form);
    var yesLabel = $('<label>', {text: 'Yes', attr: 'for=yesRadio'}).appendTo(form);
    var no       = $('<input>', {type: 'radio', name: 'radio', id: 'noRadio'}).appendTo(form);
    var noLabel  = $('<label>', {text: 'no', attr: 'for=noRadio'}).appendTo(form);
    var button   = $('<button>', {text: this.config.buttonText}).appendTo(form);
    this.element.trigger('created.barometr');
  };

  $.fn.barometr = function(options) {
    console.log('inside barometr');
    new Barometr(this.first(), options);
    return this.first();
  };
}(jQuery));
