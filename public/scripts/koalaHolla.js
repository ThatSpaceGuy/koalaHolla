console.log( 'js' );

$( document ).ready( function(){
  console.log( 'JQ' );
  // load existing koalas on page load
  getKoalas();

  // add koala button click
  $( '#addButton' ).on( 'click', function(){
    console.log( 'in addButton on click' );

    // get user input and put in an object
    var objectToSend = {
      name: $('#nameIn').val(),
      age: $('#ageIn').val(),
      sex: $('#sexIn').val(),
      readyForTransfer: $('#readyForTransferIn').val(),
      notes: $('#notesIn').val(),
    };
    // check inputs for validity
    objectToSend = checkInputs(objectToSend);
    console.log(objectToSend);
    // call saveKoala with the new obejct

    if (objectToSend) {
      saveKoala( objectToSend );
    }
  }); //end addButton on click
}); // end doc ready

var checkInputs = function(objectToCheck){
  var alertMessage = '';
  var emptyField = false;
  var nameCheck = objectToCheck.name;
  var notesCheck = objectToCheck.notes;

  // check for empty fields
  $('.inputField').each(function(index){
    if ($(this).val() === '') {
      emptyField = true;
    }
  });

  if (emptyField){
    alertMessage += 'All fields are required!\n';
  }

  // check name
  if (nameCheck.length > 22) {
    objectToCheck.name = nameCheck.substr(0,22);
    alertMessage += 'Name entered is too long, please re-enter\n';
    $('#nameIn').val(objectToCheck.name);
  }
  // check age
  objectToCheck.age = Math.floor(objectToCheck.age);

  // sex value is being controlled by input dropdown
  // check readyForTransfer
  if (objectToCheck.readyForTransfer === 'Y'){
    objectToCheck.readyForTransfer = true;
  } else {
    objectToCheck.readyForTransfer = false;
  }
  // check notes
  if (notesCheck.length > 140) {
    objectToCheck.notes = notesCheck.substr(0,140);
    alertMessage += 'Notes entered are too long, please re-enter\n';
    $('#notesIn').val(objectToCheck.notes);
  }

  if (alertMessage !== ''){
    return alert(alertMessage);
  }

  return objectToCheck;
};

var checkEdits = function(objectToCheck){
  var alertMessage = '';
  if (objectToCheck.name){
    var nameCheck = objectToCheck.name;
    // check name
    if (nameCheck.length > 22) {
      objectToCheck.name = nameCheck.substr(0,22);
      alertMessage += 'Name entered is too long, please re-enter\n';
      $('#nameEditIn').val(objectToCheck.name);
    }
  }
  if (objectToCheck.notes){
    var notesCheck = objectToCheck.notes;
    // check notes
    if (notesCheck.length > 140) {
      objectToCheck.notes = notesCheck.substr(0,140);
      alertMessage += 'Notes entered are too long, please re-enter\n';
      $('#notesEditIn').val(objectToCheck.notes);
    }
  }

  // check for empty fields


  // check age
  if (objectToCheck.age){
    objectToCheck.age = Math.floor(objectToCheck.age);
  }

  // sex value is being controlled by input dropdown
  // check readyForTransfer
  if (objectToCheck.readyForTransfer){
    if (objectToCheck.readyForTransfer === 'Y'){
      objectToCheck.readyForTransfer = true;
    } else {
      objectToCheck.readyForTransfer = false;
    }
  }

  if (alertMessage !== ''){
    return alert(alertMessage);
  }

  return objectToCheck;
};

var editKoala = function(id){
  console.log('in editKoala');
  var objectToSend = {
    id: id
  };
  if ($('#nameEditIn').val()){
    objectToSend.name = $('#nameEditIn').val();
  }
  if ($('#ageEditIn').val()){
    objectToSend.age = $('#ageEditIn').val();
  }
  if ($('#sexEditIn').val()){
    objectToSend.sex = $('#sexEditIn').val();
  }
  if ($('#readyForTransferEditIn').val()){
    //matching property name to database column
    objectToSend.ready_for_transfer = $('#readyForTransferEditIn').val();
  }
  if ($('#notesEditIn').val()){
    objectToSend.notes = $('#notesEditIn').val();
  }
  objectToSend = checkEdits(objectToSend);
  console.log(objectToSend);
  // call saveKoala with the new obejct

  if (objectToSend) {
  // ajax call to edit koala
    $.ajax({
      url: '/editKoala',
      type: 'POST',
      data: objectToSend,
      success: function(data){
        console.log('successful edit');
        //delete old display from DOM and append the updated koala information
        $('#koala' + data[0].id).remove();
        displayKoala(data[0]);
      }//end success
    });//end ajax call
  }//end if
};

var getKoalas = function(){
  console.log( 'in getKoalas' );
  // ajax call to server to get koalas
  $.ajax({
    url: '/getKoalas',
    type: 'GET',
    success: function( data ){
      console.log( 'got some koalas: ', data );
      for (var i = 0; i < data.length; i++) {
        displayKoala(data[i]);
      }
    } // end success
  }); //end ajax
  // display on DOM with buttons that allow edit of each
}; // end getKoalas


//adds a koala to the database, then returns the same koala object it was given
var saveKoala = function( newKoala ){
  console.log( 'in saveKoala', newKoala );
  // ajax call to server to get koalas
  var koalaFromServer;
  $.ajax({
    url: '/addKoala',
    type: 'POST',
    data: newKoala,
    success: function( data ){
      console.log( 'saved a koala: ', data[0] );
      displayKoala(data[0]);
    } // end success
  }); //end ajax
};

var displayKoala = function(koalaObject){
  console.log('in displayKoalas with:', koalaObject);
  $('#viewKoalas').append('<div id="koala' + koalaObject.id + '"<p>Name: ' + koalaObject.name + ', Age: ' + koalaObject.age + ', Sex: ' + koalaObject.sex + ', Ready For Transfer: ' + koalaObject.ready_for_transfer + ',  Notes: ' + koalaObject.notes + '</p><button class=editButton onclick=editKoala(' + koalaObject.id + ')>Edit</button></div>');
};
