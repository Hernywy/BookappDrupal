/*!
 * jQuery Once v2.2.3 - http://github.com/robloach/jquery-once
 * @license MIT, GPL-2.0
 *   http://opensource.org/licenses/MIT
 *   http://opensource.org/licenses/GPL-2.0
 */
(function(e){"use strict";if(typeof exports==="object"&&typeof exports.nodeName!=="string"){e(require("jquery"))}else if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(t){"use strict";var r=function(e){e=e||"once";if(typeof e!=="string"){throw new TypeError("The jQuery Once id parameter must be a string")}return e};t.fn.once=function(e){var n="jquery-once-"+r(e);return this.filter(function(){return t(this).data(n)!==true}).data(n,true)};t.fn.removeOnce=function(e){return this.findOnce(e).removeData("jquery-once-"+r(e))};t.fn.findOnce=function(e){var n="jquery-once-"+r(e);return this.filter(function(){return t(this).data(n)===true})}});

/**
 * @file
 * Like and dislike icons behavior.
 */
(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.likeAndDislike = {
    attach: function(context, settings) {
      $('.vote-widget--like-and-dislike', context).once('like-and-dislike').each(function () {
        var $widget = $(this);
        $widget.find('.vote-like a').click(function() {
          var entity_id, entity_type;
          if (!$(this).hasClass('disable-status')) {
            entity_id = $(this).data('entity-id');
            entity_type = $(this).data('entity-type');
            likeAndDislikeService.vote(entity_id, entity_type, 'like');
          }
        });
        $widget.find('.vote-dislike a').click(function() {
          var entity_id, entity_type;
          if (!$(this).hasClass('disable-status')) {
            entity_id = $(this).data('entity-id');
            entity_type = $(this).data('entity-type');
            likeAndDislikeService.vote(entity_id, entity_type, 'dislike');
          }
        });
      });
    }
  };

})(jQuery, Drupal);
;
/**
 * @file
 * Like and dislike icons behavior.
 */
(function ($, Drupal) {

  'use strict';

  window.likeAndDislikeService = window.likeAndDislikeService || (function() {
    function likeAndDislikeService() {}
    likeAndDislikeService.vote = function(entity_id, entity_type, tag) {
      $.ajax({
        type: "POST",
        url: drupalSettings.path.baseUrl + 'like_and_dislike/' + entity_type + '/' + tag + '/' + entity_id,
        success: function(response) {
          // Expected response is a json object where likes is the new number
          // of likes, dislikes is the new number of dislikes, message_type is
          // the type of message to display ("status" or "warning") and message
          // is the message to display.
          ['like', 'dislike'].forEach(function (iconType) {
            var selector = '#' + iconType + '-container-' + entity_type + '-' + entity_id;
            var $aTag = $(selector + ' a');
            if ($aTag.length == 0) {
              return;
            }
            response.operation[iconType] ? $aTag.addClass('voted') : $aTag.removeClass('voted');
            $(selector + ' .count').text(response[iconType + 's']);
          });

          // Display a message whether the vote was registered or an error
          // happened.
          // @todo - this will work only for case when theme has messages in
          // highlighted region.
          $('.region.region-highlighted').html("<div class='messages__wrapper layout-container'><div class='messages messages--" + response.message_type + " role='contentinfo'>" + response.message + "</div></div>");
        }
      });
    };
    return likeAndDislikeService;
  })();

})(jQuery, Drupal);
;
