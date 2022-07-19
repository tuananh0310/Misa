$(document).ready(function(event) {
    new EmployeeJS();
});

class EmployeeJS extends Main {
    constructor() {
        super()
    }

    setApi() {
        this.apiRouter = 'Employees';
    }
    setId() {
        this.id = 'employeeID';
    }
    setCode() {
        this.entityCode = 'employeeCode';
    }
    setNewEntityCode() {
        this.newEntityCode = 'Employees/new-code';
    }


}