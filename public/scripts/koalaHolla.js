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
    objectToCheck.name = nameCheck.substr(0,21);
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
    objectToCheck.notes = notesCheck.substr(0,139);
    alertMessage += 'Notes entered are too long, please re-enter\n';
    $('#notesIn').val(objectToCheck.notes);
  }

  if (alertMessage !== ''){
    return alert(alertMessage);
  }

  return objectToCheck;
};


var getKoalas = function(){
  console.log( 'in getKoalas' );
  // ajax call to server to get koalas
  $.ajax({
    url: '/getKoalas',
    type: 'GET',
    success: function( data ){
      console.log( 'got some koalas: ', data );
    } // end success
  }); //end ajax
  // display on DOM with buttons that allow edit of each
}; // end getKoalas

var saveKoala = function( newKoala ){
  console.log( 'in saveKoala', newKoala );
  // ajax call to server to get koalas
  $.ajax({
    url: '/addKoala',
    type: 'POST',
    data: newKoala,
    success: function( data ){
      console.log( 'got some koalas: ', data );
    } // end success
  }); //end ajax
};

var displayKoalas = function(koalaObject){
  console.log('in displayKoalas with:', koalaObject);


};
