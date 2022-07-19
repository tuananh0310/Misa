/**
 * Hàm chuyển đổi dữ liệu ngày tháng
 * createdBy: LXTANH 06/07/2022
 * @param {*} value trả về kiểu dữ liệu bất kì
 * @returns
 */
 function formatDate(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    } else {
        var day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();
        day = day < 10 ? "0" + day : day;
        month = month < 10 ? "0" + month : month;
        return day + "/" + month + "/" + year;
    }
}
/**
 * Hàm chuyển đổi dữ liệu ngày tháng để hieent thị ra
 * createdBy: LXTANH 06/07/2022
 * @param {*} value trả về kiểu dữ liệu bất kì
 * @returns
 */
function formatGetDate(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    } else {
        var day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();
        day = day < 10 ? "0" + day : day;
        month = month < 10 ? "0" + month : month;
        return year + "-" + month + "-" + day;
    }
}

/**
 * Hàm format tiền
 * createdBy LXTANH 06/07/2022
 * @param {*} value trả về kiểu bất kì
 * @returns
 */

function formatSalary(salary) {
    salary = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary);
    return salary
 }
 



