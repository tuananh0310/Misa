﻿using Dapper;
using Microsoft.AspNetCore.Mvc;
using MISA.WebDEV.Api.Entities;
using MISA.WebDEV.Api.Entities.DTO;
using MySqlConnector;

namespace MISA.WebDEV.Api.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        /// <summary>
        /// API Thêm mới 1 nhân viên
        /// </summary>
        /// <param name="employee">Đối tượng nhân viên muốn thêm mới</param>
        /// <returns>ID của nhân viên vừa thêm mới</returns>
        /// Created by: LXTANH (11/07/2022)
        [HttpPost]
        public IActionResult InsertEmployee([FromBody] Employee employee)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=3.0.89.182;Port=3306;Database=WDT.2022.LXTANH;Uid=dev;Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(connectionString);
                // Chuẩn bị câu lệnh INSERT INTO
                string insertCommand = " INSERT INTO employee(EmployeeID, EmployeeCode, EmployeeName, Gender, DateOfBirth, IdentityNumber, IdentityIssuedPlace, IdentityIssuedDate, Email, PhoneNumber, PositionID, DepartmentID, TaxCode, Salary, JoiningDate, WorkStatus, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy) " +
                        " VALUES(@EmployeeID, @EmployeeCode, @EmployeeName, @Gender, @DateOfBirth, @IdentityNumber, @IdentityIssuedPlace, @IdentityIssuedDate, @Email, @PhoneNumber, @PositionID, @DepartmentID, @TaxCode, @Salary, @JoiningDate, @WorkStatus, @CreatedDate, @CreatedBy, @ModifiedDate, @ModifiedBy); ";
                // Chuẩn bị tham số đầu vào cho câu lệnh INSERT INTO
                var dateTimeNow = DateTime.Now;
                var employeeID = Guid.NewGuid();

                var parameters = new DynamicParameters();
                parameters.Add("@EmployeeID", employeeID);
                parameters.Add("@EmployeeCode", employee.EmployeeCode);
                parameters.Add("@EmployeeName", employee.EmployeeName);
                parameters.Add("@DateOfBirth", employee.DateOfBirth);
                parameters.Add("@Gender", employee.Gender);
                parameters.Add("@IdentityNumber", employee.IdentityNumber);
                parameters.Add("@IdentityIssuedPlace", employee.IdentityIssuedPlace);
                parameters.Add("@IdentityIssuedDate", employee.IdentityIssuedDate);
                parameters.Add("@Email", employee.Email);
                parameters.Add("@PhoneNumber", employee.PhoneNumber);
                parameters.Add("@PositionID", employee.PositionID);
                parameters.Add("@DepartmentID", employee.DepartmentID);
                parameters.Add("@TaxCode", employee.TaxCode);
                parameters.Add("@Salary", employee.Salary);
                parameters.Add("@JoiningDate", employee.JoiningDate);
                parameters.Add("@WorkStatus", employee.WorkStatus);
                parameters.Add("@CreatedDate", dateTimeNow);
                parameters.Add("@CreatedBy", employee.CreatedBy);
                parameters.Add("@ModifiedDate", dateTimeNow);
                parameters.Add("@ModifiedBy", employee.ModifiedBy);
                // Thực hiện gọi vào DB để chạy câu lệnh INSERT INTO với tham số đầu vào ở trên
                var affectedRows = mySqlConnection.Execute(insertCommand, parameters);

                // Xử lí kết quả trả về từ DB
                if (affectedRows > 0)
                {
                    // Trả về dữ liệu cho Client
                    return StatusCode(StatusCodes.Status201Created, new GuidString()
                    {
                        StringResult = employeeID
                    }); 
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }

            catch (MySqlException mySqlException)
            {
                // TODO: Sau này có thể bổ sung log lỗi ở đây để khi gặp exception trace lỗi cho dễ
                if (mySqlException.ErrorCode == MySqlErrorCode.DuplicateKeyEntry)
                {
                    return StatusCode(500, "e003");
                }
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }

            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }

        }

        /// <summary>
        /// API Sửa 1 nhân viên
        /// </summary>
        /// <param name="employeeID">ID của nhân viên muốn sửa</param>
        /// <param name="employee">Đối tượng nhân viên muốn sửa</param>
        /// <returns>ID của nhân viên vừa sửa</returns>
        /// Created by: LXTANH (12/07/2022)
        [HttpPut("{employeeID}")]
        public IActionResult UpdateEmployee([FromRoute] Guid employeeID, [FromBody] Employee employee)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=3.0.89.182;Port=3306;Database=WDT.2022.LXTANH;Uid=dev;Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị câu lệnh UPDATE
                string updateEmployeeCommand = "UPDATE employee " +
                    "SET EmployeeCode = @EmployeeCode, " +
                    "EmployeeName = @EmployeeName, " +
                    "DateOfBirth = @DateOfBirth, " +
                    "Gender = @Gender, " +
                    "IdentityNumber = @IdentityNumber, " +
                    "IdentityIssuedPlace = @IdentityIssuedPlace, " +
                    "IdentityIssuedDate = @IdentityIssuedDate, " +
                    "Email = @Email, " +
                    "PhoneNumber = @PhoneNumber, " +
                    "PositionID = @PositionID, " +
                    "DepartmentID = @DepartmentID, " +
                    "TaxCode = @TaxCode, " +
                    "Salary = @Salary, " +
                    "JoiningDate = @JoiningDate, " +
                    "WorkStatus = @WorkStatus, " +
                    "ModifiedDate = @ModifiedDate, " +
                    "ModifiedBy = @ModifiedBy " +
                    "WHERE EmployeeID = @EmployeeID;";

                // Chuẩn bị tham số đầu vào cho câu lệnh UPDATE
                var parameters = new DynamicParameters();
                parameters.Add("@EmployeeID", employeeID);
                parameters.Add("@EmployeeCode", employee.EmployeeCode);
                parameters.Add("@EmployeeName", employee.EmployeeName);
                parameters.Add("@DateOfBirth", employee.DateOfBirth);
                parameters.Add("@Gender", employee.Gender);
                parameters.Add("@IdentityNumber", employee.IdentityNumber);
                parameters.Add("@IdentityIssuedPlace", employee.IdentityIssuedPlace);
                parameters.Add("@IdentityIssuedDate", employee.IdentityIssuedDate);
                parameters.Add("@Email", employee.Email);
                parameters.Add("@PhoneNumber", employee.PhoneNumber);
                parameters.Add("@PositionID", employee.PositionID);
                parameters.Add("@DepartmentID", employee.DepartmentID);
                parameters.Add("@TaxCode", employee.TaxCode);
                parameters.Add("@Salary", employee.Salary);
                parameters.Add("@JoiningDate", employee.JoiningDate);
                parameters.Add("@WorkStatus", employee.WorkStatus);
                parameters.Add("@ModifiedDate", employee.ModifiedDate);
                parameters.Add("@ModifiedBy", employee.ModifiedBy);

                // Thực hiện gọi vào DB để chạy câu lệnh UPDATE với tham số đầu vào ở trên
                int numberOfAffectedRows = mySqlConnection.Execute(updateEmployeeCommand, parameters);

                // Xử lý kết quả trả về từ DB
                if (numberOfAffectedRows > 0)
                {
                    // Trả về dữ liệu cho client
                    return StatusCode(StatusCodes.Status200OK, new GuidString()
                    {
                        StringResult = employeeID
                    });
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }

            }
            catch (MySqlException mySqlException)
            {
                // TODO: Sau này có thể bổ sung log lỗi ở đây để khi gặp exception trace lỗi cho dễ
                if (mySqlException.ErrorCode == MySqlErrorCode.DuplicateKeyEntry)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e003");
                }

                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
            catch (Exception exception)
            {
                // TODO: Sau này có thể bổ sung log lỗi ở đây để khi gặp exception trace lỗi cho dễ
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API Xóa 1 nhân viên
        /// </summary>
        /// <param name="employeeID">ID của nhân viên muốn xóa</param>
        /// <returns>ID của nhân viên vừa xóa</returns>
        /// Created by: LXTANH (12/07/2022)
        [HttpDelete("{employeeID}")]
        public IActionResult DeleteEmployeeByID([FromRoute] Guid employeeID)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=3.0.89.182;Port=3306;Database=WDT.2022.LXTANH;Uid=dev;Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị câu lệnh DELETE
                string deleteEmployeeCommand = "DELETE FROM employee WHERE EmployeeID = @EmployeeID";

                // Chuẩn bị tham số đầu vào cho câu lệnh DELETE
                var parameters = new DynamicParameters();
                parameters.Add("@EmployeeID", employeeID);

                // Thực hiện gọi vào DB để chạy câu lệnh DELETE với tham số đầu vào ở trên
                int numberOfAffectedRows = mySqlConnection.Execute(deleteEmployeeCommand, parameters);

                // Xử lý kết quả trả về từ DB
                if (numberOfAffectedRows > 0)
                {
                    // Trả về dữ liệu cho client
                    return StatusCode(StatusCodes.Status200OK, employeeID);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (Exception exception)
            {
                // TODO: Sau này có thể bổ sung log lỗi ở đây để khi gặp exception trace lỗi cho dễ
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API Lấy danh sách nhân viên cho phép lọc và phân trang
        /// </summary>
        /// <param name="code">Mã nhân viên</param>
        /// <param name="name">Tên nhân viên</param>
        /// <param name="phoneNumber">Số điện thoại</param>
        /// <param name="positionID">ID vị trí</param>
        /// <param name="departmentID">ID phòng ban</param>
        /// <param name="pageSize">Số trang muốn lấy</param>
        /// <param name="pageNumber">Thứ tự trang muốn lấy</param>
        /// <returns>Một đối tượng gồm:
        /// + Danh sách nhân viên thỏa mãn điều kiện lọc và phân trang
        /// + Tổng số nhân viên thỏa mãn điều kiện</returns>
        /// Created by: LXTANH (13/07/2022)
        [HttpGet]

        public IActionResult FilterEmployees([FromQuery] string? code, [FromQuery] string? name, [FromQuery] string? phoneNumber,
            [FromQuery] Guid? positionID, [FromQuery] Guid? departmentID, [FromQuery] int pageSize = 10, [FromQuery] int pageNumber = 1)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=3.0.89.182;Port=3306;Database=WDT.2022.LXTANH;Uid=dev;Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên Stored procedure
                string storedProcedureName = "Proc_Employee_GetPaging";

                // Chuẩn bị tham số đầu vào cho stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("@$Skip", (pageNumber - 1) * pageSize);
                parameters.Add("@$Take", pageSize);
                parameters.Add("@$Sort", "EmployeeCode DESC");

                var whereConditions = new List<string>();
                var whereConditionsDePos = new List<string>();
                if (code != null)
                {
                    whereConditions.Add($"EmployeeCode LIKE '%{code}%'");
                }
                if (name != null)
                {
                    whereConditions.Add($"EmployeeName LIKE '%{name}%'");
                }
                if (phoneNumber != null)
                {
                    whereConditions.Add($"PhoneNumber LIKE '%{phoneNumber}%'");
                }
                if (positionID != null)
                {
                    whereConditions.Add($"PositionID LIKE '%{positionID}%'");
                }
                if (departmentID != null)
                {
                    whereConditions.Add($"DepartmentID LIKE '%{departmentID}%'");
                }
                string whereClause = string.Join(" OR ", whereConditions);
                string whereClauseDePos = string.Join(" AND ", whereConditionsDePos);
                string sqlResult = whereClause;
                if (whereClauseDePos.Length > 0 && sqlResult.Length > 0)
                {
                    sqlResult = $"({sqlResult})  AND  {whereClauseDePos}";
                }
                else
                {
                    sqlResult = $"{whereClauseDePos}";
                }

                parameters.Add("@$Where", sqlResult);

                // Thực hiện gọi vào DB để chạy stored procedure với tham số đầu vào ở trên
                var multipleResults = mySqlConnection.QueryMultiple(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);

                // Xử lý kết quả trả về từ DB
                if (multipleResults != null)
                {
                    var employees = multipleResults.Read<Employee>();
                    var totalCount = multipleResults.Read<long>().Single();
                    return StatusCode(StatusCodes.Status200OK, new PagingData<Employee>()
                    {
                        TotalPage = Convert.ToInt32(totalCount/ pageSize),
                        Data = employees.ToList(),
                        TotalCount = totalCount
                    });
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API Lấy thông tin chi tiết của 1 nhân viên
        /// </summary>
        /// <param name="employeeID">ID của nhân viên muốn lấy thông tin chi tiết</param>
        /// <returns>Đối tượng nhân viên muốn lấy thông tin chi tiết</returns>
        /// Created by: LXTANH (12/07/2022)
        [HttpGet("{employeeID}")]
      
        public IActionResult GetEmployeeByID([FromRoute] Guid employeeID)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=3.0.89.182;Port=3306;Database=WDT.2022.LXTANH;Uid=dev;Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên Stored procedure
                string storedProcedureName = "Proc_Employee_GetByEmployeeID";

                // Chuẩn bị tham số đầu vào cho stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("@$EmployeeID", employeeID);

                // Thực hiện gọi vào DB để chạy stored procedure với tham số đầu vào ở trên
                var employee = mySqlConnection.QueryFirstOrDefault<Employee>(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);

                // Xử lý kết quả trả về từ DB
                if (employee != null)
                {
                    return StatusCode(StatusCodes.Status200OK, employee);
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound);
                }
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
       
        }
        /// <summary>
        /// API Lấy mã nhân viên mới tự động tăng
        /// </summary>
        /// <returns>Mã nhân viên mới tự động tăng</returns>
        /// Created by: LXTANH (13/07/2022)
        [HttpGet("new-code")]
        public IActionResult GetNewEmployeeCode()
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=3.0.89.182;Port=3306;Database=WDT.2022.LXTANH;Uid=dev;Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên stored procedure
                string storedProcedureName = "Proc_Employee_GetMaxCode";

                // Thực hiện gọi vào DB để chạy stored procedure ở trên
                string maxEmployeeCode = mySqlConnection.QueryFirstOrDefault<string>(storedProcedureName, commandType: System.Data.CommandType.StoredProcedure);

                // Xử lý sinh mã nhân viên mới tự động tăng
                // Cắt chuỗi mã nhân viên lớn nhất trong hệ thống để lấy phần số
                // Mã nhân viên mới = "NV" + Giá trị cắt chuỗi ở  trên + 1
                string newEmployeeCode = "NV" + (Int64.Parse(maxEmployeeCode.Substring(2)) + 1).ToString();

                // Trả về dữ liệu cho client
                return StatusCode(StatusCodes.Status200OK, newEmployeeCode);
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }
    }
}
