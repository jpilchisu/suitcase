/**
 * @todo
 */

(function($) {
  /**
   * @todo
   */
  Drupal.behaviors.suitcaseTagInput = {
    attach: function (context) {
      $('body', context).once('suitcaseTagInput', function() {
        var $inputs = $('.field-type-taxonomy-term-reference input[type="text"]'),
          block = false;
        $inputs/*.css('color', '#fff')*/.wrap('<div class="suitcase-tag-input-text-wrapper"></div>');
        $('.suitcase-tag-input-text-wrapper').append('<div class="tags-container"><div class="add-tag"><input type="text" value=""></div></div><div class="term-autocomplete-select" style="display: none"></div>');
        $inputs.each(function(i, val) {
          var arr = $(this).val().split(",");
          for(var i=arr.length-1;i>-1;i--) {
            if(arr[i] != "") {
              addTag($(this).parent().find('.tags-container'), i, arr[i]);
            }
          }
        });
        $('.suitcase-tag-input-text-wrapper').click(function() {
          $(this).find('.add-tag input').focus();
        });
        $('.add-tag').keyup(function(e) {
          if(e.which == 188 || e.which == 13) {
            // Comma pressed, add to tags
            processNewTag(this);
          } else {
            var thiss = this;
            var $s = $(this).parent().parent().find('.term-autocomplete-select');
            $.get('http://local.dev/ent/taxonomy/autocomplete/field_tags/' + encodeURI($(this).find('input').val()),
            function(data) {
              //$(thiss).unbind('focusout');
              for(var d in data) {
                var $e = $('<div>'+d+'</div>')
                  .click(function() {
                    addTag($(this).parent().parent().find('.tags-container'),0,$(this).text());
                    var t = $(this).parent().parent().find('.form-text').val() + ',' + $(this).text();
                    $(this).parent().parent().find('.form-text').val(t);
                    $(thiss).find('input').val('');
                    $s.hide().empty();
                  });
                $s.append($e);
              }
              $s.show();
            });
          }
        });

        $('.suitcase-tag-input-text-wrapper').focus(function(e) {
          $(this).bind('focusout',function(e) {
            // Clicked elsewhere, add to tags
            console.log(e);
            console.log($(':focus'));
            if(!block) {
              console.log(this);
              processNewTag($(this).find('.add-tag'));
            }
            block=false;
            $(this).unbind('focusout');
          });
        });

        function addTag($tagscontainer, i, text) {
          var $e = $('<span class="suitcase-tag-input-tag">' + text + ' <span class="remove">x</span></span>');
          $e.find('.remove').click(function(e) {
            // Remove tag
            var arr = $(this).parent().parent().parent().find('.form-text').val().split(",");
            arr.splice($(this).parent().index(),1);
            $(this).parent().parent().parent().find('.form-text').val(arr.join());
            $(this).parent().remove();
            block = true;
          });
          $tagscontainer.find('.add-tag').before($e);
        }

        function processNewTag(el) {
          if($(el).find('input').val() != "") {
            addTag($(el).parent(),$(el).parent().find('.suitcase-tag-input-tag').length, $(el).find('input').val().replace(",",""));
            var t = $(el).parent().parent().find('.form-text').val() + ',' + $(el).find('input').val();
            $(el).parent().parent().find('.form-text').val(t);
            $(el).find('input').val('');
            $(el).parent().parent().find('.term-autocomplete-select').hide().empty();
          }
        }
      });
    }
  };
})(jQuery);