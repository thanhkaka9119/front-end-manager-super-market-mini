toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

function createToastr(httpStatus){
    if(httpStatus === 201 || httpStatus === 204 || httpStatus === 200){
        toastr["success"]("Thành công!")
    }else{
        toastr["error"]("Thất bại!")
    }
}