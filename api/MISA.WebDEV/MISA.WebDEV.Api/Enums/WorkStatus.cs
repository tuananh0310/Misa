namespace MISA.WebDEV.Api.Enums
{
    /// <summary>
    /// Tình trạng làm việc
    /// </summary>
    public enum WorkStatus
    {   
        /// <summary>
        /// Chưa Làm việc
        /// </summary>
        NotWork = 0,
        /// <summary>
        /// Đang làm việc
        /// </summary>
        CurrentlyWorking = 1,
        /// <summary>
        /// Ngừng làm việc
        /// </summary>
        StopWork = 2,
        /// <summary>
        /// Đã nghỉ việc
        /// </summary>
        Retired = 3
    }
}
