/*
 * barometr
 * https://github.com/qmmr/barometr
 *
 * Copyright (c) 2012 Marcin Kumorek
 * Licensed under the MIT license.
 */

;(function($) {

  var defaults = {
    question: 'Who is better?'
    ,formClass: 'barometr'
    ,buttonText: 'Submit'
  };

  var Barometr = function (element, options) {
    var barometr = this;
    // extend defaults object
    barometr.config = $.extend(true, {}, defaults, options);
    barometr.element = element;
    barometr.element.on('submit', function (e) {
      e.preventDefault();
      console.log('submit');
      var jqxhr = $.ajax({
        url: 'server.php'
        ,type: 'POST'
        ,contentType: 'application/json; charset-utf-8'
        ,data: JSON.stringify({selected: barometr.element.find(':checked').val()})
        ,dataType: 'json'
      });
      jqxhr.done(function(data) {
        // do something with data
      });

      barometr.element.width(barometr.element.width()).height(barometr.element.height()).find('form').remove();
    });
    barometr.init();
  };

  Barometr.prototype.init = function() {
    var h1       = $('<h1/>', {text: this.config.question}).appendTo(this.element);
    var form     = $('<form>').addClass(this.config.formClass).appendTo(this.element);
    var yes      = $('<input>', {type: 'radio', name: 'radio', id: 'yesRadio'}).appendTo(form);
    var yesLabel = $('<label>', {text: 'Yes', attr: 'for=yesRadio'}).appendTo(form);
    var no       = $('<input>', {type: 'radio', name: 'radio', id: 'noRadio'}).appendTo(form);
    var noLabel  = $('<label>', {text: 'no', attr: 'for=noRadio'}).appendTo(form);
    var button   = $('<button>', {text: this.config.buttonText}).appendTo(form);
  };

  $.fn.barometr = function(options) {
    var barometr = new Barometr(this.first(), options);
    return this.first();
  };
}(jQuery));
