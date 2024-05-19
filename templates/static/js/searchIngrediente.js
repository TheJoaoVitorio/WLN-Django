$(document).ready(function(){
    var searchBtn = $('#search-icon');
    var searchForm = $('#search-form');

    $(searchBtn).on('click', function(){
        console.log('passei aqui.');
        searchForm.submit();
    })
})