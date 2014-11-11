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
        $('.suitcase-tag-input-text-wrapper').append('<div class="tags-container"><div class="add-tag"><input type="text" value=""></div></div><select class="term-autocomplete-select" style="display: none"></select>');
        $inputs.each(function(i, val) {
          var arr = $(this).val().split(",");
          for(var i=arr.length-1;i>-1;i--) {
            if(arr[i] != "") {
              addTag($(this).parent().find('.tags-container'), i, arr[i]);
            }
          }
        });
        $('.tags-container').click(function() {
          $(this).find('.add-tag input').focus();
        });
        $('.add-tag').keyup(function(e) {
          if(e.which == 188 || e.which == 13) {
            // Comma pressed, add to tags
            processNewTag(this);
          } else {
            var thiss = this;
            $.get('http://local.dev/ent/taxonomy/autocomplete/field_tags/' + encodeURI($(this).find('input').val()),
            function(data) {
              console.log(data);
              var $s = $(thiss).parent().parent().find('select');
              console.log($s);
              for(var d in data) {
                $s.append('<option>'+d+'</option>');
              }
              $s.change(function(e) {
                //console.log($(this).find('option:selected').text());
                console.log(this.value);
                $(this).hide();
              }).click(function() {
                $(this).find('input').val('');
                console.log('hello');
              });
              $s.show();
              console.log($s.length);
              $s.attr('size', 5);
            });
          }
        }).focusout(function(e) {
          // Clicked elsewhere, add to tags
          if(!block) {
            console.log('focusout');
            console.log(e.target);
            processNewTag(this);
            block = false;
          }
        });

        function processNewTag(el) {
          if($(el).find('input').val() != "") {
            addTag($(el).parent(),$(el).parent().find('.suitcase-tag-input-tag').length, $(el).find('input').val().replace(",",""));
            var t = $(el).parent().parent().find('.form-text').val() + ',' + $(el).find('input').val();
            $(el).parent().parent().find('.form-text').val(t);
            $(el).find('input').val('');
          }
        }

        function addTag($tagscontainer, i, text) {
          var $e = $('<span class="suitcase-tag-input-tag">' + text + ' <span class="remove">x</span></span>');
          $e.find('.remove').click(function(e) {
            // Remove tag
            console.log($(this).parent().index());
            var arr = $(this).parent().parent().parent().find('.form-text').val().split(",");
            arr.splice($(this).parent().index(),1);
            $(this).parent().parent().parent().find('input[type="text"]').val(arr.join());
            $(this).parent().remove();
            block = true;
          });
          $tagscontainer.find('.add-tag').before($e);
        }
      });
    }
  };
})(jQuery);