angular.module('AdminApp', [])
    .controller('AdminController', function($scope) {
        $scope.title = "Users list";
        $scope.users = [
            { name: 'guy', permissions: 'admin' },
            { name: 'avior', permissions: 'editor' },
            { name: 'fill', permissions: 'editor' },
            { name: 'voicespin', permissions: 'admin' },
            { name: '11', permissions: 'admin' }
        ];
        $scope.permissionOptions = ['editor', 'admin'];
        $scope.nameLabel = 'Name';
        $scope.permissionsLabel = 'Permissions';
        $scope.actionsLabel = 'Actions';

        $scope.addUser = function() {
            for (var index in $scope.users) {
                $scope.users[index].editing = false;
            }
            var newUser = {};
            newUser.name = 'new user';
            newUser.permissions = 'editor';
            newUser.editing = true;
            $scope.users.push(newUser);
        };

        $scope.editUser = function(rowIndex) {
            console.log('editing ' + rowIndex);
            for (var index in $scope.users) {
                $scope.users[index].editing = (index == rowIndex);
            }
        };

        $scope.doneEditing = function(rowIndex) {
            console.log('done editing ' + rowIndex);
            $scope.users[rowIndex].editing = false;
        };

        $scope.deleteUser = function(rowIndex) {
            console.log('removing ' + rowIndex);
            if (confirm(`Are you sure you want to delete user ${$scope.users[rowIndex].name}?`)) {
                $scope.users.splice(rowIndex, 1);
            }
        };
    }).directive('focused', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(attrs.focused, function(focusVal) {
                    $timeout(function() {
                        focusVal ? element[0].focus() :
                            element[0].blur();
                    });
                });
            }
        }
    });