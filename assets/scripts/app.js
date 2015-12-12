import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';


const Application = function(state, action) {
  if (state === undefined) {
    state = {
      toolbar: 'Queue',
    };
  }

  switch (action.type) {
    case 'TOOLBAR_SELECT':
      return Object.assign({}, state, {
        toolbar: action.toolbar,
      });
    default:
      return state
  }
}

const Model = createStore(Application);





import Toolbar from './toolbar';

const render = () => {
  ReactDOM.render(
    React.createElement(Toolbar, {model:Model.getState(), app:Model}),
    document.querySelector('main')
  );
};

Model.subscribe(render);
render();

// import queue from './model/queue';
// import browser from './model/browser';

// const app = combineReducers({
//   queue,
//   browser,
// });




// import $ from 'jquery';

// jQuery(($) => {
//   $('do');
// });




// jQuery(function($){

//   var $listing = $('.listing');
//   var $button = $('.toolbar button');

//   var createListingItem = function(item) {
//     var $label = $('<div>', {
//       'class': 'item-label',
//       'html': $('<a>', {
//         'class': 'item-title',
//         'html': item.name
//       })
//     });

//     var $actions = $('<div>', {
//       'class': 'item-actions',
//       'html': $('<button>', {
//         'class': 'item-action',
//         'data-action': 'download',
//         'html': 'Download'
//       })
//     });

//     return $('<div>', {
//       'class': 'item item-' + item.type,
//       'data-raw': item.raw
//     }).append($label).append($actions);
//   };

//   var updateListing = function(root) {
//     var data = {};

//     if (root) {
//       data.path = root;
//     }

//     $.ajax({
//       url: '/listing',
//       type: 'POST',
//       dataType: 'json',
//       data: data
//     }).done(function(data){
//       $listing.empty();

//       if (data.success) {
//         for (var i = 0; i < data.listing.length; i++) {
//           var item = data.listing[i];
//           var $item = createListingItem(item);
//           $listing.append($item);
//         };
//       }
//     });
//   };

//   var downloadAction = function(path) {
//     $.ajax({
//       url: '/download',
//       type: 'POST',
//       dataType: 'json',
//       data: { path: path }
//     }).done(function(data){
//       console.log(data);
//     });
//   };

//   $button.on('click', function(event){
//     updateListing();
//   });

//   $(document.body).on('click', '.item-title', function(event){
//     var path = $(event.currentTarget).parents('.item').data('raw');
//     updateListing(path);
//   });

//   $(document.body).on('click', '.item-action[data-action="download"]', function(event){
//     var path = $(event.currentTarget).parents('.item').data('raw');
//     downloadAction(path);
//   });
// });
