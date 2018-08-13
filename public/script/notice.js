$(document).ready( function (){
    $("#subnotice").submit( function(submitEvent) {

        var filename = $("#upload-file-info").val();
        var extension = filename.replace(/^.*\./, '');

        if (extension == filename) {
            extension = '';
        } else {
                        extension = extension.toLowerCase();
        }

        if(extension!="pdf"){
                submitEvent.preventDefault();

        }
                    
        
  });
});