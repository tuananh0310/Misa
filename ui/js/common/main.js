class Main {
    constructor(){
        // Host url api 
        this.host = "http://localhost:5006/api/v1/";
        // Biến set apiRouter Employees
        this.apiRouter = null;
        // Biến set id là employeeId
        this.id = null;
        // Biến set newEntityCode là Employees/NewEmployeeCode
        this.newEntityCode = null;
        // Mã code của phòng ban:
        this.code = null;
        // Trang hiển thị đầu tiên là 1:
        this.currentPageIndex = 1;
        // Biến tổng số trang:
        this.totalPageEntity = null;
        // Biến để xét khi search dữ liệu:
        this.timer = null;
        this.setApi();
        this.setId();
        this.setNewEntityCode();
        this.setCode();
        this.loadData();
        this.initEvents();
    }
    setApi() {}
    setId() {}
    setNewEntityCode() {}
    setCode() {}
    /**
     * Hàm load dữ liệu 
     * LXTANH (06/07/2022)
     */
    loadData(){
        var _this = this;
        try {
            console.log("LoadData");
            // Làm sạch table:
            $("table tbody").empty();
            // Lấy thông tin số cột thead th:
            var ths = $("table thead th");
            // Show loadding:
            $(".loading-data").show();
            // Xóa focus item select:
            // $('.select-item').removeClass('focus-item');
            // Lấy các thông tin thực hiện phân trang:
            const searchText = $("#txtSearch").val();
            const searchPosition = $("#searchPosition").val();
            const searchDepartment = $("#searchDepartment").val();
            let pageSize = $("#cbxPageSize").data('value');
            if (pageSize == undefined) pageSize = 10;
            const pageNumber = _this.currentPageIndex;
            // Lấy thông tin dữ liệu:
            let apiUrl = `http://localhost:5006/api/v1/Employees?pageSize=${pageSize}&pageNumber=${pageNumber}&code=${searchText}&name=${searchText}&phoneNumber=${searchText}&departmentID=${searchDepartment}&positionID=${searchPosition}`;
            // Gọi ajax lấy dữ liệu về qua API
            $.ajax({
                url: apiUrl,
                method: "GET",
            })
            .done(function(res){
                // Nếu dữ liệu không rỗng
                if(res != undefined) {
                    $.each(res.data, function(index, obj) {
                        var tr = $("<tr></tr>");
                        $(tr).data("elementId",obj[_this.id]);
                        $(tr).data("entityCode",obj[_this.entityCode]);
                        // Lấy thông tin dữ liệu tương ứng với các propertyName trong thẻ th của table:
                        $.each(ths, function (index, th){
                            var td = $("<td></td>");
                            switch (index) {
                                case 0:
                                case ths.length - 1:
                                case ths.length - 2:
                                    break;
                                case 1: 
                                    $(td).append('<input type="checkbox" class ="m-icon-checkbox th-checkbox">');
                                    break
                                case ths.length - 3:
                                    $(td).append(` <div class="edit-employee"><span>Sửa</span></div>
                                    <div class="del-employee"><i class='bx bxs-down-arrow'></i></div>`);
                                    break
                                default:
                                    var nameProperty = $(th).attr("fieldName");
                                    var value = obj[nameProperty];
                                    // format các cột ngày tháng và lương:
                                    if (nameProperty == "dateOfBirth") {
                                        $(td).addClass("text-center");
                                        value = formatDate(value);
                                    } else if (nameProperty == "salary"){
                                        $(td).addClass("text-right");
                                        value = formatSalary(value);
                                    }
                                    $(td).append(value);
                                    break;
                            }
                            $(tr).append(td);
                        });
                        $("table tbody").append(tr);
                    });
                    // Tắt thông báo không có dữ liệu:
                    $('.below-table').hide();
                    // PHẦN PHÂN TRANG
                    // Tính tổng số bản ghi:
                    const totalRecord = res.totalCount;
                    $('.total-record').text(totalRecord);
                    $('.page-size').text(pageSize);
                    // Tính tổng số trang:
                    const totalPage = res.totalPage;
                    _this.totalPageEntity = totalPage;
                    // Xóa hết số trong paging:
                    $(".paging-number").empty();
                    // Css màu text khi trang ở vị trí là 1:
                    if (_this.currentPageIndex == 1){
                        $(".p-left").addClass('color-text');
                    } else {
                        $(".p-left").removeClass('color-text');
                    }
                    // Focus vào item select:
                    let valueItem = $("#cbxPageSize").data('value');
                    if(valueItem == undefined) {valueItem = 10};
                    // $(`#cbxPageSize .item-${valueItem}`).addClass('focus-item');
                    switch (totalPage) {
                        // Trường hợp bản ghi từ 1-4 thì hiển thị đầy đủ
                        case 1: 
                        case 2:
                        case 3:
                        case 4:
                            for(let i=1; i<= totalPage; i++){
                                let buttonHtml = `<div class="navbardivsts__item page-index page-index-${i}" value="${i}">
                                <button class="m-btn-circle">${i}</button>
                            </div>`;
                            $('.paging-number').append(buttonHtml);
                            }    
                            break;
                        // Trường hợp bản ghi từ 5 :
                        default:
                            if(_this.currentPageIndex == 1 || _this.currentPageIndex == 2){
                                // TH1: đang nằm ở trang 1 và 2 sẽ hiển thị trang 1 đến 3:
                                for(let i=1; i<=3; i++){
                                    $('.paging-number').append(`<div class="navbardivsts__item page-index page-index-${i}" value="${i}">
                                    <button class="m-btn-circle"></button>
                                </div>`);
                                    $(`.page-index-${i} .m-btn-circle`).text(i);
                                }
                                // Các trang ở giữa là các dấu chấm:
                                $('.paging-number').append(`<div class='page-index-dot-right'></div>`);
                                $('.page-index-dot-right').text('...');
                                // Hiển thị trang cuối:
                                $('.paging-number').append(`<div class="navbardivsts__item page-index page-index-${totalPage}" value="${totalPage}">
                                <button class="m-btn-circle"></button>
                            </div>`);
                                $(`.page-index-${totalPage} .m-btn-circle`).text(totalPage);
                            } else if ( _this.currentPageIndex == Number(totalPage) - 1 || _this.currentPageIndex == totalPage - 2 || _this.currentPageIndex == totalPage){
                                // TH2: đang nằm ở 3 trang cuối cùng
                                // Hiển thị trang 1
                                $('.paging-number').append(`<div class="navbardivsts__item page-index page-index-1" value="1">
                                    <button class="m-btn-circle"></button>
                                </div>`);
                                $(`.page-index-1 .m-btn-circle`).text(1);
                                // Hiển thị dấu ...
                                $('.paging-number').append(`<div class='page-index-dot-left'></div>`);
                                $('.page-index-dot-left').text('...');
                                // Hiển thị 3 trang cuối
                                for (let i = totalPage - 2; i <= totalPage; i++){
                                    $('.paging-number').append(`<div class="navbardivsts__item page-index page-index-${i}" value="${i}">
                                    <button class="m-btn-circle"></button>
                                </div>`);
                                    $(`.page-index-${i} .m-btn-circle`).text(i);
                                }
                            } else {
                                // TH3: Đang nằm ở các trang từ 3 -> trang thứ 4 từ dưới lên:
                                // Hiển thị trang 1
                                $('.paging-number').append(`<div class="navbardivsts__item page-index page-index-1" value="1">
                                    <button class="m-btn-circle"></button>
                                </div>`);
                                $(`.page-index-1 .m-btn-circle`).text(1);
                                // Hiển thị các dấu ...
                                $('.paging-number').append(`<div class='page-index-dot-left'></div>`);
                                $('.page-index-dot-left').text('...');
                                // Hiển thị trang đang đứng và 2 trang kế tiếp
                                for(let i = _this.currentPageIndex; i<= Number(_this.currentPageIndex) + 2 ;i++){
                                    $('.paging-number').append(`<div class="navbardivsts__item page-index page-index-${i}" value="${i}">
                                    <button class="m-btn-circle"></button>
                                </div>`);
                                    $(`.page-index-${i} .m-btn-circle`).text(i);
                                }
                                // Hiển thị dấu ...
                                $('.paging-number').append(`<div class='page-index-dot-right'></div>`);
                                $('.page-index-dot-right').text('...');
                                // Hiển thị trang cuối cùng:
                                $('.paging-number').append(`<div class="navbardivsts__item page-index page-index-${totalPage}" value="${totalPage}">
                                <button class="m-btn-circle"></button>
                            </div>`);
                                $(`.page-index-${totalPage}  .m-btn-circle`).text(totalPage);
                            }
                            break;
                    }
                    // border cho trang hiện tại
                    $(`.page-index-${_this.currentPageIndex} .m-btn-circle`).addClass("border-index");
                 // ======================================================================================
                } else if (_this.currentPageIndex >= 2){
                    // Xét nếu trường hợp xóa bản ghi cuối cùng của trang mà trang đó lớn hơn 1 thì sẽ nhảy về trang trước đó
                    _this.currentPageIndex = +(_this.curentPageIndex) - 1;
                    _this.loadData();
                } else {
                    // TH hết dữ liệu
                    // Xóa hết tổng số bản ghi
                    $('.total-record').text(0);
                    // Xóa hết phân trang
                    $('.paging-number').empty();
                    // Ẩn paging
                    $('.paging-bar').hide();
                    // Hiển thị thông báo không có dữ liệu
                    $('.below-table').show();
                }
                    
                 // ấn loading
                 $(".loading-data").hide();
                 // console.log("xong hàm");
            })
            .fail(function(res){
                // Nếu fail sẽ nhảy vào đây:
                $(".loading-data").hide();
                console.log(res);
                if(res.status == 400){
                    $('.popup-content .messenger-warning').text(`Dữ liệu đầu vào không hợp lệ`);
                    $('.popup-bot-right').append('<button class="close-popup m-button">Đồng ý</button>')
                    $('#popup').show();
                }
            })
        }
        catch (error) {
            console.log("Lỗi : " + error);
        }
    }
    /**
     * Hàm bắt các sự hiện
     * LXTANH (06/07/2022)
     */
    initEvents(){
        var _this = this;
        // Click vào nút thêm nhân viên để hiển thị dialog
        $('#btn-add-employee').on('click',this.btnAddEmployee.bind(this));

        // Click vào nút hủy để đóng dialog
        $('.cancel-btn').click(this.closeDialog);

        // Click vào dấu X để tắt dialog
        $('#icon-close').click(this.closeDialog);

        // Sự kiện click vào nút hủy để đóng popup
        $('.popup-bottom').on('click', '.close-popup', this.closePopup.bind(this));

        // Load lại dữ liệu khi click vào nút refresh
        $("#refresh").click(this.loadData.bind(this));

        // validate dữ liệu trống
        $("input[required]").blur(this.validateNullValue);

        // Validate Email
        $("input[type='email']").blur(this.validateEmail);

        // Validate Date
        $("input[type='date']").blur(this.validateDate);

        // Validate Phone
        $("input[type='tel']").blur(this.validatePhone);

        // Lưu dữ liệu xuông database khi click vào nút Lưu 
        $('.save-btn').click(this.saveEntity.bind(this));

        // Hiển thị dữ liệu chi tiết khi double click vào từng hàng trong table
        $("table tbody").on("dblclick", "tr", this.dblClickOnTr.bind(this));

        // Click vào nút sửa cột cuối cùng ở table
        $("table tbody ").on("click", ".edit-employee", this.dblClickOnTr.bind(this));

        // Click vào icon cột cuối cùng ở table để hiển thị nút xóa
        $("table tbody ").on("click", ".del-employee", this.showBtnDel.bind(this));

        // Click vào button xóa để hiển thị dialog cảnh báo
        $('.dialog-delete').click(this.delEntity.bind(this));

        // Click vào button Xóa trên popup để xóa nhân viên đang chọn
        $('.popup-bottom').on('click', '#deleteEntity', this.deleteEntity.bind(this));

        // Click vào các index ở phân trang để chuyển trang VD: trang 1,2,3,...
        $(".paging").on("click", ".page-index", this.changeAnyPage.bind(this));

        // Click vào nút Sau để chuyển đến trang kế tiếp
        $(".paging").on("click", ".p-right", this.nextPage.bind(this));

        // Click vào nút trước để chuyển sang trang trước
        $(".paging").on("click", ".p-left" , this.prevPage.bind(this));

        // Click vào icon để hiển thị lựa chọn
        $('.show-select').click(this.showDataSelect);

        // Click vào item để chọn bản ghi
        $('.select-item').click(this.selectItem.bind(this));

        // Click checked vào input ở table thì nó hover cả tr đó
        $('table tbody').on('click', 'input[type="checkbox"]', this.forcusTrClick);

        //  Khi click vào checkbox ở trên th thì sẽ focus tất cả checkbox
        $('table thead').on('click', 'input[type="checkbox"]', this.allCheckBox);

        // Nhập vào ô search thì tự động search
        $('#txtSearch').on('keyup', this.searchTable.bind(this));

        // Click vào ô select phòng ban thì tự động search
        $('#searchDepartment').on('change', this.searchTable.bind(this));

        // Click vào ô vị trí thì tự động search
        $("#searchPosition").on('change', this.searchTable.bind(this));
    }

    /**
     * Hàm hiển thị dialog 
     * LXTANH (07/07/2022)
     */
    btnAddEmployee(e){
        try {
            var _this = this;
            this.formMode = Enum.FormMode.Add;
            e.preventDefault();
            //1. Hiển thị form chi tiết;
            $(".s-dialog").show();
            // Reset form về mặc định
            $('input').val(null);
            //2. Lấy mã nhân viên tự sinh mới từ api và binding vào input mã nhân viên:
            $.ajax({
                url: _this.host + _this.newEntityCode,
                method: "GET",
                success: function (res) {
                    $("#txtEmployeeCode").val(res);
                    //3. Focus vào ô nhập liệu đầu tiên: (Mã nhân viên):
                    $("#txtEmployeeCode").focus();
                },
                error: function(res){}
            });
        } catch (error) {
            console.log("Lỗi: " + error);
        }
    }

    /**
     * Hàm lưu thông tin entity vào csdl
     * LXTANH 07/07/2022
     */
    saveEntity(e){
        try {
            var _this = this
            // Validate dữ liệu
            var inputvalidates = $('input[required]');
            $.each(inputvalidates, function() {
                $(this).trigger("blur");
            });

            var inputNotValidates = $('input[validate="false"]');
            if (inputNotValidates && inputNotValidates.length > 0) {
                $('.popup-content .messenger-warning').text(`Vui lòng nhập đầy đủ các trường thông tin bắt buộc!`);
                $('.popup-bot-right').append('<button class="close-popup m-button">Đồng ý</button>')
                $('#popup').show();
                inputNotValidates[0].focus();
                return;
            }

            // Thu thập thông tin dữ liệu:
            var inputs = $("[propName]");
            // Build thành object
            var entity = {};
            // Duyệt từng input:
           for (const input of inputs) {
            // Lấy ra propertyName:
            const propertyName = $(input).attr("propName");
            // Lấy giá trị tương ứng với propName của đối tượng:
            const value = $(input).val();
            // Gán giá trị cho property tương ứng của đối tượng:
            entity[propertyName] = value;
           }
          
            // tạm thời
           if (entity["salary"] == '') entity["salary"] = 0;
           // nếu không nhập ngày sinh
           if (entity["dateOfBirth"] == '') entity["dateOfBirth"] = null;
           entity["gender"] = Number(entity["gender"]);
           if (entity["identityIssuedDate"] == '') entity["identityIssuedDate"] = null; 
           debugger
           // Sử dụng ajax lưu dữ liệu
           var type = "POST";
           var id = "";
           
           if(_this.formMode == 2) {
            type = "PUT";
            id = _this.entityId;
            
           }

           $.ajax({
                url: _this.host + _this.apiRouter + id,
                method: type,
                data: JSON.stringify(entity),
                contentType: "application/json",

                success: (
                    function(res) {
                        console.log(res);
                        // Hiển thị toast message thông báo thành công:
                        $("#toast__success").show();
                        setTimeout(function() {
                        $("#toast__success").hide();
                        },3000)
                        // Ẩn form chi tiết:
                        $(".s-dialog").hide();
                        // Load lại dữ liệu:
                        _this.loadData();
                    }
                ),
                error: (function(res) {
                    if (res.status == 500) {
                        let input = $('#txtEmployeeCode').val()
                        $('.popup-content .messenger-warning').text(`Mã nhân viên <${input}> đã tồn tại trong hệ thống vui lòng kiểm tra lại.`);
                        $('.popup-bot-right').append('<button class="close-popup m-button">Đồng ý</button>')
                        $('#popup').show();
                    }
                    if (res.status == 400) {
                        $('.popup-content .messenger-warning').text(`Có lỗi xảy ra vui lòng liên hệ MISA`);
                        $('.popup-bot-right').append('<button class="close-popup m-button">Đồng ý</button>')
                        $('#popup').show();
                    }
                })
            });
        } catch (error) {
            console.log("Lỗi:" + error);
        }
    }


    /**
     * Hàm hiển thị thông tin chi tiết khi bouble click vào hàng của bảng danh sách nhân viên
     * LXTANH 08/07/2022
     */

    dblClickOnTr(e){
        try {
            this.formMode = Enum.FormMode.Edit;
            // Hiển thị form chi tiết nhân viên
            $(".s-dialog").show();
            // Xóa hết dữ liệu
            $("input").val(null);
            if($(e.currentTarget).html() == "<span>Sửa</span>"){
                this.entityId = $(e.currentTarget).parents('tr').data("elementId");
            } else {
                this.entityId = $(e.currentTarget).data("elementId");
            }
            this.entityId = "/" + this.entityId;
            $.ajax({
                url: this.host + this.apiRouter + this.entityId,
                method: "GET",
            })
            .done(function(res){
                $("#txtEmployeeCode").focus();
                console.log(res);
                var inputs = $(".s-dialog [propName]");
                $.each(inputs, function(index, input){
                    let property = $(this).attr("propName");
                    let propertyDisplay = $(this).attr("propertyDisplay");
                    let value = res[property];
                    if(propertyDisplay != null) {
                        $(this).val(res[propertyDisplay]);
                    } else {
                        switch (property) {
                            case "dateOfBirth":
                            case "identityDate":
                            case "identityIssuedDate":
                                $(this).val(formatGetDate(value));
                                break;
                            default:
                                $(this).val(value);
                                break;
                        }
                    }
                })
            })
            .fail((res)=>{});
        } catch (error) {
            console.log("Lỗi: " + error);
        }
    }

     /**
     * Hàm hiển thị nút xóa khi click vào icon cột chưc năng
     * LXTANH (08/07/2022)
     */
      showBtnDel(e) {
        var rect = e.currentTarget.getBoundingClientRect();
        this.elementId = $(e.currentTarget).parents('tr').data("elementId");
        this.code = $(e.currentTarget).parents('tr').data("entityCode");
        // console.log(rect.top, rect.right, rect.bottom, rect.left);
        $('.dialog-delete').css('top', rect.top + 20);
        setTimeout(() => {
            $('.dialog-delete').toggle();
        }, 0);
    }

     /**
     * Hàm xóa entity đang chọn
     * LXTANH (08/07/2022)
     */
      deleteEntity() {
        try {
            debugger
            let employeeId = this.elementId;
            if (employeeId != undefined) {
                $.ajax({
                        type: "DELETE",
                        url: this.host + this.apiRouter + "/" + `${employeeId}`,
                    })
                    .done(
                        function(res) {
                            // Ẩn dialog
                            $("#popup").hide();
                            // xóa hết các nút
                            $('.popup-bot-left').empty();
                            $('.popup-bot-right').empty();
                            // Load lại dữ liệu
                            this.loadData();
                            this.entityId = undefined;
                        }.bind(this)
                    )
                    .fail(function(res) {});
            }
        } catch (error) {
            console.log("Lỗi : " + error);
        }
    }

    /**
     * Đóng dialog 
     * LXTA 06/07/2022
     */
     closeDialog() {
        $('.s-dialog').hide();
    }

    /**
     * Đóng popup 
     * LXTANH (07/07/2022)
     */
     closePopup() {
        this.elementId = undefined;
        // Xóa hết các nút
        $('.popup-bot-left').empty();
        $('.popup-bot-right').empty();
        $('#popup').hide();
    }

    /**
     * Hàm click vào trang bất kì để chuyển trang
     * LXTANH (08/07/2022)
     */
    changeAnyPage(e){
        var _this = this;
        _this.currentPageIndex = $(e.currentTarget).attr("value");
        _this.loadData();
    }
    /**
     * Hàm click vào nút Next để chuyển sang trang phía sau
     * LXTANH (08/07/2022)
     */
    nextPage() {
        console.log("da click");
        var _this = this;
        var totalPage = Number(_this.totalPageEntity);
        var pageCurrent = Number(_this.currentPageIndex);
        if (pageCurrent < totalPage) {
            _this.currentPageIndex = pageCurrent + 1;
            _this.loadData();
        }
    }
    /**
     * Hàm Click vào nút Prev để trở về trang phía trước
     * LXTANH (08/07/2022)
     */
    prevPage() {
        console.log("da click");
        var _this = this;
        var pageCurrent = Number(_this.currentPageIndex);
        // Kiểm tra xem nếu trang ở vị trí lớn hơn 1 thì khi click mới chuyển xuống trang thấp hơn
        if(pageCurrent > 1) {
            _this.currentPageIndex = pageCurrent - 1;
            _this.loadData();
        }
    }

    /**
     * Hàm lựa chọn số bản ghi/trang
     * LXTANH 07/07/2022
     */
    selectItem(e){
        // Làm sạch pagesize
        $('#cbxPageSize .select').empty();
        // Ẩn data select
        $('#dataSelect').hide();
        // Lấy giá trị text trong item vừa chọn
        let text = $(e.currentTarget).text();
        // Lấy giá trị value của item hiện tại
        let value = $(e.currentTarget).attr("value");
        // Gán text vào select
        $('#cbxPageSize .select').text(text);
        // Gán value vào data của pagesize
        $("#cbxPageSize").data("value", value);
        // Load lại dữ liệu
        this.loadData();

    }

     /**
     * Hàm hiển thị dialog cảnh báo xóa
     * LXTANH (08/07/2022)
     * 
     */
    delEntity() {
    $('.popup-bottom .popup-bot-left').append('<button class="close-popup m-second-btn">Không</button>');
    $('.popup-bottom .popup-bot-right').append('<button id="deleteEntity" class="m-button">Có</button>');
    $('.popup-content .messenger-warning').text(`Bạn có chắc chắn muốn xóa nhân viên [${this.code}] không?`);
    $('#delEntity').fadeOut();
    $('#popup').show();
    }

    showDataSelect() {
        // Hàm show nó ẩn cmn trước khi vào hàm này rồi 
        setTimeout(() => {
            $('#dataSelect').toggle();
            $('.icon-dropdown').addClass('rotate-icon');
        }, 0);
    }
    /**
     * Hàm click vào checkbox tr td thì hover tr đó
     * LXTANH
     */
    forcusTrClick() {
        // Kiểm tra xem nếu checked == true thì sẽ checked vào tr đó
        if (this.checked) {
            debugger
            // focus cho td cha của nó
            $(this).parents('td').addClass('hover-tr');
            // focus cho những td xung quanh td cha ngoại trừ td đầu và 2 cái cuối
            $(this).parents('td').siblings('td:not(:first-child,:nth-last-child(-n+2))').addClass('hover-tr');
            // focus vào cà thành phần con của cột chức năng
            $(this).parents('td').siblings('td:nth-last-child(3)').children().addClass('hover-tr');
        } else {
            // xóa class hover-tr trong td cha
            $(this).parents('td').removeClass('hover-tr');
            // xóa class hover-tr trong các td xung quanh
            $(this).parents('td').siblings('td').removeClass('hover-tr');
            // xóa class hover-tr cho các phần con của cột chức năng
            $(this).parents('td').siblings('td:nth-last-child(3)').children().removeClass('hover-tr');
        }
    }

    allCheckBox() {
        if (this.checked) { // nếu chưa click vào checkbox
            $('tbody input[type="checkbox"]').each(function() { //lặp tất cả các checkbox
                this.checked = true; //tick tất cả     
                // add class cho tất cả các td
                $('tbody td:not(:first-child,:nth-last-child(-n+2))').addClass('hover-tr');
                $('tbody td:nth-last-child(3)').children().addClass('hover-tr');

            });

        } else {
            $('tbody input[type="checkbox"]').each(function() { //lặp tất cả các checkbox
                this.checked = false; //bỏ tick tất cả 
                // bỏ class hover-tr cho tất cả td
                $('tbody td').removeClass('hover-tr');
                $('tbody td:nth-last-child(3)').children().removeClass('hover-tr');
            });
        }
    }

    /**
     * Hàm thực hiện search trên table
     * LXTANH (09/07/2022)
     */
    searchTable() {
        var _this = this;
        clearTimeout(_this.timer);
        _this.timer = setTimeout(() => {
            _this.loadData();
        },1000)
    }

    /**
     * Hàm khi mình click bên ngoài nút Xóa để ẩn nút xóa
     * LXTANH (09/07/2022)
     */
    clickOutSideDeleteEntity() {
        const popups = [...document.getElementById('delete')];
        window.addEventListener('click', () => {
            console.log("clicked");
            popups.forEach(p => p.classList.remove('show'));
        })
        
    }

    /**
     * Hàm validate required
     * LXTANH (02/07/2022)
     */

    validateNullValue() {
    let value = $(this).val();
    if (value == "") {
        $(this).addClass("input-warning");
        $(this).attr("title", "Trường này không được để trống");
        $(this).attr("validate", "false");
    } else {
        $(this).removeClass("input-warning");
        $(this).removeAttr("title");
        $(this).attr("validate", "true");
    }

    }

    /**
     * Hàm validate
     *  dữ liệu trong ô email
     * LXTANH 02/07/2022
     */
    validateEmail() {
    //lấy giá trị trong input
    let value = $(this).val();
    // nếu giá trị trống thì bỏ qua
    if (!value || !value.length) {
        return;
    }
    var email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.test(value)) {
        $(this).addClass("input-warning");
        $(this).attr("title", "Email không đúng định dạng");
        $(this).attr("validate", "false");
    } else {
        $(this).removeClass("input-warning");
        $(this).attr("validate", "true");
    }
    }

    /**
     * Validate phone number
     * createdBy LXTA 02/07/2022
     */
     validatePhone() {
        //lấy giá trị trong input
        let value = $(this).val();
        // nếu giá trị trống thì bỏ qua
        if (!value || !value.length) {
            return;
        }
        var phone = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/;
        if (!phone.test(value)) {
            $(this).addClass("input-warning");
            $(this).attr("title", "Số điện thoại không đúng định dạng");
            $(this).attr("validate", "false");
        } else {
            $(this).removeClass("input-warning");
            $(this).attr("validate", "true");
        }
    }

     /**
     * Hàm validate dữ liệu ngày tháng
     * LXTANH (07/07/2022)
     */
      validateDate() {
        //Lấy giá trị trong input
        var date = $(this).val();
        // Chuyển đổi giá trị sang kiểu date
        date = new Date(date);
        // Lấy giá trị ngày hiện tại
        var today = new Date()
            // Lấy giá trị ngày hiện tại trừ đi số ngày nhập trong input
            // nếu < 0 là sai
        if (today - date < 0) {
            $(this).addClass("input-warning");
            $(this).attr("title", "Không được lớn hơn ngày hiện tại");
            $(this).attr("validate", "false");
        } else {
            $(this).removeClass("input-warning");
            $(this).attr("validate", "true");
        }

    }
}