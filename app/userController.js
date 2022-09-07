//directive lấy ra file
// custom-on-change="uploadFile"
storeApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            let model = $parse(attrs.fileModel);
            let modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
//xử lý thêm dữ liệu
storeApp.service('addUser', ['$http', '$route', function ($http, $route) {
    this.addData = function (file, uploadUrl, dataUser) {
        let formData = new FormData();
        formData.set('code', dataUser.code);
        formData.set('name', dataUser.name);
        formData.set('birthday', dataUser.birthday);
        formData.set('address', dataUser.address);
        formData.set('email', dataUser.email);
        formData.set('identifier', dataUser.identifier);
        formData.set('fileImg', file);
        formData.set('username', dataUser.username);
        formData.set('password', dataUser.password);
        formData.set('roleIdList', dataUser.roleIdList);
        $http(
            {
                method: 'POST',
                url: uploadUrl,
                data: formData,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'Authorization': localStorage.getItem('token')
                }
            }
        )
            .then(function (response) {
                if (response.data.status === 201) {
                    toastr["success"]("Thành công!");
                    $location.path('/user');
                    $route.reload();
                }
            }, function (response) {
                toastr["error"]("Lỗi rồi!");
            })
    }
}]);
//xử lý sửa thông tin
storeApp.service('editUser', ['$http', '$route', function ($http, $route) {
    this.editData = function (file, uploadUrl, dataUser) {
        let formData = new FormData();
        formData.set('code', dataUser.code);
        formData.set('name', dataUser.name);
        formData.set('birthday', dataUser.birthday);
        formData.set('address', dataUser.address);
        formData.set('email', dataUser.email);
        formData.set('identifier', dataUser.identifier);
        formData.set('fileImg', file);
        formData.set('username', dataUser.username);
        formData.set('password', dataUser.password);
        formData.set('roleId', dataUser.roleId);
        $http(
            {
                method: 'PATCH',
                url: uploadUrl,
                data: formData,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'Authorization': localStorage.getItem('token')
                }
            }
        )
            .then(function (response) {
                createToastr(response.status);
                $route.reload();
            })
    }
}]);

storeApp.controller('userController', ['$scope', '$http', '$route', '$rootScope', '$cookies', 'addUser', 'editUser', function ($scope, $http, $route, $rootScope, $cookies, addUser, editUser) {
    let isSearch = false;

    //lấy id truyền sang editController
    $scope.selectUser = function (id) {
        $rootScope.userId = id;
    }

    $scope.maxSize = 5;     // Limit number for pagination display number.  
    $scope.totalCount = 0;  // Total number of items in all pages. initialize as a zero  
    $scope.pageIndex = 1;   // Current page number. First page is 1.-->  
    $scope.pageSizeSelected = 5; // Maximum number of items per page.

    //hiển thị tất cả dữ liệu
    $scope.getUserList = function () {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/users/page?page=' + $scope.pageIndex + "&per_page=" + $scope.pageSizeSelected,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    // toastr["success"]("Thành công!")
                    $scope.userList = response.data.data.content;
                    $scope.totalCount = response.data.data.totalCount;
                    isSearch = false;
                }else{
                    if(response.status === 202){
                        toastr["error"]("Bạn chưa đăng nhập!")
                    }
                }
            }, function (response) {
                let message = response.data.message;
                let checkMessage = message.localeCompare("Access is denied")
                if(response.status === 500 && $cookies.get('token') && checkMessage === 0){
                    toastr["error"]("Bạn không có quyền truy cập!")
                }else{
                    toastr["error"]("Lỗi rồi!")
                }
            })
    }
    $scope.getUserList();

    //Phương thức này đc gọi từ số phân trang
    $scope.pageChanged = function () {
        if (isSearch) {
            $scope.searchResultList();
        } else {
            $scope.getUserList();
        }
    };

    //Phương thức này đang gọi từ dropDown
    $scope.changePageSize = function () {
        $scope.pageIndex = 1;
        if (isSearch) {
            $scope.searchResultList();
        } else {
            $scope.getUserList();
        }
    }

    //chức năng tìm kiếm
    $scope.searchResultList = function () {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/users/search?searchString=' + $scope.keyBySearch + "&page=" + $scope.pageIndex + "&per_page=" + $scope.pageSizeSelected,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.userList = response.data.data.content;
                    $scope.totalCount = response.data.data.totalCount;
                    isSearch = true;
                }else{
                    if(response.status === 202){
                        toastr["error"]("Bạn chưa đăng nhập!")
                    }
                }
            }, function (response) {
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
    $scope.searchByCode = function () {
        $scope.searchResultList();
    }

    //lấy ra value checkbox
    // let roles = [];
    // $scope.change = function(list, active){
    //     if (active)
    //         roles.push(list);
    //     else
    //         roles.splice(roles.indexOf(list), 1);
    // };

    //xoá
    $scope.removeById = function (id) {
        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/api/v1/users/' + id,
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
                if (response.status === 500 || response.status === 400) {
                    let message = response.data.message;
                    let checkMessage = message.localeCompare("Access is denied")
                    if(response.status === 500 && $cookies.get('token') && checkMessage === 0){
                        toastr["error"]("Bạn không có quyền truy cập!")
                    }else{
                        toastr["error"]("Xoá thất bại!")
                    }
                }
            })
    }
}])
    .controller('addUserController', function ($scope, $http, $cookies, $route, $location) {
        //load list role
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
                }
            }, function (response) {
                let message = response.data.message;
                let checkMessage = message.localeCompare("Access is denied")
                if(response.status === 500 && $cookies.get('token') && checkMessage === 0){
                    toastr["error"]("Bạn không có quyền truy cập!")
                }else{
                    toastr["error"]("Lỗi rồi!")
                }
            })

        //lấy ra value checkbox
        let roleIdList = [];
        $scope.change = function (roleId, active) {
            if (active) {
                roleIdList.push(roleId);
            }
            else
                roleIdList.splice(roleIdList.indexOf(roleId), 1);
        }

        $scope.insertUser = function () {
            let formData = new FormData();
            formData.set('code', $scope.code);
            formData.set('name', $scope.name);
            formData.set('birthday', $scope.birthday);
            formData.set('address', $scope.address);
            formData.set('email', $scope.email);
            formData.set('identifier', $scope.identifier);
            formData.set('fileImg', $scope.myFile);
            formData.set('username', $scope.username);
            formData.set('password', $scope.password);
            formData.set('roleIdList', roleIdList);

            $http(
                {
                    method: 'POST',
                    url: "http://localhost:8080/api/v1/users",
                    data: formData,
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': $cookies.get('token')
                    }
                }
            )
                .then(function (response) {
                    if (response.data.status === 201) {
                        toastr["success"]("Thành công!");
                        $location.path('/user');
                        $route.reload();
                    }else{
                        if(response.status === 202){
                            toastr["error"]("Bạn chưa đăng nhập!")
                        }
                    }
                }, function (response) {
                    if (response.data.status === 400) {
                        toastr["error"](response.data.message);
                    } else {
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
    .controller('editUserController', function ($scope, $http, $cookies, $location, $route, $rootScope) {
        //load list role
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
                }
            }, function (response) {
                let message = response.data.message;
                let checkMessage = message.localeCompare("Access is denied")
                if(response.status === 500 && $cookies.get('token') && checkMessage === 0){
                    toastr["error"]("Bạn không có quyền truy cập!")
                }else{
                    toastr["error"]("Lỗi rồi!")
                }
            })

        //user by id
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/users/' + $rootScope.userId,
            headers: {
                'Authorization': $cookies.get('token')
            }
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.code = response.data.data.code;
                    $scope.name = response.data.data.name;
                    $scope.birthday = response.data.data.birthday;
                    $scope.address = response.data.data.address;
                    $scope.email = response.data.data.email;
                    $scope.username = response.data.data.user_name;
                    $scope.avatarImg = response.data.data.url_avatar;
                    $scope.identifier = response.data.data.identifier;
                }
            }, function (response) {
                let message = response.data.message;
                let checkMessage = message.localeCompare("Access is denied")
                if(response.status === 500 && $cookies.get('token') && checkMessage === 0){
                    toastr["error"]("Bạn không có quyền truy cập!")
                }else{
                    toastr["error"]("Lỗi rồi!")
                }
            })

        //lấy ra value checkbox
        let roleIdList = [];
        $scope.change = function (roleId, active) {
            if (active) {
                roleIdList.push(roleId);
            }
            else
                roleIdList.splice(roleIdList.indexOf(roleId), 1);
        }

        //sửa
        $scope.editByIndex = function (id) {
            let formData = new FormData();
            formData.set('name', $scope.name);
            formData.set('birthday', $scope.birthday);
            formData.set('address', $scope.address);
            formData.set('email', $scope.email);
            formData.set('identifier', $scope.identifier);
            formData.set('password', $scope.password);
            formData.set('roleIdList', roleIdList);
            $http(
                {
                    method: 'PATCH',
                    url: "http://localhost:8080/api/v1/users/" + id,
                    data: formData,
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': $cookies.get('token')
                    }
                }
            )
                .then(function (response) {
                    if (response.data.status === 201) {
                        toastr["success"]("Thành công!");
                        $location.path('/user');
                        $route.reload();
                    }
                }, function (response) {
                    if (response.data.status === 400) {
                        toastr["error"](response.data.message);
                    } else {
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