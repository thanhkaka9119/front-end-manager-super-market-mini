var storeApp = angular.module('storeApp', ['ngRoute','ngCookies','ui.bootstrap']);

storeApp.controller('homeController',function($scope,$http,$cookies,$location){
    if($cookies.get('token')){
        $scope.isBtnLogin = false;
        $scope.isExit = true;
    }else{
        $scope.isBtnLogin = true;
        $scope.isExit = false;
    }

   $scope.btnLogin = function(){
    $scope.isFormLogin = true;
   }

   $scope.login = function(){
    let loginData = {
            username: $scope.usernameLogin,
            password: $scope.passwordLogin
        }
        $http({
            method: 'POST',
            url: 'http://localhost:8080/api/v1/login',
            data: JSON.stringify(loginData)
        })
        .then(function(response){
            if(response.data.status === 201){
                toastr["success"]("Đăng nhập thành công!")
                let now = new Date();
                let time = now.getTime();
                let expireTime = time + 120000;
                now.setTime(expireTime);
                $cookies.put('token',response.data.data.token, {'expires': now});
                $cookies.put('userId',response.data.data.id, {'expires': now});
                $scope.isFormLogin = false;
                $scope.isBtnLogin = false;
                $scope.isExit = true;
                // $location.path('/');
            }else{
                toastr["error"]("Đăng nhập thất bại!")
                $scope.isFormLogin = true;
                $scope.isBtnLogin = true;
            }
        })
   }

   $scope.exit = function(){
    $cookies.remove('token');
    $scope.isBtnLogin = true;
    $scope.isExit = false;
    $location.path('/');
   }

})

storeApp.config(['$routeProvider',function($routeProvider){
    $routeProvider.when('/',{
        templateUrl: "view/home.html"
    })
    .when('/product',{
        templateUrl: "view/product/productForm.html",
        controller: "productController"
    })
    .when('/product/add',{
        templateUrl: "view/product/addForm.html",
        controller: "addProductController"
    })
    .when('/product/edit',{
        templateUrl: "view/product/editForm.html",
        controller: "editProductController"
    })
    .when('/user',{
        templateUrl: "view/user/userForm.html",
        controller: "userController"
    })
    .when('/user/add',{
        templateUrl: "view/user/addForm.html",
        controller: "addUserController"
    })
    .when('/user/edit',{
        templateUrl: "view/user/editForm.html",
        controller: "editUserController"
    })
    .when('/category',{
        templateUrl: "view/category/categoryForm.html",
        controller: "categoryController"
    })
    .when('/category/add',{
        templateUrl: "view/category/addForm.html",
        controller: "addController"
    })
    .when('/category/edit',{
        templateUrl: "view/category/editForm.html",
        controller: "editController"
    })
    .when('/role',{
        templateUrl: "view/role/roleForm.html",
        controller: "roleController"
    })
    .when('/role/add',{
        templateUrl: "view/role/addForm.html",
        controller: "addRoleController"
    })
    .when('/role/edit',{
        templateUrl: "view/role/editForm.html",
        controller: "editRoleController"
    })
    .when('/order',{
        templateUrl: "view/order/orderForm.html",
        controller: "orderController"
    })
    .when('/order/add',{
        templateUrl: "view/order/addForm.html",
        controller: "addOrderController"
    })
    .when('/order/edit',{
        templateUrl: "view/order/editForm.html",
        controller: "editOrderController"
    })
    .otherwise({
        redirectTo: '/'
    })
}]);