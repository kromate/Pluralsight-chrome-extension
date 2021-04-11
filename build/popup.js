document.addEventListener('DOMContentLoaded', function() {
    let url = window.location.pathname
    let body = document.getElementById('counter')
    
    console.log(url);
    console.log(body);

    document.getElementById('incrementBtn').addEventListener('click',()=>{
        console.log('object');
        console.log(window.location.pathname);
    })

})

