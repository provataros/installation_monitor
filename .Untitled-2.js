var Target_LINK="http://localhost/smartafc/personalisation/internetrequest/request/CreateRequest.dev"
function post(path, params) {   
    var form = document.createElement("form");   
    form.setAttribute("method", "post");   
    form.setAttribute("action", path);   
    for(var key in params) {  
        if(params.hasOwnProperty(key)) {        
            var hiddenField = document.createElement("input");      
            hiddenField.setAttribute("name", key);      
            hiddenField.setAttribute("value", params[key]);         
            form.appendChild(hiddenField);  
        }   
    }
    document.body.appendChild(form);  
    form.submit(); 
}   
parsed_params={
    bnftType : "01",
    inquiryPassword : "123456789123",

    firstName : "performance",
    lastName : "performance",
    socialSecurityNumber : "123456789",
    phoneNumber : "123456789",
    birthday : "20161212",
    zipCode : "12345",

    test : "true",
}; 

for (var i=0;i<10;i++){
    post(Target_LINK, parsed_params); 
}