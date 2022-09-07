storeApp.controller('orderController', function ($scope, $http, $rootScope, $cookies, $route) {
    let isSearch = false;
    //lấy id truyền sang editController
    $scope.selectOrder = function (code, id) {
        $rootScope.orderId = id;
        $rootScope.orderCode = code;
    }

    $scope.maxSize = 5;     // Limit number for pagination display number.  
    $scope.totalCount = 0;  // Total number of items in all pages. initialize as a zero  
    $scope.pageIndex = 1;   // Current page number. First page is 1.-->  
    $scope.pageSizeSelected = 5; // Maximum number of items per page.

    //hiển thị tất cả dữ liệu
    $scope.getOrderList = function () {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/orders/page?page=' + $scope.pageIndex + "&per_page=" + $scope.pageSizeSelected,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    // toastr["success"]("Thành công!")
                    $scope.orderList = response.data.data.content;
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
    $scope.getOrderList();

    //Phương thức này đc gọi từ số phân trang
    $scope.pageChanged = function () {
        if (isSearch) {
            $scope.searchResultList();
        } else {
            $scope.getOrderList();
        }
    };

    //Phương thức này đang gọi từ dropDown
    $scope.changePageSize = function () {
        $scope.pageIndex = 1;
        if (isSearch) {
            $scope.searchResultList();
        } else {
            $scope.getOrderList();
        }
    }

    //chức năng tìm kiếm
    $scope.searchResultList = function () {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/orders/search?searchString=' + $scope.keyBySearch + "&page=" + $scope.pageIndex + "&per_page=" + $scope.pageSizeSelected,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.orderList = response.data.data.content;
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
    //chức năng tìm kiếm
    $scope.searchByCode = function () {
        $scope.searchResultList();
    }

    //xoá
    $scope.removeById = function (id) {
        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/api/v1/orders/' + id,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.status === 204) {
                    toastr["success"]("Thành công!")
                    $route.reload();
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
    .controller('addOrderController', function ($scope, $http, $cookies, $location) {
        //danh sách sản phẩm
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/products',
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.productList = response.data.data;
                }
            }, function (response) {
                let message = response.data.message;
                let checkMessage = message.localeCompare("Access is denied");
                if (response.status === 500 && $cookies.get('token') && checkMessage === 0) {
                    toastr["error"]("Bạn không có quyền truy cập!");
                } else {
                    toastr["error"]("Lỗi rồi!");
                }
            })

        //ấn button thêm
        $scope.cartList = [];
        $scope.totalMoney = 0;
        $scope.add = function () {
            let index = $scope.filterCondition.product;
            if ($scope.quantity > $scope.productList[index].quantity) {
                toastr["error"]("Số lượng mua lớn hơn số lượng còn trong kho!");
            } else {
                let product = {
                    productId: $scope.productList[index].id,
                    productCode: $scope.productList[index].code,
                    productName: $scope.productList[index].name,
                    price: $scope.productList[index].price,
                    import_price: $scope.productList[index].import_price,
                    quantity: $scope.productList[index].quantity,
                    quantityPurchased: $scope.quantity
                }
                $scope.cartList.push(product);
                $scope.totalMoney += (parseInt(product.quantityPurchased) * product.price);
            }
        }
        //xoá one element
        $scope.removeItem = function (index) {
            $scope.totalMoney = $scope.totalMoney - (parseInt($scope.cartList[index].quantityPurchased) * $scope.cartList[index].price);
            $scope.cartList.splice(index, 1);
        }
        //tạo hoá đơn
        $scope.createOrder = function () {
            let orderInfor = {
                code: $scope.code,
                totalMoney: $scope.totalMoney,
                userId: $cookies.get('userId'),
                orderDetailForms: $scope.cartList
            }
            $http({
                method: 'POST',
                url: 'http://localhost:8080/api/v1/orders',
                data: JSON.stringify(orderInfor),
                headers: {
                    'Authorization': $cookies.get('token')
                }
            })
                .then(function (response) {
                    if (response.data.status === 201) {
                        toastr["success"]("Thành công!")
                        $location.path('/order')
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
    .controller('editOrderController', function ($scope, $http, $cookies, $location, $rootScope) {
        $scope.totalMoney = 0;
        $scope.productCart = [];
        //thông tin hoá đơn 
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/orders/' + $rootScope.orderId,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.productCart = response.data.data;
                    for (const value of $scope.productCart) {
                        $scope.totalMoney += (value.price * value.quantityPurchased);
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

        //danh sách sản phẩm
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/products',
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.productList = response.data.data;
                }
            }, function (response) {
                let message = response.data.message;
                let checkMessage = message.localeCompare("Access is denied");
                if (response.status === 500 && $cookies.get('token') && checkMessage === 0) {
                    toastr["error"]("Bạn không có quyền truy cập!");
                } else {
                    toastr["error"]("Lỗi rồi!");
                }
            })

        //ấn nút add
        $scope.add = function () {
            let index = $scope.filterCondition.product;
            if ($scope.quantity > $scope.productList[index].quantity) {
                toastr["error"]("Số lượng mua lớn hơn số lượng còn trong kho!");
            } else {
                let product = {
                    productId: $scope.productList[index].id,
                    productCode: $scope.productList[index].code,
                    productName: $scope.productList[index].name,
                    price: $scope.productList[index].price,
                    import_price: $scope.productList[index].import_price,
                    quantity: $scope.productList[index].quantity,
                    quantityPurchased: $scope.quantity
                }
                $scope.productCart.push(product);
                $scope.totalMoney += (parseInt(product.quantityPurchased * product.price));
            }
        }
        //xáo 1 element trong giỏ hàng
        $scope.removeItem = function (index) {
            $scope.totalMoney = $scope.totalMoney - (parseInt($scope.productCart[index].quantityPurchased) * $scope.productCart[index].price);
            $scope.productCart.splice(index, 1);
        }

        //sửa
        $scope.editOrder = function () {
            let orderInfor = {
                code: $scope.orderCode,
                totalMoney: $scope.totalMoney,
                orderDetailForms: $scope.productCart
            }
            $http({
                method: 'PATCH',
                url: 'http://localhost:8080/api/v1/orders/' +  $rootScope.orderId,
                data: JSON.stringify(orderInfor),
                headers: {
                    'Authorization': $cookies.get('token')
                }
            })
                .then(function (response) {
                    if (response.data.status === 201) {
                        toastr["success"]("Thành công!")
                        $location.path('/order')
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