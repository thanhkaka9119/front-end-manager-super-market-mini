storeApp.controller('roleController', function ($scope, $http, $cookies, $rootScope, $route) {
    //lấy ra danh sách loại người dùng
    $http({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/roles',
        headers: {
            'Authorization': $cookies.get('token')
        }
    })
        .then(function (response) {
            if (response.data.status === 200) {
                $scope.roleList = response.data.data;
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

    //thực hiện xoá 1 hàng dữ liệu
    $scope.removeById = function (id) {
        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/api/v1/roles/' + id,
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
                let message = response.data.message;
                let checkMessage = message.localeCompare("Access is denied")
                if (response.status === 500 && $cookies.get('token') && checkMessage === 0) {
                    toastr["error"]("Bạn không có quyền truy cập!")
                } else {
                    toastr["error"]("Xoá thất bại!")
                }
            })
    }

    //chọn hàng dữ liệu
    $scope.selectById = function (id) {
        $rootScope.roleId = id;
    }

})
    .controller('addRoleController', function ($scope, $http, $cookies, $location, $route) {
        //lấy ra danh sách đặc quyền
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/roles/permissions',
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.permissionList = response.data.data;
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

        //lấy ra value checkbox
        let permissionIdList = [];
        $scope.change = function (permissionId, active) {
            if (active) {
                permissionIdList.push(permissionId);
            }
            else
                permissionIdList.splice(permissionIdList.indexOf(permissionId), 1);
        }
        $scope.add = function () {
            let data = {
                roleName: $scope.name,
                permissionIdList: permissionIdList
            }
            $http({
                method: 'POST',
                url: 'http://localhost:8080/api/v1/roles/',
                data: JSON.stringify(data),
                headers: {
                    'Authorization': $cookies.get('token')
                }
            })
                .then(function (response) {
                    if (response.data.status === 201) {
                        toastr["success"]("Thành công!");
                        $location.path('/role');
                        $route.reload();
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

    })
    .controller('editRoleController', function ($scope, $http, $cookies, $location, $rootScope) {
        //lấy ra danh sách đặc quyền
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/roles/permissions',
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.permissionList = response.data.data;
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

        //lấy ra thông tin role
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/roles/' + $rootScope.roleId,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.name = response.data.data.roleName;
                }
            }, function (response) {
                toastr["error"]("Lỗi rồi!")
            })

        //lấy ra value checkbox
        let permissionIdList = [];
        $scope.change = function (permissionId, active) {
            if (active) {
                permissionIdList.push(permissionId);
            }
            else
                permissionIdList.splice(permissionIdList.indexOf(permissionId), 1);
        }
        //update
        $scope.editById = function (id) {
            let data = {
                roleName: $scope.name,
                permissionIdList: permissionIdList
            }
            $http({
                method: 'PATCH',
                url: 'http://localhost:8080/api/v1/roles/' + $rootScope.roleId,
                data: JSON.stringify(data),
                headers: {
                    'Authorization': $cookies.get('token')
                }
            })
                .then(function (response) {
                    if (response.data.status === 201) {
                        toastr["success"]("Thành công!");
                        $location.path('/role');
                        $route.reload();
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
