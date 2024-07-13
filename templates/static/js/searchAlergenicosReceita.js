$(document).ready(function(){
    var searchBtn = $('#search-icon');
    var searchForm = $('#search-form');

    $(searchBtn).on('click', function(){
        searchForm.submit();
    })
})