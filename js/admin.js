// Controlllers

/**
 * Controller for the adm-user-edit component
 *
 */
class AdmUserEditCtrl {

    constructor($mdDialog, users, i18n, permissionOptions) {
        this.permissionOptions = permissionOptions;
        this.users = users;
        this.$mdDialog = $mdDialog;
        this.i18n = i18n;
    }

    setForm(form) {
        this.form = form;
    }

    save() {
        if (typeof this.rowIndex === 'undefined') { // create
            this.users.push({ name: this.name, permissions: this.permissions });
        } else { // update
            this.users[this.rowIndex] = { name: this.name, permissions: this.permissions };
        }
        this.$mdDialog.hide();
    }

    cancel() {
        this.$mdDialog.hide();
    }

    checkDuplicate(input) {
        this.form.name.$setValidity('duplicate', this.users.map(({name}) => name).indexOf(this.name) === -1);
    }

    static get $inject() {
        return ['$mdDialog', 'users', 'i18n', 'permissionOptions'];
    }
}

/**
 * Controller for the adm-entity-grid component
 *
 */
class AdmEntityGridCtrl {

    constructor(users, i18n) {
        this.users = users;
        this.i18n = i18n;
    }

    static get $inject() {
        return ['users', 'i18n'];
    }
}


/**
 * Controller for the adm-add-button component
 *
 */
class AdmAddButtonCtrl {

    constructor($mdDialog, users) {
        this.$mdDialog = $mdDialog;
        this.users = users;
    }

    addUser() {
        this.$mdDialog.show({
            template: `<adm-user-edit permissions='editor'></adm-user-edit>`,
            parent: angular.element(document.body),
            preserveScope: true,
            clickOutsideToClose: true
        });
    }

    static get $inject() {
        return [
            '$mdDialog', 'users'
        ];
    }
}

/**
 * Controller for the adm-entity-action-buttons component
 *
 */
class AdmEntityActionButtonsCtrl {

    constructor($mdDialog, users) {
        this.$mdDialog = $mdDialog;
        this.users = users;
    }

    editUser() {
        this.$mdDialog.show({
            template: `<adm-user-edit 
                                name='${this.users[this.rowIndex].name}' 
                                permissions='${this.users[this.rowIndex].permissions}'
                                row-index='${this.rowIndex}'>
                            </adm-user-edit>`,
            parent: angular.element(document.body),
            preserveScope: true,
            clickOutsideToClose: true
        });
    }

    deleteUser() {
        if (confirm(`Are you sure you want to delete user ${this.users[this.rowIndex].name}?`)) {
            this.users.splice(this.rowIndex, 1);
        }
    }

    static get $inject() {
        return [
            '$mdDialog', 'users'
        ];
    }
}

// Components

/**
 * adm-entity-header component. It displays title for the adm-entity-grid.
 * Attributes:
 * text - The text to display in header.
 *
 */
const admEntityHeader = {
    bindings: {
        text: '@'
    },
    template: `
        <h3 class='adm-title'>{{admEntityHeaderCtrl.text}}</h3>
    `,
    controllerAs: 'admEntityHeaderCtrl'
};

/**
 * adm-user-edit component. It displays the dialog for adding or updating the user data.
 * Attributes:
 * name - The user name. For newly created user the name is initially displayed empty.
 * permissions - The user role. Can be either 'editor' (default) or 'admin'.
 * rowIndex - The record index in model. It is only valid for updating an existing user.
 *            For newly created user it should not be defined.
 *
 */
const admUserEdit = {
    bindings: {
        name: '@',
        permissions: '@',
        rowIndex: '@'
    },
    template: `
        <form name='admUserForm'>
            <md-dialog-content class='adm-dialog-content' md-theme='default' ng-init='admUserEditCtrl.setForm(admUserForm)'>
            <md-list>
                <md-input-container class='adm-input'>
                    <label>{{admUserEditCtrl.i18n.en.adm.name}}</label>
                    <input type='text' name='name' ng-change='admUserEditCtrl.checkDuplicate(this)' ng-model='admUserEditCtrl.name' required>
                     <div class='adm-red' ng-show='admUserForm.name.$error.duplicate'>Such name already exists!</div>
                    <div class='adm-red' ng-show='admUserForm.name.$error.required'>This field can not be empty!</div>                
                </md-input-container>
                <md-input-container class='adm-input'>
                    <label>{{admUserEditCtrl.i18n.en.adm.permissions}}</label>
                    <md-select ng-model='admUserEditCtrl.permissions'> 
                        <md-option ng-repeat='permissions in admUserEditCtrl.permissionOptions' ng-value='permissions'>{{permissions}}</md-option>
                    </md-select>
                </md-input-container>
            </md-list>
            </md-dialog-content>
            <md-dialog-actions align='end'>
                <md-button id='modal-save-button' dialog-close ng-disabled='admUserForm.$invalid' ng-click='admUserEditCtrl.save()' class='md-button md-confirm-button' md-autofocus='true'>
                    Save
                </md-button>
                <md-button id='modal-cancel-btn' md-dialog-close ng-click='admUserEditCtrl.cancel()' class='md-button md-cancel-button'>
                    Cancel
                </md-button>
            </md-dialog-actions>
        </form>
    `,
    controllerAs: 'admUserEditCtrl',
    controller: AdmUserEditCtrl
};

/**
 * adm-entity-grid component. This is the table containing the user records.
*/
const admEntityGrid = {
    bindings: {},
    template: `
        <form name='adminForm'>
            <table class='table table-bordered table-striped adm-table'>
                <thead>
                    <tr>
                        <th>{{admEntityGridCtrl.i18n.en.adm.name}}</th>
                        <th>{{admEntityGridCtrl.i18n.en.adm.permissions}}</th>
                        <th>{{admEntityGridCtrl.i18n.en.adm.actions}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr ng-repeat='user in admEntityGridCtrl.users track by $index'>
                        <td><span class='adm-cell'>{{ user.name }}</span></td>
                        <td><span class='adm-cell'>{{ user.permissions }}</span></td>
                        <td class='text-center'>
                            <adm-entity-action-buttons row-index='$index'></adm-entity-action-buttons>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    `,
    controllerAs: 'admEntityGridCtrl',
    controller: AdmEntityGridCtrl

};

/**
 * adm-add-button component. It displays the button for adding a record to the table.
 *
 */
const admAddButton = {
    bindings: {},
    template: `
        <button ng-click='admAddButtonCtrl.addUser()' class='btn adm-add-btn adm-green-bg adm-white pull-right'>
            <span class='glyphicon glyphicon-plus'></span>
        </button>
    `,
    controllerAs: 'admAddButtonCtrl',
    controller: AdmAddButtonCtrl


};

/**
 * adm-entity-action-buttons component. It contains the buttons for editing and deleting the
 * particular data row.
 * Attributes:
 * rowIndex - The index of the data row in model.
 *
 */
const admEntityActionButtons = {
    template: `
        <div>
           <button ng-click='admEntityActionButtonsCtrl.editUser()' class='adm-action-btn adm-blue-bg adm-white'>
            <span class='glyphicon glyphicon-cog'></span>
           </button>
           <button ng-click='admEntityActionButtonsCtrl.deleteUser()' class='adm-action-btn adm-red-bg adm-white'>
            <span class='glyphicon glyphicon-remove-circle'></span>
           </button>
        </div>
    `,
    bindings: {
        rowIndex: '<'
    },
    controllerAs: 'admEntityActionButtonsCtrl',
    controller: AdmEntityActionButtonsCtrl
};

/**
 * users is a dummy data for model.
 *
 */
const users = [
    { name: 'guy', permissions: 'admin' },
    { name: 'avior', permissions: 'editor' },
    { name: 'fill', permissions: 'editor' },
    { name: 'voicespin', permissions: 'admin' },
    { name: '11', permissions: 'admin' }
];

/**
 * permissionOptions contain the possible values for the user role.
 *
 */
const permissionOptions = ['editor', 'admin'];

/**
 * i18n is the resource bundle simulation.
 *
 */
const i18n = {
    en: {
        adm: {
            name: 'Name',
            permissions: 'Permissions',
            actions: 'Actions'
        }
    }
};

// Putting all parts together
angular.module('AdminApp', ['ngMaterial'])
    .value('users', users)
    .value('i18n', i18n)
    .value('permissionOptions', permissionOptions)
    .component('admEntityHeader', admEntityHeader)
    .component('admEntityGrid', admEntityGrid)
    .component('admUserEdit', admUserEdit)
    .component('admAddButton', admAddButton)
    .component('admEntityActionButtons', admEntityActionButtons);