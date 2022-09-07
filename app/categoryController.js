storeApp.controller('categoryController', function ($scope, $http, $rootScope, $cookies) {
    let isSearch = false;
    //lấy id truyền sang editController
    $scope.selectById = function (id) {
        $rootScope.id = id;
    }

    $scope.maxSize = 5;     // Limit number for pagination display number.  
    $scope.totalCount = 0;  // Total number of items in all pages. initialize as a zero  
    $scope.pageIndex = 1;   // Current page number. First page is 1.-->  
    $scope.pageSizeSelected = 5; // Maximum number of items per page.

    //hiển thị tất cả dữ liệu
    $scope.getCategoryList = function () {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/categories/page?page=' + ($scope.pageIndex - 1) + "&per_page=" + $scope.pageSizeSelected,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    // toastr["success"]("Thành công!")
                    $scope.categoryList = response.data.data.content;
                    $scope.totalCount = response.data.data.totalCount;
                    isSearch = false;
                } else {
                    if (response.status === 202) {
                        toastr["error"]("Bạn chưa đăng nhập!")
                    }
                }
            }, function (response) {
                let message = response.data.message;
                let checkMessage = message.localeCompare("Access is denied")
                if (response.status === 500 && $cookies.get('token') && checkMessage === 0) {
                    toastr["error"]("Bạn không có quyền truy cập!")
                } else {
                    toastr["error"]("Lỗi rồi!")
                }
            })
    }

    //chức năng tìm kiếm
    $scope.searchResultList = function () {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/categories/search?searchString=' + $scope.keyBySearch + "&page=" + ($scope.pageIndex - 1) + "&per_page=" + $scope.pageSizeSelected,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.categoryList = response.data.data.content;
                    $scope.totalCount = response.data.data.totalCount;
                    isSearch = true;
                } else {
                    if (response.status === 202) {
                        toastr["error"]("Bạn chưa đăng nhập!")
                    }
                }
            }, function (response) {
                let message = response.data.message;
                let checkMessage = message.localeCompare("Access is denied")
                if (response.status === 500 && $cookies.get('token') && checkMessage === 0) {
                    toastr["error"]("Bạn không có quyền truy cập!")
                } else {
                    toastr["error"]("Lỗi rồi!")
                }
            })
    }

    $scope.getCategoryList();

    //Phương thức này đc gọi từ số phân trang
    $scope.pageChanged = function () {
        if (isSearch) {
            $scope.searchResultList();
        } else {
            $scope.getCategoryList();
        }
    };

    //Phương thức này đang gọi từ dropDown
    $scope.changePageSize = function () {
        $scope.pageIndex = 1;
        if (isSearch) {
            $scope.searchResultList();
        } else {
            $scope.getCategoryList();
        }
    };

    //chức năng tìm kiếm
    $scope.searchByCode = function () {
        $scope.searchResultList();
    }

    //xoá
    $scope.removeById = function (id) {
        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/api/v1/categories/' + id,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.status === 204) {
                    toastr["success"]("Thành công!")
                    $location.path('/category')
                }
            }, function (response) {
                if (response.status === 400) {
                    toastr["error"]("xoá thất bại!")
                } else {
                    let message = response.data.message;
                    let checkMessage = message.localeCompare("Access is denied")
                    if (response.status === 500 && $cookies.get('token') && checkMessage === 0) {
                        toastr["error"]("Bạn không có quyền truy cập!")
                    } else {
                        toastr["error"]("Lỗi rồi!")
                    }
                }
            })
    }

})
    .controller('addController', function ($scope, $http, $cookies, $location) {
        //thêm
        $scope.add = function () {
            let category = {
                code: $scope.code,
                name: $scope.name
            }
            $http({
                method: 'POST',
                url: 'http://localhost:8080/api/v1/categories/',
                data: JSON.stringify(category),
                headers: {
                    'Authorization': $cookies.get('token')
                }
            })
                .then(function (response) {
                    if (response.data.status === 201) {
                        toastr["success"]("Thành công!")
                        $location.path('/category')
                    } else {
                        if (response.status === 202) {
                            toastr["error"]("Bạn chưa đăng nhập!")
                        }
                    }
                }, function (response) {
                    if (response.data.status === 400) {
                        toastr["error"](response.data.message)
                    } else {
                        let message = response.data.message;
                        let checkMessage = message.localeCompare("Access is denied")
                        if (response.status === 500 && $cookies.get('token') && checkMessage === 0) {
                            toastr["error"]("Bạn không có quyền truy cập!")
                        } else {
                            toastr["error"]("Lỗi rồi!")
                        }
                    }
                })
        }
    })
    .controller('editController', function ($scope, $http, $cookies, $location, $rootScope) {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/categories/' + $rootScope.id,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.code = response.data.data.code;
                    $scope.name = response.data.data.name;
                }
            }, function (response) {
                let message = response.data.message;
                let checkMessage = message.localeCompare("Access is denied")
                if (response.status === 500 && $cookies.get('token') && checkMessage === 0) {
                    toastr["error"]("Bạn không có quyền truy cập!")
                } else {
                    toastr["error"]("Lỗi rồi!")
                }
            })
        //sửa
        $scope.editById = function (id) {
            let category = {
                name: $scope.name
            }
            $http({
                method: 'PATCH',
                url: 'http://localhost:8080/api/v1/categories/' + id,
                data: JSON.stringify(category),
                headers: {
                    'Authorization': $cookies.get('token')
                }
            })
                .then(function (response) {
                    if (response.data.status === 201) {
                        toastr["success"]("Thành công!")
                        $location.path('/category')
                    }
                }, function (response) {
                    let message = response.data.message;
                    let checkMessage = message.localeCompare("Access is denied")
                    if (response.status === 500 && $cookies.get('token') && checkMessage === 0) {
                        toastr["error"]("Bạn không có quyền truy cập!")
                    } else {
                        toastr["error"]("Lỗi rồi!")
                    }
                })
        }

    })