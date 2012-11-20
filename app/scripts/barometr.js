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
    question      : 'What is your favorite programming language?'
    ,answers      : ['JavaScript', 'Ruby', 'PHP', 'Java', 'Python', 'C', 'C++', 'C#']
    ,formId       : 'barometrForm'
    ,formClass    : 'barometrForm'
    ,errorMessage : 'Houston... we\'ve got problem...'
    ,errorClass   : 'error'
    ,buttonText   : 'Submit'
    ,ajaxOptions: {
      url          : 'poll.php'
      ,type        : 'POST'
      ,dataType    : 'json'
      // ,contentType : 'application/json'
    }
    ,beforeAjax: function (e, el, data) {
      // console.log('beforeAjax', data);
    }
    ,ajaxDone: function (e, el, data) {
      // console.log('data ajaxDone', data);
    }
    ,created: function(e, el) {
      el.fadeIn(500);
    }
    ,responseError: function (e, el, xhr) {
      // console.log('responseError', el, xhr);
      // return false;
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

      // store data in object so that we can extend ajaxOptions and pass it to $.ajax
      var dataContainer = {
        data: {answers: barometr.config.answers}
        // data: JSON.stringify({answers: barometr.config.answers})
        // data: JSON.stringify({selected: barometr.element.find(':checked').val()})
      };
      // extend default ajaxOptions with data
      var ajaxSettings = $.extend(true, {}, barometr.config.ajaxOptions, dataContainer);
      // run the pre ajax function
      barometr.element.trigger('beforeAjax.barometr', dataContainer);
      // send AJAX
      var jqxhr = $.ajax(ajaxSettings);
      // success
      jqxhr.done(function(data) {
        // console.log('data in done', data);
        // trigger custom function
        barometr.element.trigger('ajaxDone.barometr', data);
        // process received data
        barometr.processData(data);
      });

      // fail
      jqxhr.fail(function(data) {
        var returnVal = barometr.element.triggerHandler('responseError.barometr', data);
        // if return value from responseError is falsy we run default action
        if (!returnVal) {
          $('<p>', {
            text: barometr.config.errorMessage,
            class: barometr.config.errorClass
          }).appendTo(barometr.element);
        }
      });

      barometr.element.width(barometr.element.width()).height(barometr.element.height()).find('form').hide();
    });

    // chcheck if any callback functions are in the config
    $.each(barometr.config, function(key, val) {
      if (typeof val === 'function') {
        barometr.element.on(key + '.barometr', function(e, params) {
          return val(e, barometr.element, params);
        });
      }
    });
    barometr.init();
  };

  Barometr.prototype.init = function() {
    $('<h1/>', {
      text: this.config.question
    }).appendTo(this.element);

    var form     = $('<form>', {
      method: 'POST'
      ,action: '/'
      ,id: this.config.formId
      ,class: this.config.formClass
    }).appendTo(this.element);

    var i, len, answers = this.config.answers;
    for (i = 0, len = answers.length; i < len; i += 1) {
      $('<input>', {
        type: 'radio'
        ,name: 'radio'
        ,id: 'answer#' + i
      }).appendTo(form);

      $('<label>', {
        text: answers[i]
        ,"for": 'answer#' + i
      }).appendTo(form);
    }

    $('<button>', {text: this.config.buttonText}).appendTo(form);

    this.element.trigger('created.barometr');
  };

  Barometr.prototype.processData = function(data) {
    // console.log('resp data', data);
    if (data.data) {
      var $dl = $('<dl>');
      $.each(data.data, function(k, v) {
        // console.log('k',k,'data', v);
        $('<dt>', {text: k}).appendTo($dl);
        $('<dd>', {text: v}).appendTo($dl);
      });
      $dl.hide().appendTo(this.element).fadeIn(400);
    }
  };

  $.fn.barometr = function(options) {
    new Barometr(this.first(), options);
    return this.first();
  };
}(jQuery));
