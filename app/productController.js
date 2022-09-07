storeApp.controller('productController', function ($scope,$http,$rootScope,$cookies,$route) {
    let isSearch = false;
    //lấy id truyền sang editController
    $scope.selectProduct = function(id){
        $rootScope.id = id;
    }

    $scope.maxSize = 5;     // Limit number for pagination display number.  
    $scope.totalCount = 0;  // Total number of items in all pages. initialize as a zero  
    $scope.pageIndex = 1;   // Current page number. First page is 1.-->  
    $scope.pageSizeSelected = 5; // Maximum number of items per page.

    //hiển thị tất cả dữ liệu
    $scope.getProductList = function () { 
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/products/page?page=' + $scope.pageIndex + "&per_page=" + $scope.pageSizeSelected,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
        .then(function (response) {
            if(response.data.status === 200){
                // toastr["success"]("Thành công!")
                $scope.productList = response.data.data.content;
                $scope.totalCount = response.data.data.totalCount;
                isSearch = false;
            }else{
                if(response.status === 202){
                    toastr["error"]("Bạn chưa đăng nhập!")
                }
            }
        }, function(response){
            let message = response.data.message;
            let checkMessage = message.localeCompare("Access is denied")
            if(response.status === 500 && $cookies.get('token') && checkMessage === 0){
                toastr["error"]("Bạn không có quyền truy cập!")
            }else{
                toastr["error"]("Lỗi rồi!")
            }
        })
    }
    $scope.getProductList();  
  
    //Phương thức này đc gọi từ số phân trang
    $scope.pageChanged = function () {
        if(isSearch){
            $scope.searchResultList();
        }else{
            $scope.getProductList();  
        }
    };  
  
    //Phương thức này đang gọi từ dropDown
    $scope.changePageSize = function () {
        $scope.pageIndex = 1;
        if(isSearch){
            $scope.searchResultList();
        }else{
            $scope.getProductList();  
        }
    }

    //chức năng tìm kiếm
    $scope.searchResultList = function(){
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/products/search?searchString=' + $scope.keyBySearch + "&page=" + $scope.pageIndex + "&per_page=" + $scope.pageSizeSelected,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
        .then(function (response) {
            if(response.data.status === 200){
                $scope.productList = response.data.data.content;
                $scope.totalCount = response.data.data.totalCount;
                isSearch = true;
            }else{
                if(response.status === 202){
                    toastr["error"]("Bạn chưa đăng nhập!")
                }
            }
        }, function(response){
            let message = response.data.message;
            let checkMessage = message.localeCompare("Access is denied")
            if(response.status === 500 && $cookies.get('token') && checkMessage === 0){
                toastr["error"]("Bạn không có quyền truy cập!")
            }else{
                toastr["error"]("Lỗi rồi!")
            }
        })
    }
    //chức năng tìm kiếm
    $scope.searchByCode = function(){
        $scope.searchResultList();
    }

    //xoá
    $scope.removeById = function (id) {
        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/api/v1/products/' + id,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if(response.status === 204){
                    toastr["success"]("Thành công!")
                    $route.reload();
                }
            }, function(response){
                if(response.status === 400){
                    toastr["error"]("xoá thất bại!")
                }else{
                    let message = response.data.message;
                    let checkMessage = message.localeCompare("Access is denied")
                    if(response.status === 500 && $cookies.get('token') && checkMessage === 0){
                        toastr["error"]("Bạn không có quyền truy cập!")
                    }else{
                        toastr["error"]("Lỗi rồi!")
                    }
                }
            })
    }

})
.controller('addProductController', function ($scope, $http, $cookies, $location) {
    //Loại sản phẩm
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/categories',
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
        .then(function (response) {
            if(response.data.status === 200){
                $scope.categoryList = response.data.data;
            }else{
                if(response.status === 202){
                    toastr["error"]("Bạn chưa đăng nhập!")
                }
            }
        }, function(response){
            let message = response.data.message;
            let checkMessage = message.localeCompare("Access is denied")
            if(response.status === 500 && $cookies.get('token') && checkMessage === 0){
                toastr["error"]("Bạn không có quyền truy cập!")
            }else{
                toastr["error"]("Lỗi rồi!")
            }
        })

        //thêm
        $scope.add = function () {
            let categoryId = $scope.category.id;
            let product = {
                code: $scope.code,
                name: $scope.name,
                price: $scope.price,
                importPrice: $scope.importPrice,
                quantity: $scope.quantity,
                categoryId: categoryId
            }
            $http({
                method: 'POST',
                url: 'http://localhost:8080/api/v1/products/',
                data: JSON.stringify(product),
                headers: {
                    'Authorization': $cookies.get('token')
                }
            })
            .then(function(response){
                if(response.data.status === 201){
                    toastr["success"]("Thành công!")
                    $location.path('/product')
                }else{
                    if(response.status === 202){
                        toastr["error"]("Bạn chưa đăng nhập!")
                    }
                }
            }, function(response){
                if(response.data.status === 400){
                    toastr["error"](response.data.message)
                }else{
                    let message = response.data.message;
                    let checkMessage = message.localeCompare("Access is denied")
                    if(response.status === 500 && $cookies.get('token') && checkMessage === 0){
                        toastr["error"]("Bạn không có quyền truy cập!")
                    }else{
                        toastr["error"]("Lỗi rồi!")
                    }
                }
            })
        }

})
.controller('editProductController', function ($scope, $http, $cookies, $location, $rootScope) {
    //Loại sản phẩm
    $http({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/categories',
        headers: {
            'Authorization': $cookies.get('token')
        }
    })
    .then(function (response) {
        if(response.data.status === 200){
            $scope.categoryList = response.data.data;
        }
    }, function(response){
        let message = response.data.message;
        let checkMessage = message.localeCompare("Access is denied")
        if(response.status === 500 && $cookies.get('token') && checkMessage === 0){
            toastr["error"]("Bạn không có quyền truy cập!")
        }else{
            toastr["error"]("Lỗi rồi!")
        }
    })

    //sản phẩm theo id
    $http({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/products/' + $rootScope.id,
        headers: {
            'Authorization': $cookies.get('token')
        }
    })
    .then(function (response) {
        if(response.data.status === 200){
            $scope.code = response.data.data.code;
            $scope.name = response.data.data.name;
            $scope.importPrice = response.data.data.import_price;
            $scope.price = response.data.data.price;
            $scope.quantity = response.data.data.quantity;
            $scope.categoryCode = response.data.data.categoryCode;
            $scope.categoryName = response.data.data.categoryName;
        }
    }, function(response){
        let message = response.data.message;
        let checkMessage = message.localeCompare("Access is denied")
        if(response.status === 500 && $cookies.get('token') && checkMessage === 0){
            toastr["error"]("Bạn không có quyền truy cập!")
        }else{
            toastr["error"]("Lỗi rồi!")
        }
    })
    
        //sửa
        $scope.editById = function (id) {
            let categoryId = $scope.category.id;
            let product = {
                name: $scope.name,
                price: $scope.price,
                importPrice: $scope.importPrice,
                quantity: $scope.quantity,
                categoryId: categoryId
            }
            $http({
                method: 'PATCH',
                url: 'http://localhost:8080/api/v1/products/' + id,
                data: JSON.stringify(product),
                headers: {
                    'Authorization': $cookies.get('token')
                }
            })
            .then(function(response){
                if(response.data.status === 201){
                    toastr["success"]("Thành công!")
                    $location.path('/product')
                }
            }, function(response){
                if(response.data.status === 400){
                    toastr["error"](response.data.message)
                }else{
                    let message = response.data.message;
                    let checkMessage = message.localeCompare("Access is denied")
                    if(response.status === 500 && $cookies.get('token') && checkMessage === 0){
                        toastr["error"]("Bạn không có quyền truy cập!")
                    }else{
                        toastr["error"]("Lỗi rồi!")
                    }
                }
            })
        }
})